import { useEffect, useRef, useCallback } from 'react';

// ── Config ───────────────────────────────────────────────────────────
const N            = 240;
const DOT_R        = 1.4;
const PERSP        = 400;
const ORB_R_FACTOR = 0.3;
const REPEL_R      = 310;
const REPEL_STR    = 25;
const ROT_SPD_Y    = (Math.PI * 2) / 12000; // full rotation in 12 s
const ROT_SPD_X    = (Math.PI * 2) / 16000; // full rotation in 16 s
const SPRING_K     = 0.14;
const SPRING_DAMP  = 0.72;
const FADE_IN_MS   = 1200;           // initial soft fade-in

// B&W depth shades — index 0 = front/darkest, last = back/lightest
const SHADES_LIGHT = ['#111', '#2a2a2a', '#444', '#5e5e5e', '#787878', '#929292', '#aaa'];
// Inverted for dark mode — index 0 = front/lightest, last = back/darkest
const SHADES_DARK = ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#8a8a8a', '#6b6b6b', '#525252', '#3a3a3a'];

// ── 3-D helpers ──────────────────────────────────────────────────────
function rotX([x, y, z], a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function rotY([x, y, z], a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function orbPos(az, ay, r, rx, ry) {
  const x =  r * Math.cos(ay) * Math.cos(az);
  const y = -r * Math.cos(ay) * Math.sin(az);
  const z = -r * Math.sin(ay);
  return rotY(rotX([x, y, z], rx), ry);
}
function proj(x, y, z, cx, cy) {
  const sc = PERSP / (PERSP + z);
  return [cx + x * sc, cy + y * sc, sc];
}

// ── Component ─────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const stateRef  = useRef(null);

  const initState = useCallback((W, H) => {
    const orbR = Math.min(W, H) * ORB_R_FACTOR;
    return {
      W, H,
      rx: 0, ry: 0,
      orbR,
      startAt: performance.now(),
      particles: Array.from({ length: N }, () => {
        const az = Math.random() * Math.PI * 2;
        const ay = Math.asin(Math.random() * 2 - 1);
        const [x, y, z] = orbPos(az, ay, orbR, 0, 0);
        return { x, y, z, vx: 0, vy: 0, vz: 0, az, ay };
      }),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId, ctx, lastNow = performance.now();

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const { width: W, height: H } = canvas.getBoundingClientRect();
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      stateRef.current = initState(W, H);
    }

    resize();

    function loop(now) {
      const s = stateRef.current;
      if (!s || !ctx) { animId = requestAnimationFrame(loop); return; }

      const dt = Math.min(now - lastNow, 48);
      lastNow  = now;
      const { W, H, particles } = s;
      const cx  = W / 2;
      const cy  = H * 0.40;
      const mrx = mouse.current.x - cx;
      const mry = mouse.current.y - cy;

      // Advance rotation
      s.ry += ROT_SPD_Y * dt;
      s.rx += ROT_SPD_X * dt;

      // Soft fade-in on first load
      const gAlpha = Math.min((now - s.startAt) / FADE_IN_MS, 1);

      // Physics
      for (const p of particles) {
        // Spring toward current orb target
        const [tx, ty, tz] = orbPos(p.az, p.ay, s.orbR, s.rx, s.ry);
        p.vx = (p.vx + (tx - p.x) * SPRING_K) * SPRING_DAMP;
        p.vy = (p.vy + (ty - p.y) * SPRING_K) * SPRING_DAMP;
        p.vz = (p.vz + (tz - p.z) * SPRING_K) * SPRING_DAMP;

        // Mouse repel in projected screen space
        const [sx, sy] = proj(p.x, p.y, p.z, 0, 0);
        const mdx = sx - mrx, mdy = sy - mry;
        const md  = Math.hypot(mdx, mdy);
        if (md < REPEL_R && md > 0) {
          const f = ((REPEL_R - md) / REPEL_R) * REPEL_STR;
          p.vx += (mdx / md) * f;
          p.vy += (mdy / md) * f;
        }

        p.x += p.vx; p.y += p.vy; p.z += p.vz;
      }

      // Draw
      ctx.clearRect(0, 0, W, H);

      const sorted = particles.slice().sort((a, b) => a.z - b.z);
      const shades = document.documentElement.classList.contains('dark')
        ? SHADES_DARK
        : SHADES_LIGHT;

      for (const p of sorted) {
        const [sx, sy, sc] = proj(p.x, p.y, p.z, cx, cy);
        const r  = Math.max(0.3, DOT_R * sc);
        const t  = Math.max(0, Math.min(1, (sc - 0.75) / 0.6));
        const si = Math.round((1 - t) * (shades.length - 1));

        ctx.globalAlpha = gAlpha * Math.min(1, sc * 1.4);
        ctx.fillStyle   = shades[si];
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [initState]);

  const onMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouse.current = { x: -9999, y: -9999 };
  }, []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = {
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
