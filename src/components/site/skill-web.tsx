"use client";

import { useEffect, useRef } from "react";

import { skillCategories } from "@/content";

/**
 * NEURAL MEMORY WEB
 * -----------------
 * The toolset as a living constellation: each tool is a glowing node wired to
 * its nearest neighbours, with light "signals" firing along the synapses.
 * Nodes drift, repel from the cursor, and can be dragged; hovering a node lights
 * it, pulses its links, and fires signals to its neighbours — a "map of what I
 * know", true to the Memory Architecture concept.
 *
 * Canvas 2D (crisp labels, cheap everywhere). Static for reduced-motion, paused
 * off-screen. The categorised list below stays as the accessible source.
 */

const TOOLS = Array.from(
  new Set(skillCategories.flatMap((c) => c.items.map((i) => i.name)))
);

type Node = {
  label: string;
  hx: number;
  hy: number;
  x: number;
  y: number;
  phase: number;
  rw: number;
};
type Pulse = { a: number; b: number; p: number; spd: number };

export function SkillWeb() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // The web needs room — on phones the categorised list below is the display.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.cursor = "grab";
    wrap.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let fontPx = 15;
    const font = (px: number, weight = 600) =>
      `${weight} ${px}px Inter, system-ui, sans-serif`;

    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    const adj: number[][] = [];

    const clamp = (n: Node) => {
      n.x = Math.max(n.rw + 6, Math.min(W - n.rw - 6, n.x));
      n.y = Math.max(18, Math.min(H - 18, n.y));
    };

    const layout = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontPx = W < 640 ? 13 : 15;
      ctx.font = font(fontPx);

      const pad = W < 640 ? 16 : 24;
      nodes = TOOLS.map((label) => ({
        label,
        hx: 0,
        hy: 0,
        x: 0,
        y: 0,
        phase: Math.random() * Math.PI * 2,
        rw: ctx.measureText(label).width / 2 + pad,
      }));

      const cx = W / 2;
      const cy = H / 2;
      const ax = W * 0.44;
      const ay = H * 0.42;
      for (const n of nodes) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random());
        n.x = cx + Math.cos(a) * ax * rr;
        n.y = cy + Math.sin(a) * ay * rr;
      }
      for (let it = 0; it < 100; it++) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = (b.y - a.y) * 2.2;
            const d = Math.hypot(dx, dy) || 0.01;
            const minD = a.rw + b.rw + 10;
            if (d < minD) {
              const push = ((minD - d) / d) * 0.5;
              a.x -= dx * push;
              a.y -= (dy * push) / 2.2;
              b.x += dx * push;
              b.y += (dy * push) / 2.2;
            }
          }
          clamp(a);
        }
      }
      for (const n of nodes) {
        n.hx = n.x;
        n.hy = n.y;
      }

      // Wire each node to its 3 nearest neighbours.
      const seen = new Set<string>();
      edges = [];
      adj.length = 0;
      for (let i = 0; i < nodes.length; i++) adj.push([]);
      nodes.forEach((n, i) => {
        nodes
          .map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, 3)
          .forEach((o) => {
            const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
            if (!seen.has(key)) {
              seen.add(key);
              edges.push([i, o.j]);
              adj[i].push(o.j);
              adj[o.j].push(i);
            }
          });
      });
    };
    layout();

    const pulses: Pulse[] = [];
    const firePulse = (a: number, b: number) =>
      pulses.push({ a, b, p: 0, spd: 0.012 + Math.random() * 0.01 });

    const mouse = { x: -999, y: -999, down: false, drag: -1 };
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const nearest = () => {
      let best = -1;
      let bd = 1e9;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return bd < 55 ? best : -1;
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      mouse.x = p.x;
      mouse.y = p.y;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.down = true;
      mouse.drag = nearest();
      canvas.style.cursor = "grabbing";
    };
    const onUp = () => {
      if (mouse.drag >= 0) {
        nodes[mouse.drag].hx = nodes[mouse.drag].x;
        nodes[mouse.drag].hy = nodes[mouse.drag].y;
      }
      mouse.down = false;
      mouse.drag = -1;
      canvas.style.cursor = "grab";
    };
    if (!reduce) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
    }

    let raf = 0;
    let t = 0;
    let visible = true;
    let lastHov = -1;
    let pulseTimer = 30;

    const draw = () => {
      t += 0.016;
      const hov = mouse.drag >= 0 ? mouse.drag : nearest();

      // Signals: ambient sparks + a burst when a new node is hovered.
      if (!reduce) {
        pulseTimer -= 1;
        if (pulseTimer <= 0 && edges.length) {
          const e = edges[(Math.random() * edges.length) | 0];
          firePulse(e[0], e[1]);
          pulseTimer = 16 + Math.random() * 34;
        }
        if (hov >= 0 && hov !== lastHov) {
          for (const nb of adj[hov] || []) firePulse(hov, nb);
        }
      }
      lastHov = hov;

      nodes.forEach((n, i) => {
        if (i === mouse.drag && mouse.down) {
          n.x += (mouse.x - n.x) * 0.3;
          n.y += (mouse.y - n.y) * 0.3;
          clamp(n);
          return;
        }
        let tx = n.hx + Math.cos(t * 0.5 + n.phase) * 9;
        let ty = n.hy + Math.sin(t * 0.4 + n.phase) * 9;
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 110 && d > 0.01) {
          const f = ((110 - d) / 110) * 26;
          tx += (dx / d) * f;
          ty += (dy / d) * f;
        }
        n.x += (tx - n.x) * (reduce ? 1 : 0.09);
        n.y += (ty - n.y) * (reduce ? 1 : 0.09);
        clamp(n);
      });

      ctx.clearRect(0, 0, W, H);

      const connected = new Set<number>();
      if (hov >= 0) for (const nb of adj[hov] || []) connected.add(nb);

      // Edges (warm, visible; brighter when tied to the hovered node)
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const on = hov >= 0 && (i === hov || j === hov);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = on
          ? "rgba(247,178,62,0.75)"
          : "rgba(247,178,62,0.16)";
        ctx.lineWidth = on ? 1.5 : 1;
        ctx.stroke();
      }

      // Signals travelling along the synapses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pu = pulses[k];
        pu.p += pu.spd;
        if (pu.p >= 1) {
          pulses.splice(k, 1);
          continue;
        }
        const a = nodes[pu.a];
        const b = nodes[pu.b];
        const x = a.x + (b.x - a.x) * pu.p;
        const y = a.y + (b.y - a.y) * pu.p;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, "rgba(255,224,170,0.95)");
        g.addColorStop(1, "rgba(247,178,62,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes: glow + dot + label
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const on = i === hov;
        const near = connected.has(i);
        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, on ? 36 : 22);
        gr.addColorStop(0, on ? "rgba(247,178,62,0.5)" : "rgba(247,178,62,0.14)");
        gr.addColorStop(1, "rgba(247,178,62,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(n.x, n.y, on ? 36 : 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = font(on ? fontPx + 1 : fontPx, on ? 700 : 600);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = on
          ? "#f7b23e"
          : near
            ? "rgba(245,242,234,0.98)"
            : hov >= 0
              ? "rgba(245,242,234,0.42)"
              : "rgba(245,242,234,0.85)";
        ctx.fillText(n.label, n.x, n.y);
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      for (const n of nodes) {
        n.x = n.hx;
        n.y = n.hy;
      }
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !reduce && !raf) raf = requestAnimationFrame(draw);
        else if (!visible) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) {
        for (const n of nodes) {
          n.x = n.hx;
          n.y = n.hy;
        }
        draw();
      }
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (canvas.parentNode === wrap) wrap.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative mx-auto hidden h-[440px] w-full max-w-4xl touch-none select-none sm:h-[540px] md:block"
    />
  );
}
