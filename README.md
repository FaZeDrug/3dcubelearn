# 3D Cube Learn

Learn how to solve a Rubik's-style cube without owning one.

3D Cube Learn is an experimental full-stack browser experience that uses webcam hand tracking and a virtual 3D cube. The first goal is to make a cube appear between a user's empty hands and allow a deliberate layer turn. Timed solves, profiles, verified results, 3D attempt replays, leaderboards, and guided solving lessons build on that interaction.

## Project status

M0 — Functional 3D lab is complete. The current local demo opens directly to a full-window, inspectable 3×3 cube with mouse or trackpad orbit and zoom controls.

The active milestone is M1 — Camera lifecycle. It will add an explicit camera start action, mirrored webcam preview, clear permission and error states, and a real stop-camera action. Hand tracking, gesture recognition, marketing polish, and backend features remain deferred to later milestones.

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

Open [http://localhost:3000](http://localhost:3000). Drag to orbit around the cube and scroll to zoom.

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

## Project documentation

- [Product requirements](docs/PRD.md)
- [Milestone build plan](docs/BUILD_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision log](docs/DECISIONS.md)
- [Build and learning log](docs/BUILD_LOG.md)
- [Repository instructions](AGENTS.md)
