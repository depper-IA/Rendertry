'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * First-load preloader (k3-style): brand wordmark + 0→100 counter + progress
 * bar, then fades out to reveal the page. Mounts once per full page load
 * (internal client navigations keep it mounted, so it does not replay).
 * Skipped under prefers-reduced-motion.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem('rt_preloaded') === '1';
    } catch {
      /* sessionStorage unavailable */
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      alreadyShown ||
      document.documentElement.classList.contains('skip-preloader')
    ) {
      setDone(true);
      return;
    }

    // Show once per session; subsequent loads skip it (effects already loaded).
    try {
      sessionStorage.setItem('rt_preloaded', '1');
    } catch {
      /* ignore */
    }
    document.documentElement.classList.add('is-preloading');

    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate() {
        const n = Math.round(counter.v);
        if (fillRef.current) fillRef.current.style.width = n + '%';
        if (pctRef.current) pctRef.current.textContent = String(n);
      },
      onComplete() {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete() {
            document.documentElement.classList.remove('is-preloading');
            setDone(true);
          },
        });
      },
    });

    return () => {
      tween.kill();
      document.documentElement.classList.remove('is-preloading');
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-logo">
          <span className="logo-render">RENDER</span>
          <span className="logo-try">TRY</span>
        </div>
        <div className="preloader-bar">
          <div ref={fillRef} className="preloader-fill" />
        </div>
        <div className="preloader-pct">
          <span ref={pctRef}>0</span>%
        </div>
      </div>
    </div>
  );
}
