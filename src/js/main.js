// ─── Partial Loader ──────────────────────────────────────────────────────────
// Resolves the correct base path regardless of where the page lives in src/
const getBasePath = () => {
    const depth = location.pathname.split('/').filter(Boolean).length;
    // If served from src/ root the partials are in partials/
    // A simple approach: always resolve relative to the current page location
    return 'partials/';
};

const loadPartials = async () => {
    const base = getBasePath();
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');

    const results = await Promise.allSettled([
        headerSlot ? fetch(base + 'header.html').then(r => r.text()) : Promise.resolve(null),
        footerSlot ? fetch(base + 'footer.html').then(r => r.text()) : Promise.resolve(null),
    ]);

    if (headerSlot && results[0].status === 'fulfilled' && results[0].value) {
        headerSlot.innerHTML = results[0].value;
    }
    if (footerSlot && results[1].status === 'fulfilled' && results[1].value) {
        footerSlot.innerHTML = results[1].value;
    }
};

// ─── Main Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    // Load shared partials first, then boot everything else
    await loadPartials();

    // Initialize Lucide icons (after partials are in the DOM)
    lucide.createIcons();

    // Navigation Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('mobile-open');
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

    // Slider Component
    const initSlider = () => {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const section = document.querySelector('.slider-section');
        const nextBtn = document.getElementById('sliderNext');
        const prevBtn = document.getElementById('sliderPrev');
        
        if (!slides.length) return;

        let current = 0;
        let timer;

        const applyBg = (idx) => {
            const bg = slides[idx].dataset.bg;
            if (bg && section) section.style.backgroundColor = bg;
            slides[idx].style.backgroundColor = bg || '#f0f6ff';
        };

        const goTo = (idx) => {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (idx + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
            applyBg(current);
        };

        const next = () => goTo(current + 1);
        const prev = () => goTo(current - 1);

        const startAuto = () => { timer = setInterval(next, 5000); };
        const stopAuto = () => { clearInterval(timer); };

        applyBg(0);

        if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAuto();
                goTo(parseInt(dot.dataset.index));
                startAuto();
            });
        });

        startAuto();
    };

    initSlider();

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            const offset = 70;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            if (navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Navbar scroll effect
    const handleScroll = () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on page load

    // Framer Motion (Motion One) Animations
    const motionElements = document.querySelectorAll('.step-card, .feat-cell, .gallery-item, .story-card, .pricing-card, .sec-title, .hero-badge, .hero-title, .hero-sub, .hero-actions, .hero-car-massive, .hero-rim-dock, .cta-inner');
    motionElements.forEach(el => el.style.opacity = '0');

    import('https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm').then(({ animate, inView, stagger }) => {
        // Hero Section
        animate(".hero-badge", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
        animate(".hero-title", { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.1 });
        animate(".hero-sub", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.2 });
        animate(".hero-actions", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.3 });
        animate(".hero-car-massive", { opacity: [0, 1], x: [50, 0], scale: [0.95, 1] }, { duration: 1, delay: 0.2 });
        animate(".hero-rim-dock", { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, delay: 0.5 });

        // Scroll Staggered Animations
        inView(".steps-container", () => {
            animate(".step-card", { opacity: [0, 1], y: [50, 0] }, { delay: stagger(0.2), duration: 0.6 });
        });

        inView(".feat-grid", () => {
            animate(".feat-cell", { opacity: [0, 1], scale: [0.9, 1] }, { delay: stagger(0.1), duration: 0.5 });
        });

        inView(".gallery", () => {
            animate(".gallery-item", { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });

        inView("#testimonios .row", () => {
            animate("#testimonios .story-card", { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });

        inView("#precios .row", () => {
            animate(".pricing-card", { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });

        inView("#historias .row", () => {
            animate("#historias .story-card", { opacity: [0, 1], scale: [0.9, 1] }, { delay: stagger(0.1), duration: 0.5 });
        });

        inView(".cta-inner", () => {
            animate(".cta-inner", { opacity: [0, 1], y: [50, 0] }, { duration: 0.8 });
        });
        
        inView(".sec-title", (info) => {
            animate(info.target, { opacity: [0, 1], x: [-30, 0] }, { duration: 0.6 });
        });
    });

    // Before / After Slider
    const initBeforeAfter = () => {
        const wrapper = document.getElementById('baWrapper');
        const before  = document.getElementById('baBefore');
        const handle  = document.getElementById('baHandle');
        if (!wrapper || !before || !handle) return;

        let dragging = false;

        const setPosition = (clientX) => {
            const rect = wrapper.getBoundingClientRect();
            let pct = (clientX - rect.left) / rect.width;
            pct = Math.min(Math.max(pct, 0.02), 0.98);
            const rightPct = (1 - pct) * 100;
            before.style.clipPath = `inset(0 ${rightPct}% 0 0)`;
            handle.style.left = `${pct * 100}%`;
        };

        // Mouse events
        wrapper.addEventListener('mousedown', (e) => { dragging = true; setPosition(e.clientX); });
        window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });
        window.addEventListener('mouseup',   () => { dragging = false; });

        // Touch events
        wrapper.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchmove',  (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchend',   () => { dragging = false; });
    };

    initBeforeAfter();

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data semantically
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Enviando solicitud de asesoría:', data);

            // Simple animation for the button
            const btn = contactForm.querySelector('.btn-submit, button[type="submit"]');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'Enviando...';
                btn.disabled = true;
                
                // Simulate API request call
                setTimeout(() => {
                    alert(`✅ ¡Mensaje enviado con éxito! Gracias ${data.name || ''}, pronto un asesor tuning se pondrá en contacto contigo.`);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                }, 1500);
            }
        });
    }

    // ─── Visualizer Sandbox Logic ──────────────────────────────────────────
    const initSandbox = () => {
        const viewportWrapper = document.getElementById('viewportWrapper');
        const viewportCar = document.getElementById('viewportCar');
        const rimFront = document.getElementById('rimFront');
        const rimRear = document.getElementById('rimRear');
        const rimFrontImg = document.getElementById('rimFrontImg');
        const rimRearImg = document.getElementById('rimRearImg');
        
        const carButtons = document.querySelectorAll('.btn-car-select');
        const rimButtons = document.querySelectorAll('.rim-select-btn');
        
        const sizeInput = document.getElementById('rim-size');
        const sizeValSpan = document.getElementById('rim-size-val');
        const frontXInput = document.getElementById('rim-front-x');
        const rearXInput = document.getElementById('rim-rear-x');
        const carUploadInput = document.getElementById('car-upload');
        
        const resetBtn = document.getElementById('btn-reset-sandbox');
        const saveBtn = document.getElementById('btn-save-sandbox');
        
        if (!viewportWrapper || !viewportCar) return;

        // Default wheel offset states
        let baseSize = 100;
        let frontOffsetX = 0;
        let rearOffsetX = 0;
        let activeCar = 'ferrari';

        // Set default car dataset attribute
        viewportWrapper.setAttribute('data-active-car', activeCar);

        const updatePositions = () => {
            // Apply scale sizing
            rimFront.style.transform = `scale(${baseSize / 100}) translate(${frontOffsetX}px, 0)`;
            rimRear.style.transform = `scale(${baseSize / 100}) translate(${rearOffsetX}px, 0)`;
            sizeValSpan.innerText = baseSize;
        };

        // Car selection
        carButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                carButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const car = btn.dataset.car;
                activeCar = car;
                viewportWrapper.setAttribute('data-active-car', car);
                
                if (car === 'ferrari') {
                    viewportCar.src = 'assets/ferrari.webp';
                } else if (car === 'porsche') {
                    viewportCar.src = 'assets/slider/porsche.jpg';
                } else if (car === 'camioneta') {
                    viewportCar.src = 'assets/slider/camioneta.jpeg';
                }
                
                // Reset positions on car switch
                frontOffsetX = 0;
                rearOffsetX = 0;
                frontXInput.value = 0;
                rearXInput.value = 0;
                updatePositions();
            });
        });

        // Rim selection
        rimButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                rimButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const rimImg = btn.dataset.rimImg;
                rimFrontImg.src = rimImg;
                rimRearImg.src = rimImg;
            });
        });

        // Adjustments sliders
        sizeInput.addEventListener('input', (e) => {
            baseSize = parseInt(e.target.value);
            updatePositions();
        });

        frontXInput.addEventListener('input', (e) => {
            frontOffsetX = parseInt(e.target.value);
            updatePositions();
        });

        rearXInput.addEventListener('input', (e) => {
            rearOffsetX = parseInt(e.target.value);
            updatePositions();
        });

        // Custom car upload
        if (carUploadInput) {
            carUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    viewportCar.src = event.target.result;
                    activeCar = 'custom';
                    viewportWrapper.setAttribute('data-active-car', 'custom');
                    
                    // Mark upload button as active
                    carButtons.forEach(b => b.classList.remove('active'));
                    
                    // Reset positions
                    frontOffsetX = 0;
                    rearOffsetX = 0;
                    frontXInput.value = 0;
                    rearXInput.value = 0;
                    updatePositions();
                };
                reader.readAsDataURL(file);
            });
        }

        // Reset
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                baseSize = 100;
                frontOffsetX = 0;
                rearOffsetX = 0;
                sizeInput.value = 100;
                frontXInput.value = 0;
                rearXInput.value = 0;
                updatePositions();
            });
        }

        // Save customized image
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const originalContent = saveBtn.innerHTML;
                saveBtn.innerText = 'Generando...';
                saveBtn.disabled = true;

                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas resolution to image natural dimensions
                    canvas.width = viewportCar.naturalWidth || 1200;
                    canvas.height = viewportCar.naturalHeight || 675;

                    // 1. Draw car image
                    ctx.drawImage(viewportCar, 0, 0, canvas.width, canvas.height);

                    // 2. Draw front and rear wheels
                    const drawWheel = (overlayEl, imgEl) => {
                        const rect = viewportWrapper.getBoundingClientRect();
                        const wheelRect = overlayEl.getBoundingClientRect();
                        
                        // Calculate percentage coordinates
                        const leftPct = (wheelRect.left - rect.left) / rect.width;
                        const topPct = (wheelRect.top - rect.top) / rect.height;
                        const widthPct = wheelRect.width / rect.width;
                        const heightPct = wheelRect.height / rect.height;

                        const x = leftPct * canvas.width;
                        const y = topPct * canvas.height;
                        const w = widthPct * canvas.width;
                        const h = heightPct * canvas.height;

                        ctx.drawImage(imgEl, x, y, w, h);
                    };

                    drawWheel(rimFront, rimFrontImg);
                    drawWheel(rimRear, rimRearImg);

                    // Create download link
                    const link = document.createElement('a');
                    link.download = 'rendertry-personalizado.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } catch (err) {
                    console.error('Error saving image:', err);
                    alert('Hubo un error al exportar la imagen. Intenta con otra o desde un navegador moderno.');
                } finally {
                    saveBtn.innerHTML = originalContent;
                    saveBtn.disabled = false;
                }
            });
        }
    };

    initSandbox();
});
