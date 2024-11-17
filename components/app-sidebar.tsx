import StripeAccountStatus from "@/components/stripe/connect-status";
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
import Link from "next/link";
import { Suspense } from "react";

const items = [
  {
    title: "Stripe",
    url: "/dashboard",
    subItems: [
      {
        title: "Onboarding",
        url: "/dashboard/onboarding",
      },
      {
        title: "Account management",
        url: "/dashboard/account-management",
      },
      {
        title: "Balances",
        url: "/dashboard/balances",
      },
      {
        title: "Tax settings",
        url: "/dashboard/tax-settings",
      },
      {
        title: "Documents",
        url: "/dashboard/documents",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-neutral-950">
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
                          className="text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 active:bg-neutral-950 transition-all duration-150 rounded-lg"
                          isActive
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
                                  <StripeAccountStatus />
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
