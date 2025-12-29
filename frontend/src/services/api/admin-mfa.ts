import apiClient from "@/lib/axios";

export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  otpAuthUrl: string;
}

export const adminMFAApi = {
  setupMFA: async (): Promise<MFASetupResponse> => {
    const response = await apiClient.post<{ data: MFASetupResponse }>(
      "/admin/mfa/setup"
    );
    return response.data.data;
  },

  verifyAndEnableMFA: async (data: {
    token: string;
    secret: string;
    backupCodes: string[];
  }): Promise<void> => {
    await apiClient.post("/admin/mfa/verify", data);
  },

  disableMFA: async (password: string): Promise<void> => {
    await apiClient.post("/admin/mfa/disable", { password });
  },

  regenerateBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    const response = await apiClient.post<{ data: { backupCodes: string[] } }>(
      "/admin/mfa/backup-codes"
    );
    return response.data.data;
  },
};
