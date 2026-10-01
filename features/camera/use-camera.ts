"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getCameraFailure,
  requestCameraStream,
  stopCameraStream,
  type CameraFailureStatus,
} from "./camera-service";

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | CameraFailureStatus;

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const requestPendingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      requestPendingRef.current = false;
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  const startCamera = useCallback(async () => {
    if (requestPendingRef.current || streamRef.current) {
      return;
    }

    requestPendingRef.current = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setMessage(null);
    setStatus("requesting");

    try {
      const stream = await requestCameraStream();

      if (!mountedRef.current || requestId !== requestIdRef.current) {
        stopCameraStream(stream);
        return;
      }

      streamRef.current = stream;
      setStream(stream);
      setStatus("active");
    } catch (error) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      const failure = getCameraFailure(error);
      setMessage(failure.message);
      setStatus(failure.status);
    } finally {
      if (requestId === requestIdRef.current) {
        requestPendingRef.current = false;
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;
    requestPendingRef.current = false;
    stopCameraStream(streamRef.current);
    streamRef.current = null;

    if (mountedRef.current) {
      setStream(null);
      setMessage(null);
      setStatus("idle");
    }
  }, []);

  return {
    message,
    startCamera,
    status,
    stopCamera,
    stream,
  };
}
