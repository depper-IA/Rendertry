import { Check } from 'lucide-react';

// Pricing plans. Static presentational section. `included: false` features render
// the muted "x" icon used in the original markup.
type Feature = { text: string; included: boolean };
type Plan = {
  badge: string;
  badgeClass?: string;
  name: string;
  price: string;
  desc: string;
  features: Feature[];
  cta: { href: string; label: string; className: string };
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    badge: 'Gratis',
    name: 'Básico',
    price: '$0',
    desc: 'Perfecto para explorar la plataforma.',
    features: [
      { text: '5 renders al mes', included: true },
      { text: 'Catálogo básico de rines', included: true },
      { text: 'Descarga en HD', included: true },
      { text: 'Sin marca de agua — Pro', included: false },
      { text: 'Wraps y vinilos — Pro', included: false },
    ],
    cta: { href: '#proceso', label: 'Empezar gratis', className: 'btn-ghost btn-block' },
  },
  {
    badge: 'Más popular',
    badgeClass: 'pricing-badge-pro',
    name: 'Pro',
    price: '$49.900',
    desc: 'Para entusiastas y talleres.',
    features: [
      { text: 'Renders ilimitados', included: true },
      { text: 'Catálogo completo +200 rines', included: true },
      { text: 'Descarga 4K sin marca de agua', included: true },
      { text: 'Wraps, vinilos y accesorios', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: { href: '#proceso', label: 'Comenzar — 7 días gratis', className: 'btn-primary btn-block' },
    featured: true,
  },
  {
    badge: 'Equipos',
    name: 'Business',
    price: '$149.900',
    desc: 'Para talleres y negocios de rines.',
    features: [
      { text: 'Todo lo de Pro', included: true },
      { text: 'Hasta 10 usuarios', included: true },
      { text: 'Panel de gestión de clientes', included: true },
      { text: 'Acceso a API', included: true },
      { text: 'Soporte dedicado 24/7', included: true },
    ],
    cta: { href: '#', label: 'Contactar ventas', className: 'btn-ghost btn-block' },
  },
];

function XMark() {
  return (
    <span style={{ color: 'var(--text-muted)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </span>
  );
}

export default function PricingSection() {
  return (
    <section className="section" id="precios">
      <div className="container">
        <h2 className="sec-title mb-2" style={{ textWrap: 'balance' }}>
          Elige tu <span style={{ color: 'var(--primary)' }}>plan</span>
        </h2>
        <p className="sec-sub mb-5">Empieza Ahora. Escala cuando lo necesites.</p>
        <div className="row g-4 justify-content-center">
          {PLANS.map((plan) => (
            <div className="col-md-4" key={plan.name}>
              <div className={`pricing-card${plan.featured ? ' pricing-featured' : ' animate-hidden'}`}>
                <div className={`pricing-badge${plan.badgeClass ? ` ${plan.badgeClass}` : ''}`}>
                  <span data-scramble>{plan.badge}</span>
                </div>
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">{plan.price}<span>/mes</span></div>
                <p className="pricing-desc">{plan.desc}</p>
                <ul className="pricing-features">
                  {plan.features.map((f) =>
                    f.included ? (
                      <li key={f.text}><Check size={14} style={{ color: '#10b981' }} /> {f.text}</li>
                    ) : (
                      <li key={f.text}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <XMark />
                          {f.text}
                        </span>
                      </li>
                    )
                  )}
                </ul>
                <a href={plan.cta.href} className={plan.cta.className} data-scramble>{plan.cta.label}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
