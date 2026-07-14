"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TOOL SPHERE (Three.js)
 * ----------------------
 * The toolset as a 3D tag-cloud: each tool is a text sprite distributed evenly
 * over a sphere (Fibonacci), auto-rotating, draggable with inertia, with depth
 * fade front-to-back and an amber hover highlight (raycast).
 *
 * Progressive enhancement: only mounts on hover-capable, non-reduced-motion
 * devices — otherwise it renders nothing and the categorized list below stays
 * as the accessible source of truth.
 */

export function ToolSphere({ tools }: { tools: string[] }) {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    setMounted(true);

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

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.z = 6;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.cursor = "grab";
      wrap.appendChild(renderer.domElement);

      const BONE = new THREE.Color(0xf5f2ea);
      const AMBER = new THREE.Color(0xf7b23e);

      // Build a text-label sprite per tool.
      const makeLabel = (text: string) => {
        const pad = 24;
        const font = 700;
        const size = 52;
        const measure = document.createElement("canvas").getContext("2d")!;
        measure.font = `${font} ${size}px Inter, system-ui, sans-serif`;
        const tw = Math.ceil(measure.measureText(text).width);
        const c = document.createElement("canvas");
        c.width = tw + pad * 2;
        c.height = size + pad * 2;
        const ctx = c.getContext("2d")!;
        ctx.font = `${font} ${size}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, c.width / 2, c.height / 2);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        mat.color.copy(BONE);
        const sprite = new THREE.Sprite(mat);
        const scale = 0.0055;
        sprite.scale.set(c.width * scale, c.height * scale, 1);
        return sprite;
      };

      const R = 2.75;
      const group = new THREE.Group();
      const sprites = tools.map((t, i) => {
        const s = makeLabel(t);
        // Fibonacci sphere distribution.
        const phi = Math.acos(1 - (2 * (i + 0.5)) / tools.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        s.position.set(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.sin(phi) * Math.sin(theta),
          R * Math.cos(phi)
        );
        group.add(s);
        return s;
      });
      scene.add(group);

      // Drag + inertia + auto-spin.
      const rotVel = { x: 0, y: 0 };
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      const el = renderer.domElement;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        el.style.cursor = "grabbing";
      };
      const onUp = () => {
        dragging = false;
        el.style.cursor = "grab";
      };
      const onDrag = (e: PointerEvent) => {
        if (!dragging) return;
        rotVel.y += (e.clientX - lastX) * 0.0006;
        rotVel.x += (e.clientY - lastY) * 0.0006;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointermove", onDrag);

      // Hover highlight (raycast).
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-2, -2);
      const onHover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -(((e.clientY - r.top) / r.height) * 2 - 1)
        );
      };
      el.addEventListener("pointermove", onHover);
      el.addEventListener("pointerleave", () => ndc.set(-2, -2));

      const onResize = () => {
        const s = getSize();
        w = s.w;
        h = s.h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const tmp = new THREE.Vector3();
      let raf = 0;
      let visible = true;
      const loop = () => {
        if (disposed) return;
        if (!visible) {
          raf = 0; // paused off-screen; the observer restarts it
          return;
        }
        if (!document.hidden) {
          if (!dragging) {
            rotVel.y += (0.0016 - rotVel.y) * 0.02; // ease toward gentle auto-spin
          }
          group.rotation.y += rotVel.y;
          group.rotation.x += rotVel.x;
          group.rotation.x = Math.max(-1.1, Math.min(1.1, group.rotation.x));
          rotVel.x *= 0.92;
          rotVel.y *= 0.96;

          // Hover pick.
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObjects(sprites, false)[0]?.object;

          for (const s of sprites) {
            s.getWorldPosition(tmp);
            const depth = (tmp.z + R) / (2 * R); // 0 back → 1 front
            const mat = s.material as import("three").SpriteMaterial;
            const isHit = s === hit;
            mat.opacity = isHit ? 1 : 0.25 + depth * 0.75;
            mat.color.lerpColors(BONE, AMBER, isHit ? 1 : 0);
            const base = 0.9 + depth * 0.3;
            const k = (isHit ? 1.25 : 1) * base;
            const cw = (mat.map!.image as HTMLCanvasElement).width;
            const ch = (mat.map!.image as HTMLCanvasElement).height;
            s.scale.set(cw * 0.0055 * k, ch * 0.0055 * k, 1);
          }
          el.style.cursor = hit ? "pointer" : dragging ? "grabbing" : "grab";
          renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(loop);
        },
        { rootMargin: "200px" }
      );
      io.observe(wrap);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointermove", onDrag);
        el.removeEventListener("pointermove", onHover);
        window.removeEventListener("resize", onResize);
        sprites.forEach((s) => {
          const mat = s.material as import("three").SpriteMaterial;
          mat.map?.dispose();
          mat.dispose();
        });
        renderer.dispose();
        if (el.parentNode === wrap) wrap.removeChild(el);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [tools]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative mx-auto h-[360px] w-full max-w-3xl touch-none sm:h-[460px]"
    />
  );
}
