import { z } from "zod";

export const oauthCallbackSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

export const appleCallbackSchema = z.object({
  identityToken: z.string(),
  authorizationCode: z.string().optional(),
  user: z
    .object({
      email: z.string().email().optional(),
      name: z
        .object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;
export type AppleCallbackInput = z.infer<typeof appleCallbackSchema>;

