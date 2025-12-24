import { Response } from "express";
import { SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { CartService } from "./cart.service";

export class CartController {
  private service: CartService;

  constructor() {
    this.service = new CartService();
  }

  getCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const cart = await this.service.getCart(req.user!.userId);
    return ResponseUtil.success(res, cart);
  };

  addToCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { variantId, quantity } = req.body;
    const cart = await this.service.addToCart(
      req.user!.userId,
      variantId,
      quantity
    );
    return ResponseUtil.success(res, cart, "Item added to cart");
  };

  updateCartItem = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await this.service.updateCartItem(
      req.user!.userId,
      itemId,
      quantity
    );
    return ResponseUtil.success(res, cart, SUCCESS_MESSAGES.UPDATED);
  };

  removeCartItem = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { itemId } = req.params;
    const cart = await this.service.removeCartItem(req.user!.userId, itemId);
    return ResponseUtil.success(res, cart, "Item removed from cart");
  };

  clearCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    const cart = await this.service.clearCart(req.user!.userId);
    return ResponseUtil.success(res, cart, "Cart cleared");
  };
}
