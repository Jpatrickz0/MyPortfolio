"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { getQuality } from "@/lib/perf";
import { profile } from "@/content";

/**
 * HERO PARTICLE PORTRAIT (Three.js)
 * ---------------------------------
 * Samples a BACKGROUND-REMOVED portrait PNG into a field of ~40k glowing
 * particles that assemble into the figure, breathe, and flow away from the
 * cursor. Until a real photo exists at `profile.portrait`, it renders a
 * particle *silhouette* so the composition already reads as intentional — the
 * moment a transparent PNG is dropped at that path, it becomes the real face.
 *
 * Design notes
 * - Three is dynamically imported so it never touches the SSR/initial bundle.
 * - `prefers-reduced-motion` → single static frame, no loop, no pointer input.
 * - Pauses its RAF loop when scrolled offscreen; disposes everything on unmount.
 */

const BRAND_RGB: [number, number, number] = [0.969, 0.698, 0.243]; // hsl(38 92% 58%)
const TINT = 0.55; // how far pixel colors are pulled toward brand amber
const SAMPLE_COLS = 190; // sampling resolution (columns); rows follow aspect
const ALPHA_CUTOFF = 46; // ignore near-transparent pixels (cutout edges)

type Sampled = {
  positions: Float32Array;
  colors: Float32Array;
  scatter: Float32Array;
  randoms: Float32Array;
  count: number;
};

/** Draw the fallback silhouette (head + shoulders bust) to a canvas. */
function drawSilhouette(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  // Head
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.3, h * 0.175, 0, Math.PI * 2);
  ctx.fill();
  // Shoulders / bust
  ctx.beginPath();
  ctx.moveTo(w * 0.14, h);
  ctx.bezierCurveTo(w * 0.14, h * 0.66, w * 0.3, h * 0.56, w * 0.5, h * 0.56);
  ctx.bezierCurveTo(w * 0.7, h * 0.56, w * 0.86, h * 0.66, w * 0.86, h);
  ctx.closePath();
  ctx.fill();
  return c;
}

/** Turn an ImageData grid into centered particle buffers. */
function sample(data: ImageData): Sampled {
  const { width: w, height: h, data: px } = data;
  const scale = 2 / h; // map image height → 2 world units
  const pos: number[] = [];
  const col: number[] = [];
  const scat: number[] = [];
  const rnd: number[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = px[i + 3];
      if (a < ALPHA_CUTOFF) continue;

      const wx = (x - w / 2) * scale;
      const wy = (h / 2 - y) * scale;
      const wz = (Math.random() - 0.5) * 0.06;
      pos.push(wx, wy, wz);

      // Pull the sampled color toward brand amber, then lift for glow.
      const r = (px[i] / 255) * (1 - TINT) + BRAND_RGB[0] * TINT;
      const g = (px[i + 1] / 255) * (1 - TINT) + BRAND_RGB[1] * TINT;
      const b = (px[i + 2] / 255) * (1 - TINT) + BRAND_RGB[2] * TINT;
      col.push(Math.min(1, r * 1.15), Math.min(1, g * 1.1), Math.min(1, b));

      // Entrance scatter: explode outward from center in a random direction.
      const ang = Math.random() * Math.PI * 2;
      const rad = 1.6 + Math.random() * 3.2;
      scat.push(
        Math.cos(ang) * rad,
        Math.sin(ang) * rad + (Math.random() - 0.5),
        (Math.random() - 0.5) * 3
      );
      rnd.push(Math.random());
    }
  }

  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
    scatter: new Float32Array(scat),
    randoms: new Float32Array(rnd),
    count: rnd.length,
  };
}

/** Load the portrait (or fall back to silhouette) and return sampled particles. */
function loadSampled(
  src: string,
  cols: number
): Promise<{ data: Sampled; fallback: boolean }> {
  const toData = (source: CanvasImageSource, sw: number, sh: number) => {
    const rows = Math.round((sh / sw) * cols);
    const c = document.createElement("canvas");
    c.width = cols;
    c.height = rows;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(source, 0, 0, cols, rows);
    return ctx.getImageData(0, 0, cols, rows);
  };
  const silRows = Math.round(cols * 1.3);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!img.naturalWidth) {
        const sil = drawSilhouette(cols, silRows);
        resolve({ data: sample(toData(sil, sil.width, sil.height)), fallback: true });
        return;
      }
      resolve({
        data: sample(toData(img, img.naturalWidth, img.naturalHeight)),
        fallback: false,
      });
    };
    img.onerror = () => {
      const sil = drawSilhouette(cols, silRows);
      resolve({ data: sample(toData(sil, sil.width, sil.height)), fallback: true });
    };
    img.src = src;
  });
}

const VERT = /* glsl */ `
  uniform float uTime, uSize, uDpr, uProgress, uMouseRadius, uMouseStrength;
  uniform vec2 uMouse;
  attribute vec3 aColor;
  attribute vec3 aScatter;
  attribute float aRnd;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    float p = clamp(uProgress, 0.0, 1.0);
    vec3 pos = mix(aScatter, position, p);

    float t = uTime;
    pos.x += sin(t * 0.6 + aRnd * 6.2831) * 0.008;
    pos.y += cos(t * 0.5 + aRnd * 6.2831) * 0.008;
    pos.z += sin(t * 0.8 + aRnd * 10.0) * 0.05;

    // Cursor repulsion in the xy plane.
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float infl = smoothstep(uMouseRadius, 0.0, dist);
    pos.xy += normalize(d + 1e-4) * infl * uMouseStrength;
    pos.z += infl * 0.35;

    float twinkle = 0.62 + 0.38 * sin(t * 2.0 + aRnd * 20.0);
    vAlpha = clamp(p * twinkle, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uDpr * (0.55 + aRnd * 0.95) * (1.0 + infl * 1.4);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

export function HeroParticles({
  src = profile.portrait,
  className,
}: {
  src?: string;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const mount = mountRef.current;
      if (!mount || disposed) return;

      const q = getQuality();
      const reduce = q.reduce;
      // Fewer particles on weaker/mobile devices keeps the hero smooth.
      const cols = q.mobile ? 96 : q.tier === "low" ? 130 : 150;

      const { data, fallback: isFallback } = await loadSampled(src, cols);
      if (disposed || !mountRef.current) return;
      if (isFallback) setFallback(true);

      const getSize = () => {
        const r = mount.getBoundingClientRect();
        return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
      };
      let { w, h } = getSize();

      const VIEW_H = 2.55; // world height the ortho camera frames
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera();
      camera.position.z = 5;
      const applyCamera = () => {
        const aspect = w / h;
        camera.left = (-VIEW_H * aspect) / 2;
        camera.right = (VIEW_H * aspect) / 2;
        camera.top = VIEW_H / 2;
        camera.bottom = -VIEW_H / 2;
        camera.updateProjectionMatrix();
      };
      applyCamera();

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: q.tier === "high",
          powerPreference: "high-performance",
        });
      } catch {
        // WebGL blocked/unavailable → degrade to the static silhouette.
        setNoGl(true);
        return;
      }
      const dpr = q.dpr;
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
      geo.setAttribute("aScatter", new THREE.BufferAttribute(data.scatter, 3));
      geo.setAttribute("aRnd", new THREE.BufferAttribute(data.randoms, 1));

      const uniforms = {
        uTime: { value: 0 },
        uSize: { value: 2.4 },
        uDpr: { value: dpr },
        uProgress: { value: reduce ? 1 : 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uMouseRadius: { value: 0.5 },
        uMouseStrength: { value: 0.16 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, material);
      scene.add(points);

      // Entrance: assemble from the scattered cloud.
      let entranceRaf = 0;
      if (!reduce) {
        const { gsap } = await import("gsap");
        if (disposed) return;
        gsap.to(uniforms.uProgress, {
          value: 1,
          duration: 2.3,
          ease: "power3.out",
          delay: 0.25,
        });
      }

      // Pointer → world coords on the z=0 plane.
      const onPointer = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        uniforms.uMouse.value.set(nx * camera.right, ny * camera.top);
      };
      const onLeave = () => uniforms.uMouse.value.set(999, 999);
      if (!reduce) {
        window.addEventListener("pointermove", onPointer);
        window.addEventListener("pointerdown", onPointer);
        mount.addEventListener("pointerleave", onLeave);
      }

      const ro = new ResizeObserver(() => {
        const s = getSize();
        w = s.w;
        h = s.h;
        renderer.setSize(w, h);
        applyCamera();
      });
      ro.observe(mount);

      // Pause the loop when the hero is scrolled out of view.
      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !reduce && !raf) loop();
        },
        { threshold: 0 }
      );
      io.observe(mount);

      const clock = new THREE.Clock();
      let raf = 0;
      const render = () => {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      const loop = () => {
        if (disposed || !visible) {
          raf = 0;
          return;
        }
        render();
        raf = requestAnimationFrame(loop);
      };

      if (reduce) render();
      else loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(entranceRaf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onPointer);
        mount.removeEventListener("pointerleave", onLeave);
        geo.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount)
          mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [src]);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label={`${profile.name} — portrait`}
      className={cn("relative h-full w-full", className)}
    >
      {noGl && (
        // Static fallback when WebGL is unavailable.
        <svg
          viewBox="0 0 200 240"
          aria-hidden
          className="absolute inset-0 m-auto h-[78%] w-auto self-end text-brand/40"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
        >
          <circle cx="100" cy="62" r="42" fill="currentColor" opacity="0.5" />
          <path
            d="M28 240 C28 168 60 132 100 132 C140 132 172 168 172 240 Z"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      )}
      {(fallback || noGl) && (
        <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
          Add your cutout PNG
        </span>
      )}
    </div>
  );
}
