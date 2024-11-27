import SamplePackPage from "@/app/[userName]/[samplePackName]/sample-pack-page";
import { notFound } from "next/navigation";
import { getSamplePack } from "@/lib/db/mod";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string; samplePackName: string }>;
}) {
  const { userName, samplePackName } = await params;
  const samplePack = await getSamplePack({ userName, samplePackName });
  if (!samplePack || !samplePack.price) {
    notFound();
  }
  const creatorImgUrl = resize(samplePack.creator.imgUrl);

  return (
    <SamplePackPage
      creatorImgUrl={creatorImgUrl}
      samplePack={samplePack}
      userName={userName}
    />
  );
}

function resize(imgUrl: string) {
  const searchParams = new URLSearchParams();
  searchParams.set("height", "50");
  searchParams.set("width", "50");
  searchParams.set("quality", "75");
  searchParams.set("fit", "crop");
  return `${imgUrl}?${searchParams.toString()}`;
}
