"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon, Logo, GMailIcon } from "@/components/icons";
import { LinkedinIcon } from "lucide-react";
import LoginLogoutButton from "@/app/LoginLogoutButton";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();

  if (session)
    return (
      <NextUINavbar
        className="fixed top-0 left-0 right-0 z-50 items justify-between max-w-full"
        maxWidth="full"
        position="sticky"
      >
        <NavbarContent justify="start">
          <NavbarBrand as="li" className="gap-3">
            <NextLink className="flex justify-start gap-1" href="/">
              <p className="font-bold text-inherit">MF-karr</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item: any) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent className="flex" justify="end">
          <NavbarItem className="flex gap-2">
            <Link isExternal aria-label="LinkedIn" href={siteConfig.links.mail}>
              <GMailIcon className="text-default-500" />
            </Link>
            <Link
              isExternal
              aria-label="LinkedIn"
              href={siteConfig.links.linkedin}
            >
              <LinkedinIcon className="text-default-500" />
            </Link>

            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
            <LoginLogoutButton />
          </NavbarItem>
        </NavbarContent>
      </NextUINavbar>
    );
  else return <div></div>;
};
