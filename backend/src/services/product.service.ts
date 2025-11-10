import crypto from "crypto";

class ProductService {
  private products = new Map<string, any>();
  private reviews = new Map<string, any[]>();
  private categories = new Set<string>();

  constructor() {
    // seed demo product
    const id = "prod-1";
    this.products.set(id, {
      id,
      name: "Demo",
      price: 9.99,
      active: true,
      stock: 100,
      category: "demo",
    });
    this.categories.add("demo");
  }

  async getAll(query: any) {
    const arr = Array.from(this.products.values());
    return { items: arr, total: arr.length };
  }

  async search(q: string | undefined, query: any) {
    const arr = Array.from(this.products.values()).filter(
      (p) => !q || p.name.toLowerCase().includes(String(q).toLowerCase())
    );
    return { items: arr, total: arr.length };
  }

  async featured() {
    return Array.from(this.products.values()).slice(0, 5);
  }

  async byCategory(category: string, query: any) {
    const arr = Array.from(this.products.values()).filter(
      (p) => p.category === category
    );
    return { items: arr, total: arr.length };
  }

  async getById(id: string) {
    const p = this.products.get(id);
    if (!p) throw new Error("Product not found");
    return p;
  }

  async related(id: string) {
    const base = await this.getById(id);
    return Array.from(this.products.values())
      .filter((p) => p.category === base.category && p.id !== id)
      .slice(0, 6);
  }

  async getReviews(id: string, query: any) {
    return this.reviews.get(id) || [];
  }

  async checkStock(id: string, body: any) {
    const p = await this.getById(id);
    const qty = body.quantity || 1;
    return { available: p.stock >= qty, stock: p.stock };
  }

  async addReview(id: string, body: any, user: any) {
    const r = {
      id: crypto.randomUUID(),
      productId: id,
      userId: user?.id || "anon",
      ...body,
      createdAt: new Date().toISOString(),
    };
    const arr = this.reviews.get(id) || [];
    arr.push(r);
    this.reviews.set(id, arr);
    return r;
  }

  async addToWishlist(id: string, user: any) {
    // mock: return wishlist item
    return {
      wishlistId: crypto.randomUUID(),
      productId: id,
      userId: user?.id || "anon",
    };
  }

  async create(body: any) {
    const id = crypto.randomUUID();
    this.products.set(id, { id, ...body });
    if (body.category) this.categories.add(body.category);
    return this.products.get(id);
  }

  async bulkCreate(items: any[]) {
    const created = [];
    for (const it of items) created.push(await this.create(it));
    return created;
  }

  async uploadImages(id: string, files: any) {
    // files processing placeholder
    return { uploaded: Array.isArray(files) ? files.length : 0 };
  }

  async update(id: string, body: any) {
    const p = await this.getById(id);
    const updated = { ...p, ...body };
    this.products.set(id, updated);
    return updated;
  }

  async updateStock(id: string, body: any) {
    const p = await this.getById(id);
    p.stock = body.stock ?? p.stock;
    this.products.set(id, p);
    return { id, stock: p.stock };
  }

  async toggleActive(id: string) {
    const p = await this.getById(id);
    p.active = !p.active;
    this.products.set(id, p);
    return { id, active: p.active };
  }

  async delete(id: string) {
    this.products.delete(id);
  }

  async bulkDelete(ids: string[]) {
    for (const id of ids) this.products.delete(id);
  }
}

export const productService = new ProductService();
