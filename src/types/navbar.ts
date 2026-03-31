import type { ReactNode } from "react";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: ReactNode;
  items?: MenuItem[];
}

export interface NavbarLogo {
  url: string;
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export interface NavbarAuthLink {
  title: string;
  url: string;
}

export interface NavbarAuth {
  login: NavbarAuthLink;
  signup: NavbarAuthLink;
}
