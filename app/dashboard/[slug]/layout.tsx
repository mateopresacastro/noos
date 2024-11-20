import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import StripeConnectProvider from "@/components/stripe/provider";

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
  if (!userData || !userData.username) {
    notFound();
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <StripeConnectProvider userName={userData.username}>
        <AppSidebar slug={slug} />
        <SidebarTrigger className="my-auto text-neutral-400" />
        {children}
      </StripeConnectProvider>
    </SidebarProvider>
  );
}
