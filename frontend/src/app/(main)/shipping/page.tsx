"use client";

import { AlertCircle, CheckCircle, Clock, MapPin, Package } from "lucide-react";
import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-2">
              Shipping Policy
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxury py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5 sm:p-6 space-y-6">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Package className="h-6 w-6" />
                Overview
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                At Valuva, we strive to deliver your orders quickly and safely
                across India. This Shipping Policy outlines our delivery
                process, timelines, and charges in compliance with Indian
                e-commerce regulations and the Consumer Protection Act, 2019.
              </p>
            </div>

            {/* Shipping Areas */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <MapPin className="h-6 w-6" />
                Shipping Areas
              </h2>
              <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                  We currently ship to all major cities and towns across India,
                  including:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune)",
                    "Tier 1 & 2 Cities",
                    "Tier 3 Cities",
                    "Rural Areas (subject to courier service availability)",
                  ].map((area) => (
                    <div key={area} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#0a0a0a] mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-neutral-700">
                        {area}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 font-medium mt-4">
                  For remote locations, delivery may take additional time. We
                  will notify you if your area is not serviceable.
                </p>
              </div>
            </div>

            {/* Delivery Timeframes */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Clock className="h-6 w-6" />
                Delivery Timeframes
              </h2>
              <div className="space-y-4">
                <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-3">
                    Standard Delivery
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                    <li>
                      <strong>Metro Cities:</strong> 3-5 business days
                    </li>
                    <li>
                      <strong>Tier 1 & 2 Cities:</strong> 5-7 business days
                    </li>
                    <li>
                      <strong>Tier 3 Cities:</strong> 7-10 business days
                    </li>
                    <li>
                      <strong>Rural Areas:</strong> 10-15 business days
                    </li>
                  </ul>
                  <p className="text-xs text-neutral-500 font-medium mt-3">
                    Business days exclude Sundays and public holidays. Delivery
                    times are calculated from the date of order confirmation and
                    payment verification.
                  </p>
                </div>

                <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-3">
                    Express Delivery
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    Available for select pin codes in metro and tier 1 cities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                    <li>
                      <strong>Metro Cities:</strong> 1-2 business days
                    </li>
                    <li>
                      <strong>Tier 1 Cities:</strong> 2-3 business days
                    </li>
                  </ul>
                  <p className="text-xs text-neutral-500 font-medium mt-3">
                    Express delivery charges apply. Available only for orders
                    placed before 2 PM on weekdays.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Charges */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Shipping Charges
              </h2>
              <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Free Shipping
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Free standard shipping is available on orders above ₹999
                      across India. Free shipping applies to standard delivery
                      only.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Standard Shipping Charges
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                      <li>
                        <strong>Orders below ₹999:</strong> ₹99 (flat rate)
                      </li>
                      <li>
                        <strong>Orders ₹999 and above:</strong> Free
                      </li>
                      <li>
                        <strong>Express Delivery:</strong> Additional ₹199
                      </li>
                      <li>
                        <strong>Remote Areas:</strong> Additional ₹50-150 (as
                        applicable)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Cash on Delivery (COD)
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      COD charges of ₹50 apply to all Cash on Delivery orders,
                      regardless of order value. COD is available for orders up
                      to ₹5,000.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Processing */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Order Processing
              </h2>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Order Confirmation
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Once you place an order, you will receive an order
                      confirmation email with order details and estimated
                      delivery date.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Payment Verification
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      For online payments, we verify payment before processing.
                      This usually takes 1-2 hours during business hours.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Order Processing
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Orders are processed within 1-2 business days. During sale
                      periods, processing may take 2-3 business days.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Shipment
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Once shipped, you will receive a tracking number via email
                      and SMS. You can track your order in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Delivery
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Our delivery partner will attempt delivery at your
                      address. You will receive SMS/email notifications about
                      delivery attempts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Orders */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Tracking Your Order
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You can track your order in multiple ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Check your email for tracking updates</li>
                <li>
                  Log into your account and visit &quot;My Orders&quot; section
                </li>
                <li>
                  Use the tracking number provided in your shipment confirmation
                  email
                </li>
                <li>Contact our customer support for assistance</li>
              </ul>
            </div>

            {/* Delivery Issues */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <AlertCircle className="h-6 w-6" />
                Delivery Issues
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Failed Delivery Attempts
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    If delivery fails due to incorrect address, recipient
                    unavailable, or other reasons, our courier partner will make
                    up to 3 attempts. After 3 failed attempts, the order will be
                    returned to us and you will be notified.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Delayed Deliveries
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    While we strive to deliver on time, delays may occur due to
                    weather conditions, courier delays, or incorrect addresses.
                    We will keep you informed about any delays and work to
                    resolve them promptly.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Damaged Packages
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    If you receive a damaged package, please refuse delivery or
                    contact us within 24 hours. We will arrange for a
                    replacement or full refund.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Wrong Address
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    If you need to change your delivery address, contact us
                    within 24 hours of placing the order. Once the order is
                    shipped, address changes may not be possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Multiple Items */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Multiple Items in One Order
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                If your order contains multiple items, they may be shipped
                together or separately depending on availability. If items are
                shipped separately, you will receive separate tracking numbers.
                Shipping charges apply once per order, not per item.
              </p>
            </div>

            {/* International Shipping */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                International Shipping
              </h2>
              <div className="bg-yellow-50 border border-yellow-100 rounded-[16px] p-6">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  Currently, we only ship within India. International shipping
                  will be available soon. Please check back or subscribe to our
                  newsletter for updates.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Need Help?
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                For shipping-related queries, contact us at{" "}
                <a
                  href="mailto:shipping@valuva.in"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  shipping@valuva.in
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+9118000000000"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  +91 1800 000 0000
                </a>
                . You can also visit our{" "}
                <Link
                  href="/support"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  Support page
                </Link>{" "}
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
