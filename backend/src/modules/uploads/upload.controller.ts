import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { UploadService } from "./upload.service";

export class UploadController {
  private service: UploadService;

  constructor() {
    this.service = new UploadService();
  }

  uploadImage = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) {
      return ResponseUtil.error(
        res,
        "No file uploaded",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const fileUrl = await this.service.uploadFile(req.file);
    return ResponseUtil.success(res, { url: fileUrl }, undefined, HTTP_STATUS.OK);
  };

  uploadMultipleImages = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return ResponseUtil.error(
        res,
        "No files uploaded",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const fileUrls = await Promise.all(
      (req.files as Express.Multer.File[]).map((file) =>
        this.service.uploadFile(file)
      )
    );

    return ResponseUtil.success(
      res,
      { urls: fileUrls },
      undefined,
      HTTP_STATUS.OK
    );
  };
}

