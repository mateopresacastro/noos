"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/player-store";
import type { SamplePack } from "@/lib/db/queries";

export default function LoadPackToState({
  samplePack,
}: {
  samplePack: SamplePack;
}) {
  const { setSamplePack, unloadSamplePack } = usePlayerStore((state) => state);

  useEffect(() => {
    if (!samplePack) return;
    setSamplePack(samplePack);
    return () => unloadSamplePack();
  }, [samplePack, unloadSamplePack, setSamplePack]);

  return null;
}
