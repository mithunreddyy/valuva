"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Return Policy", url: "/return-policy", isBold: true },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] mb-1 leading-[0.95]">
              Return & Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal">
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
      <section className="container-luxury py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5 space-y-5">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Package className="h-6 w-6" />
                Overview
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                At Valuva, we want you to be completely satisfied with your
                purchase. This Return & Refund Policy complies with the Consumer
                Protection Act, 2019 and E-Commerce Rules, 2020 of India. If
                you&apos;re not satisfied with your purchase, you may return
                eligible items within the specified time period.
              </p>
            </div>

            {/* Return Window */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Clock className="h-6 w-6" />
                Return Window
              </h2>
              <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5]">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                  You have <strong className="text-[#0a0a0a]">7 days</strong>{" "}
                  from the date of delivery to initiate a return for eligible
                  items.
                </p>
                <p className="text-xs text-neutral-500 font-medium">
                  The return period starts from the date of delivery
                  confirmation. For items delivered to remote locations,
                  additional time may be provided.
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <CheckCircle className="h-6 w-6" />
                Return Eligibility
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                Items are eligible for return if they meet all of the following
                conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Item is unused, unwashed, and in original condition</li>
                <li>Original tags and labels are attached</li>
                <li>Original packaging is intact (if applicable)</li>
                <li>Return is initiated within 7 days of delivery</li>
                <li>Item is not in the non-returnable category (see below)</li>
                <li>No signs of wear, damage, or alteration</li>
              </ul>
            </div>

            {/* Non-Returnable Items */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <XCircle className="h-6 w-6" />
                Non-Returnable Items
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                The following items cannot be returned as per Indian e-commerce
                regulations and hygiene standards:
              </p>
              <div className="bg-red-50 border border-red-100 rounded-[16px] p-6">
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                  <li>Intimate apparel (underwear, innerwear, swimwear)</li>
                  <li>Personalized or customized items</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Items without original tags or packaging</li>
                  <li>Items that have been washed, worn, or altered</li>
                  <li>Items purchased during clearance or final sale</li>
                  <li>Gift cards and vouchers</li>
                  <li>
                    Items with hygiene concerns (as per Consumer Protection Act)
                  </li>
                </ul>
              </div>
            </div>

            {/* How to Return */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                How to Initiate a Return
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Log into Your Account
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Go to your dashboard and navigate to &quot;Orders&quot;
                      section.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Select Order to Return
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Click on the order you want to return and select
                      &quot;Return Item&quot;.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Select Items and Reason
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Choose the items you want to return and select a reason
                      from the dropdown menu.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Schedule Pickup
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Our logistics partner will pick up the item from your
                      address within 2-3 business days.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                      Receive Refund
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                      Once we receive and inspect the item, your refund will be
                      processed within 7-14 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Reasons */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
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
                ].map((reason) => (
                  <div
                    key={reason}
                    className="bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                  >
                    <p className="text-sm font-medium text-[#0a0a0a]">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Process */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Refund Process
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Refund Timeline
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Refunds are processed within 7-14 business days after we
                    receive and inspect the returned item. The refund will be
                    credited to your original payment method.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Refund Methods
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 font-medium">
                    <li>
                      <strong>Online Payments:</strong> Refunded to original
                      payment method (credit/debit card, UPI, net banking)
                    </li>
                    <li>
                      <strong>Cash on Delivery:</strong> Refunded via bank
                      transfer to the account provided
                    </li>
                    <li>
                      <strong>Store Credit:</strong> Option to receive refund as
                      store credit for faster processing
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Shipping Costs
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Original shipping charges are non-refundable unless the
                    return is due to our error (wrong item, damaged item, or
                    defective product). Return shipping is free for eligible
                    returns.
                  </p>
                </div>
              </div>
            </div>

            {/* Exchange Policy */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Exchange Policy
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We offer exchanges for size or color within 7 days of delivery,
                subject to product availability. To exchange an item:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 font-medium ml-2">
                <li>Initiate a return for the original item</li>
                <li>
                  Select &quot;Exchange&quot; instead of &quot;Refund&quot;
                </li>
                <li>Choose the new size or color</li>
                <li>Pay any price difference if applicable</li>
                <li>New item will be shipped once we receive the original</li>
              </ol>
            </div>

            {/* Defective Products */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Defective or Damaged Products
              </h2>
              <div className="bg-yellow-50 border border-yellow-100 rounded-[16px] p-6">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                  If you receive a defective or damaged product, please contact
                  us immediately within 48 hours of delivery. We will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                  <li>Arrange for immediate replacement or full refund</li>
                  <li>Cover all return shipping costs</li>
                  <li>Process refund/replacement on priority basis</li>
                  <li>
                    Provide compensation if delivery is significantly delayed
                  </li>
                </ul>
              </div>
            </div>

            {/* Cancellation */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Order Cancellation
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You may cancel your order before it is shipped. Once an order is
                shipped, you can return it as per our return policy. Cancelled
                orders are refunded within 3-5 business days.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Need Help?
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                For return-related queries, contact us at{" "}
                <a
                  href="mailto:returns@valuva.in"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  returns@valuva.in
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
