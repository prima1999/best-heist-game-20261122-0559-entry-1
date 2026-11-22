// Keyboard and mouse input for The Gilded Vault.
// Tracks held keys, the mouse position in game coordinates, and one-shot
// presses (Enter, E, R, 1, 2, 3) that the game loop consumes each frame.
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.held = new Set();
    this.pressed = new Set();
    this.mouseX = 640;
    this.mouseY = 360;
    this.mouseDown = false;
    this.anyKey = false;
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault();
      }
      if (!event.repeat) {
        this.pressed.add(key);
        this.anyKey = true;
      }
      this.held.add(key);
    });
    window.addEventListener('keyup', (event) => {
      this.held.delete(event.key.toLowerCase());
    });
    window.addEventListener('blur', () => {
      this.held.clear();
    });
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 1280 / rect.width;
      const scaleY = 720 / rect.height;
      this.mouseX = (event.clientX - rect.left) * scaleX;
      this.mouseY = (event.clientY - rect.top) * scaleY;
    });
    canvas.addEventListener('mousedown', (event) => {
      this.mouseDown = true;
      this.pressed.add('click');
      const rect = canvas.getBoundingClientRect();
      this.mouseX = (event.clientX - rect.left) * (1280 / rect.width);
      this.mouseY = (event.clientY - rect.top) * (720 / rect.height);
    });
    window.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
  }

  axis() {
    let x = 0;
    let y = 0;
    if (this.held.has('a') || this.held.has('arrowleft')) x -= 1;
    if (this.held.has('d') || this.held.has('arrowright')) x += 1;
    if (this.held.has('w') || this.held.has('arrowup')) y -= 1;
    if (this.held.has('s') || this.held.has('arrowdown')) y += 1;
    if (x !== 0 && y !== 0) {
      const diagonal = 1 / Math.sqrt(2);
      x *= diagonal;
      y *= diagonal;
    }
    return { x, y };
  }

  wasPressed(key) {
    return this.pressed.has(key.toLowerCase());
  }

  endFrame() {
    this.pressed.clear();
    this.anyKey = false;
  }
}