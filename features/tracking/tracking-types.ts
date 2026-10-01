export type Handedness = "left" | "right" | "unknown";

export type TrackingLandmark = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

export type TrackedHand = {
  confidence: number;
  handedness: Handedness;
  landmarks: TrackingLandmark[];
};

export type TrackingFrame = {
  hands: TrackedHand[];
  timestampMs: number;
};

export type HandCount = 0 | 1 | 2;

export type TrackingStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unsupported"
  | "error";

export type HandTracker = {
  close: () => void;
  detect: (video: HTMLVideoElement, timestampMs: number) => TrackingFrame;
};
