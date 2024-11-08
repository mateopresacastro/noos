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
      <div className="flex items-start flex-col max-w-96">
        <div className="w-full flex items-center justify-center">
          <div className="rounded-2xl w-full h-full aspect-square mb-2 object-cover">
            <Image
              src={samplePack.imgUrl}
              alt={samplePack.title}
              width={384}
              height={384}
              className="rounded-2xl w-full h-full object-cover"
            />
          </div>
        </div>
        <span className="block text-xl font-medium">{samplePack.title}</span>
        <span className="block text-neutral-400">{samplePack.description}</span>
        <Link href={`/${userName}`} prefetch={true}>
          <span className="text-neutral-400 block pt-1 font-medium text-xs">
            by @{userName}
          </span>
        </Link>
        <NumberFlow
          value={Number(samplePack.price.toFixed(2))}
          format={{ style: "currency", currency: "USD" }}
          locales="en-US"
          className="pt-1"
        />
        <Button className="font-medium w-full my-6 text-base" size="lg">
          Buy
        </Button>
        <EditPackButton
          userName={userName}
          samplePackName={samplePack.name}
          description={samplePack.description ?? undefined}
          price={samplePack.price}
        />
        <div className="w-full max-w-96 flex flex-col gap-16 pt-16">
          {samplePack.samples.map(({ url }) => (
            <WaveForm url={url} key={url} />
          ))}
        </div>
      </div>
    </div>
  );
}
