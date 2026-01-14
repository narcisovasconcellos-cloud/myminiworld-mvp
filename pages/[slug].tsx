import { useEffect, useMemo, useState } from "react";
import { CityState, Building } from "../lib/cityTypes";
import { createInitialCity, applyVisit, resetCity } from "../lib/cityLogic";
import { calculateVariant } from "../lib/buildingUpgrade";
import CityViewport from "../components/CityViewport";

function storageKey(slug: string) {
  return `mmw:city:${slug}`;
}

function normalizeCity(raw: any, slug: string): CityState {
  if (!raw || typeof raw !== "object") return createInitialCity(slug);
  
  // Migração: se tem buildings, garantir que têm level/variant
  if (raw.buildings && typeof raw.buildings === "object") {
    const city = raw as CityState;
    let needsMigration = false;
    const normalizedBuildings: Record<string, Building> = {};
    
    for (const [id, building] of Object.entries(city.buildings || {})) {
      const b = building as any;
      if (b.level === undefined || b.variant === undefined) {
        needsMigration = true;
        normalizedBuildings[id] = {
          ...b,
          level: b.level ?? (b.stage ? Math.min(b.stage, 3) : 1),
          variant: b.variant ?? (b.x !== undefined && b.y !== undefined && b.type ? calculateVariant(b.x, b.y, b.type) : 0),
        };
      } else {
        normalizedBuildings[id] = b;
      }
    }
    
    if (needsMigration) {
      return {
        ...city,
        buildings: normalizedBuildings,
      };
    }
    
    return city as CityState;
  }
  
  // migração de formatos antigos (ex: board 5x5)
  if (raw.board && typeof raw.board === "object") {
    const city = createInitialCity(slug, raw.name ?? raw.cityName ?? slug);
    // opcional: migrar casa central / stats
    city.visits = Number(raw.visits ?? raw.totalVisits ?? 0);
    city.population = Number(raw.population ?? 1);
    return city;
  }
  
  return createInitialCity(slug, raw.name ?? raw.cityName ?? slug);
}

function loadCity(slug: string): CityState | null {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeCity(parsed, slug);
  } catch {
    return null;
  }
}

function saveCity(city: CityState) {
  try {
    localStorage.setItem(storageKey(city.slug || city.seed), JSON.stringify(city));
  } catch {
    // ignore
  }
}

export default function CityPage() {
  const [city, setCity] = useState<CityState | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = useMemo(() => {
    if (typeof window === "undefined") return "minha-cidade";
    const s = window.location.pathname.split("/").pop() || "minha-cidade";
    return s.toLowerCase().trim();
  }, []);

  const nameFromQuery = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const url = new URL(window.location.href);
    const n = url.searchParams.get("name") || undefined;
    return n || undefined;
  }, []);

  // Carrega do localStorage ou cria inicial
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = loadCity(slug);
    if (existing) {
      // Se foi normalizado (migrado), salva de volta
      const raw = localStorage.getItem(storageKey(slug));
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // Se não tinha buildings mas agora tem, foi migrado
          if (!parsed.buildings && existing.buildings) {
            saveCity(existing);
          }
        } catch {
          // ignore
        }
      }
      setCity(existing);
      setLoading(false);
      return;
    }

    const created = createInitialCity(slug, nameFromQuery);
    saveCity(created);
    setCity(created);
    setLoading(false);
  }, [slug, nameFromQuery]);

  function handleSimulateVisit(n: number = 1) {
    if (!city) return;
    const next = applyVisit(city, n);
    saveCity(next);
    setCity(next);
  }

  function handleReset() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(storageKey(slug));
    const created = resetCity(slug, nameFromQuery);
    saveCity(created);
    setCity(created);
  }

  if (loading || !city) {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui, Arial" }}>
        <h2>Carregando cidade…</h2>
      </main>
    );
  }

  const totalBuildings = Object.keys(city?.buildings ?? {}).length;

  return (
    <main style={{ padding: 40, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginBottom: 6 }}>{city.name}</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Slug: <code>{city.slug || city.seed}</code>
      </p>

      <div style={{ marginTop: 18, border: "1px solid #3333", padding: 16, borderRadius: 8, maxWidth: 560 }}>
        <p><strong>Visitas:</strong> {city.visits}</p>
        <p><strong>População:</strong> {city.population}</p>
        <p><strong>Total de buildings:</strong> {totalBuildings}</p>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button
            onClick={() => handleSimulateVisit(1)}
            style={{ padding: "10px 12px", cursor: "pointer" }}
          >
            Simular visita (+1)
          </button>
          <button
            onClick={() => handleSimulateVisit(10)}
            style={{ padding: "10px 12px", cursor: "pointer" }}
          >
            Simular 10 visitas
          </button>
          <button
            onClick={handleReset}
            style={{ padding: "10px 12px", cursor: "pointer" }}
          >
            Resetar cidade
          </button>
          <button
            disabled
            style={{
              padding: "10px 12px",
              cursor: "not-allowed",
              opacity: 0.5,
              backgroundColor: "#f0f0f0",
            }}
          >
            IA desligada
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Visualização da Cidade</h2>
        <CityViewport city={city} cameraX={0} cameraY={0} size={21} />
      </div>
    </main>
  );
}






