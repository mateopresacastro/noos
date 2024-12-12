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
  hasRequirements,
}: {
  slug: string;
  storageUsed: bigint;
  hasRequirements: boolean;
}) {
  const router = useRouter();
  const component = useMemo(() => {
    switch (slug) {
      case "onboarding":
        return (
          <>
            {hasRequirements ? (
              <div className="max-w-[65ch] mx-auto w-full">
                <ConnectAccountOnboarding
                  onExit={() => router.refresh()}
                  collectionOptions={{
                    fields: "eventually_due",
                    futureRequirements: "include",
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full pt-20 mx-auto">
                <div className="w-full max-w-[65ch]">
                  <h4 className="font-semibold pb-2">You are ready to go!</h4>
                  <p className="text-neutral-400 ">
                    Your onboarding requirements are met. You can now start
                    selling. If there ar new requirements, you will see them
                    here.
                  </p>
                </div>
              </div>
            )}
          </>
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
  }, [slug, router, storageUsed, hasRequirements]);

  return (
    <div className="w-full h-fit md:py-24 pb-40 flex items-center justify-center relative">
      {component}
    </div>
  );
}
