import type { ThreeElements } from "@react-three/fiber";

import {
  createCubiePositions,
  type CubiePosition,
} from "../lib/cube/cubie-positions";

const cubiePositions = createCubiePositions();
const internalColor = "#111214";

function getFaceColors([x, y, z]: CubiePosition): string[] {
  return [
    x === 1 ? "#b71234" : internalColor,
    x === -1 ? "#ff5800" : internalColor,
    y === 1 ? "#f7f7f7" : internalColor,
    y === -1 ? "#ffd500" : internalColor,
    z === 1 ? "#009b48" : internalColor,
    z === -1 ? "#0046ad" : internalColor,
  ];
}

function Cubie({ position }: { position: CubiePosition }) {
  const [x, y, z] = position;
  const renderedPosition: CubiePosition = [
    x * 1.02,
    y * 1.02,
    z * 1.02,
  ];

  return (
    <mesh position={renderedPosition} castShadow receiveShadow>
      <boxGeometry args={[0.96, 0.96, 0.96]} />

      {getFaceColors(position).map((color, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index}`}
          color={color}
          metalness={0.05}
          roughness={0.55}
        />
      ))}
    </mesh>
  );
}

export function RubiksCube(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {cubiePositions.map((position) => (
        <Cubie key={position.join(",")} position={position} />
      ))}
    </group>
  );
}