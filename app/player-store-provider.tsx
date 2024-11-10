"use client";

import { createContext, ReactNode, useRef } from "react";
import { createCounterStore, initCounterStore } from "@/lib/player-store";

export type PlayerStoreApi = ReturnType<typeof createCounterStore>;

export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined
);

interface PlayerStoreProviderProps {
  children: ReactNode;
}

export const PlayerStoreProvider = ({ children }: PlayerStoreProviderProps) => {
  const storeRef = useRef<PlayerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initCounterStore());
  }

  return (
    <PlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayerStoreContext.Provider>
  );
};
