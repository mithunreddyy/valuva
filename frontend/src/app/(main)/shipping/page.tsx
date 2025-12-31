"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Shipping", url: "/shipping", isBold: true },
          ]}
        />
      </div>

      {/* Hero Header - Apple Style */}
      <section className="relative border-b border-[#f5f5f5] bg-gradient-to-b from-white via-white to-[#fafafa]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />
        <div className="container-luxury py-10 sm:py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-4 shadow-lg"
            >
              <Truck className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              Shipping Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs sm:text-sm text-neutral-400 font-normal"
            >
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxury py-10 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Package className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Overview
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              At Valuva, we strive to deliver your orders quickly and safely
              across India. This Shipping Policy outlines our delivery process,
              timelines, and charges in compliance with Indian e-commerce
              regulations and the Consumer Protection Act, 2019.
            </p>
          </motion.div>

          {/* Shipping Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Shipping Areas
              </h2>
            </div>
            <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
                We currently ship to all major cities and towns across India,
                including:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune)",
                  "Tier 1 & 2 Cities",
                  "Tier 3 Cities",
                  "Rural Areas (subject to courier service availability)",
                ].map((area, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 bg-white rounded-[12px] p-3 border border-[#e5e5e5]"
                  >
                    <CheckCircle className="h-4 w-4 text-[#0a0a0a] mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-neutral-700">
                      {area}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-medium mt-4">
                For remote locations, delivery may take additional time. We will
                notify you if your area is not serviceable.
              </p>
            </div>
          </motion.div>

          {/* Delivery Timeframes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Delivery Timeframes
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Standard Delivery",
                  items: [
                    { label: "Metro Cities:", value: "3-5 business days" },
                    {
                      label: "Tier 1 & 2 Cities:",
                      value: "5-7 business days",
                    },
                    { label: "Tier 3 Cities:", value: "7-10 business days" },
                    { label: "Rural Areas:", value: "10-15 business days" },
                  ],
                  note: "Business days exclude Sundays and public holidays. Delivery times are calculated from the date of order confirmation and payment verification.",
                },
                {
                  title: "Express Delivery",
                  desc: "Available for select pin codes in metro and tier 1 cities:",
                  items: [
                    { label: "Metro Cities:", value: "1-2 business days" },
                    { label: "Tier 1 Cities:", value: "2-3 business days" },
                  ],
                  note: "Express delivery charges apply. Available only for orders placed before 2 PM on weekdays.",
                },
              ].map((delivery, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-3">
                    {delivery.title}
                  </h3>
                  {delivery.desc && (
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                      {delivery.desc}
                    </p>
                  )}
                  <div className="space-y-2 mb-3">
                    {delivery.items?.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-3 bg-white rounded-[12px] p-3 border border-[#e5e5e5]"
                      >
                        <span className="text-sm font-medium text-[#0a0a0a]">
                          {item.label}
                        </span>
                        <span className="text-sm text-neutral-600 font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {delivery.note && (
                    <p className="text-xs text-neutral-500 font-medium">
                      {delivery.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Charges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Shipping Charges
            </h2>
            <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5] space-y-4">
              {[
                {
                  title: "Free Shipping",
                  desc: "Free standard shipping is available on orders above ₹999 across India. Free shipping applies to standard delivery only.",
                },
                {
                  title: "Standard Shipping Charges",
                  items: [
                    { label: "Orders below ₹999:", value: "₹99 (flat rate)" },
                    { label: "Orders ₹999 and above:", value: "Free" },
                    { label: "Express Delivery:", value: "Additional ₹199" },
                    {
                      label: "Remote Areas:",
                      value: "Additional ₹50-150 (as applicable)",
                    },
                  ],
                },
                {
                  title: "Cash on Delivery (COD)",
                  desc: "COD charges of ₹50 apply to all Cash on Delivery orders, regardless of order value. COD is available for orders up to ₹5,000.",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a]">
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  )}
                  {item.items && (
                    <div className="space-y-2">
                      {item.items.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center justify-between bg-white rounded-[12px] p-3 border border-[#e5e5e5]"
                        >
                          <span className="text-sm font-medium text-[#0a0a0a]">
                            {subItem.label}
                          </span>
                          <span className="text-sm text-neutral-600 font-medium">
                            {subItem.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Processing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Order Processing
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Order Confirmation",
                  desc: "Once you place an order, you will receive an order confirmation email with order details and estimated delivery date.",
                },
                {
                  step: "2",
                  title: "Payment Verification",
                  desc: "For online payments, we verify payment before processing. This usually takes 1-2 hours during business hours.",
                },
                {
                  step: "3",
                  title: "Order Processing",
                  desc: "Orders are processed within 1-2 business days. During sale periods, processing may take 2-3 business days.",
                },
                {
                  step: "4",
                  title: "Shipment",
                  desc: "Once shipped, you will receive a tracking number via email and SMS. You can track your order in real-time.",
                },
                {
                  step: "5",
                  title: "Delivery",
                  desc: "Our delivery partner will attempt delivery at your address. You will receive SMS/email notifications about delivery attempts.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  className="flex gap-4 bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tracking Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Tracking Your Order
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              You can track your order in multiple ways:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Check your email for tracking updates",
                'Log into your account and visit "My Orders" section',
                "Use the tracking number provided in your shipment confirmation email",
                "Contact our customer support for assistance",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <CheckCircle className="h-4 w-4 text-[#0a0a0a] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 font-medium flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Delivery Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Delivery Issues
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Failed Delivery Attempts",
                  desc: "If delivery fails due to incorrect address, recipient unavailable, or other reasons, our courier partner will make up to 3 attempts. After 3 failed attempts, the order will be returned to us and you will be notified.",
                },
                {
                  title: "Delayed Deliveries",
                  desc: "While we strive to deliver on time, delays may occur due to weather conditions, courier delays, or incorrect addresses. We will keep you informed about any delays and work to resolve them promptly.",
                },
                {
                  title: "Damaged Packages",
                  desc: "If you receive a damaged package, please refuse delivery or contact us within 24 hours. We will arrange for a replacement or full refund.",
                },
                {
                  title: "Wrong Address",
                  desc: "If you need to change your delivery address, contact us within 24 hours of placing the order. Once the order is shipped, address changes may not be possible.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Multiple Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Multiple Items in One Order
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              If your order contains multiple items, they may be shipped
              together or separately depending on availability. If items are
              shipped separately, you will receive separate tracking numbers.
              Shipping charges apply once per order, not per item.
            </p>
          </motion.div>

          {/* International Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              International Shipping
            </h2>
            <div className="bg-yellow-50 border border-yellow-100 rounded-[16px] p-6">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                Currently, we only ship within India. International shipping
                will be available soon. Please check back or subscribe to our
                newsletter for updates.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Need Help?
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              For shipping-related queries, contact us at{" "}
              <a
                href="mailto:shipping@valuva.in"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                shipping@valuva.in
              </a>{" "}
              or call{" "}
              <a
                href="tel:+9118000000000"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                +91 1800 000 0000
              </a>
              . You can also visit our{" "}
              <Link
                href="/support"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                Support page
              </Link>{" "}
              for assistance.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
