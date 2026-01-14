import type { NextApiRequest, NextApiResponse } from "next";
import { applyVisit, CityState, createInitialCity } from "../../lib/cityState";

type Ok = { ok: true; city: CityState };
type Err = { ok: false; error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Ok | Err>) {
  const slugParam = req.query.slug;
  const nameParam = req.query.name;

  const slug = typeof slugParam === "string" ? slugParam : "";
  const name = typeof nameParam === "string" ? nameParam : undefined;

  if (!slug) {
    return res.status(400).json({ ok: false, error: "missing slug" });
  }

  // API é stateless: ela só calcula a próxima versão.
  // Persistência fica no client (localStorage), por enquanto.
  const base: CityState = createInitialCity(slug, name);

  // Se o client quiser enviar o estado atual, dá pra evoluir aqui depois.
  // Agora: cada chamada = +1 visita em cima do "base" não é ideal,
  // então no client a gente chama e aplica localmente.
  // Para manter simples, a API só devolve um "delta" calculado de forma determinística:
  // Vamos retornar o base com 1 visita aplicada. O client aplica visita sobre seu estado salvo.
  const next = applyVisit(base);

  return res.status(200).json({ ok: true, city: next });
}
