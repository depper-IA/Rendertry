'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Per-navigation transition. Next remounts this template on every route change,
 * so we play a brand "curtain reveal": a fixed panel covers the new page for a
 * beat and wipes upward. Only the fixed overlay is animated (never a wrapper
 * around the content) so the fixed navbar / sticky sections are not affected.
 * No-op under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = curtainRef.current;
    if (!el) return;
    // Fast, distinct from the preloader: a quick clip-path wipe-up reveal.
    gsap.set(el, { display: 'block', clipPath: 'inset(0 0 0 0)' });
    const tween = gsap.to(el, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.45,
      ease: 'power4.inOut',
      onComplete() {
        gsap.set(el, { display: 'none' });
      },
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <>
      <div ref={curtainRef} className="page-curtain" aria-hidden="true" />
      {children}
    </>
  );
}
