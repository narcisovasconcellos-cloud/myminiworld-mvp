import React, { useState, useEffect, useRef } from "react";
import { resolveVisual } from "../lib/buildingVisuals";

type TileProps = {
  type: string;
  level: number;
  variant?: number;
  size?: number;
  label?: string;
  showDebug?: boolean;
  styleSeed?: number;
};

export default function Tile({ 
  type, 
  level, 
  variant = 0, 
  size = 64, 
  label,
  showDebug = false,
  styleSeed,
}: TileProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevLevelRef = useRef(level);
  
  // Detectar mudança de level e ativar animação
  useEffect(() => {
    if (level > prevLevelRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      prevLevelRef.current = level;
      return () => clearTimeout(timer);
    } else {
      prevLevelRef.current = level;
    }
  }, [level]);
  
  const spriteSrc = resolveVisual(type as any, level, variant);
  const debugLabel = showDebug 
    ? `${type.substring(0, 3)} L${level} V${variant}${styleSeed !== undefined ? ` S${styleSeed}` : ''}` 
    : undefined;
  const displayLabel = label || debugLabel;
  
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
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: isAnimating ? "scale(1.08)" : "scale(1.0)",
          transition: isAnimating ? "transform 0.15s ease-out" : "transform 0.3s ease-in",
          position: "relative",
        }}
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
        {isAnimating && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
              pointerEvents: "none",
              borderRadius: "2px",
            }}
          />
        )}
      </div>
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
            zIndex: 10,
          }}
        >
          {displayLabel}
        </div>
      )}
      {showDebug && debugLabel && (
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
            zIndex: 5,
          }}
        >
          {debugLabel}
        </div>
      )}
    </div>
  );
}
