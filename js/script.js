// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeSearch();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeNewsletterForm();
    initializeLazyLoading();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navToggle.classList.contains('active') 
                    ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? '0' : index === 0 ? '5px, 5px' : '-5px, -5px'})`
                    : 'rotate(0deg) translate(0, 0)';
            });
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Handle active navigation state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Add background on scroll
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchInput && searchIcon) {
        searchIcon.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Real-time search suggestions (if on blog page)
        if (window.location.pathname.includes('blog.html')) {
            searchInput.addEventListener('input', handleSearchInput);
        }
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) return;

    if (window.location.pathname.includes('blog.html')) {
        filterPosts(query);
    } else {
        // Redirect to blog page with search query
        window.location.href = `blog.html?search=${encodeURIComponent(query)}`;
    }
}

function handleSearchInput() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length > 2) {
        filterPosts(query);
    } else if (query.length === 0) {
        showAllPosts();
    }
}

function filterPosts(query) {
    const posts = document.querySelectorAll('.blog-post-card, .post-card');
    let visibleCount = 0;

    posts.forEach(post => {
        const title = post.querySelector('.post-title a')?.textContent.toLowerCase() || '';
        const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const isMatch = title.includes(query) || excerpt.includes(query) || tags.includes(query);
        
        if (isMatch) {
            post.style.display = 'block';
            post.style.animation = 'fadeInUp 0.3s ease-out';
            visibleCount++;
        } else {
            post.style.display = 'none';
        }
    });

    // Show/hide empty state
    toggleEmptyState(visibleCount === 0, `No results found for "${query}"`);
}

function showAllPosts() {
    const posts = document.querySelectorAll('.blog-post-card, .post-card');
    posts.forEach(post => {
        post.style.display = 'block';
    });
    
    toggleEmptyState(false);
}

function toggleEmptyState(show, message = '') {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <h3>No Results Found</h3>
            <p>${message}</p>
            <a href="blog.html" class="empty-state-btn">View All Posts</a>
        `;
        
        const postsContainer = document.querySelector('.posts-container') || document.querySelector('.posts-grid');
        if (postsContainer) {
            postsContainer.parentNode.insertBefore(emptyState, postsContainer.nextSibling);
        }
    } else if (!show && emptyState) {
        emptyState.remove();
    }
}

// Smooth scrolling
function initializeSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
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
            }
        });
    });
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.post-card, .blog-post-card, .category-card, .widget');
    animateElements.forEach(el => observer.observe(el));

    // Add CSS for animations
    addAnimationStyles();
}

function addAnimationStyles() {
    if (document.querySelector('#animate-styles')) return;

    const style = document.createElement('style');
    style.id = 'animate-styles';
    style.textContent = `
        .post-card, .blog-post-card, .category-card, .widget {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            box-shadow: 0 2px 30px rgba(76, 124, 89, 0.15);
        }
    `;
    
    document.head.appendChild(style);
}

// Newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const submitBtn = this.querySelector('.newsletter-btn');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                submitBtn.textContent = 'Subscribe';
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles
    addNotificationStyles();
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide after 5 seconds
    const autoHide = setTimeout(() => hideNotification(notification), 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoHide);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

function addNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
        }
        
        .notification-success .notification-content {
            background: var(--primary-color);
            color: white;
        }
        
        .notification-error .notification-content {
            background: #e74c3c;
            color: white;
        }
        
        .notification-info .notification-content {
            background: var(--bg-white);
            color: var(--text-dark);
            border: 2px solid var(--border-light);
        }
        
        .notification-message {
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: currentColor;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for use in other scripts
window.SummasiteApp = {
    showNotification,
    filterPosts,
    showAllPosts,
    debounce,
    throttle
};