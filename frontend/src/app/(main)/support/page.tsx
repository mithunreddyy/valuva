"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supportApi } from "@/services/api/support";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const queryClient = useQueryClient();

  const {
    data: tickets,
    isLoading: isLoadingTickets,
    error: ticketsError,
  } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => supportApi.getUserTickets(),
    retry: 1,
  });

  // Show error toast if tickets query fails
  useEffect(() => {
    if (ticketsError) {
      const errorMessage =
        ticketsError instanceof Error
          ? ticketsError.message
          : "Failed to load tickets. Please refresh the page.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [ticketsError]);

  const createTicket = useMutation({
    mutationFn: (data: {
      subject: string;
      message: string;
      category: string;
    }) => supportApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setSubject("");
      setMessage("");
      setCategory("general");
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created",
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create ticket. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate({ subject, message, category });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-normal text-[#0a0a0a]">
            Customer Support
          </h1>
        </div>
      </section>

      <section className="container-luxury py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5">
              <h2 className="text-lg font-medium mb-4 text-[#0a0a0a]">
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
                    className="w-full px-3 py-2 h-10 text-sm border border-[#e5e5e5] rounded-[10px] focus:outline-none focus:border-[#0a0a0a]"
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
                    className="rounded-[10px] h-10 text-sm"
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
                    className="rounded-[10px] text-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="filled"
                  className="w-full rounded-[10px] h-10 text-sm"
                  disabled={createTicket.isPending}
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  {createTicket.isPending ? "Creating..." : "Create Ticket"}
                </Button>
              </form>
            </div>

            <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5">
              <h2 className="text-lg font-medium mb-4 text-[#0a0a0a]">
                Your Tickets
              </h2>
              {tickets && tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-[#e5e5e5] rounded-[12px] p-3 hover:border-[#0a0a0a] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#0a0a0a]">
                            {ticket.subject}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {ticket.category}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-[8px] text-xs font-medium flex-shrink-0 ml-2 ${
                            ticket.status === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : ticket.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-2 font-medium">
                        {ticket.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-xs text-neutral-500 font-medium">
                    No support tickets yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
