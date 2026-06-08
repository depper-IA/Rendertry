import { ShieldCheck, Zap, Download, CheckCircle2 } from 'lucide-react';

// Final call-to-action with stacked Porsche/Ferrari cards. Static section.
export default function CtaFinalSection() {
  return (
    <section className="cta-final">
      <div className="cta-final-bg" />
      <div className="cta-grid-overlay" />
      <div className="container cta-final-content">
        <div className="cta-inner">
          <div className="cta-left">
            <div className="cta-badge">
              <span className="cta-badge-dot" />
              <span data-scramble>Empieza hoy — es gratis</span>
            </div>
            <h2 className="cta-title">
              Tu auto,<br />
              tu <span className="cta-highlight">visión.</span>
            </h2>
            <p className="cta-sub">
              Visualiza el auto de tus sueños antes de invertir un solo peso.
            </p>
            <div className="cta-actions">
              <a href="/contacto" className="btn-primary" data-scramble>Crear cuenta gratis</a>
              <a href="#proceso" className="btn-ghost" data-scramble>Ver cómo funciona</a>
            </div>
            <div className="cta-trust">
              <div className="cta-trust-item">
                <ShieldCheck size={14} />
                Sin tarjeta de crédito
              </div>
              <div className="cta-trust-sep" />
              <div className="cta-trust-item">
                <Zap size={14} />
                Resultados en segundos
              </div>
              <div className="cta-trust-sep" />
              <div className="cta-trust-item">
                <Download size={14} />
                Descarga HD gratis
              </div>
            </div>
          </div>

          <div className="cta-right">
            <div className="cta-card-stack">
              <div className="cta-card cta-card-back">
                <img src="/assets/gallery-porsche.jpg" alt="Porsche" className="cta-card-img" loading="lazy" decoding="async" />
                <div className="cta-card-label">Porsche 911 — Rines deportivos</div>
              </div>
              <div className="cta-card cta-card-front">
                <img src="/assets/ferrari.webp" alt="Ferrari" className="cta-card-img" loading="lazy" decoding="async" />
                <div className="cta-card-label">Ferrari — Pintura personalizada</div>
                <div className="cta-card-badge">
                  <CheckCircle2 size={13} />
                  <span data-scramble>Vista previa lista</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
