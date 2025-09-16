/**
 * Summasite - Main JavaScript
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active')
                ? 'rotate(45deg) translate(5px, 5px)' : '';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active')
                ? 'rotate(-45deg) translate(7px, -6px)' : '';
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });

        if (searchIcon) {
            searchIcon.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
        }
    }

    function performSearch(query) {
        if (query.trim()) {
            console.log('Searching for:', query);
            // Implement actual search functionality here
            // For now, just show an alert
            alert('Search functionality coming soon! You searched for: ' + query);
        }
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            if (email) {
                alert('Thank you for subscribing! We\'ll send updates to: ' + email);
                this.querySelector('.newsletter-input').value = '';
            }
        });
    }

    // Contact form
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.fade-in-up');
    const animateOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, animateOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateObserver.observe(el);
    });

    // Add active class to current page nav link
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-link');

    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation.split('/').pop() ||
            (currentLocation === '/' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        }
    });

    // Card hover effects
    const cards = document.querySelectorAll('.post-card, .product-card, .category-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Back to top button (if exists)
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize tooltips (if any)
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = text;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.background = '#333';
            tooltipEl.style.color = 'white';
            tooltipEl.style.padding = '5px 10px';
            tooltipEl.style.borderRadius = '5px';
            tooltipEl.style.fontSize = '12px';
            tooltipEl.style.zIndex = '1000';

            document.body.appendChild(tooltipEl);

            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 5 + 'px';
            tooltipEl.style.left = rect.left + (rect.width - tooltipEl.offsetWidth) / 2 + 'px';

            this.tooltipEl = tooltipEl;
        });

        tooltip.addEventListener('mouseleave', function() {
            if (this.tooltipEl) {
                this.tooltipEl.remove();
            }
        });
    });

    // Blog page functionality
    if (document.querySelector('.blog-main')) {
        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const postCards = document.querySelectorAll('.blog-post-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active filter
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter posts
                const category = this.dataset.category;
                postCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Sort functionality
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                console.log('Sorting by:', this.value);
                // Implement sorting logic here
            });
        }
    }

    // Article page functionality
    if (document.querySelector('.article-page')) {
        // Table of contents navigation
        const tocLinks = document.querySelectorAll('.toc-link');
        const headings = document.querySelectorAll('.article-content h2');

        // Add IDs to headings for navigation
        headings.forEach((heading, index) => {
            heading.id = 'section-' + index;
            if (tocLinks[index]) {
                tocLinks[index].href = '#section-' + index;
            }
        });

        // Smooth scroll for TOC
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 100;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active TOC item on scroll
        window.addEventListener('scroll', function() {
            let current = '';
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 150) {
                    current = heading.id;
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Share button functionality
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const url = window.location.href;
                const title = document.title;

                if (this.classList.contains('facebook')) {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                } else if (this.classList.contains('twitter')) {
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
                } else if (this.classList.contains('linkedin')) {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                } else if (this.classList.contains('pinterest')) {
                    window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=${title}`, '_blank');
                }
            });
        });
    }

    // Page transition effects
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('.html') && !link.target) {
            e.preventDefault();
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location = link.href;
            }, 300);
        }
    });

    // Fade in on page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('Summasite initialized successfully!');
});