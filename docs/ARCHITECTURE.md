
# 3D Cube Learn — Architecture

**Status:** Proposed architecture; application code has not been scaffolded

**Last updated:** 2026-09-29

## 1. Architectural goal

Keep real-time interaction responsive and private in the browser while isolating cube rules from rendering. Add server authority only when timed ranked attempts require identity, validation, and persistence.

The architecture should be understandable as a pipeline rather than a collection of framework features.

```mermaid
flowchart LR
    A[Webcam] --> B[Hand tracking]
    B --> C[Tracking stabilizer]
    C --> D[Gesture interpreter]
    D --> E[Pure cube engine]
    C --> F[Scene transforms]
    E --> G[Three.js scene]
    F --> G
    E --> H[Attempt event log]
    H --> I[Timer and replay]
    H -. later .-> J[Server validation]
    J -. later .-> K[(PostgreSQL)]
```

## 2. Technology responsibilities

| Technology | Responsibility | Does not own |
|---|---|---|
| Next.js | Application shell, routing, and later server endpoints | Hand inference or cube rules |
| React | User interface and durable view state | Frame-by-frame landmark data |
| Three.js | 3D scene objects, cameras, materials, lighting, and animation | Authoritative cube state |
| React Three Fiber | React integration for the Three.js canvas and render loop | Computer vision or business rules |
| MediaPipe Hand Landmarker | Browser-side hand landmark inference | Gesture intent or cube moves |
| Pure TypeScript modules | Cube state, legal moves, gesture state machine, event schemas | Rendering |
| PostgreSQL/Supabase, later | Accounts, attempts, results, and leaderboard persistence | Webcam frames or raw landmarks |

## 3. Near-term client pipeline

### Rendering

The first milestone renders a cube without camera or tracking dependencies. The 3D scene should be replaceable and testable through clear component boundaries.

### Camera

The camera service will own permission requests, media-track lifecycle, mirrored display, and error recovery. Hiding the video is different from stopping its tracks.

### Tracking

The tracking adapter will translate MediaPipe output into an application-owned landmark format. This prevents the rest of the app from depending directly on a specific vision-library response shape.

### Stabilization

The stabilizer will smooth noisy landmark positions, maintain handedness continuity, gate low-confidence frames, and emit explicit tracking-loss events.

### Gestures

The gesture interpreter will be a temporal state machine. It will convert a sequence of stabilized observations into semantic commands such as `pinch_started`, `turn_previewed`, `turn_committed`, and `turn_cancelled`.

### Cube engine

The cube engine will be pure TypeScript. Given an initial state and a legal move, it will produce the next state. Both the browser and later server validator must use the same versioned rules.

### Rendering bridge

The scene will read cube state and smoothed transforms and display them. High-frequency positions should be stored in mutable refs or a purpose-built external store so React does not rerender the entire interface for every camera frame.

## 4. Later full-stack boundary

The backend is intentionally deferred until the interaction demo works, but the future boundary is defined now:

- Browser: camera, landmarks, gestures, rendering, responsive timer, and attempt-event collection
- Server: authentication checks, scramble issuance, attempt lifecycle, validation, rate limits, and leaderboard reads
- Database: public profiles, scrambles, attempts, semantic events, and accepted results

Camera frames and raw landmarks do not cross the client/server boundary.

## 5. Proposed project structure

This structure is a guide and should be created incrementally rather than all at once:

```text
app/
  page.tsx                  # current functional stage
  api/                      # later server endpoints
components/
  experience/              # durable UI around the stage
features/
  camera/                   # stream lifecycle
  tracking/                 # MediaPipe adapter and smoothing
  gestures/                 # intent state machine
  cube/                     # scene bridge and controls
  attempts/                 # timing and semantic events
  replay/                   # later spectator experience
lib/
  cube-core/                # pure state and legal moves
  server/                   # later auth and persistence helpers
docs/
  PRD.md
  BUILD_PLAN.md
  ARCHITECTURE.md
  DECISIONS.md
  BUILD_LOG.md
```

Only directories required by the active milestone should exist.

## 6. State ownership rules

- React owns menus, permission status, errors, active modes, and other human-scale UI state.
- The tracking loop owns per-frame landmark observations.
- The stabilizer owns filtered transforms and confidence history.
- The cube engine owns the authoritative cube configuration.
- Three.js owns only scene objects and transitional visual animation.
- The attempt recorder owns the ordered semantic event stream.
- The server owns whether a ranked attempt is accepted.

## 7. Verification strategy

- Pure cube and gesture logic: deterministic unit tests
- React UI states: focused component tests
- Camera/tracking adapters: fixtures plus manual testing with a real webcam
- Primary user journeys: browser automation when stable
- Visual alignment and interaction quality: explicit browser smoke tests on a baseline laptop
- Server authorization and validation: integration tests and database-policy tests when backend work begins

## 8. Known architectural risks

- A single webcam does not provide reliable absolute depth.
- Hand crossing and occlusion may swap identity or confidence.
- React rerenders can compete with inference and rendering if per-frame data is modeled incorrectly.
- Gesture ambiguity may require a more constrained interaction than the product vision initially imagines.
- The replay avatar can look physically wrong even when cube state is correct.

The build order attacks the first four risks before investing in backend or replay production.
