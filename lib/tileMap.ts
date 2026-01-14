import { BuildingType } from "./cityTypes";

type Neighbors = {
  north?: boolean;
  south?: boolean;
  east?: boolean;
  west?: boolean;
};

export function getTileSrc(
  buildingType: BuildingType | "empty",
  stage: number = 1,
  neighbors?: Neighbors
): string {
  const basePath = "/tiles";

  if (buildingType === "empty") {
    return `${basePath}/empty/tile.svg`;
  }

  if (buildingType === "road") {
    // Determinar tipo de road baseado em vizinhos
    const hasNorth = neighbors?.north ?? false;
    const hasSouth = neighbors?.south ?? false;
    const hasEast = neighbors?.east ?? false;
    const hasWest = neighbors?.west ?? false;

    const connections = [hasNorth, hasSouth, hasEast, hasWest].filter(Boolean).length;

    if (connections >= 3 || (hasNorth && hasSouth && hasEast && hasWest)) {
      return `${basePath}/road/cross.svg`;
    } else if (
      (hasNorth && hasSouth) ||
      (hasEast && hasWest) ||
      connections === 0
    ) {
      return `${basePath}/road/straight.svg`;
    } else {
      return `${basePath}/road/curve.svg`;
    }
  }

  if (buildingType === "park") {
    const parkStage = Math.min(stage, 2);
    return `${basePath}/par/stage${parkStage}.svg`;
  }

  if (buildingType === "home") {
    const homeStage = Math.min(stage, 3);
    return `${basePath}/home/stage${homeStage}.svg`;
  }

  // Para residential, commercial, industrial
  const stageFile = Math.min(Math.max(stage, 1), 4);
  const typeMap: Record<string, string> = {
    residential: "res",
    commercial: "com",
    industrial: "ind",
  };

  const folder = typeMap[buildingType] || "res";
  return `${basePath}/${folder}/stage${stageFile}.svg`;
}
