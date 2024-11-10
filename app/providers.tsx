"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PlayerStoreProvider } from "@/app/player-store-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerStoreProvider>{children}</PlayerStoreProvider>
    </QueryClientProvider>
  );
}
