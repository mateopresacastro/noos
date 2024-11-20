import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { hasRequirementsDue } from "@/lib/stripe";
import StripeConnectProvider from "@/components/stripe/provider";
import AppSidebarTrigger from "@/components/app-sidebar-trigger";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const slug = (await params).slug;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const userData = await currentUser();
  const hasRequirements = await hasRequirementsDue();
  if (!userData || !userData.username) {
    notFound();
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <StripeConnectProvider userName={userData.username}>
        <AppSidebar slug={slug} hasRequirements={hasRequirements} />
        <div className="flex flex-col items-start justify-start w-full">
          <AppSidebarTrigger />
          {children}
        </div>
      </StripeConnectProvider>
    </SidebarProvider>
  );
}
