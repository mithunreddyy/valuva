import { Request, Response } from "express";
import { orderService } from "../services/order.service";
function so(res: Response, st: number, p: any) {
  res.status(st).json(p);
}

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const data = await orderService.create(req.user, req.body);
      so(res, 201, { success: true, message: "Order created", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async myOrders(req: Request, res: Response) {
    try {
      const data = await orderService.getMyOrders(req.user);
      so(res, 200, { success: true, message: "Orders", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const data = await orderService.getOrder(req.user, req.params.id);
      so(res, 200, { success: true, message: "Order", data });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async track(req: Request, res: Response) {
    try {
      const data = await orderService.track(req.params.id);
      so(res, 200, { success: true, message: "Tracking", data });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      await orderService.cancel(req.user, req.params.id);
      so(res, 200, { success: true, message: "Cancelled" });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async requestReturn(req: Request, res: Response) {
    try {
      const data = await orderService.requestReturn(
        req.user,
        req.params.id,
        req.body
      );
      so(res, 200, { success: true, message: "Return requested", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async returnStatus(req: Request, res: Response) {
    try {
      const data = await orderService.getReturnStatus(req.params.id);
      so(res, 200, { success: true, message: "Return status", data });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async invoice(req: Request, res: Response) {
    try {
      const url = await orderService.getInvoice(req.params.id);
      so(res, 200, { success: true, message: "Invoice", data: { url } });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const data = await orderService.reorder(req.user, req.params.id);
      so(res, 200, { success: true, message: "Reorder done", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async rate(req: Request, res: Response) {
    try {
      const data = await orderService.rate(req.user, req.params.id, req.body);
      so(res, 200, { success: true, message: "Rated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async issue(req: Request, res: Response) {
    try {
      const data = await orderService.reportIssue(
        req.user,
        req.params.id,
        req.body
      );
      so(res, 200, { success: true, message: "Issue reported", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  // Payment callbacks (public)
  async paySuccess(req: Request, res: Response) {
    try {
      await orderService.paymentSuccess(req.body);
      so(res, 200, { success: true, message: "Success processed" });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async payFailure(req: Request, res: Response) {
    try {
      await orderService.paymentFailure(req.body);
      so(res, 200, { success: true, message: "Failure processed" });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async webhookPayu(req: Request, res: Response) {
    try {
      await orderService.webhookPayu(req.body);
      so(res, 200, { success: true, message: "Webhook processed" });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async paymentStatus(req: Request, res: Response) {
    try {
      const data = await orderService.paymentStatus(req.params.id);
      so(res, 200, { success: true, message: "Payment status", data });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async paymentRetry(req: Request, res: Response) {
    try {
      const data = await orderService.retryPayment(req.params.id);
      so(res, 200, { success: true, message: "Retry initiated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async returnEligible(req: Request, res: Response) {
    try {
      const data = await orderService.returnEligible(req.params.id);
      so(res, 200, { success: true, message: "Return eligibility", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  // Admin endpoints
  async adminGetOrders(req: Request, res: Response) {
    try {
      const data = await orderService.adminGetOrders(req.query);
      so(res, 200, { success: true, message: "All orders", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async adminGetOrderById(req: Request, res: Response) {
    try {
      const data = await orderService.adminGetOrderById(req.params.id);
      so(res, 200, { success: true, message: "Order", data });
    } catch (err: any) {
      so(res, 404, { success: false, message: err.message });
    }
  }

  async adminUpdateStatus(req: Request, res: Response) {
    try {
      const data = await orderService.adminUpdateStatus(
        req.params.id,
        req.body.status
      );
      so(res, 200, { success: true, message: "Status updated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminUpdateTracking(req: Request, res: Response) {
    try {
      const data = await orderService.adminUpdateTracking(
        req.params.id,
        req.body
      );
      so(res, 200, { success: true, message: "Tracking updated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminBulkUpdate(req: Request, res: Response) {
    try {
      const data = await orderService.adminBulkUpdate(req.body.updates || []);
      so(res, 200, { success: true, message: "Bulk updated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminAssignDelivery(req: Request, res: Response) {
    try {
      const data = await orderService.adminAssignDelivery(
        req.params.id,
        req.body.partnerId
      );
      so(res, 200, { success: true, message: "Delivery assigned", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminProcessReturn(req: Request, res: Response) {
    try {
      const data = await orderService.adminProcessReturn(
        req.params.id,
        req.body
      );
      so(res, 200, { success: true, message: "Return processed", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminApproveReturn(req: Request, res: Response) {
    try {
      const data = await orderService.adminApproveReturn(req.params.id);
      so(res, 200, { success: true, message: "Return approved", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminRejectReturn(req: Request, res: Response) {
    try {
      const data = await orderService.adminRejectReturn(req.params.id);
      so(res, 200, { success: true, message: "Return rejected", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminRefund(req: Request, res: Response) {
    try {
      const data = await orderService.adminRefund(req.params.id, req.body);
      so(res, 200, { success: true, message: "Refund initiated", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async adminDelete(req: Request, res: Response) {
    try {
      await orderService.adminDelete(req.params.id);
      so(res, 200, { success: true, message: "Order deleted" });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  // Analytics & exports
  async analyticsStats(req: Request, res: Response) {
    try {
      const data = await orderService.analyticsStats();
      so(res, 200, { success: true, message: "Stats", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async analyticsRevenue(req: Request, res: Response) {
    try {
      const data = await orderService.analyticsRevenue();
      so(res, 200, { success: true, message: "Revenue", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async analyticsTopProducts(req: Request, res: Response) {
    try {
      const data = await orderService.analyticsTopProducts();
      so(res, 200, { success: true, message: "Top products", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async exportCsv(req: Request, res: Response) {
    try {
      const csv = await orderService.exportCsv(req.query);
      so(res, 200, { success: true, message: "CSV export", data: { csv } });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async analyticsPendingCount(req: Request, res: Response) {
    try {
      const data = await orderService.analyticsPendingCount();
      so(res, 200, { success: true, message: "Pending", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async analyticsFailedPayments(req: Request, res: Response) {
    try {
      const data = await orderService.analyticsFailedPayments();
      so(res, 200, { success: true, message: "Failed payments", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  // Notifications / bulk / search & filter
  async notify(req: Request, res: Response) {
    try {
      await orderService.notify(req.params.id, req.body);
      so(res, 200, { success: true, message: "Notification sent" });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async resendConfirmation(req: Request, res: Response) {
    try {
      await orderService.resendConfirmation(req.params.id);
      so(res, 200, { success: true, message: "Confirmation resent" });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async bulkInvoices(req: Request, res: Response) {
    try {
      const data = await orderService.bulkInvoices(req.body.orderIds || []);
      so(res, 200, { success: true, message: "Bulk invoices", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async exportByDateRange(req: Request, res: Response) {
    try {
      const data = await orderService.exportByDateRange(req.body);
      so(res, 200, { success: true, message: "Exported", data });
    } catch (err: any) {
      so(res, 500, { success: false, message: err.message });
    }
  }

  async searchOrders(req: Request, res: Response) {
    try {
      const data = await orderService.search(req.query);
      so(res, 200, { success: true, message: "Search results", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async filterByStatus(req: Request, res: Response) {
    try {
      const data = await orderService.filterByStatus(req.params.status);
      so(res, 200, { success: true, message: "Filtered", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async getOrdersByUser(req: Request, res: Response) {
    try {
      const data = await orderService.getOrdersByUser(req.params.userId);
      so(res, 200, { success: true, message: "Orders by user", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }

  async filterByDateRange(req: Request, res: Response) {
    try {
      const data = await orderService.filterByDateRange(req.query);
      so(res, 200, { success: true, message: "Filtered by date", data });
    } catch (err: any) {
      so(res, 400, { success: false, message: err.message });
    }
  }
}

export const orderController = new OrderController();
