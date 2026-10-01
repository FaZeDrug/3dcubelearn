import type {
  TrackedHand,
  TrackingFrame,
  TrackingLandmark,
} from "../tracking/tracking-types";
import { mapLandmarkToCoverCanvas } from "../tracking/tracking-utils";

const PALM_LANDMARK_INDICES = [0, 5, 9, 13, 17] as const;
const MIN_HAND_CONFIDENCE = 0.5;
const MIN_REQUIRED_LANDMARKS = 18;
const ORIENTATION_INFLUENCE = 0.35;
const MAX_ROTATION_Z = 0.22;
const CUBE_SIZE_PER_HAND_DISTANCE = 0.48;

export const MIN_CUBE_SCREEN_SIZE = 0.16;
export const MAX_CUBE_SCREEN_SIZE = 0.44;
export const TRACKING_HOLD_DURATION_MS = 350;

export type Dimensions = {
  height: number;
  width: number;
};

export type CubeTransform = {
  rotationZ: number;
  screenSize: number;
  x: number;
  y: number;
};

export type CubeAnchorFailure =
  | "not-enough-hands"
  | "low-confidence"
  | "invalid-layout";

export type CubeAnchorResult =
  | { anchor: CubeTransform; reason: null }
  | { anchor: null; reason: CubeAnchorFailure };

export type CubePlacementPhase =
  | "waiting"
  | "anchored"
  | "holding"
  | "low-confidence";

export type SmoothingOptions = {
  positionDeadZone: number;
  positionHalfLifeMs: number;
  rotationDeadZone: number;
  rotationHalfLifeMs: number;
  scaleDeadZone: number;
  scaleHalfLifeMs: number;
};

export const DEFAULT_SMOOTHING_OPTIONS: SmoothingOptions = {
  positionDeadZone: 0.003,
  positionHalfLifeMs: 85,
  rotationDeadZone: 0.008,
  rotationHalfLifeMs: 140,
  scaleDeadZone: 0.004,
  scaleHalfLifeMs: 120,
};

export function deriveCubeAnchor(
  frame: TrackingFrame,
  source: Dimensions,
  target: Dimensions,
): CubeAnchorResult {
  if (!hasValidDimensions(source) || !hasValidDimensions(target)) {
    return { anchor: null, reason: "invalid-layout" };
  }

  if (frame.hands.length < 2) {
    return { anchor: null, reason: "not-enough-hands" };
  }

  const palmCenters = frame.hands.slice(0, 2).map(getPalmCenter);

  if (palmCenters.some((center) => center === null)) {
    return { anchor: null, reason: "low-confidence" };
  }

  const mappedCenters = palmCenters
    .filter((center): center is TrackingLandmark => center !== null)
    .map((center) => mapLandmarkToCoverCanvas(center, source, target))
    .sort((first, second) => first.x - second.x);
  const [leftCenter, rightCenter] = mappedCenters;

  if (!leftCenter || !rightCenter) {
    return { anchor: null, reason: "low-confidence" };
  }

  const deltaX = rightCenter.x - leftCenter.x;
  const deltaY = rightCenter.y - leftCenter.y;
  const handDistance = Math.hypot(deltaX, deltaY);
  const midpointX = (leftCenter.x + rightCenter.x) / 2;
  const midpointY = (leftCenter.y + rightCenter.y) / 2;
  const handDistanceByHeight = handDistance / target.height;
  const screenSize = clamp(
    handDistanceByHeight * CUBE_SIZE_PER_HAND_DISTANCE,
    MIN_CUBE_SCREEN_SIZE,
    MAX_CUBE_SCREEN_SIZE,
  );
  const rotationZ = clamp(
    -Math.atan2(deltaY, Math.max(deltaX, Number.EPSILON)) *
      ORIENTATION_INFLUENCE,
    -MAX_ROTATION_Z,
    MAX_ROTATION_Z,
  );

  return {
    anchor: {
      rotationZ,
      screenSize,
      x: midpointX / target.width,
      y: midpointY / target.height,
    },
    reason: null,
  };
}

export function smoothCubeTransform(
  current: CubeTransform,
  target: CubeTransform,
  deltaMs: number,
  options: SmoothingOptions = DEFAULT_SMOOTHING_OPTIONS,
): CubeTransform {
  return {
    rotationZ: smoothValue(
      current.rotationZ,
      target.rotationZ,
      deltaMs,
      options.rotationHalfLifeMs,
      options.rotationDeadZone,
    ),
    screenSize: smoothValue(
      current.screenSize,
      target.screenSize,
      deltaMs,
      options.scaleHalfLifeMs,
      options.scaleDeadZone,
    ),
    x: smoothValue(
      current.x,
      target.x,
      deltaMs,
      options.positionHalfLifeMs,
      options.positionDeadZone,
    ),
    y: smoothValue(
      current.y,
      target.y,
      deltaMs,
      options.positionHalfLifeMs,
      options.positionDeadZone,
    ),
  };
}

export function getCubePlacementPhase(
  anchor: CubeTransform | null,
  failure: CubeAnchorFailure | null,
  lastValidAtMs: number | null,
  nowMs: number,
): CubePlacementPhase {
  if (anchor) {
    return "anchored";
  }

  if (
    lastValidAtMs !== null &&
    nowMs - lastValidAtMs <= TRACKING_HOLD_DURATION_MS
  ) {
    return "holding";
  }

  return failure === "low-confidence" ? "low-confidence" : "waiting";
}

function getPalmCenter(hand: TrackedHand): TrackingLandmark | null {
  if (
    hand.confidence < MIN_HAND_CONFIDENCE ||
    hand.landmarks.length < MIN_REQUIRED_LANDMARKS
  ) {
    return null;
  }

  const palmLandmarks = PALM_LANDMARK_INDICES.map(
    (index) => hand.landmarks[index],
  );

  if (
    palmLandmarks.some(
      (landmark) =>
        !landmark ||
        !Number.isFinite(landmark.x) ||
        !Number.isFinite(landmark.y) ||
        !Number.isFinite(landmark.z),
    )
  ) {
    return null;
  }

  const totals = palmLandmarks.reduce(
    (sum, landmark) => ({
      visibility: sum.visibility + (landmark?.visibility ?? 0),
      x: sum.x + (landmark?.x ?? 0),
      y: sum.y + (landmark?.y ?? 0),
      z: sum.z + (landmark?.z ?? 0),
    }),
    { visibility: 0, x: 0, y: 0, z: 0 },
  );
  const divisor = PALM_LANDMARK_INDICES.length;

  return {
    visibility: totals.visibility / divisor,
    x: totals.x / divisor,
    y: totals.y / divisor,
    z: totals.z / divisor,
  };
}

function hasValidDimensions(dimensions: Dimensions): boolean {
  return dimensions.width > 0 && dimensions.height > 0;
}

function smoothValue(
  current: number,
  target: number,
  deltaMs: number,
  halfLifeMs: number,
  deadZone: number,
): number {
  if (Math.abs(target - current) <= deadZone) {
    return current;
  }

  if (deltaMs <= 0 || halfLifeMs <= 0) {
    return current;
  }

  const alpha = 1 - Math.pow(0.5, deltaMs / halfLifeMs);
  return current + (target - current) * alpha;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
