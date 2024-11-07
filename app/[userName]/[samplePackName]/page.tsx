import Image from "next/image";
import Link from "next/link";
import { getSamplePack } from "@/lib/db/mod";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import WaveForm from "@/components/waveform";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string; samplePackName: string }>;
}) {
  const { userName, samplePackName } = await params;
  const samplePack = await getSamplePack({ userName, samplePackName });
  if (!samplePack) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-24 sm:py-32">
      <div className="rounded-2xl size-80 aspect-square mb-2 object-cover">
        <Image
          src={samplePack.imgUrl}
          alt={samplePack.title}
          width={160}
          height={160}
          className="rounded-2xl w-full h-full object-cover"
        />
      </div>
      <span className="block pt-5 text-xl">{samplePack.title}</span>
      <span className="block text-sm text-neutral-400">
        {samplePack.description}
      </span>
      <Link href={`/${userName}`} prefetch={true}>
        <span className="text-neutral-600 block pt-0.5 font-medium text-xs">
          by @{userName}
        </span>
      </Link>
      <Button className="font-medium my-10" size="lg">
        ${samplePack.price}
      </Button>
      <div className="w-full max-w-96 flex flex-col gap-16 pt-16">
        {samplePack.samples.map(({ url }) => (
          <WaveForm url={url} key={url} />
        ))}
      </div>
    </div>
  );
}
