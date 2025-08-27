// Contact page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeFAQ();
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate all fields
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission (in a real app, this would send to a server)
    setTimeout(() => {
        // Reset loading state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        
        // Show success message
        showFormMessage('Thank you for your message! We\'ll get back to you within 24-48 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Clear any field errors
        clearAllFieldErrors();
        
        // Track form submission (analytics)
        trackFormSubmission(data.subject);
        
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError({ target: field });
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(field)} is required.`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        if (!isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        if (!isValidPhone(value)) {
            errorMessage = 'Please enter a valid phone number.';
            isValid = false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long.';
            isValid = false;
        }
        if (value.length > 2000) {
            errorMessage = 'Message must be less than 2000 characters.';
            isValid = false;
        }
    }
    
    // Name validation
    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (!/^[a-zA-Z\s\-'\.]+$/.test(value)) {
            errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class to field
    field.classList.add('error');
    
    // Create and add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message
    const errorElement = formGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllFieldErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    const errorFields = document.querySelectorAll('.error');
    
    errorElements.forEach(el => el.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert at top of form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageElement, form.firstChild);
    
    // Show with animation
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 400);
        }
    }, 8000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Accept phones with 10-15 digits
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

function trackFormSubmission(subject) {
    // Analytics tracking (in a real app, this would integrate with analytics services)
    console.log('Form submitted:', {
        subject: subject,
        timestamp: new Date().toISOString()
    });
    
    // Show notification
    if (window.SummasiteApp && window.SummasiteApp.showNotification) {
        window.SummasiteApp.showNotification('Form submitted successfully!', 'success');
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Add form styles dynamically
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            padding: 0.25rem;
            animation: fadeInUp 0.3s ease-out;
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #e74c3c;
            background-color: rgba(231, 76, 60, 0.05);
        }
        
        .form-group input.error:focus,
        .form-group select.error:focus,
        .form-group textarea.error:focus {
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Export functions for global use
window.ContactApp = {
    showFormMessage,
    validateField,
    trackFormSubmission
};