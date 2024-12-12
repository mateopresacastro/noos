"use client";

import Image from "next/image";
import Link from "next/link";
import EditPackButton from "@/components/edit-pack";
import Sample from "@/components/sample";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import { SamplePack } from "@/db/mod";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { container, item } from "@/anim";
import { Clock3 } from "lucide-react";

export default function SamplePackPage({
  samplePack,
  creatorImgUrl,
  userName,
}: {
  samplePack: NonNullable<SamplePack>;
  creatorImgUrl: string;
  userName: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex items-start justify-center min-h-screen pt-24 sm:pt-32 pb-40 will-change-transform"
    >
      <div className="flex items-start flex-col w-full max-w-[110rem]">
        <motion.div
          variants={item}
          className="w-full flex flex-col sm:flex-row will-change-transform"
        >
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
              <div className="flex items-baseline justify-between flex-col">
                <Link
                  href={`/${userName}`}
                  className="flex items-baseline justify-center py-1 pb-2"
                  prefetch={true}
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
                <span className="block text-neutral-400 text-xs pb-1 sm:text-sm max-w-[65ch] h-fit leading-5 sm:leading-6 text-pretty">
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
        </motion.div>
        <motion.div
          variants={item}
          className="flex items-baseline justify-between w-full pt-4 sm:justify-start will-change-transform"
        >
          <Link href={samplePack.stripePaymentLink}>
            <Button className="font-bold w-full text-base px-10 py-6">
              Buy
            </Button>
          </Link>
          <NumberFlow
            value={Number(samplePack.price.toFixed(2))}
            format={{ style: "currency", currency: "USD" }}
            locales="en-US"
            className="text-neutral-50 sm:pl-5 text-xl font-bold tracking-tighter font-mono"
          />
        </motion.div>
        <motion.div
          variants={item}
          className="mt-10 w-full hidden sm:block will-change-transform"
        >
          <div className="flex justify-between items-baseline -mb-2">
            <div>
              <span className="ml-5 text-neutral-400 text-sm">#</span>
              <span className="ml-6 text-neutral-400 text-sm">Title</span>
            </div>
            <Clock3 size={17} className="mb-3 text-neutral-400 mr-8" />
          </div>
          <Separator className="mb-3 mt-2" />
        </motion.div>
        <div className="w-full flex flex-col pt-10 sm:pt-0">
          {samplePack.samples
            .sort((a, b) => a.order - b.order)
            .map(({ url, title, duration }, index) => (
              <motion.div
                variants={item}
                className="will-change-transform"
                key={url}
              >
                <Sample
                  url={url}
                  title={title}
                  userName={userName}
                  num={index + 1}
                  wholeSamplePack={samplePack}
                  duration={duration}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
