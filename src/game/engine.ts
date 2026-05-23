type EngineOptions = {
  update: (dt: number) => void;
  render: () => void;
};

export function createEngine(options: EngineOptions) {
  const step = 1 / 60;
  let lastTime = 0;
  let accumulator = 0;
  let running = false;

  function frame(time: number) {
    if (!running) return;
    const delta = Math.min(0.25, (time - lastTime) / 1000);
    lastTime = time;
    accumulator += delta;

    while (accumulator >= step) {
      options.update(step);
      accumulator -= step;
    }

    options.render();
    requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      requestAnimationFrame(frame);
    },
    stop() {
      running = false;
    },
  };
}
