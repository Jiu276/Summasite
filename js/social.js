// Social media functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSocialMedia();
});

function initializeSocialMedia() {
    initializeSocialSharing();
    initializeSocialLinks();
    initializeSocialTracking();
}

// Social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('pinterest') ? 'pinterest' :
                           this.classList.contains('linkedin') ? 'linkedin' : '';
            
            if (platform) {
                shareOnPlatform(platform);
            }
        });
    });
}

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(getPageDescription());
    const image = encodeURIComponent(getPageImage());
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
            
        case 'twitter':
            const text = encodeURIComponent(`${document.title} - Check out this sustainable living article!`);
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&via=summasite`;
            break;
            
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }
    
    if (shareUrl) {
        openShareWindow(shareUrl, platform);
        trackSocialShare(platform);
    }
}

function openShareWindow(url, platform) {
    const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes,toolbar=no,menubar=no';
    const windowName = `share-${platform}`;
    
    window.open(url, windowName, windowFeatures);
}

function getPageDescription() {
    const metaDescription = document.querySelector('meta[name="description"]');
    const heroSubtitle = document.querySelector('.hero-subtitle, .post-subtitle');
    
    if (metaDescription) {
        return metaDescription.getAttribute('content');
    } else if (heroSubtitle) {
        return heroSubtitle.textContent;
    } else {
        return 'Discover sustainable living tips, eco-friendly product reviews, and green lifestyle inspiration at Summasite.';
    }
}

function getPageImage() {
    const ogImage = document.querySelector('meta[property="og:image"]');
    const featuredImage = document.querySelector('.hero-image img, .post-featured-image img');
    
    if (ogImage) {
        return ogImage.getAttribute('content');
    } else if (featuredImage) {
        return new URL(featuredImage.src, window.location.origin).href;
    } else {
        return new URL('images/hero-nature.jpg', window.location.origin).href;
    }
}

// Social links functionality
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if href is "#" or empty
            if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                e.preventDefault();
                
                // Get platform from classes
                const platform = this.classList.contains('instagram') ? 'instagram' :
                               this.classList.contains('facebook') ? 'facebook' :
                               this.classList.contains('twitter') ? 'twitter' :
                               this.classList.contains('pinterest') ? 'pinterest' :
                               this.classList.contains('youtube') ? 'youtube' : '';
                
                if (platform) {
                    openSocialProfile(platform);
                }
            }
            
            // Track click regardless
            trackSocialClick(this);
        });
    });
}

function openSocialProfile(platform) {
    const socialUrls = {
        'instagram': 'https://instagram.com/summasite',
        'facebook': 'https://facebook.com/summasite',
        'twitter': 'https://twitter.com/summasite',
        'pinterest': 'https://pinterest.com/summasite',
        'youtube': 'https://youtube.com/summasite'
    };
    
    const url = socialUrls[platform];
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Social tracking
function initializeSocialTracking() {
    // Track social widget impressions
    const socialWidgets = document.querySelectorAll('.social-links, .share-buttons');
    
    socialWidgets.forEach(widget => {
        if (isElementInViewport(widget)) {
            trackSocialImpression(widget);
        }
    });
    
    // Track when widgets come into view
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackSocialImpression(entry.target);
            }
        });
    });
    
    socialWidgets.forEach(widget => observer.observe(widget));
}

function trackSocialShare(platform) {
    console.log(`Social share: ${platform} - ${document.title}`);
    
    // In a real app, send to analytics
    if (window.gtag) {
        window.gtag('event', 'share', {
            'method': platform,
            'content_type': 'article',
            'content_id': window.location.pathname
        });
    }
    
    // Show feedback to user
    if (window.SummasiteApp && window.SummasiteApp.showNotification) {
        window.SummasiteApp.showNotification(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success');
    }
}

function trackSocialClick(element) {
    const platform = Array.from(element.classList).find(cls => 
        ['instagram', 'facebook', 'twitter', 'pinterest', 'youtube'].includes(cls)
    );
    
    console.log(`Social click: ${platform}`);
    
    if (window.gtag) {
        window.gtag('event', 'click', {
            'event_category': 'social',
            'event_label': platform
        });
    }
}

function trackSocialImpression(widget) {
    console.log('Social widget impression');
    
    if (window.gtag) {
        window.gtag('event', 'impression', {
            'event_category': 'social_widget'
        });
    }
}

// Utility functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add copy URL functionality
function addCopyUrlButton() {
    const shareButtons = document.querySelector('.share-buttons');
    
    if (shareButtons && navigator.clipboard) {
        const copyButton = document.createElement('a');
        copyButton.href = '#';
        copyButton.className = 'share-btn copy-url';
        copyButton.innerHTML = '<i class="fas fa-link"></i><span>Copy Link</span>';
        
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Change button text temporarily
                const span = this.querySelector('span');
                const originalText = span.textContent;
                span.textContent = 'Copied!';
                
                setTimeout(() => {
                    span.textContent = originalText;
                }, 2000);
                
                if (window.SummasiteApp && window.SummasiteApp.showNotification) {
                    window.SummasiteApp.showNotification('Link copied to clipboard!', 'success');
                }
                
                trackSocialShare('copy-link');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (window.SummasiteApp && window.SummasiteApp.showNotification) {
                    window.SummasiteApp.showNotification('Link copied to clipboard!', 'success');
                }
            });
        });
        
        shareButtons.appendChild(copyButton);
    }
}

// Initialize copy URL button when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addCopyUrlButton, 100);
});

// Social media follow button enhancement
function enhanceSocialFollowButtons() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Add hover effect for follower counts (simulated)
        link.addEventListener('mouseenter', function() {
            showFollowerCount(this);
        });
        
        link.addEventListener('mouseleave', function() {
            hideFollowerCount(this);
        });
    });
}

function showFollowerCount(element) {
    if (element.querySelector('.follower-count')) return;
    
    const platform = Array.from(element.classList).find(cls => 
        ['instagram', 'facebook', 'twitter', 'pinterest', 'youtube'].includes(cls)
    );
    
    const followerCounts = {
        'instagram': '12.5K',
        'facebook': '8.2K',
        'twitter': '5.1K',
        'pinterest': '15.3K',
        'youtube': '3.4K'
    };
    
    if (followerCounts[platform]) {
        const countElement = document.createElement('span');
        countElement.className = 'follower-count';
        countElement.textContent = followerCounts[platform] + ' followers';
        countElement.style.cssText = `
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-dark);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            white-space: nowrap;
            z-index: 1000;
            animation: fadeInUp 0.2s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(countElement);
    }
}

function hideFollowerCount(element) {
    const countElement = element.querySelector('.follower-count');
    if (countElement) {
        countElement.remove();
    }
}

// Initialize social enhancements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(enhanceSocialFollowButtons, 200);
});

// Export functions for global use
window.SocialApp = {
    shareOnPlatform,
    trackSocialShare,
    trackSocialClick,
    openSocialProfile
};

// Add social sharing styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .share-btn.copy-url {
            background: var(--text-muted);
        }
        
        .share-btn.copy-url:hover {
            background: var(--text-dark);
        }
        
        .follower-count {
            animation: fadeInUp 0.2s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        .social-link:hover {
            transform: translateY(-2px) scale(1.05);
        }
    `;
    
    document.head.appendChild(style);
});