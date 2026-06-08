'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Same charset + cadence as the global button scramble (k3-style).
const CHARS = '*&@#%$-_:/;!?+=<>';

interface ScrambleLabelProps {
  text: string;
  className?: string;
  /** Re-run the decode whenever this turns true (e.g. card becomes active). */
  play?: boolean;
}

/**
 * React-safe scramble label for components that re-render often (the 3D
 * showcase). The decoded text lives in React state, so parent re-renders never
 * clash with the animation (unlike the DOM-mutating global [data-scramble]).
 * Decodes left-to-right when `play` turns true and on hover.
 */
export default function ScrambleLabel({ text, className, play }: ScrambleLabelProps) {
  const [display, setDisplay] = useState(text);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    if (ivRef.current) clearInterval(ivRef.current);
    let iter = 0;
    ivRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < iter ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      );
      iter += 0.4;
      if (iter >= text.length) {
        if (ivRef.current) clearInterval(ivRef.current);
        setDisplay(text);
      }
    }, 45);
  }, [text]);

  useEffect(() => {
    if (play) run();
    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
    };
  }, [play, run]);

  return (
    <span className={className} onMouseEnter={run}>
      {display}
    </span>
  );
}
