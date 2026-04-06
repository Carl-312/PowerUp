# PowerUp Site

PowerUp V1 is a Next.js + SQLite directory site for curated Skills and MCP servers.

## Current Status

- `T2-01` is in place: Drizzle schema, SQLite connection, and shared skill types are defined.
- `T2-02` is in place: seed data is idempotent and currently loads 18 records across 8 categories.
- `T2-03` is intentionally deferred for V1: search indexing, FTS5 triggers, and highlight snippets are backlog work.
- The current V1 search baseline is plain `/?q=` matching over normal table fields, implemented later in the query layer.

## Local Commands

```bash
npm install
npm run typecheck
npm run db:push
npm run db:seed
npm run dev
```

## Database Notes

- Default database path: `site/data/powerup.db`
- Override with `DATABASE_URL` if needed.
- `npm run db:seed` is safe to repeat and updates rows by `slug`.

## V1 Search Boundary

- Keep search on basic SQLite field matching for now.
- Do not introduce FTS5 tables, custom SQL migrations, triggers, or snippet highlighting into the V1 critical path.
- `T3-01` should proceed directly on top of the current schema and seed data.
