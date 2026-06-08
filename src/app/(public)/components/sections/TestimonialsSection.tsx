import { Quote } from 'lucide-react';

// Three user testimonials. Static presentational section.
const TESTIMONIALS = [
  {
    quote: 'Probé 6 juegos de rines en 10 minutos y fui al taller con la decisión tomada.',
    avatar: '/wheelblend/avatar-1.jpg',
    name: 'Carlos M.',
    role: 'BMW Serie M — Medellín',
  },
  {
    quote: 'Mis clientes llegan al taller con el render en mano. Las ventas de rines subieron.',
    avatar: '/wheelblend/avatar-2.jpg',
    name: 'Taller AutoPro',
    role: 'Bogotá, Colombia',
  },
  {
    quote: 'Lo uso para mis reels. El resultado parece un render profesional de verdad.',
    avatar: '/wheelblend/avatar-3.jpg',
    name: 'Rubén V.',
    role: 'Creador de contenido',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section" id="testimonios" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <h2 className="sec-title mb-2" style={{ textWrap: 'balance' }}>
          Lo que dicen <span style={{ color: 'var(--primary)' }}>nuestros usuarios</span>
        </h2>
        <p className="sec-sub mb-5">Entusiastas reales. Resultados reales.</p>
        <div className="row g-4">
          {TESTIMONIALS.map((t) => (
            <div className="col-md-4" key={t.name}>
              <div className="story-card animate-hidden" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '2.5rem' }}>
                <div className="mb-4" style={{ color: 'var(--primary)', opacity: 0.6 }}>
                  <Quote size={24} />
                </div>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-main)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
