import type { Metadata } from "next";
import Link from "next/link";

import { SiteSearchForm } from "@/components/site-search-form";
import { SkillDirectory } from "@/components/skill-directory";
import { getCategoryCounts, listSkills } from "@/lib/queries/skills";
import { parseHomeListQuery } from "@/lib/validation";

export const metadata: Metadata = {
  title: "已发布 Skill 与 MCP 目录",
  description: "浏览 PowerUp V1 已发布的 Skill 与 MCP Server，支持分类、类型、排序、分页与基础关键词搜索。",
};

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters = parseHomeListQuery(await searchParams);
  const result = listSkills(filters);
  const categoryCounts = getCategoryCounts().filter((item) => item.total > 0);
  const totalPublished = categoryCounts.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-[36px] border border-amber-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,243,236,0.92))] px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.95fr)] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium tracking-[0.16em] text-amber-900 uppercase">
                PowerUp V1 MVP
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                  用最轻的前端壳层，把已发布的 Skill 和 MCP Server 变成可搜索目录。
                </h1>
                <p className="max-w-2xl text-base leading-8 text-zinc-700">
                  首页承载完整结果，顶部与 Hero 搜索统一提交到首页，页面直接调用服务端查询层，不再绕内部
                  HTTP API。
                </p>
              </div>
            </div>

            <SiteSearchForm
              inputId="home-hero-search"
              action="/"
              defaultValue={filters.q}
              buttonLabel="搜索目录"
              placeholder="搜索名称、摘要、描述或标签"
              className="max-w-2xl"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Published</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">{totalPublished}</p>
                <p className="mt-1 text-sm text-zinc-600">当前已发布条目</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Categories</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">{categoryCounts.length}</p>
                <p className="mt-1 text-sm text-zinc-600">覆盖的有效分类</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Results</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">{result.totalItems}</p>
                <p className="mt-1 text-sm text-zinc-600">当前筛选结果数</p>
              </div>
            </div>

            {filters.q ? (
              <p className="text-sm text-zinc-600">
                当前搜索词：
                <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white">
                  {filters.q}
                </span>
              </p>
            ) : null}
          </div>

          <aside className="rounded-[32px] border border-zinc-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500">分类入口</p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                直接进入固定分类上下文
              </h2>
              <p className="text-sm leading-7 text-zinc-600">
                分类页会复用首页的列表、筛选、排序和分页体验，但分类由路径锁定，不在页内切换。
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {categoryCounts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 transition hover:border-amber-300 hover:bg-white"
                >
                  <span className="text-sm font-medium text-zinc-800">{item.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-500 shadow-sm transition group-hover:text-zinc-800">
                    {item.total}
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <SkillDirectory pathname="/" result={result} allowCategoryFilter />
    </div>
  );
}
