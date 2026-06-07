'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Site-wide smooth scrolling (Lenis) synced to GSAP ScrollTrigger so existing
 * scroll-driven sections (hero, 3D showcase) stay in lockstep. Disabled when
 * the user prefers reduced motion. Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Expose for programmatic scrolls (e.g. anchor navigation) elsewhere.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Fluid in-page anchor navigation: any link whose href has a #hash that
    // resolves on the current page scrolls smoothly via Lenis (offset for nav).
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const href = link.getAttribute('href') || '';
      if (!href.includes('#')) return;

      // Same-page anchor → smooth scroll via Lenis.
      const hash = href.slice(href.indexOf('#'));
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return; // hash not on this page → let the browser navigate
      e.preventDefault();
      const navH =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 70;
      lenis.scrollTo(target as HTMLElement, { offset: -navH - 12, duration: 1.4 });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
