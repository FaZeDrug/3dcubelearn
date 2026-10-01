"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import {
  createHandTracker,
  HandTrackingUnsupportedError,
} from "./hand-tracker";
import {
  clearHandLandmarks,
  drawHandLandmarks,
} from "./draw-hand-landmarks";
import type {
  HandCount,
  HandTracker,
  TrackingStatus,
} from "./tracking-types";
import { getHandCount } from "./tracking-utils";

const MAX_INFERENCE_RATE = 30;
const MIN_INFERENCE_INTERVAL_MS = 1_000 / MAX_INFERENCE_RATE;

type UseHandTrackingOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function useHandTracking({
  canvasRef,
  enabled,
  videoRef,
}: UseHandTrackingOptions) {
  const [handCount, setHandCount] = useState<HandCount>(0);
  const [hasSeenHands, setHasSeenHands] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const lastHandCountRef = useRef<HandCount>(0);
  const hasSeenHandsRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!enabled) {
      clearHandLandmarks(canvas);
      lastHandCountRef.current = 0;
      hasSeenHandsRef.current = false;
      return;
    }

    let animationFrameId: number | null = null;
    let cancelled = false;
    let failed = false;
    let handTracker: HandTracker | null = null;
    let lastInferenceStartedAt = -Infinity;
    let lastVideoTime = -1;

    const stopTracker = () => {
      handTracker?.close();
      handTracker = null;
    };

    const failTracking = (error: unknown) => {
      failed = true;
      clearHandLandmarks(canvasRef.current);
      lastHandCountRef.current = 0;
      setHandCount(0);

      if (error instanceof HandTrackingUnsupportedError) {
        setMessage(
          "Hand tracking needs a current browser with WebAssembly support.",
        );
        setStatus("unsupported");
      } else {
        setMessage(
          "The hand model could not continue. Check your connection and try loading it again.",
        );
        setStatus("error");
      }

      stopTracker();
    };

    const runFrame = () => {
      if (cancelled || failed || !handTracker) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(runFrame);
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (
        !video ||
        !canvas ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth === 0 ||
        video.videoHeight === 0 ||
        video.currentTime === lastVideoTime
      ) {
        return;
      }

      const now = performance.now();

      if (now - lastInferenceStartedAt < MIN_INFERENCE_INTERVAL_MS) {
        return;
      }

      lastInferenceStartedAt = now;
      lastVideoTime = video.currentTime;

      try {
        const frame = handTracker.detect(video, now);
        const nextHandCount = getHandCount(frame.hands.length);
        drawHandLandmarks(canvas, video, frame);

        if (nextHandCount > 0 && !hasSeenHandsRef.current) {
          hasSeenHandsRef.current = true;
          setHasSeenHands(true);
        }

        if (nextHandCount !== lastHandCountRef.current) {
          lastHandCountRef.current = nextHandCount;
          setHandCount(nextHandCount);
        }
      } catch (error) {
        failTracking(error);
      }
    };

    const startTracking = async () => {
      await Promise.resolve();

      if (cancelled) {
        return;
      }

      lastHandCountRef.current = 0;
      hasSeenHandsRef.current = false;
      setHandCount(0);
      setHasSeenHands(false);
      setMessage(null);
      setStatus("loading");
      clearHandLandmarks(canvas);

      try {
        const tracker = await createHandTracker();

        if (cancelled) {
          tracker.close();
          return;
        }

        handTracker = tracker;
        setStatus("ready");
        animationFrameId = window.requestAnimationFrame(runFrame);
      } catch (error) {
        if (!cancelled) {
          failTracking(error);
        }
      }
    };

    void startTracking();

    return () => {
      cancelled = true;

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      stopTracker();
      clearHandLandmarks(canvas);
    };
  }, [canvasRef, enabled, retryToken, videoRef]);

  const retryTracking = useCallback(() => {
    setRetryToken((currentToken) => currentToken + 1);
  }, []);

  return {
    handCount: enabled ? handCount : 0,
    hasSeenHands: enabled ? hasSeenHands : false,
    message: enabled ? message : null,
    retryTracking,
    status: enabled ? status : "idle",
  };
}
