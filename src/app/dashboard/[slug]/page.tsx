import Component from "@/app/dashboard/[slug]/component";
import { getUserUsedStorage } from "@/db/mod";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Onboarding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const userData = await currentUser();
  if (!userData || !userData.username) notFound();
  let storageUsed = await getUserUsedStorage(userData.username);
  if (!storageUsed) storageUsed = BigInt(0);

  return <Component slug={slug} storageUsed={storageUsed} />;
}
