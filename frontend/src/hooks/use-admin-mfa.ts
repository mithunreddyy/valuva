import { useAppDispatch, useAppSelector } from "@/store";
import {
  setupMFA,
  verifyAndEnableMFA,
  disableMFA,
  regenerateBackupCodes,
  clearMFASetup,
  clearError,
} from "@/store/slices/adminSlice";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for admin MFA management
 * Integrates with Redux store for state management
 */
export function useAdminMFA() {
  const dispatch = useAppDispatch();
  const { mfa, isLoadingMFA, error } = useAppSelector((state) => state.admin);

  // Setup MFA
  const setup = useCallback(async () => {
    try {
      const result = await dispatch(setupMFA()).unwrap();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to setup MFA";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [dispatch]);

  // Verify and enable MFA
  const verifyAndEnable = useCallback(
    async (data: { token: string; secret: string; backupCodes: string[] }) => {
      try {
        await dispatch(verifyAndEnableMFA(data)).unwrap();
        toast({
          title: "MFA enabled",
          description: "Multi-factor authentication has been enabled successfully.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to enable MFA";
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

  // Disable MFA
  const disable = useCallback(
    async (password: string) => {
      try {
        await dispatch(disableMFA(password)).unwrap();
        toast({
          title: "MFA disabled",
          description: "Multi-factor authentication has been disabled.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to disable MFA";
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

  // Regenerate backup codes
  const regenerateCodes = useCallback(async () => {
    try {
      const result = await dispatch(regenerateBackupCodes()).unwrap();
      toast({
        title: "Backup codes regenerated",
        description: "New backup codes have been generated.",
      });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to regenerate backup codes";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [dispatch]);

  // Clear MFA setup
  const clearSetup = useCallback(() => {
    dispatch(clearMFASetup());
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    mfa,
    isLoadingMFA,
    error,
    setup,
    verifyAndEnable,
    disable,
    regenerateCodes,
    clearSetup,
    clearError: handleClearError,
  };
}

