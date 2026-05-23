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
  drawFlowers(ctx, pathY, worldWidth, cameraX);
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

function drawFlowers(
  ctx: CanvasRenderingContext2D,
  pathY: number,
  worldWidth: number,
  cameraX: number
) {
  const flowerPositions: Array<{ x: number; side: "top" | "bottom"; isRose: boolean }> = [
    { x: 80, side: "top", isRose: false },
    { x: 150, side: "bottom", isRose: false },
    { x: 280, side: "top", isRose: false },
    { x: 350, side: "bottom", isRose: false },
    { x: 480, side: "top", isRose: false },
    { x: 550, side: "bottom", isRose: false },
    { x: 680, side: "top", isRose: false },
    { x: 750, side: "bottom", isRose: false },
    { x: 880, side: "top", isRose: false },
    { x: 950, side: "bottom", isRose: false },
    { x: 1080, side: "top", isRose: false },
    { x: 1150, side: "bottom", isRose: false },
    { x: 1200, side: "top", isRose: false },
    { x: 1280, side: "top", isRose: false },
    { x: 1320, side: "bottom", isRose: false },
    { x: 1350, side: "bottom", isRose: false },
    { x: 1400, side: "top", isRose: false },
    { x: 1450, side: "bottom", isRose: false },
    { x: 1480, side: "top", isRose: false },
    { x: 1520, side: "bottom", isRose: false },
    { x: 1550, side: "top", isRose: false },
    { x: 1580, side: "bottom", isRose: false },
    { x: 1620, side: "top", isRose: false },
    { x: 1650, side: "bottom", isRose: false },
    { x: 1680, side: "top", isRose: false },
    { x: 1720, side: "bottom", isRose: false },
    { x: 1740, side: "top", isRose: false },
    { x: 1760, side: "bottom", isRose: false },
    { x: 1780, side: "top", isRose: false },
    { x: 1800, side: "bottom", isRose: true },
    { x: 1820, side: "top", isRose: true },
    { x: 1840, side: "bottom", isRose: true },
    { x: 1860, side: "top", isRose: true },
    { x: 1880, side: "bottom", isRose: true },
    { x: 1900, side: "top", isRose: true },
    { x: 1920, side: "bottom", isRose: true },
    { x: 1940, side: "top", isRose: true },
    { x: 1960, side: "bottom", isRose: true },
    { x: 1980, side: "top", isRose: true },
  ];

  for (const flower of flowerPositions) {
    const y = flower.side === "top" ? pathY - 4 : pathY + 36;
    if (flower.x > cameraX - 20 && flower.x < cameraX + 340) {
      if (flower.isRose) {
        drawRose(ctx, flower.x, y);
      } else {
        drawFlower(ctx, flower.x, y);
      }
    }
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors = ["#ff69b4", "#ff1493", "#ffb6c1", "#ffc0cb", "#ff69b4"];
  const color = colors[Math.floor(x / 50) % colors.length];
  const stem = "#228b22";

  ctx.fillStyle = stem;
  ctx.fillRect(x, y, 1, 4);

  ctx.fillStyle = color;
  ctx.fillRect(x - 1, y - 2, 3, 3);
  ctx.fillRect(x - 2, y - 1, 1, 1);
  ctx.fillRect(x + 2, y - 1, 1, 1);
  ctx.fillRect(x - 1, y - 3, 1, 1);
  ctx.fillRect(x - 1, y + 1, 1, 1);
  ctx.fillRect(x - 2, y - 2, 1, 1);
  ctx.fillRect(x + 2, y - 2, 1, 1);
  ctx.fillRect(x - 2, y, 1, 1);
  ctx.fillRect(x + 2, y, 1, 1);

  ctx.fillStyle = "#ffd700";
  ctx.fillRect(x, y - 1, 1, 1);
}

function drawRose(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors = ["#dc143c", "#c71585", "#ff1493", "#ff69b4", "#dc143c"];
  const color = colors[Math.floor(x / 50) % colors.length];
  const darkColor = "#8b0000";
  const stem = "#228b22";

  ctx.fillStyle = stem;
  ctx.fillRect(x, y, 1, 4);

  ctx.fillStyle = darkColor;
  ctx.fillRect(x - 2, y - 4, 1, 1);
  ctx.fillRect(x + 2, y - 4, 1, 1);
  ctx.fillRect(x - 3, y - 3, 1, 1);
  ctx.fillRect(x + 3, y - 3, 1, 1);
  ctx.fillRect(x - 2, y - 1, 1, 1);
  ctx.fillRect(x + 2, y - 1, 1, 1);

  ctx.fillStyle = color;
  ctx.fillRect(x - 1, y - 2, 3, 3);
  ctx.fillRect(x - 1, y - 4, 1, 1);
  ctx.fillRect(x, y - 4, 1, 1);
  ctx.fillRect(x + 1, y - 4, 1, 1);
  ctx.fillRect(x - 2, y - 3, 1, 1);
  ctx.fillRect(x - 2, y - 2, 1, 1);
  ctx.fillRect(x + 2, y - 3, 1, 1);
  ctx.fillRect(x + 2, y - 2, 1, 1);
  ctx.fillRect(x - 1, y, 1, 1);
  ctx.fillRect(x + 1, y, 1, 1);

  ctx.fillStyle = darkColor;
  ctx.fillRect(x, y - 2, 1, 1);
}

function drawGroundHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#e84a7a";
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
  ctx.fillStyle = "#ff69b4";
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
  const dress = "#e91e63";
  const hair = "#1a1a1a";

  ctx.fillStyle = hair;
  ctx.fillRect(drawX + 5, drawY + 0, 6, 2);
  ctx.fillRect(drawX + 4, drawY + 2, 1, 6);
  ctx.fillRect(drawX + 11, drawY + 2, 1, 6);

  ctx.fillStyle = skin;
  ctx.fillRect(drawX + 5, drawY + 2, 6, 4);

  ctx.fillStyle = dress;
  ctx.fillRect(drawX + 5, drawY + 7, 6, 6);
  ctx.fillRect(drawX + 4, drawY + 13, 8, 1);

  ctx.fillStyle = skin;
  ctx.fillRect(drawX + 6, drawY + 13, 1, 1);
  ctx.fillRect(drawX + 9, drawY + 13, 1, 1);
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
