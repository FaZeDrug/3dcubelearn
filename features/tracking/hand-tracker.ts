import type {
  HandTracker,
  Handedness,
  TrackedHand,
  TrackingFrame,
  TrackingLandmark,
} from "./tracking-types";

export const MEDIAPIPE_TASKS_VISION_VERSION = "1.0.1";
export const MEDIAPIPE_WASM_ROOT =
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;
export const HAND_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

type MediaPipeCategoryLike = {
  categoryName?: string;
  score?: number;
};

type MediaPipeLandmarkLike = {
  visibility?: number;
  x: number;
  y: number;
  z: number;
};

type MediaPipeHandResultLike = {
  handedness?: MediaPipeCategoryLike[][];
  landmarks?: MediaPipeLandmarkLike[][];
};

export class HandTrackingUnsupportedError extends Error {
  constructor() {
    super("This browser cannot run the hand-tracking model.");
    this.name = "HandTrackingUnsupportedError";
  }
}

export function mapHandLandmarkerResult(
  result: MediaPipeHandResultLike,
  timestampMs: number,
): TrackingFrame {
  const hands = (result.landmarks ?? []).slice(0, 2).map((landmarks, index) => {
    const category = result.handedness?.[index]?.[0];

    return {
      confidence: clampConfidence(category?.score),
      handedness: mapHandedness(category?.categoryName),
      landmarks: landmarks.map(mapLandmark),
    } satisfies TrackedHand;
  });

  return { hands, timestampMs };
}

export async function createHandTracker(): Promise<HandTracker> {
  if (!supportsHandTracking()) {
    throw new HandTrackingUnsupportedError();
  }

  const { FilesetResolver, HandLandmarker } = await import(
    "@mediapipe/tasks-vision"
  );
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_ROOT);
  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      delegate: "GPU",
      modelAssetPath: HAND_LANDMARKER_MODEL_URL,
    },
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    numHands: 2,
    runningMode: "VIDEO",
  });
  let closed = false;

  return {
    close() {
      if (closed) {
        return;
      }

      closed = true;
      handLandmarker.close();
    },
    detect(video, timestampMs) {
      if (closed) {
        return { hands: [], timestampMs };
      }

      return mapHandLandmarkerResult(
        handLandmarker.detectForVideo(video, timestampMs),
        timestampMs,
      );
    },
  };
}

function supportsHandTracking(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.requestAnimationFrame === "function" &&
    typeof WebAssembly !== "undefined"
  );
}

function mapHandedness(value: string | undefined): Handedness {
  const normalizedValue = value?.toLowerCase();

  if (normalizedValue === "left" || normalizedValue === "right") {
    return normalizedValue;
  }

  return "unknown";
}

function mapLandmark(landmark: MediaPipeLandmarkLike): TrackingLandmark {
  return {
    visibility: landmark.visibility ?? 1,
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
  };
}

function clampConfidence(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}
