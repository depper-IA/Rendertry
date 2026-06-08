// Showcase gallery. Static presentational grid; first item spans tall.
const ITEMS = [
  { src: '/wheelblend/studio-macro-dark.jpg', alt: 'Detalle macro oscuro', label: 'Acabado Premium — Dark Macro', tall: true },
  { src: '/wheelblend/aston-no-wheel.webp', alt: 'Aston Martin sin rines', label: 'Aston Martin — Visualización', tall: false },
  { src: '/wheelblend/aston-black-wheel.webp', alt: 'Aston Martin rines negros', label: 'Aston Martin — Black wheels', tall: false },
  { src: '/wheelblend/wheel-brands-hero.webp', alt: 'Entusiasta de autos', label: 'Selección — Las mejores marcas', tall: false },
  { src: '/wheelblend/studio-macro-light.jpg', alt: 'Estudio macro claro', label: 'Detalle — Iluminación de estudio', tall: false },
];

export default function GallerySection() {
  return (
    <section className="section-sm" id="galeria" style={{ paddingTop: 0 }}>
      <div className="container mb-4">
        <h2 className="sec-title animate-hidden" style={{ textWrap: 'balance' }}>
          Expone tus diseños más <span className="text-red">innovadores</span>
        </h2>
      </div>
      <div className="container-fluid px-0">
        <div className="gallery">
          {ITEMS.map((it) => (
            <div className={`gallery-item${it.tall ? ' tall' : ''} animate-hidden`} key={it.src}>
              <img loading="lazy" src={it.src} alt={it.alt} />
              <div className="gallery-label">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
