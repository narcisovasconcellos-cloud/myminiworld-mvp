export type BuildingType = "home" | "residential" | "road" | "commercial" | "park";

export type Building = {
  id: string;
  x: number;
  y: number;
  type: BuildingType;
  stage: number; // Mantido para compatibilidade (1-4)
  level: number; // Nível de evolução (1-3)
  variant: number; // Variante determinística (0..N-1)
  createdAtVisit: number;
};

export type CityState = {
  buildings: Record<string, Building>;
  visits: number;
  population: number;
  seed: string;
  name: string;
  createdAt: number;
  slug?: string;
};
