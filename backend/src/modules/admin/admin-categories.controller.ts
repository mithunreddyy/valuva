import { Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { AdminCategoriesService } from "./admin-categories.service";

export class AdminCategoriesController {
  private service: AdminCategoriesService;

  constructor() {
    this.service = new AdminCategoriesService();
  }

  getAllCategories = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const categories = await this.service.getAllCategories();
    return ResponseUtil.success(res, categories);
  };

  getCategoryById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const category = await this.service.getCategoryById(req.params.id);
    return ResponseUtil.success(res, category);
  };

  createCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const category = await this.service.createCategory(req.body);
    return ResponseUtil.success(
      res,
      category,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const category = await this.service.updateCategory(req.params.id, req.body);
    return ResponseUtil.success(res, category, SUCCESS_MESSAGES.UPDATED);
  };

  deleteCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteCategory(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  getAllSubCategories = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const categoryId = req.query.categoryId as string | undefined;
    const subCategories = await this.service.getAllSubCategories(categoryId);
    return ResponseUtil.success(res, subCategories);
  };

  getSubCategoryById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const subCategory = await this.service.getSubCategoryById(req.params.id);
    return ResponseUtil.success(res, subCategory);
  };

  createSubCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const subCategory = await this.service.createSubCategory(req.body);
    return ResponseUtil.success(
      res,
      subCategory,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateSubCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const subCategory = await this.service.updateSubCategory(
      req.params.id,
      req.body
    );
    return ResponseUtil.success(res, subCategory, SUCCESS_MESSAGES.UPDATED);
  };

  deleteSubCategory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteSubCategory(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };
}
