# 3D Cube Learn — Repository Instructions

This file defines how coding agents should work in this repository. The project owner is learning while building, so correctness, small scope, verification, and clear explanations are equally important.

## Mission

Build 3D Cube Learn into a working, understandable product without allowing the long-term vision to overwhelm the next demonstrable milestone.

The immediate priority is the risky interaction loop:

`render cube → show webcam → track hands → place cube between hands → complete one deliberate layer turn`

Marketing pages, authentication, databases, leaderboards, replays, and visual polish must not interrupt that sequence unless the active milestone explicitly includes them.

## Required reading order

Before changing code or project configuration, read:

1. `README.md`
2. `docs/PRD.md`
3. `docs/BUILD_PLAN.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DECISIONS.md`
6. `docs/BUILD_LOG.md`

## Sources of truth

- `docs/PRD.md` defines what the product should eventually do.
- `docs/BUILD_PLAN.md` defines build order, the active milestone, acceptance criteria, and what is intentionally deferred.
- `docs/DECISIONS.md` records accepted architectural and product-delivery choices.
- `docs/ARCHITECTURE.md` describes the current technical shape, not an aspirational rewrite.
- `docs/BUILD_LOG.md` records actual status, verification evidence, discoveries, and the next action.

If these documents conflict, stop and resolve the conflict in the documents before expanding implementation scope.

## Milestone discipline

- Work on only one active milestone at a time.
- Do not begin a later milestone because it is convenient or exciting.
- New ideas belong in the parking lot in `docs/BUILD_PLAN.md`.
- Keep changes small enough to explain and verify in one development loop.
- A milestone is complete only when every acceptance criterion passes.
- Fix failed validation before starting new feature work.
- Do not quietly redefine “done.” Record changes to scope or acceptance criteria.

Functional requirements and milestones are different. FRs define product behavior; milestones group FRs into an ordered, testable delivery sequence. Maintain the traceability mapping in `docs/BUILD_PLAN.md` when requirements or build order change.

## Implementation rules

- Prefer the simplest implementation that proves the current milestone.
- Do not add a dependency without recording why it is needed in `docs/DECISIONS.md`.
- Keep cube rules and state transitions in pure TypeScript, independent of React and Three.js.
- Keep camera capture and hand inference in the browser.
- Do not upload or persist webcam frames or raw hand landmarks.
- Keep high-frequency tracking data out of React component state when it would cause frame-by-frame UI rerenders.
- Treat Three.js and rendering as a presentation layer; rendering must not become the authoritative cube state.
- Preserve user-authored changes and unrelated work already present in the repository.
- Avoid speculative abstraction. Extract a reusable boundary when the current milestone demonstrates the need.
- Prefer accessible, utilitarian controls before visual polish.

## Verification rules

Once the application exists, every implementation milestone should run the repository's equivalent of:

- lint
- type checking
- unit tests
- production build
- a focused manual smoke test for the milestone's user journey

Add browser automation when a journey becomes stable enough to test reliably. Record commands, results, and any unverified behavior in `docs/BUILD_LOG.md`.

Compilation alone is not proof that a visual or interaction feature works. Capture the observable success condition in the build plan and verify it in a real browser.

## Documentation rules

At the end of each meaningful implementation session:

- Update current status and evidence in `docs/BUILD_LOG.md`.
- Update `docs/ARCHITECTURE.md` if system boundaries or data flow changed.
- Add or supersede a record in `docs/DECISIONS.md` for significant choices.
- Update requirement-to-milestone mapping if scope changed.
- Keep run and demo instructions accurate.

## Learning handoff

Every completed milestone must be handed back with:

1. What changed in plain language
2. Why the implementation was chosen
3. The important files and what each owns
4. A trace of the main data flow
5. Exact run and verification commands
6. Known limitations and the next milestone
7. One small, safe exercise the project owner can make personally

Avoid unexplained jargon. When jargon is necessary, define it where it first appears.
