import { describe, expect, it } from "vitest";

import type {
  TrackedHand,
  TrackingFrame,
  TrackingLandmark,
} from "../tracking/tracking-types";
import {
  deriveCubeAnchor,
  getCubePlacementPhase,
  MAX_CUBE_SCREEN_SIZE,
  MIN_CUBE_SCREEN_SIZE,
  smoothCubeTransform,
  TRACKING_HOLD_DURATION_MS,
  type CubeTransform,
} from "./cube-placement";

const source = { height: 540, width: 960 };
const target = { height: 540, width: 960 };

describe("deriveCubeAnchor", () => {
  it("places the cube at the mirrored midpoint between two palm centers", () => {
    const result = deriveCubeAnchor(
      createFrame(createHand(0.2, 0.5), createHand(0.6, 0.5)),
      source,
      target,
    );

    expect(result.reason).toBeNull();
    expect(result.anchor?.x).toBeCloseTo(0.6);
    expect(result.anchor?.y).toBeCloseTo(0.5);
    expect(result.anchor?.rotationZ).toBeCloseTo(0);
  });

  it("constrains the cube size for very close and very distant hands", () => {
    const closeResult = deriveCubeAnchor(
      createFrame(createHand(0.49, 0.5), createHand(0.51, 0.5)),
      source,
      target,
    );
    const distantResult = deriveCubeAnchor(
      createFrame(createHand(0, 0.5), createHand(1, 0.5)),
      source,
      target,
    );

    expect(closeResult.anchor?.screenSize).toBe(MIN_CUBE_SCREEN_SIZE);
    expect(distantResult.anchor?.screenSize).toBe(MAX_CUBE_SCREEN_SIZE);
  });

  it("reports missing and low-confidence anchors without inventing a pose", () => {
    const oneHand = deriveCubeAnchor(
      createFrame(createHand(0.25, 0.5)),
      source,
      target,
    );
    const lowConfidence = deriveCubeAnchor(
      createFrame(createHand(0.25, 0.5, 0.2), createHand(0.75, 0.5)),
      source,
      target,
    );

    expect(oneHand).toEqual({ anchor: null, reason: "not-enough-hands" });
    expect(lowConfidence).toEqual({
      anchor: null,
      reason: "low-confidence",
    });
  });

  it("constrains orientation derived from a steep hand-to-hand angle", () => {
    const result = deriveCubeAnchor(
      createFrame(createHand(0.4, 0.1), createHand(0.6, 0.9)),
      source,
      target,
    );

    expect(Math.abs(result.anchor?.rotationZ ?? 0)).toBeLessThanOrEqual(0.22);
  });
});

describe("smoothCubeTransform", () => {
  const current: CubeTransform = {
    rotationZ: 0,
    screenSize: 0.3,
    x: 0.5,
    y: 0.5,
  };

  it("ignores tiny changes inside the configured dead zones", () => {
    const result = smoothCubeTransform(
      current,
      {
        rotationZ: 0.004,
        screenSize: 0.303,
        x: 0.502,
        y: 0.498,
      },
      16,
    );

    expect(result).toEqual(current);
  });

  it("moves toward a deliberate target without jumping there in one frame", () => {
    const result = smoothCubeTransform(
      current,
      { rotationZ: 0.2, screenSize: 0.42, x: 0.8, y: 0.3 },
      16,
    );

    expect(result.x).toBeGreaterThan(current.x);
    expect(result.x).toBeLessThan(0.8);
    expect(result.screenSize).toBeGreaterThan(current.screenSize);
    expect(result.screenSize).toBeLessThan(0.42);
  });
});

describe("getCubePlacementPhase", () => {
  const anchor: CubeTransform = {
    rotationZ: 0,
    screenSize: 0.3,
    x: 0.5,
    y: 0.5,
  };

  it("anchors immediately and briefly holds the last stable pose after loss", () => {
    expect(getCubePlacementPhase(anchor, null, null, 1_000)).toBe(
      "anchored",
    );
    expect(
      getCubePlacementPhase(
        null,
        "not-enough-hands",
        1_000,
        1_000 + TRACKING_HOLD_DURATION_MS,
      ),
    ).toBe("holding");
  });

  it("returns to waiting after sustained loss and exposes low confidence", () => {
    const afterHold = 1_000 + TRACKING_HOLD_DURATION_MS + 1;

    expect(
      getCubePlacementPhase(null, "not-enough-hands", 1_000, afterHold),
    ).toBe("waiting");
    expect(
      getCubePlacementPhase(null, "low-confidence", 1_000, afterHold),
    ).toBe("low-confidence");
  });
});

function createFrame(...hands: TrackedHand[]): TrackingFrame {
  return { hands, timestampMs: 1_000 };
}

function createHand(
  x: number,
  y: number,
  confidence = 0.95,
): TrackedHand {
  const landmarks: TrackingLandmark[] = Array.from({ length: 21 }, () => ({
    visibility: 1,
    x,
    y,
    z: 0,
  }));

  return {
    confidence,
    handedness: "unknown",
    landmarks,
  };
}
