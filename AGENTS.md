# PowerUp Root Agent Guide

This repository is a solo, local-use brownfield GSD project.

## Scope

- Repo root is orchestration root, not app root.
- `README.md` is the repo entry document.
- Real app root is `site/`.
- `docs/` records current implementation, boundaries, and drift notes.
- `specs-v1/` keeps PRD and contract docs.
- `specs-v1/_history/` keeps historical walkthroughs.
- `.planning/` is the GSD execution layer, not the current implementation source.

## Read Order

When working from repo root, read in this order:

1. `AGENTS.md`
2. `README.md`
3. `docs/README.md`
4. `docs/CURRENT-STATE.md`
5. `docs/ARCHITECTURE.md`
6. `docs/ROUTING-RENDER-SEARCH.md`
7. `docs/DATA-AND-CONTENT.md`
8. `docs/DEVELOPMENT.md`
9. `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`
10. `.planning/PROJECT.md`
11. `.planning/ROADMAP.md`
12. `specs-v1/README.md`
13. `specs-v1/PRD.md`
14. `specs-v1/terms-and-directory-contract.md`
15. `specs-v1/routing-render-search-contract.md`

Before editing anything under `site/`, also read `site/AGENTS.md`.

Prefer current code and `docs/` over `_history/` walkthrough material.

## Hard Rules

- Do not treat repo root as a Next.js app.
- Do not run app commands from repo root.
- Do not run `/gsd-new-project`.
- Do not run `/gsd-new-milestone`.
- Do not rebuild `.planning/codebase/**` unless explicitly asked.
- Do not promote `_history/**` back into the default current-state entry path.
- Do not rewrite `specs-v1/**` unless the task is explicitly about PRD, contract, or document governance.

## Current GSD Footing

The current repo only guarantees this lightweight execution layer:

- `.planning/STATE.md`
- `.planning/config.json`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`

Do not delete `.planning/STATE.md` or `.planning/config.json`. They are required for normal GSD flow.
Do not assume `.planning/phases/**`, plan artifacts, or research folders already exist.

## GSD Routing

Use GSD from repo root for orchestration, then use `site/` for code validation.

Default routing:

1. Start with `/gsd-do` or `/gsd-progress` to route the task against the current repo state.
2. If the task truly needs a phase, then use `/gsd-discuss-phase <n>`, `/gsd-plan-phase <n>`, `/gsd-execute-phase <n>`, and `/gsd-verify-work <n>`.
3. Keep `.planning/**` forward-only; do not backfill fake historical phases just to satisfy tooling.

## Where Commands Run

Run these from repo root:

- `/gsd-do`
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

- Need freeform routing to the right GSD workflow: `/gsd-do`
- Need project state: `/gsd-progress` or `/gsd-resume-work`
- Need zero-friction continuation: `/gsd-next`
- Need new phase context before planning: `/gsd-discuss-phase <n>`
- Need executable plan files: `/gsd-plan-phase <n>`
- Need to carry out approved plans: `/gsd-execute-phase <n>`
- Need to confirm the phase outcome: `/gsd-verify-work <n>`

## Source of Truth

For implementation questions, prefer:

1. `site/src/app/**`
2. `site/src/lib/**`
3. `site/src/db/**`
4. `site/src/types/**`
5. `docs/**`
6. `specs-v1/terms-and-directory-contract.md`
7. `specs-v1/routing-render-search-contract.md`
8. `specs-v1/PRD.md`

Treat `site/README.md` as a runtime manual and `specs-v1/_history/**` as historical hints only.
