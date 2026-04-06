import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/skill/code-block";
import { MarkdownRenderer } from "@/components/skill/markdown-renderer";
import { SkillDetailHeader } from "@/components/skill/skill-detail-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedSlugs, getSkillBySlug } from "@/lib/queries/skills";

export const revalidate = 3600;

interface SkillPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getPublishedSkill = cache((slug: string) => getSkillBySlug(slug));

const hasMarkdownCodeFence = (value: string) => value.includes("```");

const DetailSection = ({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: React.ReactNode;
}>) => (
  <Card className="rounded-[30px] border-none bg-white/90 py-0 shadow-sm ring-1 ring-zinc-950/8">
    <CardHeader className="gap-2 border-b border-zinc-100 px-6 py-5">
      <CardTitle className="text-xl text-zinc-950">{title}</CardTitle>
      {description ? <p className="text-sm leading-7 text-zinc-600">{description}</p> : null}
    </CardHeader>
    <CardContent className="px-6 py-6">{children}</CardContent>
  </Card>
);

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
          description: "查看原始文档与使用说明。",
        }
      : null,
    skill.github_url
      ? {
          label: "GitHub",
          href: skill.github_url,
          description: "进入源码仓库、Issue 和更新历史。",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="flex flex-col gap-8">
      <SkillDetailHeader skill={skill} />

      <DetailSection
        title="详细描述区"
        description="用更完整的文字说明用途、场景和判断依据。"
      >
        <div className="space-y-6">
          <MarkdownRenderer content={skill.description} />
        </div>
      </DetailSection>

      {skill.install_guide || skill.config_example ? (
        <DetailSection
          title="集成信息区"
          description="只在存在公开接入信息时展示安装说明和配置示例。"
        >
          <div className="space-y-6">
            {skill.install_guide ? (
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-zinc-950">安装 / 接入方式</h3>
                <MarkdownRenderer content={skill.install_guide} />
              </section>
            ) : null}

            {skill.config_example ? (
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-zinc-950">配置示例</h3>
                {hasMarkdownCodeFence(skill.config_example) ? (
                  <MarkdownRenderer content={skill.config_example} />
                ) : (
                  <CodeBlock code={skill.config_example} />
                )}
              </section>
            ) : null}
          </div>
        </DetailSection>
      ) : null}

      {linkItems.length > 0 ? (
        <DetailSection
          title="外部链接区"
          description="只保留对公开验证最有帮助的外部入口。"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {linkItems.map((item) => (
              <div
                key={item.href}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50/80 p-5"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-950">{item.label}</h3>
                  <p className="text-sm leading-7 text-zinc-600">{item.description}</p>
                  <p className="break-all text-xs text-zinc-500">{item.href}</p>
                </div>
                <div className="mt-4">
                  <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                    <a href={item.href} target="_blank" rel="noreferrer">
                      打开链接
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-full border-zinc-200">
          <Link href="/">返回首页</Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-full text-zinc-700">
          <Link href={`/category/${skill.category}`}>查看同分类目录</Link>
        </Button>
      </div>
    </div>
  );
}
