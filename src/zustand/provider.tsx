"use client";

import { createContext, ReactNode, useRef } from "react";
import { createPlayerStore } from "@/zustand/store";

export type PlayerStoreApi = ReturnType<typeof createPlayerStore>;

export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined
);

interface PlayerStoreProviderProps {
  children: ReactNode;
}

export const PlayerStoreProvider = ({ children }: PlayerStoreProviderProps) => {
  const storeRef = useRef<PlayerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPlayerStore();
  }

  return (
    <PlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayerStoreContext.Provider>
  );
};
