import Image from "next/image";
import { notFound } from "next/navigation";
import { DotIcon } from "lucide-react";
import { getData } from "@/lib/db/mod";
import SamplePack from "@/components/sample-pack";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const userName = (await params).userName;
  const data = await getData(userName);
  if (!data || !data?.name) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 sm:pt-32 w-full">
      <div className="rounded-full size-24 overflow-hidden">
        <Image
          priority
          src={data.imgUrl}
          height={120}
          width={120}
          quality={80}
          alt={`${userName}`}
          className="rounded-full object-cover h-24 w-24"
        />
      </div>
      <span className="block pt-6 text-xl font-bold md:text-3xl">
        {data?.name}
      </span>
      <div className="flex items-baseline justify-center pt-1">
        <span className="text-neutral-400 block text-sm font-bold">
          @{userName}
        </span>
        <DotIcon className="text-neutral-400 size-4 pt-2" />
        <span className="text-neutral-400 block text-sm font-bold">
          {data.samplePacks.length} Packs
        </span>
      </div>
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
    <div className="pt-10 sm:pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-14 2xl:gap-20 w-full mb-32">
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
