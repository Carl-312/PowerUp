import { CATEGORY_SLUGS } from "@/lib/categories";
import { REVIEW_STATUSES, SKILL_TYPES, SOURCE_KINDS } from "@/types/skill";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const skills = sqliteTable(
  "skills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    type: text("type", { enum: SKILL_TYPES }).notNull(),
    icon: text("icon"),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    category: text("category", { enum: CATEGORY_SLUGS }).notNull(),
    tags: text("tags").notNull().default("[]"),
    author: text("author").notNull(),
    license: text("license"),
    github_url: text("github_url"),
    doc_url: text("doc_url"),
    install_guide: text("install_guide"),
    config_example: text("config_example"),
    supported_platforms: text("supported_platforms").notNull().default("[]"),
    source_url: text("source_url").notNull(),
    source_kind: text("source_kind", { enum: SOURCE_KINDS }).notNull(),
    last_verified_at: integer("last_verified_at", { mode: "number" }).notNull(),
    review_status: text("review_status", { enum: REVIEW_STATUSES })
      .notNull()
      .default("draft"),
    created_at: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(unixepoch())`),
    updated_at: integer("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("skills_slug_unique").on(table.slug),
    index("skills_type_idx").on(table.type),
    index("skills_category_idx").on(table.category),
    index("skills_review_status_idx").on(table.review_status),
    index("skills_updated_at_idx").on(table.updated_at),
  ],
);

export type SkillRow = typeof skills.$inferSelect;
export type NewSkillRow = typeof skills.$inferInsert;
