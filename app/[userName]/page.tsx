import { notFound } from "next/navigation";
import { getData } from "@/lib/db/mod";
import ProfilePage from "@/app/[userName]/profile-page";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const userName = (await params).userName;
  const data = await getData(userName);
  if (!data) notFound();

  return <ProfilePage data={data} userName={userName} />;
}
