"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = (item.items?.length ?? 0) > 0;
          const isAnySubItemActive = item.items?.some(
            (subItem) => pathname === subItem.url,
          );
          const isTopLevelActive =
            pathname === item.url || item.isActive || isAnySubItemActive;

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isTopLevelActive}
                  tooltip={item.title}
                  className={cn("h-11 gap-3 px-4 py-2.5", "font-semibold")}
                >
                  <Link href={item.url} className="flex w-full min-w-0 items-center gap-3">
                    {item.icon ? <item.icon className="size-5 shrink-0" /> : null}
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={Boolean(isAnySubItemActive)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn("h-11 gap-3 px-4 py-2.5", "font-semibold")}
                  >
                    {item.icon ? <item.icon className="size-5 shrink-0" /> : null}
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const active = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title} className="px-2">
                          <SidebarMenuSubButton asChild isActive={active}>
                            <Link href={subItem.url} className="flex items-center gap-2">
                              <span className="truncate font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
