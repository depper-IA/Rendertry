import { Camera, Paintbrush, Disc3, Layers, PackagePlus, Download } from 'lucide-react';

// Six feature cells. Static presentational grid.
const FEATURES = [
  { Icon: Camera, title: 'Carga de imágenes', desc: 'Sube fotos en cualquier formato desde tu dispositivo. Almacenamiento seguro y privado garantizado.' },
  { Icon: Paintbrush, title: 'Cambio de pintura', desc: 'Prueba cientos de colores de carrocería. Clasicos, mate, perla y cromado disponibles en el catalogo.' },
  { Icon: Disc3, title: 'Catálogo de rines', desc: 'Compara modelos y tamaños de rines para encontrar los que mejor se adaptan a tu estilo y vehículo.' },
  { Icon: Layers, title: 'Wraps y vinilos', desc: 'Aplica diseños de vinilo completos o parciales. Texturas, patrones y colores sin límite creativo.' },
  { Icon: PackagePlus, title: 'Accesorios', desc: 'Agrega espoilers, retrovisores, detalles aerodinámicos y más para completar tu look personalizado.' },
  { Icon: Download, title: 'Descarga y comparte', desc: 'Exporta la imagen editada en alta resolución para compartirla o llevarla directo al taller.' },
];

export default function FeaturesSection() {
  return (
    <section className="section" id="funcionalidades">
      <div className="container mb-5">
        <h2 className="sec-title animate-hidden" style={{ textWrap: 'balance' }}>
          Todo lo que <span className="text-red">necesitas</span>
        </h2>
        <p className="sec-sub">Herramientas pensadas para quienes quieren personalizar su vehículo sin errores.</p>
      </div>
      <div className="container-fluid px-0">
        <div className="feat-grid">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div className="feat-cell animate-hidden" key={title}>
              <div className="feat-icon"><Icon size={20} /></div>
              <h5>{title}</h5>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
