import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { AdminHomepageService } from "./admin-homepage.service";

export class AdminHomepageController {
  private service: AdminHomepageService;

  constructor() {
    this.service = new AdminHomepageService();
  }

  getAllSections = async (_req: Request, res: Response): Promise<Response> => {
    const sections = await this.service.getAllSections();
    return ResponseUtil.success(res, sections);
  };

  getSectionById = async (req: Request, res: Response): Promise<Response> => {
    const section = await this.service.getSectionById(req.params.id);
    return ResponseUtil.success(res, section);
  };

  createSection = async (req: Request, res: Response): Promise<Response> => {
    const section = await this.service.createSection(req.body);
    return ResponseUtil.success(
      res,
      section,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateSection = async (req: Request, res: Response): Promise<Response> => {
    const section = await this.service.updateSection(req.params.id, req.body);
    return ResponseUtil.success(res, section, SUCCESS_MESSAGES.UPDATED);
  };

  deleteSection = async (req: Request, res: Response): Promise<Response> => {
    await this.service.deleteSection(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  reorderSections = async (req: Request, res: Response): Promise<Response> => {
    const { sections } = req.body;
    await this.service.reorderSections(sections);
    return ResponseUtil.success(res, null, "Sections reordered successfully");
  };
}
