"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { motion } from "framer-motion";
import { Eye, FileText, Lock, Mail, Phone, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy-policy", isBold: true },
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
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              Privacy Policy
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
          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Introduction
              </h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              <p>
                Valuva (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you visit our website and use our services. By
                using our services, you consent to the data practices described
                in this policy.
              </p>
              <p>
                This policy complies with the Information Technology Act, 2000,
                and the Information Technology (Reasonable Security Practices
                and Procedures and Sensitive Personal Data or Information)
                Rules, 2011 of India.
              </p>
            </div>
          </motion.div>

          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Eye className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Information We Collect
              </h2>
            </div>

            <div className="space-y-5">
              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-3">
                  Personal Information
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Name, email address, phone number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Billing and shipping addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>
                      Payment information (processed securely through payment
                      gateways)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>
                      Date of birth (for age verification where required)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>
                      Government-issued ID (for KYC compliance, if required)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-3">
                  Automatically Collected Information
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>IP address and device information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Pages visited and time spent on pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Referring website addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Cookies and similar tracking technologies</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]">
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-3">
                  Usage Data
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Product views and interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Shopping cart contents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Purchase history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Search queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0a0a0a] mt-1.5">•</span>
                    <span>Preferences and settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* How We Use Your Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              How We Use Your Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Process and fulfill your orders",
                "Send order confirmations and shipping updates",
                "Process payments and prevent fraud",
                "Communicate about products and promotions",
                "Improve our website and customer experience",
                "Comply with legal obligations",
                "Personalize your shopping experience",
                "Respond to customer service requests",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <span className="text-[#0a0a0a] mt-0.5">•</span>
                  <span className="text-sm text-neutral-700 font-medium flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Data Sharing and Disclosure
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Service Providers",
                  desc: "Payment processors, shipping companies, email service providers",
                },
                {
                  title: "Legal Requirements",
                  desc: "When required by law or to protect our rights",
                },
                {
                  title: "Business Transfers",
                  desc: "In connection with mergers, acquisitions, or asset sales",
                },
                {
                  title: "With Your Consent",
                  desc: "When you explicitly authorize us to share information",
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

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Data Security
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              We implement industry-standard security measures to protect your
              personal information, including:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "SSL/TLS encryption for data transmission",
                "Secure payment processing (PCI-DSS compliant)",
                "Regular security audits and updates",
                "Access controls and authentication",
                "Data encryption at rest",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                  <span className="text-sm text-neutral-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Your Rights (Under Indian Law)
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You have the right to:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Access your personal information",
                "Correct inaccurate information",
                "Request deletion of your data",
                "Object to processing",
                "Data portability",
                "Withdraw consent",
                "File a complaint with DPA",
              ].map((right, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 bg-[#fafafa] rounded-[12px] p-3 border border-[#e5e5e5]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                  <span className="text-sm text-neutral-700 font-medium">
                    {right}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Other Sections */}
          {[
            {
              title: "Cookies and Tracking",
              content: (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                  We use cookies and similar technologies to enhance your
                  experience. For detailed information, please see our{" "}
                  <Link
                    href="/cookie-policy"
                    className="text-[#0a0a0a] underline font-medium hover:no-underline"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              ),
            },
            {
              title: "Children's Privacy",
              content: (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                  Our services are not intended for individuals under the age of
                  18. We do not knowingly collect personal information from
                  children. If you believe we have collected information from a
                  child, please contact us immediately.
                </p>
              ),
            },
            {
              title: "Data Retention",
              content: (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                  We retain your personal information for as long as necessary
                  to fulfill the purposes outlined in this policy, comply with
                  legal obligations, resolve disputes, and enforce our
                  agreements. Transaction records are retained as required by
                  Indian tax and commercial laws (typically 6-7 years).
                </p>
              ),
            },
            {
              title: "International Data Transfers",
              content: (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                  Your information may be transferred to and processed in
                  countries other than India. We ensure appropriate safeguards
                  are in place to protect your data in accordance with this
                  Privacy Policy and applicable Indian laws.
                </p>
              ),
            },
            {
              title: "Changes to This Policy",
              content: (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the &quot;Last updated&quot; date.
                  Your continued use of our services after such changes
                  constitutes acceptance of the updated policy.
                </p>
              ),
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                {section.title}
              </h2>
              {section.content}
            </motion.div>
          ))}

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Contact Us
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              If you have questions about this Privacy Policy or wish to
              exercise your rights, please contact us:
            </p>
            <div className="bg-[#fafafa] rounded-[16px] p-6 border border-[#e5e5e5] space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:privacy@valuva.in"
                    className="text-sm text-[#0a0a0a] font-medium hover:underline"
                  >
                    privacy@valuva.in
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+9118000000000"
                    className="text-sm text-[#0a0a0a] font-medium hover:underline"
                  >
                    +91 1800 000 0000
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-1">
                  Address
                </p>
                <p className="text-sm text-[#0a0a0a] font-medium">
                  Valuva Private Limited
                  <br />
                  [Your Business Address]
                  <br />
                  India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
