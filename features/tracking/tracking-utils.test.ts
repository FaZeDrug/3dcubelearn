import { describe, expect, it } from "vitest";

import {
  getHandCount,
  getTrackingPresentation,
  mapLandmarkToCoverCanvas,
} from "./tracking-utils";

describe("getHandCount", () => {
  it("reports only the supported zero, one, or two-hand states", () => {
    expect(getHandCount(0)).toBe(0);
    expect(getHandCount(1)).toBe(1);
    expect(getHandCount(2)).toBe(2);
    expect(getHandCount(4)).toBe(2);
  });
});

describe("mapLandmarkToCoverCanvas", () => {
  it("mirrors normalized x coordinates into an equally shaped preview", () => {
    expect(
      mapLandmarkToCoverCanvas(
        { x: 0.25, y: 0.5 },
        { width: 1920, height: 1080 },
        { width: 960, height: 540 },
      ),
    ).toEqual({ x: 720, y: 270 });
  });

  it("accounts for object-fit cover cropping", () => {
    expect(
      mapLandmarkToCoverCanvas(
        { x: 0.5, y: 0.25 },
        { width: 640, height: 480 },
        { width: 1600, height: 900 },
      ),
    ).toEqual({ x: 800, y: 150 });
  });
});

describe("getTrackingPresentation", () => {
  it("reports loading, zero, one, and two-hand states", () => {
    expect(getTrackingPresentation("loading", 0, false).label).toBe(
      "Loading hand tracking",
    );
    expect(getTrackingPresentation("ready", 0, false).label).toBe(
      "0 hands detected",
    );
    expect(getTrackingPresentation("ready", 1, true).label).toBe(
      "1 hand detected",
    );
    expect(getTrackingPresentation("ready", 2, true).label).toBe(
      "2 hands detected",
    );
  });

  it("distinguishes initial zero hands from lost tracking", () => {
    expect(getTrackingPresentation("ready", 0, true).label).toBe(
      "Tracking lost · 0 hands",
    );
  });

  it("provides visible unsupported and error states", () => {
    expect(getTrackingPresentation("unsupported", 0, false).label).toBe(
      "Hand tracking unavailable",
    );
    expect(getTrackingPresentation("error", 0, false).label).toBe(
      "Hand tracking error",
    );
  });
});
