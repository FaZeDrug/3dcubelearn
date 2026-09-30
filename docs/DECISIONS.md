# 3D Cube Learn — Decision Log

This file records choices that would otherwise be repeatedly reconsidered. A decision may be superseded, but it should not be silently erased.

## Decision format

Each record includes status, context, decision, rationale, consequences, and date. Status values are:

- **Accepted:** Use this choice until a later record supersedes it.
- **Provisional:** Use for the current milestone, but validate before depending on it broadly.
- **Superseded:** Replaced by a newer decision that links back to it.

## D-001 — Build the risky interaction before product expansion

**Status:** Accepted

**Decision:** Build the sequence `3D cube → camera → hands → cube placement → one face turn` before authentication, databases, leaderboards, replay production, learning content, or a marketing landing page.

**Rationale:** Hand-to-cube interaction is the product's novel and technically uncertain part. Backend and presentation work would not prove that the central experience is viable.

**Consequences:** Early screens will be utilitarian. The repository can still use a full-stack-capable framework, but server features remain dormant until the interaction demo works.

**Date:** 2026-09-29

## D-002 — Distinguish milestones from functional requirements

**Status:** Accepted

**Decision:** Treat PRD functional requirements as traceable product behaviors and milestones as ordered, independently verifiable delivery slices.

**Rationale:** Building FRs in document order would mix camera, rendering, backend, and replay work. Milestones provide a finish line small enough to complete and understand.

**Consequences:** `docs/BUILD_PLAN.md` must maintain the mapping between milestones and FRs.

**Date:** 2026-09-29

## D-003 — Use a modular Next.js TypeScript application

**Status:** Provisional

**Decision:** Start with one Next.js TypeScript repository that can later contain UI and server endpoints rather than separate frontend and backend services.

**Rationale:** A modular monolith is easier for a first full-stack project to run, deploy, inspect, and debug. It preserves the option to add real server authority without operating multiple applications.

**Consequences:** Browser-only libraries must be isolated to client components. Backend provider configuration is deferred until its milestone.

**Validation:** M0 must confirm that the selected application and 3D stack build cleanly together.

**Date:** 2026-09-29

## D-004 — Use Three.js through React Three Fiber

**Status:** Provisional

**Decision:** Use Three.js as the 3D engine and React Three Fiber as its React renderer.

**Rationale:** Three.js provides the required scene, camera, geometry, material, lighting, model-loading, and animation capabilities. React Three Fiber integrates those primitives with React and manages the canvas/render loop while preserving access to Three.js objects.

**Consequences:** The team must still learn core Three.js concepts. High-frequency tracking updates must not flow through ordinary React state on every frame.

**Validation:** M0 must demonstrate a responsive scene, correct cleanup, successful production build, and understandable component ownership.

**Date:** 2026-09-29

## D-005 — Keep cube state independent of rendering

**Status:** Accepted

**Decision:** Implement cube rules and legal moves in pure TypeScript without React or Three.js dependencies.

**Rationale:** The same deterministic state engine must support the live scene, automated tests, server validation, and replay reconstruction.

**Consequences:** Three.js animations display transitions but never decide the authoritative cube state.

**Date:** 2026-09-29

## D-006 — Process camera data locally

**Status:** Accepted

**Decision:** Keep webcam frames and raw hand landmarks in the browser. Do not upload or persist them by default.

**Rationale:** Local processing improves responsiveness and minimizes privacy risk. Ranked validation requires semantic moves and timing metadata, not a recording of the user.

**Consequences:** The backend cannot re-run vision inference. It validates cube events rather than physical motion.

**Date:** 2026-09-29

## D-007 — Reconstruct replay from semantic events

**Status:** Accepted

**Decision:** Store versioned cube moves, active-hand choices, timing, rotations, and coarse tracking events. Reconstruct the spectator replay from those events rather than video or exact motion capture.

**Rationale:** Semantic events are compact, deterministic, portable, and sufficient to reproduce cube state and pacing without storing the user's appearance.

**Consequences:** The first avatar replay represents the user's move sequence and pace, not exact biomechanics.

**Date:** 2026-09-29
