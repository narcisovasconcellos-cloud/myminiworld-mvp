import { Building, BuildingType } from "./cityTypes";
import { getMaxVariants } from "./buildingVisuals";

/**
 * Calcula a variante determinística para um building baseado em x, y, tipo.
 * Variante é sempre a mesma para a mesma posição e tipo (hash determinístico).
 */
export function calculateVariant(x: number, y: number, type: BuildingType): number {
  const hash = simpleHash(`${x},${y},${type}`);
  const maxVariants = getMaxVariants(type);
  return hash % maxVariants;
}

/**
 * Faz upgrade de um building (incrementa level até máximo de 3).
 */
export function upgradeBuilding(building: Building, reason?: string): Building {
  if (building.level >= 3) {
    return building; // Já está no nível máximo
  }
  
  return {
    ...building,
    level: building.level + 1,
    // Atualizar stage para compatibilidade (level 1->stage1, 2->stage2, 3->stage4)
    stage: building.level + 1 === 3 ? 4 : building.level + 1,
  };
}

/**
 * Aplica upgrades em todos os buildings que devem evoluir baseado em ticks/visits.
 * Regra simples: a cada X visitas totais, upgrade 1 level para o building mais antigo que ainda não está no nível máximo.
 */
export function evolveBuildings(
  buildings: Record<string, Building>,
  totalVisits: number,
  visitsPerUpgrade: number = 3
): Record<string, Building> {
  const nextBuildings = { ...buildings };
  
  // Calcular quantos upgrades totais devem acontecer (1 upgrade a cada X visitas)
  const totalUpgrades = Math.floor(totalVisits / visitsPerUpgrade);
  
  // Ordenar buildings por createdAtVisit (mais antigos primeiro)
  const sortedBuildings = Object.values(buildings).sort(
    (a, b) => a.createdAtVisit - b.createdAtVisit
  );
  
  // Para cada building, calcular o level desejado baseado em quantos upgrades ele deveria ter recebido
  // Distribuir upgrades sequencialmente entre os buildings
  let upgradesUsed = 0;
  for (const building of sortedBuildings) {
    if (upgradesUsed >= totalUpgrades) break;
    
    const upgradesForThisBuilding = Math.min(3 - building.level, totalUpgrades - upgradesUsed);
    if (upgradesForThisBuilding > 0) {
      const newLevel = building.level + upgradesForThisBuilding;
      nextBuildings[building.id] = {
        ...building,
        level: newLevel,
        stage: newLevel === 3 ? 4 : newLevel, // Mapear level 3 para stage 4
      };
      upgradesUsed += upgradesForThisBuilding;
    }
  }
  
  return nextBuildings;
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
