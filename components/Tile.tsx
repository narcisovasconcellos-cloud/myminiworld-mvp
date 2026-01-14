import React, { useState } from "react";
import { resolveVisual } from "../lib/buildingVisuals";

type TileProps = {
  type: string;
  level: number;
  variant?: number;
  size?: number;
  label?: string;
  showDebug?: boolean;
};

export default function Tile({ 
  type, 
  level, 
  variant = 0, 
  size = 64, 
  label,
  showDebug = false,
}: TileProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const spriteSrc = resolveVisual(type as any, level, variant);
  const displayLabel = label || (showDebug ? `${type.substring(0, 3)} L${level} V${variant}` : undefined);
  
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img
        src={spriteSrc}
        alt={`${type} level ${level}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
        }}
      />
      {showTooltip && displayLabel && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "4px 8px",
            fontSize: "10px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            marginBottom: "4px",
            pointerEvents: "none",
          }}
        >
          {displayLabel}
        </div>
      )}
      {showDebug && displayLabel && (
        <div
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "2px 4px",
            fontSize: "8px",
            borderRadius: "2px",
            fontWeight: "bold",
          }}
        >
          {displayLabel}
        </div>
      )}
    </div>
  );
}
