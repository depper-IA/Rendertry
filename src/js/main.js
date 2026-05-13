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
            const isActive = navLinks.classList.toggle('mobile-menu-active');
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

            if (navLinks.classList.contains('mobile-menu-active')) {
                navLinks.classList.remove('mobile-menu-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.style.padding = window.scrollY > 60 ? '0.8rem 0' : '1.5rem 0';
        }
    });

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
            // Simple animation for the button
            const btn = contactForm.querySelector('.btn-submit, button[type="submit"]');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'Enviando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    alert('✅ ¡Mensaje enviado con éxito! Pronto un asesor tuning se pondrá en contacto contigo.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                }, 1500);
            }
        });
    }
});
