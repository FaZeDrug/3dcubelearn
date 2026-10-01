"use client";

import { useEffect, useRef } from "react";

type CameraPreviewProps = {
  stream: MediaStream;
};

export function CameraPreview({ stream }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, [stream]);

  return (
    <div className="camera-preview">
      <video
        ref={videoRef}
        aria-label="Mirrored live camera preview"
        autoPlay
        className="camera-preview__video"
        muted
        playsInline
      />
    </div>
  );
}
