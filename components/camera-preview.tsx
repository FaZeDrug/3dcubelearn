"use client";

import { useEffect, type RefObject } from "react";

type CameraPreviewProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  stream: MediaStream;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function CameraPreview({
  canvasRef,
  stream,
  videoRef,
}: CameraPreviewProps) {
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.srcObject = stream;

    return () => {
      if (video.srcObject === stream) {
        video.srcObject = null;
      }
    };
  }, [stream, videoRef]);

  return (
    <div className="camera-preview">
      <div className="camera-preview__frame">
        <video
          ref={videoRef}
          aria-label="Mirrored live camera preview"
          autoPlay
          className="camera-preview__video"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="camera-preview__landmarks"
        />
      </div>
    </div>
  );
}
