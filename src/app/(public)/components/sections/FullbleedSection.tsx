// Full-bleed YouTube background with overlaid copy and stats. Static section.
export default function FullbleedSection() {
  return (
    <div className="fullbleed">
      <div className="fullbleed-video-container">
        <iframe
          src="https://www.youtube.com/embed/bWlgfsU9JJk?autoplay=1&mute=1&loop=1&playlist=bWlgfsU9JJk&controls=0&start=6&end=55&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className="fullbleed-overlay">
        <div className="container">
          <div className="fullbleed-inner">
            <div className="fullbleed-left">
              <div className="fullbleed-eyebrow">
                <span className="fb-dot" />
                <span data-scramble>Personalización visual</span>
              </div>
              <h2 className="fullbleed-title">
                Ve los cambios<br />
                <span style={{ color: 'var(--primary)' }}>antes</span> de hacerlos
              </h2>
              <p className="fullbleed-sub">
                Toma decisiones con confianza. Sin sorpresas en el taller, sin arrepentimientos después.
              </p>
              <div className="fullbleed-actions">
                <a href="/demo" className="btn-primary" data-scramble>Probar gratis</a>
                <a href="#galeria" className="btn-ghost" data-scramble>Ver galería</a>
              </div>
            </div>
            <div className="fullbleed-stats">
              <div className="fb-stat">
                <span className="fb-num">100%</span>
                <span className="fb-label">Visual</span>
              </div>
              <div className="fb-stat-divider" />
              <div className="fb-stat">
                <span className="fb-num">0</span>
                <span className="fb-label">Riesgos</span>
              </div>
              <div className="fb-stat-divider" />
              <div className="fb-stat">
                <span className="fb-num">4+</span>
                <span className="fb-label">Categorías</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
