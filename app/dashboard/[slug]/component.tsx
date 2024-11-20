"use client";

import { useMemo } from "react";
import {
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectBalances,
  ConnectTaxSettings,
  ConnectDocuments,
  ConnectPayments,
  ConnectPayouts,
  ConnectTaxRegistrations,
  ConnectNotificationBanner,
} from "@stripe/react-connect-js";

export default function Component({ slug }: { slug: string }) {
  const component = useMemo(() => {
    switch (slug) {
      case "onboarding":
        return (
          <ConnectAccountOnboarding
            onExit={() => console.log("onExit")}
            collectionOptions={{
              fields: "eventually_due",
              futureRequirements: "include",
            }}
          />
        );
      case "account-management":
        return <ConnectAccountManagement />;
      case "balances":
        return <ConnectBalances />;
      case "tax-settings":
        return <ConnectTaxSettings />;
      case "documents":
        return <ConnectDocuments />;
      case "payments":
        return <ConnectPayments />;
      case "payouts":
        return <ConnectPayouts />;
      case "tax-registrations":
        return <ConnectTaxRegistrations />;
      case "notifications":
        return <ConnectNotificationBanner />;
      default:
        return <div>Not found</div>;
    }
  }, [slug]);

  return (
    <div className="w-full h-fit md:py-24 flex items-center justify-center relative">
      {component}
    </div>
  );
}
