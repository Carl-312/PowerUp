import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/categories";
import { formatUpdatedAt, getSkillFallbackIcon } from "@/lib/skill-presentation";
import type { PublicSkillRecord } from "@/types/skill";
import { SKILL_TYPE_LABELS } from "@/types/skill";

interface SkillDetailHeaderProps {
  skill: PublicSkillRecord;
}

export const SkillDetailHeader = ({ skill }: SkillDetailHeaderProps) => {
  const fallbackIcon = getSkillFallbackIcon(skill);

  return (
    <section className="powerup-detail-hero">
      <div className="powerup-detail-hero-grid">
        <div className="powerup-detail-hero-copy">
          <div className="powerup-detail-back-row">
            <Link href="/" className="powerup-button-ghost powerup-button-link">
              返回目录
            </Link>
            <Link
              href={`/category/${skill.category}`}
              className="powerup-button-secondary powerup-button-link"
            >
              前往 {CATEGORY_LABELS[skill.category]}
            </Link>
          </div>

          <div className="powerup-card-chip-row">
            <span className="powerup-card-chip powerup-card-chip-accent">
              {SKILL_TYPE_LABELS[skill.type]}
            </span>
            <span className="powerup-card-chip">{CATEGORY_LABELS[skill.category]}</span>
            <span className="powerup-card-chip">{skill.slug}</span>
          </div>

          <div className="space-y-3">
            <p className="powerup-eyebrow">条目详情</p>
            <h1 className="powerup-page-title powerup-detail-title">{skill.name}</h1>
            <p className="powerup-hero-lead powerup-detail-summary">{skill.summary}</p>
          </div>

          <div className="powerup-hero-actions">
            {skill.doc_url ? (
              <a
                href={skill.doc_url}
                target="_blank"
                rel="noreferrer"
                className="powerup-button-primary powerup-button-link"
              >
                官方文档
                <ExternalLink className="size-4" />
              </a>
            ) : (
              <a href="#skill-body" className="powerup-button-primary powerup-button-link">
                查看详细描述
                <ArrowRight className="size-4" />
              </a>
            )}

            {skill.github_url ? (
              <a
                href={skill.github_url}
                target="_blank"
                rel="noreferrer"
                className="powerup-button-secondary powerup-button-link"
              >
                GitHub
                <ExternalLink className="size-4" />
              </a>
            ) : (
              <a href="#skill-context" className="powerup-button-secondary powerup-button-link">
                看目录定位
                <ArrowRight className="size-4" />
              </a>
            )}
          </div>

          <div className="powerup-detail-stat-grid" aria-label="条目概览">
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>作者</span>
              <strong>{skill.author}</strong>
              <p>公开资料中标注的维护方或来源组织。</p>
            </article>
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>更新时间</span>
              <strong>{formatUpdatedAt(skill.updated_at, "long")}</strong>
              <p>目录最近一次更新这条信息的时间。</p>
            </article>
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>{skill.license ? "许可" : "平台"}</span>
              <strong>
                {skill.license ?? `${Math.max(skill.supported_platforms.length, 1)} 项公开线索`}
              </strong>
              <p>
                {skill.license
                  ? "如果开源协议已公开，这里会直接展示出来。"
                  : "可以结合平台、文档和分类信息快速判断它是否适合继续了解。"}
              </p>
            </article>
          </div>
        </div>

        <aside className="powerup-detail-stage">
          <div className="powerup-detail-stage-visual" aria-hidden="true">
            <span className="powerup-card-visual-token powerup-card-visual-token-a">⭐</span>
            <span className="powerup-card-visual-token powerup-card-visual-token-b">🪙</span>
            <div className="powerup-detail-stage-frame">
              {skill.icon && !skill.icon.startsWith("http") ? (
                <span className="powerup-detail-stage-emoji">{skill.icon}</span>
              ) : skill.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={skill.icon}
                  alt=""
                  className="powerup-detail-stage-image"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="powerup-detail-stage-emoji">{fallbackIcon}</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <span className="powerup-detail-stage-badge">Wonder 2.5D</span>
            <h2>先看清定位，再决定要不要深入了解</h2>
            <p>
              先看用途和分类，再决定去读文档、看仓库，还是继续浏览同类内容，会更容易形成判断。
            </p>
          </div>

          <div className="powerup-detail-stage-list">
            <div>
              <span>世界分区</span>
              <p>{CATEGORY_LABELS[skill.category]}</p>
            </div>
            <div>
              <span>公开入口</span>
              <p>{skill.doc_url ? "已提供官方文档，可继续深入了解功能与使用方式。" : "可以先读正文和基础信息，再决定是否进一步查找资料。"}</p>
            </div>
            <div>
              <span>阅读路线</span>
              <p>先看描述，再看使用信息，最后从侧栏选择外部链接或继续浏览同类内容。</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
