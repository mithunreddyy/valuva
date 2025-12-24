import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/response.util";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
  private service: CategoriesService;

  constructor() {
    this.service = new CategoriesService();
  }

  getCategories = async (req: Request, res: Response): Promise<Response> => {
    const categories = await this.service.getCategories();
    return ResponseUtil.success(res, categories);
  };

  getCategoryBySlug = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const category = await this.service.getCategoryBySlug(req.params.slug);
    return ResponseUtil.success(res, category);
  };

  getSubCategoryBySlug = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const subCategory = await this.service.getSubCategoryBySlug(
      req.params.categorySlug,
      req.params.subCategorySlug
    );
    return ResponseUtil.success(res, subCategory);
  };
}
