export class Input {
  private keys = new Set<string>();

  constructor(target: Window) {
    target.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
      }
      this.keys.add(event.code);
    });

    target.addEventListener("keyup", (event) => {
      this.keys.delete(event.code);
    });

    target.addEventListener("blur", () => {
      this.keys.clear();
    });
  }

  isShiftDown() {
    return this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
  }

  isDown(code: string) {
    return this.keys.has(code);
  }
}
