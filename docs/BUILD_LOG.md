# 3D Cube Learn — Build Log

This is the shared status and learning record. It should describe what actually exists, not what the team hopes exists.

## Current snapshot

**Date:** 2026-09-30

**Active milestone:** M1 — Camera lifecycle

**Application status:** M0 complete; M1 not started

**Current observable demo:** The root route displays a full-window solved 3×3 cube. The user can drag to orbit and scroll to zoom.

## Completed

- Defined the product vision and requirements in `docs/PRD.md`.
- Separated the technical proof, interactive demo, full-stack product, replay, and learning phases.
- Defined the milestone roadmap and mapped it to PRD functional requirements.
- Defined the proposed client/server and rendering architecture.
- Added repository instructions that require scoped work, verification, documentation, and learning handoffs.
- Chose a function-first build order; marketing design and backend features are deferred.
- Scaffolded a Next.js App Router application with React and TypeScript.
- Added a React Three Fiber stage with a camera, lighting, constrained zoom, and orbit controls.
- Rendered a recognizable solved cube from 27 cubie meshes and six face colors.
- Kept cubie-position generation in a pure TypeScript module.
- Added a focused Vitest test proving that all 27 positions are unique.
- Verified the scene in a real Chrome window and completed every M0 acceptance criterion.
- Validated the provisional Next.js and Three.js stack decisions.

## Next action

Begin M1 exactly as specified in `docs/BUILD_PLAN.md`:

- Explain camera use before requesting permission.
- Add a video-only start-camera flow and mirrored preview.
- Show explicit idle, requesting, active, denied, unavailable, and error states.
- Stop every stream track on user request and component cleanup.
- Do not add hand tracking yet.

## Current run instructions

Use Node.js 24 LTS, then run:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Run the validation gates with:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Current verification

- `npm ci` — completed a clean install from `package-lock.json`.
- `npm ls --depth=0` — passed; the expected top-level dependency tree is present.
- `npm run dev` — passed; Next.js served the root route locally.
- `npm run lint` — passed with no lint errors.
- `npm run typecheck` — passed with no TypeScript errors.
- `npm test` — passed: one test file and one test.
- `npm run build` — passed; `/` and `/_not-found` were statically generated.
- Chrome desktop smoke test — passed in an extension-free Incognito window:
  - The root route rendered a nonblank, recognizable 3×3 cube.
  - Dragging changed the camera orbit and exposed different cube faces.
  - Scrolling changed camera distance.
  - Resizing from a maximized window to an approximately 1900×1200 window preserved the stage, HUD, cube geometry, and interaction.
  - Chrome DevTools showed no application console errors.
- The ordinary Chrome profile produced a React hydration error caused by a browser extension injecting `data-extension-*` attributes into `<html>`. The error disappeared without that extension and is not an application defect.
- The development console reported upstream deprecation warnings for `THREE.Clock` and `PCFSoftShadowMap`; neither prevented rendering, interaction, type checking, testing, or production build.
- Screenshot baselines, canvas metrics, performance profiling, and mobile QA were not run because they are outside M0.

## Known risks and unknowns

- MediaPipe performance has not been measured on a baseline laptop.
- Mapping webcam landmarks into a convincing cube pose has not been proven.
- The exact gesture for distinguishing whole-cube rotation from a face turn is unresolved.
- The final choice of hand visualization is unresolved.
- Backend providers are proposed but not configured.
- The current cube is a visual solved model; it has no authoritative move state or face-turn mechanics yet.
- The M0 stage has no camera or hand tracking; those begin in M1 and M2.
- Current Three.js dependencies emit two non-blocking development deprecation warnings described above.

## M0 learning handoff

### What changed

The repository now contains a working browser application rather than only product documents. Opening the root route creates a Three.js scene and immediately renders an inspectable solved cube.

### Why this implementation

The smallest useful M0 needed to prove the web and 3D stack without mixing in camera, tracking, gestures, backend work, or marketing design. Generating the 27 cubie positions in pure TypeScript also establishes the project rule that logical data should not belong to the renderer.

### Important files

- `app/layout.tsx` — owns document metadata and the shared HTML/body shell.
- `app/page.tsx` — owns the root route and mounts the current experience.
- `app/globals.css` — owns the full-window stage and minimal HUD layout.
- `components/cube-stage.tsx` — owns the client-side canvas, camera, lights, and orbit controls.
- `components/rubiks-cube.tsx` — converts cubie positions and face colors into Three.js meshes and materials.
- `lib/cube/cubie-positions.ts` — generates the 27 logical coordinates without React or Three.js.
- `lib/cube/cubie-positions.test.ts` — verifies that the coordinate set is complete and unique.

### Main data flow

`app/page.tsx` mounts `CubeStage` → `CubeStage` creates the React Three Fiber canvas → `RubiksCube` reads the pure cubie positions → React Three Fiber creates Three.js groups, meshes, geometries, and materials → the canvas render loop draws the scene → `OrbitControls` changes the camera in response to pointer and wheel input.

### Known limitations and next milestone

M0 proves rendering and inspection only. The cube cannot turn its layers, there is no camera feed, and there is no hand tracking. M1 adds only the camera lifecycle; M2 adds hand landmarks afterward.

### Safe learning exercise

In `components/cube-stage.tsx`, change the camera field of view from `35` to `50`. Run the app, observe how the cube's perspective changes, then restore it to `35`. This changes presentation only and cannot corrupt cube logic.

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
