'use client';

import { User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const teamMembers = [
  {
    name: 'Julián Caldas',
    role: 'Front End Junior y Organización Técnica',
    bio: 'Especialista en desarrollo web y lógica de negocio, enfocado en crear experiencias interactivas y escalables.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Samuel Wilkie',
    role: 'Desarrollador Full Stack',
    bio: 'Experto en SDD e integración de tecnologías y diseño de arquitecturas robustas para aplicaciones modernas.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Juan Blandón',
    role: 'Desarrollador Frontend Junior y UX/UI',
    bio: 'Apasionado por el código limpio y la optimización de rendimiento, garantizando interfaces fluidas y rápidas.',
    github: '#',
    linkedin: '#',
  },
];

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function NosotrosPage() {
  return (
    <div style={{ backgroundColor: '#0a0c10', color: '#f0f3f8', minHeight: '100vh' }}>
      <Navbar activePage="nosotros" />

      <div style={{ paddingTop: '6rem' }}>
        <section style={{ paddingBottom: '4rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.12) 0%, transparent 65%)' }}>
          <div className="container">
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#e63946', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span style={{ display: 'block', width: '24px', height: '2px', background: '#e63946' }} />
              El equipo detrás de Rendertry
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff' }}>
              CONOCE A LOS <span style={{ color: '#e63946' }}>CREADORES</span>
            </h1>
            <p style={{ color: '#9aa3b5', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.7 }}>
              Desarrolladores apasionados del Bootcamp Talento Tech uniendo fuerzas para crear la mejor herramienta de personalización automotriz impulsada por tecnología moderna.
            </p>
          </div>
        </section>

        <section style={{ paddingBottom: '8rem' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              {teamMembers.map((member) => (
                <div key={member.name} className="team-card">
                  <div className="team-avatar">
                    <User size={44} style={{ color: '#e63946' }} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{member.name}</h4>
                  <p style={{ color: '#e63946', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>{member.role}</p>
                  <p style={{ color: '#9aa3b5', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>{member.bio}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: 'auto' }}>
                    <a href={member.github} aria-label="GitHub" className="team-social">
                      <GithubIcon />
                    </a>
                    <a href={member.linkedin} aria-label="LinkedIn" className="team-social">
                      <LinkedinIcon />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-final" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
              ¿Listo para darle vida a tus proyectos?
            </h2>
            <a href="/demo" className="btn-primary btn-lg" data-scramble>Probar Rendertry ahora</a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
