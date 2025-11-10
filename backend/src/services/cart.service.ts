import crypto from "crypto";

class CartService {
  private carts = new Map<string, any>(); // userId -> { items: [], coupon: null, saved: [] }

  private ensure(user: any) {
    const uid = user?.id || "guest";
    if (!this.carts.has(uid))
      this.carts.set(uid, { items: [], coupon: null, saved: [] });
    return { uid, cart: this.carts.get(uid) };
  }

  async getCart(user: any) {
    const { cart } = this.ensure(user);
    return cart;
  }

  async summary(user: any) {
    const { cart } = this.ensure(user);
    const total = cart.items.reduce(
      (s: number, it: any) => s + it.price * it.qty,
      0
    );
    return { total, count: cart.items.length };
  }

  async addItem(user: any, payload: any) {
    const { cart } = this.ensure(user);
    const item = {
      id: crypto.randomUUID(),
      productId: payload.productId,
      qty: payload.qty || 1,
      price: payload.price || 0,
    };
    cart.items.push(item);
    return item;
  }

  async updateItem(user: any, payload: any) {
    const { cart } = this.ensure(user);
    const it = cart.items.find(
      (i: any) => i.id === payload.id || i.productId === payload.productId
    );
    if (!it) throw new Error("Item not found");
    it.qty = payload.qty ?? it.qty;
    return it;
  }

  async removeItem(user: any, productId: string) {
    const { cart } = this.ensure(user);
    cart.items = cart.items.filter(
      (i: any) => i.productId !== productId && i.id !== productId
    );
    return { removed: productId };
  }

  async clear(user: any) {
    const { cart } = this.ensure(user);
    cart.items = [];
  }

  async applyCoupon(user: any, code: string) {
    const { cart } = this.ensure(user);
    cart.coupon = code;
    return { coupon: code };
  }

  async removeCoupon(user: any) {
    const { cart } = this.ensure(user);
    cart.coupon = null;
  }

  async sync(user: any, guestCart: any) {
    const { cart } = this.ensure(user);
    cart.items = [...cart.items, ...(guestCart?.items || [])];
    return cart;
  }

  async validate(user: any) {
    const { cart } = this.ensure(user);
    // validate stock & price (mock)
    return { valid: true, issues: [] };
  }

  async moveToWishlist(user: any, productId: string) {
    const { cart } = this.ensure(user);
    cart.items = cart.items.filter((i: any) => i.productId !== productId);
    return { moved: productId };
  }

  async bulkAdd(user: any, items: any[]) {
    const { cart } = this.ensure(user);
    for (const it of items) cart.items.push({ id: crypto.randomUUID(), ...it });
    return cart.items;
  }

  async getSaved(user: any) {
    const { cart } = this.ensure(user);
    return cart.saved;
  }

  async saveForLater(user: any, productId: string) {
    const { cart } = this.ensure(user);
    const idx = cart.items.findIndex(
      (i: any) => i.productId === productId || i.id === productId
    );
    if (idx >= 0) cart.saved.push(cart.items.splice(idx, 1)[0]);
    return cart.saved;
  }

  async restoreSaved(user: any, savedId: string) {
    const { cart } = this.ensure(user);
    const idx = cart.saved.findIndex(
      (i: any) => i.id === savedId || i.productId === savedId
    );
    if (idx >= 0) cart.items.push(cart.saved.splice(idx, 1)[0]);
    return cart.items;
  }
}

export const cartService = new CartService();
