"use client";

import { Book, Sunset, Trees, Zap } from "lucide-react";
import type {
  MenuItem,
  NavbarAuth,
  NavbarLogo,
} from "@/types/navbar";

export const defaultNavbarLogo: NavbarLogo = {
  url: "/",
  src: "/logo/logo-light.png",
  alt: "SkillBridge logo",
  title: "SkillBridge",
};

export const defaultNavbarMenu: MenuItem[] = [
  { title: "Home", url: "#" },
  {
    title: "Dashboards",
    url: "#",
    items: [
      {
        title: "User Dashboard",
        description: "The latest industry news, updates, and info",
        icon: <Book className="size-5 shrink-0" />,
        url: "/user/dashboard",
      },
      {
        title: "Tutor Dashboard",
        description: "Manage your courses and students",
        icon: <Trees className="size-5 shrink-0" />,
        url: "/tutor/dashboard",
      },
      {
        title: "Admin Dashboard",
        description: "Browse job listing and discover our workspace",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Help Center",
        description: "Get all the answers you need right here",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Contact Us",
        description: "We are here to help you with any questions you have",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Status",
        description: "Check the current status of our services and APIs",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Terms of Service",
        description: "Our terms and conditions for using our services",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Pricing",
    url: "#",
  },
  {
    title: "Blog",
    url: "#",
  },
];

export const defaultNavbarAuth: NavbarAuth = {
  login: { title: "Login", url: "/auth/login" },
  signup: { title: "Sign up", url: "/auth/register" },
};
