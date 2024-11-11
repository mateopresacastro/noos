import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSamplePack } from "@/lib/db/queries";
import Sample from "@/components/sample";
import EditPackButton from "@/components/edit-pack-button";
import NumberFlow from "@number-flow/react";
import LoadPackToState from "@/components/load-pack-to-state";

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

  const searchParams = new URLSearchParams();
  searchParams.set("height", "50");
  searchParams.set("width", "50");
  searchParams.set("quality", "75");
  searchParams.set("fit", "crop");
  const creatorImgUrl = `${samplePack.creator.imgUrl}?${params.toString()}`;

  return (
    <>
      <LoadPackToState samplePack={samplePack} />
      <div className="flex flex-col items-center justify-start min-h-screen py-20 sm:py-32">
        <div className="flex items-start flex-col w-full max-w-96">
          <div className="w-64 flex items-center justify-center self-center">
            <div className="w-full h-full aspect-square mb-3 object-cover relative">
              <Image
                src={samplePack.imgUrl}
                alt={samplePack.title}
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="block text-3xl font-bold">{samplePack.title}</span>

          <Link
            href={`/${userName}`}
            prefetch={true}
            className="flex items-center justify-center py-1"
          >
            <Image
              src={creatorImgUrl}
              alt={samplePack.creator.userName}
              width={25}
              height={25}
              className="w-5 h-5 rounded-full object-cover mr-2"
            />
            <span className="block pt-1 font-bold text-xs">@{userName}</span>
          </Link>
          <span className="block text-neutral-400 text-xs pb-1">
            {samplePack.description}
          </span>
          <div className="flex items-baseline justify-between w-full">
            <NumberFlow
              value={Number(samplePack.price.toFixed(2))}
              format={{ style: "currency", currency: "USD" }}
              locales="en-US"
              className="text-neutral-300"
            />
            <Link href={samplePack.stripePaymentLink}>
              <Button className="font-medium w-full text-base px-10">
                Buy
              </Button>
            </Link>
          </div>
          <EditPackButton
            userName={userName}
            samplePackName={samplePack.name}
            description={samplePack.description ?? undefined}
            price={samplePack.price}
          />
          <div className="w-full max-w-96 flex flex-col pt-16">
            {samplePack.samples.map(({ url, title }) => (
              <Sample url={url} key={url} title={title} userName={userName} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
