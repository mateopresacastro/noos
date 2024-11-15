"use client";

import { ConnectAccountOnboarding } from "@stripe/react-connect-js";

export default function Onboarding() {
  return (
    <ConnectAccountOnboarding
      onExit={() => console.log("onExit")}
      onLoaderStart={() => console.log("loaded!!!")}
      collectionOptions={{
        fields: "eventually_due",
        futureRequirements: "include",
      }}
    />
  );
}
