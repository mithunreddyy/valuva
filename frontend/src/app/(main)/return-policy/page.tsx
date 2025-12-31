"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Package, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Return Policy", url: "/return-policy", isBold: true },
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
              <RotateCcw className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              Return & Refund Policy
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
              At Valuva, we want you to be completely satisfied with your
              purchase. This Return & Refund Policy complies with the Consumer
              Protection Act, 2019 and E-Commerce Rules, 2020 of India. If
              you&apos;re not satisfied with your purchase, you may return
              eligible items within the specified time period.
            </p>
          </motion.div>

          {/* Return Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Return Window
              </h2>
            </div>
            <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
                You have <strong className="text-[#0a0a0a]">7 days</strong> from
                the date of delivery to initiate a return for eligible items.
              </p>
              <p className="text-xs text-neutral-500 font-medium">
                The return period starts from the date of delivery confirmation.
                For items delivered to remote locations, additional time may be
                provided.
              </p>
            </div>
          </motion.div>

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Return Eligibility
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              Items are eligible for return if they meet all of the following
              conditions:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Item is unused, unwashed, and in original condition",
                "Original tags and labels are attached",
                "Original packaging is intact (if applicable)",
                "Return is initiated within 7 days of delivery",
                "Item is not in the non-returnable category",
                "No signs of wear, damage, or alteration",
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

          {/* Non-Returnable Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <XCircle className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Non-Returnable Items
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              The following items cannot be returned as per Indian e-commerce
              regulations and hygiene standards:
            </p>
            <div className="bg-red-50 border border-red-100 rounded-[16px] p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Intimate apparel (underwear, innerwear, swimwear)",
                  "Personalized or customized items",
                  "Items damaged by misuse or normal wear",
                  "Items without original tags or packaging",
                  "Items that have been washed, worn, or altered",
                  "Items purchased during clearance or final sale",
                  "Gift cards and vouchers",
                  "Items with hygiene concerns",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 bg-white rounded-[12px] p-3 border border-red-100"
                  >
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-700 font-medium flex-1">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How to Return */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              How to Initiate a Return
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Log into Your Account",
                  desc: 'Go to your dashboard and navigate to "Orders" section.',
                },
                {
                  step: "2",
                  title: "Select Order to Return",
                  desc: 'Click on the order you want to return and select "Return Item".',
                },
                {
                  step: "3",
                  title: "Select Items and Reason",
                  desc: "Choose the items you want to return and select a reason from the dropdown menu.",
                },
                {
                  step: "4",
                  title: "Schedule Pickup",
                  desc: "Our logistics partner will pick up the item from your address within 2-3 business days.",
                },
                {
                  step: "5",
                  title: "Receive Refund",
                  desc: "Once we receive and inspect the item, your refund will be processed within 7-14 business days.",
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

          {/* Return Reasons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Valid Return Reasons
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Size doesn't fit",
                "Color mismatch",
                "Quality issues",
                "Damaged item",
                "Wrong item received",
                "Not as described",
                "Changed my mind",
                "Defective product",
              ].map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.05, duration: 0.3 }}
                  className="bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5] text-center"
                >
                  <p className="text-sm font-medium text-[#0a0a0a]">{reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Refund Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Refund Process
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Refund Timeline",
                  desc: "Refunds are processed within 7-14 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.",
                },
                {
                  title: "Refund Methods",
                  items: [
                    {
                      label: "Online Payments:",
                      text: "Refunded to original payment method (credit/debit card, UPI, net banking)",
                    },
                    {
                      label: "Cash on Delivery:",
                      text: "Refunded via bank transfer to the account provided",
                    },
                    {
                      label: "Store Credit:",
                      text: "Option to receive refund as store credit for faster processing",
                    },
                  ],
                },
                {
                  title: "Shipping Costs",
                  desc: "Original shipping charges are non-refundable unless the return is due to our error (wrong item, damaged item, or defective product). Return shipping is free for eligible returns.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-3">
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
                        <div key={subIndex} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-[#0a0a0a]">
                            {subItem.label}
                          </span>
                          <span className="text-sm text-neutral-600 font-medium">
                            {subItem.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Exchange Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Exchange Policy
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              We offer exchanges for size or color within 7 days of delivery,
              subject to product availability. To exchange an item:
            </p>
            <div className="space-y-2">
              {[
                "Initiate a return for the original item",
                'Select "Exchange" instead of "Refund"',
                "Choose the new size or color",
                "Pay any price difference if applicable",
                "New item will be shipped once we receive the original",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-neutral-700 font-medium flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Defective Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Defective or Damaged Products
            </h2>
            <div className="bg-yellow-50 border border-yellow-100 rounded-[16px] p-6">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
                If you receive a defective or damaged product, please contact us
                immediately within 48 hours of delivery. We will:
              </p>
              <div className="space-y-2">
                {[
                  "Arrange for immediate replacement or full refund",
                  "Cover all return shipping costs",
                  "Process refund/replacement on priority basis",
                  "Provide compensation if delivery is significantly delayed",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 bg-white rounded-[12px] p-3 border border-yellow-100"
                  >
                    <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-700 font-medium flex-1">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Cancellation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Order Cancellation
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You may cancel your order before it is shipped. Once an order is
              shipped, you can return it as per our return policy. Cancelled
              orders are refunded within 3-5 business days.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Need Help?
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              For return-related queries, contact us at{" "}
              <a
                href="mailto:returns@valuva.in"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                returns@valuva.in
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
