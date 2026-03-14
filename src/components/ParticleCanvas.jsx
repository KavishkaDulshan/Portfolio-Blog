import { useEffect, useRef, useCallback } from 'react';

// ── Constants ──────────────────────────────────────────────────────
const PARTICLE_COUNT  = 58;
const COLORS          = ['#0a0a0a', '#1a1a1a', '#2d2d2d', '#404040', '#595959', '#737373', '#999999'];
const SPEED           = 0.65;
const GRAVITY         = -0.038;   // negative = upward (antigravity)
const FRICTION        = 0.965;
const REPEL_RADIUS    = 120;
const REPEL_STRENGTH  = 5.5;
const PATTERN_FORCE   = 0.0014;   // soft pull toward circular ring
const SPRITE_SIZE     = 64;
const DRAW_SIZE       = 29;       // shape size inside the sprite canvas

// ── Pre-render a shape into an offscreen canvas (GPU sprite cache) ──
const spriteCache = {};
function getSprite(color, shapeType) {
  const key = `${color}-${shapeType}`;
  if (spriteCache[key]) return spriteCache[key];

  const c  = document.createElement('canvas');
  c.width  = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const cx = c.getContext('2d');
  const center = SPRITE_SIZE / 2;

  cx.shadowColor    = 'rgba(0,0,0,0.13)';
  cx.shadowBlur     = 12;
  cx.shadowOffsetX  = 3;
  cx.shadowOffsetY  = 4;
  cx.fillStyle      = color;
  cx.translate(center, center);
  cx.beginPath();

  if (shapeType === 0) {
    // Circle
    cx.arc(0, 0, DRAW_SIZE / 2, 0, Math.PI * 2);
  } else if (shapeType === 1) {
    // Square
    cx.rect(-DRAW_SIZE / 2, -DRAW_SIZE / 2, DRAW_SIZE, DRAW_SIZE);
  } else {
    // Triangle
    cx.moveTo(0, -DRAW_SIZE / 2);
    cx.lineTo(DRAW_SIZE / 2,  DRAW_SIZE / 2);
    cx.lineTo(-DRAW_SIZE / 2, DRAW_SIZE / 2);
    cx.closePath();
  }
  cx.fill();

  spriteCache[key] = c;
  return c;
}

// ── Particle ────────────────────────────────────────────────────────
class Particle {
  constructor(index, width, height) {
    this.index = index;
    this.w = width;
    this.h = height;
    this.scatter(true);
  }

  scatter(randomY = false) {
    this.x  = Math.random() * this.w;
    this.y  = randomY ? Math.random() * this.h : this.h + 30;
    this.vx = (Math.random() - 0.5) * 2 * SPEED;
    this.vy = -(Math.random() * 0.9 + 0.3) * SPEED;   // initial upward bias

    this.visualSize  = Math.random() * 14 + 5;
    this.depth       = Math.random() * 0.8 + 0.4;
    this.rotation    = Math.random() * Math.PI * 2;
    this.rotSpeed    = (Math.random() - 0.5) * 0.045;
    this.type        = Math.floor(Math.random() * 3);
    this.color       = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.sprite      = getSprite(this.color, this.type);
  }

  update(mouseX, mouseY) {
    // ① Pattern attraction: softly pull toward position on a circle ring
    const cx = this.w / 2;
    const cy = this.h / 2;
    const r  = Math.min(this.w, this.h) * 0.34;
    const t  = (this.index / PARTICLE_COUNT) * Math.PI * 2;
    const tx = cx + Math.cos(t) * r;
    const ty = cy + Math.sin(t) * r;

    this.vx += (tx - this.x) * PATTERN_FORCE;
    this.vy += (ty - this.y) * PATTERN_FORCE;

    // ② Antigravity (upward drift)
    this.vy += GRAVITY * 0.05 * this.depth;

    // ③ Small turbulence so particles never freeze
    this.vx += (Math.random() - 0.5) * 0.04;
    this.vy += (Math.random() - 0.5) * 0.04;

    // ④ Integrate
    this.x += this.vx * this.depth;
    this.y += this.vy * this.depth;
    this.rotation += this.rotSpeed;

    // ⑤ Mouse repel
    const dx   = this.x - mouseX;
    const dy   = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPEL_RADIUS && dist > 0) {
      const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
      const angle = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force;
      this.vy += Math.sin(angle) * force;
    }

    // ⑥ Friction
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    // ⑦ Boundary — wrap horizontal, reset vertical
    if (this.x < -40)         this.x = this.w + 40;
    if (this.x > this.w + 40) this.x = -40;
    if (this.y < -50)         this.scatter(false);   // respawn at bottom
    if (this.y > this.h + 50) this.scatter(false);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    // Scale the 64×64 sprite so its DRAW_SIZE portion matches visualSize × depth
    const scale      = (this.visualSize * this.depth) / DRAW_SIZE;
    const renderSize = SPRITE_SIZE * scale;
    ctx.drawImage(this.sprite, -renderSize / 2, -renderSize / 2, renderSize, renderSize);
    ctx.restore();
  }
}

// ── React component ─────────────────────────────────────────────────
export default function ParticleCanvas() {
  const canvasRef  = useRef(null);
  const mouseRef   = useRef({ x: -2000, y: -2000 });
  const stateRef   = useRef({ particles: [], animId: null, w: 0, h: 0 });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w    = rect.width;
    const h    = rect.height;

    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled  = true;
    ctx.imageSmoothingQuality  = 'high';

    stateRef.current.w = w;
    stateRef.current.h = h;
    stateRef.current.particles = Array.from(
      { length: PARTICLE_COUNT },
      (_, i) => new Particle(i, w, h)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    init();

    // ── Animation loop ──
    function loop() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { w, h, particles } = stateRef.current;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.update(mx, my);
        p.draw(ctx);
      }
      stateRef.current.animId = requestAnimationFrame(loop);
    }
    stateRef.current.animId = requestAnimationFrame(loop);

    // ── Responsive resize ──
    const ro = new ResizeObserver(() => { init(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      ro.disconnect();
    };
  }, [init]);

  // Track mouse relative to canvas
  const onMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: -2000, y: -2000 };
  }, []);

  // Touch support
  const onTouchMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      className="w-full h-full block cursor-crosshair"
    />
  );
}
