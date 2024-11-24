import Image from "next/image";
import Link from "next/link";
import Sample from "@/components/sample";
import EditPackButton from "@/components/edit-pack";
import NumberFlow from "@number-flow/react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSamplePack } from "@/lib/db/mod";
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
  const creatorImgUrl = resize(samplePack.creator.imgUrl);

  return (
    <>
      <div className="flex items-start justify-center min-h-screen pt-24 sm:pt-32 pb-40">
        <div className="flex items-start flex-col w-full max-w-[110rem]">
          <div className="w-full flex flex-col sm:flex-row">
            <div className="w-64 flex items-center justify-center self-center">
              <div className="w-full h-full aspect-square mb-4 object-cover relative">
                <Image
                  src={samplePack.imgUrl}
                  alt={samplePack.title}
                  fill
                  sizes="20rem"
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex justify-between items-end pb-2 w-full">
              <div className="sm:pl-5 flex flex-col items-start">
                <span className="block text-3xl font-bold sm:text-4xl md:text-5xl md:tracking-tight lg:text-6xl xl:text-7xl 2xl:text-9xl lg:tracking-tighter">
                  {samplePack.title}
                </span>
                <div className="flex items-baseline justify-between gap-2 sm:pl-2">
                  <Link
                    href={`/${userName}`}
                    prefetch={true}
                    className="flex items-baseline justify-center py-1 pb-2"
                  >
                    <Image
                      src={creatorImgUrl}
                      alt={samplePack.creator.userName}
                      width={25}
                      height={25}
                      className="w-5 h-5 rounded-full object-cover mr-2 self-center"
                    />
                    <span className="block pt-1 font-bold mb-1 hover:text-neutral-300 transition-colors duration-150 active:text-neutral-10">
                      @{userName}
                    </span>
                  </Link>
                  <span className="block text-neutral-400 text-xs pb-1 sm:text-sm">
                    {samplePack.description}
                  </span>
                </div>
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
              <Button className="font-bold w-full text-base px-10 py-6">
                Buy
              </Button>
            </Link>
            <NumberFlow
              value={Number(samplePack.price.toFixed(2))}
              format={{ style: "currency", currency: "USD" }}
              locales="en-US"
              className="text-neutral-50 sm:pl-5 text-xl font-bold tracking-tighter"
            />
          </div>
          <div className="mt-10 w-full hidden sm:block">
            <span className="ml-14 text-neutral-400 mb-3 text-sm">Title</span>
            <Separator className="mb-3 mt-2" />
          </div>
          <div className="w-full flex flex-col pt-10 sm:pt-0">
            {samplePack.samples
              .sort((a, b) => a.order - b.order)
              .map(({ url, title }, index) => (
                <Sample
                  url={url}
                  key={url}
                  title={title}
                  userName={userName}
                  num={index + 1}
                  wholeSamplePack={samplePack}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function resize(imgUrl: string) {
  const searchParams = new URLSearchParams();
  searchParams.set("height", "50");
  searchParams.set("width", "50");
  searchParams.set("quality", "75");
  searchParams.set("fit", "crop");
  return `${imgUrl}?${searchParams.toString()}`;
}
