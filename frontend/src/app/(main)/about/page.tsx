"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import {
  Award,
  Heart,
  Package,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users,
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
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your orders to you fast",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Shopping",
      description:
        "Your data and payments are protected with industry-leading security",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority in everything we do",
    },
  ];

  const values = [
    {
      title: "Quality",
      description:
        "We never compromise on quality. Every product is carefully selected and tested to meet our high standards.",
    },
    {
      title: "Integrity",
      description:
        "We believe in honest business practices and transparent communication with our customers.",
    },
    {
      title: "Innovation",
      description:
        "We continuously improve our services and embrace new technologies to enhance your shopping experience.",
    },
    {
      title: "Sustainability",
      description:
        "We support sustainable business practices and are committed to reducing our environmental impact.",
    },
  ];

  // Dynamic stats from API
  const stats = [
    { 
      number: productsData?.meta?.total ? `${Math.floor(productsData.meta.total / 1000)}K+` : "5K+", 
      label: "Products", 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      number: categoriesData?.data?.length ? `${categoriesData.data.length}+` : "50+", 
      label: "Categories", 
      icon: <ShoppingBag className="h-5 w-5" /> 
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
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-normal">
              About VALUVA
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-medium">
              We are passionate about bringing you the best products with
              exceptional service. Our mission is to make quality accessible to
              everyone while maintaining the highest standards of craftsmanship
              and customer care.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-[#fafafa]">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                Our Mission
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                <p>
                  At VALUVA, we believe that everyone deserves access to
                  high-quality products at fair prices. We work directly with
                  manufacturers and suppliers to bring you the best value without
                  compromising on quality.
                </p>
                <p>
                  Our commitment extends beyond just selling products. We aim to
                  create a shopping experience that is seamless, enjoyable, and
                  trustworthy for every customer.
                </p>
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] border border-[#e5e5e5] bg-white flex items-center justify-center rounded-[12px]">
              <Award className="h-20 w-20 text-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white border-y border-[#e5e5e5]">
        <div className="container-luxury">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal text-center mb-8">
            Why Choose VALUVA
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all rounded-[12px]"
              >
                <div className="flex justify-center mb-4 text-[#0a0a0a]">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-medium tracking-normal mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[#fafafa]">
        <div className="container-luxury">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal text-center mb-8">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all rounded-[12px]"
              >
                <h3 className="text-sm font-medium tracking-normal mb-4">
                  {value.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[#0a0a0a] text-[#fafafa]">
        <div className="container-luxury">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-center mb-3 text-[#fafafa]">
                  {stat.icon}
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-medium mb-3">
                  {stat.number}
                </div>
                <div className="text-xs font-medium tracking-normal text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal text-center">
              Our Story
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              <p>
                VALUVA was founded with a simple vision: to provide exceptional
                quality products that enhance your everyday life. What started as
                a small venture has grown into a trusted brand known for its
                commitment to excellence.
              </p>
              <p>
                We carefully curate every product in our collection, ensuring that
                each item meets our rigorous standards for quality, durability, and
                design. Our team works tirelessly to bring you the best selection
                of products from around the world.
              </p>
              <p>
                Today, we continue to evolve and grow, always keeping our customers
                at the heart of everything we do. We're grateful for the trust you
                place in us and remain committed to exceeding your expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
              Ready to Shop?
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              Explore our wide range of products and discover something special today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" variant="filled">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
