import { HomepageRepository } from "./homepage.repository";

export class HomepageService {
  private repository: HomepageRepository;

  constructor() {
    this.repository = new HomepageRepository();
  }

  async getSections() {
    return this.repository.getActiveSections();
  }

  async getFeatured() {
    const products = await this.repository.getFeaturedProducts();
    return this.formatProducts(products);
  }

  async getNewArrivals() {
    const products = await this.repository.getNewArrivals();
    return this.formatProducts(products);
  }

  async getBestSellers() {
    const products = await this.repository.getBestSellers();
    return this.formatProducts(products);
  }

  private formatProducts(products: any[]) {
    return products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            p.reviews.length
          : 0;

      const { reviews, ...productData } = p;

      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });
  }
}
