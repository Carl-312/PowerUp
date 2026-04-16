# PowerUp

开放共建的 Agent 能力发现平台。PowerUp 从精选起步，向社区生长，让非技术用户零门槛探索，让好用的 AI 工具被更多人发现和分享。

## 我们想做什么

PowerUp 不只是一个“工具列表页”，而是一个帮助更多人真正看懂、找到、比较并继续使用 Agent 能力的入口。

今天，Skill、MCP Server、Agent 工具和工作流插件正在快速增长，但普通用户面临几个真实问题：

- 不知道从哪里开始找
- 看不懂工具名字背后的实际用途
- 很难判断一个能力适不适合自己
- 好用的工具往往散落在社区帖子、代码仓库和朋友口口相传里

PowerUp 希望把这些分散的信息重新组织起来，先用精选内容建立质量感，再逐步长成一个社区共同建设的能力发现平台。

## PowerUp 想服务谁

- 想尝试 AI Agent，但没有技术背景的普通用户
- 想快速寻找合适 Skill 或 MCP Server 的创作者、独立开发者和运营同学
- 想让自己做的 Agent 工具被更多人看见的开发者和项目方

我们的目标不是让用户先理解复杂的技术名词，而是让他们先理解：

- 这个能力是干什么的
- 适合什么场景
- 为什么值得继续点进去
- 去哪里可以进一步体验、安装或接入

## 当前产品方向

PowerUp 现阶段从“精选发现”出发，优先做好这几件事：

- 把值得关注的 Skill 与 MCP Server 收录成可浏览、可搜索、可分类理解的目录
- 用更易读的页面结构解释工具的用途，而不只展示技术字段
- 让用户可以从首页、分类页和详情页快速完成第一次认知
- 为后续的社区投稿、推荐、共建和分享机制预留生长空间

一句话说，PowerUp 现在先做“值得逛”，未来再做“值得一起建设”。

## 为什么这个方向重要

如果 Agent 生态要真正走向更广泛的人群，只靠技术社区内部传播是不够的。还需要一个更容易进入的发现层：

- 对非技术用户更友好
- 对开发者更有展示价值
- 对社区贡献者更容易参与

PowerUp 想承担的就是这个角色：把“会用的人知道的好工具”，逐步变成“更多人都能看见并理解的好工具”。

## 开放共建会长什么样

当前仓库还在精选目录阶段，但整个项目会朝开放共建演进。未来理想中的 PowerUp 会逐步支持：

- 社区推荐值得收录的 Agent 能力
- 更清晰的条目介绍、标签和使用场景说明
- 更可信的精选、整理与审核机制
- 让开发者更容易提交自己的工具信息
- 让用户更容易发现、收藏、分享和传播好工具

如果你认同这个方向，欢迎关注、提 issue、提 PR，或者直接基于现有结构继续完善内容和体验。

## 当前仓库里有什么

`/home/carl/PowerUp` 是仓库根协调层，不是单一应用根。当前主要结构如下：

- [`site/`](./site/)：当前运行中的 Next.js 站点，包含页面、只读 API、SQLite/Drizzle 数据层和验证脚本
- [`frontendv2/`](./frontendv2/)：独立前端实验工作区，按 API-first 方式消费 `site` 暴露的接口
- [`shared/`](./shared/)：前后端共享 taxonomy 与 API contract
- [`docs/`](./docs/)：围绕当前代码整理的实现说明、开发方式和状态文档
- [`specs-v1/`](./specs-v1/)：产品目标与 contract，属于约束层，不等于当前实现快照

## 当前已经能做什么

目前 PowerUp 已经提供一版可运行的发现体验，包含：

- 页面入口：
  - `/`
  - `/category/[category]`
  - `/skill/[slug]`
  - `/about`
- 只读 API：
  - `/api/v1/skills`
  - `/api/v1/skills/[slug]`
  - `/api/v1/categories`
  - `/api/v1/content/about`
- 数据来源：
  - `site/src/db/schema.ts`
  - `site/src/db/seed-data.ts`
  - 默认本地库 `site/data/powerup.db`

当前前台只展示 `review_status = "published"` 的条目。

## 如果你想参与这个项目

你可以从几个方向参与：

- 内容层：补充条目说明、优化分类、完善 about 文案
- 产品层：改进发现路径、搜索体验、详情页表达和信息架构
- 工程层：优化前端体验、只读 API、数据模型、验证脚本和部署准备

如果你的目标是判断“这个项目现在真实做到了什么”，优先相信 `site/src/**` 与 `docs/**`，不要把 `specs-v1/**` 或 `.planning/**` 当成当前实现真源。

## 运行项目

从 [`site/`](./site/) 目录执行：

```bash
cd site
npm install
npm run dev
```

开发服务器默认会启动在 `http://localhost:3000`。

## 工程与技术信息

这一部分放给需要继续开发、排查或扩展仓库的同学。

### 常用验证命令

```bash
npm run lint
npm run typecheck
npm run test
npm run test:smoke
npm run verify
```

### 当前开发约定

- `npm run dev` 会先执行开发预检，清理当前项目遗留的 `next dev` 进程和 `.next/dev/lock`
- 未显式设置 `DATABASE_URL` 时，会为默认本地 SQLite 自动补建 schema，并在空库时自动写入 seed
- 搜索目前是基础字段匹配，不包含 FTS5、搜索建议或高亮片段
- 当前只有只读 API，没有后台、账号体系、投稿审核流或公开写接口
- `frontendv2/` 仍是独立工作区，不是当前正式运行入口

### 建议阅读顺序

1. [`AGENTS.md`](./AGENTS.md)
2. [`docs/README.md`](./docs/README.md)
3. [`docs/CURRENT-STATE.md`](./docs/CURRENT-STATE.md)
4. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
5. [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)
6. [`site/README.md`](./site/README.md)
