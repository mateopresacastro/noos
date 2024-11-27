import UploadPage from "@/components/upload/multi-step";
import { doesUserHaveStripeAccount } from "@/lib/db/mod";
import { hasRequirementsDue } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function UploadPageRoot() {
  const userData = await currentUser();
  if (!userData || !userData.username) {
    notFound();
  }

  const userHasStripeAccount = await doesUserHaveStripeAccount(
    userData.username
  );

  if (!userHasStripeAccount) redirect("/country");

  const hasRequirements = await hasRequirementsDue();
  if (hasRequirements) {
    redirect("dashboard/onboarding");
  }

  return <UploadPage userName={userData.username} />;
}
