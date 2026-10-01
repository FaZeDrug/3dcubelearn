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

**Status:** Accepted

**Decision:** Start with one Next.js TypeScript repository that can later contain UI and server endpoints rather than separate frontend and backend services.

**Rationale:** A modular monolith is easier for a first full-stack project to run, deploy, inspect, and debug. It preserves the option to add real server authority without operating multiple applications.

**Consequences:** Browser-only libraries must be isolated to client components. Backend provider configuration is deferred until its milestone.

**Validation:** M0 confirmed a clean locked install, development server, passing lint and type checks, a focused unit test, a successful production build, and a working browser-rendered 3D stage.

**Date:** 2026-09-29

## D-004 — Use Three.js through React Three Fiber

**Status:** Accepted

**Decision:** Use Three.js as the 3D engine and React Three Fiber as its React renderer. Use `OrbitControls` from `@react-three/drei` for M0 inspection controls instead of implementing custom camera input.

**Rationale:** Three.js provides the required scene, camera, geometry, material, lighting, model-loading, and animation capabilities. React Three Fiber integrates those primitives with React and manages the canvas/render loop while preserving access to Three.js objects.

**Consequences:** The team must still learn core Three.js concepts. High-frequency tracking updates must not flow through ordinary React state on every frame.

**Validation:** M0 demonstrated a responsive scene, successful production build, clear canvas/rendering ownership, and working orbit, zoom, and resize behavior in Chrome.

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

## D-008 — Use Vitest for pure TypeScript tests

**Status:** Accepted

**Decision:** Use Vitest for deterministic tests of framework-independent TypeScript modules, beginning with cubie-position generation.

**Rationale:** Vitest provides a small, fast test path for logic that should not require React, Three.js, a browser, or a running Next.js server.

**Consequences:** Rendering behavior still requires an explicit browser smoke test. As the cube engine grows, its legal moves and state transitions should remain testable through the same non-visual test boundary.

**Date:** 2026-09-30

## D-009 — Make camera capture explicit, local, and disposable

**Status:** Accepted

**Decision:** Request webcam access only after the user selects **Start camera**, request video with audio disabled, prefer a 1920×1080, 16:9, 30-fps user-facing stream through non-mandatory constraints, attach the resulting stream directly to a mirrored video element, and stop every track on user request, stale-request cleanup, or component unmount. Model the human-visible lifecycle as idle, requesting, active, denied, unavailable, and error states.

**Rationale:** Browser permission is a user-controlled privacy boundary. A small camera service keeps browser-specific behavior testable, while a React hook makes the lifecycle visible without putting high-frequency video frames into React state.

**Consequences:** The M0 cube remains visible while the camera is inactive and the live preview replaces it while active. Webcam frames remain local and are neither uploaded nor recorded. Future hand tracking must reuse this lifecycle rather than opening a second stream.

**Validation:** M1 verified that permission is not requested on load, Chrome receives a camera-only request, a mirrored preview becomes playback-ready, both explicit stop and component unmount clear Chrome's recording indicator, and automated tests cover all-track cleanup and browser-error mapping. A quality follow-up replaced Chrome's 640×480 default with ideal HD constraints and measured a negotiated 1920×1080 stream on the baseline MacBook camera.

**Date:** 2026-09-30
