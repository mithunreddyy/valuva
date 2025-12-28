"use client";

import { AlertCircle, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-2">
              Terms of Service
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
            {/* Introduction */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <FileText className="h-5 w-5" />
                Agreement to Terms
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                These Terms of Service (&quot;Terms&quot;) govern your access to
                and use of the Valuva website and services. By accessing or
                using our services, you agree to be bound by these Terms. If you
                do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                These Terms are governed by the laws of India and are subject to
                the jurisdiction of Indian courts.
              </p>
            </div>

            {/* Eligibility */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Eligibility
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You must be at least 18 years old to use our services. By using
                our services, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>You are at least 18 years of age</li>
                <li>
                  You have the legal capacity to enter into binding agreements
                </li>
                <li>
                  You will comply with all applicable laws and regulations
                </li>
                <li>All information you provide is accurate and current</li>
              </ul>
            </div>

            {/* Account Registration */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Account Registration
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                To make purchases, you may need to create an account. You agree
                to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </div>

            {/* Products and Pricing */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Products and Pricing
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Product Information
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    We strive to provide accurate product descriptions, images,
                    and pricing. However, we do not warrant that product
                    descriptions or other content are accurate, complete,
                    reliable, current, or error-free.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Pricing
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    All prices are in Indian Rupees (INR) and include applicable
                    taxes (GST) unless otherwise stated. We reserve the right to
                    change prices at any time without prior notice. Prices are
                    subject to change until payment is confirmed.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
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
            </div>

            {/* Orders and Payment */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Orders and Payment
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Order Acceptance
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Your order is an offer to purchase. We reserve the right to
                    accept or reject your order for any reason, including
                    product availability, pricing errors, or suspected fraud.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Payment Methods
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    We accept various payment methods including credit/debit
                    cards, UPI, net banking, and cash on delivery (COD). Payment
                    must be received before order processing, except for COD
                    orders.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Payment Security
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    All payments are processed through secure, PCI-DSS compliant
                    payment gateways. We do not store your complete payment card
                    information.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Shipping and Delivery
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Shipping Areas
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    We currently ship within India. Shipping costs and estimated
                    delivery times are calculated at checkout based on your
                    location.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Delivery Times
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Estimated delivery times are provided at checkout. Actual
                    delivery times may vary due to factors beyond our control,
                    including weather, carrier delays, or incorrect addresses.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Risk of Loss
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Title and risk of loss pass to you upon delivery to the
                    shipping carrier. We are not responsible for loss or damage
                    during transit, but we will assist with carrier claims.
                  </p>
                </div>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div className="space-y-3">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-3">
                <CheckCircle className="h-6 w-6" />
                Returns and Refunds
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Return Policy
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    You may return unused, unwashed items in original packaging
                    within 7 days of delivery for a full refund or exchange,
                    subject to our{" "}
                    <Link
                      href="/return-policy"
                      className="text-[#0a0a0a] underline font-medium"
                    >
                      Return Policy
                    </Link>
                    . Items must be in original condition with tags attached.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Refund Processing
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Refunds will be processed to the original payment method
                    within 7-14 business days after we receive and inspect the
                    returned item. For COD orders, refunds will be processed via
                    bank transfer.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Non-Returnable Items
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Certain items are non-returnable, including personalized
                    items, intimate apparel, and items damaged by misuse. See
                    our Return Policy for complete details.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Intellectual Property
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                All content on our website, including text, graphics, logos,
                images, and software, is the property of Valuva or its licensors
                and is protected by Indian and international copyright and
                trademark laws. You may not reproduce, distribute, or create
                derivative works without our written permission.
              </p>
            </div>

            {/* Prohibited Uses */}
            <div className="space-y-3">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-3">
                <AlertCircle className="h-6 w-6" />
                Prohibited Uses
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Use our services for any illegal purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use automated systems to access our website</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Limitation of Liability
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                To the maximum extent permitted by Indian law, Valuva shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from your use of
                our services.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Our total liability shall not exceed the amount you paid for the
                product or service in question.
              </p>
            </div>

            {/* Indemnification */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Indemnification
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You agree to indemnify, defend, and hold harmless Valuva, its
                officers, directors, employees, and agents from any claims,
                damages, losses, liabilities, and expenses (including legal
                fees) arising from your use of our services, violation of these
                Terms, or infringement of any rights of another.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Dispute Resolution
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Governing Law
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    These Terms are governed by the laws of India. Any disputes
                    shall be subject to the exclusive jurisdiction of courts in
                    [Your City], India.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Consumer Grievances
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    In case of any grievances, you may contact our customer
                    support or file a complaint with the Consumer Disputes
                    Redressal Commission as per the Consumer Protection Act,
                    2019.
                  </p>
                </div>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Changes to Terms
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We reserve the right to modify these Terms at any time. We will
                notify you of material changes by posting the updated Terms on
                this page and updating the &quot;Last updated&quot; date. Your
                continued use of our services after such changes constitutes
                acceptance of the updated Terms.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Contact Us
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                If you have questions about these Terms, please contact us at{" "}
                <a
                  href="mailto:legal@valuva.in"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  legal@valuva.in
                </a>{" "}
                or refer to our{" "}
                <Link
                  href="/contact"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  Contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
