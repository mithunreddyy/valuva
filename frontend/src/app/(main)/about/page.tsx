"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  Leaf,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function AboutPage() {
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: categoriesData } = useCategories();

  const features = [
    {
      icon: <Package className="h-6 w-6" />,
      title: "Quality Products",
      description:
        "We source only the finest materials and products for our customers",
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your orders to you fast",
      color: "bg-green-50 border-green-100",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Shopping",
      description:
        "Your data and payments are protected with industry-leading security",
      color: "bg-purple-50 border-purple-100",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority in everything we do",
      color: "bg-pink-50 border-pink-100",
    },
  ];

  const values = [
    {
      icon: <Award className="h-4 w-4" />,
      title: "Quality",
      description:
        "We never compromise on quality. Every product is carefully selected and tested to meet our high standards.",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      title: "Integrity",
      description:
        "We believe in honest business practices and transparent communication with our customers.",
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Innovation",
      description:
        "We continuously improve our services and embrace new technologies to enhance your shopping experience.",
    },
    {
      icon: <Leaf className="h-4 w-4" />,
      title: "Sustainability",
      description:
        "We support sustainable business practices and are committed to reducing our environmental impact.",
    },
  ];

  // Dynamic stats from API
  const stats = [
    {
      number: productsData?.meta?.total
        ? `${Math.floor(productsData.meta.total / 1000)}K+`
        : "5K+",
      label: "Products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      number: categoriesData?.data?.length
        ? `${categoriesData.data.length}+`
        : "50+",
      label: "Categories",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      number: productsData?.meta?.total
        ? `${Math.floor((productsData.meta.total * 0.1) / 1000)}K+`
        : "10K+",
      label: "Happy Customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      number: productsData?.data?.[0]?.averageRating
        ? productsData.data[0].averageRating.toFixed(1)
        : "4.8",
      label: "Average Rating",
      icon: <Star className="h-5 w-5 fill-current" />,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "About", url: "/about", isBold: true },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-3"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e5e5e5] rounded-[12px] mb-2"
            >
              <Sparkles className="h-3 w-3 text-neutral-500" />
              <span className="text-[10px] font-medium text-neutral-600 tracking-normal">
                Our Story
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              About VALUVA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              We are passionate about bringing you the best products with
              exceptional service. Our mission is to make quality accessible to
              everyone while maintaining the highest standards of craftsmanship
              and customer care.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-6 sm:py-8 lg:py-10 bg-white relative">
        <div className="container-luxury">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-4 sm:space-y-5 order-2 lg:order-1"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="inline-block"
                >
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Our Purpose
                  </span>
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Our Mission
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    At VALUVA, we believe that everyone deserves access to
                    high-quality products at fair prices. We work directly with
                    manufacturers and suppliers to bring you the best value
                    without compromising on quality.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Our commitment extends beyond just selling products. We aim
                    to create a shopping experience that is seamless, enjoyable,
                    and trustworthy for every customer.
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative h-[280px] sm:h-[350px] lg:h-[400px] bg-gradient-to-br from-[#fafafa] via-white to-[#fafafa] border border-[#e5e5e5] flex items-center justify-center rounded-[24px] shadow-md hover:shadow-lg transition-all duration-500 group order-1 lg:order-2 overflow-hidden"
              >
                <motion.div
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08), transparent 50%)",
                      "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.08), transparent 50%)",
                      "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08), transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-[24px]"
                />
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >
                  <Award className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 text-neutral-300" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact Grid */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#fafafa] relative">
        <div className="container-luxury">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] mb-3 leading-[0.95]">
                Why Choose VALUVA
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-xl mx-auto">
                Experience the difference with our commitment to excellence
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`text-center p-5 sm:p-6 border-2 ${feature.color} hover:shadow-xl transition-all duration-400 rounded-[20px] group cursor-default`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-center mb-4 text-[#0a0a0a]"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-medium tracking-normal mb-2.5 text-[#0a0a0a]">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Compact Cards */}
      <section className="py-10 sm:py-12 md:py-16 bg-white relative">
        <div className="container-luxury">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] mb-3 leading-[0.95]">
                Our Values
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-3">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="p-5 sm:p-6 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] hover:shadow-lg transition-all duration-400 rounded-[20px] group cursor-default"
                >
                  <div className="flex   items-center gap-1 mb-4 text-[#0a0a0a]">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ duration: 0.3 }}
                      className="p-1.5 bg-[#fafafa]  rounded-[12px] group-hover:bg-[#0a0a0a] group-hover:text-white transition-all duration-400 flex-shrink-0"
                    >
                      {value.icon}
                    </motion.div>
                    <h3 className="text-sm sm:text-base text-center font-medium tracking-tight pt-0.5">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-center text-neutral-600 leading-relaxed font-medium">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Compact Dark Theme */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-[#0a0a0a] via-neutral-900 to-[#0a0a0a] text-[#fafafa] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="container-luxury relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3 leading-[0.95]">
                By The Numbers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                Our impact in numbers
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2  gap-2 sm:gap-3 lg:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="text-center p-6 sm:p-7 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all duration-400 rounded-[20px] group cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-4 text-white/75"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 + 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-medium mb-3 text-white"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-xs sm:text-sm font-medium tracking-normal text-neutral-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Compact Typography */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#fafafa] relative">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] mb-3 leading-[0.95]">
                  Our Story
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  A journey of passion and dedication
                </p>
              </div>
              <div className="space-y-5 sm:space-y-6 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-lg sm:text-xl md:text-2xl text-[#0a0a0a] font-medium leading-tight"
                >
                  VALUVA was founded with a simple vision: to provide
                  exceptional quality products that enhance your everyday life.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  What started as a small venture has grown into a trusted brand
                  known for its commitment to excellence. We carefully curate
                  every product in our collection, ensuring that each item meets
                  our rigorous standards for quality, durability, and design.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our team works tirelessly to bring you the best selection of
                  products from around the world. Today, we continue to evolve
                  and grow, always keeping our customers at the heart of
                  everything we do.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-base sm:text-lg text-[#0a0a0a] font-medium"
                >
                  We&apos;re grateful for the trust you place in us and remain
                  committed to exceeding your expectations.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Compact Buttons */}
      <section className="py-10 sm:py-12 md:py-16 bg-white border-t border-[#e5e5e5] relative">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center space-y-5 sm:space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.95]">
                Ready to Shop?
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-500 font-medium max-w-xl mx-auto">
                Explore our wide range of products and discover something
                special today
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/shop">
                    <Button
                      size="lg"
                      variant="filled"
                      className="rounded-[18px] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium group"
                    >
                      Start Shopping
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-[18px] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
