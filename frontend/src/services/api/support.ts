import apiClient from "@/lib/axios";
import {
  CreateSupportTicketData,
  CreateTicketReplyData,
  SupportTicket,
  TicketReply,
} from "@/types";

export const supportApi = {
  createTicket: async (
    data: CreateSupportTicketData
  ): Promise<SupportTicket> => {
    const response = await apiClient.post("/support", data);
    return response.data.data;
  },

  getUserTickets: async (): Promise<SupportTicket[]> => {
    const response = await apiClient.get("/support");
    return response.data.data;
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    const response = await apiClient.get(`/support/${id}`);
    return response.data.data;
  },

  addReply: async (
    ticketId: string,
    data: CreateTicketReplyData
  ): Promise<TicketReply> => {
    const response = await apiClient.post(`/support/${ticketId}/reply`, data);
    return response.data.data;
  },
};
