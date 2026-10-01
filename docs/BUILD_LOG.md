# 3D Cube Learn — Build Log

This is the shared status and learning record. It should describe what actually exists, not what the team hopes exists.

## Current snapshot

**Date:** 2026-09-30

**Active milestone:** M4 — One deliberate turn

**Application status:** M0, M1, M2, and M3 complete; M4 planned but not started

**Current observable demo:** The root route displays the inspectable M0 cube and waits for an explicit camera start. Once active, it loads MediaPipe locally in the browser, draws mirrored landmarks over up to two hands, and places the solved cube between two valid palm centers. The cube follows their midpoint, scales with their separation, smooths small noise, briefly holds its last stable pose on tracking loss, and then hides safely. Gesture recognition and layer turns do not exist yet.

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
- Added an explicit, video-only camera permission flow; the page never requests permission on load.
- Added idle, requesting, active, denied, unavailable, and error states with actionable copy.
- Added a mirrored live preview and a persistent camera-active indicator.
- Stopped every stream track on **Stop camera**, stale permission results, and component unmount.
- Kept webcam frames local and out of React state, persistence, and network requests.
- Added focused tests for video-only constraints, all-track cleanup, and browser-error mapping.
- Preserved the M0 cube stage whenever the camera is inactive.
- Verified the real camera start, playback, stop, and unmount journeys in Chrome and completed every M1 acceptance criterion.
- Added a pinned MediaPipe Hand Landmarker adapter that exposes application-owned landmarks, handedness, and confidence for up to two hands.
- Added loading, ready, unsupported, inference-error, zero-hand, one-hand, two-hand, and lost-tracking interface states.
- Added a maximum-30-Hz, one-inference-at-a-time browser frame loop with cancellation and MediaPipe task disposal.
- Added a mirrored canvas overlay whose pure coordinate mapper accounts for the preview's `object-fit: cover` crop.
- Kept per-frame landmarks out of React state; React updates only when tracking status or hand count changes.
- Added deterministic tests for MediaPipe-result translation, hand-count states, mirror/crop coordinate mapping, and lost-tracking copy.
- Passed the M2 automated gates and the project owner's physical-hand browser smoke test; every M2 acceptance criterion is complete.
- Added a pure M3 placement module that derives palm centers, mirrored midpoint, constrained size, and limited roll from two application-owned hands.
- Added dead zones and frame-rate-independent exponential smoothing for cube position, scale, and roll.
- Exposed the newest tracking observation through a mutable ref without placing frame-by-frame landmarks in React state.
- Added a transparent React Three Fiber canvas over the mirrored preview and reused the existing solved `RubiksCube` presentation.
- Added waiting, anchored, holding, and low-confidence placement phases plus a 350-ms safe hold before sustained loss hides the cube.
- Added deterministic M3 tests for transform derivation, scale limits, constrained orientation, smoothing, and tracking-loss recovery.
- Passed every automated M3 gate and the project owner's complete real-webcam placement checklist; every M3 acceptance criterion is complete.

## Next action

Begin M4 exactly as specified in `docs/BUILD_PLAN.md`: establish pure logical cube state first, then build the smallest explicit pinch-and-drag state machine and visual preview that can safely cancel or commit one exact 90-degree layer turn. Do not mix in timed mode, backend work, replay, 3D modeled hands, or marketing polish.

## Current run instructions

Use Node.js 24 LTS, then run:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The camera remains off until **Start camera** is selected. Grant camera permission, wait for the MediaPipe model to load, and raise two open hands with a visible gap. Test the tracked cube's midpoint, movement, scale, stillness, and loss recovery. Select **Stop camera** when finished.

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
- `npm test` — passed: five test files and 28 tests.
- `npm run build` — passed; `/` and `/_not-found` were statically generated.
- Next.js still warns that it ignored `/Users/natasha/package-lock.json` because that separate home-directory lockfile is outside this repository. The repository's own lockfile remains present, and the production build completes successfully.
- Chrome desktop smoke test — passed in an extension-free Incognito window:
  - The root route rendered a nonblank, recognizable 3×3 cube.
  - Dragging changed the camera orbit and exposed different cube faces.
  - Scrolling changed camera distance.
  - Resizing from a maximized window to an approximately 1900×1200 window preserved the stage, HUD, cube geometry, and interaction.
  - Chrome DevTools showed no application console errors.
- The ordinary Chrome profile produced a React hydration error caused by a browser extension injecting `data-extension-*` attributes into `<html>`. The error disappeared without that extension and is not an application defect.
- The development console reported upstream deprecation warnings for `THREE.Clock` and `PCFSoftShadowMap`; neither prevented rendering, interaction, type checking, testing, or production build.
- Screenshot baselines, canvas metrics, performance profiling, and mobile QA were not run because they are outside M0.
- M1 Chrome camera smoke test — passed:
  - Loading the route did not show a browser permission prompt.
  - The purpose, local-only handling, no-recording statement, and no-microphone statement remained visible before **Start camera**, including at a common laptop viewport.
  - Selecting **Start camera** changed the UI to requesting and opened a camera-only Chrome permission prompt.
  - Granting one-time permission changed the UI to active and rendered a live video with `readyState` 4 and 640×480 intrinsic dimensions.
  - The video used the computed mirror transform `matrix(-1, 0, 0, 1, 0, 0)`.
  - Selecting **Stop camera** returned the app to idle, removed the video element, and cleared Chrome's recording indicator.
  - Starting again and navigating away cleared Chrome's recording indicator, verifying unmount cleanup in a real browser.
- Denied, missing-device, busy-device, and unknown error mapping passed automated tests. Only the granted path was exercised against physical camera hardware; the machine did not provide a safe way to simulate missing hardware.
- Chrome extensions injected attributes into the document and reproduced the already-known development-only hydration warning. The mismatch identifies the extension-owned attributes and is not caused by application state.
- The M0 upstream `THREE.Clock` and shadow-map deprecation warnings remain non-blocking and unchanged.
- M1 visual QA was performed at the available desktop laptop viewport. Mobile QA, performance profiling, and persistent screenshot baselines remain outside this milestone.
- Next.js added its version-specific agent-guidance block to `AGENTS.md` during `next dev`; it is retained so future development runs do not recreate an unexplained working-tree change.
- M1 camera-quality follow-up — passed:
  - The original `video: true` constraint was identified as the reason Chrome selected its 640×480 default mode.
  - The request now prefers 1920×1080, 16:9, 30 fps, and the user-facing camera while keeping every preference non-mandatory for hardware compatibility.
  - Chrome negotiated and played an actual 1920×1080 stream with `readyState` 4 on the baseline MacBook camera.
  - The computed mirror transform remained correct, **Stop camera** returned the app to idle, and the preview element was removed.
  - Four stale duplicate files inside the ignored `.next/types` build cache were removed after they caused duplicate TypeScript declarations; they were generated artifacts, not application source.
- M2 automated verification — passed:
  - `@mediapipe/tasks-vision@1.0.1` is installed as the documented top-level dependency.
  - Pure tests verify MediaPipe-result translation, a two-hand cap, confidence handling, mirrored coordinates, `object-fit: cover` cropping, hand-count clamping, lost tracking, and loading/failure status copy.
  - Lint and type checking pass with the tracking hook, canvas overlay, and dynamically loaded browser dependency.
  - The production build statically generated `/` and `/_not-found` successfully.
  - No project-local Mint or other production assets were added; the version-pinned MediaPipe WASM runtime and model are deliberate runtime downloads.
- M2 real-webcam smoke test — passed by the project owner on the baseline MacBook. The owner reported that the experience was responsive and successfully detected zero, one, and two hands with the landmark overlay. This supplies the physical-hand evidence required to close M2. Mobile QA remains outside the milestone.
- M3 automated verification — passed:
  - `npm run lint` — passed with no lint errors.
  - `npm run typecheck` — passed with no TypeScript errors after correcting the overlay viewport type.
  - `npm test` — passed: five test files and 28 tests.
  - `npm run build` — passed; `/` and `/_not-found` were statically generated.
  - `git diff --check` — passed with no whitespace errors.
  - Browser, performance, and mobile QA were not run by the coding agent. The project owner performed the required real-hand test, and mobile remains outside M3.
- M3 real-webcam smoke test — passed by the project owner on the baseline MacBook:
  - The owner completed the provided zero-hand, one-hand, two-hand, midpoint movement, scale, stillness, brief-loss, sustained-loss, reacquisition, and stop checklist and reported that the cube looked good and the behaviors were fine.
  - Half-screen testing exposed an oversized active panel rather than a placement defect. The active panel was compacted, while the full privacy explanation remains available before permission.
  - The owner correctly observed that M3 uses a real 3D model but intentionally does not interpret wrist rotation, rotate the scene camera, or turn cube layers.

## Known risks and unknowns

- The exact gesture for distinguishing whole-cube rotation from a face turn is unresolved.
- The final choice of hand visualization is unresolved.
- Backend providers are proposed but not configured.
- The current cube is a visual solved model; it has no authoritative move state or face-turn mechanics yet.
- The M2 main-thread inference loop follows MediaPipe's synchronous web API; move it to a worker only if future measurement shows a real responsiveness problem.
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

## M1 learning handoff

### What changed

The root experience now keeps the 3D cube available while the camera is off, explains the camera's purpose and privacy behavior, and waits for the user to start it. A granted request replaces the cube with a mirrored live preview. The same interface communicates requesting and failure states and provides a real stop action.

### Why this implementation

M1 needed to prove the browser camera boundary without mixing in hand tracking. Browser-specific work lives in a small service, lifecycle state lives in one hook, and rendering the stream lives in one video component. This keeps permission, cleanup, UI, and future tracking responsibilities separate without adding a new dependency.

The stream object is stored only when the camera starts or stops so React can mount the preview. The frames inside that stream flow directly from the browser into the video element; they are not copied into React state, uploaded, recorded, or saved.

### Important files

- `app/page.tsx` — mounts the combined camera experience at the root route.
- `components/camera-experience.tsx` — owns the human-visible copy, controls, status display, and cube/preview switch.
- `components/camera-preview.tsx` — attaches the live stream to the video element and presents it mirrored.
- `features/camera/use-camera.ts` — owns lifecycle state, request-race protection, stop behavior, and unmount cleanup.
- `features/camera/camera-service.ts` — owns video-only constraints, browser API access, all-track cleanup, and error translation.
- `features/camera/camera-service.test.ts` — verifies the camera request, cleanup rule, and failure categories without opening a real webcam.
- `components/cube-stage.tsx` — preserves the M0 stage and allows the M1 shell to replace its old milestone HUD.
- `app/globals.css` — lays out the stage, mirrored preview, status panel, active indicator, and accessible focus state.

### Main data flow

The user selects **Start camera** → `CameraExperience` calls `useCamera` → the hook enters `requesting` → `camera-service.ts` calls `navigator.mediaDevices.getUserMedia` with audio disabled and non-mandatory HD video preferences → the granted `MediaStream` is stored as the active lifecycle handle → `CameraPreview` assigns it to `video.srcObject` → the browser plays and mirrors the local preview.

When the user selects **Stop camera**, the component unmounts, or an obsolete request resolves, `stopCameraStream` calls `stop()` on every track. An explicit stop also returns the visible state to `idle` and restores the cube stage.

### Exact verification commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For the manual journey, run `npm run dev`, open `http://localhost:3000`, confirm there is no automatic permission prompt, read the explanation, start the camera, grant permission, confirm the mirrored preview and active indicator, then stop the camera and confirm the cube returns.

### Known limitations and next milestone

M1 does not inspect the video. It cannot see hands, draw landmarks, position the cube over the preview, or interpret gestures. Browser and operating-system permission settings can also prevent a retry until the user changes them. M2 adds only browser-side hand landmarks and zero/one/two-hand status; cube placement remains M3.

### Safe learning exercise

In `components/camera-experience.tsx`, change the idle `detail` text from “The 3D lab remains available…” to your own sentence. Run the app and observe where that state-driven text appears, then restore it. This changes copy only and cannot start the camera or alter stream cleanup.

### 2026-09-30 — M1 camera quality follow-up

**Goal:** Make the browser preview use the camera's HD mode instead of enlarging Chrome's low-resolution default.

**Changed:** Replaced the unconstrained `video: true` request with ideal 1080p, 16:9, 30-fps, user-facing preferences. The constraints are deliberately ideal rather than exact, so unsupported cameras fall back instead of failing.

**Verification:** Lint, type checking, focused tests, and production build passed. Chrome reported a playback-ready 1920×1080 video, up from the original 640×480 stream, and camera cleanup still passed.

**Known limitation:** Image quality still depends on the physical webcam, lighting, focus, and browser processing. The application can request the best mode but cannot manufacture detail the camera does not capture.

### 2026-09-30 — M1 camera framing follow-up

**Goal:** Show the camera as a contained preview on the stage instead of stretching it edge to edge.

**Changed:** Centered the live video in a responsive 16:9 frame capped at 64rem while preserving the plain stage background around it. Camera capture, mirroring, and stream quality were not changed.

**Verification:** Lint, type checking, all 12 tests, and the production build passed. In Chrome at a 1512×702 viewport, the live video rendered centered at approximately 948×533 with visible background on every side.

## M2 learning handoff

### What changed

Starting the camera now starts a second, separately owned lifecycle for hand tracking. The interface loads an on-device MediaPipe model, draws landmark skeletons over as many as two hands, reports zero, one, two, and lost-hand states, and offers a retry if loading or inference fails. Stopping the camera cancels the animation loop, clears the overlay, closes the MediaPipe task, and then stops the camera tracks through the existing M1 lifecycle.

### Why this implementation

M2 needs to prove perception without mixing in cube placement or gestures. MediaPipe is isolated behind an adapter so later code receives project-owned hand observations instead of third-party objects. Landmark frames are drawn directly to canvas because sending 30 observations per second through React state would cause unnecessary component rendering; React only receives slow-changing status and hand-count values.

The main-thread inference loop is intentionally the smallest implementation that can be measured. MediaPipe's web `detectForVideo()` call is synchronous, so each animation callback finishes before another inference can begin. The loop also caps attempts at 30 per second and drops duplicate video frames. A worker should be added only if the baseline smoke test shows a responsiveness problem.

### Important files

- `features/tracking/hand-tracker.ts` — dynamically loads MediaPipe, configures the two-hand model, translates results, and owns task disposal.
- `features/tracking/tracking-types.ts` — defines the internal landmark, handedness, confidence, frame, hand-count, and lifecycle contracts.
- `features/tracking/use-hand-tracking.ts` — owns model loading, the inference loop, hand-count transitions, retry, cancellation, and cleanup.
- `features/tracking/draw-hand-landmarks.ts` — draws landmark connections and points directly onto the overlay canvas.
- `features/tracking/tracking-utils.ts` — owns zero/one/two-hand copy and the mirror-plus-cover coordinate math.
- `features/tracking/*.test.ts` — verifies application-owned mapping, counts, statuses, and coordinate behavior without a webcam.
- `components/camera-preview.tsx` — keeps the video and transparent landmark canvas in one identically sized frame.
- `components/camera-experience.tsx` — connects the existing camera lifecycle to tracking status, recovery controls, and user-facing privacy text.
- `app/globals.css` — stacks the transparent canvas over the contained camera preview and styles tracking states.

### Main data flow

The user selects **Start camera** → M1 returns a live `MediaStream` → `CameraPreview` attaches it to the video → `useHandTracking` dynamically loads the MediaPipe task → each new video frame is passed to the adapter → the adapter returns at most two application-owned hand observations → landmarks are mirror-mapped and drawn to canvas → React updates only if the hand count or lifecycle state changes.

On **Stop camera** or unmount, the tracking effect cancels its pending animation frame, closes the MediaPipe task, and clears the canvas. The M1 camera hook then stops every media track.

### Exact run and verification commands

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

The automated gates pass with four test files and twenty tests. The project owner also confirmed successful zero-, one-, and two-hand detection with the landmark overlay on the baseline MacBook.

### Known limitations and next milestone

The loop currently runs MediaPipe synchronously on the main thread and has not received a formal performance profile or mobile test. M2 deliberately does not smooth landmarks for cube placement, place a cube, recognize pinches, or turn layers. M3 now derives a stable cube transform from the completed two-hand observations.

### Safe learning exercise

Open `features/tracking/tracking-utils.ts` and change the **1 hand detected** detail sentence to your own wording. Run the app, show one hand, confirm where the sentence appears, and then restore it. This changes presentation copy only; it cannot alter the camera, inference loop, or landmark math.

## M3 learning handoff

**Goal:** Place the existing solved cube stably between two tracked hands without adding gestures or cube moves.

**Changed:** Added pure palm-pair placement math, a mutable latest-frame bridge, a transparent Three.js overlay, time-based smoothing, scale and roll limits, placement-state copy, and safe tracking-loss behavior.

**Important files:**

- `features/cube-placement/cube-placement.ts` — pure palm centers, screen transform, limits, smoothing, and loss phases.
- `features/cube-placement/cube-placement.test.ts` — deterministic tests for M3 behavior without a camera or WebGL.
- `features/tracking/use-hand-tracking.ts` — still owns inference, and now exposes only its latest frame through a mutable ref.
- `components/cube-overlay.tsx` — reads that ref in the Three.js render loop and mutates the rendered cube group.
- `components/camera-preview.tsx` — stacks video, debug landmarks, and the transparent cube canvas in one frame.
- `components/camera-experience.tsx` — explains the M3 pose and reports waiting, anchored, holding, and low-confidence states.

**Verification:** Lint, type checking, 28 tests, production build, and whitespace validation pass. The project owner completed the real-webcam checklist on the baseline MacBook and reported that placement, movement, scale, stillness, tracking loss, reacquisition, and stop behavior looked correct.

**Decisions:** M3 uses five stable palm-base landmarks per hand, screen-space midpoint and distance, 16–44% preview-height scale limits, separate time-based smoothing constants, a 250-ms latest-frame age limit, and a 350-ms loss hold. The real-hand test accepted this first calibration.

**Known limitations:** There are no gestures, layer turns, whole-cube rotations, occlusion masking, 3D modeled hands, backend features, or mobile support. The cube may render over the hands, and the provisional calibration may need a small measured adjustment after the physical test.

**Main data flow:** MediaPipe writes an application-owned `TrackingFrame` to a mutable ref → the transparent Three.js overlay reads it in the render loop → pure placement math derives palm midpoint, scale, and constrained roll → time-based smoothing filters the target → the overlay mutates the real 3D cube group's position, rotation, scale, and visibility without frame-by-frame React state.

**Safe learning exercise:** In `features/cube-placement/cube-placement.ts`, change `CUBE_SIZE_PER_HAND_DISTANCE` from `0.48` to `0.42`, observe how the cube responds to the same hand spacing, and restore `0.48`. This changes only the visual placement target and cannot mutate cube rules because M3 has no logical cube state.

**Next action:** Begin M4 with the pure logical cube engine and tests before connecting any gesture to a rendered layer.

### 2026-09-30 — M3 compact testing panel follow-up

**Goal:** Keep the M3 status and stop control visible without covering a large part of the camera when the browser occupies only half the screen.

**Changed:** The full explanation remains visible before camera permission. While the camera is active, the panel now uses a narrower, tighter layout and hides the already-read explanatory and privacy paragraphs. The title, live status, recovery action when needed, and **Stop camera** action remain visible.

**Known limitation:** This is a utilitarian testing layout. Final responsive product UI and a deliberate collapse/expand control remain part of later presentation work.

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
