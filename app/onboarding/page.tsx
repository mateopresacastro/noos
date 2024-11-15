import StripeOnboarding from "@/app/onboarding/stripe-onboarding";
import { currentUser } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";

export default async function Onboarding() {
  const userData = await currentUser();
  console.log({ userData });

  if (!userData || !userData.username) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <StripeOnboarding userName={userData.username} />
    </div>
  );
}
