"use client";

import { useCallback, useEffect, useState } from "react";
import { createAccountSessionAction } from "@/lib/actions";
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from "@stripe/connect-js";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
  ConnectPayments,
} from "@stripe/react-connect-js";
import colors from "tailwindcss/colors";
const INTER_URL =
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";

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
    // TODO add all colors: https://docs.stripe.com/connect/customize-connect-embedded-components
  },
};

export default function StripeOnboarding({ userName }: { userName: string }) {
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);

  const fetchClientSecret = useCallback(
    async () => await createAccountSessionAction({ userName }),
    [userName]
  );

  useEffect(() => {
    if (!userName || stripeConnectInstance) return;
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("stripe publishable key is not set");
    }

    setStripeConnectInstance(
      loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        fetchClientSecret,
        fonts: [
          {
            cssSrc: INTER_URL,
          },
        ],
        appearance,
      })
    );
  }, [userName, fetchClientSecret, stripeConnectInstance]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {stripeConnectInstance && (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding
            onExit={() => console.log("onExit")}
            onLoaderStart={() => console.log("loaded!!!")}
            collectionOptions={{
              fields: "eventually_due",
              futureRequirements: "include",
            }}
          />
        </ConnectComponentsProvider>
      )}
    </div>
  );
}
