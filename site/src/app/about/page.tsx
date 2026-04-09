import type { Metadata } from "next";

import { MarkdownRenderer } from "@/components/skill/markdown-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ABOUT_DOCUMENT_TITLE, readAboutContent } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "关于",
  description: "了解 PowerUp V1 的目标、收录范围、当前边界与非首版阻塞项。",
};

export default async function AboutPage() {
  const content = await readAboutContent();

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[36px] border border-zinc-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(246,243,235,0.92))] px-6 py-8 shadow-sm sm:px-8">
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-[0.16em] text-zinc-600 uppercase">
            About PowerUp
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            一个先把目录闭环跑通，再逐步扩展能力边界的 V1 MVP。
          </h1>
          <p className="text-base leading-8 text-zinc-700">
            当前版本只解决一件事：把已经发布的 Skill 与 MCP Server 组织成一个可读、可筛选、可继续研究的目录站。
          </p>
        </div>
      </section>

      <Card className="rounded-[30px] border-none bg-white/90 py-0 shadow-sm ring-1 ring-zinc-950/8">
        <CardHeader className="gap-2 border-b border-zinc-100 px-6 py-5">
          <CardTitle className="text-xl text-zinc-950">{ABOUT_DOCUMENT_TITLE}</CardTitle>
          <p className="text-sm leading-7 text-zinc-600">
            本页为静态说明页，专门用来解释 PowerUp 当前做什么、不做什么。
          </p>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <MarkdownRenderer content={content} />
        </CardContent>
      </Card>
    </div>
  );
}
