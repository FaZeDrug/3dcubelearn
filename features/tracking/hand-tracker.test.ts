import { describe, expect, it } from "vitest";

import { mapHandLandmarkerResult } from "./hand-tracker";

const createLandmarks = (xOffset: number) =>
  Array.from({ length: 21 }, (_, index) => ({
    x: xOffset + index / 100,
    y: index / 50,
    z: index === 0 ? 0 : -index / 1000,
  }));

describe("mapHandLandmarkerResult", () => {
  it("converts MediaPipe output into the application-owned hand shape", () => {
    const frame = mapHandLandmarkerResult(
      {
        handedness: [
          [
            {
              categoryName: "Left",
              score: 0.92,
            },
          ],
        ],
        landmarks: [createLandmarks(0.1)],
      },
      1234,
    );

    expect(frame.timestampMs).toBe(1234);
    expect(frame.hands).toHaveLength(1);
    expect(frame.hands[0]).toMatchObject({
      confidence: 0.92,
      handedness: "left",
    });
    expect(frame.hands[0]?.landmarks).toHaveLength(21);
    expect(frame.hands[0]?.landmarks[0]).toEqual({
      visibility: 1,
      x: 0.1,
      y: 0,
      z: 0,
    });
  });

  it("caps output at two hands and safely maps missing categories", () => {
    const frame = mapHandLandmarkerResult(
      {
        handedness: [[{ categoryName: "Right", score: 3 }]],
        landmarks: [
          createLandmarks(0),
          createLandmarks(0.2),
          createLandmarks(0.4),
        ],
      },
      500,
    );

    expect(frame.hands).toHaveLength(2);
    expect(frame.hands[0]).toMatchObject({
      confidence: 1,
      handedness: "right",
    });
    expect(frame.hands[1]).toMatchObject({
      confidence: 0,
      handedness: "unknown",
    });
  });
});
