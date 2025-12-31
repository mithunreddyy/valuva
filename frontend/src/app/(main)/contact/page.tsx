"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearError,
  resetSuccess,
  submitContactForm,
} from "@/store/slices/contactSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Clock, Mail, Phone, Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z
    .enum(["general", "order", "return", "product", "other"])
    .optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { isSubmitting, isSuccess, error } = useAppSelector(
    (state) => state.contact
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "general",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      reset();
      setTimeout(() => dispatch(resetSuccess()), 5000);
    }
  }, [isSuccess, reset, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: ContactForm) => {
    await dispatch(
      submitContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        category: data.category || "general",
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact", isBold: true },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] mb-1 leading-[0.95]">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal">
              Have questions? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5">
                {isSuccess && (
                  <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-[12px] flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-900">
                      Message sent successfully!
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#0a0a0a] mb-1.5">
                        Name *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Your name"
                        className="rounded-[12px] border-[#e5e5e5] focus:border-[#0a0a0a] h-9 text-xs"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-[10px] mt-1 font-medium">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0a0a0a] mb-1.5">
                        Email *
                      </label>
                      <Input
                        type="email"
                        {...register("email")}
                        placeholder="your@email.com"
                        className="rounded-[12px] border-[#e5e5e5] focus:border-[#0a0a0a] h-9 text-xs"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-[10px] mt-1 font-medium">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0a0a0a] mb-1.5">
                      Phone (Optional)
                    </label>
                    <Input
                      type="tel"
                      {...register("phone")}
                      placeholder="+91 123 456 7890"
                      className="rounded-[12px] border-[#e5e5e5] focus:border-[#0a0a0a] h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0a0a0a] mb-1.5">
                      Subject *
                    </label>
                    <Input
                      {...register("subject")}
                      placeholder="How can we help?"
                      className="rounded-[12px] border-[#e5e5e5] focus:border-[#0a0a0a] h-9 text-xs"
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-[10px] mt-1 font-medium">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0a0a0a] mb-1.5">
                      Message *
                    </label>
                    <Textarea
                      {...register("message")}
                      className="min-h-[100px] rounded-[12px] border-[#e5e5e5] focus:border-[#0a0a0a] resize-none text-xs"
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-600 text-[10px] mt-1 font-medium">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    variant="filled"
                    className="w-full rounded-[12px] h-9 text-xs"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-4 hover:border-[#0a0a0a] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-[10px] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-[#fafafa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-500 mb-0.5">
                      Email
                    </p>
                    <a
                      href="mailto:support@valuva.in"
                      className="text-xs text-[#0a0a0a] hover:underline font-medium break-all"
                    >
                      support@valuva.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-4 hover:border-[#0a0a0a] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-[10px] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-[#fafafa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-500 mb-0.5">
                      Phone
                    </p>
                    <a
                      href="tel:+9118000000000"
                      className="text-xs text-[#0a0a0a] hover:underline font-medium"
                    >
                      +91 1800 000 0000
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-[8px] bg-[#0a0a0a] flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-[#fafafa]" />
                  </div>
                  <h3 className="text-sm font-medium text-[#0a0a0a]">
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e5e5e5]">
                    <span className="text-xs text-neutral-600 font-medium">
                      Mon - Fri
                    </span>
                    <span className="text-xs text-[#0a0a0a] font-medium">
                      9 AM - 6 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#e5e5e5]">
                    <span className="text-xs text-neutral-600 font-medium">
                      Saturday
                    </span>
                    <span className="text-xs text-[#0a0a0a] font-medium">
                      10 AM - 4 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-600 font-medium">
                      Sunday
                    </span>
                    <span className="text-xs text-[#0a0a0a] font-medium">
                      Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
