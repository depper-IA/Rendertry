// Wheel-brand logo marquee. Static presentational section; the second set of
// items is a duplicate so the CSS-driven loop scrolls seamlessly.
const BRANDS = [
  { src: '/assets/wheelblend/bbs.png', alt: 'BBS' },
  { src: '/assets/wheelblend/hre.png', alt: 'HRE' },
  { src: '/assets/wheelblend/volk.png', alt: 'Volk' },
  { src: '/assets/wheelblend/rotiform.png', alt: 'Rotiform' },
  { src: '/assets/wheelblend/advan.png', alt: 'Advan' },
  { src: '/assets/wheelblend/work.png', alt: 'Work' },
];

export default function BrandsMarquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <div className="marquee-item" key={`${b.alt}-${i}`}>
            <img src={b.src} alt={b.alt} className="marquee-logo" />
          </div>
        ))}
      </div>
    </div>
  );
}
