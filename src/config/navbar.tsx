"use client";

import type { MenuItem, NavbarAuth, NavbarLogo } from "@/types/navbar";

export const defaultNavbarLogo: NavbarLogo = {
  url: "/",
  src: "/logo/logo-light.png",
  alt: "SkillBridge logo",
  title: "SkillBridge",
};

export const defaultNavbarMenu: MenuItem[] = [
  { title: "Home", url: "#" },

  {
    title: "Categories",
    url: "/categories",
  },
  {
    title: "Tutors",
    url: "/tutors",
  },
  {
    title: "Subjects",
    url: "/subjects",
  },
];

export const defaultNavbarAuth: NavbarAuth = {
  login: { title: "Login", url: "/auth/login" },
  signup: { title: "Sign up", url: "/auth/register" },
};
