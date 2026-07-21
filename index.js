document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header Scroll Effect
       ========================================================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
        const iconUse = mobileMenuBtn.querySelector('use');
        if (navMenu.classList.contains('mobile-open')) {
            iconUse.setAttribute('href', '#icon-xmark');
        } else {
            iconUse.setAttribute('href', '#icon-bars');
        }
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navMenu.classList.contains('mobile-open')) {
                navMenu.classList.remove('mobile-open');
                mobileMenuBtn.querySelector('use').setAttribute('href', '#icon-bars');
            }
        });
    });

    /* ==========================================================================
       3. Active Scroll Navigation Link Highlight
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset for sticky header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. Testimonials Carousel
       ========================================================================== */
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        testimonials.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Wrap around bounds
        if (index >= testimonials.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = testimonials.length - 1;
        } else {
            currentIndex = index;
        }
        
        testimonials[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    // Controls
    prevBtn.addEventListener('click', () => {
        showTestimonial(currentIndex - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        showTestimonial(currentIndex + 1);
        resetAutoplay();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showTestimonial(index);
            resetAutoplay();
        });
    });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 6000); // changes every 6s
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const carouselContainer = document.querySelector('.testimonials-carousel-wrapper');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    /* ==========================================================================
       5. Gallery Lightbox
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-image');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = imgAlt;
            lightboxModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // prevent page scroll
        });
    });

    function closeLightbox() {
        lightboxModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightbox();
        }
    });

    /* ==========================================================================
       6. Contact Info Modal (Popup)
       ========================================================================== */
    const contactModal = document.getElementById('contactModal');
    const openContactBtns = document.querySelectorAll('.open-contact-btn');
    const contactModalClose = document.getElementById('contactModalClose');
    const contactModalOkBtn = document.getElementById('contactModalOkBtn');

    function openContactModal() {
        contactModal.style.display = 'flex';
        // Allow rendering before transition
        setTimeout(() => {
            contactModal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeContactModal() {
        contactModal.classList.remove('show');
        setTimeout(() => {
            contactModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    openContactBtns.forEach(btn => {
        btn.addEventListener('click', openContactModal);
    });

    contactModalClose.addEventListener('click', closeContactModal);
    contactModalOkBtn.addEventListener('click', closeContactModal);
    
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    /* ==========================================================================
       7. Cinematic Layer — Scroll Reveal, Spotlight, Magnetic CTAs, Counter
       ========================================================================== */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    // 7.0 Hero video — pause on reduced motion (poster/capa fica visível no lugar)
    const heroVideo = document.querySelector('video.hero-bg');
    if (heroVideo) {
        if (prefersReducedMotion) {
            heroVideo.pause();
            heroVideo.removeAttribute('autoplay');
        } else {
            // Garante via propriedade JS (alguns navegadores mobile só respeitam
            // autoplay quando 'muted' é setado como propriedade, não só atributo)
            heroVideo.muted = true;
            heroVideo.playsInline = true;

            const tryPlayHeroVideo = () => {
                if (heroVideo.paused) {
                    heroVideo.play().catch(() => {
                        // Autoplay ainda bloqueado — tentaremos de novo nos próximos gatilhos
                    });
                }
            };

            tryPlayHeroVideo();

            // Retenta assim que houver dados suficientes pra tocar
            heroVideo.addEventListener('loadeddata', tryPlayHeroVideo);
            heroVideo.addEventListener('canplay', tryPlayHeroVideo);

            // Retenta quando a aba/tela volta a ficar visível (comum em Android
            // com economia de bateria/dados segurar o autoplay em background)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') tryPlayHeroVideo();
            });

            // Rede de segurança: primeira interação do visitante libera o autoplay
            // em navegadores mais restritivos (alguns in-app browsers, ex. Instagram/WhatsApp)
            ['touchstart', 'click', 'scroll'].forEach(evt => {
                document.addEventListener(evt, tryPlayHeroVideo, { once: true, passive: true });
            });
        }
    }

    // 7.1 Scroll reveal (fade + up) via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // 7.2 Spotlight border on room card — the light follows the cursor
    if (hasFinePointer) {
        document.querySelectorAll('.room-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        });
    }

    // 7.3 Magnetic CTAs — button drifts gently toward the cursor
    if (hasFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            const strength = 12;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // 7.4 Count-up counter (odometer) for the review rating
    const counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length) {
        const animateCounter = (el) => {
            const target = parseFloat(el.getAttribute('data-target'));
            const decimals = (el.getAttribute('data-target').split('.')[1] || '').length;
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = (target * eased).toFixed(decimals);
                if (progress < 1) requestAnimationFrame(tick);
            }

            if (prefersReducedMotion) {
                el.textContent = target.toFixed(decimals);
            } else {
                requestAnimationFrame(tick);
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counterEls.forEach(el => counterObserver.observe(el));
    }

    // 7.5 Hero exit parallax — content drifts and fades slightly as the visitor scrolls past
    const heroContainer = document.querySelector('.hero-container');
    const heroBg = document.querySelector('[data-hero-bg]');
    if (heroContainer && heroBg && !prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const heroHeight = document.querySelector('.hero-section').offsetHeight;
                    const progress = Math.min(window.scrollY / heroHeight, 1);
                    heroContainer.style.opacity = String(1 - progress * 1.1);
                    heroContainer.style.transform = `translateY(${progress * 60}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});
