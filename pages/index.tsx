import { useState } from "react";
import { useRouter } from "next/router";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  return (
    <main style={{ padding: 40, fontFamily: "serif" }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>MyMiniWorld</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>Sua cidade começa aqui.</p>

      <div style={{ display: "flex", gap: 8, maxWidth: 520 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da sua cidade"
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button
          onClick={() => {
            const slug = slugify(name || "minha-cidade");
            router.push(`/c/${slug}?name=${encodeURIComponent(name)}`);
          }}
          style={{ padding: "10px 14px", fontSize: 16, cursor: "pointer" }}
        >
          Entrar
        </button>
      </div>
    </main>
  );
}
