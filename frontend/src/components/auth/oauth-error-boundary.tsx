"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class OAuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("OAuth Error:", error, errorInfo);
    toast({
      title: "Authentication Error",
      description: error.message || "Something went wrong during authentication",
      variant: "destructive",
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium text-red-900">
              Authentication Error
            </h3>
            <p className="text-xs text-red-700">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
          </div>
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

