'use client';

import { useEffect } from 'react';

// Exact charset + cadence audited from k3studios.ae (agency-animations.js):
// setInterval 35ms, iter += 0.5 (~70ms/char). CHARS below.
const CHARS = '*&@#%$-_:/;!?+=<>';

/**
 * Global hover scramble for [data-scramble] elements (links, buttons, badges).
 *
 * Layout-stable: the real text stays in flow but invisible (.scr-base) to hold
 * the box width, while the scrambling glyphs are painted in an absolutely
 * positioned overlay (.scr-over) that does NOT affect layout. This avoids the
 * box/navbar resizing that a proportional font causes when characters change.
 * Restores plain text on finish/leave. Respects prefers-reduced-motion.
 */
export default function ScrambleInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bind = (el: HTMLElement) => {
      if (el.dataset.scrambleReady) return;
      el.dataset.scrambleReady = '1';
      const orig = (el.textContent ?? '').trim();
      if (!orig) return;
      // Trigger on the whole box, not just the text node: prefer the enclosing
      // button/link, else the badge/pill container (parent), else the element.
      const trigger =
        (el.closest('a, button') as HTMLElement) || (el.parentElement as HTMLElement) || el;
      let iv: ReturnType<typeof setInterval> | null = null;

      const restore = () => {
        if (iv) {
          clearInterval(iv);
          iv = null;
        }
        el.textContent = orig;
      };

      trigger.addEventListener('mouseenter', () => {
        if (iv) clearInterval(iv);

        // Build overlay structure: hidden base holds width, overlay shows glyphs.
        el.textContent = '';
        const wrap = document.createElement('span');
        wrap.className = 'scr-wrap';
        const base = document.createElement('span');
        base.className = 'scr-base';
        base.textContent = orig;
        const over = document.createElement('span');
        over.className = 'scr-over';
        over.textContent = orig;
        wrap.appendChild(base);
        wrap.appendChild(over);
        el.appendChild(wrap);

        let iter = 0;
        iv = setInterval(() => {
          over.textContent = orig
            .split('')
            .map((c, i) => {
              if (c === ' ') return ' ';
              return i < iter ? orig[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
          iter += 0.4;
          if (iter >= orig.length) restore();
        }, 45);
      });

      trigger.addEventListener('mouseleave', restore);
    };

    const scan = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>('[data-scramble]').forEach(bind);

    scan(document);

    const mo = new MutationObserver((muts) => {
      muts.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches('[data-scramble]')) bind(n);
            scan(n);
          }
        }),
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, []);

  return null;
}
