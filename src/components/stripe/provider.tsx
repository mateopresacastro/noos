"use client";

import { useCallback, useEffect, useState } from "react";
import { createAccountSessionAction } from "@/actions";

import { ConnectComponentsProvider } from "@stripe/react-connect-js";
import {
  type AppearanceOptions,
  type StripeConnectInstance,
  loadConnectAndInitialize,
} from "@stripe/connect-js";

import colors from "tailwindcss/colors";

const INTER_URL =
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";

const fonts = [
  {
    cssSrc: INTER_URL,
  },
];

const appearance: AppearanceOptions = {
  variables: {
    colorBackground: colors.neutral[950],
    colorPrimary: colors.neutral[100],
    colorText: colors.neutral[100],
    colorSecondaryText: colors.neutral[500],
    formBackgroundColor: colors.neutral[900],
    formAccentColor: colors.neutral[300],
    offsetBackgroundColor: colors.neutral[900],
    overlayBackdropColor: "rgba(10, 10, 10, 0.8)",
    actionSecondaryColorText: colors.neutral[700],
    buttonSecondaryColorBackground: colors.neutral[900],
    buttonSecondaryColorBorder: colors.neutral[700],
    buttonSecondaryColorText: colors.neutral[50],
    colorBorder: colors.neutral[700],
    colorDanger: colors.red[600],
    spacingUnit: "10px",
    actionPrimaryTextDecorationLine: "underline",
    headingXlFontWeight: "400",
    labelMdFontWeight: "400",
    bodyMdFontWeight: "400",
    labelSmFontWeight: "200",
    bodySmFontWeight: "400",
    borderRadius: "24px",
    buttonBorderRadius: "24px",
    formBorderRadius: "8px",
    badgeBorderRadius: "24px",
    overlayBorderRadius: "24px",
    badgeSuccessColorBackground: colors.emerald[950],
    badgeSuccessColorText: colors.emerald[300],
    badgeSuccessColorBorder: colors.emerald[950],
    badgeDangerColorBackground: colors.red[950],
    badgeDangerColorText: colors.red[300],
    badgeWarningColorBackground: colors.amber[950],
    badgeWarningColorText: colors.amber[300],
    badgeWarningColorBorder: colors.amber[950],
    badgeNeutralColorBackground: colors.neutral[800],
    badgeNeutralColorText: colors.neutral[50],
    badgeNeutralColorBorder: colors.neutral[800],
  },
};

export default function StripeConnectProvider({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);

  const fetchClientSecret = useCallback(
    async () => await createAccountSessionAction({ userName }),
    [userName]
  );

  useEffect(() => {
    if (!userName || stripeConnectInstance) return;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("stripe publishable key is not set");
    }

    setStripeConnectInstance(
      loadConnectAndInitialize({
        fetchClientSecret,
        fonts,
        publishableKey,
        appearance,
      })
    );
  }, [userName, fetchClientSecret, stripeConnectInstance]);

  return (
    stripeConnectInstance && (
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        {children}
      </ConnectComponentsProvider>
    )
  );
}
