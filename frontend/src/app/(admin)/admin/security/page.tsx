"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import { adminMFAApi } from "@/services/api/admin-mfa";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Check, Copy, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminSecurityPage() {
  const [mfaToken, setMfaToken] = useState("");
  const [password, setPassword] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [mfaSetupData, setMfaSetupData] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
    otpAuthUrl: string;
  } | null>(null);

  const setupMFA = useMutation({
    mutationFn: () => adminMFAApi.setupMFA(),
    onSuccess: (data) => {
      setMfaSetupData(data);
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to setup MFA",
        variant: "destructive",
      });
    },
  });

  const verifyAndEnable = useMutation({
    mutationFn: (data: {
      token: string;
      secret: string;
      backupCodes: string[];
    }) => adminMFAApi.verifyAndEnableMFA(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "MFA enabled successfully",
      });
      setMfaToken("");
      setShowBackupCodes(true);
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to enable MFA",
        variant: "destructive",
      });
    },
  });

  const disableMFA = useMutation({
    mutationFn: (password: string) => adminMFAApi.disableMFA(password),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "MFA disabled successfully",
      });
      setPassword("");
      setShowBackupCodes(false);
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to disable MFA",
        variant: "destructive",
      });
    },
  });

  const regenerateCodes = useMutation({
    mutationFn: () => adminMFAApi.regenerateBackupCodes(),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Backup codes regenerated",
      });
      setShowBackupCodes(true);
      // Update backup codes in state
      if (mfaSetupData) {
        setMfaSetupData({
          ...mfaSetupData,
          backupCodes: data.backupCodes,
        });
      }
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to regenerate codes",
        variant: "destructive",
      });
    },
  });

  const handleSetupMFA = () => {
    setupMFA.mutate();
  };

  const handleVerifyAndEnable = () => {
    if (!mfaSetupData || !mfaToken) {
      toast({
        title: "Error",
        description: "Please scan QR code and enter token",
        variant: "destructive",
      });
      return;
    }
    verifyAndEnable.mutate({
      token: mfaToken,
      secret: mfaSetupData.secret,
      backupCodes: mfaSetupData.backupCodes,
    });
  };

  const handleDisableMFA = () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }
    if (
      confirm(
        "Are you sure you want to disable MFA? This will reduce your account security."
      )
    ) {
      disableMFA.mutate(password);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied",
      description: "Backup code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 border-b border-[#e5e5e5] pb-4">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
          Security Settings
        </h1>
        <p className="text-xs text-neutral-400 font-normal">
          Manage multi-factor authentication and security
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* MFA Setup Section */}
        <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium tracking-normal mb-1">
                Multi-Factor Authentication
              </h2>
              <p className="text-xs text-neutral-500 font-normal">
                Add an extra layer of security to your admin account
              </p>
            </div>
            <Shield className="h-4 w-4 text-neutral-400" />
          </div>

          {!mfaSetupData && !showBackupCodes && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600 font-normal">
                MFA is not enabled. Click the button below to set it up.
              </p>
              <Button
                onClick={handleSetupMFA}
                variant="filled"
                size="sm"
                className="rounded-[12px] gap-1.5"
              >
                Setup MFA
              </Button>
            </div>
          )}

          {mfaSetupData && !showBackupCodes && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-2.5">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="flex justify-center p-3 bg-[#fafafa] border border-[#e5e5e5] rounded-[12px]">
                  <Image
                    src={mfaSetupData.qrCode}
                    alt="MFA QR Code"
                    width={180}
                    height={180}
                    className="rounded-[10px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Enter 6-digit code from your app
                </label>
                <Input
                  type="text"
                  value={mfaToken}
                  onChange={(e) =>
                    setMfaToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="rounded-[10px] h-9 text-center text-base tracking-widest border-[#e5e5e5] focus:border-[#0a0a0a]"
                />
              </div>

              <Button
                onClick={handleVerifyAndEnable}
                variant="filled"
                size="sm"
                className="w-full rounded-[12px] gap-1.5"
                disabled={mfaToken.length !== 6 || verifyAndEnable.isPending}
              >
                {verifyAndEnable.isPending ? "Enabling..." : "Enable MFA"}
              </Button>
            </div>
          )}

          {showBackupCodes && mfaSetupData && (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-[12px]">
                <p className="text-xs font-medium text-yellow-800 mb-1.5">
                  ⚠️ Save these backup codes in a secure location
                </p>
                <p className="text-xs text-yellow-700 font-normal">
                  You can use these codes to access your account if you lose
                  access to your authenticator app. Each code can only be used
                  once.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {mfaSetupData.backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-[#fafafa] border border-[#e5e5e5] rounded-[10px]"
                  >
                    <code className="text-xs font-mono font-medium">
                      {code}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                      className="h-6 w-6 p-0 rounded-[8px]"
                    >
                      {copiedCode === code ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-neutral-500" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => regenerateCodes.mutate()}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-[12px]"
                  disabled={regenerateCodes.isPending}
                >
                  {regenerateCodes.isPending
                    ? "Regenerating..."
                    : "Regenerate Codes"}
                </Button>
                <Button
                  onClick={() => {
                    setShowBackupCodes(false);
                    setMfaToken("");
                    setMfaSetupData(null);
                  }}
                  variant="filled"
                  size="sm"
                  className="flex-1 rounded-[12px]"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {showBackupCodes && (
            <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
              <h3 className="text-xs font-medium mb-2.5">Disable MFA</h3>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                    Enter your password to disable MFA
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-[10px] pr-10 h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                </div>
                <Button
                  onClick={handleDisableMFA}
                  variant="outline"
                  size="sm"
                  className="rounded-[12px] text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={!password || disableMFA.isPending}
                >
                  {disableMFA.isPending ? "Disabling..." : "Disable MFA"}
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
