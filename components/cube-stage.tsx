"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { RubiksCube } from "./rubiks-cube";

export function CubeStage() {
  return (
    <div className="stage">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [6, 5, 7],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        fallback={
          <div className="stage__fallback">
            WebGL is unavailable in this browser.
          </div>
        }
      >
        <color attach="background" args={["#0c0d10"]} />

        <ambientLight intensity={1.2} />
        <directionalLight
          castShadow
          intensity={3}
          position={[5, 8, 6]}
        />

        <RubiksCube rotation={[-0.2, 0.45, 0]} />

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={5}
          maxDistance={14}
        />
      </Canvas>

      <div className="stage__hud">
        <strong>M0 · Functional 3D lab</strong>
        <span>Drag to orbit · Scroll to zoom</span>
      </div>
    </div>
  );
}