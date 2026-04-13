import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer = ({
  logo = {
    url: "/",
    src: "/logo/logo-light.png",
    alt: "SkillBridge logo",
    title: "SkillBridge",
  },
  sections = defaultSections,
  description = "A platform for learning and sharing skills.",
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} ${logo.title}. All rights reserved.`,
  legalLinks = defaultLegalLinks,
  className,
}: FooterProps) => {
  return (
    <footer className={cn("pt-10 pb-8 sm:pt-12 sm:pb-10", className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full min-w-0 flex-col gap-10 sm:gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
          <div className="flex w-full min-w-0 flex-col gap-6 text-center sm:text-left lg:max-w-md lg:shrink-0">
            {/* Logo - light and dark versions */}
            <div className="flex justify-center sm:justify-start">
              <Link href={logo.url} className="inline-flex items-center gap-2">
                <Image
                  src="/logo/logo-light.png"
                  alt={logo.alt}
                  title={logo.title}
                  width={120}
                  height={32}
                  className="h-8 w-auto dark:hidden"
                />
                <Image
                  src="/logo/logo-dark.png"
                  alt={logo.alt}
                  title={logo.title}
                  width={120}
                  height={32}
                  className="h-8 w-auto hidden dark:inline-block"
                />
              </Link>
            </div>
            <p className="mx-auto max-w-prose text-pretty text-sm text-muted-foreground sm:mx-0">
              {description}
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-muted-foreground sm:justify-start sm:gap-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx}>
                  <Link
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-md font-medium transition-colors hover:bg-accent hover:text-primary"
                  >
                    {social.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid min-w-0 w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-10 xl:gap-x-16">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="text-center sm:text-left">
                <h3 className="mb-3 font-bold sm:mb-4">{section.title}</h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground sm:space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href} className="inline-block py-0.5">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-8 text-center text-xs font-medium text-muted-foreground sm:mt-12 sm:gap-5 sm:pt-10 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-pretty">{copyright}</p>
          <ul className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-x-6 md:gap-y-1">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <Link href={link.href} className="inline-block py-1">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
