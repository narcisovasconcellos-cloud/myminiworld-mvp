import { BuildingType } from "./cityTypes";

/**
 * Resolve o sprite visual baseado no tipo, nível e variante da construção.
 * Separa os dados (level/variant) do visual (sprite path).
 */
export function resolveVisual(
  type: BuildingType | "empty",
  level: number,
  variant: number = 0
): string {
  // Clamp level entre 1 e 3
  const clampedLevel = Math.min(Math.max(level, 1), 3);
  
  if (type === "empty") {
    return "/tiles/empty.svg";
  }

  // Mapear tipos para nomes de arquivo base
  const typeMap: Record<string, string> = {
    residential: "res",
    commercial: "com",
    park: "par",
    road: "road",
    home: "home",
  };
  
  const baseName = typeMap[type] || "empty";
  
  // Mapear level (1-3) para stage (1-4) para compatibilidade com sprites existentes
  // Level 1 -> Stage 1 (fundação)
  // Level 2 -> Stage 2-3 (em construção)
  // Level 3 -> Stage 4 (completo)
  const stageMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 4,
  };
  
  const stage = stageMap[clampedLevel] || 1;
  
  // Por enquanto usar formato existente
  // Futuro: pode usar variant: `${baseName}_${clampedLevel}_${variant}.svg`
  return `/tiles/${baseName}_${stage}.svg`;
}

/**
 * Retorna o número máximo de variantes para um tipo de construção
 */
export function getMaxVariants(type: BuildingType): number {
  const variantCounts: Record<BuildingType, number> = {
    home: 1,
    residential: 3,
    commercial: 3,
    park: 2,
    road: 1,
  };
  return variantCounts[type] || 1;
}
