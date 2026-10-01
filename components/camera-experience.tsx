"use client";

import { useRef, useState } from "react";

import { useCamera, type CameraStatus } from "../features/camera/use-camera";
import type { CubePlacementPhase } from "../features/cube-placement/cube-placement";
import type {
  HandCount,
  TrackingStatus,
} from "../features/tracking/tracking-types";
import { useHandTracking } from "../features/tracking/use-hand-tracking";
import {
  getTrackingPresentation,
  type TrackingPresentation,
} from "../features/tracking/tracking-utils";
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
  const [placementPhase, setPlacementPhase] =
    useState<CubePlacementPhase>("waiting");
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
  const activeCopy = getM3Presentation(
    trackingCopy,
    tracking.status,
    tracking.handCount,
    placementPhase,
  );
  const statusModifier = isActive ? tracking.status : status;

  return (
    <div
      className="experience"
      data-camera-status={status}
      data-hand-count={tracking.handCount}
      data-placement-phase={placementPhase}
      data-tracking-status={tracking.status}
    >
      {isActive ? (
        <CameraPreview
          canvasRef={canvasRef}
          latestFrameRef={tracking.latestFrameRef}
          onPlacementPhaseChange={setPlacementPhase}
          stream={stream}
          videoRef={videoRef}
        />
      ) : (
        <CubeStage showHud={false} />
      )}

      <header className="experience__header">
        <strong>M3 · Cube in my hands</strong>
        <span>Hold two open hands with space between your palms</span>
      </header>

      {isActive ? (
        <div className="camera-active-indicator" aria-label="Camera active">
          <span aria-hidden="true" />
          Camera active
        </div>
      ) : null}

      <section className="camera-panel" aria-labelledby="camera-panel-title">
        <p className="camera-panel__eyebrow">Two-hand placement lab</p>
        <h1 id="camera-panel-title">Hold the virtual cube</h1>
        <p className="camera-panel__explanation">
          Start the camera, then raise two open hands with a clear gap between
          them. A solved cube will use the midpoint and distance between your
          palms to follow your movement.
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
            <strong>{isActive ? activeCopy.label : copy.label}</strong>
            <span>
              {isActive
                ? tracking.message ?? activeCopy.detail
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

function getM3Presentation(
  trackingCopy: TrackingPresentation,
  trackingStatus: TrackingStatus,
  handCount: HandCount,
  placementPhase: CubePlacementPhase,
): TrackingPresentation {
  if (trackingStatus !== "ready" || handCount < 2) {
    return trackingCopy;
  }

  if (placementPhase === "anchored") {
    return {
      label: "Cube anchored",
      detail: "Move both hands together, then change the gap to test its scale.",
    };
  }

  if (placementPhase === "holding") {
    return {
      label: "Holding the last stable pose",
      detail:
        "Tracking flickered, so the cube is briefly frozen instead of jumping.",
    };
  }

  if (placementPhase === "low-confidence") {
    return {
      label: "Hold both hands steady",
      detail: "Keep both palms open, separated, and fully inside the frame.",
    };
  }

  return {
    label: "Finding a stable two-hand hold",
    detail: "Keep both palms visible with a clear gap between them.",
  };
}
