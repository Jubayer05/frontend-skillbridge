"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAdminSidebarMenu, getStudentSidebarMenu } from "@/config/sidebar-menus";
import { useAuth } from "@/context/auth-context";
import type { ReactNode } from "react";

const sidebarStyles = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

export default function DashboardLayout({
  student,
  admin,
}: {
  student: ReactNode;
  admin: ReactNode;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "TUTOR";

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar
        menu={isAdmin ? getAdminSidebarMenu(user) : getStudentSidebarMenu(user)}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {isAdmin ? admin : student}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
