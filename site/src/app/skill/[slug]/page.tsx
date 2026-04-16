import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { ContentPanel } from "@/components/content-panel";
import { CodeBlock } from "@/components/skill/code-block";
import { MarkdownRenderer } from "@/components/skill/markdown-renderer";
import { SkillDetailHeader } from "@/components/skill/skill-detail-header";
import { Button } from "@/components/ui/button";
import { getPublishedSlugs, getSkillBySlug } from "@/lib/queries/skills";
import { formatUpdatedAt } from "@/lib/skill-presentation";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

interface SkillPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getPublishedSkill = cache((slug: string) => getSkillBySlug(slug));

const hasMarkdownCodeFence = (value: string) => value.includes("```");

export async function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getPublishedSkill(slug);

  if (!skill) {
    notFound();
  }

  return {
    title: skill.name,
    description: skill.summary,
  };
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = getPublishedSkill(slug);

  if (!skill) {
    notFound();
  }

  const linkItems = [
    skill.doc_url
      ? {
          label: "官方文档",
          href: skill.doc_url,
          description: "查看官方说明，进一步了解功能与使用方式。",
        }
      : null,
    skill.github_url
      ? {
          label: "GitHub",
          href: skill.github_url,
          description: "查看源码仓库、更新记录和更多公开资料。",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const hasContextSignals =
    Boolean(skill.license) || skill.supported_platforms.length > 0 || skill.tags.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <SkillDetailHeader skill={skill} />

      <div className={cn("powerup-detail-layout", !hasContextSignals && linkItems.length === 0 && "powerup-detail-layout-single")}>
        <div className="flex min-w-0 flex-col gap-6">
          <ContentPanel
            eyebrow="Description"
            title="详细描述"
            description="先读清楚这项能力适合做什么、适合谁用，再决定是否继续深入。"
            className="min-w-0"
            contentClassName="min-w-0"
          >
            <MarkdownRenderer content={skill.description} />
          </ContentPanel>

          {skill.install_guide || skill.config_example ? (
            <ContentPanel
              eyebrow="Integration"
              title="接入与配置"
              description="如果已经提供公开使用信息，这里会把安装方式和配置示例集中整理，方便继续查看。"
              className="min-w-0"
              contentClassName="min-w-0"
            >
              <div className="powerup-stack-gap">
                {skill.install_guide ? (
                  <section className="powerup-stack-gap">
                    <div className="space-y-2">
                      <h3 className="powerup-section-subtitle">安装 / 接入方式</h3>
                      <p className="powerup-panel-description">
                        先确认它是否适合你的客户端、工作流或使用场景，再决定是否继续尝试。
                      </p>
                    </div>
                    <MarkdownRenderer content={skill.install_guide} />
                  </section>
                ) : null}

                {skill.config_example ? (
                  <section className="powerup-stack-gap">
                    <div className="space-y-2">
                      <h3 className="powerup-section-subtitle">配置示例</h3>
                      <p className="powerup-panel-description">
                        想进一步落地时，可以直接从这里参考已有配置方式。
                      </p>
                    </div>
                    {hasMarkdownCodeFence(skill.config_example) ? (
                      <MarkdownRenderer content={skill.config_example} />
                    ) : (
                      <CodeBlock code={skill.config_example} />
                    )}
                  </section>
                ) : null}
              </div>
            </ContentPanel>
          ) : null}
        </div>

        <aside className="powerup-detail-sidebar">
          {hasContextSignals ? (
            <ContentPanel
              eyebrow="Context"
              title="基础信息与目录定位"
              description="把作者、更新时间、平台和标签整理在一起，方便快速建立判断。"
              className="min-w-0"
              contentClassName="min-w-0"
            >
              <div id="skill-context" className="powerup-aside-stack">
                <section className="powerup-info-group">
                  <h3 className="powerup-section-subtitle">公开信号</h3>
                  <div className="powerup-info-grid">
                    <div>
                      <span>作者</span>
                      <strong>{skill.author}</strong>
                    </div>
                    <div>
                      <span>更新于</span>
                      <strong>{formatUpdatedAt(skill.updated_at, "long")}</strong>
                    </div>
                    {skill.license ? (
                      <div>
                        <span>开源协议</span>
                        <strong>{skill.license}</strong>
                      </div>
                    ) : null}
                  </div>
                </section>

                {skill.supported_platforms.length > 0 ? (
                  <section className="powerup-info-group">
                    <h3 className="powerup-section-subtitle">支持平台</h3>
                    <div className="powerup-card-chip-row">
                      {skill.supported_platforms.map((platform) => (
                        <span key={platform} className="powerup-meta-pill">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                {skill.tags.length > 0 ? (
                  <section className="powerup-info-group">
                    <h3 className="powerup-section-subtitle">标签与线索</h3>
                    <div className="powerup-card-chip-row">
                      {skill.tags.map((tag) => (
                        <span key={tag} className="powerup-card-chip powerup-card-chip-soft">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </ContentPanel>
          ) : null}

          {linkItems.length > 0 ? (
            <ContentPanel
              eyebrow="Links"
              title="外部入口"
              description="需要继续深入时，可以从这里直接进入最关键的公开资料。"
              className="min-w-0"
              contentClassName="min-w-0"
            >
              <div className="powerup-link-grid">
                {linkItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="powerup-link-card"
                  >
                    <div className="space-y-2">
                      <strong>{item.label}</strong>
                      <p>{item.description}</p>
                      <span>{item.href}</span>
                    </div>
                    <span className="powerup-link-card-action">
                      打开入口
                      <ExternalLink className="size-4" />
                    </span>
                  </a>
                ))}
              </div>
            </ContentPanel>
          ) : null}

          <ContentPanel
            eyebrow="Next Step"
            title="继续探索"
            description="看完这条内容后，你可以继续浏览同类条目，或者回到首页重新搜索。"
            className="min-w-0"
            contentClassName="min-w-0"
          >
            <div className="powerup-aside-actions">
              <Button asChild className="powerup-button-primary powerup-button-link">
                <Link href={`/category/${skill.category}`}>查看同分类目录</Link>
              </Button>
              <Button asChild className="powerup-button-secondary powerup-button-link">
                <Link href="/">返回首页</Link>
              </Button>
              <Button asChild className="powerup-button-ghost powerup-button-link">
                <Link href="/about">了解目录说明</Link>
              </Button>
            </div>
          </ContentPanel>
        </aside>
      </div>
    </div>
  );
}
