"use client";

import { useRef } from "react";

import { useCamera, type CameraStatus } from "../features/camera/use-camera";
import { useHandTracking } from "../features/tracking/use-hand-tracking";
import { getTrackingPresentation } from "../features/tracking/tracking-utils";
import { CameraPreview } from "./camera-preview";
import { CubeStage } from "./cube-stage";

const STATUS_COPY: Record<CameraStatus, { label: string; detail: string }> = {
  idle: {
    label: "Camera off",
    detail: "The 3D lab remains available until you choose to start the camera.",
  },
  requesting: {
    label: "Waiting for permission",
    detail: "Use the browser prompt to allow or block camera access.",
  },
  active: {
    label: "Camera active",
    detail: "Your mirrored preview is live only in this browser tab.",
  },
  denied: {
    label: "Permission denied",
    detail: "Camera access needs your approval before a preview can start.",
  },
  unavailable: {
    label: "Camera unavailable",
    detail: "This browser cannot currently provide a camera stream.",
  },
  error: {
    label: "Camera error",
    detail: "The camera did not start successfully.",
  },
};

export function CameraExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { message, startCamera, status, stopCamera, stream } = useCamera();
  const isActive = status === "active" && stream !== null;
  const copy = STATUS_COPY[status];
  const tracking = useHandTracking({
    canvasRef,
    enabled: isActive,
    videoRef,
  });
  const trackingCopy = getTrackingPresentation(
    tracking.status,
    tracking.handCount,
    tracking.hasSeenHands,
  );
  const statusModifier = isActive ? tracking.status : status;

  return (
    <div
      className="experience"
      data-camera-status={status}
      data-hand-count={tracking.handCount}
      data-tracking-status={tracking.status}
    >
      {isActive ? (
        <CameraPreview
          canvasRef={canvasRef}
          stream={stream}
          videoRef={videoRef}
        />
      ) : (
        <CubeStage showHud={false} />
      )}

      <header className="experience__header">
        <strong>M2 · Two-hand tracking</strong>
        <span>Raise one or two open hands inside the camera frame</span>
      </header>

      {isActive ? (
        <div className="camera-active-indicator" aria-label="Camera active">
          <span aria-hidden="true" />
          Camera active
        </div>
      ) : null}

      <section className="camera-panel" aria-labelledby="camera-panel-title">
        <p className="camera-panel__eyebrow">Hand tracking lab</p>
        <h1 id="camera-panel-title">Show the app your hands</h1>
        <p className="camera-panel__explanation">
          Start the camera, then raise one or two open hands. The colored dots and
          lines show exactly what the browser can detect before we attach the cube
          in M3.
        </p>
        <p className="camera-panel__privacy">
          Video and hand landmarks stay on this device. They are not uploaded,
          recorded, or saved, and microphone access is never requested. MediaPipe
          may send Google operational usage metrics, but not camera frames or
          landmarks.
        </p>

        <div className="camera-status" role="status" aria-live="polite">
          <span
            className={`camera-status__dot camera-status__dot--${statusModifier}`}
            aria-hidden="true"
          />
          <span>
            <strong>{isActive ? trackingCopy.label : copy.label}</strong>
            <span>
              {isActive
                ? tracking.message ?? trackingCopy.detail
                : message ?? copy.detail}
            </span>
          </span>
        </div>

        {isActive ? (
          <div className="camera-panel__actions">
            {tracking.status === "error" ? (
              <button
                className="camera-button camera-button--secondary"
                onClick={tracking.retryTracking}
              >
                Retry hand tracking
              </button>
            ) : null}
            <button
              className="camera-button camera-button--stop"
              onClick={stopCamera}
            >
              Stop camera
            </button>
          </div>
        ) : (
          <button
            className="camera-button"
            disabled={status === "requesting"}
            onClick={startCamera}
          >
            {status === "requesting"
              ? "Waiting for permission…"
              : status === "idle"
                ? "Start camera"
                : "Try camera again"}
          </button>
        )}
      </section>
    </div>
  );
}
