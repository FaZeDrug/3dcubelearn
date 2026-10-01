# 3D Cube Learn

Learn how to solve a Rubik's-style cube without owning one.

3D Cube Learn is an experimental full-stack browser experience that uses webcam hand tracking and a virtual 3D cube. The first goal is to make a cube appear between a user's empty hands and allow a deliberate layer turn. Timed solves, profiles, verified results, 3D attempt replays, leaderboards, and guided solving lessons build on that interaction.

## Project status

M1 — Camera lifecycle is complete. The current local demo opens to the M0 3D cube, explains why camera access is useful, and waits for the user to select **Start camera**. If permission is granted, it shows a mirrored local preview with an active indicator and a real **Stop camera** action.

M2 — Two-hand tracking is complete. MediaPipe loads in the browser, draws mirrored hand landmarks, and reports zero, one, or two detected hands. The project owner verified all three hand-count states with a real webcam on the baseline MacBook.

The active milestone is M3 — Cube in my hands. It will derive a stable transform from both hands and composite the solved 3D cube between them. Gesture recognition, layer turns, marketing polish, and backend features remain deferred to later milestones.

## Requirements

- Node.js 24 LTS (recorded in `.nvmrc`)
- npm

If you use nvm, select the project version with:

```bash
nvm use
```

## Run locally

Install the locked dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Drag to orbit around the cube and scroll to zoom. Read the camera explanation, then select **Start camera**. Wait for the hand model to load and raise zero, one, then two hands to verify the status and landmark overlay. Select **Stop camera** when finished.

## Verify the project

Run each validation command before closing a milestone:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The production build can be served locally after `npm run build` with:

```bash
npm start
```

## What M0 proves

- Next.js, React, TypeScript, Three.js, and React Three Fiber build together.
- The root route can host a responsive full-window WebGL scene.
- A recognizable solved cube can be generated from pure TypeScript position data.
- Orbit and zoom controls work without adding product features prematurely.
- Pure non-visual logic can be tested independently of the renderer.

## What M1 proves

- Camera permission is requested only after an explicit user action.
- The browser receives a video-only request; microphone access is not requested.
- The camera prefers a 1080p, 16:9, 30-fps stream and gracefully falls back to hardware-supported settings.
- A `MediaStream` can drive a mirrored live preview without uploading or saving frames.
- Camera failures can be translated into clear, actionable UI states.
- Every stream track is stopped when the user stops the camera or leaves the experience.

## What M2 proves

- MediaPipe Hand Landmarker can be loaded only after the camera starts and can detect up to two hands locally in the browser.
- MediaPipe results are converted into an application-owned landmark, handedness, and confidence shape.
- A canvas overlay can map landmarks through the mirrored, `object-fit: cover` camera presentation.
- The interface distinguishes model loading, zero hands, one hand, two hands, lost tracking, unsupported browsers, and inference errors.
- The frame loop performs at most one synchronous inference at a time and avoids frame-by-frame React state updates.
- Stopping the camera or unmounting the experience cancels animation work, clears landmarks, and closes the MediaPipe task.

The JavaScript package is pinned to `@mediapipe/tasks-vision@1.0.1`. Its version-matched WebAssembly runtime and Google-hosted hand model are downloaded by the browser when tracking starts. Camera frames and raw landmarks remain on-device. MediaPipe's official privacy notice states that the API may send Google performance and utilization metrics; the application discloses that separately from camera-frame handling.

## Project documentation

- [Product requirements](docs/PRD.md)
- [Milestone build plan](docs/BUILD_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision log](docs/DECISIONS.md)
- [Build and learning log](docs/BUILD_LOG.md)
- [Repository instructions](AGENTS.md)
