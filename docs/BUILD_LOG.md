# 3D Cube Learn — Build Log

This is the shared status and learning record. It should describe what actually exists, not what the team hopes exists.

## Current snapshot

**Date:** 2026-09-29

**Active milestone:** M0 — Functional 3D lab

**Application status:** Not scaffolded

**Current observable demo:** None yet

## Completed

- Defined the product vision and requirements in `docs/PRD.md`.
- Separated the technical proof, interactive demo, full-stack product, replay, and learning phases.
- Defined the milestone roadmap and mapped it to PRD functional requirements.
- Defined the proposed client/server and rendering architecture.
- Added repository instructions that require scoped work, verification, documentation, and learning handoffs.
- Chose a function-first build order; marketing design and backend features are deferred.

## Next action

Implement M0 exactly as specified in `docs/BUILD_PLAN.md`:

- Scaffold the TypeScript web application.
- Render a recognizable 3×3 cube in a full-window development stage.
- Add orbit controls.
- Add verification scripts and run them.
- Document the important files and teach the scene fundamentals.

## Current run instructions

There is no application to run yet. This section must be replaced with exact install, development, test, and build commands during M0.

## Current verification

- Documentation files exist and cross-reference the PRD.
- Markdown whitespace and links should be checked before this documentation milestone is closed.
- No application tests are available because application code has not been created.

## Known risks and unknowns

- MediaPipe performance has not been measured on a baseline laptop.
- Mapping webcam landmarks into a convincing cube pose has not been proven.
- The exact gesture for distinguishing whole-cube rotation from a face turn is unresolved.
- The final choice of hand visualization is unresolved.
- Backend providers are proposed but not configured.

## Learning note

The project is intentionally not starting with a landing page. The first page will be a utilitarian lab so every session produces visible progress toward the risky interaction. Visual design remains valuable and will become its own deliberate pass after the interaction demo works.

## Session entry template

Copy this section for future implementation sessions:

```markdown
### YYYY-MM-DD — Milestone ID and title

**Goal:**

**Changed:**

- ...

**Important files:**

- `path` — responsibility

**Verification:**

- `command` — result
- Manual journey — result

**Decisions:**

- ...

**Surprises or discoveries:**

- ...

**Known limitations:**

- ...

**What I learned:**

- ...

**Next action:**

- ...
```
