import { BuildingType } from "./cityTypes";

/**
 * Retorna o nível máximo permitido para um tipo de construção.
 */
export function getMaxLevelForType(type: BuildingType): number {
  const maxLevels: Record<BuildingType, number> = {
    home: 3,
    residential: 3,
    commercial: 4,
    park: 2,
    road: 2,
  };
  return maxLevels[type] || 3;
}
