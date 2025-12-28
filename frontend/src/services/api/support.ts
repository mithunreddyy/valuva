import apiClient from "@/lib/axios";

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export const supportApi = {
  createTicket: async (data: {
    subject: string;
    message: string;
    category: string;
  }): Promise<SupportTicket> => {
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

  addReply: async (ticketId: string, message: string): Promise<TicketReply> => {
    const response = await apiClient.post(`/support/${ticketId}/reply`, {
      message,
    });
    return response.data.data;
  },
};

