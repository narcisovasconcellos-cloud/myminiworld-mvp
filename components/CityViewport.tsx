import React from "react";
import { CityState } from "../lib/cityTypes";
import { resolveStyle } from "../lib/buildingStyle";
import Tile from "./Tile";

type CityViewportProps = {
  city: CityState;
  cameraX?: number;
  cameraY?: number;
  size?: number;
  showDebug?: boolean;
};

export default function CityViewport({
  city,
  cameraX = 0,
  cameraY = 0,
  size = 21,
  showDebug = false,
}: CityViewportProps) {
  // Guards contra undefined
  if (!city || !city.buildings) {
    return <div>Carregando cidade...</div>;
  }

  // Criar mapa de coordenadas para acesso rápido
  const buildingMap = new Map<string, typeof city.buildings[string]>();
  for (const building of Object.values(city.buildings || {})) {
    if (building && building.x !== undefined && building.y !== undefined) {
      buildingMap.set(`${building.x},${building.y}`, building);
    }
  }

  // Calcular range de coordenadas visíveis
  const halfSize = Math.floor(size / 2);
  const minX = cameraX - halfSize;
  const maxX = cameraX + halfSize;
  const minY = cameraY - halfSize;
  const maxY = cameraY + halfSize;

  const cells: JSX.Element[] = [];

  // Renderizar células do grid
  for (let y = maxY; y >= minY; y--) {
    for (let x = minX; x <= maxX; x++) {
      const key = `${x},${y}`;
      const building = buildingMap.get(key);

      const cellStyle: React.CSSProperties = {
        position: "relative",
        border: "1px solid #ddd",
        width: "100%",
        height: "100%",
        minHeight: "64px",
        minWidth: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      };

      const tileType = building?.type || "empty";
      // Usar level se disponível, senão mapear stage para level (compatibilidade)
      const tileLevel = building?.level ?? (building?.stage ? Math.min(building.stage, 3) : 1);
      const tileVariant = building?.variant ?? 0;
      
      // Resolver estilo para debug
      const style = building?.type ? resolveStyle(building.type, tileVariant) : null;
      const styleSeed = style?.styleSeed;

      cells.push(
        <div key={key} style={cellStyle}>
          <Tile
            type={tileType}
            level={tileLevel}
            variant={tileVariant}
            size={64}
            showDebug={showDebug}
            styleSeed={styleSeed}
          />
        </div>
      );
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "1px",
        border: "2px solid #333",
        padding: "4px",
        backgroundColor: "#fff",
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      {cells}
    </div>
  );
}
