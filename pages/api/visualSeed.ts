// pages/api/visualSeed.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { seed, cityName, population, level, biome, style } = req.body;

    const prompt = `
Isometric pixel-art city.
Name: ${cityName}
Population: ${population}
Development level: ${level}
Biome: ${biome}
Style: ${style}
Clean UI, game-like, SimCity inspired.
`;

    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return res.status(200).json({
      ok: true,
      b64: img.data[0].b64_json,
      mime: "image/png",
    });
  } catch (err: any) {
    console.error("VISUAL ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err?.message || "OpenAI error",
    });
  }
}

