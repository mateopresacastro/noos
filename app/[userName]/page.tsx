import { getData } from "@/db/mod";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const userName = (await params).userName;
  const data = await getData(userName);
  console.log(data);
  if (!data) return "Something went wrong";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-40">
      <div className="rounded-full">
        <Image
          priority
          src={data.imgUrl}
          height={150}
          width={150}
          alt={`${userName}`}
          className="rounded-full"
        />
      </div>
      <span className="text-neutral-400 block pt-2">@{userName}</span>
      <SamplePacks samplePacks={data.samplePacks} />
    </div>
  );
}

type SamplePackData = NonNullable<
  Awaited<ReturnType<typeof getData>>
>["samplePacks"][number];

function SamplePacks({ samplePacks }: { samplePacks: SamplePackData[] }) {
  return (
    <div className="">
      {samplePacks.map((samplePack) => (
        <SamplePack key={samplePack.title} samplePack={samplePack} />
      ))}
    </div>
  );
}

function SamplePack({ samplePack }: { samplePack: SamplePackData }) {
  console.log(samplePack.imgUrl);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Image
        src={samplePack.imgUrl}
        alt={samplePack.title}
        width={200}
        height={200}
      />
      <h4 className="font-bold">{samplePack.title}</h4>
    </div>
  );
}
