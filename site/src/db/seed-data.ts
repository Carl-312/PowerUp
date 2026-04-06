import type { SkillSeedRecord } from "@/types/skill";

const ts = (value: string) => Math.floor(new Date(value).getTime() / 1000);

const ANTHROPIC_SKILLS_REPO = "https://github.com/anthropics/skills";
const ANTHROPIC_SKILLS_BASE =
  "https://github.com/anthropics/skills/tree/main/skills";
const MCP_SERVERS_REPO = "https://github.com/modelcontextprotocol/servers";
const MCP_SERVERS_BASE =
  "https://github.com/modelcontextprotocol/servers/tree/main/src";

export const seedSkills: SkillSeedRecord[] = [
  {
    name: "Everything MCP Server",
    slug: "everything-mcp",
    type: "mcp_server",
    summary:
      "Official reference server that exposes prompts, resources, and tools in one package.",
    description:
      "The `everything` server is a compact reference implementation for exercising multiple Model Context Protocol capabilities in one target. It is useful when validating a client or demo environment before wiring in more specialized servers.",
    category: "other",
    tags: ["reference", "testing", "prompts", "resources"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/everything`,
    install_guide:
      "Clone or install from the official `modelcontextprotocol/servers` repository, then enable the `everything` server in your MCP client config.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/everything`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-30T00:00:00Z"),
  },
  {
    name: "Fetch MCP Server",
    slug: "fetch-mcp",
    type: "mcp_server",
    summary:
      "Fetches remote web content so an agent can read pages and pull structured text.",
    description:
      "The `fetch` server adds network retrieval to an MCP client, making it easier to inspect documentation pages, articles, and other public web resources from a tool call.",
    category: "search-information",
    tags: ["web", "http", "retrieval", "docs"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/fetch`,
    install_guide:
      "Enable the `fetch` server from the official MCP servers repository and provide the runtime with network access where needed.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/fetch`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-28T00:00:00Z"),
  },
  {
    name: "Filesystem MCP Server",
    slug: "filesystem-mcp",
    type: "mcp_server",
    summary:
      "Adds controlled file and directory access for local workspace exploration and editing flows.",
    description:
      "The `filesystem` server gives an MCP client scoped access to files and folders. It is a common choice for coding assistants that need to inspect repositories or manage project assets without exposing the whole machine.",
    category: "files-storage",
    tags: ["files", "workspace", "local", "storage"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/filesystem`,
    install_guide:
      "Point the server at explicit allowed roots so the client only receives filesystem access inside approved directories.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/filesystem`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-26T00:00:00Z"),
  },
  {
    name: "Git MCP Server",
    slug: "git-mcp",
    type: "mcp_server",
    summary:
      "Exposes repository history and git operations through MCP for code-aware assistants.",
    description:
      "The `git` server helps an agent inspect repository state, branch history, and changes without reimplementing git parsing itself. It is useful for review, release, and debugging workflows.",
    category: "developer-tools",
    tags: ["git", "version-control", "review", "repo"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/git`,
    install_guide:
      "Wire the server into a repository-aware client so git actions stay inside an intended project root.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/git`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-29T00:00:00Z"),
  },
  {
    name: "Memory MCP Server",
    slug: "memory-mcp",
    type: "mcp_server",
    summary:
      "Stores lightweight memory so an agent can recall facts across longer workflows.",
    description:
      "The `memory` server gives an MCP client a place to persist and retrieve structured notes. It is helpful for recurring tasks where the assistant should retain preferences, intermediate findings, or project context.",
    category: "other",
    tags: ["memory", "context", "persistence", "notes"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/memory`,
    install_guide:
      "Connect the server where long-running agent sessions benefit from persisted memory instead of only in-context conversation state.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/memory`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-24T00:00:00Z"),
  },
  {
    name: "Sequential Thinking MCP Server",
    slug: "sequential-thinking-mcp",
    type: "mcp_server",
    summary:
      "Supports explicit step-by-step reasoning traces for complex problem solving.",
    description:
      "The `sequentialthinking` server is designed for workflows where an assistant benefits from recording ordered reasoning steps before acting. It is commonly used in analysis-heavy coding and planning tasks.",
    category: "developer-tools",
    tags: ["reasoning", "planning", "analysis", "workflow"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/sequentialthinking`,
    install_guide:
      "Enable the server when your client should preserve visible reasoning steps or structured deliberation artifacts.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/sequentialthinking`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-31T00:00:00Z"),
  },
  {
    name: "Time MCP Server",
    slug: "time-mcp",
    type: "mcp_server",
    summary:
      "Provides current time and timezone utilities for date-aware agent tasks.",
    description:
      "The `time` server solves a simple but recurring gap for assistants: getting authoritative current time values across timezones without guessing from stale model context.",
    category: "other",
    tags: ["time", "timezone", "calendar", "utility"],
    author: "Model Context Protocol",
    github_url: MCP_SERVERS_REPO,
    doc_url: `${MCP_SERVERS_BASE}/time`,
    install_guide:
      "Use the server wherever prompts or automations depend on exact current dates, times, or timezone conversions.",
    supported_platforms: ["MCP-compatible clients"],
    source_url: `${MCP_SERVERS_BASE}/time`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-25T00:00:00Z"),
  },
  {
    name: "Algorithmic Art Skill",
    slug: "algorithmic-art-skill",
    type: "skill",
    summary:
      "A reusable skill for generating systematic visual concepts and algorithmic art directions.",
    description:
      "This Anthropic skill packages guidance for turning creative prompts into structured visual systems. It is a useful reference when an assistant needs to bridge art direction, repeatable rules, and production-ready outputs.",
    category: "design-media",
    tags: ["art", "creative", "visual-system", "design"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/algorithmic-art`,
    install_guide:
      "Add the skill from the official `anthropics/skills` repository into your local skills directory, then load it in a compatible Anthropic-style workflow.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/algorithmic-art`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-18T00:00:00Z"),
  },
  {
    name: "Brand Guidelines Skill",
    slug: "brand-guidelines-skill",
    type: "skill",
    summary:
      "Helps an assistant apply a brand system consistently when drafting copy or assets.",
    description:
      "The Brand Guidelines skill gives a model a stable operating frame for voice, tone, and visual consistency. It is valuable when output quality depends on preserving a recognizable brand standard across many deliverables.",
    category: "design-media",
    tags: ["brand", "style-guide", "copy", "consistency"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/brand-guidelines`,
    install_guide:
      "Install from the official Anthropic skills repository and pair it with project-specific brand assets or editorial rules.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/brand-guidelines`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-20T00:00:00Z"),
  },
  {
    name: "Document Coauthoring Skill",
    slug: "doc-coauthoring-skill",
    type: "skill",
    summary:
      "Supports collaborative drafting, revision, and editorial iteration on long-form docs.",
    description:
      "The Document Coauthoring skill focuses on helping an assistant behave like a disciplined writing partner. It is a good fit for proposals, specs, and team documents that require structure and revision rather than single-shot text generation.",
    category: "content-writing",
    tags: ["writing", "editing", "docs", "collaboration"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/doc-coauthoring`,
    install_guide:
      "Install the skill into your Anthropic-compatible skill directory and invoke it during drafting or revision sessions.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/doc-coauthoring`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-17T00:00:00Z"),
  },
  {
    name: "XLSX Skill",
    slug: "xlsx-skill",
    type: "skill",
    summary:
      "Improves spreadsheet-oriented workflows such as analysis, cleanup, and structured export.",
    description:
      "The XLSX skill is aimed at workflows where a model needs to think in rows, columns, and tabular transformations. It fits operational reporting, ad hoc analysis, and spreadsheet-heavy business tasks.",
    category: "data-analytics",
    tags: ["spreadsheet", "xlsx", "analysis", "tabular"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/xlsx`,
    install_guide:
      "Load the skill in a runtime that supports Anthropic-style skill packaging before asking the assistant to manipulate workbook-oriented tasks.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/xlsx`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-19T00:00:00Z"),
  },
  {
    name: "PDF Skill",
    slug: "pdf-skill",
    type: "skill",
    summary:
      "Adds repeatable guidance for extracting, summarizing, and reasoning over PDF documents.",
    description:
      "The PDF skill is useful when an assistant needs to work through longer reports, manuals, or other PDF-first sources while preserving structure and minimizing missed sections.",
    category: "files-storage",
    tags: ["pdf", "document", "extraction", "summary"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/pdf`,
    install_guide:
      "Install from the Anthropic skills repository and use it for workflows centered on PDF ingestion or analysis.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/pdf`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-16T00:00:00Z"),
  },
  {
    name: "DOCX Skill",
    slug: "docx-skill",
    type: "skill",
    summary:
      "Tailors an assistant for Microsoft Word style documents and structured editing passes.",
    description:
      "The DOCX skill helps a model work more reliably with Word-oriented content and editing constraints. It is relevant when teams exchange files in DOCX rather than plain Markdown.",
    category: "files-storage",
    tags: ["docx", "word", "editing", "document"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/docx`,
    install_guide:
      "Install the skill from `anthropics/skills` and use it when your workflow depends on DOCX documents rather than Markdown-first assets.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/docx`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-14T00:00:00Z"),
  },
  {
    name: "PPTX Skill",
    slug: "pptx-skill",
    type: "skill",
    summary:
      "Guides slide-oriented storytelling, deck structure, and presentation asset preparation.",
    description:
      "The PPTX skill is designed for workflows where an assistant helps outline and refine slide decks. It is useful for turning messy notes into a presentation narrative with clearer structure.",
    category: "files-storage",
    tags: ["pptx", "slides", "presentation", "storytelling"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/pptx`,
    install_guide:
      "Load the skill before asking an assistant to draft or critique presentation materials destined for PPTX workflows.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/pptx`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-13T00:00:00Z"),
  },
  {
    name: "Internal Comms Skill",
    slug: "internal-comms-skill",
    type: "skill",
    summary:
      "Improves internal announcements, updates, and team-facing communication artifacts.",
    description:
      "The Internal Comms skill helps an assistant write for employees rather than customers. It fits rollout notes, change announcements, leadership updates, and similar communication work that benefits from clearer audience framing.",
    category: "communication-collaboration",
    tags: ["comms", "team", "announcement", "writing"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/internal-comms`,
    install_guide:
      "Install the skill from the Anthropic skills repository and pair it with organizational tone or policy guidance where available.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/internal-comms`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-15T00:00:00Z"),
  },
  {
    name: "MCP Builder Skill",
    slug: "mcp-builder-skill",
    type: "skill",
    summary:
      "A skill focused on planning and scaffolding new MCP servers or adapters.",
    description:
      "The MCP Builder skill helps an assistant reason about server capabilities, tool surfaces, and implementation steps when creating a new MCP integration. It is directly aligned with developer enablement workflows.",
    category: "developer-tools",
    tags: ["mcp", "builder", "integration", "scaffold"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/mcp-builder`,
    install_guide:
      "Install from the official Anthropic skills repository before using the assistant to scope or prototype new MCP servers.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/mcp-builder`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-22T00:00:00Z"),
  },
  {
    name: "Webapp Testing Skill",
    slug: "webapp-testing-skill",
    type: "skill",
    summary:
      "Provides a testing mindset and repeatable heuristics for browser-based app verification.",
    description:
      "The Webapp Testing skill is oriented around validating flows, catching regressions, and structuring browser test passes. It is useful when an assistant needs to behave more like a QA or release engineer.",
    category: "developer-tools",
    tags: ["testing", "qa", "browser", "verification"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/webapp-testing`,
    install_guide:
      "Install the skill into a compatible runtime before using the assistant for exploratory testing or structured web QA passes.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/webapp-testing`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-23T00:00:00Z"),
  },
  {
    name: "Theme Factory Skill",
    slug: "theme-factory-skill",
    type: "skill",
    summary:
      "Helps an assistant define reusable visual themes and token-oriented styling systems.",
    description:
      "The Theme Factory skill is useful for translating a loose aesthetic brief into a coherent set of design tokens, palettes, and stylistic rules that can be reused across a product surface.",
    category: "design-media",
    tags: ["theme", "design-system", "tokens", "ui"],
    author: "Anthropic",
    github_url: ANTHROPIC_SKILLS_REPO,
    doc_url: `${ANTHROPIC_SKILLS_BASE}/theme-factory`,
    install_guide:
      "Install from the Anthropic skills repository and combine it with project constraints such as brand colors, motion rules, or component libraries.",
    supported_platforms: ["Anthropic-style skill runtimes"],
    source_url: `${ANTHROPIC_SKILLS_BASE}/theme-factory`,
    source_kind: "github_repo",
    last_verified_at: ts("2026-04-04T00:00:00Z"),
    updated_at: ts("2026-03-21T00:00:00Z"),
  },
];
