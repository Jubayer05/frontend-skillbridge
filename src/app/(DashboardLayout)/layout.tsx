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
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const sidebarStyles = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

export default function DashboardLayout({
  children,
  student,
  admin,
  tutor,
}: {
  children: ReactNode;
  student: ReactNode;
  admin: ReactNode;
  tutor: ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isTutor = role === "TUTOR";
  const sidebarMenu = isAdmin
    ? getAdminSidebarMenu(user)
    : isTutor
      ? getTutorSidebarMenu(user)
      : getStudentSidebarMenu(user);

  // At /dashboard use the role-specific parallel slot content.
  // For every other route (sub-pages) render the actual page via children.
  const isDashboard = pathname === "/dashboard";
  const dashboardSlot = isAdmin ? admin : isTutor ? tutor : student;
  const content = isDashboard ? dashboardSlot : children;

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar menu={sidebarMenu} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {content}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
