"use client";

import { useCallback, useEffect, useState } from "react";
import { createAccountSessionAction } from "@/lib/actions";

import { ConnectComponentsProvider } from "@stripe/react-connect-js";
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from "@stripe/connect-js";

import colors from "tailwindcss/colors";
const INTER_URL =
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";

const fonts = [
  {
    cssSrc: INTER_URL,
  },
];

const appearance = {
  variables: {
    colorBackground: colors.neutral[950],
    colorPrimary: colors.neutral[50],
    colorText: colors.neutral[100],
    colorSecondaryText: colors.neutral[300],
    buttonSecondaryColorBackground: colors.neutral[900],
    buttonSecondaryColorBorder: colors.neutral[700],
    buttonSecondaryColorText: colors.neutral[50],
    colorBorder: colors.neutral[700],
    colorDanger: colors.red[600],
    spacingUnit: "10px",
    actionPrimaryTextDecorationLine: "underline",
    // TODO add all colors: https://docs.stripe.com/connect/customize-connect-embedded-components
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
