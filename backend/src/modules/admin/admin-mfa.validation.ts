import { z } from "zod";

export const verifyAndEnableMFASchema = z.object({
  body: z.object({
    token: z.string().length(6, "MFA token must be 6 digits"),
    secret: z.string().min(1, "Secret is required"),
    backupCodes: z.array(z.string()).length(10, "10 backup codes required"),
  }),
});

export const disableMFASchema = z.object({
  body: z.object({
    password: z.string().min(1, "Password is required"),
  }),
});

export const regenerateBackupCodesSchema = z.object({
  body: z.object({}),
});

