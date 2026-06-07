'use client';

import { useState, useRef, useEffect } from 'react';
import GSAPHeroClient from './(public)/components/GSAPHeroClient';
import VehicleShowcase3D from './(public)/components/VehicleShowcase3D';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import {
  Disc3,
  Layers,
  UploadCloud,
  ArrowRight,
  Check,
  Zap,
  Shield,
  CloudDownload,
  Star,
  Camera,
  Paintbrush,
  PackagePlus,
  Download,
  PlayCircle,
  Image,
  Tag,
  Users,
  Mail,
  Menu,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Quote,
} from 'lucide-react';

const STEP2_PRODUCTS = {
  RIN: [
    { id: 0, img: "/wheelblend/FIFTEEN52-TRAVERSE-BLACK.png", alt: "Fifteen52" },
    { id: 1, img: "/wheelblend/ENKEI-RPF1-SILVER.png", alt: "Enkei" },
    { id: 2, img: "/wheelblend/WELD-S71.png", alt: "Weld" },
    { id: 3, img: "/wheelblend/BBS-E88.png", alt: "BBS" }
  ],
  WRAP: [
    { id: 0, img: "/assets/wraps/wrap-satin-black.webp", alt: "Satin Black" },
    { id: 1, img: "/assets/wraps/wrap-gloss-silver.webp", alt: "Gloss Silver" },
    { id: 2, img: "/assets/wraps/wrap-satin-white.webp", alt: "Satin White" },
    { id: 3, img: "/assets/wraps/wrap-matte-red.webp", alt: "Matte Red" }
  ],
  PAINT: [
    { id: 0, img: "/assets/wraps/wrap-matte-red.webp", alt: "Racing Red" },
    { id: 1, img: "/assets/wraps/wrap-satin-black.webp", alt: "Midnight Black" },
    { id: 2, img: "/assets/wraps/wrap-satin-white.webp", alt: "Pearl White" },
    { id: 3, img: "/assets/wraps/wrap-chrome-gold.webp", alt: "Chrome Gold" }
  ]
};

const RESULT_PREVIEWS = {
  RIN: "/wheelblend/aston-black-wheel.webp",
  WRAP: "/wheelblend/afterImage.png",
  PAINT: "/assets/car-result.jpg"
};

export default function HomePage() {
  useScrollAnimations();
  const [step2Category, setStep2Category] = useState<'RIN' | 'WRAP' | 'PAINT'>('RIN');
  const [step2ActiveProduct, setStep2ActiveProduct] = useState(1);

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      {/* ================================================
          HEADER / NAV
          ================================================ */}
      <Navbar activePage="plataforma" />

      {/* ================================================
          GSAP HERO — FIRST SECTION
          ================================================ */}
      <GSAPHeroClient />

      {/* ================================================
          CONTENT WRAPPER — ALL SECTIONS BELOW HERO
          ================================================ */}
      <div className="content-wrapper-overlap">

        {/* MARQUEE — Wheel brands */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            <div className="marquee-item">
              <img src="/assets/wheelblend/bbs.png" alt="BBS" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/hre.png" alt="HRE" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/volk.png" alt="Volk" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/rotiform.png" alt="Rotiform" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/advan.png" alt="Advan" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/work.png" alt="Work" className="marquee-logo" />
            </div>
            {/* Duplicate for seamless loop */}
            <div className="marquee-item">
              <img src="/assets/wheelblend/bbs.png" alt="BBS" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/hre.png" alt="HRE" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/volk.png" alt="Volk" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/rotiform.png" alt="Rotiform" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/advan.png" alt="Advan" className="marquee-logo" />
            </div>
            <div className="marquee-item">
              <img src="/assets/wheelblend/work.png" alt="Work" className="marquee-logo" />
            </div>
          </div>
        </div>

        {/* ================================================
            STEPS SECTION — "Así de fácil"
            ================================================ */}
        <section className="steps-section" id="proceso">
          <div className="container">
            <h2 className="text-center mb-5 sec-title animate-hidden" style={{ textWrap: 'balance' }}>Así de fácil</h2>
            <div className="steps-container">
              {/* Step 1 */}
              <div className="step-process-card step-card animate-hidden">
                <div className="step-number">01</div>
                <h4>Sube tu imagen</h4>
                <p>Arrastra la foto de tu vehículo aquí.</p>
                <div className="upload-box upload-box-interactive">
                  <UploadCloud className="upload-icon-animated" size={32} />
                  <p>Arrastra tu imagen aquí</p>
                  <button className="btn-primary btn-sm" data-scramble>Seleccionar imagen</button>
                </div>
              </div>

              <div className="step-arrow">
                <ArrowRight size={24} />
              </div>

              {/* Step 2 */}
              <div className="step-process-card step-card animate-hidden">
                <div className="step-number">02</div>
                <h4>Elige el producto</h4>
                <p>Selecciona un rine, wrap o color.</p>
                <div className="category-tabs">
                  {(['RIN', 'WRAP', 'PAINT'] as const).map((cat) => (
                    <button 
                      key={cat}
                      className={`category-tab ${step2Category === cat ? 'active' : ''}`}
                      onClick={() => {
                        setStep2Category(cat);
                        setStep2ActiveProduct(0); // Reset a primer producto
                      }}
                    >
                      {cat === 'RIN' && 'Rines'}
                      {cat === 'WRAP' && 'Wraps'}
                      {cat === 'PAINT' && 'Pintura'}
                    </button>
                  ))}
                </div>
                <div className="rims-row rendertry-product-grid">
                  {STEP2_PRODUCTS[step2Category].map((prod) => (
                    <div 
                      key={prod.id}
                      className={`rim-item-sm ${step2ActiveProduct === prod.id ? 'active' : ''}`}
                      onClick={() => setStep2ActiveProduct(prod.id)}
                    >
                      <img src={prod.img} alt={prod.alt} />
                      {step2ActiveProduct === prod.id && (
                        <div className="check-badge">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="step-arrow">
                <ArrowRight size={24} />
              </div>

              {/* Step 3 */}
              <div className="step-process-card step-card animate-hidden">
                <div className="step-number">03</div>
                <h4>Mira el resultado</h4>
                <p>Guarda o comparte tu imagen personalizada.</p>
                <div className="result-box result-box-interactive">
                  <div className="result-img-wrapper">
                    <img 
                      src={RESULT_PREVIEWS[step2Category]} 
                      alt="Resultado de personalización" 
                      style={{ 
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        opacity: 1,
                        transform: 'scale(1)' 
                      }} 
                    />
                    <div className="result-scanline" />
                    <div className="result-reflection" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            SHOWCASE 3D — scroll-driven stacked deck
            ================================================ */}
        <VehicleShowcase3D />

        {/* ================================================
            FULLBLEED VIDEO SECTION — YouTube embed
            ================================================ */}
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
                    Personalización visual
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

        {/* ================================================
            BEFORE / AFTER SLIDER SECTION
            ================================================ */}
        <section className="ba-section" id="comparador">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="sec-title animate-hidden" style={{ textWrap: 'balance' }}>
                Ve el <span style={{ color: 'var(--primary)' }}>antes y después</span>
              </h2>
              <p className="sec-sub">Arrastra el divisor para comparar el vehículo original con los rines seleccionados.</p>
            </div>
            <BeforeAfterSlider
              beforeSrc="/assets/a-b/camioneta0.jpg"
              afterSrc="/assets/a-b/camioneta1.jpg"
              beforeAlt="Camioneta original"
              afterAlt="Camioneta personalizada"
            />
          </div>
        </section>

        {/* ================================================
            FUNCIONALIDADES SECTION — 6 feature cells
            ================================================ */}
        <section className="section" id="funcionalidades">
          <div className="container mb-5">
            <h2 className="sec-title animate-hidden" style={{ textWrap: 'balance' }}>
              Todo lo que <span className="text-red">necesitas</span>
            </h2>
            <p className="sec-sub">Herramientas pensadas para quienes quieren personalizar su vehículo sin errores.</p>
          </div>
          <div className="container-fluid px-0">
            <div className="feat-grid">
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><Camera size={20} /></div>
                <h5>Carga de imágenes</h5>
                <p>Sube fotos en cualquier formato desde tu dispositivo. Almacenamiento seguro y privado garantizado.</p>
              </div>
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><Paintbrush size={20} /></div>
                <h5>Cambio de pintura</h5>
                <p>Prueba cientos de colores de carrocería. Clasicos, mate, perla y cromado disponibles en el catalogo.</p>
              </div>
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><Disc3 size={20} /></div>
                <h5>Catálogo de rines</h5>
                <p>Compara modelos y tamaños de rines para encontrar los que mejor se adaptan a tu estilo y vehículo.</p>
              </div>
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><Layers size={20} /></div>
                <h5>Wraps y vinilos</h5>
                <p>Aplica diseños de vinilo completos o parciales. Texturas, patrones y colores sin límite creativo.</p>
              </div>
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><PackagePlus size={20} /></div>
                <h5>Accesorios</h5>
                <p>Agrega espoilers, retrovisores, detalles aerodinámicos y más para completar tu look personalizado.</p>
              </div>
              <div className="feat-cell animate-hidden">
                <div className="feat-icon"><Download size={20} /></div>
                <h5>Descarga y comparte</h5>
                <p>Exporta la imagen editada en alta resolución para compartirla o llevarla directo al taller.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            GALERIA SECTION
            ================================================ */}
        <section className="section-sm" id="galeria" style={{ paddingTop: 0 }}>
          <div className="container mb-4">
            <h2 className="sec-title animate-hidden" style={{ textWrap: 'balance' }}>
              Expone tus diseños más <span className="text-red">innovadores</span>
            </h2>
          </div>
          <div className="container-fluid px-0">
            <div className="gallery">
              <div className="gallery-item tall animate-hidden">
                <img loading="lazy" src="/wheelblend/studio-macro-dark.jpg" alt="Detalle macro oscuro" />
                <div className="gallery-label">Acabado Premium — Dark Macro</div>
              </div>
              <div className="gallery-item animate-hidden">
                <img loading="lazy" src="/wheelblend/aston-no-wheel.webp" alt="Aston Martin sin rines" />
                <div className="gallery-label">Aston Martin — Visualización</div>
              </div>
              <div className="gallery-item animate-hidden">
                <img loading="lazy" src="/wheelblend/aston-black-wheel.webp" alt="Aston Martin rines negros" />
                <div className="gallery-label">Aston Martin — Black wheels</div>
              </div>
              <div className="gallery-item animate-hidden">
                <img loading="lazy" src="/wheelblend/wheel-brands-hero.webp" alt="Entusiasta de autos" />
                <div className="gallery-label">Selección — Las mejores marcas</div>
              </div>
              <div className="gallery-item animate-hidden">
                <img loading="lazy" src="/wheelblend/studio-macro-light.jpg" alt="Estudio macro claro" />
                <div className="gallery-label">Detalle — Iluminación de estudio</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            TESTIMONIOS SECTION — 3 testimonials
            ================================================ */}
        <section className="section" id="testimonios" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <h2 className="sec-title mb-2" style={{ textWrap: 'balance' }}>
              Lo que dicen <span style={{ color: 'var(--primary)' }}>nuestros usuarios</span>
            </h2>
            <p className="sec-sub mb-5">Entusiastas reales. Resultados reales.</p>
            <div className="row g-4">
              {/* Testimonio 1 */}
              <div className="col-md-4">
                <div className="story-card animate-hidden" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '2.5rem' }}>
                  <div className="mb-4" style={{ color: 'var(--primary)', opacity: 0.6 }}>
                    <Quote size={24} />
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-main)' }}>
                    &ldquo;Probé 6 juegos de rines en 10 minutos y fui al taller con la decisión tomada.&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src="/wheelblend/avatar-1.jpg"
                      alt="Carlos M."
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Carlos M.</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BMW Serie M — Medellín</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="col-md-4">
                <div className="story-card animate-hidden" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '2.5rem' }}>
                  <div className="mb-4" style={{ color: 'var(--primary)', opacity: 0.6 }}>
                    <Quote size={24} />
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-main)' }}>
                    &ldquo;Mis clientes llegan al taller con el render en mano. Las ventas de rines subieron.&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src="/wheelblend/avatar-2.jpg"
                      alt="Taller AutoPro"
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Taller AutoPro</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bogotá, Colombia</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 3 */}
              <div className="col-md-4">
                <div className="story-card animate-hidden" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '2.5rem' }}>
                  <div className="mb-4" style={{ color: 'var(--primary)', opacity: 0.6 }}>
                    <Quote size={24} />
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-main)' }}>
                    &ldquo;Lo uso para mis reels. El resultado parece un render profesional de verdad.&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src="/wheelblend/avatar-3.jpg"
                      alt="Laura V."
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Laura V.</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Creadora de contenido</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            PRECIOS SECTION — 3 pricing cards
            ================================================ */}
        <section className="section" id="precios">
          <div className="container">
            <h2 className="sec-title mb-2" style={{ textWrap: 'balance' }}>
              Elegí tu <span style={{ color: 'var(--primary)' }}>plan</span>
            </h2>
            <p className="sec-sub mb-5">Empieza gratis. Escala cuando lo necesites.</p>
            <div className="row g-4 justify-content-center">
              {/* Free / Básico */}
              <div className="col-md-4">
                <div className="pricing-card animate-hidden">
                  <div className="pricing-badge"><span data-scramble>Gratis</span></div>
                  <h3 className="pricing-name">Básico</h3>
                  <div className="pricing-price">$0<span>/mes</span></div>
                  <p className="pricing-desc">Perfecto para explorar la plataforma.</p>
                  <ul className="pricing-features">
                    <li>
                      <Check size={14} style={{ color: '#10b981' }} /> 5 renders al mes
                    </li>
                    <li>
                      <Check size={14} style={{ color: '#10b981' }} /> Catálogo básico de rines
                    </li>
                    <li>
                      <Check size={14} style={{ color: '#10b981' }} /> Descarga en HD
                    </li>
                    <li>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </span>
                        Sin marca de agua — Pro
                      </span>
                    </li>
                    <li>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </span>
                        Wraps y vinilos — Pro
                      </span>
                    </li>
                  </ul>
                  <a href="#proceso" className="btn-ghost btn-block" data-scramble>Empezar gratis</a>
                </div>
              </div>

              {/* Pro — featured */}
              <div className="col-md-4">
                <div className="pricing-card pricing-featured">
                  <div className="pricing-badge pricing-badge-pro"><span data-scramble>Más popular</span></div>
                  <h3 className="pricing-name">Pro</h3>
                  <div className="pricing-price">$49.900<span>/mes</span></div>
                  <p className="pricing-desc">Para entusiastas y talleres.</p>
                  <ul className="pricing-features">
                    <li><Check size={14} style={{ color: '#10b981' }} /> Renders ilimitados</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Catálogo completo +200 rines</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Descarga 4K sin marca de agua</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Wraps, vinilos y accesorios</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Soporte prioritario</li>
                  </ul>
                  <a href="#proceso" className="btn-primary btn-block" data-scramble>Comenzar — 7 días gratis</a>
                </div>
              </div>

              {/* Business */}
              <div className="col-md-4">
                <div className="pricing-card animate-hidden">
                  <div className="pricing-badge"><span data-scramble>Equipos</span></div>
                  <h3 className="pricing-name">Business</h3>
                  <div className="pricing-price">$149.900<span>/mes</span></div>
                  <p className="pricing-desc">Para talleres y negocios de rines.</p>
                  <ul className="pricing-features">
                    <li><Check size={14} style={{ color: '#10b981' }} /> Todo lo de Pro</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Hasta 10 usuarios</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Panel de gestión de clientes</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Acceso a API</li>
                    <li><Check size={14} style={{ color: '#10b981' }} /> Soporte dedicado 24/7</li>
                  </ul>
                  <a href="#" className="btn-ghost btn-block" data-scramble>Contactar ventas</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            HISTORIAS / CASOS DE USO SECTION — 6 cards
            ================================================ */}
        <section className="section" id="historias" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <h2 className="sec-title mb-5" style={{ textWrap: 'balance' }}>
              Para <span style={{ color: 'var(--primary)' }}>cada perfil</span>
            </h2>
            <div className="row g-3">
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    &nbsp;Entusiasta
                  </div>
                  <h5>Prueba rines antes de comprar</h5>
                  <p>Visualiza diferentes estilos y tamaños de rines sobre tu vehículo antes de invertir en el taller.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <Paintbrush size={13} />
                    &nbsp;Propietario
                  </div>
                  <h5>Cambia el color de tu auto</h5>
                  <p>Evalúa colores clásicos, mate, perla o cromado. Toma la decisión correcta antes de pintarlo.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <Layers size={13} />
                    &nbsp;Creativo
                  </div>
                  <h5>Aplica wraps y vinilos</h5>
                  <p>Prueba wraps de vinilo completos o parciales. Texturas, patrones y colores sin límite.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                    &nbsp;Taller
                  </div>
                  <h5>Presenta propuestas visuales</h5>
                  <p>Muestra a tus clientes cómo quedarán las modificaciones antes de comenzar el trabajo.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    &nbsp;Negocio
                  </div>
                  <h5>Vende más con visualizaciones</h5>
                  <p>Negocios de rines y accesorios pueden mostrar el producto montado en el auto del cliente.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="story-card animate-hidden">
                  <div className="story-num">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                    &nbsp;Creador
                  </div>
                  <h5>Contenido que impacta</h5>
                  <p>Genera builds visuales para redes sociales que parecen renders profesionales.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            CTA FINAL SECTION — card stack with Porsche/Ferrari
            ================================================ */}
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
                  Ved el auto de tus sueños antes de invertir un solo peso.
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
                    <img src="/assets/gallery-porsche.jpg" alt="Porsche" className="cta-card-img" />
                    <div className="cta-card-label">Porsche 911 — Rines deportivos</div>
                  </div>
                  <div className="cta-card cta-card-front">
                    <img src="/assets/ferrari.webp" alt="Ferrari" className="cta-card-img" />
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

        {/* ================================================
            FOOTER
            ================================================ */}
        <Footer />

      </div>{/* end content-wrapper-overlap */}

    </div>
  );
}