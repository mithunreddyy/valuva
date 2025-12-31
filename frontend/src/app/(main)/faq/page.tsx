"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Orders & Payment",
    question: "How do I place an order?",
    answer:
      "Simply browse our collection, select your desired items, add them to cart, and proceed to checkout. You can pay using credit/debit cards, UPI, net banking, or cash on delivery (COD).",
  },
  {
    category: "Orders & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), net banking, and Cash on Delivery (COD) for orders up to ₹5,000.",
  },
  {
    category: "Orders & Payment",
    question: "Is it safe to pay online?",
    answer:
      "Yes, all online payments are processed through secure, PCI-DSS compliant payment gateways. We do not store your complete payment card information. Your financial data is encrypted and protected.",
  },
  {
    category: "Orders & Payment",
    question: "Can I modify or cancel my order?",
    answer:
      "You can cancel your order before it is shipped. Once shipped, you can return it as per our return policy. To modify an order, please contact our customer support within 24 hours of placing the order.",
  },
  {
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 3-5 business days for metro cities, 5-7 days for tier 1 & 2 cities, and 7-15 days for other areas. Express delivery (1-2 days) is available for select locations.",
  },
  {
    category: "Shipping & Delivery",
    question: "Do you ship to all cities in India?",
    answer:
      "Yes, we ship to all major cities and towns across India. For remote locations, delivery may take additional time. We will notify you if your area is not serviceable.",
  },
  {
    category: "Shipping & Delivery",
    question: "What are the shipping charges?",
    answer:
      "Shipping is free on orders above ₹999. For orders below ₹999, standard shipping charges are ₹99. Express delivery charges are ₹199 additional. COD charges of ₹50 apply to all Cash on Delivery orders.",
  },
  {
    category: "Shipping & Delivery",
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order by logging into your account and visiting the 'My Orders' section, or by using the tracking link provided in your email.",
  },
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: (
      <>
        You can return unused, unwashed items in original packaging within 7
        days of delivery for a full refund or exchange. Items must be in
        original condition with tags attached. For detailed information, please
        see our{" "}
        <Link
          href="/return-policy"
          className="text-[#0a0a0a] underline font-medium"
        >
          Return Policy
        </Link>
        .
      </>
    ),
  },
  {
    category: "Returns & Exchanges",
    question: "Which items cannot be returned?",
    answer:
      "Intimate apparel (underwear, innerwear, swimwear), personalized items, items without original tags, washed or worn items, and items purchased during clearance sales cannot be returned as per Indian e-commerce regulations.",
  },
  {
    category: "Returns & Exchanges",
    question: "How do I initiate a return?",
    answer:
      "Log into your account, go to 'My Orders', select the order you want to return, and click 'Return Item'. Choose the items and reason for return. Our logistics partner will pick up the item within 2-3 business days.",
  },
  {
    category: "Returns & Exchanges",
    question: "How long does it take to process a refund?",
    answer:
      "Refunds are processed within 7-14 business days after we receive and inspect the returned item. The refund will be credited to your original payment method. For COD orders, refunds are processed via bank transfer.",
  },
  {
    category: "Products & Sizing",
    question: "How do I know my size?",
    answer:
      "Each product page includes a detailed size guide with measurements. We recommend measuring yourself and comparing with our size chart. If you're unsure, our customer support team can help you choose the right size.",
  },
  {
    category: "Products & Sizing",
    question: "Do you offer size exchanges?",
    answer:
      "Yes, we offer size exchanges within 7 days of delivery, subject to product availability. You can initiate an exchange through your account dashboard. Any price difference will need to be paid if applicable.",
  },
  {
    category: "Products & Sizing",
    question: "Are the product colors accurate?",
    answer:
      "We strive to display product colors as accurately as possible. However, colors may vary slightly due to monitor settings and lighting conditions. If you receive a product with significant color variation, you can return it.",
  },
  {
    category: "Products & Sizing",
    question: "What if I receive a damaged or defective product?",
    answer:
      "If you receive a damaged or defective product, please contact us within 48 hours of delivery. We will arrange for immediate replacement or full refund, and cover all return shipping costs.",
  },
  {
    category: "Account & Profile",
    question: "How do I create an account?",
    answer:
      "Click on 'Sign Up' or 'Register' in the header, fill in your details (name, email, password), and verify your email address. You can also create an account during checkout.",
  },
  {
    category: "Account & Profile",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password.",
  },
  {
    category: "Account & Profile",
    question: "How do I update my profile information?",
    answer:
      "Log into your account, go to 'My Profile' or 'Account Settings', and update your information. You can change your name, email, phone number, and address details.",
  },
  {
    category: "Account & Profile",
    question: "How do I manage my addresses?",
    answer:
      "Go to 'My Account' → 'Addresses' to add, edit, or delete shipping addresses. You can set a default address for faster checkout.",
  },
  {
    category: "General",
    question: "Do you have physical stores?",
    answer:
      "Currently, we operate as an online-only store. We are working on opening physical stores in major cities. Subscribe to our newsletter to stay updated.",
  },
  {
    category: "General",
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, gift wrapping is available for select products. You can add gift wrapping during checkout. We also offer gift messages that will be included with your order.",
  },
  {
    category: "General",
    question: "How do I contact customer support?",
    answer: (
      <>
        You can reach us via email at{" "}
        <a
          href="mailto:support@valuva.in"
          className="text-[#0a0a0a] underline font-medium"
        >
          support@valuva.in
        </a>
        , call us at{" "}
        <a
          href="tel:+9118000000000"
          className="text-[#0a0a0a] underline font-medium"
        >
          +91 1800 000 0000
        </a>
        , or visit our{" "}
        <Link href="/contact" className="text-[#0a0a0a] underline font-medium">
          Contact page
        </Link>
        . Our support team is available Monday to Saturday, 9 AM to 6 PM IST.
      </>
    ),
  },
  {
    category: "General",
    question: "Do you have a loyalty program?",
    answer:
      "Yes, we have a loyalty program where you earn points on every purchase. Points can be redeemed for discounts on future orders. Check your account dashboard for your points balance.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];
  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] mb-1 leading-[0.95]">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal">
              Find answers to common questions about orders, shipping, returns,
              and more
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxury py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#0a0a0a] text-[#fafafa]"
                      : "bg-white border border-[#e5e5e5] text-neutral-700 hover:border-[#0a0a0a]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="bg-white border border-[#e5e5e5] rounded-[20px] overflow-hidden">
            {filteredFAQs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border-b border-[#e5e5e5] last:border-b-0 transition-all ${
                    isOpen ? "bg-[#fafafa]" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-start justify-between gap-4 text-left hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-neutral-500 font-medium mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-base sm:text-lg font-medium tracking-normal text-[#0a0a0a]">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-neutral-500 flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-5 sm:pb-6">
                      <div className="text-sm text-neutral-700 leading-relaxed font-medium">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Have Questions */}
          <div className="mt-8 bg-[#fafafa] border border-[#e5e5e5] rounded-[20px] p-8 text-center">
            <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] mb-3">
              Still have questions?
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-4">
              Can&apos;t find the answer you&apos;re looking for? Please reach
              out to our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@valuva.in"
                className="text-sm text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                support@valuva.in
              </a>
              <span className="text-xs text-neutral-300 hidden sm:inline">
                •
              </span>
              <a
                href="tel:+9118000000000"
                className="text-sm text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                +91 1800 000 0000
              </a>
              <span className="text-xs text-neutral-300 hidden sm:inline">
                •
              </span>
              <Link
                href="/contact"
                className="text-sm text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
