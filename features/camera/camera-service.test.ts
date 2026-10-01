import { describe, expect, it, vi } from "vitest";

import {
  CAMERA_CONSTRAINTS,
  CameraUnavailableError,
  getCameraFailure,
  requestCameraStream,
  stopCameraStream,
} from "./camera-service";

describe("camera service", () => {
  it("requests video without audio", async () => {
    const stream = {} as MediaStream;
    const getUserMedia = vi.fn().mockResolvedValue(stream);

    await expect(requestCameraStream({ getUserMedia })).resolves.toBe(stream);
    expect(getUserMedia).toHaveBeenCalledOnce();
    expect(getUserMedia).toHaveBeenCalledWith(CAMERA_CONSTRAINTS);
    expect(CAMERA_CONSTRAINTS).toEqual({
      audio: false,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 16 / 9 },
        frameRate: { ideal: 30 },
        facingMode: { ideal: "user" },
      },
    });
  });

  it("stops every track in a stream", () => {
    const firstTrack = { stop: vi.fn() };
    const secondTrack = { stop: vi.fn() };
    const stream = {
      getTracks: () => [firstTrack, secondTrack],
    } as unknown as MediaStream;

    stopCameraStream(stream);

    expect(firstTrack.stop).toHaveBeenCalledOnce();
    expect(secondTrack.stop).toHaveBeenCalledOnce();
  });

  it.each([
    ["NotAllowedError", "denied", "browser settings"],
    ["SecurityError", "denied", "browser settings"],
    ["NotFoundError", "unavailable", "No camera was found"],
    ["DevicesNotFoundError", "unavailable", "No camera was found"],
    ["NotReadableError", "error", "Close other apps"],
    ["TrackStartError", "error", "Close other apps"],
  ] as const)(
    "maps %s to an actionable %s state",
    (name, expectedStatus, expectedGuidance) => {
      expect(getCameraFailure({ name })).toMatchObject({
        message: expect.stringContaining(expectedGuidance),
        status: expectedStatus,
      });
    },
  );

  it("rejects with unavailable when the browser camera API is missing", async () => {
    await expect(requestCameraStream(undefined)).rejects.toBeInstanceOf(
      CameraUnavailableError,
    );
  });

  it("treats a missing browser camera API as unavailable", () => {
    expect(getCameraFailure(new CameraUnavailableError())).toMatchObject({
      status: "unavailable",
    });
  });

  it("uses a recoverable fallback for an unknown error", () => {
    expect(getCameraFailure(new Error("unexpected"))).toMatchObject({
      status: "error",
    });
  });
});
