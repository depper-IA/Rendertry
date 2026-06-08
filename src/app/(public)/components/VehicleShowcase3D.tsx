'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrambleLabel from '@/components/ScrambleLabel';
import styles from './VehicleShowcase3D.module.css';

interface ShowcaseCard {
  src: string;
  name: string;
  tag: string;
}

// Labels verified against the actual photos — never claim a mod that is
// not visible in the frame. All photos show a complete vehicle.
const CARDS: ShowcaseCard[] = [
  { src: '/wheelblend/aston-black-wheel.webp', name: 'Aston Martin Vanquish', tag: 'Rines forjados' },
  { src: '/assets/bugatti-veyron.jpg', name: 'Bugatti Veyron', tag: 'Rines personalizados' },
  { src: '/assets/porsche-showcase.jpg', name: 'Porsche Taycan', tag: 'Rines deportivos' },
  { src: '/assets/mustang-gt.jpg', name: 'Ford Mustang GT', tag: 'Rines negros' },
  { src: '/assets/bmw-i8.jpg', name: 'BMW i8', tag: 'Llantas aero' },
  { src: '/assets/mercedes-slk.jpg', name: 'Mercedes-Benz SLK', tag: 'Rines AMG' },
  { src: '/assets/toyota-gt86.jpg', name: 'Toyota GT86', tag: 'Rines deportivos' },
  { src: '/wheelblend/afterImage.png', name: 'Toyota 4Runner', tag: 'Rines off-road' },
];

const N = CARDS.length;
const VISIBLE = 3; // front card + 3 peeking behind it

// Resting and hovered stack geometry (desktop reference values).
const REST = [
  { x: 0, y: 0, scale: 1, ry: 0, a: 1, z: 70 },
  { x: 78, y: -26, scale: 0.9, ry: -15, a: 0.8, z: 60 },
  { x: 134, y: -48, scale: 0.8, ry: -19, a: 0.5, z: 50 },
  { x: 172, y: -64, scale: 0.72, ry: -21, a: 0.28, z: 40 },
];
const HOVER = [
  { x: -84, y: 0, scale: 1.03, ry: 2, a: 1, z: 70 },
  { x: 178, y: -28, scale: 0.92, ry: -11, a: 0.92, z: 60 },
  { x: 332, y: -58, scale: 0.82, ry: -15, a: 0.6, z: 50 },
  { x: 454, y: -84, scale: 0.74, ry: -17, a: 0.34, z: 40 },
];
const HIDDEN = { x: 0, y: 0, scale: 0.66, ry: -22, a: 0, z: 30 };

function targetFor(pos: number, hovered: boolean, vw: number) {
  if (pos > VISIBLE) return { ...HIDDEN };
  const mobile = vw <= 768;
  const unit = mobile ? 0.5 : 1; // tighter fan on small screens
  const base = hovered && !mobile ? HOVER[pos] : REST[pos];
  return { x: base.x * unit, y: base.y * unit, scale: base.scale, ry: base.ry, a: base.a, z: base.z };
}

export default function VehicleShowcase3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);

  // GSAP positions every card based on its distance from the active one.
  const layout = (animate = true) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = (i - active + N) % N;
      const t = targetFor(pos, hovered, vw);
      gsap.set(el, { zIndex: t.z });
      gsap.to(el, {
        xPercent: -50,
        yPercent: -50,
        x: t.x,
        y: t.y,
        scale: t.scale,
        rotationY: t.ry,
        autoAlpha: t.a,
        duration: animate ? 0.85 : 0,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  };

  // Initial placement without animation (avoids first-paint flash).
  useLayoutEffect(() => {
    layout(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run GSAP layout whenever the front card or hover state changes.
  useEffect(() => {
    layout(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, hovered]);

  // Scroll drives which vehicle sits at the front of the deck.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        setActive(Math.min(N - 1, Math.floor(self.progress * N)));
      },
    });

    const onResize = () => layout(false);
    window.addEventListener('resize', onResize);

    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smoothly scroll to the band that brings card `i` to the front.
  const goTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const clamped = ((i % N) + N) % N;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((clamped + 0.5) / N) * scrollable, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className={styles.section} id="sliderSection">
      <div
        className={styles.sticky}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.head}>
          <h2 className={styles.title}>
            Resultados que <span>enamoran</span>
          </h2>
          <p className={styles.sub}>Hacé scroll para recorrer las transformaciones reales.</p>
        </div>

        <div className={styles.deck}>
          {CARDS.map((card, i) => (
            <div
              key={card.src}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`${styles.card} ${i === active ? styles.front : ''}`}
              onClick={() => goTo(i)}
              role="button"
              tabIndex={i === active ? 0 : -1}
              aria-hidden={i !== active}
            >
              <img src={card.src} alt={card.name} draggable={false} loading="lazy" decoding="async" />
              <div className={styles.scanline} />
              <div className={styles.meta}>
                <span className={styles.name}>{card.name}</span>
                <ScrambleLabel className={styles.tag} text={card.tag} play={i === active} />
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={() => goTo(active - 1)}
          aria-label="Vehículo anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className={`${styles.navBtn} ${styles.next}`}
          onClick={() => goTo(active + 1)}
          aria-label="Vehículo siguiente"
        >
          <ChevronRight size={20} />
        </button>

        <div className={styles.dots}>
          {CARDS.map((card, i) => (
            <button
              key={card.src}
              className={i === active ? styles.dotActive : styles.dot}
              onClick={() => goTo(i)}
              aria-label={`Ver ${card.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
