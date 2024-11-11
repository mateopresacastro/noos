import Image from "next/image";
import Link from "next/link";
import Sample from "@/components/sample";
import EditPackButton from "@/components/edit-pack-button";
import NumberFlow from "@number-flow/react";
import LoadPackToState from "@/components/load-pack-to-state";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSamplePack } from "@/lib/db/queries";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex items-start justify-center min-h-screen py-24">
        <div className="flex items-start flex-col w-full">
          <div className="w-full flex flex-col sm:flex-row">
            <div className="w-64 flex items-center justify-center self-center">
              <div className="w-full h-full aspect-square mb-4 object-cover relative">
                <Image
                  src={samplePack.imgUrl}
                  alt={samplePack.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex justify-between items-end pb-2 w-full">
              <div className="sm:pl-5 flex flex-col items-start">
                <span className="block text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl 2xl:text-9xl">
                  {samplePack.title}
                </span>
                <Link
                  href={`/${userName}`}
                  prefetch={true}
                  className="flex items-center justify-center py-1 pb-2"
                >
                  <Image
                    src={creatorImgUrl}
                    alt={samplePack.creator.userName}
                    width={25}
                    height={25}
                    className="w-5 h-5 rounded-full object-cover mr-2"
                  />
                  <span className="block pt-1 font-bold text-xs sm:text-sm">
                    @{userName}
                  </span>
                </Link>
                <span className="block text-neutral-400 text-xs pb-1 sm:text-sm">
                  {samplePack.description}
                </span>
              </div>
              <div className="self-start pt-2">
                <EditPackButton
                  userName={userName}
                  samplePackName={samplePack.name}
                  description={samplePack.description ?? undefined}
                  price={samplePack.price}
                />
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between w-full pt-4 sm:justify-start">
            <Link href={samplePack.stripePaymentLink}>
              <Button className="font-medium w-full text-base px-10">
                Buy
              </Button>
            </Link>
            <NumberFlow
              value={Number(samplePack.price.toFixed(2))}
              format={{ style: "currency", currency: "USD" }}
              locales="en-US"
              className="text-neutral-50 sm:pl-5 font-bold text-xl"
            />
          </div>
          <div className="mt-10 w-full hidden sm:block">
            <span className="ml-10 text-neutral-400 mb-3 text-sm">Title</span>
            <Separator className="mb-3 mt-2" />
          </div>
          <div className="w-full flex flex-col pt-10 sm:pt-0">
            {samplePack.samples.map(({ url, title }, index) => (
              <Sample
                url={url}
                key={url}
                title={title}
                userName={userName}
                num={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
