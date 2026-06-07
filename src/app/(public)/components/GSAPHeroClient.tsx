'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TOTAL_FRAMES = 192;
const URL_PATTERN = '/assets/frames/bmw-m4/frame-%03d.webp';

export default function GSAPHeroClient() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_FRAMES));
  const scrollTriggerReady = useRef(false);
  const frameObjRef = useRef({ frame: TOTAL_FRAMES - 1 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Canvas sizing ──────────────────────────────────────────────────────
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(frameObjRef.current.frame);
    };

    // ── Draw a single frame ────────────────────────────────────────────────
    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img?.naturalWidth) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;

      let dw: number, dh: number, dx: number, dy: number;
      if (imgRatio > canvasRatio) {
        dh = h; dw = h * imgRatio;
        dx = (w - dw) / 2; dy = 0;
      } else {
        dw = w; dh = w / imgRatio;
        dx = 0; dy = (h - dh) / 2;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // ── Init GSAP ScrollTrigger (called once all frames are ready) ─────────
    const initScrollTrigger = () => {
      if (scrollTriggerReady.current) return;
      scrollTriggerReady.current = true;

      gsap.to(frameObjRef.current, {
        frame: 0,
        ease: 'none',
        onUpdate() {
          const frame = Math.round(frameObjRef.current.frame);
          drawFrame(frame);
          if (overlayRef.current) {
            // progress: 0 = frame 191, 1 = frame 0
            const progress = 1 - frame / (TOTAL_FRAMES - 1);
            overlayRef.current.style.opacity = Math.max(0, 1 - progress * 3).toString();
          }
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });
    };

    // ── Load frames ────────────────────────────────────────────────────────
    resizeCanvas();

    let loaded = 0;
    const firstFrameIndex = TOTAL_FRAMES - 1; // frame 191 is what the user sees first

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = i + 1;

      img.onload = () => {
        imagesRef.current[i] = img;
        loaded++;

        // Show hero as soon as the first visible frame is ready
        if (i === firstFrameIndex) {
          resizeCanvas();
          drawFrame(firstFrameIndex);
        }

        // Enable scroll animation once every frame is loaded
        if (loaded === TOTAL_FRAMES) {
          initScrollTrigger();
        }
      };

      img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) initScrollTrigger();
      };

      img.src = URL_PATTERN.replace('%03d', frameNum.toString().padStart(3, '0'));
    }

    const handleResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="gsap-3d-scroll-section">
      <div className="gsap-3d-scroll-canvas-container">
        <canvas ref={canvasRef} id="gsap-3d-scroll-canvas" />
        <div ref={overlayRef} className="gsap-3d-scroll-overlay">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span data-scramble>IA Visual · Resultados Instantáneos</span>
          </div>
          <h1 className="gsap-3d-scroll-title">Tu auto,<br />tu visión.</h1>
          <p className="gsap-3d-scroll-subtitle">
            Prueba rines, pintura, wraps y accesorios directamente sobre la foto de tu vehículo — en segundos, gratis, sin sorpresas en el taller.
          </p>
          <div className="gsap-3d-scroll-actions">
            <a href="/demo" className="btn-primary btn-lg" data-scramble>Probar gratis</a>
            <a href="#galeria" className="btn-ghost btn-lg" data-scramble>Ver galería</a>
          </div>
        </div>
      </div>
    </section>
  );
}
