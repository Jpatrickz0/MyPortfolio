"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/content";
import { cn } from "@/lib/utils";

/**
 * MEMORY CELLS — the Vault as a grid of archive plates (Three.js + GSAP)
 * ---------------------------------------------------------------------
 * Each project is a sealed "memory cell": its cover renders undeveloped — a
 * coarse amber-graded mosaic with scanlines — and DECODES into a sharp, full
 * colour image when hovered (echoing the loader's "indexing"). CLICKING a cell
 * UNLOCKS it: a GSAP 3D flip + zoom + amber flash, then it opens into the
 * project modal.
 *
 * Architecture: a single WebGL layer sits BEHIND the grid; each cell is a
 * transparent "window" whose bounding rect a textured plane is matched to every
 * frame (a perspective camera in 1-unit-per-pixel space, so a plane at z=0 lands
 * pixel-perfect on its cell and rotateY reads as a true 3D turn).
 *
 * Progressive enhancement: rows are real buttons with the cover <img> and
 * archival metadata, so touch / reduced-motion / no-WebGL users get a clean
 * static grid that still opens the modal.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uTex;
  uniform float uReveal;   // 0 = sealed/undeveloped, 1 = decoded
  uniform float uFlash;    // unlock flash
  uniform float uTime;
  uniform vec2 uSize;      // plane size in px (for blocks + rounded corners)
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  void main() {
    float rev = uReveal;
    vec3 amber = vec3(0.97, 0.70, 0.24);

    // Mosaic that refines from coarse blocks to full resolution.
    float blocks = mix(16.0, 900.0, rev * rev);
    vec2 aspect = vec2(uSize.x / max(uSize.y, 1.0), 1.0);
    vec2 grid = vec2(blocks) * aspect / max(aspect.x, 1.0);
    vec2 buv = (floor(vUv * grid) + 0.5) / grid;
    vec2 suv = mix(buv, vUv, smoothstep(0.55, 1.0, rev));
    vec3 col = texture2D(uTex, suv).rgb;

    // Undeveloped grade: desaturate toward warm amber.
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 graded = mix(vec3(l), l * amber * 1.35, 0.65);
    col = mix(graded, col, rev);

    // Scanlines that fade as it develops.
    float scan = 0.82 + 0.18 * sin(vUv.y * uSize.y * 1.1);
    col *= mix(scan, 1.0, rev);

    // Static flicker while sealed.
    float n = hash(floor(vUv * blocks) + floor(uTime * 9.0));
    col += (1.0 - rev) * (n - 0.5) * 0.10;

    // Sweeping decode boundary (a scan-line rising as it develops).
    float edge = smoothstep(0.025, 0.0, abs(vUv.y - (1.0 - rev)));
    col += edge * amber * 0.6 * (1.0 - rev) * step(0.02, rev);

    // Unlock flash.
    col = mix(col, amber * 1.5, uFlash * 0.6);

    // Base dim so a sealed plate never reads as pure black.
    col = max(col, amber * 0.03);

    // Rounded-corner alpha mask (matches the cell frame).
    vec2 pPx = (vUv - 0.5) * uSize;
    vec2 halfSize = uSize * 0.5;
    float r = 14.0;
    vec2 q = abs(pPx) - (halfSize - r);
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);

    gl_FragColor = vec4(col, alpha);
  }
`;

type Cell = {
  mesh: import("three").Mesh;
  mat: import("three").ShaderMaterial;
  state: { rotY: number; scaleMul: number; zPush: number };
};

export function VaultCells({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
}) {
  const [hover, setHover] = useState(-1);
  const [glActive, setGlActive] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    develop: (i: number) => void;
    unlock: (i: number) => void;
  } | null>(null);

  useEffect(() => {
    if (hover >= 0) apiRef.current?.develop(hover);
    else apiRef.current?.develop(-1);
  }, [hover]);

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, gsapMod] = await Promise.all([
        import("three"),
        import("gsap"),
      ]);
      const gsap = gsapMod.gsap;
      const wrap = wrapRef.current;
      const canvasWrap = canvasWrapRef.current;
      if (!wrap || !canvasWrap || disposed) return;

      const getWrap = () => wrap.getBoundingClientRect();
      let wr = getWrap();
      let W = Math.max(1, wr.width);
      let H = Math.max(1, wr.height);

      const scene = new THREE.Scene();
      const FOV = 40;
      const camera = new THREE.PerspectiveCamera(FOV, W / H, 1, 8000);
      const setCam = () => {
        camera.fov = FOV;
        camera.aspect = W / H;
        // 1 world unit == 1 px at the z=0 plane.
        camera.position.z = H / (2 * Math.tan((FOV * Math.PI) / 180 / 2));
        camera.updateProjectionMatrix();
      };
      setCam();

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
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      canvasWrap.appendChild(renderer.domElement);

      const loader = new THREE.TextureLoader();
      const geo = new THREE.PlaneGeometry(1, 1);
      const cells: Cell[] = projects.map((p) => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTex: { value: null },
            uReveal: { value: 0 },
            uFlash: { value: 0 },
            uTime: { value: 0 },
            uSize: { value: new THREE.Vector2(400, 250) },
          },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        if (p.cover) {
          loader.load(p.cover, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            mat.uniforms.uTex.value = tex;
          });
        }
        const mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        scene.add(mesh);
        return { mesh, mat, state: { rotY: 0, scaleMul: 1, zPush: 0 } };
      });

      setGlActive(true);

      apiRef.current = {
        develop: (i: number) => {
          cells.forEach((c, j) =>
            gsap.to(c.mat.uniforms.uReveal, {
              value: j === i ? 1 : 0,
              duration: j === i ? 0.7 : 0.5,
              ease: "power2.out",
            })
          );
        },
        unlock: (i: number) => {
          const c = cells[i];
          if (!c) return;
          gsap.killTweensOf(c.state);
          gsap.killTweensOf(c.mat.uniforms.uReveal);
          gsap.killTweensOf(c.mat.uniforms.uFlash);
          gsap.to(c.mat.uniforms.uReveal, { value: 1, duration: 0.2 });
          const tl = gsap.timeline();
          tl.to(c.state, { scaleMul: 1.16, duration: 0.32, ease: "power2.out" }, 0);
          tl.to(c.state, { zPush: 160, duration: 0.42, ease: "power2.out" }, 0);
          tl.to(c.state, { rotY: -0.55, duration: 0.42, ease: "power2.inOut" }, 0);
          tl.to(c.mat.uniforms.uFlash, { value: 1, duration: 0.22, ease: "power2.in" }, 0.14);
          tl.to(c.mat.uniforms.uFlash, { value: 0, duration: 0.3 }, 0.36);
          // Open the modal as the plate turns fully toward the viewer, then
          // quietly reset the transform behind the modal.
          tl.add(() => onOpen(projects[i]), 0.42);
          tl.to(c.state, { scaleMul: 1, zPush: 0, rotY: 0, duration: 0.01 }, 0.7);
        },
      };

      // Read each cell's live rect and match its plane to it (pixel space).
      const syncCell = (c: Cell, el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const cx = r.left - wr.left + r.width / 2;
        const cy = r.top - wr.top + r.height / 2;
        (c.mat.uniforms.uSize.value as import("three").Vector2).set(
          r.width,
          r.height
        );
        c.mesh.position.set(
          cx - W / 2,
          H / 2 - cy,
          c.state.zPush
        );
        c.mesh.scale.set(r.width * c.state.scaleMul, r.height * c.state.scaleMul, 1);
        c.mesh.rotation.y = c.state.rotY;
      };

      // Cache the cell elements once — they never change, so re-querying every
      // frame would be wasted work.
      const els = Array.from(
        wrap.querySelectorAll<HTMLElement>("[data-cell]")
      );

      let raf = 0;
      let visible = true;
      const clock = new THREE.Clock();
      const tick = () => {
        if (disposed) return;
        if (!visible) {
          raf = 0; // paused off-screen; the observer restarts it
          return;
        }
        wr = getWrap();
        const t = clock.getElapsedTime();
        cells.forEach((c, i) => {
          c.mat.uniforms.uTime.value = t;
          const el = els[i];
          if (el) syncCell(c, el);
        });
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Pause the render loop while the vault is scrolled off-screen.
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(tick);
        },
        { rootMargin: "200px" }
      );
      io.observe(wrap);

      const onResize = () => {
        wr = getWrap();
        W = Math.max(1, wr.width);
        H = Math.max(1, wr.height);
        setCam();
        renderer.setSize(W, H);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        cells.forEach((c) => {
          gsap.killTweensOf(c.state);
          gsap.killTweensOf(c.mat.uniforms.uReveal);
          gsap.killTweensOf(c.mat.uniforms.uFlash);
          const tex = c.mat.uniforms.uTex.value as import("three").Texture | null;
          tex?.dispose();
          c.mat.dispose();
        });
        geo.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === canvasWrap)
          canvasWrap.removeChild(renderer.domElement);
        apiRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [projects, onOpen]);

  return (
    <div ref={wrapRef} className="relative">
      {/* WebGL layer — behind the cells, showing through their windows. */}
      <div
        ref={canvasWrapRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            data-cell
            data-cursor="hover"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onClick={() => {
              if (glActive && apiRef.current) apiRef.current.unlock(i);
              else onOpen(p);
            }}
            className="group reticle relative z-10 aspect-[16/10] overflow-hidden rounded-xl border border-border text-left"
          >
            {/* Cover — visible as the fallback; hidden once WebGL takes over. */}
            {p.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  glActive ? "opacity-0" : "opacity-100"
                )}
              />
            )}

            {/* Vignette so metadata stays legible over any cover. */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/85 via-transparent to-background/20" />

            {/* Top-left: archival address + status */}
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.25em]">
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  hover === i ? "bg-brand" : "bg-muted-foreground/50"
                )}
              />
              <span className="text-muted-foreground">
                MEM://{String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-brand/80">
                {hover === i ? "· RECALLING" : "· SEALED"}
              </span>
            </div>

            {/* Bottom-left: title + meta */}
            <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                  {p.title}
                </h3>
                <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category} · {p.year}
                </div>
              </div>
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background/50 backdrop-blur transition-all duration-300",
                  hover === i && "border-brand bg-brand text-brand-foreground"
                )}
              >
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
