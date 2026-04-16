# Phase 5: detail-page-share - Research

**Date:** 2026-04-11
**Status:** Complete
**Scope:** Research-only planning pass based on current `PowerUp` code and the accessible `greeting-genius` reference repo.

## 1. Current PowerUp Findings

### 1.1 Detail page runtime boundary
- Real runtime root is `site/`; repo root is orchestration only.
- Published detail route is `site/src/app/skill/[slug]/page.tsx`.
- Detail page is a server component with `revalidate = 3600`, and currently renders:
  - Hero/header via `SkillDetailHeader`
  - Main description / integration panels
  - Sidebar context, external links, and next-step actions

### 1.2 Current data shape relevant to sharing
- `site/src/lib/queries/skills.ts` currently returns `PublicSkillRecord` for detail pages, which includes:
  - `name`, `slug`, `type`, `summary`, `description`, `category`, `icon`, `doc_url`, `github_url`, `supported_platforms`, `updated_at`
- Internal governance fields exist in `site/src/types/skill.ts` and `site/src/db/schema.ts`:
  - `source_url`
  - `source_kind`
  - `last_verified_at`
  - `review_status`
  - `created_at`
- Public detail API does not expose `source_url` or `source_kind`.

### 1.3 Current route and API reality
- Existing read-only detail API is `GET /api/v1/skills/[slug]`.
- There is no share-image route, no binary output route, and no share helper module today.
- There is no site-wide origin env like `NEXT_PUBLIC_SITE_URL` or `APP_URL`; current copy fallback should therefore prefer `window.location.href` when the current detail page URL is needed.

### 1.4 Seed baseline
- Current seed baseline is fully populated for external links: all 18 current seed records have `doc_url`, `github_url`, and `source_url`.
- This means fallback logic is still required for robustness, but current smoke coverage will not naturally hit missing-link branches unless tests create targeted fixtures.

### 1.5 Current font asset reality in this repo
- The only checked-in Smiley Sans asset under the running `site/` app today is `site/src/app/fonts/SmileySans-Oblique.ttf.woff2`.
- Local file inspection confirms it is a `WOFF2` font, size `1,150,924` bytes (`1.1MB`), SHA-256 `731f22973349404b15a88a99ef3b5dd4104c0965c23b7e485c1f11e84fea99e2`.
- `site/src/app/layout.tsx` loads that file through `next/font/local` and exposes it as the CSS variable `--font-smiley-sans`.
- `site/src/app/globals.css` consumes `--font-smiley-sans` via `--font-app-display` and `--font-app-sans`.
- No `ttf`, `otf`, or `woff` font asset exists in the current repo for server-side share image generation.

## 2. Reference Repo: `greeting-genius`

### 2.1 Accessibility
- Local clone: not present in `/home/carl`.
- Remote repository: accessible through GitHub tooling as `Carl-312/greeting-genius` (private repo available to the current authenticated account).

### 2.2 Relevant files examined
- `README.md`
- `components/Step6Card.tsx`
- `scripts/check-card-templates.mjs`
- `services/card/templates/index.ts`
- `services/card/templates/schema.ts`
- `services/card/templates/resolveTemplateVariables.ts`
- `services/card/templates/v1/classic-red.json`
- `services/card/fabricCardRenderer.ts`
- `services/card/fabricExporter.ts`
- `services/card/cardFontLoader.ts`
- `docs/card-debug-onepager.md`

### 2.3 Patterns worth borrowing

#### Template data structure
- Templates are data-first JSON files with explicit ids, labels, palette, text slots, decoration layers, and export presets.
- A resolver replaces palette tokens like `{{primary}}` into concrete colors before rendering.
- Validation script enforces required palette keys and template consistency before runtime.

**PowerUp takeaway:** Keep poster presentation config separate from business data. Even if PowerUp ships a single share poster initially, a small config object for colors, spacing, and slot rules will keep future poster variants cheap.

#### Rendering/export separation
- Renderer composes a scene from template + content.
- Exporter handles output format, multiplier, max-edge caps, and return metadata separately from scene generation.

**PowerUp takeaway:** Split `share data resolver`, `poster renderer`, and `download trigger` into separate modules. This matches the user requirement to clearly distinguish service-side image generation from client-side interaction.

#### Font/resource discipline
- `cardFontLoader.ts` explicitly preloads and verifies fonts before export.
- Export debugging docs call out font readiness and fallback paths as first-class concerns.

**PowerUp takeaway:** Image generation should not assume UI fonts “just work”. PowerUp needs image-specific font resources in supported formats and explicit loading.

#### Fallback-aware export UX
- `Step6Card.tsx` uses Fabric export first and falls back to `html2canvas` if needed.
- Debug docs explain how to inspect which export path succeeded.

**PowerUp takeaway:** Borrow the product idea of fallback-aware UX, but not the exact implementation stack. PowerUp can expose clear loading/error states around image download without importing Fabric/html2canvas as the default renderer.

### 2.4 Patterns not recommended to copy directly
- `fabric` scene management is tailored to rich card editing, template switching, and optional AI backgrounds. PowerUp does not need that weight for a single detail-page share poster.
- `html2canvas` fallback is useful when rendering a browser DOM preview, but PowerUp’s current best-fit path is a deterministic server-generated PNG rather than client-side DOM capture.
- The reference repo is Vite + React, while PowerUp is Next.js 16.2.2 App Router. The rendering and routing model should remain Next-native.

## 3. Framework Research: Next.js 16.2.2

### 3.1 `ImageResponse`
Current Next.js 16.2.2 docs confirm:
- `ImageResponse` is imported from `next/og`.
- It can run inside Route Handlers for request-time image generation.
- It supports common CSS, but only flexbox plus a subset of CSS properties; advanced layout like CSS grid is not supported.
- Bundle size for image generation is capped at 500KB including JSX, fonts, and assets.
- Supported font formats are `ttf`, `otf`, and `woff`; `ttf`/`otf` are preferred over `woff`. Current repo font is `woff2`, so it should not be assumed reusable for image generation.
- The maximum `ImageResponse` bundle size is `500KB`, including JSX, CSS, fonts, images, and other assets loaded by the image route.

### 3.1.1 Engineering consequence for the current Smiley Sans file
- The current repo font `site/src/app/fonts/SmileySans-Oblique.ttf.woff2` cannot be the direct font input for `ImageResponse` because `woff2` is not a supported format.
- Even if format support were not a blocker, the current file is already about `1.1MB`, which is well above Next's documented `500KB` image bundle budget.
- Therefore the current UI font file is page-only by default and should not be treated as the share-image font source.

### 3.2 Route Handlers vs file-based `opengraph-image.tsx`
Docs indicate:
- `opengraph-image.tsx` is ideal for metadata-driven social images.
- Route Handlers are better when a user explicitly triggers image generation at runtime.

**Planning implication:** For PowerUp’s “download a share image” interaction, a dedicated Route Handler is a better primary fit than `opengraph-image.tsx`. The latter can be layered on later if the same poster should populate social meta tags.

### 3.3 Caching/runtime
- `GET` Route Handlers are request-time by default.
- Special metadata routes can be static unless dynamic data is used.

**Planning implication:** A request-time share-image route matches current requirements and avoids coupling to prerendered outputs. Response caching can be added deliberately after the basic route works.

## 4. Option Analysis

### Option A: Next `ImageResponse` route (server primary)
**What it means**
- Add a server Route Handler that resolves published item data and returns `image/png` from `ImageResponse`.
- Client only triggers the request and handles download/copy interactions.
- Copy text continues to come from a shared server helper, so source resolution stays server-only.

**Pros**
- Deterministic output across devices.
- Smallest runtime/deployment expansion on top of the current Next.js 16.2.2 app.
- Easy to keep using internal governance fields like `source_url/source_kind` on the server without widening the public API.
- Clean QA story: one PNG route, one copy-text helper, one visible entry point.
- Aligned with the current App Router and read-only route model already used in `site/`.

**Cons**
- Needs a dedicated poster layout rather than screenshotting the live page.
- Requires a separate image-font pipeline because the current page font is only available as a `woff2` webfont.
- `ImageResponse` layout support is more limited than full browser CSS.

**Fit for current PowerUp**
- Strongest fit and still the recommended primary route.

### Option B: Fabric.js 6.x browser export
**What it means**
- Mount a lazy client-only share export island on the detail page.
- Render a poster into a browser canvas with Fabric.js 6.x, then export via `toBlob()` or `toDataURL({ format: "png", multiplier })`.
- Use browser-loaded fonts by waiting for font readiness, then drawing text with the chosen `fontFamily`.

**Pros**
- Can benefit from the browser font pipeline, which makes the current `SmileySans-Oblique.ttf.woff2` more reusable than it is with `ImageResponse`.
- Better control over poster composition than DOM screenshot tools while staying inside the browser.
- Avoids the `ImageResponse` `500KB` image-bundle limit because rendering happens client-side.

**Cons**
- Adds a large new client dependency to a site that currently has no `fabric`, `canvas`, or dedicated poster runtime. Current npm metadata reports `fabric@7.2.0` unpacked size at about `25.8MB`; even with tree-shaking and lazy-loading, this is a materially different dependency profile for PowerUp.
- Output becomes browser/device dependent: export latency, memory pressure, and failure rates will vary more on low-end mobile devices.
- Browser canvas export is sensitive to asset readiness. Fonts must finish loading before render, and remote icons/images can taint the canvas if CORS headers are not compatible. This matters in PowerUp because `skill.icon` can already be either an emoji/local asset or an `http` image URL.
- It still needs server-derived share payload props if PowerUp wants to keep `source_url/source_kind` private.

**Fit for current PowerUp**
- Viable only as a focused browser-side spike or fallback candidate. It is not the best primary implementation for the current lightweight directory site.

### Option C: Fabric.js 6.x server export
**What it means**
- Use `fabric/node` in a Next route or server utility.
- Render with `StaticCanvas`/`Canvas` in Node and export via `createPNGStream()` or `toDataURL()`.

**Pros**
- Server controls the output, so browser/device variance is reduced.
- Fabric’s scene model could help if PowerUp later grows into a richer multi-template poster system.

**Cons**
- Fabric’s own Node installation guidance says the Node path depends on `node-canvas` for the canvas implementation and `jsdom` for a `window` implementation, and it explicitly warns that users may encounter `node-canvas` limitations and bugs.
- Current PowerUp `site/package.json` has none of `fabric`, `canvas`, `jsdom`, `playwright`, or `puppeteer` as direct dependencies, so this would introduce the biggest new deployment surface of any option considered here.
- This does not truly fix the current `ImageResponse` font pain; it just moves it into a different server-side font pipeline. The current `next/font/local` + `woff2` setup in `site/src/app/layout.tsx` is still not directly reusable in a `fabric/node` stack.
- For a single read-only poster in a lightweight content site, the added complexity is hard to justify against `ImageResponse`.

**Fit for current PowerUp**
- Poor fit. Do not choose this as the main Phase 5 route.

### Option D: Headless browser screenshot (`Playwright` / `Puppeteer`)
**What it means**
- Render the actual page or a dedicated poster route in a headless browser and take a screenshot of the page or a target element.

**Pros**
- Highest fidelity to the live UI and current browser font stack.
- Can naturally reuse the existing page `woff2` font and current CSS without building a separate poster renderer.
- Best route if the future requirement changes from “share poster” to “pixel-close screenshot of the real page”.

**Cons**
- Heaviest runtime and deployment option. Current docs and package metadata show that Playwright expects browsers plus browser system dependencies, while Puppeteer downloads a compatible Chrome during installation by default.
- Not part of the current app dependency graph; introducing it would change both install and deploy characteristics for a site that is currently a small Next.js directory app.
- Per-request CPU/memory cost is much higher than `ImageResponse` or a plain client-side copy/download flow.
- Operational burden is meaningfully higher for a lightweight site: browser lifecycle, cold starts, timeouts, and sandbox/security considerations all become relevant.

**Fit for current PowerUp**
- Useful for offline generation, QA, or a future high-fidelity branch. Not recommended as the standard runtime path for the current detail-page share feature.

## 4.1 Smiley Sans upstream verification

### Official repo / release evidence
- The upstream repo is `atelier-anchor/smiley-sans`.
- The upstream `README.md` says Releases contain four font files and explicitly distinguishes usage: `.otf` and `.ttf` for desktop installation, `.woff2` for web font usage.
- The latest release currently published is `v2.0.1` on `2024-02-07`, with a single downloadable archive `smiley-sans-v2.0.1.zip`.
- Listing the official release archive shows exactly four files:
  - `SmileySans-Oblique.otf` (`2,003,884` bytes)
  - `SmileySans-Oblique.ttf` (`2,629,764` bytes)
  - `SmileySans-Oblique.otf.woff2` (`1,361,268` bytes)
  - `SmileySans-Oblique.ttf.woff2` (`1,150,924` bytes)
- The checked-in PowerUp file `site/src/app/fonts/SmileySans-Oblique.ttf.woff2` matches the official release asset byte-for-byte by SHA-256 (`731f...99e2`), so the repo is currently vendoring the upstream webfont build rather than a project-specific derivative.

### License reality
- Upstream `LICENSE` is `SIL Open Font License 1.1`.
- The license declares reserved font names `Smiley` and `得意黑`.
- Practical planning implication: PowerUp can bundle the font with the software, but if Phase 5 introduces a subset or other modified font build, the license text must stay with the distributed font asset and any renamed derivative should avoid reserved-name misuse.

### Direct feasibility answer
- **Can the current `.woff2` be used directly for `ImageResponse`?** No.
- **Why not?** Two separate blockers exist:
  - Format blocker: Next.js `ImageResponse` supports `ttf`, `otf`, and `woff`, not `woff2`.
  - Size blocker: the current vendored `woff2` is `1.1MB`, above the documented `500KB` image bundle limit.
- **What is the minimal viable replacement format?** A dedicated image-route font in supported `ttf` or `otf` format. `woff` is technically supported by Next, but upstream Smiley Sans does not ship a plain `.woff`, and Next docs prefer `ttf`/`otf` anyway.
- **Can the full upstream `.ttf` / `.otf` be dropped in as-is?** Not safely. The official `ttf` (`2.6MB`) and `otf` (`2.0MB`) are also above the documented `500KB` budget, so the usable artifact for Phase 5 should be a share-specific subsetted `ttf` or `otf`, not the full desktop font file.

## 5. Recommended Architecture

### Recommendation
Use a **hybrid design**:
- **Server:** resolve share payload + generate PNG through a dedicated Route Handler.
- **Client:** mount a small share-actions island on the detail page that triggers `下载 PNG` and `复制分享文案`.
- **Fabric.js 6.x:** keep out of the main execution path for now. If revisit is needed, treat browser-side Fabric as an optional spike or fallback path, not as the primary renderer.

### Why this wins for current repo state
1. It matches the current detail page’s server-first rendering model.
2. It keeps internal source-resolution logic on the server where `source_url/source_kind` already live.
3. It avoids importing heavy client rendering stacks or building a faux backend.
4. It fits the existing read-only API posture: adding a read-only binary route is low-risk.
5. It leaves a clean path for future `opengraph-image.tsx` reuse without forcing it into the v1 download workflow.
6. It avoids introducing `node-canvas`/`jsdom` or browser-binary infrastructure into a repo that currently ships neither.

## 6. Concrete Planning Implications

### 6.1 Best source link rule
Recommended rule for PowerUp v1:
1. `doc_url`
2. `source_url`
3. `github_url`
4. Current detail page URL

Reasoning:
- `doc_url` is already the primary user-facing “official docs” action in the current detail hero.
- `source_url` is internal but often more canonical/specific than the repository root and stays available server-side.
- `github_url` remains the safest public fallback when docs/source pages are missing.
- Current detail page URL keeps the copy action usable even when all external links are absent.

### 6.2 Route shape
Recommended new route:
- `site/src/app/api/v1/skills/[slug]/share-image/route.ts`

Why:
- Keeps the share image next to the existing published detail API.
- Avoids conflicting with `page.tsx` at the same route segment.
- Remains clearly read-only and item-scoped.

### 6.3 UI placement
Recommended placement:
- Hero/header area in or immediately below `SkillDetailHeader`’s existing CTA region.

Why:
- Highest discoverability.
- Existing CSS already supports flex-wrap and mobile stacking.
- No new page region or modal shell required.

### 6.4 Preview / download / copy-image decision
- **Direct download PNG:** yes, primary v1 image action
- **New window preview:** supported by the same server image URL, but optional in the visible v1 UI
- **Copy image:** explicitly out of v1 must-haves; revisit later behind capability detection

### 6.5 Font recommendation for the share poster
- Continue using **Smiley Sans** for the share poster only if it is managed as a dedicated image-generation asset rather than reusing the page's `next/font/local` setup.
- Keep the current page font file in `site/src/app/fonts/SmileySans-Oblique.ttf.woff2` unchanged for browser UI rendering.
- Add a separate share-image font asset under `site/src/lib/share/assets/fonts/`, for example:
  - `site/src/lib/share/assets/fonts/SmileySans-Oblique-share.otf`
  - `site/src/lib/share/assets/fonts/LICENSE.txt`
- The share-image font asset should be a subsetted build derived from the official upstream `otf` or `ttf`, sized to fit the `ImageResponse` budget while still covering the glyphs needed for current published `name`, `summary`, `category`, `type`, and fixed UI strings.
- If the project later adds entries whose glyphs are not in the subset, the subset asset must be regenerated as part of content maintenance; this is a planning concern, not an implementation footnote.

### 6.6 If Fabric.js 6.x remains in scope later
- Add a separate browser-only spike to verify Fabric export against one real detail slug using the current `SmileySans-Oblique.ttf.woff2`, including explicit font readiness before render.
- Audit current icon inputs and decide whether Fabric export can allow remote `http` icons, must proxy them, or should intentionally fall back to emoji/local-only poster assets to avoid tainted-canvas failures.
- Add a bundle/performance measurement task that lazy-loads Fabric and records added JS size plus export latency on desktop and mobile.
- Keep any `fabric/node` investigation out of the main plan until deployment proof exists for `node-canvas`/`jsdom`/native dependencies on the actual target host.

## 7. Risks To Carry Into Planning

- Current `gsd-tools phase add` produced an empty slug for the Chinese phase name; the phase directory was corrected manually to `05-detail-page-share` so downstream tooling can resolve it.
- Current repo has no image-generation font asset in a documented `ttf`/`otf`/`woff` format, so execution must budget time for image-specific font resources.
- The official full-size Smiley Sans `ttf`/`otf` releases are too large to assume safe for `ImageResponse`; Phase 5 must treat font subsetting and asset-budget verification as explicit work items.
- Current seed data does not naturally exercise missing-link fallback paths; tests will need targeted fixtures or injected unpublished/missing-link records to verify degradation.
- If future requirements demand a screenshot-like image matching the live page pixel-for-pixel, `ImageResponse` may become constraining and should be re-evaluated then, not preemptively now.
- If future work reopens browser-side Fabric export, client bundle growth and tainted-canvas failures for remote icons are the first risks to validate before any implementation plan is approved.
