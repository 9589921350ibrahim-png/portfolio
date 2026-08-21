document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Custom Cursor
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .portfolio-item');

    if (window.innerWidth > 991 && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ==========================================================================
       Scroll Progress Bar
       ========================================================================== */
    const scrollBar = document.getElementById('scroll-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollBar) {
            scrollBar.style.width = scrollPercentage + '%';
        }
    });

    /* ==========================================================================
       Sticky Header & Back to Top
       ========================================================================== */
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    /* ==========================================================================
       Active Navigation Link on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    /* ==========================================================================
       Intersection Observer for Animations
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate Counters
                if (entry.target.classList.contains('about-stats') || entry.target.querySelector('.counter')) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        if (!counter.classList.contains('counted')) {
                            const target = +counter.getAttribute('data-target');
                            animateCounter(counter, target);
                            counter.classList.add('counted');
                        }
                    });
                }

                // Animate Skill Bars
                if (entry.target.id === 'skills' || entry.target.classList.contains('skills-col')) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-image, .about-stats, .skills-col');
    revealElements.forEach(el => observer.observe(el));

    // Counter Animation Function
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50; // Adjust speed
        const timer = setInterval(() => {
            current += increment;
            element.innerText = Math.ceil(current);
            if (current >= target) {
                element.innerText = target;
                clearInterval(timer);
            }
        }, 30);
    }

    /* ==========================================================================
       Portfolio Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    // Add slight delay for animation effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       Portfolio Modal / Lightbox
       ========================================================================== */
    const modal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const closeModal = document.querySelector('.close-modal');
    const viewBtns = document.querySelectorAll('.view-project-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const portfolioItem = e.target.closest('.portfolio-item');
            const imgSrc = portfolioItem.querySelector('img').src;
            const title = portfolioItem.querySelector('h3').innerText;
            const category = portfolioItem.querySelector('span').innerText;

            modalImg.src = imgSrc;
            modalTitle.innerText = title;
            modalCategory.innerText = category;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    /* ==========================================================================
       Testimonial Slider
       ========================================================================== */
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    if (track && dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                currentIndex = index;
                updateSlider();
            });
        });

        // Auto slide
        setInterval(() => {
            currentIndex = (currentIndex + 1) % dots.length;
            updateSlider();
        }, 5000);

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }
    }

    /* ==========================================================================
       Contact Form Validation
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const type = document.getElementById('projectType').value;
            const message = document.getElementById('message').value;

            if (name && email && type && message) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                setTimeout(() => {
                    formStatus.className = 'form-status success';
                    formStatus.innerText = 'Message sent successfully! I will get back to you soon.';
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    
                    setTimeout(() => {
                        formStatus.innerText = '';
                        formStatus.className = 'form-status';
                    }, 5000);
                }, 1500);
            } else {
                formStatus.className = 'form-status error';
                formStatus.innerText = 'Please fill out all required fields.';
            }
        });
    }
});
