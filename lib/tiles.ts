export function getTileSprite(type: string, stage: number): string {
  // Clamp stage entre 1 e 4
  const clampedStage = Math.min(Math.max(stage, 1), 4);
  
  // Mapear tipos para nomes de arquivo
  const typeMap: Record<string, string> = {
    residential: "res",
    commercial: "com",
    park: "par",
    road: "road",
    home: "home",
    empty: "empty",
  };
  
  const fileName = typeMap[type] || "empty";
  
  // Se for empty, não precisa de stage
  if (fileName === "empty") {
    return "/tiles/empty.svg";
  }
  
  return `/tiles/${fileName}_${clampedStage}.svg`;
}
