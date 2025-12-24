import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/response.util";
import { HomepageService } from "./homepage.service";

export class HomepageController {
  private service: HomepageService;

  constructor() {
    this.service = new HomepageService();
  }

  getSections = async (req: Request, res: Response): Promise<Response> => {
    const sections = await this.service.getSections();
    return ResponseUtil.success(res, sections);
  };

  getFeatured = async (req: Request, res: Response): Promise<Response> => {
    const products = await this.service.getFeatured();
    return ResponseUtil.success(res, products);
  };

  getNewArrivals = async (req: Request, res: Response): Promise<Response> => {
    const products = await this.service.getNewArrivals();
    return ResponseUtil.success(res, products);
  };

  getBestSellers = async (req: Request, res: Response): Promise<Response> => {
    const products = await this.service.getBestSellers();
    return ResponseUtil.success(res, products);
  };
}
