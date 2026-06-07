'use client';

import { useEffect, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Zap, ShieldCheck } from 'lucide-react';
import Widget from '@/components/Widget/Widget';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STEPS = [
  {
    icon: Upload,
    n: 'PASO 01',
    title: 'Subí tu foto',
    text: 'Cargá una imagen de tu vehículo desde cualquier ángulo. Sin registro, sin fricción.',
  },
  {
    icon: Sparkles,
    n: 'PASO 02',
    title: 'Elegí el estilo',
    text: 'Seleccioná rines, wraps o pintura. Nuestra IA entiende la geometría real del auto.',
  },
  {
    icon: ImageIcon,
    n: 'PASO 03',
    title: 'Visualizá el resultado',
    text: 'En segundos obtenés un render fotorrealista listo para compartir o descargar.',
  },
];

const STATS = [
  { num: '< 10s', label: 'Tiempo de render' },
  { num: '87+', label: 'Modelos de rines' },
  { num: '4K', label: 'Calidad de salida' },
  { num: '100%', label: 'Sin registro' },
];

const FEATURES = [
  { icon: Zap, title: 'Render instantáneo', text: 'Resultados en menos de 10 segundos' },
  { icon: Sparkles, title: 'IA fotorrealista', text: 'Entiende la geometría real del auto' },
  { icon: ShieldCheck, title: 'Sin registro', text: 'Probalo gratis, sin crear cuenta' },
];

export default function DemoPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroRef.current.style.setProperty('--mx', x.toString());
    heroRef.current.style.setProperty('--my', y.toString());
  };

  const handleMouseLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--mx', '0');
    heroRef.current.style.setProperty('--my', '0');
  };

  // Hero entrance animation
  useEffect(() => {
    const init = async () => {
      const { animate } = await import('motion');
      const a = animate as any;
      a('.demo-hero-badge', { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] });
      a('.demo-hero-title', { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] });
      a('.demo-hero-sub', { opacity: [0, 1], y: [30, 0] }, { duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] });
      a('.demo-hero-actions', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.55, ease: [0.23, 1, 0.32, 1] });
    };
    init();
  }, []);

  // Scroll reveals — heavy fade-up as elements enter viewport
  useEffect(() => {
    const init = async () => {
      const { inView, animate, stagger } = await import('motion');
      const a = animate as any;
      const iv = inView as any;
      iv('.dx-reveal', (el: Element) => {
        a(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.8, ease: [0.23, 1, 0.32, 1] });
      }, { amount: 0.2 });
      iv('.dx-steps', () => {
        a('.dx-step', { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.12), duration: 0.6, ease: [0.23, 1, 0.32, 1] });
      }, { amount: 0.3 });
    };
    init();
  }, []);

  return (
    <div className="dx-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage="plataforma" />

      <main style={{ flex: 1, marginTop: 'var(--nav-height)' }}>
        {/* HERO — immersive parallax */}
        <section
          ref={heroRef}
          className="demo-hero"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="demo-hero-bg">
            <img src="/assets/maxresdefault.jpg" alt="" className="demo-hero-img" />
            <div className="demo-hero-overlay" />
            <div className="demo-hero-grid" />
          </div>
          <div className="demo-hero-content">
            <div className="demo-hero-badge">
              <span className="demo-badge-dot" />
              <span data-scramble>IA Visual · Resultados Instantáneos</span>
            </div>
            <h1 className="demo-hero-title">
              Personalizá tu <span className="demo-hero-accent">vehículo</span>
            </h1>
            <p className="demo-hero-sub">
              Visualizá rines, pintura y wraps sobre la foto de tu auto. Sin registro. En segundos.
            </p>
            <div className="demo-hero-actions">
              <a href="#widget-section" className="btn-primary btn-lg" data-scramble>Comenzar ahora</a>
            </div>
          </div>
          <div className="demo-hero-scroll-indicator">
            <div className="scroll-line" />
          </div>
        </section>

        {/* STATS strip — floats over the hero seam */}
        <div className="dx-container">
          <div className="dx-stats">
            {STATS.map((s) => (
              <div key={s.label} className="dx-stat">
                <div className="dx-stat-num">{s.num}</div>
                <div className="dx-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET — studio editorial split: context rail + wide widget pane */}
        <section id="widget-section" className="dx-section">
          <div className="dx-container">
            <div className="dx-studio">
              <aside className="dx-studio-aside dx-reveal">
                <span className="dx-eyebrow"><span className="dx-eyebrow-dot" /><span data-scramble>Probalo ahora</span></span>
                <h2 className="dx-title">Tu auto, tu <span className="dx-accent">visión</span></h2>
                <p className="dx-subtitle">
                  Cargá una foto y dejá que la IA haga el resto. Render fotorrealista en tiempo real.
                </p>
                <ul className="dx-features">
                  {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.title} className="dx-feature">
                        <span className="dx-feature-icon"><Icon size={18} /></span>
                        <span className="dx-feature-text">
                          <strong>{f.title}</strong>
                          <span>{f.text}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </aside>
              <div className="dx-studio-main dx-reveal">
                <div className="dx-widget-shell">
                  <div className="dx-widget-core">
                    <Widget brandSlug="demo-brand" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA — bento */}
        <section className="dx-section" style={{ paddingTop: 0 }}>
          <div className="dx-container">
            <div className="dx-section-head dx-reveal">
              <span className="dx-eyebrow"><span className="dx-eyebrow-dot" /><span data-scramble>Así de fácil</span></span>
              <h2 className="dx-title">Tres pasos para <span className="dx-accent">transformarlo</span></h2>
            </div>
            <div className="dx-steps">
              {STEPS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.n} className="dx-step">
                    <div className="dx-step-core">
                      <div className="dx-step-num">{s.n}</div>
                      <div className="dx-step-icon"><Icon size={24} /></div>
                      <h3 className="dx-step-title">{s.title}</h3>
                      <p className="dx-step-text">{s.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="dx-section" style={{ paddingTop: 0 }}>
          <div className="dx-container">
            <div className="dx-cta dx-reveal">
              <div className="dx-cta-core">
                <span className="dx-eyebrow"><ShieldCheck size={13} /><span data-scramble>Prueba gratuita · 7 días</span></span>
                <h2 className="dx-cta-title">¿Listo para tu taller?</h2>
                <p className="dx-cta-sub">
                  Integrá Rendertry en tu negocio y dejá que tus clientes visualicen antes de comprar.
                </p>
                <a href="/register" className="btn-primary btn-lg" data-scramble>Empezar gratis</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
