"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/store";
import type { SamplePack } from "@/lib/db/queries";

export default function LoadPackToState({
  samplePack,
}: {
  samplePack: SamplePack;
}) {
  const { setSamplePack } = usePlayerStore((state) => state);

  useEffect(() => {
    if (!samplePack) return;
    setSamplePack(samplePack);
  }, [samplePack, setSamplePack]);

  return null;
}
