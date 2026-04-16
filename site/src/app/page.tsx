import type { Metadata } from "next";
import Link from "next/link";

import { SiteSearchForm } from "@/components/site-search-form";
import { SkillDirectory } from "@/components/skill-directory";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getCategoryCounts, listSkills } from "@/lib/queries/skills";
import { parseHomeListQuery } from "@/lib/validation";
import { SKILL_TYPE_LABELS } from "@/types/skill";

export const metadata: Metadata = {
  title: "Skill 与 MCP 目录",
  description: "浏览 PowerUp 收录的 Skill 与 MCP Server，按分类、类型和关键词快速找到值得继续了解的工具。",
};

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters = parseHomeListQuery(await searchParams);
  const result = listSkills(filters);
  const categoryCounts = getCategoryCounts().filter((item) => item.total > 0);
  const totalPublished = categoryCounts.reduce((sum, item) => sum + item.total, 0);
  const featuredCategories = [...categoryCounts]
    .sort((left, right) => right.total - left.total)
    .slice(0, 4);
  const featuredEntry = featuredCategories[0] ?? null;
  const heroSummaryItems = [
    filters.q ? `关键词 · ${filters.q}` : null,
    filters.type ? `类型 · ${SKILL_TYPE_LABELS[filters.type]}` : "类型 · 全部类型",
    filters.category ? `分类 · ${CATEGORY_LABELS[filters.category]}` : null,
    `结果 · ${result.totalItems} 条`,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <section className="powerup-poster">
        <div className="powerup-poster-grid">
          <div className="powerup-hero-copy">
            <div className="powerup-kicker-row">
              <span className="powerup-kicker">PowerUp</span>
              <span className="powerup-kicker powerup-kicker-soft">Wonder Directory</span>
            </div>
            <p className="powerup-eyebrow">发现好用能力</p>
            <h1 className="powerup-hero-title">
              开放共建的 Agent 能力发现平台。PowerUp 从精选起步，向社区生长
              {" "}
              — 让非技术用户零门槛探索，让好用的AI工具被更多人发现和分享。
            </h1>
            <p className="powerup-hero-lead">
              从首页先看方向，再按分类、类型和关键词逐步缩小范围。无论你是在找写作、开发、检索还是自动化能力，都能更快筛到合适选项。
            </p>

            <div className="powerup-hero-actions">
              <Link href="#directory" className="powerup-button-primary powerup-button-link">
                开始浏览
              </Link>
              <Link href="/about" className="powerup-button-secondary powerup-button-link">
                了解 PowerUp
              </Link>
            </div>

            <SiteSearchForm
              inputId="home-hero-search"
              action="/"
              defaultValue={filters.q}
              buttonLabel="立即搜索"
              placeholder="搜索名称、用途、标签或平台"
              variant="hero"
              className="max-w-3xl"
            />

            <div className="powerup-stat-grid" aria-label="目录统计概览">
              <article className="powerup-stat-card">
                <span>Published</span>
                <strong>{totalPublished}</strong>
                <p>现在可以直接浏览的收录条目。</p>
              </article>
              <article className="powerup-stat-card">
                <span>Worlds</span>
                <strong>{categoryCounts.length}</strong>
                <p>已经整理好的主题分类。</p>
              </article>
              <article className="powerup-stat-card">
                <span>Visible</span>
                <strong>{result.totalItems}</strong>
                <p>这次筛选下可继续查看的结果。</p>
              </article>
            </div>

            <div className="powerup-pill-row">
              {heroSummaryItems.map((item) => (
                <span key={item} className="powerup-summary-pill">
                  {item}
                </span>
              ))}
            </div>

            {filters.q ? (
              <p className="text-sm text-zinc-600">
                搜索词：
                <span className="ml-2 inline-flex rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white">
                  {filters.q}
                </span>
              </p>
            ) : null}
          </div>

          <aside className="powerup-world-spotlight">
            <div className="powerup-world-spotlight-header">
              <p className="powerup-eyebrow">浏览方式</p>
              <h2>先确定方向，再挑一条最适合你的路径</h2>
              <p>
                如果你还不确定从哪里开始，可以先搜索，也可以先进入分类。先定范围，再看结果，会比漫无目的地翻更省时间。
              </p>
            </div>

            <div className="powerup-world-spotlight-steps">
              <article className="powerup-world-step">
                <span>先搜索</span>
                <p>先用名称、用途、标签或平台快速缩小范围。</p>
              </article>
              <article className="powerup-world-step">
                <span>再选分类</span>
                <p>
                  按你最关心的方向进入对应分区，集中浏览同一主题下的条目。
                </p>
              </article>
              <article className="powerup-world-step">
                <span>最后细筛</span>
                <p>结合类型、排序和分页继续收窄，把候选项一步步筛到更贴近当前需求。</p>
              </article>
            </div>

            {featuredEntry ? (
              <div className="powerup-world-spotlight-footer">
                <p className="powerup-world-spotlight-footnote">
                  现在内容最丰富的分类是 <strong>{featuredEntry.label}</strong>，已经收录{" "}
                  <strong>{featuredEntry.total}</strong> 条内容。
                </p>
                <Link
                  href={`/category/${featuredEntry.slug}`}
                  className="powerup-button-secondary powerup-button-link"
                >
                  去 {featuredEntry.label} 看看
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="powerup-terrain-strip">
        <div className="space-y-3">
          <p className="powerup-eyebrow">热门分类</p>
          <h2 className="powerup-section-title">先从内容更充实的方向开始逛</h2>
          <p className="powerup-section-copy">
            这些分类通常更容易帮助你快速建立判断。先进入一个主题，再在结果里继续细筛，会更容易找到真正想要的能力。
          </p>
        </div>

        <div className="powerup-world-chip-grid">
          {featuredCategories.map((item) => (
            <Link key={item.slug} href={`/category/${item.slug}`} className="powerup-world-chip">
              <span>{item.label}</span>
              <strong>{item.total}</strong>
              <small>已收录条目</small>
            </Link>
          ))}
        </div>
      </section>

      <SkillDirectory pathname="/" result={result} allowCategoryFilter variant="home" />
    </div>
  );
}
