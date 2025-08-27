// Blog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFilters();
    initializeSorting();
    initializePagination();
    handleUrlParams();
});

// Blog post filtering
function initializeBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.blog-post-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts with animation
            filterPostsByCategory(category, posts);
        });
    });
}

function filterPostsByCategory(category, posts) {
    let visibleCount = 0;
    
    posts.forEach((post, index) => {
        const postCategory = post.dataset.category;
        const shouldShow = category === 'all' || postCategory === category;
        
        if (shouldShow) {
            // Show post with staggered animation
            setTimeout(() => {
                post.style.display = 'block';
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    post.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
            
            visibleCount++;
        } else {
            // Hide post
            post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            post.style.opacity = '0';
            post.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                post.style.display = 'none';
            }, 300);
        }
    });
    
    // Update pagination based on filtered results
    setTimeout(() => {
        updatePaginationForFilter(visibleCount);
    }, 500);
    
    // Show empty state if no posts
    toggleEmptyState(visibleCount === 0, category);
}

function toggleEmptyState(show, category) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
        const categoryName = category === 'all' ? 'this search' : getCategoryDisplayName(category);
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <h3>No Posts Found</h3>
            <p>We don't have any posts in the ${categoryName} category yet.</p>
            <button class="empty-state-btn" onclick="showAllPosts()">View All Posts</button>
        `;
        
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.parentNode.insertBefore(emptyState, postsContainer.nextSibling);
    } else if (!show && emptyState) {
        emptyState.remove();
    }
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'green-living': 'Green Living',
        'reviews': 'Product Reviews',
        'beauty': 'Natural Beauty',
        'fashion': 'Sustainable Fashion'
    };
    
    return categoryMap[category] || category;
}

function showAllPosts() {
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.click();
    }
}

// Sorting functionality
function initializeSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            sortPosts(sortType);
        });
    }
}

function sortPosts(sortType) {
    const postsContainer = document.querySelector('.posts-container');
    const posts = Array.from(postsContainer.querySelectorAll('.blog-post-card'));
    
    // Show loading state
    showLoadingState(true);
    
    posts.sort((a, b) => {
        switch (sortType) {
            case 'newest':
                return compareDates(b, a);
            case 'oldest':
                return compareDates(a, b);
            case 'popular':
                return compareViews(b, a);
            default:
                return 0;
        }
    });
    
    // Remove posts from DOM
    posts.forEach(post => post.remove());
    
    // Add posts back in sorted order with animation
    setTimeout(() => {
        posts.forEach((post, index) => {
            setTimeout(() => {
                postsContainer.appendChild(post);
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    post.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
        
        setTimeout(() => {
            showLoadingState(false);
        }, posts.length * 100 + 500);
    }, 500);
}

function compareDates(a, b) {
    const dateA = new Date(a.querySelector('.post-date').textContent);
    const dateB = new Date(b.querySelector('.post-date').textContent);
    return dateA - dateB;
}

function compareViews(a, b) {
    const viewsA = parseViews(a.querySelector('.post-views').textContent);
    const viewsB = parseViews(b.querySelector('.post-views').textContent);
    return viewsA - viewsB;
}

function parseViews(viewsText) {
    const match = viewsText.match(/(\d+\.?\d*)(k|K)?/);
    if (!match) return 0;
    
    const number = parseFloat(match[1]);
    const multiplier = match[2] && match[2].toLowerCase() === 'k' ? 1000 : 1;
    
    return number * multiplier;
}

function showLoadingState(show) {
    let loadingState = document.querySelector('.loading-state');
    
    if (show && !loadingState) {
        loadingState = document.createElement('div');
        loadingState.className = 'loading-state';
        loadingState.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Sorting posts...</p>
        `;
        
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.parentNode.insertBefore(loadingState, postsContainer);
    } else if (!show && loadingState) {
        loadingState.remove();
    }
}

// Pagination functionality
function initializePagination() {
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    paginationNumbers.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '...') return;
            
            const pageNumber = parseInt(this.textContent);
            goToPage(pageNumber);
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const currentPage = getCurrentPage();
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const currentPage = getCurrentPage();
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
}

function getCurrentPage() {
    const activePage = document.querySelector('.pagination-number.active');
    return activePage ? parseInt(activePage.textContent) : 1;
}

function getTotalPages() {
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    let maxPage = 1;
    
    paginationNumbers.forEach(button => {
        const pageNum = parseInt(button.textContent);
        if (!isNaN(pageNum) && pageNum > maxPage) {
            maxPage = pageNum;
        }
    });
    
    return maxPage;
}

function goToPage(pageNumber) {
    // Update active pagination button
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    paginationNumbers.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === pageNumber) {
            button.classList.add('active');
        }
    });
    
    // Update prev/next button states
    updatePaginationButtons(pageNumber);
    
    // Scroll to top of posts
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // In a real application, you would load posts for this page
    // For now, we'll just show a loading state briefly
    showLoadingState(true);
    setTimeout(() => {
        showLoadingState(false);
        if (window.SummasiteApp) {
            window.SummasiteApp.showNotification(`Loaded page ${pageNumber}`, 'info');
        }
    }, 1000);
}

function updatePaginationButtons(currentPage) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const totalPages = getTotalPages();
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

function updatePaginationForFilter(visibleCount) {
    const postsPerPage = 6; // Assuming 6 posts per page
    const totalPages = Math.ceil(visibleCount / postsPerPage);
    
    if (totalPages <= 1) {
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
    } else {
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'flex';
        }
        
        // Reset to page 1 when filtering
        goToPage(1);
    }
}

// Handle URL parameters
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const category = urlParams.get('category');
    
    if (searchQuery) {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = searchQuery;
            if (window.SummasiteApp) {
                window.SummasiteApp.filterPosts(searchQuery);
            }
        }
    }
    
    if (category) {
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
    }
}

// Advanced search functionality
function initializeAdvancedSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length === 0) {
                showAllPosts();
                return;
            }
            
            if (query.length < 2) return;
            
            searchTimeout = setTimeout(() => {
                performAdvancedSearch(query);
            }, 300);
        });
    }
}

function performAdvancedSearch(query) {
    const posts = document.querySelectorAll('.blog-post-card');
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let visibleCount = 0;
    
    posts.forEach(post => {
        const title = post.querySelector('.post-title a')?.textContent.toLowerCase() || '';
        const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
        const category = post.querySelector('.post-category')?.textContent.toLowerCase() || '';
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const searchableContent = `${title} ${excerpt} ${category} ${tags}`;
        
        const matchScore = searchTerms.reduce((score, term) => {
            if (title.includes(term)) score += 3; // Title matches are weighted more
            if (category.includes(term)) score += 2; // Category matches are weighted
            if (excerpt.includes(term)) score += 1; // Excerpt matches
            if (tags.includes(term)) score += 2; // Tag matches are weighted
            return score;
        }, 0);
        
        if (matchScore > 0) {
            post.style.display = 'block';
            post.dataset.searchScore = matchScore;
            visibleCount++;
        } else {
            post.style.display = 'none';
        }
    });
    
    // Sort visible posts by relevance
    if (visibleCount > 0) {
        sortPostsByRelevance();
    }
    
    toggleEmptyState(visibleCount === 0, 'all');
}

function sortPostsByRelevance() {
    const postsContainer = document.querySelector('.posts-container');
    const visiblePosts = Array.from(postsContainer.querySelectorAll('.blog-post-card[style*="block"]'));
    
    visiblePosts.sort((a, b) => {
        const scoreA = parseInt(a.dataset.searchScore) || 0;
        const scoreB = parseInt(b.dataset.searchScore) || 0;
        return scoreB - scoreA;
    });
    
    // Reorder posts in DOM
    visiblePosts.forEach(post => {
        postsContainer.appendChild(post);
    });
}

// Initialize advanced search if on blog page
if (window.location.pathname.includes('blog.html')) {
    document.addEventListener('DOMContentLoaded', initializeAdvancedSearch);
}

// Export blog-specific functions
window.BlogApp = {
    filterPostsByCategory,
    sortPosts,
    goToPage,
    showAllPosts,
    performAdvancedSearch
};