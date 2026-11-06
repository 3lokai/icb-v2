"use client";

import { useEffect, useRef } from "react";

// ponytail: Diwali 2026 one-off. It switches itself off at this instant, so a
// forgotten deploy can't leave fireworks running. Delete this file and its line
// in (main)/layout.tsx afterwards. Checked in the browser, not on the server,
// because cached pages would otherwise keep rendering it past the date.
const ENDS_AT = Date.parse("2026-11-10T00:00:00+05:30");

// Terracotta, amber and ochre, dark enough to read on cream and in dark mode.
const COLORS = ["#de8660", "#d97706", "#b58a2e", "#c2541f"];

const START_DELAY_MS = 2500; // stay clear of LCP
const MIN_GAP_MS = 900;
const MAX_GAP_MS = 2600;
const PARTICLES_PER_BURST = 34;
const DRAG = 0.965;
const GRAVITY = 0.02;
const FADE = 0.016;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
};

const pick = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

export function DiwaliFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (
      !canvas ||
      !ctx ||
      Date.now() >= ENDS_AT ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let particles: Particle[] = [];
    let frameId = 0;
    let timerId = 0;
    let lastFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // clientWidth, not innerWidth: innerWidth includes the scrollbar.
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      // Scale by elapsed time so 120Hz screens don't run at double speed.
      const step = Math.min((now - lastFrame) / 16.67, 3);
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles = particles.filter((p) => {
        p.vx *= DRAG ** step;
        p.vy = p.vy * DRAG ** step + GRAVITY * step;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.alpha -= FADE * step;
        if (p.alpha <= 0) return false;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // No particles means no animation loop: idle pages cost one timer.
      frameId = particles.length ? requestAnimationFrame(draw) : 0;
    };

    const burst = () => {
      const x = Math.random() * canvas.clientWidth;
      const y = (0.1 + Math.random() * 0.6) * canvas.clientHeight;
      const color = pick(COLORS);

      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLES_PER_BURST;
        const speed = pick([2.2, 3.2, 4.2, 4.2]);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
        });
      }

      if (!frameId) {
        lastFrame = performance.now();
        frameId = requestAnimationFrame(draw);
      }
    };

    const schedule = (delay: number) => {
      timerId = window.setTimeout(() => {
        if (Date.now() >= ENDS_AT) return;
        if (!document.hidden) burst();
        schedule(MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS));
      }, delay);
    };

    resize();
    window.addEventListener("resize", resize);
    schedule(START_DELAY_MS);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearTimeout(timerId);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 size-full"
      ref={canvasRef}
    />
  );
}
