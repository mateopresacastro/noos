"use client";

import { SamplePackData } from "@/app/[userName]/profile-page";
import { usePlayerStore } from "@/zustand/store";
import MusicBars from "@/components/music-bars";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import Fade from "@/components/fade";

export default function SamplePack({
  samplePack,
  userName,
}: {
  samplePack: SamplePackData;
  userName: string;
}) {
  const { samplePack: currentlyPlayingSamplePack, isPlaying } = usePlayerStore(
    (state) => state
  );

  const isThisSamplePackPlaying =
    currentlyPlayingSamplePack &&
    currentlyPlayingSamplePack?.name === samplePack?.name &&
    isPlaying;

  const numOfSamples = samplePack.samples.length;
  return (
    <Link href={`/${userName}/${samplePack?.name}`} prefetch={true}>
      <div className="flex flex-col items-start justify-center rounded-2xl w-full aspect-square hover:opacity-80 transition-opacity duration-150 mb-2 active:opacity-60">
        <Image
          src={samplePack.imgUrl}
          alt={samplePack.title}
          width={300}
          height={300}
          quality={100}
          className="rounded-3xl w-full h-full object-cover"
          priority
        />
        <div className="flex justify-between w-full">
          <div>
            <span className="font-bold block pt-1 truncate text-ellipsis">
              {samplePack.title}
            </span>
            <span className="text-xs block text-neutral-400 font-bold pt-0.5">
              {numOfSamples} sample{numOfSamples > 1 ? "s" : ""}
            </span>
          </div>
          <div className="self-end pb-1">
            <AnimatePresence>
              {isThisSamplePackPlaying ? (
                <Fade id="music-bars-profile-page">
                  <MusicBars />
                </Fade>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Link>
  );
}
