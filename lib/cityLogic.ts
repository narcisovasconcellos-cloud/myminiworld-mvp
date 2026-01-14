import { Building, BuildingType, CityState } from "./cityTypes";
import { calculateVariant } from "./buildingUpgrade";
import { evolveBuildings } from "./buildingUpgrade";

export function createInitialCity(slug: string, name?: string): CityState {
  const seed = slug || "minha-cidade";
  const cityName = name || slug || "Minha Cidade";
  
  const homeId = `${seed}-home-0`;
  const home: Building = {
    id: homeId,
    x: 0,
    y: 0,
    type: "home",
    stage: 1,
    level: 1,
    variant: calculateVariant(0, 0, "home"),
    createdAtVisit: 0,
  };

  return {
    buildings: {
      [homeId]: home,
    },
    visits: 0,
    population: 1,
    seed,
    name: cityName,
    createdAt: Date.now(),
    slug,
  };
}

export function applyVisit(city: CityState, n: number = 1): CityState {
  let currentCity = { ...city };
  
  for (let i = 0; i < n; i++) {
    currentCity = applySingleVisit(currentCity);
  }
  
  return currentCity;
}

function applySingleVisit(city: CityState): CityState {
  const nextVisits = city.visits + 1;
  const nextCity: CityState = {
    ...city,
    visits: nextVisits,
    population: city.population + 1,
    buildings: { ...city.buildings },
  };

  // Regras de spawn
  if (nextVisits === 3) {
    spawnBuilding(nextCity, "residential", nextVisits);
  } else if (nextVisits === 6) {
    spawnBuilding(nextCity, "road", nextVisits);
  } else if (nextVisits === 10) {
    spawnBuilding(nextCity, "commercial", nextVisits);
  } else if (nextVisits > 10 && (nextVisits - 10) % 5 === 0) {
    // Alternar residential/commercial/park
    const types: BuildingType[] = ["residential", "commercial", "park"];
    const typeIndex = Math.floor((nextVisits - 10) / 5) % types.length;
    spawnBuilding(nextCity, types[typeIndex], nextVisits);
  }

  // Evolução: usar sistema de level (1-3) baseado em visitas
  nextCity.buildings = evolveBuildings(nextCity.buildings, nextVisits, 3);

  return nextCity;
}

function spawnBuilding(city: CityState, type: BuildingType, createdAtVisit: number): void {
  const position = findFreeSpot(city, city.seed, createdAtVisit);
  if (!position) return; // Não encontrou posição livre

  const buildingId = `${city.seed}-${type}-${createdAtVisit}`;
  city.buildings[buildingId] = {
    id: buildingId,
    x: position.x,
    y: position.y,
    type,
    stage: 1,
    level: 1,
    variant: calculateVariant(position.x, position.y, type),
    createdAtVisit,
  };
}

function findFreeSpot(city: CityState, seed: string, visit: number): { x: number; y: number } | null {
  // Criar um hash determinístico baseado em seed + visit
  const hash = simpleHash(`${seed}-${visit}`);
  
  // Mapa de posições ocupadas
  const occupied = new Set<string>();
  for (const building of Object.values(city.buildings)) {
    occupied.add(`${building.x},${building.y}`);
  }

  // Tentar posições em raio crescente, usando hash para escolha determinística
  const maxRadius = 20;
  for (let radius = 1; radius <= maxRadius; radius++) {
    // Gerar todas as posições candidatas no raio atual (anél do raio)
    const candidates: { x: number; y: number }[] = [];
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        const distSq = x * x + y * y;
        // Anel do raio: distância entre (radius-1) e radius
        if (distSq > (radius - 1) * (radius - 1) && distSq <= radius * radius) {
          candidates.push({ x, y });
        }
      }
    }

    // Ordenar candidatos para garantir determinismo
    candidates.sort((a, b) => {
      if (a.x !== b.x) return a.x - b.x;
      return a.y - b.y;
    });

    // Usar hash para escolher determinísticamente uma posição no anel
    // Se estiver ocupada, tentar próximo índice
    for (let offset = 0; offset < candidates.length; offset++) {
      const index = (hash + offset) % candidates.length;
      const candidate = candidates[index];
      const key = `${candidate.x},${candidate.y}`;
      
      if (!occupied.has(key)) {
        return candidate;
      }
    }
  }

  return null;
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

export function resetCity(slug: string, name?: string): CityState {
  return createInitialCity(slug, name);
}
