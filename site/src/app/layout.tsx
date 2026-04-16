import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Suspense } from "react";

import { SiteNav } from "@/components/site-nav";
import { SiteSearchForm } from "@/components/site-search-form";

import "./globals.css";

const smileySans = localFont({
  src: "./fonts/SmileySans-Oblique.ttf.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-smiley-sans",
});

export const metadata: Metadata = {
  title: {
    default: "PowerUp",
    template: "%s | PowerUp",
  },
  description: "浏览值得继续了解的 AI Skills 与 MCP Server，快速找到适合自己工作流的能力。",
};

const navFallbackItems = [
  { href: "/", label: "首页" },
  { href: "/category/developer-tools", label: "世界分区" },
  { href: "/?type=skill", label: "Skill" },
  { href: "/?type=mcp_server", label: "MCP" },
  { href: "/about", label: "关于" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${smileySans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="powerup-site">
          <header className="site-shell-header">
            <div className="site-shell-header-inner">
              <div className="site-brand-block">
                <Link href="/" className="site-brand-mark">
                  <span className="site-brand-orb" aria-hidden="true">
                    ⭐
                  </span>
                  <span className="site-brand-lockup">
                    <strong>PowerUp</strong>
                    <small>Wonder Directory</small>
                  </span>
                </Link>
                <p className="site-brand-copy">
                  给你的 AI Agent 吃个蘑菇 🍄 — 发现、选择、接入，一站搞定 Agent 能力扩展。
                </p>
              </div>

              <Suspense
                fallback={(
                  <nav className="site-nav-pills" aria-label="主导航">
                    {navFallbackItems.map((item) => (
                      <Link key={item.href} href={item.href} className="site-nav-pill">
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
              >
                <SiteNav />
              </Suspense>

              <div className="site-shell-search">
                <SiteSearchForm
                  inputId="site-header-search"
                  compact
                  action="/"
                  buttonLabel="搜索"
                  placeholder="搜索名称、用途或标签"
                />
              </div>
            </div>
          </header>

          <main className="site-shell-main">
            <div className="site-shell-main-inner">{children}</div>
          </main>

          <footer className="site-shell-footer">
            <div className="site-shell-footer-inner">
              <section className="site-footer-section">
                <h2 className="site-footer-title">关于目录</h2>
                <p className="site-footer-copy">
                  PowerUp 持续整理公开可查的 Skill 与 MCP Server，帮助你更快找到值得收藏、测试或接入的能力。
                </p>
                <div className="site-footer-badge-row" aria-label="目录特点">
                  <span className="site-footer-badge">分类浏览</span>
                  <span className="site-footer-badge">关键词搜索</span>
                </div>
              </section>

              <section className="site-footer-section">
                <h2 className="site-footer-title">快速入口</h2>
                <div className="site-footer-links">
                  <Link href="/">全部目录</Link>
                  <Link href="/category/developer-tools">世界分区</Link>
                  <Link href="/?type=skill">只看 Skill</Link>
                  <Link href="/?type=mcp_server">只看 MCP</Link>
                  <Link href="/about">关于项目</Link>
                </div>
              </section>

              <section className="site-footer-section">
                <h2 className="site-footer-title">你可以做什么</h2>
                <p className="site-footer-copy">
                  从首页搜索、按分类浏览，或进入详情页查看描述、平台信息和外部文档，快速判断一项能力是否适合继续深入。
                </p>
                <div className="site-footer-badge-row" aria-label="可浏览内容">
                  <span className="site-footer-badge">Skill</span>
                  <span className="site-footer-badge">MCP Server</span>
                  <span className="site-footer-badge">公开资料入口</span>
                </div>
              </section>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
