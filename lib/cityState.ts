import { SlotId, SlotState, createInitialBoardState } from "./board";

export type CityState = {
  slug: string;
  name: string;

  // core
  population: number;
  totalVisits: number;

  // board
  board: Record<SlotId, SlotState>;

  // visual progression (MVP)
  ownerHouseLevel: number; // começa 1
  neighborhoodLevel: number; // começa 0
  firstCommerceUnlocked: boolean;

  // internal counters for progression pacing
  lastUpgradeAtVisits: number;

  // timestamps
  createdAt: string;
  updatedAt: string;
};

const nowIso = () => new Date().toISOString();

export function createInitialCity(slug: string, name?: string): CityState {
  const safeSlug = (slug || "minha-cidade").toLowerCase().trim();

  return {
    slug: safeSlug,
    name: name?.trim() || titleCase(safeSlug.replace(/-/g, " ")) || "Minha Cidade",

    population: 1,
    totalVisits: 0,

    board: createInitialBoardState(),

    ownerHouseLevel: 1,
    neighborhoodLevel: 0,
    firstCommerceUnlocked: false,

    lastUpgradeAtVisits: 0,

    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

export function normalizeCity(city: any): CityState {
  // Se não tem board, cria um novo
  let board = city.board || createInitialBoardState();
  
  // Garante que todos os slots A1..E5 existam
  const defaultBoard = createInitialBoardState();
  const normalizedBoard: Record<SlotId, SlotState> = { ...defaultBoard };
  
  for (const slotId of Object.keys(defaultBoard) as SlotId[]) {
    if (board[slotId] && typeof board[slotId] === 'object') {
      normalizedBoard[slotId] = {
        id: slotId,
        kind: board[slotId].kind || defaultBoard[slotId].kind,
        active: board[slotId].active ?? defaultBoard[slotId].active,
        stage: board[slotId].stage ?? defaultBoard[slotId].stage,
        variant: board[slotId].variant ?? null,
      };
    } else {
      normalizedBoard[slotId] = defaultBoard[slotId];
    }
  }

  return {
    slug: city.slug || "minha-cidade",
    name: city.name || "Minha Cidade",
    population: typeof city.population === 'number' ? city.population : 1,
    totalVisits: typeof city.totalVisits === 'number' ? city.totalVisits : 0,
    board: normalizedBoard,
    ownerHouseLevel: typeof city.ownerHouseLevel === 'number' ? city.ownerHouseLevel : 1,
    neighborhoodLevel: typeof city.neighborhoodLevel === 'number' ? city.neighborhoodLevel : 0,
    firstCommerceUnlocked: typeof city.firstCommerceUnlocked === 'boolean' ? city.firstCommerceUnlocked : false,
    lastUpgradeAtVisits: typeof city.lastUpgradeAtVisits === 'number' ? city.lastUpgradeAtVisits : 0,
    createdAt: city.createdAt || nowIso(),
    updatedAt: city.updatedAt || nowIso(),
  };
}

export function applyVisit(city: CityState): CityState {
  const next: CityState = {
    ...city,
    totalVisits: city.totalVisits + 1,
    population: city.population + 1,
    board: { ...city.board },
    updatedAt: nowIso(),
  };

  // Evolução do tabuleiro
  next.board = evolveBoard(next.board, next.totalVisits);

  return next;
}

function evolveBoard(board: Record<SlotId, SlotState>, totalVisits: number): Record<SlotId, SlotState> {
  const newBoard = { ...board };

  // Ordem de ativação dos slots residenciais
  const residentialActivationOrder: SlotId[] = [
    "B2", "B4", "D2", "D4", // Primeiros 4
    "C1", "C5", "E3", "A3", // Segundos 4
  ];

  // Ativar slots residenciais a cada 2 visitas (visits 2, 4, 6, 8...)
  if (totalVisits >= 2 && totalVisits % 2 === 0) {
    const indexToActivate = Math.floor((totalVisits - 2) / 2);
    if (indexToActivate < residentialActivationOrder.length) {
      const slotId = residentialActivationOrder[indexToActivate];
      const slot = newBoard[slotId];
      if (slot && !slot.active && slot.kind === "residential") {
        newBoard[slotId] = {
          ...slot,
          active: true,
          stage: 1,
        };
      }
    }
  }

  // Upgrades de stage: a cada +3 visitas totais, sobe 1 stage em um slot residencial
  // Começando pelos mais antigos (ordem de ativação)
  if (totalVisits >= 3 && totalVisits % 3 === 0) {
    // Encontra o primeiro slot residencial ativo que não está em stage 4
    for (const slotId of residentialActivationOrder) {
      const slot = newBoard[slotId];
      if (slot && slot.active && slot.kind === "residential" && slot.stage < 4) {
        newBoard[slotId] = {
          ...slot,
          stage: (slot.stage + 1) as 1 | 2 | 3 | 4,
        };
        break; // Apenas um upgrade por vez
      }
    }
  }

  return newBoard;
}

function applyUpgrades(city: CityState): CityState {
  const visits = city.totalVisits;

  // cadence:
  // 0-100: 1 em 1
  // 101-1000: a cada 5
  // 1000+: a cada 10
  const step = visits <= 100 ? 1 : visits <= 1000 ? 5 : 10;

  // quantos "degraus" de upgrade deveriam ter ocorrido até agora
  const shouldHaveUpgradedAt = Math.floor(visits / step) * step;

  // se já aplicou esse degrau, não faz nada
  if (shouldHaveUpgradedAt <= city.lastUpgradeAtVisits) return city;

  const upgradesToApply = Math.floor((shouldHaveUpgradedAt - city.lastUpgradeAtVisits) / step);

  let next: CityState = { ...city };

  for (let i = 0; i < upgradesToApply; i++) {
    // ordem de upgrades simples (MVP):
    // - melhora casa central
    // - começa vizinhança
    // - primeiro comércio em 10 visitas (mas poderia virar sorteio depois)
    next = incrementProgress(next);
  }

  next.lastUpgradeAtVisits = shouldHaveUpgradedAt;
  next.updatedAt = nowIso();

  return next;
}

function incrementProgress(city: CityState): CityState {
  let next: CityState = { ...city };

  // casa central vai subindo sempre
  next.ownerHouseLevel = Math.min(50, next.ownerHouseLevel + 1);

  // vizinhança começa cedo e sobe junto, mais lento
  if (next.totalVisits >= 3) {
    if (next.totalVisits <= 30) {
      // fase início: começa aparecer ruas/casas ao redor
      next.neighborhoodLevel = Math.min(10, next.neighborhoodLevel + 1);
    } else {
      // fase média: quadras, postes, lixeiras, escola, igreja etc
      next.neighborhoodLevel = Math.min(100, next.neighborhoodLevel + 1);
    }
  }

  // primeiro comércio no habitante/visita 10 (MVP), depois você bota sorteio real
  if (next.totalVisits >= 10) next.firstCommerceUnlocked = true;

  return next;
}

function titleCase(s: string) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

