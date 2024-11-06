import Image from "next/image";
import Link from "next/link";
import UploadButton from "@/app/[userName]/upload-button";
import { getData } from "@/lib/db/mod";
import { notFound } from "next/navigation";

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
    <div className="flex flex-col items-center justify-start min-h-screen pt-40">
      <div className="rounded-full size-32 overflow-hidden">
        <Image
          priority
          src={data.imgUrl}
          height={160}
          width={160}
          alt={`${userName}`}
          className="rounded-full object-cover h-32 w-32"
        />
      </div>
      <span className="block pt-3">{data.name}</span>
      <span className="text-neutral-400 block pt-0.5 text-sm">@{userName}</span>
      <UploadButton userName={userName} />
      <SamplePacks samplePacks={data.samplePacks} userName={userName} />
    </div>
  );
}

type SamplePackData = NonNullable<
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
    <div className="pt-32 flex flex-grow flex-wrap gap-4">
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

function SamplePack({
  samplePack,
  userName,
}: {
  samplePack: SamplePackData;
  userName: string;
}) {
  return (
    <Link href={`/${userName}/${samplePack.name}`}>
      <div className="flex flex-col items-start justify-center object-cover rounded-xl text-left p-4 bg-neutral-900 hover:bg-neutral-800">
        <Image
          src={samplePack.imgUrl}
          alt={samplePack.title}
          width={160}
          height={160}
          className="rounded-xl size-40 object-cover"
        />
        <h4 className="font-medium">{samplePack.title}</h4>
      </div>
    </Link>
  );
}
