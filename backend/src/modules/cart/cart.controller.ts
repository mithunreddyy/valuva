import { Request, Response } from "express";
import { SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { CartService } from "./cart.service";

export class CartController {
  private service: CartService;

  constructor() {
    this.service = new CartService();
  }

  getCart = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const cart = await this.service.getCart(authReq.user!.userId);
    return ResponseUtil.success(res, cart);
  };

  addToCart = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { variantId, quantity } = req.body;
    const cart = await this.service.addToCart(
      authReq.user!.userId,
      variantId,
      quantity
    );
    return ResponseUtil.success(res, cart, "Item added to cart");
  };

  updateCartItem = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await this.service.updateCartItem(
      authReq.user!.userId,
      itemId,
      quantity
    );
    return ResponseUtil.success(res, cart, SUCCESS_MESSAGES.UPDATED);
  };

  removeCartItem = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { itemId } = req.params;
    const cart = await this.service.removeCartItem(authReq.user!.userId, itemId);
    return ResponseUtil.success(res, cart, "Item removed from cart");
  };

  clearCart = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const cart = await this.service.clearCart(authReq.user!.userId);
    return ResponseUtil.success(res, cart, "Cart cleared");
  };
}
