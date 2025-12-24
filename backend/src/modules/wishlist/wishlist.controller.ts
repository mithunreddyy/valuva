import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { WishlistService } from "./wishlist.service";

export class WishlistController {
  private service: WishlistService;

  constructor() {
    this.service = new WishlistService();
  }

  getWishlist = async (req: AuthRequest, res: Response): Promise<Response> => {
    const wishlist = await this.service.getUserWishlist(req.user!.userId);
    return ResponseUtil.success(res, wishlist);
  };

  addToWishlist = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { productId } = req.body;
    const wishlist = await this.service.addToWishlist(
      req.user!.userId,
      productId
    );
    return ResponseUtil.success(res, wishlist, "Product added to wishlist");
  };

  removeFromWishlist = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { productId } = req.params;
    const wishlist = await this.service.removeFromWishlist(
      req.user!.userId,
      productId
    );
    return ResponseUtil.success(res, wishlist, "Product removed from wishlist");
  };
}
