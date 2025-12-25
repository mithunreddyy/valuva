import { create } from "zustand";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type Toast = ToastProps & {
  id: string;
};

interface ToastState {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  toast: (props) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { ...props, id };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto dismiss
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, props.duration || 3000);
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = useToastStore.getState().toast;
