// Products page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

function initializeProductsPage() {
    initializeProductFilters();
    initializeProductSorting();
    initializePriceFilter();
    initializeQuickView();
    initializeProductSearch();
    handleUrlParams();
}

// Product filtering
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products with animation
            filterProductsByCategory(category, products);
        });
    });

    // Certification filters
    const certificationFilters = document.querySelectorAll('.certification-filters input');
    certificationFilters.forEach(filter => {
        filter.addEventListener('change', applyAdvancedFilters);
    });

    // Rating filters
    const ratingFilters = document.querySelectorAll('.rating-filters input');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', applyAdvancedFilters);
    });
}

function filterProductsByCategory(category, products) {
    let visibleCount = 0;
    
    products.forEach((product, index) => {
        const productCategory = product.dataset.category;
        const shouldShow = category === 'all' || productCategory === category;
        
        if (shouldShow) {
            // Show product with staggered animation
            setTimeout(() => {
                product.style.display = 'block';
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    product.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
            
            visibleCount++;
        } else {
            // Hide product
            product.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            product.style.opacity = '0';
            product.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    // Show empty state if no products
    setTimeout(() => {
        toggleEmptyState(visibleCount === 0, category);
    }, 500);
}

function applyAdvancedFilters() {
    const products = document.querySelectorAll('.product-card');
    const selectedCertifications = Array.from(document.querySelectorAll('.certification-filters input:checked')).map(input => input.value);
    const selectedRating = document.querySelector('.rating-filters input:checked')?.value;
    const priceRange = document.getElementById('priceRange').value;
    
    let visibleCount = 0;
    
    products.forEach(product => {
        let shouldShow = true;
        
        // Check certification filters
        if (selectedCertifications.length > 0) {
            const productFeatures = Array.from(product.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
            const hasRequiredCertification = selectedCertifications.some(cert => {
                switch(cert) {
                    case 'organic':
                        return productFeatures.some(feature => feature.includes('organic') || feature.includes('usda'));
                    case 'gots':
                        return productFeatures.some(feature => feature.includes('gots'));
                    case 'fairtrade':
                        return productFeatures.some(feature => feature.includes('fair trade'));
                    case 'cruelty-free':
                        return productFeatures.some(feature => feature.includes('cruelty'));
                    case 'vegan':
                        return productFeatures.some(feature => feature.includes('vegan'));
                    default:
                        return false;
                }
            });
            
            if (!hasRequiredCertification) {
                shouldShow = false;
            }
        }
        
        // Check rating filter
        if (selectedRating && shouldShow) {
            const productRating = getProductRating(product);
            if (productRating < parseInt(selectedRating)) {
                shouldShow = false;
            }
        }
        
        // Check price filter
        if (shouldShow) {
            const productPrice = getProductPrice(product);
            if (productPrice > parseInt(priceRange)) {
                shouldShow = false;
            }
        }
        
        // Show/hide product
        if (shouldShow) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    toggleEmptyState(visibleCount === 0, 'filtered');
}

function getProductRating(product) {
    const stars = product.querySelector('.stars').textContent;
    return (stars.match(/★/g) || []).length;
}

function getProductPrice(product) {
    const priceText = product.querySelector('.current-price').textContent;
    return parseFloat(priceText.replace('$', ''));
}

// Product sorting
function initializeProductSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            sortProducts(sortType);
        });
    }
}

function sortProducts(sortType) {
    const productsGrid = document.querySelector('.products-grid');
    const products = Array.from(productsGrid.querySelectorAll('.product-card:not([style*="display: none"])'));
    
    // Show loading state
    showLoadingState(true);
    
    products.sort((a, b) => {
        switch (sortType) {
            case 'price-low':
                return getProductPrice(a) - getProductPrice(b);
            case 'price-high':
                return getProductPrice(b) - getProductPrice(a);
            case 'rating':
                return getProductRating(b) - getProductRating(a);
            case 'newest':
                return compareProductDates(b, a);
            case 'featured':
            default:
                return compareProductFeatured(b, a);
        }
    });
    
    // Remove products from DOM
    products.forEach(product => product.remove());
    
    // Add products back in sorted order with animation
    setTimeout(() => {
        products.forEach((product, index) => {
            setTimeout(() => {
                productsGrid.appendChild(product);
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    product.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
        
        setTimeout(() => {
            showLoadingState(false);
        }, products.length * 100 + 500);
    }, 500);
}

function compareProductDates(a, b) {
    // For demo purposes, assume newer products have "New" badge
    const aIsNew = a.querySelector('.product-badge.new') ? 1 : 0;
    const bIsNew = b.querySelector('.product-badge.new') ? 1 : 0;
    return aIsNew - bIsNew;
}

function compareProductFeatured(a, b) {
    const aIsFeatured = a.querySelector('.product-badge') ? 1 : 0;
    const bIsFeatured = b.querySelector('.product-badge') ? 1 : 0;
    return aIsFeatured - bIsFeatured;
}

// Price filter
function initializePriceFilter() {
    const priceRange = document.getElementById('priceRange');
    const maxPriceDisplay = document.getElementById('maxPrice');
    
    if (priceRange && maxPriceDisplay) {
        priceRange.addEventListener('input', function() {
            maxPriceDisplay.textContent = `$${this.value}`;
        });
        
        priceRange.addEventListener('change', applyAdvancedFilters);
    }
}

// Quick view modal
function initializeQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    const modalProduct = document.getElementById('modalProduct');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.product;
            showQuickView(productId);
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', closeQuickView);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuickView();
            }
        });
    }
}

function showQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    const modalProduct = document.getElementById('modalProduct');
    
    // Get product data (in a real app, this would be from a database)
    const productData = getProductData(productId);
    
    if (productData) {
        modalProduct.innerHTML = generateQuickViewHTML(productData);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getProductData(productId) {
    // Mock product data - in a real app, this would come from an API
    const products = {
        'bamboo-kitchen-set': {
            name: 'Bamboo Kitchen Utensil Set',
            price: '$34.99',
            originalPrice: '$49.99',
            image: 'images/bamboo-kitchen-set.jpg',
            rating: 5,
            reviews: 127,
            description: 'Complete 6-piece bamboo cooking utensil set with holder. Made from sustainable bamboo, these utensils are naturally antibacterial and won\'t scratch your cookware.',
            features: ['Biodegradable', 'Non-toxic', 'Dishwasher Safe', 'Heat Resistant', 'Lightweight', 'Durable'],
            specifications: {
                'Material': '100% Natural Bamboo',
                'Pieces': '6 utensils + holder',
                'Care': 'Hand wash recommended',
                'Warranty': '1 year'
            }
        },
        'glass-containers': {
            name: 'Borosilicate Glass Storage Set',
            price: '$52.99',
            image: 'images/glass-food-containers.jpg',
            rating: 5,
            reviews: 89,
            description: 'Premium borosilicate glass food storage containers with airtight bamboo lids. Perfect for meal prep, food storage, and keeping ingredients fresh.',
            features: ['BPA-free', 'Microwave Safe', 'Leak-proof', 'Oven Safe', 'Freezer Safe', 'Dishwasher Safe'],
            specifications: {
                'Material': 'Borosilicate Glass + Bamboo',
                'Set': '5 containers (various sizes)',
                'Temperature Range': '-20°C to 400°C',
                'Warranty': '2 years'
            }
        },
        'skincare-set': {
            name: 'Complete Organic Skincare Routine',
            price: '$89.99',
            originalPrice: '$120.00',
            image: 'images/organic-skincare-set.jpg',
            rating: 5,
            reviews: 203,
            description: '4-step organic skincare system featuring cleanser, toner, vitamin C serum, and moisturizer. Formulated with certified organic ingredients for all skin types.',
            features: ['USDA Organic', 'Cruelty-free', 'Vegan', 'Paraben-free', 'Sulfate-free', 'Natural Fragrance'],
            specifications: {
                'Cleanser': '120ml gentle foaming cleanser',
                'Toner': '100ml balancing rose water toner',
                'Serum': '30ml vitamin C + hyaluronic acid',
                'Moisturizer': '50ml daily hydrating cream'
            }
        }
    };
    
    return products[productId] || null;
}

function generateQuickViewHTML(product) {
    const starsHTML = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    const originalPriceHTML = product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : '';
    const discountHTML = product.originalPrice ? '<span class="discount">25% off</span>' : '';
    
    return `
        <div class="quick-view-product">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
                <h2 class="product-name">${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price}</span>
                    ${originalPriceHTML}
                    ${discountHTML}
                </div>
                <p class="product-description">${product.description}</p>
                
                <div class="product-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="product-specifications">
                    <h4>Specifications:</h4>
                    <div class="specs-grid">
                        ${Object.entries(product.specifications).map(([key, value]) => 
                            `<div class="spec-item">
                                <span class="spec-label">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="quick-view-actions">
                    <button class="add-to-cart-btn">Add to Cart</button>
                    <a href="product-${product.name.toLowerCase().replace(/\s+/g, '-')}.html" class="view-full-btn">View Full Details</a>
                </div>
            </div>
        </div>
    `;
}

// Product search
function initializeProductSearch() {
    const searchInput = document.getElementById('productSearch');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length === 0) {
                showAllProducts();
                return;
            }
            
            if (query.length < 2) return;
            
            searchTimeout = setTimeout(() => {
                searchProducts(query);
            }, 300);
        });
    }
}

function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let visibleCount = 0;
    
    products.forEach(product => {
        const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
        const features = Array.from(product.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const searchableContent = `${name} ${description} ${features}`;
        
        const matchScore = searchTerms.reduce((score, term) => {
            if (name.includes(term)) score += 3; // Name matches are weighted more
            if (description.includes(term)) score += 1; // Description matches
            if (features.includes(term)) score += 2; // Feature matches are weighted
            return score;
        }, 0);
        
        if (matchScore > 0) {
            product.style.display = 'block';
            product.dataset.searchScore = matchScore;
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Sort visible products by relevance
    if (visibleCount > 0) {
        sortProductsByRelevance();
    }
    
    toggleEmptyState(visibleCount === 0, 'search');
}

function sortProductsByRelevance() {
    const productsGrid = document.querySelector('.products-grid');
    const visibleProducts = Array.from(productsGrid.querySelectorAll('.product-card[style*="block"]'));
    
    visibleProducts.sort((a, b) => {
        const scoreA = parseInt(a.dataset.searchScore) || 0;
        const scoreB = parseInt(b.dataset.searchScore) || 0;
        return scoreB - scoreA;
    });
    
    // Reorder products in DOM
    visibleProducts.forEach(product => {
        productsGrid.appendChild(product);
    });
}

function showAllProducts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        product.style.display = 'block';
    });
    
    toggleEmptyState(false);
}

// Utility functions
function toggleEmptyState(show, context = '') {
    let emptyState = document.querySelector('.empty-products');
    
    if (show && !emptyState) {
        let message = 'No products found.';
        if (context === 'search') {
            message = 'No products match your search criteria.';
        } else if (context !== 'all' && context !== 'filtered') {
            const categoryName = getCategoryDisplayName(context);
            message = `No products found in the ${categoryName} category.`;
        }
        
        emptyState = document.createElement('div');
        emptyState.className = 'empty-products';
        emptyState.innerHTML = `
            <h3>No Products Found</h3>
            <p>${message}</p>
            <button onclick="clearAllFilters()">Clear Filters</button>
        `;
        
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.parentNode.insertBefore(emptyState, productsGrid.nextSibling);
    } else if (!show && emptyState) {
        emptyState.remove();
    }
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'home': 'Home & Kitchen',
        'beauty': 'Beauty & Personal Care',
        'fashion': 'Fashion & Accessories',
        'outdoor': 'Outdoor & Travel'
    };
    
    return categoryMap[category] || category;
}

function clearAllFilters() {
    // Reset category filter
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.click();
    }
    
    // Clear certification filters
    document.querySelectorAll('.certification-filters input').forEach(input => {
        input.checked = false;
    });
    
    // Clear rating filters
    document.querySelectorAll('.rating-filters input').forEach(input => {
        input.checked = false;
    });
    
    // Reset price filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = priceRange.max;
        document.getElementById('maxPrice').textContent = `$${priceRange.max}`;
    }
    
    // Clear search
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all products
    showAllProducts();
}

function showLoadingState(show) {
    let loadingState = document.querySelector('.loading-products');
    
    if (show && !loadingState) {
        loadingState = document.createElement('div');
        loadingState.className = 'loading-products';
        loadingState.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.parentNode.insertBefore(loadingState, productsGrid);
    } else if (!show && loadingState) {
        loadingState.remove();
    }
}

// Handle URL parameters
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
    }
    
    if (search) {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = search;
            searchProducts(search);
        }
    }
}

// Export functions for global use
window.ProductsApp = {
    showQuickView,
    clearAllFilters,
    searchProducts,
    filterProductsByCategory
};

// Add quick view styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-product {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
        }
        
        .quick-view-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 15px;
        }
        
        .quick-view-details h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .quick-view-details .product-rating {
            margin-bottom: 1rem;
        }
        
        .quick-view-details .product-price {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .quick-view-details .current-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .quick-view-details .product-description {
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .quick-view-details h4 {
            color: var(--text-dark);
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .quick-view-details .product-features ul {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
        }
        
        .quick-view-details .product-features li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-light);
            color: var(--text-dark);
        }
        
        .quick-view-details .product-features li:last-child {
            border-bottom: none;
        }
        
        .specs-grid {
            display: grid;
            gap: 0.8rem;
            margin-bottom: 2rem;
        }
        
        .spec-item {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 1rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-light);
        }
        
        .spec-label {
            font-weight: 600;
            color: var(--text-dark);
        }
        
        .spec-value {
            color: var(--text-light);
        }
        
        .quick-view-actions {
            display: flex;
            gap: 1rem;
        }
        
        .add-to-cart-btn,
        .view-full-btn {
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .add-to-cart-btn {
            background: var(--primary-color);
            color: white;
            flex: 1;
        }
        
        .add-to-cart-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
        
        .view-full-btn {
            background: var(--bg-sage);
            color: var(--text-dark);
            border: 2px solid var(--border-light);
        }
        
        .view-full-btn:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .quick-view-product {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .quick-view-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
});