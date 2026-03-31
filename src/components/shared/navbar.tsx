"use client";

import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/shared/ModeToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  defaultNavbarAuth,
  defaultNavbarLogo,
  defaultNavbarMenu,
} from "@/config/navbar";
import { useAuth } from "@/context/auth-context";
import type { MenuItem, NavbarAuth, NavbarLogo } from "@/types/navbar";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";

interface NavbarProps {
  className?: string;
  logo?: NavbarLogo;
  menu?: MenuItem[];
  auth?: NavbarAuth;
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const Navbar = ({
  logo = defaultNavbarLogo,
  menu = defaultNavbarMenu,
  auth = defaultNavbarAuth,
  className,
}: NavbarProps) => {
  const hasMounted = useHasMounted();
  const { user } = useAuth();
  const activeUser = hasMounted ? user : null;
  const dashboardUrl = "/dashboard";

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              {/* Light logo */}
              <Image
                width={120}
                height={50}
                src="/logo/logo-light.png"
                className="dark:hidden"
                alt={logo.alt}
                priority
              />
              {/* Dark logo */}
              <Image
                width={120}
                height={50}
                src="/logo/logo-dark.png"
                className="hidden dark:inline-block"
                alt={logo.alt}
              />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {activeUser ? (
              <Button asChild size="sm">
                <Link href={dashboardUrl}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              {/* Light logo */}
              <Image
                width={32}
                height={32}
                src="/logo/logo-light.png"
                className="max-h-8 dark:hidden"
                alt={logo.alt}
              />
              {/* Dark logo */}
              <Image
                width={32}
                height={32}
                src="/logo/logo-dark.png"
                className="max-h-8 hidden dark:inline-block"
                alt={logo.alt}
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      {/* Light logo */}
                      <Image
                        width={32}
                        height={32}
                        src="/logo/logo-light.png"
                        className="max-h-8 dark:hidden"
                        alt={logo.alt}
                      />
                      {/* Dark logo */}
                      <Image
                        width={32}
                        height={32}
                        src="/logo/logo-dark.png"
                        className="max-h-8 hidden dark:inline-block"
                        alt={logo.alt}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {activeUser ? (
                      <Button asChild>
                        <Link href={dashboardUrl}>Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link href={item.url} key={item.title} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };
