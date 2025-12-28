"use client";

import { Eye, FileText, Lock, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-2">
              Privacy Policy
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
                Introduction
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Valuva (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you visit our website and use our services. By
                using our services, you consent to the data practices described
                in this policy.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                This policy complies with the Information Technology Act, 2000,
                and the Information Technology (Reasonable Security Practices
                and Procedures and Sensitive Personal Data or Information)
                Rules, 2011 of India.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Eye className="h-5 w-5" />
                Information We Collect
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                    <li>Name, email address, phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>
                      Payment information (processed securely through payment
                      gateways)
                    </li>
                    <li>Date of birth (for age verification where required)</li>
                    <li>
                      Government-issued ID (for KYC compliance, if required)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Automatically Collected Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Usage Data
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                    <li>Product views and interactions</li>
                    <li>Shopping cart contents</li>
                    <li>Purchase history</li>
                    <li>Search queries</li>
                    <li>Preferences and settings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Process payments and prevent fraud</li>
                <li>
                  Communicate with you about products, services, and promotions
                </li>
                <li>Improve our website and customer experience</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Personalize your shopping experience</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Respond to customer service requests</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Data Sharing and Disclosure
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>
                  <strong>Service Providers:</strong> Payment processors,
                  shipping companies, email service providers
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with
                  mergers, acquisitions, or asset sales
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly
                  authorize us to share information
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Lock className="h-5 w-5" />
                Data Security
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We implement industry-standard security measures to protect your
                personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>SSL/TLS encryption for data transmission</li>
                <li>
                  Secure payment processing through PCI-DSS compliant gateways
                </li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Data encryption at rest</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Your Rights (Under Indian Law)
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>
                  Data portability (receive your data in a structured format)
                </li>
                <li>Withdraw consent for data processing</li>
                <li>
                  File a complaint with the Data Protection Authority (when
                  established)
                </li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Cookies and Tracking
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We use cookies and similar technologies to enhance your
                experience. For detailed information, please see our{" "}
                <Link
                  href="/cookie-policy"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Children&apos;s Privacy
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                child, please contact us immediately.
              </p>
            </div>

            {/* Data Retention */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Data Retention
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, comply with legal
                obligations, resolve disputes, and enforce our agreements.
                Transaction records are retained as required by Indian tax and
                commercial laws (typically 6-7 years).
              </p>
            </div>

            {/* International Transfers */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                International Data Transfers
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Your information may be transferred to and processed in
                countries other than India. We ensure appropriate safeguards are
                in place to protect your data in accordance with this Privacy
                Policy and applicable Indian laws.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                Changes to This Policy
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the &quot;Last updated&quot; date. Your
                continued use of our services after such changes constitutes
                acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 pt-6 border-t border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Mail className="h-5 w-5" />
                Contact Us
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                If you have questions about this Privacy Policy or wish to
                exercise your rights, please contact us:
              </p>
              <div className="bg-[#fafafa] rounded-[16px] p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-neutral-500 mt-0.5" />
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
                  <Phone className="h-5 w-5 text-neutral-500 mt-0.5" />
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
