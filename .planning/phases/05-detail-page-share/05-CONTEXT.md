# Phase 5: detail-page-share - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Add one-click sharing to the published detail route at `site/src/app/skill/[slug]/page.tsx` for both `skill` and `mcp_server` entries. The phase covers dynamic PNG generation, copyable share text, and the supporting read-only server/client plumbing needed to make those actions reliable inside the current `site/` runtime. It does not add admin tooling, accounts, write APIs, submission flows, or unrelated search/listing changes.

</domain>

<decisions>
## Implementation Decisions

### Share entry placement
- **D-01:** Put the share entry on the single detail page itself, anchored in the hero/header area so it is visible before deep scrolling.
- **D-02:** Keep the existing detail route `/skill/[slug]`; do not create a standalone share page.
- **D-03:** On desktop, share actions should sit adjacent to or immediately below the existing hero CTA row. On mobile, let the actions wrap and stack within the existing responsive header layout instead of introducing a separate modal-first flow.

### Share outputs and v1 interaction scope
- **D-04:** V1 must ship two primary outputs only: `下载 PNG` and `复制分享文案`.
- **D-05:** New-window image preview may reuse the same server image URL for QA and optional future UI exposure, but it is not a primary v1 CTA.
- **D-06:** `复制图片` is explicitly not a v1 must-have because browser support and secure-context requirements introduce avoidable compatibility risk for the current phase.

### Best source link rule
- **D-07:** Resolve a single `best source link` using this priority: `doc_url` -> `source_url` -> `github_url` -> current detail page URL.
- **D-08:** When `doc_url` wins, label it as official docs/source. When `source_url` wins, label it from `source_kind`. When `github_url` wins, label it as GitHub/source. When all external links are missing, fall back to the current PowerUp detail URL and explicitly say the official source is unavailable.
- **D-09:** Implement this rule in one shared server-side helper so copied text, image generation, and any future share endpoint reuse the same decision path.

### Data sourcing and degradation
- **D-10:** Name, type, category, summary, slug, icon/fallback icon, and updated time come from the existing published detail query path.
- **D-11:** The best source link may read internal governance fields (`source_url`, `source_kind`) on the server, but those fields should not be blindly promoted into the existing public detail API contract just for this feature.
- **D-12:** If future data is missing a summary, degrade to a short `description` excerpt. If icon is missing, reuse the current fallback icon logic. If all external links are missing, keep copy success by falling back to the current detail page URL.

### Image generation architecture
- **D-13:** Generate share images on the server with a dedicated Next Route Handler + `ImageResponse`, not with browser DOM screenshotting as the primary path.
- **D-14:** Use a dedicated share-poster layout derived from current detail-page content, not a pixel-perfect screenshot of the live page.
- **D-15:** Fonts and visual assets for image generation must be managed as image-specific resources in a supported format (`ttf`, `otf`, or `woff`), not by assuming current page fonts or CSS can be reused directly.

### Share-image font policy
- **D-24:** The current page font asset `site/src/app/fonts/SmileySans-Oblique.ttf.woff2` is a browser-UI asset only. Do not load it directly into `ImageResponse`.
- **D-25:** If Phase 5 keeps Smiley Sans in the share poster, vendor a dedicated share-image font asset under `site/src/lib/share/assets/fonts/` in supported `ttf` or `otf` format, with license text stored alongside it.
- **D-26:** Page font management and share-image font management must remain separate: page UI continues to use `next/font/local` from `site/src/app/fonts/`, while the image route reads raw font bytes from a share-specific asset path.
- **D-27:** Phase 5 execution must include font asset budget verification and, if needed, subsetting/regeneration work so image assets stay within Next `ImageResponse` constraints.

### Client/server split
- **D-16:** Server is responsible for loading the published record, resolving the best source link, and rendering PNG bytes.
- **D-17:** Client is responsible for user-triggered download and text copy, including loading state and inline success/failure feedback.
- **D-18:** Keep the feature fully read-only; do not add persistence, analytics writes, or user-owned share history.

### Failure and mobile behavior
- **D-19:** If image generation fails, the download action should fail gracefully with inline error text and leave the rest of the detail page usable.
- **D-20:** If clipboard copy fails, fall back to textarea/select copy or show clear manual-copy guidance rather than failing silently.
- **D-21:** Mobile behavior should prefer wrapped buttons or stacked layout inside the existing responsive detail header instead of adding a drawer or bottom sheet.

### Reference repo borrowing
- **D-22:** Borrow reusable patterns from `greeting-genius` only where they match PowerUp needs: template/config separation, explicit export presets, font/resource discipline, and fallback-aware export UX.
- **D-23:** Do not transplant `fabric` or `html2canvas` into PowerUp as the default implementation. PowerUp should stay aligned with current Next.js App Router capabilities unless execution proves a real gap.

### Re-opened Fabric.js 6.x evaluation
- **D-28:** If Fabric.js 6.x is revisited after the current research pass, treat it as a browser-side export spike or fallback candidate only; it is not the primary v1 share-image renderer.
- **D-29:** Do not plan `fabric/node` server-side image generation as part of the main Phase 5 path. For the current PowerUp site, the added `node-canvas`/`jsdom`/native dependency burden is disproportionate to a lightweight detail-page share feature.

### the agent's Discretion
- Exact badge copy, poster color tokens, and success/error microcopy
- Exact button/icon arrangement within the chosen header placement
- Whether image preview is surfaced as a visible secondary link in v1 or kept as QA-only capability

</decisions>

<specifics>
## Specific Ideas

- User explicitly identified `site/` as the formal runtime root and `site/src/app/skill/[slug]/page.tsx` as the real detail entry.
- User wants the plan to separate service-side image generation, client-side download/copy triggers, field provenance, and missing-field fallback rules.
- `greeting-genius` is accessible through GitHub tooling but is not cloned locally in this workspace.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current detail-page implementation
- `site/src/app/skill/[slug]/page.tsx` — current published detail route and sidebar layout
- `site/src/components/skill/skill-detail-header.tsx` — current hero CTA area and the most likely share-entry insertion point
- `site/src/app/layout.tsx` — current page-font loading via `next/font/local`
- `site/src/app/globals.css` — existing detail-page responsive layout rules and action-row wrapping behavior
- `site/src/app/fonts/SmileySans-Oblique.ttf.woff2` — current vendored Smiley Sans webfont used by the page UI

### Data model and read path
- `site/src/lib/queries/skills.ts` — published list/detail queries and current public-row mapping
- `site/src/types/skill.ts` — public vs internal field boundary, including `source_url` and `source_kind`
- `site/src/db/schema.ts` — authoritative skill table columns
- `site/src/db/seed-data.ts` — current seed shape and link population baseline

### Current API / contract layer
- `site/src/app/api/v1/skills/[slug]/route.ts` — existing published detail API
- `site/src/lib/api/serializers.ts` — current detail payload mapping
- `shared/powerup-api-contract.ts` — current public contract; useful for deciding whether share data should stay internal or be promoted

### Current repo truth docs
- `docs/CURRENT-STATE.md` — current runtime capabilities and boundaries
- `docs/ROUTING-RENDER-SEARCH.md` — route ownership and 404 rules
- `docs/DATA-AND-CONTENT.md` — public/internal field definitions and visibility constraints
- `docs/DEVELOPMENT.md` — validation commands and smoke-test expectations

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SkillDetailHeader` already owns the top-of-page CTA area and can host a small client share island without inventing a new page region.
- `getSkillFallbackIcon()` in `site/src/lib/skill-presentation.ts` gives a ready fallback icon path for entries missing `icon`.
- `formatUpdatedAt()` already normalizes the user-facing date formatting used on the detail page.
- `site/src/components/ui/button.tsx` and existing `powerup-button-*` classes can style share actions without importing a new UI library.
- The current Smiley Sans font is already part of the page brand, but only through browser-side CSS variable injection; share-image rendering needs its own explicit asset pipeline.

### Established Patterns
- Detail pages are server components with cached query helpers and `revalidate = 3600`; client interactivity is introduced selectively via small client components.
- The current public detail query intentionally omits internal governance fields, so share-specific source resolution should happen in a server-only helper rather than by leaking raw internal columns into every consumer.
- `site/` currently has only read-only routes; a binary share-image route fits the existing boundary better than any write-side endpoint.

### Integration Points
- Server-only share data resolver alongside the existing query layer
- New read-only PNG route nested under `app/api/v1/**`
- Client share actions component mounted from the detail header/page using server-derived props
- Existing smoke script and query tests as the first validation hooks for the new behavior

</code_context>

<deferred>
## Deferred Ideas

- Browser-level `复制图片` action behind `navigator.clipboard.write()` capability detection
- Reusing the same poster renderer for route-level `opengraph-image.tsx` metadata
- Exposing share payloads to `frontendv2/` or external API consumers
- Per-entry template customization beyond the default PowerUp share poster

</deferred>

---

*Phase: 05-detail-page-share*
*Context gathered: 2026-04-11*
