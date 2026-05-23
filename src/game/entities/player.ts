import type { Input } from "../input";
import type { PlayerSprites } from "../assets";

type PlayerConfig = {
  x: number;
  y: number;
  speed: number;
};

export class Player {
  x: number;
  y: number;
  speed: number;
  width = 16;
  height = 16;
  facing = 1;
  private moving = false;
  private animTime = 0;

  constructor(config: PlayerConfig) {
    this.x = config.x;
    this.y = config.y;
    this.speed = config.speed;
  }

  update(dt: number, input: Input, worldWidth: number) {
    const left = input.isDown("ArrowLeft") || input.isDown("KeyA");
    const right = input.isDown("ArrowRight") || input.isDown("KeyD");
    let direction = 0;

    if (left && !right) direction = -1;
    if (right && !left) direction = 1;

    this.moving = direction !== 0;
    if (direction !== 0) {
      this.facing = direction;
    }

    const currentSpeed = input.isShiftDown() ? this.speed * 2 : this.speed;
    this.x += direction * currentSpeed * dt;
    const half = this.width / 2;
    this.x = clamp(this.x, half, worldWidth - half);

    this.animTime += dt;
  }

  getFrame(sprites: PlayerSprites) {
    const frames = this.moving ? sprites.walk : sprites.idle;
    const fps = this.moving ? 8 : 2;
    const index = Math.floor(this.animTime * fps) % frames.length;
    return frames[index];
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
