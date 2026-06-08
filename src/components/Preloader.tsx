'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Home-page preloader (k3-style): brand wordmark + 0→100 counter + progress
 * bar, then slides up to reveal the page. Only runs on the landing page ("/")
 * so navigating to other pages is not interrupted. Skipped under
 * prefers-reduced-motion.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only the main page shows the preloader.
    if (
      window.location.pathname !== '/' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDone(true);
      return;
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
        // Reveal: fire the hero entrance the moment the curtain starts wiping up
        // so the text rises in together with the preloader sliding away.
        document.documentElement.classList.remove('is-preloading');
        window.dispatchEvent(new Event('rt:preloader-done'));
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete() {
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
