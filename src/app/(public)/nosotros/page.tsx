'use client';

import { Eye, Gauge, Code2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Member = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
};

const teamMembers: Member[] = [
  {
    name: 'Julián Caldas',
    initials: 'JC',
    role: 'Frontend y organización técnica',
    bio: 'Conecta la interfaz con la lógica de negocio y mantiene el proyecto ordenado mientras crece.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Samuel Wilkie',
    initials: 'SW',
    role: 'Desarrollo full stack',
    bio: 'Integra la generación con IA y diseña la arquitectura que sostiene cada render.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Juan Blandón',
    initials: 'JB',
    role: 'Frontend y UX/UI',
    bio: 'Cuida el detalle visual y el rendimiento para que la experiencia se sienta fluida.',
    github: '#',
    linkedin: '#',
  },
];

const pillars = [
  {
    Icon: Eye,
    title: 'Ver antes de decidir',
    text: 'Nadie debería invertir en rines o pintura imaginando el resultado. Primero se ve, después se decide.',
  },
  {
    Icon: Gauge,
    title: 'Rápido y sin fricción',
    text: 'Subir una foto y obtener el render toma segundos. Sin registro obligatorio para empezar a probar.',
  },
  {
    Icon: Code2,
    title: 'Hecho con criterio',
    text: 'Código limpio, rendimiento medido y una interfaz que no estorba. La tecnología trabaja en segundo plano.',
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
    <div className="about-page">
      <Navbar activePage="nosotros" />

      {/* HERO */}
      <section className="about-hero">
        <div className="container">
          <p className="about-eyebrow">
            <span className="about-eyebrow-line" />
            <span data-scramble>El equipo detrás de Rendertry</span>
          </p>
          <h1 className="about-hero-title">
            Construimos lo que nos hubiera gustado <span className="text-red">tener</span>
          </h1>
          <p className="about-hero-sub">
            Tres desarrolladores del Bootcamp Talento Tech con la misma idea fija: poder ver cómo
            queda un auto antes de gastar un peso en modificarlo.
          </p>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="about-mission">
        <div className="container about-mission-grid">
          <div className="about-mission-text">
            <h2 className="about-h2">Por qué existe Rendertry</h2>
            <p>
              Cambiar de rines, color o un wrap es una decisión cara y difícil de imaginar. La foto
              del catálogo nunca es tu auto, y el resultado real recién aparece cuando ya pagaste el
              trabajo.
            </p>
            <p>
              Rendertry resuelve ese salto. Subes la foto de tu vehículo, eliges el producto y la IA
              te muestra cómo quedaría sobre tu propio auto. La decisión deja de ser una apuesta.
            </p>
          </div>
          <figure className="about-mission-media">
            <img
              src="/assets/porsche-showcase.jpg"
              alt="Render de un Porsche personalizado con rines deportivos sobre la foto original"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="about-mission-tag">Render generado sobre la foto del vehículo</figcaption>
          </figure>
        </div>
      </section>

      {/* PILARES */}
      <section className="about-pillars-section">
        <div className="container">
          <h2 className="sec-title">Cómo trabajamos</h2>
          <div className="about-pillars">
            {pillars.map(({ Icon, title, text }) => (
              <article className="about-pillar" key={title}>
                <span className="about-pillar-icon">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="about-pillar-title">{title}</h3>
                <p className="about-pillar-text">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="about-team">
        <div className="container">
          <h2 className="sec-title">Quiénes lo hacen</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-avatar">
                  <span className="team-initials">{member.initials}</span>
                </div>
                <h4 className="team-name">{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-links">
                  <a href={member.github} aria-label={`GitHub de ${member.name}`} className="team-social">
                    <GithubIcon />
                  </a>
                  <a href={member.linkedin} aria-label={`LinkedIn de ${member.name}`} className="team-social">
                    <LinkedinIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final about-cta">
        <div className="cta-final-bg" />
        <div className="container about-cta-content">
          <h2 className="about-cta-title">Prueba tu próxima modificación antes de hacerla</h2>
          <p className="about-cta-sub">Gratis y sin registro. La primera prueba toma menos de un minuto.</p>
          <a href="/demo" className="btn-primary btn-lg" data-scramble>Probar Rendertry ahora</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
