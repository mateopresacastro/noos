import Image from "next/image";
import UploadButton from "@/components/upload-button";
import { notFound } from "next/navigation";
import { DotIcon } from "lucide-react";
import { getData } from "@/lib/db/queries";
import SamplePack from "@/components/sample-pack";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const userName = (await params).userName;
  const data = await getData(userName);
  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 sm:pt-32">
      <div className="rounded-full size-24 overflow-hidden">
        <Image
          priority
          src={data.imgUrl}
          height={96}
          width={96}
          quality={80}
          alt={`${userName}`}
          className="rounded-full object-cover h-24 w-24"
        />
      </div>
      <span className="block pt-6 text-xl font-medium">{data.name}</span>
      <div className="flex items-baseline justify-center pt-1">
        <span className="text-neutral-400 block text-sm font-medium">
          @{userName}
        </span>
        <DotIcon className="text-neutral-400 size-4 pt-2" />
        <span className="text-neutral-400 block text-sm font-medium">
          {data.samplePacks.length} Packs
        </span>
      </div>
      <UploadButton userName={userName} />
      <SamplePacks samplePacks={data.samplePacks} userName={userName} />
    </div>
  );
}

export type SamplePackData = NonNullable<
  Awaited<ReturnType<typeof getData>>
>["samplePacks"][number];

function SamplePacks({
  samplePacks,
  userName,
}: {
  samplePacks: SamplePackData[];
  userName: string;
}) {
  return (
    <div className="pt-10 sm:pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-14 w-fit mb-32 mx-auto">
      {samplePacks.map((samplePack) => (
        <SamplePack
          key={samplePack.title}
          samplePack={samplePack}
          userName={userName}
        />
      ))}
    </div>
  );
}
