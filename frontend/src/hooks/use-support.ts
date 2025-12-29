import { useAppDispatch, useAppSelector } from "@/store";
import {
  createTicket,
  fetchUserTickets,
  fetchTicketById,
  addTicketReply,
  clearError,
  clearCurrentTicket,
} from "@/store/slices/supportSlice";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for support ticket management
 * Integrates with Redux store for state management
 */
export function useSupport() {
  const dispatch = useAppDispatch();
  const { tickets, currentTicket, isLoading, error } = useAppSelector(
    (state) => state.support
  );

  // Fetch user tickets
  const loadTickets = useCallback(() => {
    dispatch(fetchUserTickets());
  }, [dispatch]);

  // Create a new ticket
  const createSupportTicket = useCallback(
    async (data: { subject: string; message: string; category: string }) => {
      try {
        const result = await dispatch(createTicket(data)).unwrap();
        toast({
          title: "Ticket created",
          description: "Your support ticket has been created successfully.",
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create ticket";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch ticket by ID
  const loadTicket = useCallback(
    (id: string) => {
      dispatch(fetchTicketById(id));
    },
    [dispatch]
  );

  // Add reply to ticket
  const replyToTicket = useCallback(
    async (ticketId: string, message: string) => {
      try {
        await dispatch(addTicketReply({ ticketId, message })).unwrap();
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send reply";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear current ticket
  const handleClearCurrentTicket = useCallback(() => {
    dispatch(clearCurrentTicket());
  }, [dispatch]);

  // Auto-load tickets on mount
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    tickets,
    currentTicket,
    isLoading,
    error,
    loadTickets,
    createSupportTicket,
    loadTicket,
    replyToTicket,
    clearError: handleClearError,
    clearCurrentTicket: handleClearCurrentTicket,
  };
}

