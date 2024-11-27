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
import { useRouter } from "next/navigation";
import General from "@/components/general";

export default function Component({
  slug,
  storageUsed,
}: {
  slug: string;
  storageUsed: bigint;
}) {
  const router = useRouter();
  const component = useMemo(() => {
    switch (slug) {
      case "onboarding":
        return (
          <ConnectAccountOnboarding
            onExit={() => router.refresh()}
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
      case "tax":
        return (
          <div className="flex flex-col items-center justify-center gap-20 w-full">
            <ConnectTaxSettings />
            <ConnectTaxRegistrations />
          </div>
        );
      case "documents":
        return <ConnectDocuments />;
      case "payments":
        return <ConnectPayments />;
      case "payouts":
        return <ConnectPayouts />;
      case "notifications":
        return <ConnectNotificationBanner />;
      case "general":
        return <General storageUsed={storageUsed} />;
      default:
        return <div>Not found</div>;
    }
  }, [slug, router, storageUsed]);

  return (
    <div className="w-full h-fit md:py-24 pb-40 flex items-center justify-center relative">
      {component}
    </div>
  );
}
