# PowerUp Root Agent Guide

This repository is a solo, local-use brownfield GSD project.

## Scope

- Repo root is orchestration root, not app root.
- Real app root is `site/`.
- `.planning/` is the GSD control layer.
- `docs/` records current implementation and drift notes.
- `specs-v1/` is contract/history, not the default source of runtime truth.

## Read Order

When working from repo root, read in this order:

1. `AGENTS.md`
2. `.planning/PROJECT.md`
3. `.planning/ROADMAP.md`
4. relevant `docs/*.md`
5. `site/AGENTS.md` before editing anything under `site/`

Prefer current code and `docs/` over stale walkthrough material.

## Hard Rules

- Do not treat repo root as a Next.js app.
- Do not run app commands from repo root.
- Do not run `/gsd-new-project`.
- Do not run `/gsd-new-milestone`.
- Do not rebuild `.planning/codebase/**` unless explicitly asked.
- Do not change `specs-v1/**` unless explicitly asked.

## Current GSD Baseline

The minimum GSD structure already exists and should be preserved:

- `.planning/STATE.md`
- `.planning/config.json`
- `.planning/ROADMAP.md`
- `.planning/phases/01-automation-validation/`

Phase 1 slug is `automation-validation`.

Note: `.planning/PROJECT.md` contains older guard text saying not to create
`STATE.md` or `config.json`. That is stale for the current repo state.
Do not delete those files. They are now required for normal GSD flow.

## Closed Loop

Use GSD from repo root for orchestration, then use `site/` for code validation.

Default loop for most tasks:

1. Run `/gsd-next`.
2. If routed to discuss, use `/gsd-discuss-phase 1` or the phase you are on.
3. Create plans with `/gsd-plan-phase 1`.
4. Execute with `/gsd-execute-phase 1`.
5. Verify with `/gsd-verify-work 1` when execution completes.
6. Run `/gsd-next` again to move forward.

In the repo's current repaired state, `/gsd-next` should route to Phase 1
discussion/planning flow rather than fail on missing GSD structure.

## Where Commands Run

Run these from repo root:

- `/gsd-progress`
- `/gsd-resume-work`
- `/gsd-next`
- `/gsd-discuss-phase <n>`
- `/gsd-plan-phase <n>`
- `/gsd-execute-phase <n>`
- `/gsd-verify-work <n>`

Run app validation from `site/`:

- `npm run lint`
- `npm run test`
- `npm run test:smoke`
- `npm run typecheck`
- `npm run verify`
- `npm run build`

## Practical Routing

Use this decision rule:

- Need project state: `/gsd-progress` or `/gsd-resume-work`
- Need zero-friction continuation: `/gsd-next`
- Need new phase context before planning: `/gsd-discuss-phase <n>`
- Need executable plan files: `/gsd-plan-phase <n>`
- Need to carry out approved plans: `/gsd-execute-phase <n>`
- Need to confirm the phase outcome: `/gsd-verify-work <n>`

## Source of Truth

For implementation questions, prefer:

1. `site/src/app/**`
2. `site/src/lib/queries/**`
3. `site/src/lib/validation.ts`
4. `site/src/db/**`
5. `docs/**`

Treat `site/README.md` and `specs-v1/walkthroughV2.md` as historical hints only.
