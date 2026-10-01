import type { TrackingFrame } from "./tracking-types";
import {
  HAND_CONNECTIONS,
  mapLandmarkToCoverCanvas,
  type CanvasPoint,
} from "./tracking-utils";

const HAND_COLORS = ["#6de5ff", "#ffb86b"] as const;

export function clearHandLandmarks(canvas: HTMLCanvasElement | null): void {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawHandLandmarks(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  frame: TrackingFrame,
): void {
  const bounds = canvas.getBoundingClientRect();

  if (
    bounds.width <= 0 ||
    bounds.height <= 0 ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {
    clearHandLandmarks(canvas);
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(bounds.width * pixelRatio);
  const pixelHeight = Math.round(bounds.height * pixelRatio);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  frame.hands.forEach((hand, handIndex) => {
    const color = HAND_COLORS[handIndex % HAND_COLORS.length];
    const points = hand.landmarks.map((landmark) =>
      mapLandmarkToCoverCanvas(
        landmark,
        { height: video.videoHeight, width: video.videoWidth },
        { height: bounds.height, width: bounds.width },
      ),
    );

    drawConnections(context, points, color);
    drawPoints(context, points, color);
  });
}

function drawConnections(
  context: CanvasRenderingContext2D,
  points: CanvasPoint[],
  color: string,
): void {
  context.strokeStyle = color;
  context.lineWidth = 3;
  context.shadowBlur = 6;
  context.shadowColor = "rgb(0 0 0 / 55%)";
  context.beginPath();

  HAND_CONNECTIONS.forEach(([fromIndex, toIndex]) => {
    const from = points[fromIndex];
    const to = points[toIndex];

    if (!from || !to) {
      return;
    }

    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
  });

  context.stroke();
  context.shadowBlur = 0;
}

function drawPoints(
  context: CanvasRenderingContext2D,
  points: CanvasPoint[],
  color: string,
): void {
  points.forEach((point, index) => {
    context.beginPath();
    context.arc(point.x, point.y, index === 0 ? 5 : 3.5, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 1.5;
    context.strokeStyle = "#101216";
    context.stroke();
  });
}
