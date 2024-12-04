import SamplePackPage from "@/app/[userName]/[samplePackName]/sample-pack-page";
import { notFound } from "next/navigation";
import { getSamplePack } from "@/db/mod";
import { resize } from "@/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string; samplePackName: string }>;
}) {
  const { userName, samplePackName } = await params;
  const samplePack = await getSamplePack({ userName, samplePackName });
  if (!samplePack || !samplePack.price) notFound();
  const creatorImgUrl = resize(samplePack.creator.imgUrl);

  return (
    <SamplePackPage
      creatorImgUrl={creatorImgUrl}
      samplePack={samplePack}
      userName={userName}
    />
  );
}
