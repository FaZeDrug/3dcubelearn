"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type RootState,
} from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { Group } from "three";

import {
  deriveCubeAnchor,
  getCubePlacementPhase,
  smoothCubeTransform,
  type CubeAnchorFailure,
  type CubePlacementPhase,
  type CubeTransform,
} from "../features/cube-placement/cube-placement";
import type { TrackingFrame } from "../features/tracking/tracking-types";
import { RubiksCube } from "./rubiks-cube";

const MAX_TRACKING_FRAME_AGE_MS = 250;
const CUBE_MODEL_SIZE = 3;

type CubeOverlayProps = {
  latestFrameRef: RefObject<TrackingFrame | null>;
  onPlacementPhaseChange: (phase: CubePlacementPhase) => void;
  videoRef: RefObject<HTMLVideoElement | null>;
};

type TrackedCubeProps = CubeOverlayProps;

export function CubeOverlay({
  latestFrameRef,
  onPlacementPhaseChange,
  videoRef,
}: CubeOverlayProps) {
  return (
    <div className="camera-preview__cube" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 35, near: 0.1, far: 100 }}
        fallback={null}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.8} />
        <directionalLight intensity={4} position={[4, 6, 7]} />
        <directionalLight intensity={1.5} position={[-4, -2, 5]} />

        <TrackedCube
          latestFrameRef={latestFrameRef}
          onPlacementPhaseChange={onPlacementPhaseChange}
          videoRef={videoRef}
        />
      </Canvas>
    </div>
  );
}

function TrackedCube({
  latestFrameRef,
  onPlacementPhaseChange,
  videoRef,
}: TrackedCubeProps) {
  const groupRef = useRef<Group>(null);
  const lastValidAtRef = useRef<number | null>(null);
  const phaseRef = useRef<CubePlacementPhase>("waiting");
  const smoothedTransformRef = useRef<CubeTransform | null>(null);
  const { camera, size, viewport } = useThree();

  useFrame((_state, deltaSeconds) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const nowMs = performance.now();
    const frame = latestFrameRef.current;
    const video = videoRef.current;
    const isFreshFrame =
      frame !== null &&
      nowMs >= frame.timestampMs &&
      nowMs - frame.timestampMs <= MAX_TRACKING_FRAME_AGE_MS;
    let anchor: CubeTransform | null = null;
    let failure: CubeAnchorFailure | null = "not-enough-hands";

    if (isFreshFrame && video) {
      const result = deriveCubeAnchor(
        frame,
        { height: video.videoHeight, width: video.videoWidth },
        { height: size.height, width: size.width },
      );
      anchor = result.anchor;
      failure = result.reason;
    }

    const phase = getCubePlacementPhase(
      anchor,
      failure,
      lastValidAtRef.current,
      nowMs,
    );

    if (phase !== phaseRef.current) {
      phaseRef.current = phase;
      onPlacementPhaseChange(phase);
    }

    if (anchor) {
      lastValidAtRef.current = nowMs;
      const smoothedTransform = smoothedTransformRef.current
        ? smoothCubeTransform(
            smoothedTransformRef.current,
            anchor,
            Math.min(deltaSeconds * 1_000, 100),
          )
        : anchor;
      smoothedTransformRef.current = smoothedTransform;
      applyTransform(group, smoothedTransform, camera, viewport);
      group.visible = true;
      return;
    }

    if (phase === "holding" && smoothedTransformRef.current) {
      group.visible = true;
      return;
    }

    group.visible = false;
    smoothedTransformRef.current = null;
  });

  return (
    <group ref={groupRef} visible={false}>
      <RubiksCube />
    </group>
  );
}

function applyTransform(
  group: Group,
  transform: CubeTransform,
  camera: RootState["camera"],
  viewport: RootState["viewport"],
): void {
  const worldViewport = viewport.getCurrentViewport(camera, [0, 0, 0]);
  const scale = (transform.screenSize * worldViewport.height) / CUBE_MODEL_SIZE;

  group.position.set(
    (transform.x - 0.5) * worldViewport.width,
    (0.5 - transform.y) * worldViewport.height,
    0,
  );
  group.rotation.set(-0.32, 0.52, transform.rotationZ);
  group.scale.setScalar(scale);
}
