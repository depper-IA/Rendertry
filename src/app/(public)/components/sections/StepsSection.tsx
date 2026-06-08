'use client';

import { useState } from 'react';
import { UploadCloud, ArrowRight, Check } from 'lucide-react';

const STEP2_PRODUCTS = {
  RIN: [
    { id: 0, img: '/wheelblend/FIFTEEN52-TRAVERSE-BLACK.png', alt: 'Fifteen52' },
    { id: 1, img: '/wheelblend/ENKEI-RPF1-SILVER.png', alt: 'Enkei' },
    { id: 2, img: '/wheelblend/WELD-S71.png', alt: 'Weld' },
    { id: 3, img: '/wheelblend/BBS-E88.png', alt: 'BBS' },
  ],
  WRAP: [
    { id: 0, img: '/assets/wraps/wrap-satin-black.webp', alt: 'Satin Black' },
    { id: 1, img: '/assets/wraps/wrap-gloss-silver.webp', alt: 'Gloss Silver' },
    { id: 2, img: '/assets/wraps/wrap-satin-white.webp', alt: 'Satin White' },
    { id: 3, img: '/assets/wraps/wrap-matte-red.webp', alt: 'Matte Red' },
  ],
  PAINT: [
    { id: 0, img: '/assets/wraps/wrap-matte-red.webp', alt: 'Racing Red' },
    { id: 1, img: '/assets/wraps/wrap-satin-black.webp', alt: 'Midnight Black' },
    { id: 2, img: '/assets/wraps/wrap-satin-white.webp', alt: 'Pearl White' },
    { id: 3, img: '/assets/wraps/wrap-chrome-gold.webp', alt: 'Chrome Gold' },
  ],
} as const;

const RESULT_PREVIEWS = {
  RIN: '/wheelblend/aston-black-wheel.webp',
  WRAP: '/wheelblend/afterImage.png',
  PAINT: '/assets/car-result.jpg',
} as const;

const CATEGORY_LABELS = { RIN: 'Rines', WRAP: 'Wraps', PAINT: 'Pintura' } as const;

export default function StepsSection() {
  const [step2Category, setStep2Category] = useState<'RIN' | 'WRAP' | 'PAINT'>('RIN');
  const [step2ActiveProduct, setStep2ActiveProduct] = useState(1);

  return (
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
                  {CATEGORY_LABELS[cat]}
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
                  <img src={prod.img} alt={prod.alt} loading="lazy" decoding="async" />
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
                  loading="lazy"
                  decoding="async"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: 1,
                    transform: 'scale(1)',
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
  );
}
