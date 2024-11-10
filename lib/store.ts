import { createStore } from "zustand/vanilla";
import { PlayerStoreContext } from "@/app/player-store-provider";
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
  samples: string[] | null;
  audioInstance: AudioInstance | null;
};

type PlayerActions = {
  setSamplePack: (samplePack: NNSamplePack) => void;
  play: (playingSampleUrl: string) => void;
  stop: () => void;
  playNext: () => void;
  playPrevious: () => void;
  unloadSamplePack: () => void;
};

type PlayerStore = PlayerState & PlayerActions;

const defaultInitState: PlayerState = {
  samplePack: null,
  isPlaying: false,
  playingSampleUrl: null,
  samples: null,
  audioInstance: null,
};

function createAudioInstance(url: string): AudioInstance {
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  const source = new Audio();
  source.src = url;
  source.crossOrigin = "anonymous";

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

function playAudio(url: string, previousInstance: AudioInstance | null) {
  if (previousInstance) {
    previousInstance.source.pause();
    previousInstance.source.currentTime = 0;
    previousInstance.audioContext.close();
  }

  const audioInstance = createAudioInstance(url);
  audioInstance.source.play();

  return {
    isPlaying: true,
    playingSampleUrl: url,
    audioInstance,
  };
}

function fadeOutAudio(audioInstance: AudioInstance) {
  return new Promise<void>((resolve) => {
    const { audioContext, gainNode } = audioInstance;
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

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

    play: (playingSampleUrl: string) =>
      set((state) => playAudio(playingSampleUrl, state.audioInstance)),

    stop: () =>
      set((state) => {
        if (!state.audioInstance) return {};

        const {
          audioInstance: { audioContext, gainNode },
        } = state;

        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

        return {
          isPlaying: false,
          audioInstance: null,
        };
      }),
    playNext: async () => {
      const state = get();
      if (!state.samples || !state.playingSampleUrl) return;

      const currentIndex = state.samples.indexOf(state.playingSampleUrl);
      if (currentIndex === -1) return;

      const nextIndex = (currentIndex + 1) % state.samples.length;
      const nextUrl = state.samples[nextIndex];

      if (state.audioInstance) {
        await fadeOutAudio(state.audioInstance);
      }

      set(playAudio(nextUrl, state.audioInstance));
    },

    playPrevious: async () => {
      const state = get();
      if (!state.samples || !state.playingSampleUrl) return;

      const currentIndex = state.samples.indexOf(state.playingSampleUrl);
      if (currentIndex === -1) return;

      const prevIndex =
        (currentIndex - 1 + state.samples.length) % state.samples.length;
      const prevUrl = state.samples[prevIndex];

      if (state.audioInstance) {
        await fadeOutAudio(state.audioInstance);
      }

      set(playAudio(prevUrl, state.audioInstance));
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
  }));
}

export const usePlayerStore = <T>(selector: (store: PlayerStore) => T): T => {
  const playerStoreContext = useContext(PlayerStoreContext);

  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within PlayerStoreProvider`);
  }

  return useStore(playerStoreContext, selector);
};
