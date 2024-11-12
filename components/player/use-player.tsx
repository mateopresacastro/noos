"use client";

import { usePlayerStore } from "@/lib/zustand/store";
import { useEffect } from "react";

export function usePlayer() {
  const {
    samplePack,
    playNext,
    playingSampleUrl,
    stop,
    play,
    isPlaying,
    audioInstance,
    setCurrentTime,
    repeat,
    shuffle,
  } = usePlayerStore((state) => state);

  useEffect(() => {
    function onTimeUpdate() {
      setCurrentTime(audioInstance?.source?.currentTime ?? 0);
    }

    async function onEnded() {
      if (repeat && playingSampleUrl) {
        await play(playingSampleUrl);
      } else if (shuffle) {
        playNext();
      } else {
        await stop();
      }
    }

    function onError() {
      console.error("Error loading audio");
    }

    if (!audioInstance?.source) return;
    const { source } = audioInstance;
    source.addEventListener("error", onError);
    source.addEventListener("ended", onEnded);
    source.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      source.removeEventListener("error", onError);
      source.removeEventListener("timeupdate", onTimeUpdate);
      source.removeEventListener("ended", onEnded);
    };
  }, [
    audioInstance?.source,
    repeat,
    playingSampleUrl,
    play,
    playNext,
    shuffle,
    stop,
    setCurrentTime,
    audioInstance,
  ]);

  async function handleClick() {
    if (isPlaying) {
      stop();
      return;
    }
    if (!playingSampleUrl) return;
    await play(playingSampleUrl);
  }

  return {
    handleClick,
    playingSampleUrl,
    samplePack,
  };
}
