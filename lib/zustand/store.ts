import { createStore } from "zustand/vanilla";
import { PlayerStoreContext } from "@/lib/zustand/provider";
import { useContext } from "react";
import { useStore } from "zustand";
import type { SamplePack } from "@/lib/db/mod";

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
  duration: number | null;
  currentTime: number | null;
  repeat: boolean;
  shuffle: boolean;
  muted: boolean;
  volume: number | null;
};

const defaultInitState: PlayerState = {
  samplePack: null,
  isPlaying: false,
  playingSampleUrl: null,
  selectedSampleUrl: null,
  samples: null,
  audioInstance: null,
  duration: null,
  currentTime: null,
  repeat: false,
  shuffle: false,
  muted: false,
  volume: 1,
};

type PlayerActions = {
  setSamplePack: (samplePack: NNSamplePack) => void;
  play: (playingSampleUrl: string) => Promise<void>;
  stop: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  unloadSamplePack: () => void;
  setSelectedSampleUrl: (selectedSampleUrl: string) => void;
  seek: (time: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
};

type PlayerStore = PlayerState & PlayerActions;

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

      let nextIndex;
      if (state.shuffle) {
        do {
          nextIndex = Math.floor(Math.random() * state.samples.length);
        } while (nextIndex === currentIndex);
      } else if (state.repeat) {
        nextIndex = currentIndex;
      } else {
        nextIndex = (currentIndex + 1) % state.samples.length;
      }

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

    seek: (time: number) => {
      const state = get();
      if (!state.audioInstance) return;
      state.audioInstance.source.currentTime = time;
      set({ currentTime: time });
    },

    setCurrentTime: (currentTime: number) => set(() => ({ currentTime })),

    setRepeat: (repeat: boolean) =>
      set((state) => ({ repeat, shuffle: repeat ? false : state.shuffle })),

    setShuffle: (shuffle: boolean) =>
      set((state) => ({ shuffle, repeat: shuffle ? false : state.repeat })),

    setMuted: (muted: boolean) => {
      set(() => ({ muted }));
      const state = get();
      if (!state.audioInstance) return;
      if (muted) {
        fadeOut(state.audioInstance, 0);
      } else {
        fadeIn(state.audioInstance, state.volume ?? 1);
      }
    },

    setVolume: (volume: number) => {
      set(() => ({ volume }));
      const state = get();
      if (!state.audioInstance) return;
      const now = state.audioInstance.audioContext.currentTime;
      state.audioInstance.gainNode.gain.setValueAtTime(
        state.muted ? 0 : volume,
        now
      );
    },
  }));
}

export const usePlayerStore = <T>(selector: (store: PlayerStore) => T): T => {
  const playerStoreContext = useContext(PlayerStoreContext);

  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within PlayerStoreProvider`);
  }

  return useStore(playerStoreContext, selector);
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
    await previousInstance.audioContext.close();
  }

  const audioInstance = await createAudioInstance(url);
  audioInstance.gainNode.gain.value = 0;
  await audioInstance.source.play();
  await fadeIn(audioInstance);
  const duration = audioInstance.source.duration;

  return {
    isPlaying: true,
    playingSampleUrl: url,
    audioInstance,
    duration,
    currentTime: 0,
  };
}

function fadeOut(audioInstance: AudioInstance, amount = 0) {
  return new Promise<void>((resolve) => {
    const { audioContext, gainNode } = audioInstance;
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(amount, now + 0.1);
    setTimeout(() => resolve(), 150);
  });
}

function fadeIn(audioInstance: AudioInstance, amount = 1) {
  return new Promise<void>((resolve) => {
    const { audioContext, gainNode } = audioInstance;
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(amount, now + 0.05);
    setTimeout(() => resolve(), 100);
  });
}
