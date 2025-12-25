import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CacheUtil } from "../../utils/cache.util";
import { AnalyticsRepository, DateRange } from "./analytics.repository";

interface SalesMetrics {
  totalRevenue: Decimal;
  totalOrders: number;
  averageOrderValue: Decimal;
  conversionRate: number;
  revenueGrowth: number;
}

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  totalSold: number;
  revenue: Decimal;
  averageRating: number;
}

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  /**
   * Get sales metrics for a date range
   */
  async getSalesMetrics(dateRange: DateRange): Promise<SalesMetrics> {
    const { startDate, endDate } = dateRange;

    // Check cache first
    const cacheKey = CacheUtil.generateKey(
      "sales-metrics",
      startDate.toISOString(),
      endDate.toISOString()
    );
    const cached = CacheUtil.get<SalesMetrics>(cacheKey);
    if (cached) return cached;

    const orderStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
    ];

    // Current period metrics
    const currentOrders = await this.repository.getOrdersByDateRange(
      startDate,
      endDate,
      orderStatuses
    );

    const totalRevenue = currentOrders.reduce(
      (sum, order) => sum.add(order.total),
      new Decimal(0)
    );

    const totalOrders = currentOrders.length;
    const averageOrderValue =
      totalOrders > 0 ? totalRevenue.div(totalOrders) : new Decimal(0);

    // Previous period for comparison
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodLength);
    const previousEndDate = new Date(startDate);

    const previousOrders = await this.repository.getOrdersByDateRange(
      previousStartDate,
      previousEndDate,
      orderStatuses
    );

    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum.add(order.total),
      new Decimal(0)
    );

    const revenueGrowth = previousRevenue.greaterThan(0)
      ? totalRevenue
          .sub(previousRevenue)
          .div(previousRevenue)
          .mul(100)
          .toNumber()
      : 0;

    // Calculate conversion rate
    const totalVisits = await this.repository.getProductViewCounts(
      startDate,
      endDate
    );

    const conversionRate =
      totalVisits._sum.viewCount && totalVisits._sum.viewCount > 0
        ? (totalOrders / totalVisits._sum.viewCount) * 100
        : 0;

    const result: SalesMetrics = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
      revenueGrowth,
    };

    // Cache for 5 minutes
    CacheUtil.set(cacheKey, result, 5 * 60 * 1000);

    return result;
  }

  /**
   * Get top selling products
   */
  async getTopProducts(
    limit: number = 10,
    dateRange?: DateRange
  ): Promise<TopProduct[]> {
    // Check cache
    const cacheKey = CacheUtil.generateKey(
      "top-products",
      limit.toString(),
      dateRange?.startDate.toISOString() || "all",
      dateRange?.endDate.toISOString() || "all"
    );
    const cached = CacheUtil.get<TopProduct[]>(cacheKey);
    if (cached) return cached;

    const products = await this.repository.getTopProductsWithOrderItems(
      limit,
      dateRange
    );

    const result = products.map((product) => {
      const totalSold = product.variants.reduce(
        (sum, variant) =>
          sum +
          variant.orderItems.reduce(
            (itemSum, item) => itemSum + item.quantity,
            0
          ),
        0
      );
      const revenue = product.variants.reduce(
        (sum, variant) =>
          sum.add(
            variant.orderItems.reduce(
              (itemSum, item) => itemSum.add(item.subtotal),
              new Decimal(0)
            )
          ),
        new Decimal(0)
      );
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        totalSold,
        revenue,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });

    // Cache for 10 minutes
    CacheUtil.set(cacheKey, result, 10 * 60 * 1000);

    return result;
  }

  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(
    dateRange: DateRange,
    groupBy: "day" | "week" | "month" = "day"
  ) {
    const cacheKey = CacheUtil.generateKey(
      "revenue-trends",
      dateRange.startDate.toISOString(),
      dateRange.endDate.toISOString(),
      groupBy
    );
    const cached = CacheUtil.get<any[]>(cacheKey);
    if (cached) return cached;

    const orders = await this.repository.getOrdersByDateRange(
      dateRange.startDate,
      dateRange.endDate,
      [OrderStatus.DELIVERED, OrderStatus.PROCESSING, OrderStatus.SHIPPED]
    );

    const trends: { date: string; revenue: number; orders: number }[] = [];
    const groupedData = new Map<string, { revenue: Decimal; orders: number }>();

    orders.forEach((order) => {
      let dateKey: string;
      const date = new Date(order.createdAt);

      switch (groupBy) {
        case "day":
          dateKey = date.toISOString().split("T")[0];
          break;
        case "week":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          dateKey = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          dateKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          break;
        default:
          dateKey = date.toISOString().split("T")[0];
      }

      const existing = groupedData.get(dateKey) || {
        revenue: new Decimal(0),
        orders: 0,
      };
      groupedData.set(dateKey, {
        revenue: existing.revenue.add(order.total),
        orders: existing.orders + 1,
      });
    });

    groupedData.forEach((value, date) => {
      trends.push({
        date,
        revenue: value.revenue.toNumber(),
        orders: value.orders,
      });
    });

    const result = trends.sort((a, b) => a.date.localeCompare(b.date));
    CacheUtil.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(dateRange: DateRange) {
    const cacheKey = CacheUtil.generateKey(
      "customer-analytics",
      dateRange.startDate.toISOString(),
      dateRange.endDate.toISOString()
    );
    const cached = CacheUtil.get<any>(cacheKey);
    if (cached) return cached;

    const { totalCustomers, repeatCustomers } =
      await this.repository.getCustomerCounts(dateRange);

    const topCustomers = await this.repository.getTopCustomers(dateRange, 10);

    const formattedTopCustomers = topCustomers
      .map((customer) => {
        const totalSpent = customer.orders.reduce(
          (sum, order) => sum.add(order.total),
          new Decimal(0)
        );
        return {
          id: customer.id,
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`,
          totalOrders: customer.orders.length,
          totalSpent: totalSpent.toNumber(),
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);

    const result = {
      totalCustomers,
      newCustomers: totalCustomers,
      repeatCustomers,
      retentionRate:
        totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
      topCustomers: formattedTopCustomers,
    };

    CacheUtil.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }

  /**
   * Get inventory insights
   */
  async getInventoryInsights() {
    const cacheKey = CacheUtil.generateKey("inventory-insights");
    const cached = CacheUtil.get<any>(cacheKey);
    if (cached) return cached;

    const { lowStock, outOfStock, totalProducts } =
      await this.repository.getInventoryStats();

    const topStockMovers = await this.repository.getTopStockMovers(10);

    const result = {
      totalProducts,
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock,
      stockHealthScore:
        totalProducts > 0
          ? ((totalProducts - outOfStock - lowStock) / totalProducts) * 100
          : 0,
      topStockMovers,
    };

    CacheUtil.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  }

  /**
   * Get category performance
   */
  async getCategoryPerformance(dateRange: DateRange) {
    const cacheKey = CacheUtil.generateKey(
      "category-performance",
      dateRange.startDate.toISOString(),
      dateRange.endDate.toISOString()
    );
    const cached = CacheUtil.get<any[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.repository.getCategoryPerformanceData(
      dateRange
    );

    const result = categories
      .map((category) => {
        const totalSales = category.products.reduce((catSum, product) => {
          const productSales = product.variants.reduce(
            (variantSum, variant) =>
              variantSum +
              variant.orderItems.reduce(
                (itemSum, item) => itemSum + item.quantity,
                0
              ),
            0
          );
          return catSum + productSales;
        }, 0);

        const totalRevenue = category.products.reduce((catSum, product) => {
          const productRevenue = product.variants.reduce(
            (variantSum, variant) =>
              variantSum.add(
                variant.orderItems.reduce(
                  (itemSum, item) => itemSum.add(item.subtotal),
                  new Decimal(0)
                )
              ),
            new Decimal(0)
          );
          return catSum.add(productRevenue);
        }, new Decimal(0));

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          totalProducts: category.products.length,
          totalSales,
          revenue: totalRevenue.toNumber(),
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    CacheUtil.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }
}
