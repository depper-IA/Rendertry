'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const VIDEO_SRC = '/assets/hero.mp4';
const POSTER = '/assets/frames/bmw-m4/frame-192.webp';

export default function GSAPHeroClient() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const charOrderRef = useRef<number[]>([]);
  const groupRef = useRef<HTMLElement[]>([]);

  // Scroll-scrubbed hero video. A single 1080p clip uses a fraction of the RAM
  // of a 192-frame canvas sequence, and the browser only decodes what it shows.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.pause();
    const state = { p: 0 };
    let duration = 0;

    const apply = () => {
      const p = state.p;

      // progress 0 = rim far (last frame), 1 = rim close (first frame)
      if (duration > 0) {
        const t = (1 - p) * duration;
        if (Number.isFinite(t)) {
          try {
            video.currentTime = t;
          } catch {
            /* seek not ready yet */
          }
        }
      }

      // Title letters slide off to the right one by one (rightmost first);
      // the rest drifts right and fades.
      const chars = charsRef.current;
      const orders = charOrderRef.current;
      const n = chars.length;
      if (n) {
        const dist = window.innerWidth * 0.9;
        const win = 0.5;
        const span = 0.5;
        for (let i = 0; i < n; i++) {
          const c = chars[i];
          if (!c) continue;
          const order = orders[i] ?? 0;
          const cp = Math.min(1, Math.max(0, (p - order * span) / win));
          c.style.transform = `translate3d(${(cp * dist).toFixed(1)}px, 0, 0)`;
          c.style.opacity = (1 - cp).toFixed(3);
        }
      }
      const group = groupRef.current;
      for (let i = 0; i < group.length; i++) {
        const el = group[i];
        if (!el) continue;
        el.style.transform = `translate3d(${(p * window.innerWidth * 0.6).toFixed(1)}px, 0, 0)`;
        el.style.opacity = Math.max(0, 1 - p * 1.7).toFixed(3);
      }
    };

    const onMeta = () => {
      duration = video.duration || 0;
      apply();
    };
    video.addEventListener('loadedmetadata', onMeta);
    if (video.readyState >= 1) onMeta();

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate(self) {
        state.p = self.progress;
        apply();
      },
    });

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      st.kill();
    };
  }, []);

  // Hero text entrance — plays the moment the home preloader starts wiping up.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const badge = overlay.querySelector<HTMLElement>('.hero-badge');
    const subtitle = overlay.querySelector<HTMLElement>('.gsap-3d-scroll-subtitle');
    const actions = overlay.querySelector<HTMLElement>('.gsap-3d-scroll-actions');

    // Split each title line into per-letter spans.
    const chars: HTMLElement[] = [];
    overlay.querySelectorAll<HTMLElement>('.hero-title-inner').forEach((line) => {
      const text = line.textContent ?? '';
      line.textContent = '';
      for (const ch of text) {
        const s = document.createElement('span');
        s.className = 'hero-char';
        s.textContent = ch === ' ' ? ' ' : ch;
        line.appendChild(s);
        chars.push(s);
      }
    });
    charsRef.current = chars;
    // Per-line exit order: rightmost letter of each line leaves first.
    charOrderRef.current = chars.map((c) => {
      const sibs = Array.from(c.parentElement?.children ?? []);
      const idx = sibs.indexOf(c);
      const denom = sibs.length - 1 || 1;
      return (sibs.length - 1 - idx) / denom;
    });
    groupRef.current = [badge, subtitle, actions].filter(Boolean) as HTMLElement[];

    gsap.set(badge, { opacity: 0, y: -12 });
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    gsap.set([subtitle, actions], { opacity: 0, y: 18 });

    const lines = overlay.querySelectorAll<HTMLElement>('.hero-title-line');
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      gsap
        .timeline({
          onComplete() {
            gsap.set(lines, { overflow: 'visible' });
          },
        })
        .to(badge, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        .to(chars, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, '-=0.25')
        .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .to(actions, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4');
    };

    window.addEventListener('rt:preloader-done', play);
    const fallback = window.setTimeout(play, 2200);

    return () => {
      window.removeEventListener('rt:preloader-done', play);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section ref={sectionRef} className="gsap-3d-scroll-section">
      <div className="gsap-3d-scroll-canvas-container">
        <video
          ref={videoRef}
          className="gsap-hero-video"
          src={VIDEO_SRC}
          poster={POSTER}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div ref={overlayRef} className="gsap-3d-scroll-overlay">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span data-scramble>IA Visual · Resultados Instantáneos</span>
          </div>
          <h1 className="gsap-3d-scroll-title">
            <span className="hero-title-line"><span className="hero-title-inner">Tu auto,</span></span>
            <span className="hero-title-line"><span className="hero-title-inner">tu visión.</span></span>
          </h1>
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
