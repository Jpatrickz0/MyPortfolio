"use client";

import { useEffect, useRef } from "react";

import { getQuality } from "@/lib/perf";

/**
 * AMBIENT BACKDROP (Three.js)
 * ---------------------------
 * A single full-screen shader quad that lives behind everything: a slow,
 * drifting amber "archive fog" (layered fbm noise) with faint dust, parallaxing
 * with the pointer and easing with scroll. Deliberately very low opacity so it
 * reads as atmosphere, not decoration — one signature backdrop that ties every
 * section together.
 *
 * Cheap by design: one quad, capped DPR, mediump. Skipped for reduced-motion
 * and when WebGL is unavailable; pauses when the tab is hidden.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uAspect;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uAspect;
    uv += uMouse * 0.15;
    uv.y += uScroll * 0.35;
    float t = uTime * 0.03;

    // Two drifting noise layers form the fog.
    float n = fbm(uv * 1.6 + vec2(t, -t * 0.6));
    n += 0.5 * fbm(uv * 3.4 - vec2(t * 0.8, t));
    n = smoothstep(0.35, 1.15, n);

    vec3 amber = vec3(0.97, 0.70, 0.24);
    vec3 col = amber * n;

    // Faint drifting dust.
    float dust = pow(fbm(uv * 9.0 + vec2(-t * 2.0, t * 1.4)), 5.0);
    col += amber * dust * 0.7;

    // Vignette so edges settle into the dark page.
    float vig = smoothstep(1.25, 0.2, length(vUv - 0.5) * 1.8);

    float alpha = (n * 0.10 + dust * 0.35) * vig;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function AmbientBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Decorative only — skip entirely on reduced-motion and weaker/mobile
    // devices so it never competes with the hero for the GPU.
    const q = getQuality();
    if (q.reduce || q.tier === "low") return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const wrap = wrapRef.current;
      if (!wrap || disposed) return;

      let W = window.innerWidth;
      let H = window.innerHeight;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        return;
      }
      renderer.setPixelRatio(1); // soft fog — full DPR is wasted here
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const uniforms = {
        uTime: { value: 0 },
        uAspect: { value: new THREE.Vector2(W / H, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
      };
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        })
      );
      scene.add(mesh);

      const target = { mx: 0, my: 0 };
      const onMove = (e: PointerEvent) => {
        target.mx = (e.clientX / W) * 2 - 1;
        target.my = -((e.clientY / H) * 2 - 1);
      };
      window.addEventListener("pointermove", onMove);

      const onResize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        renderer.setSize(W, H);
        uniforms.uAspect.value.set(W / H, 1);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;
      let last = -1;
      const loop = () => {
        if (disposed) return;
        const t = clock.getElapsedTime();
        // Throttle to ~30fps — the fog drifts slowly, so this is imperceptible
        // and halves its GPU cost.
        if (!document.hidden && t - last >= 1 / 30) {
          last = t;
          uniforms.uTime.value = t;
          uniforms.uMouse.value.x += (target.mx - uniforms.uMouse.value.x) * 0.08;
          uniforms.uMouse.value.y += (target.my - uniforms.uMouse.value.y) * 0.08;
          uniforms.uScroll.value = (window.scrollY || 0) / Math.max(H, 1);
          renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        mesh.geometry.dispose();
        (mesh.material as import("three").Material).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === wrap)
          wrap.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
