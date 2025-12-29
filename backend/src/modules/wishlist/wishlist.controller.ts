import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { WishlistService } from "./wishlist.service";

export class WishlistController {
  private service: WishlistService;

  constructor() {
    this.service = new WishlistService();
  }

  getWishlist = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const wishlist = await this.service.getUserWishlist(authReq.user!.userId);
    return ResponseUtil.success(res, wishlist);
  };

  addToWishlist = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { productId } = req.body;
    const wishlist = await this.service.addToWishlist(
      authReq.user!.userId,
      productId
    );
    return ResponseUtil.success(res, wishlist, "Product added to wishlist");
  };

  removeFromWishlist = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { productId } = req.params;
    const wishlist = await this.service.removeFromWishlist(
      authReq.user!.userId,
      productId
    );
    return ResponseUtil.success(res, wishlist, "Product removed from wishlist");
  };
}
