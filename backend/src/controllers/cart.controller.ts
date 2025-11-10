import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
function sendC(res: Response, s: number, p: any) {
  res.status(s).json(p);
}

export class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const data = await cartService.getCart(req.user);
      sendC(res, 200, { success: true, message: "Cart fetched", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async summary(req: Request, res: Response) {
    try {
      const data = await cartService.summary(req.user);
      sendC(res, 200, { success: true, message: "Cart summary", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async add(req: Request, res: Response) {
    try {
      const data = await cartService.addItem(req.user, req.body);
      sendC(res, 201, { success: true, message: "Item added", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await cartService.updateItem(req.user, req.body);
      sendC(res, 200, { success: true, message: "Cart updated", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const data = await cartService.removeItem(req.user, req.body.productId);
      sendC(res, 200, { success: true, message: "Item removed", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async clear(req: Request, res: Response) {
    try {
      await cartService.clear(req.user);
      sendC(res, 200, { success: true, message: "Cart cleared" });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async applyCoupon(req: Request, res: Response) {
    try {
      const data = await cartService.applyCoupon(req.user, req.body.code);
      sendC(res, 200, { success: true, message: "Coupon applied", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async removeCoupon(req: Request, res: Response) {
    try {
      await cartService.removeCoupon(req.user);
      sendC(res, 200, { success: true, message: "Coupon removed" });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async sync(req: Request, res: Response) {
    try {
      const data = await cartService.sync(req.user, req.body.guestCart);
      sendC(res, 200, { success: true, message: "Cart synced", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async validate(req: Request, res: Response) {
    try {
      const data = await cartService.validate(req.user);
      sendC(res, 200, { success: true, message: "Cart validated", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async moveToWishlist(req: Request, res: Response) {
    try {
      const data = await cartService.moveToWishlist(req.user, req.params.id);
      sendC(res, 200, { success: true, message: "Moved to wishlist", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async bulkAdd(req: Request, res: Response) {
    try {
      const data = await cartService.bulkAdd(req.user, req.body.items || []);
      sendC(res, 200, { success: true, message: "Bulk added", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async saved(req: Request, res: Response) {
    try {
      const data = await cartService.getSaved(req.user);
      sendC(res, 200, { success: true, message: "Saved items", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async save(req: Request, res: Response) {
    try {
      const data = await cartService.saveForLater(req.user, req.params.id);
      sendC(res, 200, { success: true, message: "Saved for later", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }

  async restore(req: Request, res: Response) {
    try {
      const data = await cartService.restoreSaved(req.user, req.params.id);
      sendC(res, 200, { success: true, message: "Restored to cart", data });
    } catch (err: any) {
      sendC(res, 400, { success: false, message: err.message });
    }
  }
}

export const cartController = new CartController();
