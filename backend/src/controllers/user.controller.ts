import { Request, Response } from "express";
import { userService } from "../services/user.service";
function s(res: Response, st: number, p: any) {
  res.status(st).json(p);
}

export class UserController {
  async me(req: Request, res: Response) {
    try {
      const data = await userService.getMe(req.user);
      s(res, 200, { success: true, message: "Profile", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async updateMe(req: Request, res: Response) {
    try {
      const data = await userService.updateProfile(req.user, req.body);
      s(res, 200, { success: true, message: "Profile updated", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async uploadAvatar(req: Request, res: Response) {
    try {
      const data = await userService.uploadAvatar(req.user, req.file);
      s(res, 200, { success: true, message: "Avatar uploaded", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      await userService.changePassword(req.user, req.body);
      s(res, 200, { success: true, message: "Password changed" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      await userService.deleteAccount(req.user);
      s(res, 200, { success: true, message: "Account deleted" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Addresses
  async getAddresses(req: Request, res: Response) {
    try {
      const data = await userService.getAddresses(req.user);
      s(res, 200, { success: true, message: "Addresses", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async addAddress(req: Request, res: Response) {
    try {
      const data = await userService.addAddress(req.user, req.body);
      s(res, 201, { success: true, message: "Address added", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async updateAddress(req: Request, res: Response) {
    try {
      const data = await userService.updateAddress(
        req.user,
        req.params.id,
        req.body
      );
      s(res, 200, { success: true, message: "Address updated", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async deleteAddress(req: Request, res: Response) {
    try {
      await userService.deleteAddress(req.user, req.params.id);
      s(res, 200, { success: true, message: "Address deleted" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async setDefaultAddress(req: Request, res: Response) {
    try {
      const data = await userService.setDefaultAddress(req.user, req.params.id);
      s(res, 200, { success: true, message: "Default set", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Orders (user)
  async getOrders(req: Request, res: Response) {
    try {
      const data = await userService.getOrders(req.user);
      s(res, 200, { success: true, message: "Orders", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const data = await userService.getOrder(req.user, req.params.id);
      s(res, 200, { success: true, message: "Order", data });
    } catch (err: any) {
      s(res, 404, { success: false, message: err.message });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      await userService.cancelOrder(req.user, req.params.id);
      s(res, 200, { success: true, message: "Order cancelled" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async requestReturn(req: Request, res: Response) {
    try {
      const data = await userService.requestReturn(
        req.user,
        req.params.id,
        req.body
      );
      s(res, 200, { success: true, message: "Return requested", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async getInvoice(req: Request, res: Response) {
    try {
      const url = await userService.getInvoice(req.user, req.params.id);
      s(res, 200, { success: true, message: "Invoice", data: { url } });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Wishlist
  async getWishlist(req: Request, res: Response) {
    try {
      const data = await userService.getWishlist(req.user);
      s(res, 200, { success: true, message: "Wishlist", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async addToWishlist(req: Request, res: Response) {
    try {
      const data = await userService.addToWishlist(req.user, req.params.id);
      s(res, 200, { success: true, message: "Added to wishlist", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      await userService.removeFromWishlist(req.user, req.params.id);
      s(res, 200, { success: true, message: "Removed from wishlist" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async clearWishlist(req: Request, res: Response) {
    try {
      await userService.clearWishlist(req.user);
      s(res, 200, { success: true, message: "Wishlist cleared" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async moveWishlistToCart(req: Request, res: Response) {
    try {
      const data = await userService.moveWishlistToCart(
        req.user,
        req.params.id
      );
      s(res, 200, { success: true, message: "Moved to cart", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Notifications & preferences
  async getNotifications(req: Request, res: Response) {
    try {
      const data = await userService.getNotifications(req.user);
      s(res, 200, { success: true, message: "Notifications", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async updateNotifications(req: Request, res: Response) {
    try {
      const data = await userService.updateNotifications(req.user, req.body);
      s(res, 200, { success: true, message: "Notifications updated", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      const data = await userService.getActivity(req.user);
      s(res, 200, { success: true, message: "Activity", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Reviews
  async getMyReviews(req: Request, res: Response) {
    try {
      const data = await userService.getMyReviews(req.user);
      s(res, 200, { success: true, message: "Reviews", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const data = await userService.updateReview(
        req.user,
        req.params.id,
        req.body
      );
      s(res, 200, { success: true, message: "Review updated", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      await userService.deleteReview(req.user, req.params.id);
      s(res, 200, { success: true, message: "Review deleted" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Loyalty & coupons
  async getLoyalty(req: Request, res: Response) {
    try {
      const data = await userService.getLoyalty(req.user);
      s(res, 200, { success: true, message: "Loyalty points", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async getCoupons(req: Request, res: Response) {
    try {
      const data = await userService.getCoupons(req.user);
      s(res, 200, { success: true, message: "Coupons", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  // Support tickets
  async getTickets(req: Request, res: Response) {
    try {
      const data = await userService.getTickets(req.user);
      s(res, 200, { success: true, message: "Tickets", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async createTicket(req: Request, res: Response) {
    try {
      const data = await userService.createTicket(req.user, req.body);
      s(res, 201, { success: true, message: "Ticket created", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const data = await userService.getTicket(req.user, req.params.id);
      s(res, 200, { success: true, message: "Ticket", data });
    } catch (err: any) {
      s(res, 404, { success: false, message: err.message });
    }
  }

  // Admin endpoints (user management) — these typically live in admin.controller but kept here for completeness
  async adminGetUsers(req: Request, res: Response) {
    try {
      const data = await userService.adminGetUsers(req.query);
      s(res, 200, { success: true, message: "Users", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async adminGetUserById(req: Request, res: Response) {
    try {
      const data = await userService.adminGetUserById(req.params.id);
      s(res, 200, { success: true, message: "User", data });
    } catch (err: any) {
      s(res, 404, { success: false, message: err.message });
    }
  }

  async adminUpdateRole(req: Request, res: Response) {
    try {
      const data = await userService.adminUpdateRole(
        req.params.id,
        req.body.role
      );
      s(res, 200, { success: true, message: "Role updated", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async adminBan(req: Request, res: Response) {
    try {
      const data = await userService.adminBan(req.params.id);
      s(res, 200, { success: true, message: "User banned", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async adminUnban(req: Request, res: Response) {
    try {
      const data = await userService.adminUnban(req.params.id);
      s(res, 200, { success: true, message: "User unbanned", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async adminDeleteUser(req: Request, res: Response) {
    try {
      await userService.adminDeleteUser(req.params.id);
      s(res, 200, { success: true, message: "User deleted" });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async adminGetStats(req: Request, res: Response) {
    try {
      const data = await userService.adminGetStats(req.params.id);
      s(res, 200, { success: true, message: "User stats", data });
    } catch (err: any) {
      s(res, 400, { success: false, message: err.message });
    }
  }

  async exportCsv(req: Request, res: Response) {
    try {
      const csv = await userService.exportCsv(req.query);
      s(res, 200, { success: true, message: "CSV generated", data: { csv } });
    } catch (err: any) {
      s(res, 500, { success: false, message: err.message });
    }
  }
}

export const userController = new UserController();
