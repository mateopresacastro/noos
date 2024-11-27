import Component from "@/app/dashboard/[slug]/component";
import { getUserUsedStorage } from "@/lib/db/mod";
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
  const storageUsed = await getUserUsedStorage(userData.username);

  return <Component slug={slug} storageUsed={storageUsed} />;
}
