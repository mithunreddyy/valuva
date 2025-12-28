export interface UploadServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(url: string): Promise<void>;
  optimizeImage(file: Express.Multer.File): Promise<Buffer>;
}

