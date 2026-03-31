import type { AppSidebarMenuProps } from "@/types/sidebar";
import type { AuthUser } from "@/types/auth";

export function getAdminSidebarMenu(user: AuthUser | null): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: "LayoutDashboard",
        isActive: true,
        items: [
          { title: "Overview", url: "/admin/dashboard" },
          { title: "Analytics", url: "/admin/analytics" },
          { title: "Activity", url: "/admin/activity" },
        ],
      },
      {
        title: "My learning",
        url: "/admin/learning",
        icon: "BookOpen",
        items: [
          { title: "Courses", url: "/admin/courses" },
          { title: "Bookmarks", url: "/admin/bookmarks" },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: "Settings",
        items: [
          { title: "Profile", url: "/admin/settings/profile" },
          { title: "Notifications", url: "/admin/settings/notifications" },
        ],
      },
    ],
    projects: [
      {
        name: "In progress",
        url: "/admin/learning?filter=in-progress",
        icon: "Frame",
      },
      {
        name: "Completed",
        url: "/admin/learning?filter=completed",
        icon: "PieChart",
      },
    ],
    user: {
      name: user?.name ?? "Admin",
      email: user?.email ?? "",
      avatar: "",
    },
  };
}

export function getStudentSidebarMenu(user: AuthUser | null): AppSidebarMenuProps {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: "LayoutDashboard",
        isActive: true,
      },
      {
        title: "My learning",
        url: "/student/learning",
        icon: "BookOpen",
        items: [
          { title: "Courses", url: "/student/courses" },
          { title: "Bookmarks", url: "/student/bookmarks" },
        ],
      },
      {
        title: "Settings",
        url: "/student/settings",
        icon: "Settings",
        items: [
          { title: "Profile", url: "/student/settings/profile" },
          { title: "Notifications", url: "/student/settings/notifications" },
        ],
      },
    ],
    projects: [
      {
        name: "In progress",
        url: "/student/learning?filter=in-progress",
        icon: "Frame",
      },
      {
        name: "Completed",
        url: "/student/learning?filter=completed",
        icon: "PieChart",
      },
    ],
    user: {
      name: user?.name ?? "Student",
      email: user?.email ?? "",
      avatar: "",
    },
  };
}
