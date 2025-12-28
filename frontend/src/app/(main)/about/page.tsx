"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { motion } from "framer-motion";
import {
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
      icon: <Award className="h-5 w-5" />,
      title: "Quality",
      description:
        "We never compromise on quality. Every product is carefully selected and tested to meet our high standards.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Integrity",
      description:
        "We believe in honest business practices and transparent communication with our customers.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Innovation",
      description:
        "We continuously improve our services and embrace new technologies to enhance your shopping experience.",
    },
    {
      icon: <Leaf className="h-5 w-5" />,
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
      number: "10K+",
      label: "Happy Customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      number: "4.8",
      label: "Average Rating",
      icon: <Star className="h-5 w-5 fill-current" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#fafafa] border-b border-[#e5e5e5]">
        <div className="container-luxury py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5e5] rounded-[20px] mb-2">
              <Sparkles className="h-4 w-4 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-600">
                Our Story
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#0a0a0a]">
              About VALUVA
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto font-medium">
              We are passionate about bringing you the best products with
              exceptional service. Our mission is to make quality accessible to
              everyone while maintaining the highest standards of craftsmanship
              and customer care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="inline-block">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Our Purpose
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0a0a0a]">
                Our Mission
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                <p>
                  At VALUVA, we believe that everyone deserves access to
                  high-quality products at fair prices. We work directly with
                  manufacturers and suppliers to bring you the best value
                  without compromising on quality.
                </p>
                <p>
                  Our commitment extends beyond just selling products. We aim to
                  create a shopping experience that is seamless, enjoyable, and
                  trustworthy for every customer.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-[#fafafa] to-white border border-[#e5e5e5] flex items-center justify-center rounded-[24px] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-[24px]" />
              <Award className="h-24 w-24 sm:h-32 sm:w-32 text-neutral-300 relative z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#fafafa]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0a0a0a] mb-3">
              Why Choose VALUVA
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`text-center p-6 sm:p-8 border-2 ${feature.color} hover:shadow-lg transition-all rounded-[20px] group`}
              >
                <div className="flex justify-center mb-5 text-[#0a0a0a] group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base font-medium tracking-normal mb-3 text-[#0a0a0a]">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0a0a0a] mb-3">
              Our Values
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 sm:p-8 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] hover:shadow-lg transition-all rounded-[20px] group"
              >
                <div className="flex items-center gap-3 mb-4 text-[#0a0a0a]">
                  <div className="p-2 bg-[#fafafa] rounded-[12px] group-hover:bg-[#0a0a0a] group-hover:text-white transition-all">
                    {value.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-medium tracking-normal">
                    {value.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#0a0a0a] to-neutral-900 text-[#fafafa]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-3">
              By The Numbers
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-medium">
              Our impact in numbers
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 sm:p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all rounded-[20px]"
              >
                <div className="flex justify-center mb-4 text-white/80">
                  {stat.icon}
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-3 text-white">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-medium tracking-normal text-neutral-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#fafafa]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8 sm:space-y-10"
          >
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0a0a0a] mb-3">
                Our Story
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 font-medium">
                A journey of passion and dedication
              </p>
            </div>
            <div className="space-y-6 text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
              <p className="text-lg sm:text-xl md:text-2xl text-[#0a0a0a] font-medium leading-relaxed">
                VALUVA was founded with a simple vision: to provide exceptional
                quality products that enhance your everyday life.
              </p>
              <p>
                What started as a small venture has grown into a trusted brand
                known for its commitment to excellence. We carefully curate
                every product in our collection, ensuring that each item meets
                our rigorous standards for quality, durability, and design.
              </p>
              <p>
                Our team works tirelessly to bring you the best selection of
                products from around the world. Today, we continue to evolve and
                grow, always keeping our customers at the heart of everything we
                do.
              </p>
              <p className="text-base sm:text-lg text-[#0a0a0a] font-medium">
                We&apos;re grateful for the trust you place in us and remain
                committed to exceeding your expectations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#e5e5e5]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0a0a0a]">
              Ready to Shop?
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-xl mx-auto">
              Explore our wide range of products and discover something special
              today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="filled"
                  className="rounded-[16px] px-8"
                >
                  Start Shopping
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-[16px] px-8"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
