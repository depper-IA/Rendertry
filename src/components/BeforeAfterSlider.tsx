'use client';

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BeforeAfterSlider.module.css';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = 'ANTES',
  afterLabel = 'DESPUÉS',
}: BeforeAfterSliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const before = beforeRef.current;
    const handle = handleRef.current;
    if (!wrapper || !before || !handle) return;

    let dragging = false;
    let isUserActive = false; // Tracks if the user is hovering or dragging
    let angle = 1.5; // Start radian (sine(1.5) is ~1.0, near center/right)
    let currentPct = 0.5;
    let lastTimestamp = 0;
    let animFrameId: number;

    const updateDOM = (pct: number) => {
      pct = Math.min(Math.max(pct, 0.02), 0.98);
      const rightPct = (1 - pct) * 100;
      before.style.clipPath = `inset(0 ${rightPct}% 0 0)`;
      handle.style.left = `${pct * 100}%`;
      currentPct = pct;
    };

    const setPosition = (clientX: number) => {
      const rect = wrapper.getBoundingClientRect();
      const pct = (clientX - rect.left) / rect.width;
      updateDOM(pct);
    };

    // Autoplay Loop using RequestAnimationFrame & DeltaTime
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isUserActive && !dragging) {
        // Slow speed for clean high-end presentation
        const speed = 0.0012; 
        angle += deltaTime * speed;
        
        // Sine-wave oscillation for smooth acceleration/deceleration at boundaries
        const pct = 0.5 + Math.sin(angle) * 0.42;
        updateDOM(pct);
      } else {
        // Synchronize loop angle to match manual interaction position
        const sinVal = Math.min(Math.max((currentPct - 0.5) / 0.42, -0.999), 0.999);
        angle = Math.asin(sinVal);
      }
      animFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animFrameId = requestAnimationFrame(animate);

    const onMouseDown = (e: MouseEvent) => { 
      dragging = true; 
      isUserActive = true; 
      setPosition(e.clientX); 
    };
    const onMouseMove = (e: MouseEvent) => { 
      if (dragging) setPosition(e.clientX); 
    };
    const onMouseUp = () => { 
      dragging = false; 
    };

    const onTouchStart = (e: TouchEvent) => { 
      dragging = true; 
      isUserActive = true; 
      setPosition(e.touches[0].clientX); 
    };
    const onTouchMove = (e: TouchEvent) => { 
      if (dragging) setPosition(e.touches[0].clientX); 
    };
    const onTouchEnd = () => { 
      dragging = false; 
    };

    const onMouseEnter = () => {
      isUserActive = true;
    };

    const onMouseLeave = () => {
      if (!dragging) {
        isUserActive = false;
      }
    };

    wrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    wrapper.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    wrapper.addEventListener('mouseenter', onMouseEnter);
    wrapper.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameId);
      wrapper.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      wrapper.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      wrapper.removeEventListener('mouseenter', onMouseEnter);
      wrapper.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.after}>
        <img src={afterSrc} alt={afterAlt} />
        <span className={`${styles.label} ${styles.labelAfter}`}>{afterLabel}</span>
      </div>
      <div className={styles.before} ref={beforeRef}>
        <img src={beforeSrc} alt={beforeAlt} />
        <span className={`${styles.label} ${styles.labelBefore}`}>{beforeLabel}</span>
      </div>
      <div className={styles.handle} ref={handleRef}>
        <div className={styles.line} />
        <div className={styles.btn}>
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>
        <div className={styles.line} />
      </div>
    </div>
  );
}