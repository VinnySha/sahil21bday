import type { PlayerSprites } from "./assets";
import type { Player } from "./entities/player";

type RenderState = {
  viewWidth: number;
  viewHeight: number;
  worldWidth: number;
  pathHeight: number;
  cameraX: number;
  player: Player;
  sprites: PlayerSprites;
  time: number;
  signPositions: number[];
  signLabels: string[];
  followerX: number | null;
  showCutsceneHeart: boolean;
  heartX: number;
};

export function render(ctx: CanvasRenderingContext2D, state: RenderState) {
  const {
    viewWidth,
    viewHeight,
    worldWidth,
    pathHeight,
    cameraX,
    player,
    sprites,
    time,
    signPositions,
    signLabels,
    followerX,
    showCutsceneHeart,
    heartX,
  } = state;
  const pathY = Math.floor((viewHeight - pathHeight) / 2);
  const groundY = pathY + pathHeight - 2;

  ctx.clearRect(0, 0, viewWidth, viewHeight);

  ctx.fillStyle = "#7ec0ff";
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  drawBackgroundLayer(ctx, viewWidth, viewHeight, {
    color: "#c7e6ff",
    y: 20,
    height: 20,
    blockWidth: 60,
  });

  drawSun(ctx, viewWidth, viewHeight);
  drawClouds(ctx, viewWidth, viewHeight, time);

  ctx.fillStyle = "#8bc98f";
  ctx.fillRect(0, 46, viewWidth, 26);

  drawBackgroundLayer(ctx, viewWidth, viewHeight, {
    color: "#5ca06e",
    y: 62,
    height: 30,
    blockWidth: 40,
  });

  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.fillStyle = "#3a2f2c";
  ctx.fillRect(0, pathY, worldWidth, pathHeight);
  ctx.fillStyle = "#2a1f1d";
  ctx.fillRect(0, pathY, worldWidth, 2);
  ctx.fillRect(0, pathY + pathHeight - 2, worldWidth, 2);

  drawSigns(ctx, pathY, signPositions, signLabels);
  drawPathDecorations(ctx, pathY, cameraX);
  drawGroundHeart(ctx, heartX, pathY + Math.floor(pathHeight / 2) - 5);

  if (followerX !== null) {
    drawFollower(ctx, followerX, groundY);
  }
  drawPlayer(ctx, player, sprites, groundY);

  if (showCutsceneHeart && followerX !== null) {
    drawCoupleHeart(ctx, (followerX + player.x) / 2, groundY - 20);
  }

  ctx.restore();
}

type BackgroundLayer = {
  color: string;
  y: number;
  height: number;
  blockWidth: number;
};

function drawSun(ctx: CanvasRenderingContext2D, viewWidth: number, viewHeight: number) {
  const sunX = 250;
  const sunY = 15;
  const sunRadius = 12;

  if (sunX > -sunRadius && sunX < viewWidth + sunRadius) {
    ctx.fillStyle = "#ffeb3b";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff59d";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius - 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawClouds(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  time: number
) {
  const cloudData = [
    { baseX: 50, y: 18, size: 1.0, speed: 8 },
    { baseX: 200, y: 15, size: 0.8, speed: 10 },
    { baseX: 350, y: 20, size: 1.2, speed: 6 },
    { baseX: 500, y: 17, size: 0.9, speed: 9 },
    { baseX: 650, y: 19, size: 1.1, speed: 7 },
    { baseX: 800, y: 16, size: 0.85, speed: 11 },
    { baseX: 950, y: 14, size: 1.0, speed: 8 },
    { baseX: 1100, y: 21, size: 0.9, speed: 9 },
    { baseX: 1250, y: 18, size: 1.1, speed: 7 },
    { baseX: 1400, y: 16, size: 0.8, speed: 10 },
    { baseX: 1550, y: 19, size: 1.2, speed: 6 },
    { baseX: 1700, y: 15, size: 0.95, speed: 8 },
  ];

  ctx.fillStyle = "#ffffff";

  for (const cloud of cloudData) {
    const x = (cloud.baseX + time * cloud.speed) % (viewWidth + 200) - 100;
    drawCloud(ctx, x, cloud.y, cloud.size);
  }
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const baseSize = 8 * size;
  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.arc(x, y, baseSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + baseSize * 0.6, y, baseSize * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - baseSize * 0.6, y, baseSize * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + baseSize * 0.3, y - baseSize * 0.4, baseSize * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - baseSize * 0.3, y - baseSize * 0.4, baseSize * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  layer: BackgroundLayer
) {
  ctx.fillStyle = layer.color;

  for (let x = 0; x < viewWidth + layer.blockWidth; x += layer.blockWidth) {
    const blockHeight = layer.height + Math.sin(x * 0.05) * 4;
    ctx.fillRect(x, layer.y, layer.blockWidth, blockHeight);
    ctx.fillRect(x, layer.y + blockHeight, layer.blockWidth, viewHeight - layer.y - blockHeight);
  }
}

function drawSigns(ctx: CanvasRenderingContext2D, pathY: number, signPositions: number[], signLabels: string[]) {
  for (let i = 0; i < signPositions.length; i += 1) {
    const x = signPositions[i];
    const label = signLabels[i] ?? "";
    ctx.fillStyle = "#5b4536";
    ctx.fillRect(x, pathY - 12, 3, 12);
    ctx.fillStyle = "#e2d5b0";
    ctx.fillRect(x - 10, pathY - 26, 22, 12);
    ctx.fillStyle = "#8b7b5a";
    ctx.fillRect(x - 8, pathY - 24, 18, 8);

    if (label) {
      ctx.fillStyle = "#1b1a23";
      ctx.font = "7px 'Press Start 2P', system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + 1, pathY - 20);
    }
  }
}

function drawPathDecorations(
  ctx: CanvasRenderingContext2D,
  pathY: number,
  cameraX: number
) {
  const decorations: Array<{ x: number; side: "top" | "bottom"; kind: "robot" | "umiami" | "stethoscope" }> = [
    { x: 120, side: "top", kind: "robot" },
    { x: 260, side: "bottom", kind: "umiami" },
    { x: 400, side: "top", kind: "stethoscope" },
    { x: 540, side: "bottom", kind: "robot" },
    { x: 680, side: "top", kind: "umiami" },
    { x: 820, side: "bottom", kind: "stethoscope" },
    { x: 960, side: "top", kind: "robot" },
    { x: 1100, side: "bottom", kind: "umiami" },
    { x: 1240, side: "top", kind: "stethoscope" },
    { x: 1380, side: "bottom", kind: "robot" },
    { x: 1520, side: "top", kind: "umiami" },
    { x: 1660, side: "bottom", kind: "stethoscope" },
    { x: 1780, side: "top", kind: "robot" },
    { x: 1880, side: "bottom", kind: "umiami" },
    { x: 1950, side: "top", kind: "stethoscope" },
  ];

  for (const deco of decorations) {
    if (deco.x < cameraX - 24 || deco.x > cameraX + 344) continue;
    const y = deco.side === "top" ? pathY - 6 : pathY + 34;
    if (deco.kind === "robot") {
      drawRobot(ctx, deco.x, y);
    } else if (deco.kind === "umiami") {
      drawUMiamiU(ctx, deco.x, y);
    } else {
      drawStethoscope(ctx, deco.x, y);
    }
  }
}

function drawRobot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const metal = "#9aa3ad";
  const metalDark = "#6b737c";
  const eye = "#ff4444";
  const accent = "#4a90d9";

  ctx.fillStyle = metalDark;
  ctx.fillRect(x, y - 4, 1, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(x, y - 5, 1, 1);

  ctx.fillStyle = metal;
  ctx.fillRect(x - 3, y - 3, 7, 5);
  ctx.fillStyle = metalDark;
  ctx.fillRect(x - 2, y - 2, 5, 3);
  ctx.fillStyle = eye;
  ctx.fillRect(x - 2, y - 1, 1, 1);
  ctx.fillRect(x + 1, y - 1, 1, 1);

  ctx.fillStyle = metal;
  ctx.fillRect(x - 4, y + 2, 9, 6);
  ctx.fillStyle = accent;
  ctx.fillRect(x - 1, y + 4, 3, 2);

  ctx.fillStyle = metalDark;
  ctx.fillRect(x - 6, y + 3, 2, 4);
  ctx.fillRect(x + 4, y + 3, 2, 4);

  ctx.fillStyle = metal;
  ctx.fillRect(x - 3, y + 8, 3, 3);
  ctx.fillRect(x + 1, y + 8, 3, 3);
}

function drawUMiamiU(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const green = "#005030";
  const orange = "#f47321";

  ctx.fillStyle = green;
  ctx.fillRect(x - 3, y - 4, 1, 6);
  ctx.fillRect(x + 2, y - 4, 1, 6);
  ctx.fillRect(x - 3, y + 1, 6, 1);

  ctx.fillStyle = orange;
  ctx.fillRect(x - 2, y - 3, 1, 4);
  ctx.fillRect(x + 1, y - 3, 1, 4);
  ctx.fillRect(x - 2, y, 4, 1);
}

function drawStethoscope(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const tube = "#2a2a36";
  const metal = "#b8bcc4";
  const chest = "#6b737c";

  ctx.fillStyle = metal;
  ctx.fillRect(x - 4, y - 1, 2, 1);
  ctx.fillRect(x + 2, y - 1, 2, 1);

  ctx.fillStyle = tube;
  ctx.fillRect(x - 3, y, 1, 2);
  ctx.fillRect(x + 2, y, 1, 2);
  ctx.fillRect(x - 2, y + 2, 5, 1);

  ctx.fillStyle = chest;
  ctx.fillRect(x - 1, y + 3, 3, 2);
  ctx.fillStyle = metal;
  ctx.fillRect(x, y + 4, 1, 1);
}

function drawGroundHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(x + 1, y + 0, 2, 2);
  ctx.fillRect(x + 6, y + 0, 2, 2);
  ctx.fillRect(x + 0, y + 1, 3, 2);
  ctx.fillRect(x + 6, y + 1, 3, 2);
  ctx.fillRect(x + 0, y + 3, 9, 2);
  ctx.fillRect(x + 1, y + 5, 7, 1);
  ctx.fillRect(x + 2, y + 6, 5, 1);
  ctx.fillRect(x + 3, y + 7, 3, 1);
}

function drawCoupleHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(x - 6, y - 2, 5, 5);
  ctx.fillRect(x + 1, y - 2, 5, 5);
  ctx.fillRect(x - 5, y + 2, 9, 5);
  ctx.fillRect(x - 3, y + 6, 5, 4);
  ctx.restore();
}

function drawFollower(ctx: CanvasRenderingContext2D, x: number, groundY: number) {
  const drawX = Math.floor(x - 8);
  const drawY = Math.floor(groundY - 16);
  const skin = "#d4a574";
  const shirt = "#e53935";
  const pants = "#2a2a36";
  const hair = "#1a1a1a";

  ctx.fillStyle = hair;
  ctx.fillRect(drawX + 5, drawY + 0, 6, 2);
  ctx.fillRect(drawX + 4, drawY + 2, 1, 2);
  ctx.fillRect(drawX + 11, drawY + 2, 1, 2);

  ctx.fillStyle = skin;
  ctx.fillRect(drawX + 5, drawY + 2, 6, 4);

  ctx.fillStyle = shirt;
  ctx.fillRect(drawX + 4, drawY + 7, 8, 5);

  ctx.fillStyle = pants;
  ctx.fillRect(drawX + 5, drawY + 12, 2, 2);
  ctx.fillRect(drawX + 9, drawY + 12, 2, 2);

  ctx.fillStyle = skin;
  ctx.fillRect(drawX + 5, drawY + 14, 2, 1);
  ctx.fillRect(drawX + 9, drawY + 14, 2, 1);
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  sprites: PlayerSprites,
  groundY: number
) {
  const frame = player.getFrame(sprites);
  const frameWidth = sprites.sheet.frameWidth;
  const frameHeight = sprites.sheet.frameHeight;
  const sourceX = frame * frameWidth;

  const drawX = Math.floor(player.x - player.width / 2);
  const drawY = Math.floor(groundY - player.height);

  ctx.save();
  if (player.facing === -1) {
    ctx.translate(drawX + player.width, drawY);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(drawX, drawY);
  }

  ctx.drawImage(
    sprites.sheet.image,
    sourceX,
    0,
    frameWidth,
    frameHeight,
    0,
    0,
    player.width,
    player.height
  );
  ctx.restore();
}
