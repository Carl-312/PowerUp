import type { Metadata } from "next";
import Link from "next/link";

import { ContentPanel } from "@/components/content-panel";
import { MarkdownRenderer } from "@/components/skill/markdown-renderer";
import { ABOUT_DOCUMENT_TITLE, readAboutContent } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "关于",
  description: "了解 PowerUp 的定位、收录范围，以及这张目录希望帮你解决什么问题。",
};

export default async function AboutPage() {
  const content = await readAboutContent();

  return (
    <div className="flex flex-col gap-8">
      <section className="powerup-about-hero">
        <div className="powerup-about-hero-grid">
          <div className="powerup-about-hero-copy">
            <div className="powerup-kicker-row">
              <span className="powerup-kicker">About PowerUp</span>
              <span className="powerup-kicker powerup-kicker-soft">Directory Guide</span>
            </div>
            <p className="powerup-eyebrow">关于 PowerUp</p>
            <h1 className="powerup-page-title powerup-about-title">
              认识这张目录，也知道它适合在什么时候帮到你。
            </h1>
            <p className="powerup-hero-lead">
              这里会说明 PowerUp 收录什么、不收录什么，以及你可以怎样使用这张目录来寻找合适的 Skill 与 MCP Server。
            </p>

            <div className="powerup-hero-actions">
              <Link href="/" className="powerup-button-primary powerup-button-link">
                返回首页
              </Link>
              <a href="#about-content" className="powerup-button-secondary powerup-button-link">
                继续阅读
              </a>
            </div>

            <div className="powerup-pill-row">
              <span className="powerup-summary-pill">定位清楚</span>
              <span className="powerup-summary-pill">收录范围清楚</span>
              <span className="powerup-summary-pill">适合快速了解</span>
            </div>
          </div>

          <aside className="powerup-about-stage">
            <p className="powerup-eyebrow">快速了解</p>
            <h2>{ABOUT_DOCUMENT_TITLE}</h2>
            <p>
              如果你想快速确认这张目录适不适合自己，这一页会把核心信息一次讲清楚。
            </p>
            <div className="powerup-about-stage-list">
              <div>
                <span>适合谁看</span>
                <p>第一次来到 PowerUp，想快速判断这张目录有没有自己需要内容的人。</p>
              </div>
              <div>
                <span>这页会讲</span>
                <p>收录范围、目录用途、使用方式，以及目前的内容边界。</p>
              </div>
              <div>
                <span>阅读路线</span>
                <p>先看页头摘要，再顺着正文章节往下读，就能建立完整判断。</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ContentPanel
        eyebrow="详细介绍"
        title={ABOUT_DOCUMENT_TITLE}
        description="下面会更完整地介绍 PowerUp 的定位、收录范围和当前内容边界。"
        className="min-w-0"
        contentClassName="min-w-0"
      >
        <div id="about-content" className="min-w-0">
          <MarkdownRenderer content={content} />
        </div>
      </ContentPanel>
    </div>
  );
}
