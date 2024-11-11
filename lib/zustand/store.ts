import { createStore } from "zustand/vanilla";
import { PlayerStoreContext } from "@/lib/zustand/provider";
import { useContext } from "react";
import { useStore } from "zustand";
import type { SamplePack } from "@/lib/db/queries";

type NNSamplePack = NonNullable<SamplePack>;

type AudioInstance = {
  source: HTMLAudioElement;
  gainNode: GainNode;
  audioContext: AudioContext;
  mediaSource: MediaElementAudioSourceNode;
};

type PlayerState = {
  samplePack: NNSamplePack | null;
  isPlaying: boolean;
  playingSampleUrl: string | null;
  selectedSampleUrl: string | null;
  samples: string[] | null;
  audioInstance: AudioInstance | null;
};

type PlayerActions = {
  setSamplePack: (samplePack: NNSamplePack) => void;
  play: (playingSampleUrl: string) => Promise<void>;
  stop: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  unloadSamplePack: () => void;
  setSelectedSampleUrl: (selectedSampleUrl: string) => void;
};

type PlayerStore = PlayerState & PlayerActions;

const defaultInitState: PlayerState = {
  samplePack: null,
  isPlaying: false,
  playingSampleUrl: null,
  selectedSampleUrl: null,
  samples: null,
  audioInstance: null,
};

async function createAudioInstance(url: string) {
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  const source = new Audio(url);
  source.crossOrigin = "anonymous";
  source.load();

  const mediaSource = audioContext.createMediaElementSource(source);
  mediaSource.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return {
    source,
    gainNode,
    audioContext,
    mediaSource,
  };
}

async function playAudio(url: string, previousInstance: AudioInstance | null) {
  if (previousInstance) {
    await fadeOut(previousInstance);
    previousInstance.source.pause();
    previousInstance.source.currentTime = 0;
    await previousInstance.audioContext.close();
  }

  const audioInstance = await createAudioInstance(url);
  audioInstance.gainNode.gain.value = 0;
  await audioInstance.source.play();
  await fadeIn(audioInstance);

  return {
    isPlaying: true,
    playingSampleUrl: url,
    audioInstance,
  };
}

function fadeOut(audioInstance: AudioInstance) {
  return new Promise<void>((resolve) => {
    const { audioContext, gainNode } = audioInstance;
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    setTimeout(() => resolve(), 150);
  });
}

function fadeIn(audioInstance: AudioInstance) {
  return new Promise<void>((resolve) => {
    const { audioContext, gainNode } = audioInstance;
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.05);
    setTimeout(() => resolve(), 100);
  });
}

export function createPlayerStore(initState: PlayerState = defaultInitState) {
  return createStore<PlayerStore>()((set, get) => ({
    ...initState,

    setSamplePack: (samplePack: NNSamplePack) =>
      set(() => ({
        samplePack,
        samples: samplePack.samples.map((sample) => sample.url),
      })),

    play: async (url: string) => {
      const state = get();
      const newState = await playAudio(url, state.audioInstance);
      set(newState);
    },

    stop: async () => {
      const state = get();
      if (!state.audioInstance) return;
      await fadeOut(state.audioInstance);
      set({
        isPlaying: false,
        audioInstance: null,
      });
    },
    playNext: async () => {
      const state = get();
      if (!state.samples || !state.playingSampleUrl) return;

      const currentIndex = state.samples.indexOf(state.playingSampleUrl);
      if (currentIndex === -1) return;

      const nextIndex = (currentIndex + 1) % state.samples.length;
      const nextUrl = state.samples[nextIndex];

      const newState = await playAudio(nextUrl, state.audioInstance);
      set(newState);
    },

    playPrevious: async () => {
      const state = get();
      if (!state.samples || !state.playingSampleUrl) return;

      const currentIndex = state.samples.indexOf(state.playingSampleUrl);
      if (currentIndex === -1) return;

      const prevIndex =
        (currentIndex - 1 + state.samples.length) % state.samples.length;
      const prevUrl = state.samples[prevIndex];

      const newState = await playAudio(prevUrl, state.audioInstance);

      set(newState);
    },

    unloadSamplePack: () =>
      set((state) => {
        if (state.audioInstance) {
          state.audioInstance.source.pause();
          state.audioInstance.source.currentTime = 0;
          state.audioInstance.audioContext.close();
        }
        return defaultInitState;
      }),

    setSelectedSampleUrl: (selectedSampleUrl: string) =>
      set(() => ({ selectedSampleUrl })),
  }));
}

export const usePlayerStore = <T>(selector: (store: PlayerStore) => T): T => {
  const playerStoreContext = useContext(PlayerStoreContext);

  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within PlayerStoreProvider`);
  }

  return useStore(playerStoreContext, selector);
};
