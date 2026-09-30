export type CubiePosition = [number, number, number];

const coordinates = [-1, 0, 1] as const;

export function createCubiePositions(): CubiePosition[] {
  const positions: CubiePosition[] = [];

  for (const x of coordinates) {
    for (const y of coordinates) {
      for (const z of coordinates) {
        positions.push([x, y, z]);
      }
    }
  }

  return positions;
}