import UploadPage from "@/app/upload/_components/multi-step";
import { STORAGE_LIMIT_50_GB_IN_BYTES } from "@/consts";
import { doesUserHaveStripeAccount, getUserUsedStorage } from "@/db/mod";
import { hasRequirementsDue } from "@/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function UploadPageRoot() {
  const userData = await currentUser();
  if (!userData || !userData.username) notFound();
  const { username: userName } = userData;
  const [userHasStripeAccount, hasRequirements, storageUsed] =
    await Promise.all([
      doesUserHaveStripeAccount(userName),
      hasRequirementsDue(),
      getUserUsedStorage(userName),
    ]);

  if (!userHasStripeAccount) redirect("/country");
  if (hasRequirements) redirect("dashboard/onboarding");
  if (BigInt(storageUsed ?? 0) >= STORAGE_LIMIT_50_GB_IN_BYTES) {
    redirect("/dashboard/general");
  }

  return <UploadPage userName={userData.username} />;
}
