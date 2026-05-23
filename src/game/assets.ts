export type SpriteSheet = {
  image: HTMLCanvasElement;
  frameWidth: number;
  frameHeight: number;
  frames: number;
};

export type PlayerSprites = {
  sheet: SpriteSheet;
  idle: number[];
  walk: number[];
};

export function createPlayerSprites(): PlayerSprites {
  const frameWidth = 16;
  const frameHeight = 16;
  const frames = 4;

  const canvas = document.createElement("canvas");
  canvas.width = frameWidth * frames;
  canvas.height = frameHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Sprite canvas context not available");
  }
  ctx.imageSmoothingEnabled = false;

  const legOffsets = [-1, 0, 1, 0];
  for (let i = 0; i < frames; i += 1) {
    drawPlayerFrame(ctx, i * frameWidth, legOffsets[i]);
  }

  return {
    sheet: {
      image: canvas,
      frameWidth,
      frameHeight,
      frames,
    },
    idle: [0, 1],
    walk: [1, 2, 3, 2],
  };
}

function drawPlayerFrame(ctx: CanvasRenderingContext2D, offsetX: number, legOffset: number) {
  ctx.clearRect(offsetX, 0, 16, 16);

  const skin = "#d4a574";
  const shirt = "#3b6cf4";
  const pants = "#2a2a36";
  const hair = "#1a1a1a";
  const hairAccent = "#0a0a0a";

  // Curly hair — puffy on top with curls on the sides
  ctx.fillStyle = hair;
  ctx.fillRect(offsetX + 4, 0, 8, 2);
  ctx.fillRect(offsetX + 3, 1, 2, 2);
  ctx.fillRect(offsetX + 11, 1, 2, 2);
  ctx.fillRect(offsetX + 5, 0, 2, 2);
  ctx.fillRect(offsetX + 9, 0, 2, 2);
  ctx.fillRect(offsetX + 3, 2, 2, 3);
  ctx.fillRect(offsetX + 11, 2, 2, 3);
  ctx.fillStyle = hairAccent;
  ctx.fillRect(offsetX + 4, 1, 1, 1);
  ctx.fillRect(offsetX + 11, 1, 1, 1);
  ctx.fillRect(offsetX + 6, 0, 4, 1);

  // Head
  ctx.fillStyle = skin;
  ctx.fillRect(offsetX + 5, 3, 6, 4);
  ctx.fillRect(offsetX + 6, 4, 4, 3);

  // Shirt
  ctx.fillStyle = shirt;
  ctx.fillRect(offsetX + 5, 7, 6, 5);
  ctx.fillRect(offsetX + 6, 8, 4, 3);

  // Pants
  ctx.fillStyle = pants;
  ctx.fillRect(offsetX + 5, 12, 2, 2);
  ctx.fillRect(offsetX + 9, 12, 2, 2);

  // Legs with walk offset
  ctx.fillStyle = skin;
  ctx.fillRect(offsetX + 5 + legOffset, 14, 2, 1);
  ctx.fillRect(offsetX + 9 - legOffset, 14, 2, 1);
}
