import { createStore } from "zustand/vanilla";
import { PlayerStoreContext } from "@/app/player-store-provider";
import { useContext } from "react";
import { useStore } from "zustand";
import type WaveSurfer from "wavesurfer.js";
import type { SamplePack } from "@/lib/db/queries";

type NNSamplePack = NonNullable<SamplePack>;

type PlayerState = {
  samplePack: NNSamplePack | null;
  isPlaying: boolean;
  playingSampleUrl: string | null;
  samples: string[] | null;
  waveSurfer: WaveSurfer | null;
  waveSurferMap: Map<string, WaveSurfer>;
};

export type PlayerActions = {
  setSamplePack: (samplePack: NNSamplePack) => void;
  play: (playingSampleUrl: string, waveSurfer: WaveSurfer) => void;
  stop: () => void;
  playNext: () => void;
  playPrevious: () => void;
  unloadSamplePack: () => void;
};

export type PlayerStore = PlayerState & PlayerActions;

export const initCounterStore = (): PlayerState => {
  return {
    samplePack: null,
    isPlaying: false,
    playingSampleUrl: null,
    samples: null,
    waveSurfer: null,
    waveSurferMap: new Map(),
  };
};

export const defaultInitState: PlayerState = {
  samplePack: null,
  isPlaying: false,
  playingSampleUrl: null,
  samples: null,
  waveSurfer: null,
  waveSurferMap: new Map(),
};

export const createCounterStore = (
  initState: PlayerState = defaultInitState
) => {
  return createStore<PlayerStore>()((set) => ({
    ...initState,
    setSamplePack: (samplePack: NNSamplePack) =>
      set(() => ({
        samplePack,
        samples: samplePack.samples.map((sample) => sample.url),
        isPlaying: false,
        playingSampleUrl: samplePack.samples.at(0)?.url,
      })),

    play: (playingSampleUrl: string, waveSurfer: WaveSurfer) =>
      set(({ waveSurfer: prevWaveSurfer }) => {
        if (prevWaveSurfer) prevWaveSurfer.stop();
        waveSurfer.play();
        return { isPlaying: true, playingSampleUrl, waveSurfer };
      }),

    stop: () =>
      set((state) => {
        if (!state.waveSurfer) return state;
        state.waveSurfer.stop();
        return { isPlaying: false };
      }),

    playNext: () =>
      set((state) => {
        if (!state.samples || !state.playingSampleUrl) return state;

        const currentIndex = state.samples.indexOf(state.playingSampleUrl);
        const nextIndex = (currentIndex + 1) % state.samples.length;
        const nextSampleUrl = state.samples[nextIndex];
        const nextWaveSurfer = state.waveSurferMap.get(nextSampleUrl);

        if (nextWaveSurfer) {
          state.waveSurferMap.get(state.playingSampleUrl)?.stop();
          nextWaveSurfer.play();
        }

        return {
          playingSampleUrl: nextSampleUrl,
          isPlaying: true,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (!state.samples || !state.playingSampleUrl) return state;

        const currentIndex = state.samples.indexOf(state.playingSampleUrl);
        if (currentIndex === -1) return state; // Ensure valid index

        // Calculate the previous index in a circular manner
        const previousIndex =
          (currentIndex + state.samples.length - 1) % state.samples.length;
        const previousSampleUrl = state.samples[previousIndex];
        const previousWaveSurfer = state.waveSurferMap.get(previousSampleUrl);

        if (previousWaveSurfer) {
          // Stop the current track and play the previous track
          state.waveSurferMap.get(state.playingSampleUrl)?.stop();
          previousWaveSurfer.play();
        }

        return {
          playingSampleUrl: previousSampleUrl,
          isPlaying: true,
        };
      }),

    unloadSamplePack: () =>
      set((state) => {
        state.waveSurferMap.forEach((waveSurfer) => waveSurfer.destroy());
        return {
          samplePack: null,
          playingSampleUrl: null,
          samples: null,
          isPlaying: false,
          waveSurferMap: new Map(),
        };
      }),
  }));
};

export const usePlayerStore = <T>(selector: (store: PlayerStore) => T): T => {
  const playerStoreContext = useContext(PlayerStoreContext);

  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within PlayerStoreProvider`);
  }

  return useStore(playerStoreContext, selector);
};
