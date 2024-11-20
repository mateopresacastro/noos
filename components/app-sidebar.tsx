"use client";

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
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const items = [
  {
    title: "Stripe",
    url: "/dashboard",
    subItems: [
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        slug: "notifications",
      },
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
        title: "Tax settings",
        url: "/dashboard/tax-settings",
        slug: "tax-settings",
      },
      {
        title: "Tax registrations",
        url: "/dashboard/tax-registrations",
        slug: "tax-registrations",
      },
      {
        title: "Account management",
        url: "/dashboard/account-management",
        slug: "account-management",
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
  const isCollapsible = isMobile ? "offcanvas" : "none";
  const { slug } = useParams<{ slug: string }>();

  return (
    <Sidebar collapsible={isCollapsible} className="mr-10 -ml-3">
      <SidebarContent className="bg-neutral-950 pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span className="font-medium text-neutral-100">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 active:bg-neutral-950 transition-all duration-150 rounded-lg",
                            slug === subItem.slug &&
                              "bg-neutral-800 text-neutral-100"
                          )}
                        >
                          <Link href={subItem.url}>
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
