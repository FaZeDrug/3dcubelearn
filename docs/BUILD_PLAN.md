# 3D Cube Learn — Build Plan

**Status:** Active

**Current milestone:** M3 — Cube in my hands

**Last updated:** 2026-09-30

## 1. What a milestone means

A functional requirement describes something the finished product must do. For example, FR-03 requires the app to detect up to two hands.

A milestone is a small, ordered delivery checkpoint. It groups the minimum requirements and engineering work needed to create one new observable capability. A milestone must be independently demonstrable and verifiable.

One milestone may implement several FRs, and one difficult FR may be implemented across more than one milestone. The mapping below keeps the build plan traceable to the PRD without treating the PRD as a to-do list that must be built all at once.

## 2. Progressive finish lines

This project has several legitimate definitions of “finished”:

1. **Technical proof:** A virtual cube is stable between two detected hands.
2. **Interactive demo MVP:** The user can make one deliberate, valid layer turn.
3. **Shareable demo:** The interaction is understandable and reliable enough to record and show publicly.
4. **Full-stack product MVP:** Accounts, timed attempts, server validation, and leaderboards work.
5. **Replay release:** Attempts can be reconstructed in the 3D spectator scene.
6. **Learning product:** Guided solving lessons are complete.

The project does not need to reach finish line 6 before finish lines 1–3 count as completed, shippable achievements.

## 3. Milestone roadmap and FR traceability

| Milestone | Observable outcome | PRD traceability | Status |
|---|---|---|---|
| M0 — Functional 3D lab | A local web app renders a recognizable, inspectable 3×3 cube in a utilitarian full-screen stage. | Foundation; no product FR completed | **Complete** |
| M1 — Camera lifecycle | The user can start a mirrored webcam view, understand permission state, and stop the camera. | FR-01, FR-02, FR-04, FR-11 | **Complete** |
| M2 — Two-hand tracking | The app displays reliable debug landmarks and zero/one/two-hand status. | FR-03, FR-04, part of FR-06 | **Complete** |
| M3 — Cube in my hands | A solved cube appears stably between two hands and safely handles tracking loss. | FR-05, FR-06 | **Active** |
| M4 — One deliberate turn | A taught pinch-and-drag turns one selected layer with preview, cancel, and 90° snap. | FR-07, FR-08, FR-09, FR-12, FR-13 | Planned |
| M5 — Shareable interaction demo | Mirror/3D-hands switching, onboarding, accessibility, recovery states, and performance make the demo presentable. | FR-10, FR-11 and PRD non-functional requirements | Planned |
| M6 — Local timed practice | Practice timing, solved-state completion, move events, and deterministic local playback work without accounts. | Foundations for FR-18, FR-19, FR-25, FR-26 | Planned |
| M7 — Ranked full stack | Accounts, server-issued attempts, validation, history, and leaderboards work securely. | FR-15 through FR-24 | Planned |
| M8 — 3D attempt replay | A seated avatar reconstructs solved and incomplete attempts with timeline controls. | FR-27 through FR-32 | Planned |
| M9 — Guided learning | The product teaches and verifies the beginner solving method. | Future PRD scope | Planned |

FR-14, preference persistence, should be added when a preference first becomes stable and valuable rather than receiving its own milestone.

## 4. Completed milestone: M0 — Functional 3D lab

**Completed:** 2026-09-30

### Goal

Create the smallest real application that proves the selected web and 3D stack. Opening the app should immediately show a functional development stage—not a marketing landing page—with a recognizable Rubik's-style 3×3 cube that the user can inspect.

### Deliverables

- Next.js application using TypeScript and the App Router
- React Three Fiber using a current stable Three.js renderer path
- A full-window development stage at the root route
- A solved 3×3 cube composed of visible cubies or facelets
- Mouse or trackpad orbit controls for inspection
- Minimal utilitarian text identifying the current milestone
- Responsive behavior for common laptop viewport sizes
- Package scripts for development, linting, type checking, tests, and production build
- At least one focused automated test for non-visual project logic or configuration
- Accurate local run instructions in the README

### Acceptance criteria

M0 is complete only when:

1. A clean install succeeds using the committed package manager and lockfile.
2. The development server starts using the documented command.
3. Opening the root route shows a 3×3 cube without console errors.
4. Dragging with a mouse or trackpad rotates the view around the cube.
5. Resizing the browser does not stretch, crop, or destroy the scene.
6. Lint, type checking, tests, and production build all pass.
7. The build log explains the important files and includes verification evidence.
8. The project owner receives a short learning exercise based on the implemented scene.

### Explicit non-goals

M0 does not include:

- A polished landing page or brand system
- Webcam permission or camera video
- Hand tracking
- Gesture recognition
- Correct face-turn mechanics
- Authentication, database configuration, or server persistence
- Timer, leaderboard, replay, or solving lessons
- Photorealistic assets

### Learning checkpoint

After M0, the project owner should be able to explain:

- What Next.js, React, Three.js, and React Three Fiber each do
- What a scene, camera, mesh, geometry, material, light, and render loop are
- Which component owns the canvas and which code creates the cube
- How to start the application and verify a production build

### Completion evidence

- Locked dependency installation completed with `npm ci`; `npm ls --depth=0` confirmed the dependency tree.
- The development server started with `npm run dev`.
- Chrome rendered the solved cube with no application console errors.
- Dragging changed the camera orbit, scrolling changed camera distance, and resizing preserved a usable scene.
- Lint, type checking, the focused unit test, and the production build passed.
- `docs/BUILD_LOG.md` contains the detailed verification record and learning handoff.

## 5. Completed milestone: M1 — Camera lifecycle

**Completed:** 2026-09-30

### Goal

Add the first privacy-respecting webcam lifecycle without hand tracking. The user must understand why camera access is needed, choose when to request it, see a mirrored live preview when permission succeeds, understand failure states, and be able to stop every active video track.

### Deliverables

- A clear explanation before camera permission is requested
- An explicit **Start camera** action
- A browser camera request for video only, never audio
- A mirrored live video preview
- Human-readable idle, requesting, active, denied, unavailable, and error states
- A persistent **Camera active** indicator while a stream is live
- A **Stop camera** action that stops every media track
- Cleanup that stops tracks when the camera experience unmounts
- Focused tests for camera-state transitions or stream cleanup
- Updated run, architecture, decision, and build-log documentation

### Acceptance criteria

M1 is complete only when:

1. Loading the page does not request camera permission automatically.
2. The page explains the camera purpose before the user selects **Start camera**.
3. Starting the camera requests video without requesting microphone access.
4. Granting permission shows a mirrored live preview and a visible **Camera active** state.
5. Denied permission, missing hardware, and unexpected camera errors each produce an actionable message.
6. Selecting **Stop camera** stops every stream track and returns the interface to an inactive state.
7. Leaving or unmounting the experience also stops every stream track.
8. The completed M0 cube stage remains available and the project validation commands continue to pass.
9. A real-browser camera smoke test and its limitations are recorded in the build log.

### Explicit non-goals

M1 does not include:

- Hand landmark detection
- Cube placement over the video
- Gesture recognition or cube turns
- 3D modeled hands
- Authentication, persistence, timers, leaderboards, or replay
- Marketing-page design

### Learning checkpoint

After M1, the project owner should be able to explain:

- Why browser APIs and React hooks belong behind a client-component boundary
- What a `MediaStream` and media track are
- Why hiding a video element is different from stopping its tracks
- How idle, requesting, active, denied, unavailable, and error states drive the interface
- Why webcam frames stay local and are not stored in React state

### Completion evidence

- Loading the root route displayed the camera explanation and did not open a permission prompt.
- Selecting **Start camera** opened Chrome's camera-only permission prompt.
- Granting permission produced a playback-ready mirrored preview and a visible **Camera active** indicator. The initial unconstrained stream was 640×480; the camera-quality follow-up measured a negotiated 1920×1080 stream after adding ideal HD constraints.
- Selecting **Stop camera** removed the preview, returned the app to idle, and cleared Chrome's recording indicator.
- Navigating away while active unmounted the experience and also cleared Chrome's recording indicator.
- Automated tests cover video-only constraints, stopping every track, and mapping denied, unavailable, device-busy, and unknown failures.
- Lint, type checking, all focused tests, and the production build passed.
- `docs/BUILD_LOG.md` contains the detailed verification record and learning handoff.

## 6. Completed milestone: M2 — Two-hand tracking

**Completed:** 2026-09-30

### Goal

Add browser-side hand detection on top of the completed camera lifecycle. The user should see debug landmarks aligned with the mirrored preview and an explicit zero-, one-, or two-hand status. This milestone proves perception only; it does not place or turn the cube.

### Deliverables

- A browser-side hand-tracking adapter with a documented model dependency
- Loading, ready, unsupported, and inference-error states
- A frame loop that runs only while both camera and tracking are active
- Mirrored debug landmarks aligned with the live video
- Explicit zero-, one-, and two-hand status
- Tracking cleanup when the camera stops or the experience unmounts
- Focused tests for application-owned landmark mapping and status logic
- Updated run, architecture, decision, and build-log documentation

### Acceptance criteria

M2 is complete only when:

1. The M1 camera lifecycle and privacy behavior continue to pass.
2. Starting tracking loads the model in the browser without uploading video frames or landmarks.
3. With no hand visible, the interface reports zero hands and draws no stale landmarks.
4. With one open hand visible, the interface reports one hand and draws one aligned landmark set.
5. With two open hands visible, the interface reports two hands and draws two aligned landmark sets.
6. Landmarks remain directionally aligned with the mirrored video during ordinary hand movement on the baseline laptop.
7. Stopping the camera or leaving the experience cancels inference work and releases tracking resources.
8. Model-load and inference failures produce a recoverable message rather than a crashed experience.
9. Lint, type checking, tests, production build, and a real-browser tracking smoke test pass and are recorded.

### Explicit non-goals

M2 does not include:

- Cube placement between the hands
- Gesture recognition, layer selection, or cube turns
- Production-grade smoothing for occlusion and hand crossing
- 3D modeled hands
- Authentication, persistence, timers, leaderboards, or replay
- Marketing-page design

### Completion evidence

- The project owner tested the implementation with a real webcam on the baseline MacBook and confirmed that zero, one, and two hands were detected successfully and that the visual landmark experience worked correctly.
- MediaPipe loads only after explicit camera activation and exposes application-owned observations for no more than two hands.
- The overlay clears when no hands are detected, and the interface distinguishes initial zero hands from tracking loss.
- Mirrored coordinate mapping and `object-fit: cover` cropping are covered by deterministic tests.
- Stopping or unmounting cancels the frame loop, closes the MediaPipe task, clears the canvas, and preserves the M1 all-track camera cleanup.
- Model-load and inference failures display recoverable states, including an in-place tracking retry.
- Lint, type checking, all twenty focused tests, and the production build pass.
- `docs/BUILD_LOG.md` contains the detailed verification record and learning handoff.

### Learning checkpoint

After M2, the project owner should be able to explain:

- What a hand landmark is and why MediaPipe returns 21 landmarks per detected hand
- Why MediaPipe output is converted into application-owned types
- How mirrored video changes the x coordinate used to draw landmarks
- Why frame-by-frame landmarks are drawn directly to canvas instead of stored in React state
- How stopping the camera differs from cancelling the inference loop and closing the hand-tracking task
- Why M2 reports perception only and does not place or turn the cube

## 7. Active milestone: M3 — Cube in my hands

### Goal

Use the completed two-hand observations to render a solved virtual cube at a stable, readable transform between the user's hands. The cube should follow deliberate two-hand movement without distracting jitter and should fail safely when one or both hands are lost. This milestone proves presence and anchoring only; it does not interpret cube-turn gestures.

### Deliverables

- A pure hand-to-cube transform module that derives palm centers, midpoint, scale, and a constrained orientation from two tracked hands
- Temporal smoothing and movement thresholds that reduce visible jitter while remaining responsive
- A transparent React Three Fiber canvas composited over the mirrored camera preview
- A solved cube rendered from the existing cube presentation at the tracked transform
- Explicit waiting, anchored, one-hand, low-confidence, and tracking-lost behavior
- Safe freeze, fade, or neutral recovery behavior when a valid two-hand anchor disappears
- High-frequency cube transforms kept outside frame-by-frame React state
- Focused tests for transform derivation, limits, smoothing, and loss recovery
- Updated run, architecture, decision, and build-log documentation

### Acceptance criteria

M3 is complete only when:

1. The completed M1 camera lifecycle and M2 hand tracking continue to pass.
2. With fewer than two valid hands, no newly anchored cube appears and the interface explains what is missing.
3. With two hands in the supported pose, a solved cube appears near the midpoint between them within one second of tracking readiness.
4. Moving both hands together moves the cube in the same mirrored screen direction.
5. Moving the hands apart or together changes cube scale within documented minimum and maximum limits.
6. A mostly still two-hand pose does not produce distracting continuous cube jitter.
7. Brief loss of one or both hands freezes or fades the cube without jumping to an unrelated pose; sustained loss returns to a safe waiting state.
8. Stopping the camera or leaving the experience cancels tracking updates and releases camera, MediaPipe, animation-frame, and Three.js resources.
9. Lint, type checking, tests, production build, and a real-browser two-hand anchoring smoke test pass and are recorded.

### Explicit non-goals

M3 does not include:

- Pinch recognition, face selection, layer turns, or cube-state mutation
- Whole-cube rotation gestures
- Production-grade occlusion between the user's hands and cube
- The 3D modeled-hands display mode
- Authentication, persistence, timers, leaderboards, replay, or solving lessons
- Marketing-page design

### Learning checkpoint

After M3, the project owner should be able to explain:

- How normalized hand landmarks become a screen-space cube position and scale
- Why the midpoint between palm centers is a useful first anchor
- What temporal smoothing changes and why too much smoothing creates lag
- Why transform calculations remain pure TypeScript while Three.js only presents the result
- How the experience distinguishes a valid anchor from temporary or sustained tracking loss
- Why cube placement and cube manipulation are separate milestones

## 8. Milestone operating loop

For each milestone:

1. Confirm the goal, non-goals, and acceptance criteria.
2. Inspect the current repository state.
3. Make the smallest implementation plan that reaches the observable outcome.
4. Implement in reviewable increments.
5. Run automated validation and a focused browser smoke test.
6. Repair failures before adding scope.
7. Update the build log, architecture, and decisions.
8. Complete the learning handoff.
9. Mark the milestone complete and activate exactly one next milestone.

## 9. Parking lot

Ideas recorded here are intentionally not active work:

- Marketing landing page and brand design
- Mobile/tablet support
- Public replay sharing
- Social profiles and friend leaderboards
- Exact-motion avatar replay
- Advanced cube materials and visual effects
- Competition inspection rules
- Voice guidance

Items may move out of the parking lot only through an explicit build-plan update.
