import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import StripeConnectProvider from "@/components/stripe/provider";
import AppSidebarTrigger from "@/components/app-sidebar-trigger";
import StripeRequirementsBadge from "@/components/stripe/requirements-badge";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await currentUser();
  if (!userData || !userData.username) {
    notFound();
  }

  return (
    <SidebarProvider>
      <StripeConnectProvider userName={userData.username}>
        <AppSidebar>
          <StripeRequirementsBadge />
        </AppSidebar>
        <div className="flex flex-col items-start justify-start w-full">
          <AppSidebarTrigger />
          {children}
        </div>
      </StripeConnectProvider>
    </SidebarProvider>
  );
}
