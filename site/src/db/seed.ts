import { asc, count } from "drizzle-orm";

import { db, databasePath, sqlite } from "./index";
import { seedSkills } from "./seed-data";
import { skills, type NewSkillRow } from "./schema";

const now = Math.floor(Date.now() / 1000);

const normalizeSeedSkill = (skill: (typeof seedSkills)[number]): NewSkillRow => ({
  name: skill.name,
  slug: skill.slug,
  type: skill.type,
  icon: skill.icon ?? null,
  summary: skill.summary,
  description: skill.description,
  category: skill.category,
  tags: JSON.stringify(skill.tags),
  author: skill.author,
  license: skill.license ?? null,
  github_url: skill.github_url ?? null,
  doc_url: skill.doc_url ?? null,
  install_guide: skill.install_guide ?? null,
  config_example: skill.config_example ?? null,
  supported_platforms: JSON.stringify(skill.supported_platforms),
  source_url: skill.source_url,
  source_kind: skill.source_kind,
  last_verified_at: skill.last_verified_at,
  review_status: skill.review_status ?? "published",
  created_at: skill.created_at ?? now,
  updated_at: skill.updated_at,
});

const buildUpsertSet = (row: NewSkillRow) => ({
  name: row.name,
  type: row.type,
  icon: row.icon,
  summary: row.summary,
  description: row.description,
  category: row.category,
  tags: row.tags,
  author: row.author,
  license: row.license,
  github_url: row.github_url,
  doc_url: row.doc_url,
  install_guide: row.install_guide,
  config_example: row.config_example,
  supported_platforms: row.supported_platforms,
  source_url: row.source_url,
  source_kind: row.source_kind,
  last_verified_at: row.last_verified_at,
  review_status: row.review_status,
  updated_at: row.updated_at,
});

const getTotalCount = () =>
  db.select({ total: count() }).from(skills).get()?.total ?? 0;

const getCategoryBreakdown = () =>
  db
    .select({
      category: skills.category,
      total: count(),
    })
    .from(skills)
    .groupBy(skills.category)
    .orderBy(asc(skills.category))
    .all();

const main = async () => {
  const beforeCount = getTotalCount();
  const rows = seedSkills.map(normalizeSeedSkill);

  db.transaction((tx) => {
    for (const row of rows) {
      tx
        .insert(skills)
        .values(row)
        .onConflictDoUpdate({
          target: skills.slug,
          set: buildUpsertSet(row),
        })
        .run();
    }
  });

  const afterCount = getTotalCount();
  const categoryBreakdown = getCategoryBreakdown();

  console.log(
    JSON.stringify(
      {
        databasePath,
        processed_records: rows.length,
        total_records_before: beforeCount,
        total_records_after: afterCount,
        category_coverage: categoryBreakdown.length,
        category_breakdown: categoryBreakdown,
      },
      null,
      2,
    ),
  );
};

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    sqlite.close();
  });
