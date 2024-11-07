import Image from "next/image";
import Link from "next/link";
import { getSamplePack } from "@/lib/db/mod";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import WaveForm from "@/components/waveform";
import EditPackButton from "@/components/edit-pack-button";
import NumberFlow from "@number-flow/react";

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-24 sm:py-32">
      <div className="flex items-start flex-col">
        <div className="rounded-2xl size-80 aspect-square mb-2 object-cover">
          <Image
            src={samplePack.imgUrl}
            alt={samplePack.title}
            width={160}
            height={160}
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between w-full pt-1">
          <div className="w-1/2">
            <span className="block text-xl font-medium">
              {samplePack.title}
            </span>
            <span className="block text-neutral-400">
              {samplePack.description}
            </span>
          </div>
          <div className="w-1/2 flex items-center justify-end">
            <EditPackButton userName={userName} />
          </div>
        </div>
        <Link href={`/${userName}`} prefetch={true}>
          <span className="text-neutral-600 block pt-1 font-medium text-xs">
            by @{userName}
          </span>
        </Link>
        <NumberFlow
          value={Number(samplePack.price.toFixed(2))}
          format={{ style: "currency", currency: "USD" }}
          locales="en-US"
          className="pt-6"
        />
        <Button className="font-medium w-full my-6 text-base" size="lg">
          Buy
        </Button>
        <div className="w-full max-w-96 flex flex-col gap-16 pt-16">
          {samplePack.samples.map(({ url }) => (
            <WaveForm url={url} key={url} />
          ))}
        </div>
      </div>
    </div>
  );
}
