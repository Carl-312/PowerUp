# Frontend V2 Migration Prompt

下面这份提示词用于逐步把 `frontendv2/` 移植到正式前端，而不是一次性大爆炸替换。

## 使用方式

- 把它发给你的 AI coding agent
- 每次只做一个小阶段
- 要求 agent 先审视当前代码，再直接改代码、跑验证、汇报风险

## Prompt

```text
你现在要继续推进 PowerUp，把 /home/carl/PowerUp/frontendv2 中已经打磨过的独立前端，逐步移植到正式前端实现中。

项目背景：
- 仓库根目录：/home/carl/PowerUp
- 当前正式运行根主要在 /home/carl/PowerUp/site
- 独立前端实验与迁移候选实现位于 /home/carl/PowerUp/frontendv2
- 前后端共享 contract 位于 /home/carl/PowerUp/shared
- frontendv2 已经具备首页、分类页、详情页、关于页，且完成了一轮视觉与性能优化

目标：
- 不是重写一个全新网站
- 而是“逐步把 frontendv2 的成熟实现迁移到正式前端”
- 迁移过程中保持 API-first 架构，不破坏现有数据边界
- 每一轮都只迁移一个清晰范围，保证可验证、可回退、可继续

硬性要求：
- 先审视 site 和 frontendv2 的对应结构，再直接改代码
- 不要一次性推翻 site 当前结构
- 优先复用 frontendv2 中已经验证过的布局、组件思想、信息层级和性能优化策略
- 不允许让 frontendv2 重新耦合 site/src/db/** 或 site/src/lib/queries/**
- 如果需要数据，继续通过现有 API contract 或共享 contract 推进
- 保持中文排版质量、移动端稳定性和当前 Mario Wonder 风格的 2.5D 气质
- 每次完成后都要运行相关 build / typecheck / verify，并明确汇报结果

执行方式：
1. 先比较当前 site 对应页面与 frontendv2 对应页面的结构差异
2. 选出“最适合本轮迁移”的一个页面或一个局部模块
3. 直接实施迁移，不要只写建议
4. 完成后输出：
   - 本轮迁移了什么
   - 复用了 frontendv2 的哪些部分
   - 做了哪些适配而不是生搬硬套
   - 风险和下一轮最合适继续迁移的点

本轮优先级判断规则：
- 优先做收益高、耦合低、可单独验证的迁移
- 优先顺序通常是：
  1. 全局 shell / header / footer
  2. 首页排版与目录浏览区
  3. 分类页
  4. 详情页
  5. About 页
  6. 通用组件抽取
  7. SEO、metadata、SSR/SSG、加载策略细化

如果你判断当前最适合迁移的不是整页，而是某个关键模块，也可以拆成：
- 导航与搜索区
- Hero 与主视觉区
- 目录卡片系统
- 筛选与分页区
- 详情页正文 + 侧栏结构
- API client / contract 对齐层

请现在开始：
- 先审视代码库
- 选定本轮迁移范围
- 然后直接改代码、运行验证、汇报结果
```
