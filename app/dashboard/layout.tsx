import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import StripeConnectProvider from "@/components/stripe/provider";
import AppSidebarTrigger from "@/components/app-sidebar-trigger";
import StripeRequirementsBadge from "@/components/stripe/requirements-badge";
import { doesUserHaveStripeAccount } from "@/lib/db/mod";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await currentUser();
  if (!userData || !userData.username) {
    notFound();
  }

  const userHasStripeAccount = await doesUserHaveStripeAccount(
    userData.username
  );

  if (!userHasStripeAccount) redirect("/country");

  return (
    <SidebarProvider>
      <StripeConnectProvider userName={userData.username}>
        <AppSidebar>
          <StripeRequirementsBadge />
        </AppSidebar>
        <div className="flex flex-col items-start justify-start w-full pb-40">
          <AppSidebarTrigger />
          {children}
        </div>
      </StripeConnectProvider>
    </SidebarProvider>
  );
}
