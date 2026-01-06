import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
// Aqui você usaria Supabase. Por enquanto deixei “estrutura”.
// Se você já tem Supabase, eu te passo a versão completa com client.

const SECRET = process.env.VISIT_SECRET || "dev-secret";

function getIp(req: NextApiRequest) {
  const xf = req.headers["x-forwarded-for"];
  const ip = Array.isArray(xf) ? xf[0] : xf?.split(",")[0];
  return (ip || req.socket.remoteAddress || "0.0.0.0").trim();
}

function ymdUTC(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function upgradesForPopulation(pop: number) {
  if (pop <= 100) return pop;
  if (pop <= 1000) return 100 + Math.floor((pop - 100) / 5);
  return 100 + Math.floor(900 / 5) + Math.floor((pop - 1000) / 10); // 280 + floor((pop-1000)/10)
}

function nextUpgradeIn(pop: number) {
  if (pop < 100) return 1;
  if (pop < 1000) {
    const next = 100 + (Math.floor((pop - 100) / 5) + 1) * 5;
    return Math.max(1, next - pop);
  }
  const next = 1000 + (Math.floor((pop - 1000) / 10) + 1) * 10;
  return Math.max(1, next - pop);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug || "").trim();
  const name = String(req.query.name || "").trim();

  if (!slug) return res.status(400).json({ error: "missing slug" });

  const ip = getIp(req);
  const today = ymdUTC();
  const visitorHash = crypto.createHash("sha256").update(`${ip}|${today}|${SECRET}`).digest("hex");

  // TODO: trocar esses mocks por Supabase:
  // 1) upsert city by slug
  // 2) insert visit unique (city_id, visitor_hash, visit_date)
  // 3) se inseriu, increment population e recalcular level
  // 4) retornar cidade

  // MOCK TEMP (só pra não quebrar resposta):
  const population = 1; // aqui virá do DB
  const level = upgradesForPopulation(population);

  return res.status(200).json({
    counted: true, // no real: true se inseriu visita, false se já existia hoje
    city: {
      name: name || slug,
      slug,
      population,
      level,
      nextUpgradeIn: nextUpgradeIn(population),
    },
  });
}
