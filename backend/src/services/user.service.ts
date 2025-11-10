import crypto from "crypto";

class UserService {
  private users = new Map<string, any>();
  private orders = new Map<string, any[]>();
  private tickets = new Map<string, any[]>();
  private reviews = new Map<string, any[]>();

  constructor() {
    const id = "user-1";
    this.users.set(id, { id, name: "Demo User", email: "demo@example.com" });
  }

  async getMe(user: any) {
    return this.users.get(user?.id || "user-1") || null;
  }

  async updateProfile(user: any, payload: any) {
    const u = this.users.get(user?.id || "user-1") || {};
    const updated = { ...u, ...payload };
    this.users.set(updated.id, updated);
    return updated;
  }

  async uploadAvatar(user: any, file: any) {
    return { url: "https://cdn.example.com/avatar.png" };
  }

  async changePassword(user: any, body: any) {
    // validate old password, set new
    return true;
  }

  async deleteAccount(user: any) {
    this.users.delete(user?.id || "user-1");
  }

  // Addresses
  async getAddresses(user: any) {
    return [{ id: "addr-1", line1: "123 Street" }];
  }

  async addAddress(user: any, payload: any) {
    const addr = { id: crypto.randomUUID(), ...payload };
    return addr;
  }

  async updateAddress(user: any, id: string, payload: any) {
    return { id, ...payload };
  }

  async deleteAddress(user: any, id: string) {
    return;
  }

  async setDefaultAddress(user: any, id: string) {
    return { default: id };
  }

  // Orders
  async getOrders(user: any) {
    return this.orders.get(user?.id || "user-1") || [];
  }

  async getOrder(user: any, id: string) {
    const orders = this.orders.get(user?.id || "user-1") || [];
    const ord = orders.find((o) => o.id === id);
    if (!ord) throw new Error("Order not found");
    return ord;
  }

  async cancelOrder(user: any, id: string) {
    return { cancelled: id };
  }

  async requestReturn(user: any, id: string, body: any) {
    return { returnId: crypto.randomUUID(), orderId: id };
  }

  async getInvoice(user: any, id: string) {
    return `https://invoices.example.com/${id}.pdf`;
  }

  // Wishlist
  async getWishlist(user: any) {
    return [{ id: "wish-1", productId: "prod-1" }];
  }

  async addToWishlist(user: any, productId: string) {
    return { id: crypto.randomUUID(), productId };
  }

  async removeFromWishlist(user: any, productId: string) {
    return;
  }

  async clearWishlist(user: any) {
    return;
  }

  async moveWishlistToCart(user: any, id: string) {
    return { moved: id };
  }

  // Notifications & activity
  async getNotifications(user: any) {
    return { email: true, sms: false };
  }
  async updateNotifications(user: any, payload: any) {
    return payload;
  }
  async getActivity(user: any) {
    return [];
  }

  // Reviews
  async getMyReviews(user: any) {
    return this.reviews.get(user?.id || "user-1") || [];
  }
  async updateReview(user: any, id: string, payload: any) {
    return { id, ...payload };
  }
  async deleteReview(user: any, id: string) {
    return;
  }

  // Loyalty & coupons
  async getLoyalty(user: any) {
    return { points: 120 };
  }
  async getCoupons(user: any) {
    return [{ code: "WELCOME10", discount: 10 }];
  }

  // Support tickets
  async getTickets(user: any) {
    return this.tickets.get(user?.id || "user-1") || [];
  }
  async createTicket(user: any, payload: any) {
    const t = { id: crypto.randomUUID(), ...payload };
    return t;
  }
  async getTicket(user: any, id: string) {
    return { id, subject: "Support" };
  }

  // Admin user management
  async adminGetUsers(query: any) {
    return Array.from(this.users.values());
  }
  async adminGetUserById(id: string) {
    const u = this.users.get(id);
    if (!u) throw new Error("User not found");
    return u;
  }
  async adminUpdateRole(id: string, role: string) {
    const u = this.users.get(id) || {};
    u.role = role;
    this.users.set(id, u);
    return u;
  }
  async adminBan(id: string) {
    const u = this.users.get(id) || {};
    u.banned = true;
    this.users.set(id, u);
    return u;
  }
  async adminUnban(id: string) {
    const u = this.users.get(id) || {};
    u.banned = false;
    this.users.set(id, u);
    return u;
  }
  async adminDeleteUser(id: string) {
    this.users.delete(id);
  }
  async adminGetStats(id: string) {
    return { orders: 10, spent: 123.45 };
  }
  async exportCsv(query: any) {
    return "id,name,email\n1,Demo,demo@example.com";
  }
}

export const userService = new UserService();
