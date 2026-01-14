export type BuildingType = "home" | "residential" | "road" | "commercial" | "park";

export type Building = {
  id: string;
  x: number;
  y: number;
  type: BuildingType;
  stage: number;
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
