'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Disc3, Car, Layers, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './VehicleScrollSlider.module.css';

const SLIDE_COUNT = 4;

export default function VehicleScrollSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToSlide = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, idx));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: sectionTop + (clamped / (SLIDE_COUNT - 1)) * scrollable, behavior: 'smooth' });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stickyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--smx', ((e.clientX - rect.left) / rect.width - 0.5).toString());
    el.style.setProperty('--smy', ((e.clientY - rect.top) / rect.height - 0.5).toString());
  };

  const handleMouseLeave = () => {
    const el = stickyRef.current;
    if (!el) return;
    el.style.setProperty('--smx', '0');
    el.style.setProperty('--smy', '0');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const tween = gsap.to(track, {
      xPercent: -75,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        snap: {
          snapTo: 1 / (SLIDE_COUNT - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
        onUpdate(self) {
          setCurrentSlide(Math.round(self.progress * (SLIDE_COUNT - 1)));
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles['slider-section']} id="sliderSection">
      <div
        ref={stickyRef}
        className={styles['slider-sticky']}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={trackRef} className={styles['slider-wrapper']}>

          {/* Slide 1: Porsche */}
          <div className={`${styles.slide} ${currentSlide === 0 ? styles.active : ''}`} data-bg="#f0f4ff">
            <div className={styles['slide-background']}>
              <img src="/assets/slider/porsche.jpg" alt="" className={styles['slide-bg-img']} />
              <div className={styles['slide-bg-overlay']} />
            </div>
            <div className={styles['slide-content']}>
              <span className={styles['slide-tag']}>
                <Disc3 size={14} /> Porsche
              </span>
              <h2>Porsche 911</h2>
              <p>Visualiza cómo quedan los rines deportivos y el color exacto en tu Porsche antes de pasar por el taller.</p>
              <a href="#funcionalidades" className="btn-primary">Personalizar</a>
            </div>
            <div className={styles['slide-showcase']}>
              <div className={styles['showcase-inner']}>
                <img src="/assets/slider/porsche.jpg" alt="Porsche 911" className={styles['showcase-img']} />
                <div className={styles['showcase-glow']} />
                <div className={styles['showcase-glass-reflection']} />
              </div>
            </div>
          </div>

          {/* Slide 2: BMW */}
          <div className={`${styles.slide} ${currentSlide === 1 ? styles.active : ''}`} data-bg="#f0f8f2">
            <div className={styles['slide-background']}>
              <img src="/assets/slider/bmw.jpg" alt="" className={styles['slide-bg-img']} />
              <div className={styles['slide-bg-overlay']} />
            </div>
            <div className={styles['slide-content']}>
              <span className={styles['slide-tag']}>
                <Car size={14} /> BMW
              </span>
              <h2>BMW Serie M</h2>
              <p>Prueba acabados mate, metalizados o cromados en tu BMW. Sin compromiso hasta estar seguro.</p>
              <a href="#funcionalidades" className="btn-primary">Explorar colores</a>
            </div>
            <div className={styles['slide-showcase']}>
              <div className={styles['showcase-inner']}>
                <img src="/assets/slider/bmw.jpg" alt="BMW Serie M" className={styles['showcase-img']} />
                <div className={styles['showcase-glow']} />
                <div className={styles['showcase-glass-reflection']} />
              </div>
            </div>
          </div>

          {/* Slide 3: Mercedes */}
          <div className={`${styles.slide} ${currentSlide === 2 ? styles.active : ''}`} data-bg="#fff5f7">
            <div className={styles['slide-background']}>
              <img src="/assets/slider/mercedes_benz.jpg" alt="" className={styles['slide-bg-img']} />
              <div className={styles['slide-bg-overlay']} />
            </div>
            <div className={styles['slide-content']}>
              <span className={styles['slide-tag']}>
                <Layers size={14} /> Mercedes
              </span>
              <h2>Mercedes-Benz</h2>
              <p>Aplica wraps de vinilo premium o diseños exclusivos en tu Mercedes. Muestra el resultado antes de empezar.</p>
              <a href="#funcionalidades" className="btn-primary">Ver disenos</a>
            </div>
            <div className={styles['slide-showcase']}>
              <div className={styles['showcase-inner']}>
                <img src="/assets/slider/mercedes_benz.jpg" alt="Mercedes-Benz" className={styles['showcase-img']} />
                <div className={styles['showcase-glow']} />
                <div className={styles['showcase-glass-reflection']} />
              </div>
            </div>
          </div>

          {/* Slide 4: Camioneta */}
          <div className={`${styles.slide} ${currentSlide === 3 ? styles.active : ''}`} data-bg="#f3f6ff">
            <div className={styles['slide-background']}>
              <img src="/assets/slider/camioneta.jpeg" alt="" className={styles['slide-bg-img']} />
              <div className={styles['slide-bg-overlay']} />
            </div>
            <div className={styles['slide-content']}>
              <span className={styles['slide-tag']}>
                <Truck size={14} /> SUV
              </span>
              <h2>Camioneta 4x4</h2>
              <p>Rines off-road, accesorios y colores para tu pick-up. Ve cómo queda antes de invertir.</p>
              <a href="#funcionalidades" className="btn-primary">Ver accesorios</a>
            </div>
            <div className={styles['slide-showcase']}>
              <div className={styles['showcase-inner']}>
                <img src="/assets/slider/camioneta.jpeg" alt="Camioneta 4x4" className={styles['showcase-img']} />
                <div className={styles['showcase-glow']} />
                <div className={styles['showcase-glass-reflection']} />
              </div>
            </div>
          </div>

        </div>

        <button
          className={`${styles['slider-btn']} ${styles.prev}`}
          onClick={() => scrollToSlide(currentSlide - 1)}
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className={`${styles['slider-btn']} ${styles.next}`}
          onClick={() => scrollToSlide(currentSlide + 1)}
          aria-label="Siguiente imagen"
        >
          <ChevronRight size={20} />
        </button>

        <div className={styles['slider-dots']}>
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${currentSlide === i ? styles.active : ''}`}
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a diapositiva ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
