import { Request, Response } from "express";
import { productService } from "../services/product.service";
function sendP(res: Response, status: number, payload: any) {
  res.status(status).json(payload);
}

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await productService.getAll(req.query);
      sendP(res, 200, { success: true, message: "Products", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const data = await productService.search(
        req.query.q as string,
        req.query
      );
      sendP(res, 200, { success: true, message: "Search results", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async featured(req: Request, res: Response) {
    try {
      const data = await productService.featured();
      sendP(res, 200, { success: true, message: "Featured products", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async byCategory(req: Request, res: Response) {
    try {
      const data = await productService.byCategory(
        req.params.category,
        req.query
      );
      sendP(res, 200, { success: true, message: "Category products", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await productService.getById(req.params.id);
      sendP(res, 200, { success: true, message: "Product", data });
    } catch (err: any) {
      sendP(res, 404, { success: false, message: err.message });
    }
  }

  async related(req: Request, res: Response) {
    try {
      const data = await productService.related(req.params.id);
      sendP(res, 200, { success: true, message: "Related products", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const data = await productService.getReviews(req.params.id, req.query);
      sendP(res, 200, { success: true, message: "Reviews", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async checkStock(req: Request, res: Response) {
    try {
      const data = await productService.checkStock(req.params.id, req.body);
      sendP(res, 200, { success: true, message: "Stock status", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  // Authenticated
  async addReview(req: Request, res: Response) {
    try {
      const data = await productService.addReview(
        req.params.id,
        req.body,
        req.user
      );
      sendP(res, 201, { success: true, message: "Review added", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async addToWishlist(req: Request, res: Response) {
    try {
      const data = await productService.addToWishlist(req.params.id, req.user);
      sendP(res, 200, { success: true, message: "Added to wishlist", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  // Admin
  async create(req: Request, res: Response) {
    try {
      const data = await productService.create(req.body);
      sendP(res, 201, { success: true, message: "Product created", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async bulkCreate(req: Request, res: Response) {
    try {
      const data = await productService.bulkCreate(req.body.products || []);
      sendP(res, 201, { success: true, message: "Bulk created", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async uploadImages(req: Request, res: Response) {
    try {
      // expecting files in req.files
      const data = await productService.uploadImages(req.params.id, req.files);
      sendP(res, 200, { success: true, message: "Images uploaded", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await productService.update(req.params.id, req.body);
      sendP(res, 200, { success: true, message: "Product updated", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const data = await productService.updateStock(req.params.id, req.body);
      sendP(res, 200, { success: true, message: "Stock updated", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async toggleActive(req: Request, res: Response) {
    try {
      const data = await productService.toggleActive(req.params.id);
      sendP(res, 200, { success: true, message: "Toggled", data });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await productService.delete(req.params.id);
      sendP(res, 200, { success: true, message: "Deleted" });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }

  async bulkDelete(req: Request, res: Response) {
    try {
      await productService.bulkDelete(req.body.ids || []);
      sendP(res, 200, { success: true, message: "Bulk deleted" });
    } catch (err: any) {
      sendP(res, 400, { success: false, message: err.message });
    }
  }
}

export const productController = new ProductController();
