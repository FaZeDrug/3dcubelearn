export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: { ideal: 16 / 9 },
    frameRate: { ideal: 30 },
    facingMode: { ideal: "user" },
  },
};

type CameraMediaDevices = Pick<MediaDevices, "getUserMedia">;

export type CameraFailureStatus = "denied" | "unavailable" | "error";

export type CameraFailure = {
  status: CameraFailureStatus;
  message: string;
};

export class CameraUnavailableError extends Error {
  constructor() {
    super("This browser does not expose the camera API.");
    this.name = "CameraUnavailableError";
  }
}

export async function requestCameraStream(
  mediaDevices: CameraMediaDevices | undefined =
    typeof navigator === "undefined" ? undefined : navigator.mediaDevices,
): Promise<MediaStream> {
  if (!mediaDevices?.getUserMedia) {
    throw new CameraUnavailableError();
  }

  return mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
}

export function stopCameraStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

export function getCameraFailure(error: unknown): CameraFailure {
  const errorName = getErrorName(error);

  if (error instanceof CameraUnavailableError) {
    return {
      status: "unavailable",
      message:
        "Camera access is not available in this browser. Try a current browser on a secure connection.",
    };
  }

  if (errorName === "NotAllowedError" || errorName === "SecurityError") {
    return {
      status: "denied",
      message:
        "Camera access was denied. Allow camera access in your browser settings, then try again.",
    };
  }

  if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
    return {
      status: "unavailable",
      message:
        "No camera was found. Connect or enable a camera, then try again.",
    };
  }

  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return {
      status: "error",
      message:
        "The camera could not start. Close other apps using it, then try again.",
    };
  }

  return {
    status: "error",
    message:
      "Something went wrong while starting the camera. Check your browser permissions and try again.",
  };
}

function getErrorName(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  return undefined;
}
