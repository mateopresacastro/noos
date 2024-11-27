"use client";
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { getData } from "@/lib/db/mod";
import SamplePack from "@/components/sample-pack";
import { motion } from "motion/react";
import { container, item } from "@/lib/anim";

type Data = NonNullable<Awaited<ReturnType<typeof getData>>>;
export type SamplePackData = Data["samplePacks"][number];

export default function ProfilePage({
  userName,
  data,
}: {
  userName: string;
  data: Data;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-start min-h-screen pt-24 sm:pt-32 w-full will-change-transform"
    >
      <motion.div
        variants={item}
        className="rounded-full size-24 overflow-hidden will-change-transform"
      >
        <Image
          priority
          src={data.imgUrl}
          height={120}
          width={120}
          quality={80}
          alt={`${userName}`}
          className="rounded-full object-cover h-24 w-24"
        />
      </motion.div>
      <motion.span
        variants={item}
        className="block pt-6 text-xl font-bold md:text-3xl will-change-transform"
      >
        {data?.name}
      </motion.span>
      <motion.div
        variants={item}
        className="flex items-baseline justify-center pt-1"
      >
        <span className="text-neutral-400 block text-sm font-bold">
          @{userName}
        </span>
        <DotIcon className="text-neutral-400 size-4 pt-2" />
        <span className="text-neutral-400 block text-sm font-bold">
          {data.samplePacks.length} Packs
        </span>
      </motion.div>
      <SamplePacks samplePacks={data.samplePacks} userName={userName} />
    </motion.div>
  );
}

function SamplePacks({
  samplePacks,
  userName,
}: {
  samplePacks: SamplePackData[];
  userName: string;
}) {
  return (
    <div className="pt-10 sm:pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-14 2xl:gap-20 w-full mb-32">
      {samplePacks.map((samplePack) => (
        <motion.div
          variants={item}
          className="will-change-transform"
          key={samplePack.title}
        >
          <SamplePack samplePack={samplePack} userName={userName} />
        </motion.div>
      ))}
    </div>
  );
}
