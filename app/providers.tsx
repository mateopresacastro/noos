"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PlayerStoreProvider } from "@/lib/zustand/provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import tailwindConfig from "../tailwind.config";
import colors from "tailwindcss/colors";
import resolveConfig from "tailwindcss/resolveConfig";

export const tailwind = resolveConfig(tailwindConfig);

const variables = {
  colorText: colors.neutral[50],
  colorBackground: colors.neutral[900],
  fontFamily: tailwind.theme.fontFamily.sans.join(", "),
  fontFamilyButtons: tailwind.theme.fontFamily.sans.join(", "),
  fontSize: tailwind.theme.fontSize.sm[0],
  fontWeight: {
    bold: tailwind.theme.fontWeight.bold,
    normal: tailwind.theme.fontWeight.normal,
    medium: tailwind.theme.fontWeight.medium,
  },
  spacingUnit: tailwind.theme.spacing[4],
  borderRadius: tailwind.theme.borderRadius.md,
  colorTextSecondary: colors.neutral[400],
  colorPrimary: colors.neutral[50],
  colorInputBackground: colors.neutral[900],
  colorDanger: colors.red[500],
  colorSuccess: colors.emerald[500],
  colorWarning: colors.amber[500],
};

const elements = {
  dividerLine: "bg-neutral-700",
  socialButtonsIconButton: "bg-neutral-700",
  navbarButton: "text-neutral-50",
  organizationSwitcherTrigger__open: "bg-neutral-950",
  organizationPreviewMainIdentifier: "text-neutral-50",
  organizationSwitcherTriggerIcon: "text-neutral-400",
  organizationPreview__organizationSwitcherTrigger: "gap-2",
  organizationPreviewAvatarContainer: "shrink-0",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables,
        elements,
        layout: {
          shimmer: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <PlayerStoreProvider>{children}</PlayerStoreProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
