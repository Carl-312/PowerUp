import type { Metadata } from "next";
import Link from "next/link";

import { SiteSearchForm } from "@/components/site-search-form";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PowerUp",
    template: "%s | PowerUp",
  },
  description: "轻量浏览已发布 AI Skills 与 MCP Server 的目录站首版。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[linear-gradient(180deg,#f5f1e8_0%,#fbfaf7_22%,#ffffff_100%)] text-zinc-950">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
                <div className="space-y-1">
                  <Link href="/" className="text-2xl font-semibold tracking-tight text-zinc-950">
                    PowerUp
                  </Link>
                  <p className="text-sm text-zinc-600">
                    已发布 Skill 与 MCP Server 的轻量目录
                  </p>
                </div>
                <nav className="flex flex-wrap gap-2 text-sm text-zinc-600">
                  <Link
                    href="/"
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 transition hover:border-amber-300 hover:text-zinc-950"
                  >
                    首页
                  </Link>
                  <Link
                    href="/?type=skill"
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 transition hover:border-amber-300 hover:text-zinc-950"
                  >
                    Skill
                  </Link>
                  <Link
                    href="/?type=mcp_server"
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 transition hover:border-amber-300 hover:text-zinc-950"
                  >
                    MCP
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 transition hover:border-amber-300 hover:text-zinc-950"
                  >
                    关于
                  </Link>
                </nav>
              </div>
              <div className="w-full lg:max-w-md">
                <SiteSearchForm
                  inputId="site-header-search"
                  compact
                  action="/"
                  buttonLabel="搜索"
                  placeholder="统一提交到首页搜索"
                />
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <footer className="border-t border-zinc-200 bg-white/75">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 text-sm text-zinc-600 sm:px-6 lg:grid-cols-3 lg:px-8">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-zinc-950">PowerUp V1</h2>
                <p className="leading-7">
                  当前首版只聚焦浏览、筛选、排序和基础搜索，所有页面直接走服务端查询层。
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-zinc-950">快速入口</h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/" className="rounded-full bg-zinc-100 px-3 py-1.5 transition hover:bg-zinc-200">
                    全部目录
                  </Link>
                  <Link
                    href="/?sort=name_asc"
                    className="rounded-full bg-zinc-100 px-3 py-1.5 transition hover:bg-zinc-200"
                  >
                    按名称浏览
                  </Link>
                  <Link
                    href="/?type=mcp_server"
                    className="rounded-full bg-zinc-100 px-3 py-1.5 transition hover:bg-zinc-200"
                  >
                    只看 MCP
                  </Link>
                  <Link href="/about" className="rounded-full bg-zinc-100 px-3 py-1.5 transition hover:bg-zinc-200">
                    关于项目
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-zinc-950">当前边界</h2>
                <p className="leading-7">
                  暂不包含公开 API、即时搜索建议、FTS5、部署硬化和深色模式。统一搜索表单始终回到
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-950">
                    /?q=
                  </code>
                  结果态。
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
