"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const items = [
  {
    title: "General",
    subItems: [
      { title: "General", url: "/dashboard/general", slug: "general" },
    ],
  },
  {
    title: "Stripe",
    subItems: [
      {
        title: "Payments",
        url: "/dashboard/payments",
        slug: "payments",
      },
      {
        title: "Balances",
        url: "/dashboard/balances",
        slug: "balances",
      },
      {
        title: "Payouts",
        url: "/dashboard/payouts",
        slug: "payouts",
      },
      {
        title: "Documents",
        url: "/dashboard/documents",
        slug: "documents",
      },
      {
        title: "Tax",
        url: "/dashboard/tax",
        slug: "tax",
      },
      {
        title: "Account management",
        url: "/dashboard/account-management",
        slug: "account-management",
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        slug: "notifications",
      },
      {
        title: "Onboarding",
        url: "/dashboard/onboarding",
        slug: "onboarding",
      },
    ],
  },
];

type AppSidebarProps = {
  children: React.ReactNode;
};

export function AppSidebar({ children }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const isCollapsible = isMobile ? "offcanvas" : undefined;
  const { slug } = useParams<{ slug: string }>();

  return (
    <Sidebar
      collapsible={isCollapsible}
      className="mr-10 ml-3 lg:ml-6 2xl:ml-12"
    >
      <SidebarContent className="bg-neutral-950 pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span className="font-bold text-neutral-100">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 active:bg-neutral-950 transition-all duration-150 rounded-lg py-4",
                            slug === subItem.slug &&
                              "bg-neutral-900 text-neutral-50"
                          )}
                        >
                          <Link href={subItem.url} prefetch={true}>
                            <span>{subItem.title}</span>
                            {subItem.title === "Onboarding" ? (
                              <SidebarMenuBadge>
                                <Suspense
                                  fallback={
                                    <Badge variant="outline">Loading</Badge>
                                  }
                                >
                                  {children}
                                </Suspense>
                              </SidebarMenuBadge>
                            ) : null}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
