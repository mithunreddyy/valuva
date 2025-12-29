"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSupport } from "@/hooks/use-support";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Clock, MessageSquare, Send, XCircle } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  const {
    tickets,
    isLoading: isLoadingTickets,
    createSupportTicket,
  } = useSupport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSupportTicket({ subject, message, category });
      setSubject("");
      setMessage("");
      setCategory("general");
      toast({
        title: "Ticket created!",
        description: "Your support ticket has been created successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-50 border-green-200 text-green-700";
      case "IN_PROGRESS":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "CLOSED":
        return "bg-neutral-50 border-neutral-200 text-neutral-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "CLOSED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-2">
              Customer Support
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Get help with your orders, products, or account
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8 lg:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Create Ticket Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white border border-[#e5e5e5] rounded-[20px] p-5 sm:p-6 hover:border-[#0a0a0a] transition-all"
            >
              <h2 className="text-lg sm:text-xl font-medium tracking-normal mb-4 sm:mb-5 text-[#0a0a0a]">
                Create Support Ticket
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 h-10 text-sm border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-[#0a0a0a] bg-transparent transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="order">Order Issue</option>
                    <option value="product">Product Question</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                    Subject
                  </label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="rounded-[12px] h-10 text-sm border-[#e5e5e5] focus:border-[#0a0a0a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                    Message
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={5}
                    className="rounded-[12px] text-sm border-[#e5e5e5] focus:border-[#0a0a0a] resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="filled"
                  size="lg"
                  className="w-full rounded-[16px] gap-2"
                  disabled={isLoadingTickets}
                >
                  {isLoadingTickets ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Tickets List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-[#e5e5e5] rounded-[20px] p-5 sm:p-6 hover:border-[#0a0a0a] transition-all"
            >
              <h2 className="text-lg sm:text-xl font-medium tracking-normal mb-4 sm:mb-5 text-[#0a0a0a]">
                Your Tickets
              </h2>
              {isLoadingTickets ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-[#e5e5e5] rounded-[16px] p-4 hover:border-[#0a0a0a] transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] mb-1">
                              {ticket.subject}
                            </h3>
                            <p className="text-xs text-neutral-500 font-medium">
                              {ticket.category}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-[10px] text-xs font-medium flex items-center gap-1.5 flex-shrink-0 ml-2 border ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {getStatusIcon(ticket.status)}
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 font-medium leading-relaxed">
                          {ticket.message}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-neutral-300" />
                  </div>
                  <p className="text-sm text-neutral-500 font-medium">
                    No support tickets yet
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
