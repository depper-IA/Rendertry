import type { ReactNode } from 'react';
import { Paintbrush, Layers } from 'lucide-react';

// Six use-case cards. Static presentational section. Some icons are inline SVGs
// kept identical to the original markup; two reuse lucide icons.
type UseCase = { icon: ReactNode; tag: string; title: string; desc: string };

const USE_CASES: UseCase[] = [
  {
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    tag: 'Entusiasta',
    title: 'Prueba rines antes de comprar',
    desc: 'Visualiza diferentes estilos y tamaños de rines sobre tu vehículo antes de invertir en el taller.',
  },
  {
    icon: <Paintbrush size={13} />,
    tag: 'Propietario',
    title: 'Cambia el color de tu auto',
    desc: 'Evalúa colores clásicos, mate, perla o cromado. Toma la decisión correcta antes de pintarlo.',
  },
  {
    icon: <Layers size={13} />,
    tag: 'Creativo',
    title: 'Aplica wraps y vinilos',
    desc: 'Prueba wraps de vinilo completos o parciales. Texturas, patrones y colores sin límite.',
  },
  {
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    tag: 'Taller',
    title: 'Presenta propuestas visuales',
    desc: 'Muestra a tus clientes cómo quedarán las modificaciones antes de comenzar el trabajo.',
  },
  {
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    tag: 'Negocio',
    title: 'Vende más con visualizaciones',
    desc: 'Negocios de rines y accesorios pueden mostrar el producto montado en el auto del cliente.',
  },
  {
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
    tag: 'Creador',
    title: 'Contenido que impacta',
    desc: 'Genera builds visuales para redes sociales que parecen renders profesionales.',
  },
];

export default function UseCasesSection() {
  return (
    <section className="section" id="historias" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <h2 className="sec-title mb-5" style={{ textWrap: 'balance' }}>
          Para <span style={{ color: 'var(--primary)' }}>cada perfil</span>
        </h2>
        <div className="row g-3">
          {USE_CASES.map((uc) => (
            <div className="col-md-6 col-lg-4" key={uc.tag}>
              <div className="story-card animate-hidden">
                <div className="story-num">
                  {uc.icon}
                  &nbsp;{uc.tag}
                </div>
                <h5>{uc.title}</h5>
                <p>{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
