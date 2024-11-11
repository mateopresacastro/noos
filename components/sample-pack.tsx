"use client";

import { SamplePackData } from "@/app/[userName]/page";
import { usePlayerStore } from "@/lib/zustand/store";
import MusicBars from "@/components/music-bars";
import Image from "next/image";
import Link from "next/link";

export default function SamplePack({
  samplePack,
  userName,
}: {
  samplePack: SamplePackData;
  userName: string;
}) {
  const { samplePack: currentlyPlayingSamplePack } = usePlayerStore(
    (state) => state
  );
  const isThisSamplePackPlaying =
    currentlyPlayingSamplePack?.name === samplePack.name;

  return (
    <Link href={`/${userName}/${samplePack.name}`} prefetch={true}>
      <div className="flex flex-col items-start justify-center rounded-2xl w-full aspect-square hover:opacity-80 transition-opacity duration-200 mb-2">
        <Image
          src={samplePack.imgUrl}
          alt={samplePack.title}
          width={160}
          height={160}
          className="rounded-2xl w-full h-full object-cover"
          priority
        />
        <div className="flex justify-between w-full">
          <div>
            <span className="text-sm block pt-1 truncate text-ellipsis">
              {samplePack.title}
            </span>
            <span className="text-xs block text-neutral-400">
              {samplePack.samples.length} samples
            </span>
          </div>
          <div className="pt-2">{isThisSamplePackPlaying ? <MusicBars /> : null}</div>
        </div>
      </div>
    </Link>
  );
}
