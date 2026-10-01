"use client";

import { useCamera, type CameraStatus } from "../features/camera/use-camera";
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
  const { message, startCamera, status, stopCamera, stream } = useCamera();
  const isActive = status === "active" && stream !== null;
  const copy = STATUS_COPY[status];

  return (
    <div className="experience" data-camera-status={status}>
      {isActive ? <CameraPreview stream={stream} /> : <CubeStage showHud={false} />}

      <header className="experience__header">
        <strong>M1 · Camera lifecycle</strong>
        <span>Camera stays off until you start it</span>
      </header>

      {isActive ? (
        <div className="camera-active-indicator" aria-label="Camera active">
          <span aria-hidden="true" />
          Camera active
        </div>
      ) : null}

      <section className="camera-panel" aria-labelledby="camera-panel-title">
        <p className="camera-panel__eyebrow">Camera setup</p>
        <h1 id="camera-panel-title">Put the cube in your hands</h1>
        <p className="camera-panel__explanation">
          Later milestones will use your webcam to find your hands and position the
          virtual cube. For now, this step proves that you control when the camera
          starts and stops.
        </p>
        <p className="camera-panel__privacy">
          Video stays in this browser. It is not uploaded, recorded, or saved, and
          microphone access is never requested.
        </p>

        <div className="camera-status" role="status" aria-live="polite">
          <span
            className={`camera-status__dot camera-status__dot--${status}`}
            aria-hidden="true"
          />
          <span>
            <strong>{copy.label}</strong>
            <span>{message ?? copy.detail}</span>
          </span>
        </div>

        {isActive ? (
          <button className="camera-button camera-button--stop" onClick={stopCamera}>
            Stop camera
          </button>
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
