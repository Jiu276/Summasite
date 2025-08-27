// Animation controller
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
});

function initializeAnimations() {
    initializeScrollAnimations();
    initializeScrollProgress();
    initializeCounterAnimations();
    initializeParticles();
    initializeTypewriter();
    initializeSmoothScrolling();
    initializeLoadingAnimations();
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll, .post-card, .product-card, .team-member, .category-card, .tip-card, .material-card, .cert-item, .value-item, .widget, .brand-item, .timeline-item');
    
    // Add animation classes
    animateElements.forEach(element => {
        if (!element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-on-scroll');
        }
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Counter animation for stats
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }
                
                // Staggered animation for children
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => observer.observe(element));
}

// Scroll progress indicator
function initializeScrollProgress() {
    let scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) {
        scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(scrollProgress);
    }
    
    const progressBar = scrollProgress.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        
        progressBar.style.width = progress + '%';
        
        if (scrolled > 100) {
            scrollProgress.classList.add('visible');
        } else {
            scrollProgress.classList.remove('visible');
        }
    });
}

// Counter animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .counter');
    
    counters.forEach(counter => {
        counter.dataset.target = counter.textContent;
        counter.textContent = '0';
    });
}

function animateCounter(element) {
    if (!element || element.classList.contains('counted')) return;
    
    element.classList.add('counted');
    const target = parseFloat(element.dataset.target.replace(/[^\d.-]/g, ''));
    const suffix = element.dataset.target.replace(/[\d.-]/g, '');
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(1) + 'K' + suffix.replace(/[\d.K]/g, '');
        } else if (target >= 100) {
            element.textContent = Math.floor(current) + suffix;
        } else {
            element.textContent = current.toFixed(1) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = element.dataset.target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Particle background
function initializeParticles() {
    const heroSection = document.querySelector('.hero, .hero-section');
    
    if (heroSection && !heroSection.querySelector('.particles')) {
        const particles = document.createElement('div');
        particles.className = 'particles';
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particles.appendChild(particle);
        }
        
        heroSection.style.position = 'relative';
        heroSection.appendChild(particles);
    }
}

// Typewriter effect
function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let index = 0;
        const timer = setInterval(() => {
            element.textContent = text.slice(0, index + 1);
            index++;
            
            if (index === text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add highlight effect
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 2000);
            }
        });
    });
}

// Loading animations
function initializeLoadingAnimations() {
    // Page load animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate elements in sequence
        const elementsToAnimate = [
            '.hero-title',
            '.hero-subtitle', 
            '.hero-btn',
            '.nav-brand',
            '.nav-menu'
        ];
        
        elementsToAnimate.forEach((selector, index) => {
            setTimeout(() => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.classList.add('fade-in-up');
                });
            }, index * 200);
        });
    });
    
    // Image lazy loading with animation
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Hover animation enhancements
function enhanceHoverAnimations() {
    const cards = document.querySelectorAll('.post-card, .product-card, .team-member, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Parallax scrolling effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Magnetic hover effect for buttons
function initializeMagneticEffect() {
    const magneticElements = document.querySelectorAll('.hero-btn, .submit-btn, .newsletter-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Text reveal animation
function initializeTextReveal() {
    const textElements = document.querySelectorAll('.reveal-text');
    
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.classList.add('char');
            element.appendChild(span);
        });
    });
}

// Initialize all animation enhancements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhanceHoverAnimations();
        initializeParallax();
        initializeMagneticEffect();
        initializeTextReveal();
    }, 500);
});

// Performance monitoring
function monitorAnimationPerformance() {
    let animationFrame = 0;
    const maxFrameTime = 16; // 60fps
    
    function checkPerformance() {
        const start = performance.now();
        
        requestAnimationFrame(() => {
            const frameTime = performance.now() - start;
            
            if (frameTime > maxFrameTime) {
                console.warn('Animation performance issue detected');
                // Reduce animation complexity if needed
                document.body.classList.add('reduce-animations');
            }
            
            animationFrame++;
            
            if (animationFrame < 100) {
                checkPerformance();
            }
        });
    }
    
    checkPerformance();
}

// Export functions for global use
window.AnimationApp = {
    animateCounter,
    initializeScrollAnimations,
    initializeParticles,
    monitorAnimationPerformance
};

// Add additional animation styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .loaded {
            opacity: 1;
        }
        
        .fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
        
        .highlight {
            background: rgba(74, 124, 89, 0.1);
            transition: background 0.3s ease;
        }
        
        .char {
            display: inline-block;
            opacity: 0;
            animation: charReveal 0.6s ease-out forwards;
        }
        
        @keyframes charReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
            from {
                transform: translateY(20px);
            }
        }
        
        .reduce-animations * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
        
        .parallax {
            transition: transform 0.1s ease-out;
        }
        
        .magnetic {
            transition: transform 0.2s ease-out;
        }
    `;
    
    document.head.appendChild(style);
});

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(monitorAnimationPerformance, 1000);
});