"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
                Send us a message
              </h2>
              <p className="text-sm text-neutral-600 font-medium">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="Your name"
                  className="rounded-[10px]"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className="rounded-[10px]"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  {...register("subject")}
                  placeholder="How can we help?"
                  className="rounded-[10px]"
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  {...register("message")}
                  className="min-h-[150px] rounded-[10px]"
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                variant="filled"
                className="w-full rounded-[10px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
                Contact Information
              </h2>
              <p className="text-sm text-neutral-600 font-medium">
                Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-white border border-[#e5e5e5] rounded-[12px] hover:border-[#0a0a0a] transition-all">
                <div className="p-3 bg-[#0a0a0a] text-white rounded-[10px] flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:support@valuva.com"
                    className="text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
                  >
                    support@valuva.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-[#e5e5e5] rounded-[12px] hover:border-[#0a0a0a] transition-all">
                <div className="p-3 bg-[#0a0a0a] text-white rounded-[10px] flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+911234567890"
                    className="text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
                  >
                    +91 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-[#e5e5e5] rounded-[12px] hover:border-[#0a0a0a] transition-all">
                <div className="p-3 bg-[#0a0a0a] text-white rounded-[10px] flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Address
                  </p>
                  <p className="text-sm text-neutral-600 font-medium">
                    123 Fashion Street
                    <br />
                    Mumbai, Maharashtra 400001
                    <br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="p-5 bg-white border border-[#e5e5e5] rounded-[12px]">
              <h3 className="text-lg font-medium tracking-normal mb-5">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between border-b border-[#e5e5e5] pb-3">
                  <span className="text-neutral-600">Monday - Friday</span>
                  <span className="text-[#0a0a0a]">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-[#e5e5e5] pb-3">
                  <span className="text-neutral-600">Saturday</span>
                  <span className="text-[#0a0a0a]">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Sunday</span>
                  <span className="text-[#0a0a0a]">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
