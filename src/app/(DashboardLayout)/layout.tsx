"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getAdminSidebarMenu,
  getStudentSidebarMenu,
  getTutorSidebarMenu,
} from "@/config/sidebar-menus";
import { useAuth } from "@/context/auth-context";
import type { ReactNode } from "react";

const sidebarStyles = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

export default function DashboardLayout({
  student,
  admin,
  tutor,
}: {
  student: ReactNode;
  admin: ReactNode;
  tutor: ReactNode;
}) {
  const { user } = useAuth();
  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isTutor = role === "TUTOR";
  const sidebarMenu = isAdmin
    ? getAdminSidebarMenu(user)
    : isTutor
      ? getTutorSidebarMenu(user)
      : getStudentSidebarMenu(user);
  const dashboardContent = isAdmin ? admin : isTutor ? tutor : student;

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar menu={sidebarMenu} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {dashboardContent}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
