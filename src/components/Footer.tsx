'use client';

import { ArrowRight } from 'lucide-react';

const platformLinks = [
  { href: '/#proceso', label: 'Cómo funciona' },
  { href: '/#funcionalidades', label: 'Funcionalidades' },
  { href: '/#galeria', label: 'Galería' },
  { href: '/#historias', label: 'Casos de uso' },
];

const companyLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '#', label: 'Términos de servicio' },
  { href: '#', label: 'Privacidad' },
];

// Big sliding wordmark across the top of the footer (k3-style text marquee).
// Decorative repetition, so it's aria-hidden. Duplicated once for the seamless
// -50% loop.
const MARQUEE_PHRASES = [
  'Tu auto, tu visión',
  'Pruébalo gratis',
  'Personaliza sin límites',
  'Ve antes de invertir',
  'Rines, pintura y wraps',
  'Sin sorpresas en el taller',
  'Resultados en segundos',
  'Visualización con IA',
  'Decisiones con confianza',
  'Tu próxima modificación, hoy',
];

function FooterMarquee() {
  const sequence = [...MARQUEE_PHRASES, ...MARQUEE_PHRASES];
  return (
    <div className="footer-marquee" aria-hidden="true">
      <div className="footer-marquee-track">
        {sequence.map((phrase, i) => (
          <span className="footer-marquee-group" key={`${phrase}-${i}`}>
            <span className="footer-marquee-item">{phrase}</span>
            <span className="footer-marquee-sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer-pro">
      <FooterMarquee />
      <div className="container">
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-4">
              <a href="/" className="footer-logo">
                <img src="/assets/logos/logo.png" alt="Rendertry Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                <span className="footer-logo-text">
                  <span className="footer-logo-render">RENDER</span>
                  <span className="footer-logo-try">TRY</span>
                </span>
              </a>
              <p className="footer-desc">
                Sistema web de personalización visual automotriz. Visualiza modificaciones en tu vehículo con confianza y precisión antes de invertir un solo peso.
              </p>
              <div className="footer-social">
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                </a>
                <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                </a>
              </div>
            </div>

            <div className="col-lg-2">
              <h5 className="footer-title" style={{ color: 'var(--primary)' }}><span data-scramble>Plataforma</span></h5>
              <ul className="footer-links">
                {platformLinks.map(({ href, label }) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-2">
              <h5 className="footer-title" style={{ color: 'var(--primary)' }}><span data-scramble>Compañía</span></h5>
              <ul className="footer-links">
                {companyLinks.map(({ href, label }) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4">
              <h5 className="footer-title">Suscríbete al boletín</h5>
              <p className="footer-text">
                Recibe las últimas noticias sobre personalización y actualizaciones de Rendertry.
              </p>
              <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  className="footer-input"
                  placeholder="Correo electrónico"
                  aria-label="Correo electrónico"
                />
                <button type="submit" className="btn-primary" aria-label="Suscribirse">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Rendertry. Todos los derechos reservados.</p>
          <p className="footer-credits-pro">
            Desarrollado en <strong>Bootcamp Talento Tech</strong> por Julián, Samuel y Juan.
          </p>
        </div>
      </div>
    </footer>
  );
}
