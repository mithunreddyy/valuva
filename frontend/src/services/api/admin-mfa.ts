import apiClient from "@/lib/axios";
import {
  MFABackupCodesResponse,
  MFASetupResponse,
  MFAVerifyData,
} from "@/types";

export const adminMFAApi = {
  setupMFA: async (): Promise<MFASetupResponse> => {
    const response = await apiClient.post<{ data: MFASetupResponse }>(
      "/admin/mfa/setup"
    );
    return response.data.data;
  },

  verifyAndEnableMFA: async (data: MFAVerifyData): Promise<void> => {
    await apiClient.post("/admin/mfa/verify", data);
  },

  disableMFA: async (password: string): Promise<void> => {
    await apiClient.post("/admin/mfa/disable", { password });
  },

  regenerateBackupCodes: async (): Promise<MFABackupCodesResponse> => {
    const response = await apiClient.post<{ data: MFABackupCodesResponse }>(
      "/admin/mfa/backup-codes"
    );
    return response.data.data;
  },
};
