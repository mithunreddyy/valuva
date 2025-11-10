import { Request, Response } from "express";
import { checkoutService } from "../services/checkout.service";
function sc(res: Response, st: number, p: any) {
  res.status(st).json(p);
}

export class CheckoutController {
  // Step 1
  async summary(req: Request, res: Response) {
    try {
      const data = await checkoutService.getSummary(req.user);
      sc(res, 200, { success: true, message: "Checkout summary", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async validate(req: Request, res: Response) {
    try {
      const data = await checkoutService.validateCart(req.user);
      sc(res, 200, { success: true, message: "Cart validated", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Shipping
  async addresses(req: Request, res: Response) {
    try {
      const data = await checkoutService.getAddresses(req.user);
      sc(res, 200, { success: true, message: "Addresses", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async calculateShipping(req: Request, res: Response) {
    try {
      const data = await checkoutService.calculateShipping(req.user, req.body);
      sc(res, 200, { success: true, message: "Shipping calculated", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async getMethods(req: Request, res: Response) {
    try {
      const data = await checkoutService.getShippingMethods();
      sc(res, 200, { success: true, message: "Methods", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async selectMethod(req: Request, res: Response) {
    try {
      const data = await checkoutService.selectShippingMethod(
        req.user,
        req.body.methodId
      );
      sc(res, 200, { success: true, message: "Shipping selected", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async verifyAddress(req: Request, res: Response) {
    try {
      const data = await checkoutService.verifyAddress(req.user, req.body);
      sc(res, 200, { success: true, message: "Address verified", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Coupons
  async coupons(req: Request, res: Response) {
    try {
      const data = await checkoutService.getCoupons(req.user);
      sc(res, 200, { success: true, message: "Coupons", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async applyCoupon(req: Request, res: Response) {
    try {
      const data = await checkoutService.applyCoupon(req.user, req.body.code);
      sc(res, 200, { success: true, message: "Coupon applied", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async removeCoupon(req: Request, res: Response) {
    try {
      await checkoutService.removeCoupon(req.user);
      sc(res, 200, { success: true, message: "Coupon removed" });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async applyLoyalty(req: Request, res: Response) {
    try {
      const data = await checkoutService.applyLoyalty(
        req.user,
        req.body.points
      );
      sc(res, 200, { success: true, message: "Loyalty applied", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Payment
  async paymentMethods(req: Request, res: Response) {
    try {
      const data = await checkoutService.getPaymentMethods(req.user);
      sc(res, 200, { success: true, message: "Payment methods", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async selectPayment(req: Request, res: Response) {
    try {
      const data = await checkoutService.selectPaymentMethod(
        req.user,
        req.body.methodId
      );
      sc(res, 200, { success: true, message: "Payment selected", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async savedPayment(req: Request, res: Response) {
    try {
      const data = await checkoutService.getSavedPayments(req.user);
      sc(res, 200, { success: true, message: "Saved payments", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const data = await checkoutService.verifyPaymentEligibility(req.user);
      sc(res, 200, { success: true, message: "Payment eligibility", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Order placement
  async finalSummary(req: Request, res: Response) {
    try {
      const data = await checkoutService.finalSummary(req.user);
      sc(res, 200, { success: true, message: "Final summary", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async initiate(req: Request, res: Response) {
    try {
      const data = await checkoutService.initiateCheckout(req.user, req.body);
      sc(res, 200, { success: true, message: "Checkout initiated", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async placeOrder(req: Request, res: Response) {
    try {
      const data = await checkoutService.placeOrder(req.user, req.body);
      sc(res, 200, { success: true, message: "Order placed", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async verifyPaymentEndpoint(req: Request, res: Response) {
    try {
      const data = await checkoutService.verifyPayment(req.user, req.body);
      sc(res, 200, { success: true, message: "Payment verified", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Confirmation
  async confirmation(req: Request, res: Response) {
    try {
      const data = await checkoutService.confirmation(req.params.id);
      sc(res, 200, { success: true, message: "Confirmation", data });
    } catch (err: any) {
      sc(res, 404, { success: false, message: err.message });
    }
  }

  async emailConfirmation(req: Request, res: Response) {
    try {
      await checkoutService.sendConfirmationEmail(
        req.params.id,
        req.body.email
      );
      sc(res, 200, { success: true, message: "Email sent" });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Extra
  async saveState(req: Request, res: Response) {
    try {
      const data = await checkoutService.saveState(req.user, req.body);
      sc(res, 200, { success: true, message: "State saved", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async resume(req: Request, res: Response) {
    try {
      const data = await checkoutService.resume(req.user);
      sc(res, 200, { success: true, message: "Resume checkout", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async deliveryEstimate(req: Request, res: Response) {
    try {
      const data = await checkoutService.deliveryEstimate(req.body);
      sc(res, 200, { success: true, message: "Delivery estimate", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async codCheck(req: Request, res: Response) {
    try {
      const data = await checkoutService.checkCod(req.body.address);
      sc(res, 200, { success: true, message: "COD check", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async taxBreakdown(req: Request, res: Response) {
    try {
      const data = await checkoutService.taxBreakdown(req.user, req.body);
      sc(res, 200, { success: true, message: "Tax breakdown", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async applyGiftcard(req: Request, res: Response) {
    try {
      const data = await checkoutService.applyGiftcard(req.user, req.body.code);
      sc(res, 200, { success: true, message: "Giftcard applied", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async removeGiftcard(req: Request, res: Response) {
    try {
      await checkoutService.removeGiftcard(req.user);
      sc(res, 200, { success: true, message: "Giftcard removed" });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  // Guest
  async guestInitialize(req: Request, res: Response) {
    try {
      const data = await checkoutService.guestInitialize(req.body);
      sc(res, 200, { success: true, message: "Guest initialized", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async guestPlaceOrder(req: Request, res: Response) {
    try {
      const data = await checkoutService.guestPlaceOrder(req.body);
      sc(res, 200, { success: true, message: "Guest order placed", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async guestTrack(req: Request, res: Response) {
    try {
      const data = await checkoutService.guestTrack(
        req.params.id,
        req.params.email
      );
      sc(res, 200, { success: true, message: "Guest tracking", data });
    } catch (err: any) {
      sc(res, 404, { success: false, message: err.message });
    }
  }

  // Abandoned cart & analytics
  async saveCart(req: Request, res: Response) {
    try {
      const data = await checkoutService.saveCart(req.user, req.body);
      sc(res, 200, { success: true, message: "Cart saved", data });
    } catch (err: any) {
      sc(res, 400, { success: false, message: err.message });
    }
  }

  async getAbandoned(req: Request, res: Response) {
    try {
      const data = await checkoutService.getAbandoned(req.query);
      sc(res, 200, { success: true, message: "Abandoned carts", data });
    } catch (err: any) {
      sc(res, 500, { success: false, message: err.message });
    }
  }

  async funnelAnalytics(req: Request, res: Response) {
    try {
      const data = await checkoutService.funnelAnalytics();
      sc(res, 200, { success: true, message: "Funnel analytics", data });
    } catch (err: any) {
      sc(res, 500, { success: false, message: err.message });
    }
  }
}

export const checkoutController = new CheckoutController();
