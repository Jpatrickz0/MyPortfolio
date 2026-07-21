"use client";

import { useEffect, useRef } from "react";

import { getQuality } from "@/lib/perf";

/**
 * TAKEOVER HERO FX (Three.js)
 * ---------------------------
 * A full-quad shader over the case-study hero: a slow amber light-sweep + fine
 * grain that gives the cover a cinematic, "archival film" feel. Additive, very
 * low opacity, pointer-events-none. Skipped for reduced-motion / weak devices.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    float d = uv.x * 0.6 + (1.0 - uv.y) * 0.4;
    float band = 1.0 - abs(fract(d - uTime * 0.05) * 2.0 - 1.0);
    float sweep = pow(smoothstep(0.4, 1.0, band), 3.0);
    float grain = hash(floor(uv * uRes / 2.5) + floor(uTime * 22.0)) - 0.5;
    vec3 amber = vec3(0.97, 0.70, 0.24);
    vec3 col = amber * sweep * 0.6 + vec3(grain) * 0.06;
    float alpha = sweep * 0.10 + abs(grain) * 0.035;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function TakeoverHeroFx() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = getQuality();
    if (q.reduce || q.tier === "low") return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const wrap = wrapRef.current;
      if (!wrap || disposed) return;

      const getSize = () => {
        const r = wrap.getBoundingClientRect();
        return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
      };
      let { w, h } = getSize();

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        return;
      }
      renderer.setPixelRatio(1);
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(w, h) },
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
          blending: THREE.AdditiveBlending,
        })
      );
      scene.add(mesh);

      const ro = new ResizeObserver(() => {
        const s = getSize();
        w = s.w;
        h = s.h;
        renderer.setSize(w, h);
        uniforms.uRes.value.set(w, h);
      });
      ro.observe(wrap);

      const clock = new THREE.Clock();
      let raf = 0;
      let last = -1;
      const loop = () => {
        if (disposed) return;
        const t = clock.getElapsedTime();
        if (!document.hidden && t - last >= 1 / 30) {
          last = t;
          uniforms.uTime.value = t;
          renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
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
      className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen"
    />
  );
}
