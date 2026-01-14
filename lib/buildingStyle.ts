import { BuildingType } from "./cityTypes";

export type BuildingStyle = {
  roof: number; // Índice do estilo de telhado (0-2)
  windows: number; // Índice do padrão de janelas (0-2)
  accentColorIndex: number; // Índice da cor secundária (0-3)
  styleSeed: number; // Seed determinístico para referência
};

/**
 * Resolve o estilo visual (micro-variações) de uma construção baseado no tipo e variante.
 * Todas as variações são determinísticas (nada aleatório).
 */
export function resolveStyle(type: BuildingType, variant: number): BuildingStyle {
  // Usar variant como base para gerar styleSeed determinístico
  const styleSeed = simpleHash(`${type}-${variant}`);
  
  // Determinar variações baseadas no styleSeed
  const roof = styleSeed % 3; // 0, 1 ou 2 (3 formas de telhado)
  const windows = Math.floor(styleSeed / 3) % 3; // 0, 1 ou 2 (3 padrões de janela)
  const accentColorIndex = Math.floor(styleSeed / 9) % 4; // 0, 1, 2 ou 3 (4 cores)
  
  return {
    roof,
    windows,
    accentColorIndex,
    styleSeed,
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
