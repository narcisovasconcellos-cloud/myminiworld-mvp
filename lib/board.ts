export type SlotId = "A1" | "A2" | "A3" | "A4" | "A5" | "B1" | "B2" | "B3" | "B4" | "B5" | "C1" | "C2" | "C3" | "C4" | "C5" | "D1" | "D2" | "D3" | "D4" | "D5" | "E1" | "E2" | "E3" | "E4" | "E5";

export type SlotKind = "home" | "road" | "park" | "residential" | "commercial" | "institution" | "empty";

export type BuildingStage = 0 | 1 | 2 | 3 | 4;

export type CommercialType = "market" | "restaurant" | "shop" | null;
export type InstitutionType = "school" | "hospital" | "church" | null;
export type ParkType = "small" | "medium" | "large" | null;

export type SlotVariant = CommercialType | InstitutionType | ParkType;

export type SlotState = {
  id: SlotId;
  kind: SlotKind;
  active: boolean;
  stage: BuildingStage;
  variant: SlotVariant;
};

export const BOARD_BASE: Record<SlotId, SlotKind> = {
  A1: "park",
  A2: "empty",
  A3: "residential",
  A4: "institution",
  A5: "park",
  B1: "empty",
  B2: "residential",
  B3: "road",
  B4: "residential",
  B5: "commercial",
  C1: "residential",
  C2: "road",
  C3: "home",
  C4: "road",
  C5: "residential",
  D1: "empty",
  D2: "residential",
  D3: "road",
  D4: "residential",
  D5: "commercial",
  E1: "park",
  E2: "institution",
  E3: "residential",
  E4: "commercial",
  E5: "park",
};

export function createInitialBoardState(): Record<SlotId, SlotState> {
  const board: Record<SlotId, SlotState> = {} as Record<SlotId, SlotState>;

  for (const [id, kind] of Object.entries(BOARD_BASE) as [SlotId, SlotKind][]) {
    const slotId = id as SlotId;
    
    // C3 (home) inicia ativo stage 1
    if (slotId === "C3") {
      board[slotId] = {
        id: slotId,
        kind,
        active: true,
        stage: 1,
        variant: null,
      };
      continue;
    }

    // Roads iniciais (B3, C2, C4, D3) iniciam ativos stage 1
    if (["B3", "C2", "C4", "D3"].includes(slotId)) {
      board[slotId] = {
        id: slotId,
        kind,
        active: true,
        stage: 1,
        variant: null,
      };
      continue;
    }

    // Parks (A1, A5, E1, E5) iniciam ativos stage 1
    if (["A1", "A5", "E1", "E5"].includes(slotId)) {
      board[slotId] = {
        id: slotId,
        kind,
        active: true,
        stage: 1,
        variant: null,
      };
      continue;
    }

    // Demais slots iniciam inativos stage 0
    board[slotId] = {
      id: slotId,
      kind,
      active: false,
      stage: 0,
      variant: null,
    };
  }

  return board;
}
