import Component from "@/app/dashboard/[slug]/component";
import { getUserUsedStorage } from "@/db/mod";
import { hasRequirementsDue } from "@/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, userData, hasRequirements] = await Promise.all([
    params,
    currentUser(),
    hasRequirementsDue(),
  ]);

  if (!userData || !userData.username) notFound();
  let storageUsed = await getUserUsedStorage(userData.username);
  if (!storageUsed) storageUsed = BigInt(0);

  return (
    <Component
      slug={slug}
      storageUsed={storageUsed}
      hasRequirements={hasRequirements}
    />
  );
}
