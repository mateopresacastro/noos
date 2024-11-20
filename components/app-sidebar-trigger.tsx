"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppSidebarTrigger() {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }

  return <SidebarTrigger className="mt-24 mb-2 mr-10 text-neutral-300" />;
}
