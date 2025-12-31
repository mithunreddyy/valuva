"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, FileText, Scale } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            {
              name: "Terms of Service",
              url: "/terms-of-service",
              isBold: true,
            },
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
              <Scale className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              Terms of Service
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
          {/* Agreement to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Agreement to Terms
              </h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to
                and use of the Valuva website and services. By accessing or
                using our services, you agree to be bound by these Terms. If you
                do not agree to these Terms, please do not use our services.
              </p>
              <p>
                These Terms are governed by the laws of India and are subject to
                the jurisdiction of Indian courts.
              </p>
            </div>
          </motion.div>

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Eligibility
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You must be at least 18 years old to use our services. By using
              our services, you represent and warrant that:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "You are at least 18 years of age",
                "You have the legal capacity to enter into binding agreements",
                "You will comply with all applicable laws and regulations",
                "All information you provide is accurate and current",
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

          {/* Account Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Account Registration
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              To make purchases, you may need to create an account. You agree
              to:
            </p>
            <div className="space-y-2">
              {[
                "Provide accurate, current, and complete information",
                "Maintain and update your account information",
                "Maintain the security of your account credentials",
                "Accept responsibility for all activities under your account",
                "Notify us immediately of any unauthorized access",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 font-medium flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Products and Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Products and Pricing
            </h2>
            <div className="space-y-4">
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                  Product Information
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  We strive to provide accurate product descriptions, images,
                  and pricing. However, we do not warrant that product
                  descriptions or other content are accurate, complete,
                  reliable, current, or error-free.
                </p>
              </div>
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                  Pricing
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  All prices are in Indian Rupees (INR) and include applicable
                  taxes (GST) unless otherwise stated. We reserve the right to
                  change prices at any time without prior notice. Prices are
                  subject to change until payment is confirmed.
                </p>
              </div>
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                  Availability
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  Product availability is subject to change. We reserve the
                  right to limit quantities and refuse orders. If a product
                  becomes unavailable after you place an order, we will notify
                  you and provide a refund.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Orders and Payment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Orders and Payment
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Order Acceptance",
                  desc: "Your order is an offer to purchase. We reserve the right to accept or reject your order for any reason, including product availability, pricing errors, or suspected fraud.",
                },
                {
                  title: "Payment Methods",
                  desc: "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery (COD). Payment must be received before order processing, except for COD orders.",
                },
                {
                  title: "Payment Security",
                  desc: "All payments are processed through secure, PCI-DSS compliant payment gateways. We do not store your complete payment card information.",
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

          {/* Shipping and Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Shipping and Delivery
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Shipping Areas",
                  desc: "We currently ship within India. Shipping costs and estimated delivery times are calculated at checkout based on your location.",
                },
                {
                  title: "Delivery Times",
                  desc: "Estimated delivery times are provided at checkout. Actual delivery times may vary due to factors beyond our control, including weather, carrier delays, or incorrect addresses.",
                },
                {
                  title: "Risk of Loss",
                  desc: "Title and risk of loss pass to you upon delivery to the shipping carrier. We are not responsible for loss or damage during transit, but we will assist with carrier claims.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]"
                >
                  <h3 className="text-sm font-medium text-[#0a0a0a] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Returns and Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Returns and Refunds
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Return Policy",
                  desc: (
                    <>
                      You may return unused, unwashed items in original
                      packaging within 7 days of delivery for a full refund or
                      exchange, subject to our{" "}
                      <Link
                        href="/return-policy"
                        className="text-[#0a0a0a] underline font-medium hover:no-underline"
                      >
                        Return Policy
                      </Link>
                      . Items must be in original condition with tags attached.
                    </>
                  ),
                },
                {
                  title: "Refund Processing",
                  desc: "Refunds will be processed to the original payment method within 7-14 business days after we receive and inspect the returned item. For COD orders, refunds will be processed via bank transfer.",
                },
                {
                  title: "Non-Returnable Items",
                  desc: "Certain items are non-returnable, including personalized items, intimate apparel, and items damaged by misuse. See our Return Policy for complete details.",
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

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Intellectual Property
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              All content on our website, including text, graphics, logos,
              images, and software, is the property of Valuva or its licensors
              and is protected by Indian and international copyright and
              trademark laws. You may not reproduce, distribute, or create
              derivative works without our written permission.
            </p>
          </motion.div>

          {/* Prohibited Uses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Prohibited Uses
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              You agree not to:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Use our services for any illegal purpose",
                "Violate any applicable laws or regulations",
                "Infringe upon intellectual property rights",
                "Transmit viruses or malicious code",
                "Attempt to gain unauthorized access to our systems",
                "Interfere with or disrupt our services",
                "Use automated systems to access our website",
                "Impersonate any person or entity",
                "Collect user information without consent",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 font-medium flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Limitation of Liability
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              <p>
                To the maximum extent permitted by Indian law, Valuva shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from your use of
                our services.
              </p>
              <p>
                Our total liability shall not exceed the amount you paid for the
                product or service in question.
              </p>
            </div>
          </motion.div>

          {/* Indemnification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Indemnification
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You agree to indemnify, defend, and hold harmless Valuva, its
              officers, directors, employees, and agents from any claims,
              damages, losses, liabilities, and expenses (including legal fees)
              arising from your use of our services, violation of these Terms,
              or infringement of any rights of another.
            </p>
          </motion.div>

          {/* Dispute Resolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Dispute Resolution
            </h2>
            <div className="space-y-4">
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                  Governing Law
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  These Terms are governed by the laws of India. Any disputes
                  shall be subject to the exclusive jurisdiction of courts in
                  [Your City], India.
                </p>
              </div>
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                  Consumer Grievances
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  In case of any grievances, you may contact our customer
                  support or file a complaint with the Consumer Disputes
                  Redressal Commission as per the Consumer Protection Act, 2019.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Changes to Terms
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              We reserve the right to modify these Terms at any time. We will
              notify you of material changes by posting the updated Terms on
              this page and updating the &quot;Last updated&quot; date. Your
              continued use of our services after such changes constitutes
              acceptance of the updated Terms.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Contact Us
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@valuva.in"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                legal@valuva.in
              </a>{" "}
              or refer to our{" "}
              <Link
                href="/contact"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                Contact page
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
