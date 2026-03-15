document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80
        });
    }

    const body = document.body;
    const introLoader = document.getElementById('intro-loader');
    const themeToggle = document.getElementById('theme-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const contactForm = document.getElementById('contact-form');
    const track = document.querySelector('.skills-track');
    const slides = Array.from(document.querySelectorAll('.skill-slide'));
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const viewport = document.querySelector('.skills-viewport');
    const savedTheme = localStorage.getItem('theme');
    let currentSlide = 0;
    let autoSlideId = null;

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    const updateThemeIcon = () => {
        if (!themeToggle) {
            return;
        }

        const icon = themeToggle.querySelector('i');
        if (!icon) {
            return;
        }

        const isDark = body.classList.contains('dark-mode');
        icon.classList.toggle('fa-sun', isDark);
        icon.classList.toggle('fa-moon', !isDark);
    };

    const updateNavState = () => {
        if (navbar) {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 30);
        }

        const position = window.scrollY + 120;
        let activeId = sections[0]?.id || '';

        sections.forEach((section) => {
            if (position >= section.offsetTop) {
                activeId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
    };

    const goToSlide = (index) => {
        if (!track || slides.length === 0) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    };

    const startAutoSlide = () => {
        if (autoSlideId || slides.length <= 1) {
            return;
        }

        autoSlideId = window.setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 2200);
    };

    const stopAutoSlide = () => {
        if (!autoSlideId) {
            return;
        }

        window.clearInterval(autoSlideId);
        autoSlideId = null;
    };

    updateThemeIcon();

    if (introLoader) {
        window.setTimeout(() => {
            introLoader.classList.add('is-hidden');
        }, 1900);
    }

    updateNavState();
    goToSlide(0);
    startAutoSlide();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            const openCollapse = document.querySelector('.navbar-collapse.show');
            if (openCollapse && typeof bootstrap !== 'undefined') {
                bootstrap.Collapse.getOrCreateInstance(openCollapse).hide();
            }
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            stopAutoSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goToSlide(Number(dot.dataset.slide));
            stopAutoSlide();
            startAutoSlide();
        });
    });

    if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoSlide);
        viewport.addEventListener('mouseleave', startAutoSlide);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
        });
    }

    window.addEventListener('scroll', updateNavState);
});
