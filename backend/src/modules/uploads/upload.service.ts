import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { env } from "../../config/env";
import { circuitBreakers } from "../../utils/circuit-breaker.util";
import { ValidationError } from "../../utils/error.util";
import { logger } from "../../utils/logger.util";
import { retry } from "../../utils/retry.util";
import { UploadServiceInterface } from "./upload.interface";

// Configure Cloudinary
if (env.STORAGE_PROVIDER === "cloudinary") {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export class UploadService implements UploadServiceInterface {
  /**
   * Upload file to configured storage provider
   * Supports: AWS S3, Cloudinary, or local storage
   */
  async uploadFile(
    file:
      | Express.Multer.File
      | { buffer: Buffer; mimetype: string; size: number; originalname: string }
  ): Promise<string> {
    if (!file || !("buffer" in file)) {
      throw new ValidationError("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ValidationError(
        `File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new ValidationError(
        `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
      );
    }

    const storageProvider = env.STORAGE_PROVIDER;

    try {
      switch (storageProvider) {
        case "s3":
          return await this.uploadToS3(file as Express.Multer.File);
        case "cloudinary":
          return await this.uploadToCloudinary(file as Express.Multer.File);
        case "local":
          throw new ValidationError(
            "Local storage is not supported in production. " +
              "Please configure AWS S3 or Cloudinary by setting STORAGE_PROVIDER environment variable."
          );
        default:
          throw new ValidationError(
            `Unsupported storage provider: ${storageProvider}`
          );
      }
    } catch (error) {
      logger.error("File upload failed", {
        provider: storageProvider,
        filename: file.originalname,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Upload to AWS S3
   */
  private async uploadToS3(file: Express.Multer.File): Promise<string> {
    if (
      !env.AWS_ACCESS_KEY_ID ||
      !env.AWS_SECRET_ACCESS_KEY ||
      !env.AWS_S3_BUCKET
    ) {
      throw new ValidationError(
        "AWS S3 credentials not configured. " +
          "Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET environment variables."
      );
    }

    try {
      // Optimize image before upload
      const optimizedBuffer = await this.optimizeImage(file);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.originalname.split(".").pop() || "jpg";
      const filename = `uploads/${timestamp}-${randomString}.${extension}`;

      // Initialize S3 client
      const s3Client = new S3Client({
        region: env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });

      // Upload to S3 with circuit breaker and retry
      await circuitBreakers.storage.execute(
        async () => {
          const uploadCommand = new PutObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: filename,
            Body: optimizedBuffer,
            ContentType: file.mimetype,
            CacheControl: "max-age=31536000", // 1 year cache
            ACL: "public-read",
          });

          await retry(
            async () => {
              await s3Client.send(uploadCommand);
            },
            {
              maxAttempts: 3,
              delay: 1000,
              backoff: "exponential",
            }
          );
        },
        async () => {
          throw new ValidationError(
            "File upload service is temporarily unavailable. Please try again later."
          );
        }
      );

      // Return public URL
      const publicUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`;

      logger.info("File uploaded to S3", {
        filename,
        size: optimizedBuffer.length,
        url: publicUrl,
      });

      return publicUrl;
    } catch (error) {
      logger.error("S3 upload failed", {
        error: error instanceof Error ? error.message : String(error),
        filename: file.originalname,
      });
      throw new ValidationError(
        `Failed to upload file to S3: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Upload to Cloudinary
   */
  private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    if (
      !env.CLOUDINARY_CLOUD_NAME ||
      !env.CLOUDINARY_API_KEY ||
      !env.CLOUDINARY_API_SECRET
    ) {
      throw new ValidationError(
        "Cloudinary credentials not configured. " +
          "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
      );
    }

    try {
      // Optimize image before upload
      const optimizedBuffer = await this.optimizeImage(file);

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "valuva/uploads",
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed"));
          }
        );
        uploadStream.end(optimizedBuffer);
      });

      logger.info("File uploaded to Cloudinary", {
        publicId: result.public_id,
        url: result.secure_url,
        size: result.bytes,
      });

      return result.secure_url;
    } catch (error) {
      logger.error("Cloudinary upload failed", {
        error: error instanceof Error ? error.message : String(error),
        filename: file.originalname,
      });
      throw new ValidationError(
        `Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(url: string): Promise<void> {
    if (!url) {
      throw new ValidationError("File URL is required");
    }

    const storageProvider = env.STORAGE_PROVIDER;

    try {
      switch (storageProvider) {
        case "s3":
          await this.deleteFromS3(url);
          break;
        case "cloudinary":
          await this.deleteFromCloudinary(url);
          break;
        default:
          logger.warn("File deletion not implemented for storage provider", {
            provider: storageProvider,
          });
      }
    } catch (error) {
      logger.error("File deletion failed", {
        url,
        provider: storageProvider,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - file deletion failure shouldn't break the flow
    }
  }

  private async deleteFromS3(url: string): Promise<void> {
    if (
      !env.AWS_ACCESS_KEY_ID ||
      !env.AWS_SECRET_ACCESS_KEY ||
      !env.AWS_S3_BUCKET
    ) {
      logger.warn("S3 credentials not configured for deletion");
      return;
    }

    try {
      // Extract key from URL
      const urlParts = url.split(".amazonaws.com/");
      if (urlParts.length < 2) {
        logger.warn("Invalid S3 URL format", { url });
        return;
      }
      const key = urlParts[1];

      const s3Client = new S3Client({
        region: env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const deleteCommand = new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      });

      await s3Client.send(deleteCommand);
      logger.info("File deleted from S3", { key });
    } catch (error) {
      logger.error("S3 deletion failed", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - deletion failure shouldn't break the flow
    }
  }

  private async deleteFromCloudinary(url: string): Promise<void> {
    if (
      !env.CLOUDINARY_CLOUD_NAME ||
      !env.CLOUDINARY_API_KEY ||
      !env.CLOUDINARY_API_SECRET
    ) {
      logger.warn("Cloudinary credentials not configured for deletion");
      return;
    }

    try {
      // Extract public_id from URL
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = `valuva/uploads/${filename.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
      logger.info("File deleted from Cloudinary", { publicId });
    } catch (error) {
      logger.error("Cloudinary deletion failed", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - deletion failure shouldn't break the flow
    }
  }

  /**
   * Optimize image (resize, compress, format conversion)
   * Uses Sharp library for high-performance image processing
   */
  async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    try {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Determine output format (prefer WebP for better compression)
      const outputFormat = file.mimetype === "image/png" ? "png" : "jpeg";

      // Resize if image is too large (max 2000px on longest side)
      const maxDimension = 2000;
      let processedImage = image;

      if (metadata.width && metadata.height) {
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          processedImage = image.resize(maxDimension, maxDimension, {
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      // Apply optimization based on format
      if (outputFormat === "jpeg") {
        return await processedImage
          .jpeg({
            quality: 85,
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();
      } else {
        return await processedImage
          .png({
            quality: 85,
            compressionLevel: 9,
          })
          .toBuffer();
      }
    } catch (error) {
      logger.error("Image optimization failed", {
        filename: file.originalname,
        error: error instanceof Error ? error.message : String(error),
      });
      // Return original buffer if optimization fails
      return file.buffer;
    }
  }
}
