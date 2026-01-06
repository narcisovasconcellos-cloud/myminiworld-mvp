import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type CityState = {
  name: string;
  slug: string;
  population: number;
  level: number;
  nextUpgradeIn: number; // visitas faltando pro próximo upgrade relevante
};

export default function CityPage() {
  const router = useRouter();
  const { slug, name } = router.query;

  const [data, setData] = useState<CityState | null>(null);
  const [counted, setCounted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    fetch(`/api/visit?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(String(name || ""))}`)
      .then((r) => r.json())
      .then((j) => {
        setData(j.city);
        setCounted(j.counted);
      })
      .catch(() => {
        setCounted(false);
      });
  }, [slug, name]);

  if (!data) {
    return (
      <main style={{ padding: 40, fontFamily: "serif" }}>
        <h1>Carregando cidade...</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, fontFamily: "serif" }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>{data.name}</h1>
      <p style={{ marginTop: 0, marginBottom: 18 }}>Sua cidade começa aqui.</p>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 10, padding: 16, width: 420 }}>
          <div><strong>Habitantes:</strong> {data.population}</div>
          <div><strong>Nível da Cidade:</strong> {data.level}</div>
          <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>
            Próximo upgrade em: <strong>{data.nextUpgradeIn}</strong> visitas
          </div>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
            Visita de hoje: {counted ? "contou ✅" : "não contou (repetida)"}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
            (placeholder) Aqui entra o “mapa isométrico” evolutivo
          </div>
          <div style={{
            width: 720,
            height: 420,
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ opacity: 0.6 }}>Render do mapa: level {data.level}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
