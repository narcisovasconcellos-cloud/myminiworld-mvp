import React, { useState } from "react";
import { getTileSprite } from "../lib/tiles";

type TileProps = {
  type: string;
  stage: number;
  size?: number;
  label?: string;
};

export default function Tile({ type, stage, size = 64, label }: TileProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const spriteSrc = getTileSprite(type, stage);
  const displayLabel = label || `${type.substring(0, 3)} S${stage}`;
  
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
        alt={`${type} stage ${stage}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
        }}
      />
      {showTooltip && label !== undefined && (
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
    </div>
  );
}
