import type {
  HandCount,
  TrackingLandmark,
  TrackingStatus,
} from "./tracking-types";

export const HAND_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

type Size = {
  height: number;
  width: number;
};

export type CanvasPoint = {
  x: number;
  y: number;
};

export type TrackingPresentation = {
  detail: string;
  label: string;
};

export function getHandCount(handTotal: number): HandCount {
  if (handTotal >= 2) {
    return 2;
  }

  if (handTotal === 1) {
    return 1;
  }

  return 0;
}

export function mapLandmarkToCoverCanvas(
  landmark: Pick<TrackingLandmark, "x" | "y">,
  source: Size,
  target: Size,
  mirrored = true,
): CanvasPoint {
  if (
    source.width <= 0 ||
    source.height <= 0 ||
    target.width <= 0 ||
    target.height <= 0
  ) {
    return { x: 0, y: 0 };
  }

  const scale = Math.max(
    target.width / source.width,
    target.height / source.height,
  );
  const renderedWidth = source.width * scale;
  const renderedHeight = source.height * scale;
  const offsetX = (target.width - renderedWidth) / 2;
  const offsetY = (target.height - renderedHeight) / 2;
  const normalizedX = mirrored ? 1 - landmark.x : landmark.x;

  return {
    x: normalizedX * renderedWidth + offsetX,
    y: landmark.y * renderedHeight + offsetY,
  };
}

export function getTrackingPresentation(
  status: TrackingStatus,
  handCount: HandCount,
  hasSeenHands: boolean,
): TrackingPresentation {
  if (status === "idle") {
    return {
      label: "Hand tracking off",
      detail: "Start the camera when you are ready to test hand detection.",
    };
  }

  if (status === "loading") {
    return {
      label: "Loading hand tracking",
      detail: "The on-device hand model is getting ready.",
    };
  }

  if (status === "unsupported") {
    return {
      label: "Hand tracking unavailable",
      detail: "This browser cannot run the on-device hand model.",
    };
  }

  if (status === "error") {
    return {
      label: "Hand tracking error",
      detail: "The hand model stopped unexpectedly. Try loading it again.",
    };
  }

  if (handCount === 2) {
    return {
      label: "2 hands detected",
      detail: "Both hands are visible and producing landmarks.",
    };
  }

  if (handCount === 1) {
    return {
      label: "1 hand detected",
      detail: "Raise your other hand so both hands are visible.",
    };
  }

  if (hasSeenHands) {
    return {
      label: "Tracking lost · 0 hands",
      detail: "Raise your hands back into the camera frame.",
    };
  }

  return {
    label: "0 hands detected",
    detail: "Raise one or two open hands inside the camera frame.",
  };
}
