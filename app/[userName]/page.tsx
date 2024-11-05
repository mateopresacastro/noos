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
      <SamplePacks samplePacks={data.samplePacks} userName={userName} />
      <UploadButton userName={userName} />
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
  return samplePacks.map((samplePack) => (
    <SamplePack
      key={samplePack.title}
      samplePack={samplePack}
      userName={userName}
    />
  ));
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
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image
          src={samplePack.imgUrl}
          alt={samplePack.title}
          width={200}
          height={200}
        />
        <h4 className="font-bold">{samplePack.title}</h4>
      </div>
    </Link>
  );
}
