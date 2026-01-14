import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("Primeirolandia");
  const [slug, setSlug] = useState("primeirolandia");

  function go() {
    const s = (slug || "minha-cidade")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    window.location.href = `/${s}?name=${encodeURIComponent(name || s)}`;
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginBottom: 6 }}>MyMiniWorld</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Sua cidade começa aqui.</p>

      <div style={{ marginTop: 24, maxWidth: 520 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Nome da cidade</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 14 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Slug (URL)</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />

        <button
          onClick={go}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Entrar na cidade
        </button>

        <p style={{ marginTop: 14, opacity: 0.7 }}>
          Dica: depois você pode mandar links tipo <code>/roma</code>, <code>/wisecity</code>, etc.
        </p>
      </div>
    </main>
  );
}
