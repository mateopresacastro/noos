import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import StripeConnectProvider from "@/components/stripe/provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const userData = await currentUser();
  if (!userData || !userData.username) {
    notFound();
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <StripeConnectProvider userName={userData.username}>
        <AppSidebar />
        <SidebarTrigger className="mt-20 mr-6"> Click</SidebarTrigger>
        <div className="py-24 sm:py-32 flex items-center justify-center w-screen">
          {children}
        </div>
      </StripeConnectProvider>
    </SidebarProvider>
  );
}
