import "./styles.css";
import { createEngine } from "./game/engine";
import { Input } from "./game/input";
import { Player } from "./game/entities/player";
import { createPlayerSprites } from "./game/assets";
import { render } from "./game/render";

const VIRTUAL_WIDTH = 320;
const VIRTUAL_HEIGHT = 180;
const WORLD_WIDTH = 2000;
const PATH_HEIGHT = 36;

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error("Canvas element not found");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Canvas 2D context not available");
}
context.imageSmoothingEnabled = false;

const input = new Input(window);
const sprites = createPlayerSprites();

const pathY = Math.floor((VIRTUAL_HEIGHT - PATH_HEIGHT) / 2);
const groundY = pathY + PATH_HEIGHT - 2;

const imageModules = import.meta.glob("./assets/images/*.{png,jpg,jpeg,JPG,JPEG,webp,gif}", {
  eager: true,
  import: "default",
});

const imageMap = new Map<string, string>();
for (const [path, url] of Object.entries(imageModules)) {
  const filename = path.split("/").pop();
  if (!filename) continue;
  const key = filename.replace(/\.[^.]+$/, "");
  imageMap.set(key, url as string);
}

type SignConfig = {
  images: string[] | { prefix: string };
};

const SIGN_CONFIGS: SignConfig[] = [
  { images: ["0"] },
  { images: ["1"] },
  { images: ["6"] },
  { images: ["7"] },
  { images: ["8"] },
  { images: ["9"] },
  { images: ["10"] },
  { images: ["11"] },
  { images: ["12"] },
  { images: ["12.5"] },
  { images: ["13"] },
  { images: ["15"] },
  { images: ["19"] },
  { images: ["20"] },
  { images: ["21"] },
];

function getImageUrl(key: string) {
  const url = imageMap.get(key);
  if (!url) {
    console.warn(`Missing image for key: ${key}`);
  }
  return url ?? "";
}

function getImagesByPrefix(prefix: string) {
  const matches = [...imageMap.entries()]
    .filter(([key]) => key.startsWith(prefix))
    .sort((a, b) => a[0].localeCompare(b[0]));
  return matches.map(([, url]) => url);
}

const SIGNS = SIGN_CONFIGS.map((sign) => {
  const images = Array.isArray(sign.images)
    ? sign.images.map((key) => getImageUrl(key)).filter(Boolean)
    : getImagesByPrefix(sign.images.prefix);
  return { images };
});

const SIGN_LABELS = SIGN_CONFIGS.map(() => "");

function buildSignPositions(count: number, start: number, end: number) {
  if (count <= 1) return [start];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(start + step * i));
}

const player = new Player({
  x: 40,
  y: groundY,
  speed: 60,
});

let cameraX = 0;
let gameTime = 0;

const SIGN_POSITIONS = buildSignPositions(SIGNS.length, 200, 1820);
const SIGN_INTERACTION_DISTANCE = 30;

const popup = document.getElementById("sign-popup");
const popupImage = document.getElementById("popup-image") as HTMLImageElement | null;
const popupPrev = document.getElementById("popup-prev");
const popupNext = document.getElementById("popup-next");
const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const heartButton = document.getElementById("heart-button");

let activeSignIndex: number | null = null;
let activeImageIndex = 0;

document.body.classList.add("title-active");

startButton?.addEventListener("click", () => {
  titleScreen?.classList.remove("active");
  document.body.classList.remove("title-active");
});

const HEART_X = WORLD_WIDTH - 60;
const HEART_INTERACTION_DISTANCE = 16;

type CutscenePhase = "idle" | "approach" | "heart" | "done";
let cutscenePhase: CutscenePhase = "idle";
let cutsceneTimer = 0;

let followerX: number | null = null;
let followerActive = false;

const FOLLOW_DELAY = 0.8;
const trail: Array<{ t: number; x: number }> = [];

heartButton?.addEventListener("click", () => {
  if (cutscenePhase !== "idle") return;
  cutscenePhase = "approach";
  cutsceneTimer = 0;
  followerX = WORLD_WIDTH + 40;
  followerActive = false;
  heartButton?.classList.add("hidden");
});

function updatePopupContent() {
  if (activeSignIndex === null || !popup) return;
  const sign = SIGNS[activeSignIndex];
  if (!sign) return;

  if (popupImage) {
    popupImage.src = sign.images[activeImageIndex] ?? "";
  }

  const showNav = sign.images.length > 1;
  popupPrev?.classList.toggle("hidden", !showNav);
  popupNext?.classList.toggle("hidden", !showNav);
}

function setActiveSign(index: number | null) {
  if (!popup) return;
  if (index === null) {
    activeSignIndex = null;
    popup.classList.add("hidden");
    return;
  }

  if (index !== activeSignIndex) {
    activeSignIndex = index;
    activeImageIndex = 0;
    updatePopupContent();
  }
  popup.classList.remove("hidden");
}

popupPrev?.addEventListener("click", () => {
  if (activeSignIndex === null) return;
  const images = SIGNS[activeSignIndex].images;
  if (images.length <= 1) return;
  activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
  updatePopupContent();
});

popupNext?.addEventListener("click", () => {
  if (activeSignIndex === null) return;
  const images = SIGNS[activeSignIndex].images;
  if (images.length <= 1) return;
  activeImageIndex = (activeImageIndex + 1) % images.length;
  updatePopupContent();
});

function checkSignProximity() {
  let closestIndex: number | null = null;
  let closestDistance = Infinity;
  for (let i = 0; i < SIGN_POSITIONS.length; i += 1) {
    const distance = Math.abs(player.x - SIGN_POSITIONS[i]);
    if (distance < SIGN_INTERACTION_DISTANCE && distance < closestDistance) {
      closestIndex = i;
      closestDistance = distance;
    }
  }

  setActiveSign(closestIndex);
}

const engine = createEngine({
  update: (dt) => {
    const cutsceneActive = cutscenePhase === "approach" || cutscenePhase === "heart";
    if (!cutsceneActive) {
      player.update(dt, input, WORLD_WIDTH);
    }
    const targetX = player.x - VIRTUAL_WIDTH / 2;
    cameraX = clamp(targetX, 0, WORLD_WIDTH - VIRTUAL_WIDTH);
    gameTime += dt;

    const nearHeart = Math.abs(player.x - HEART_X) < HEART_INTERACTION_DISTANCE;
    if (cutscenePhase === "idle" && nearHeart) {
      heartButton?.classList.remove("hidden");
    } else {
      heartButton?.classList.add("hidden");
    }

    if (cutscenePhase === "approach" && followerX !== null) {
      const target = player.x + 10;
      const speed = 40;
      if (followerX > target) {
        followerX -= speed * dt;
      } else {
        cutscenePhase = "heart";
        cutsceneTimer = 0;
      }
    } else if (cutscenePhase === "heart") {
      cutsceneTimer += dt;
      if (cutsceneTimer > 1.6) {
        cutscenePhase = "done";
        followerActive = true;
      }
    }

    trail.push({ t: gameTime, x: player.x });
    while (trail.length > 0 && trail[0].t < gameTime - 3) {
      trail.shift();
    }

    if (followerActive && followerX !== null) {
      const targetTime = gameTime - FOLLOW_DELAY;
      const target = trail.find((point) => point.t >= targetTime);
      if (target) {
        const desiredOffset = -12;
        const targetX = target.x + desiredOffset;
        const speed = 50;
        if (Math.abs(followerX - targetX) > 1) {
          followerX += Math.sign(targetX - followerX) * speed * dt;
        }
      }
    }

    checkSignProximity();
  },
  render: () => {
    render(context, {
      viewWidth: VIRTUAL_WIDTH,
      viewHeight: VIRTUAL_HEIGHT,
      worldWidth: WORLD_WIDTH,
      pathHeight: PATH_HEIGHT,
      cameraX,
      player,
      sprites,
      time: gameTime,
      signPositions: SIGN_POSITIONS,
      signLabels: SIGN_LABELS,
      followerX,
      showCutsceneHeart: cutscenePhase === "heart",
      heartX: HEART_X,
    });
  },
});

engine.start();

function resizeCanvas() {
  canvas.width = VIRTUAL_WIDTH;
  canvas.height = VIRTUAL_HEIGHT;
  const scale = Math.max(
    1,
    Math.floor(
      Math.min(window.innerWidth / VIRTUAL_WIDTH, window.innerHeight / VIRTUAL_HEIGHT)
    )
  );
  canvas.style.width = `${VIRTUAL_WIDTH * scale}px`;
  canvas.style.height = `${VIRTUAL_HEIGHT * scale}px`;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
