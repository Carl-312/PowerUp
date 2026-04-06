import Link from "next/link";

import { CATEGORY_LABELS } from "@/lib/categories";
import type { PublicSkillRecord } from "@/types/skill";
import { SKILL_TYPE_LABELS } from "@/types/skill";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formatUpdatedAt = (value: number) => dateFormatter.format(new Date(value * 1000));

interface SkillDetailHeaderProps {
  skill: PublicSkillRecord;
}

export const SkillDetailHeader = ({ skill }: SkillDetailHeaderProps) => (
  <section className="rounded-[36px] border border-amber-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,243,236,0.9))] px-6 py-8 shadow-sm sm:px-8">
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950">
        返回目录
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.9fr)]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium tracking-[0.14em] text-amber-900 uppercase">
              {SKILL_TYPE_LABELS[skill.type]}
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700">
              {CATEGORY_LABELS[skill.category]}
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500">
              {skill.slug}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {skill.name}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-700">{skill.summary}</p>
          </div>

          {skill.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs text-zinc-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-zinc-950">基础信息</h2>
            <dl className="grid gap-3 text-sm text-zinc-700">
              <div className="grid gap-1">
                <dt className="text-zinc-500">作者 / 维护组织</dt>
                <dd className="font-medium text-zinc-950">{skill.author}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-zinc-500">最后更新</dt>
                <dd className="font-medium text-zinc-950">{formatUpdatedAt(skill.updated_at)}</dd>
              </div>
              {skill.license ? (
                <div className="grid gap-1">
                  <dt className="text-zinc-500">开源协议</dt>
                  <dd className="font-medium text-zinc-950">{skill.license}</dd>
                </div>
              ) : null}
              {skill.supported_platforms.length > 0 ? (
                <div className="grid gap-2">
                  <dt className="text-zinc-500">支持平台</dt>
                  <dd className="flex flex-wrap gap-2">
                    {skill.supported_platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
                      >
                        {platform}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  </section>
);
