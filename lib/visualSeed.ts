import { CityState } from "./cityState";

export type VisualSeed = {
  era: "village" | "town" | "city" | "metropolis";
  density: number;
  houseLevel: number;
  commerce: boolean;
  mood: string;
};

export function cityToVisualSeed(city: CityState): VisualSeed {
  let era: VisualSeed["era"] = "village";

  if (city.totalVisits > 100) era = "town";
  if (city.totalVisits > 1000) era = "city";
  if (city.totalVisits > 5000) era = "metropolis";

  return {
    era,
    density: city.neighborhoodLevel,
    houseLevel: city.ownerHouseLevel,
    commerce: city.firstCommerceUnlocked,
    mood: city.totalVisits < 50 ? "calm" : "busy",
  };
}
