"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const navItems: ReadonlyArray<{
  href: string;
  label: string;
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean;
}> = [
  {
    href: "/",
    label: "首页",
    isActive: (pathname: string, searchParams: URLSearchParams) =>
      pathname === "/" && !searchParams.get("type"),
  },
  {
    href: "/category/developer-tools",
    label: "世界分区",
    isActive: (pathname: string) => pathname.startsWith("/category/"),
  },
  {
    href: "/?type=skill",
    label: "Skill",
    isActive: (pathname: string, searchParams: URLSearchParams) =>
      pathname === "/" && searchParams.get("type") === "skill",
  },
  {
    href: "/?type=mcp_server",
    label: "MCP",
    isActive: (pathname: string, searchParams: URLSearchParams) =>
      pathname === "/" && searchParams.get("type") === "mcp_server",
  },
  {
    href: "/about",
    label: "关于",
    isActive: (pathname: string) => pathname === "/about",
  },
] as const;

export const SiteNav = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="site-nav-pills" aria-label="主导航">
      {navItems.map((item) => {
        const active = item.isActive(pathname, searchParams);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="site-nav-pill"
            data-active={active}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
