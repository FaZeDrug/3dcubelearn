import { describe, expect, it } from "vitest";

import { createCubiePositions } from "./cubie-positions";

describe("createCubiePositions", () => {
  it("creates 27 unique positions", () => {
    const positions = createCubiePositions();
    const uniquePositions = new Set(
      positions.map((position) => position.join(",")),
    );

    expect(positions).toHaveLength(27);
    expect(uniquePositions.size).toBe(27);
    expect(positions).toContainEqual([0, 0, 0]);
  });
});