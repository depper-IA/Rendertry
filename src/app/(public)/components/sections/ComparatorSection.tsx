import BeforeAfterSlider from '@/components/BeforeAfterSlider';

// Before/after drag comparator. Static wrapper around the reusable slider.
export default function ComparatorSection() {
  return (
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
  );
}
