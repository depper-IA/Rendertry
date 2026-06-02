/**
 * GSAP 3D Scroll - BMW M4 Hero Animation
 * Auto completo → Zoom al rin → Persiana sube
 */

const setupGSAP3DScroll = () => {
  const canvas = document.getElementById('gsap-3d-scroll-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const totalFrames = 143;
  const extraFrames = 5;
  const frameRef = { current: 0 };
  const images = [];
  const urlPattern = 'assets/frames/bmw-m4/frame-###.webp';

  const overlay = document.querySelector('.gsap-3d-scroll-overlay');

  const preloadImages = async () => {
    console.log("Precargando frames...");
    const promises = [];
    for (let i = 1; i <= totalFrames; i++) {
      const num = i.toString().padStart(3, '0');
      const url = urlPattern.replace('###', num);
      promises.push(
        new Promise(resolve => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        })
      );
    }
    const loaded = (await Promise.all(promises)).filter(img => img !== null);
    if (loaded.length > 0) {
      const lastImg = loaded[loaded.length - 1];
      for (let i = 0; i < extraFrames; i++) loaded.push(lastImg);
    }
    console.log(`Listo: ${loaded.length} frames`);
    return loaded;
  };

  const drawFrame = (index) => {
    const img = images[index];
    if (!img || !ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let drawWidth, drawHeight, x, y;
    if (imgRatio > canvasRatio) {
      drawHeight = h;
      drawWidth = h * imgRatio;
      x = (w - drawWidth) / 2;
      y = 0;
    } else {
      drawWidth = w;
      drawHeight = w / imgRatio;
      x = 0;
      y = (h - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  const updateCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    drawFrame(Math.round(frameRef.current));
  };

  const init = async () => {
    try {
      const loadedImages = await preloadImages();
      images.push(...loadedImages);
      if (images.length === 0) throw new Error("Sin frames");

      // Empezar con el auto completo (índice 142 = frame-143.jpg)
      frameRef.current = 142;
      updateCanvas();

      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".gsap-3d-scroll-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            if (overlay) overlay.style.opacity = 1 - (self.progress * 3);
            // Cuando termina la animación, ocultamos el canvas para siempre (no vuelve)
            if (self.progress >= 0.99) {
              canvas.parentElement.classList.add('animacion-finished');
            } else {
              canvas.parentElement.classList.remove('animacion-finished');
            }
          }
        }
      });

      tl.to(frameRef, {
        current: 0,
        ease: "none",
        onUpdate: () => drawFrame(Math.round(frameRef.current))
      });

      window.addEventListener('resize', updateCanvas);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  init();
};

document.addEventListener('DOMContentLoaded', setupGSAP3DScroll);