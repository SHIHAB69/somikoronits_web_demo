// Main JavaScript for SOMIKORONITS Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form toggle
    const contactBtn = document.querySelector('.contact-btn');
    const contactForm = document.querySelector('.contact-form-container');
    
    if (contactBtn && contactForm) {
        contactBtn.addEventListener('click', function() {
            contactForm.classList.toggle('active');
            
            if (contactForm.classList.contains('active')) {
                contactBtn.textContent = 'Hide Form';
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                contactBtn.textContent = 'Contact Us';
            }
        });
    }
    
    // Contact form submission
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !service || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Hide form after successful submission
                contactForm.classList.remove('active');
                contactBtn.textContent = 'Contact Us';
            }, 2000);
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content sections
    const contentSections = document.querySelectorAll('.content-section, .services-section, .contact-section');
    contentSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Service cards animation
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Active navigation link highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactForm.classList.contains('active')) {
            contactForm.classList.remove('active');
            contactBtn.textContent = 'Contact Us';
        }
    });
    
    // Mobile menu toggle (if needed for smaller screens)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        });
    }
    
    // Preload images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance optimization: throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(function() {
        // Your scroll event handlers here
    }, 100));
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add active class styles to CSS
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active {
        color: var(--sea-blue) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeNavStyle);

// Loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Initialize tooltip functionality if needed
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

    // Initialize tooltips
    initTooltips();
    
    // Header scroll effect with backdrop blur
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(0, 188, 212, 0.2)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid #333333';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', throttle(updateHeader, 10));
    
    // Enhanced smooth scrolling with easing
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                smoothScrollTo(targetPosition, 1000);
            }
        });
    });
    
    // Custom smooth scroll function with easing
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Enhanced contact form toggle with animation
    const contactBtn = document.querySelector('.contact-btn');
    const navCtaBtn = document.querySelector('.nav-cta-btn');
    const contactForm = document.querySelector('.contact-form-container');
    
    if (contactBtn && contactForm) {
        contactBtn.addEventListener('click', function() {
            const isActive = contactForm.classList.contains('active');
            
            if (!isActive) {
                contactForm.classList.add('active');
                contactBtn.textContent = 'Hide Form';
                contactBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E8E)';
                
                // Animate form appearance
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    contactForm.style.opacity = '1';
                    contactForm.style.transform = 'translateY(0)';
                }, 10);
                
                // Smooth scroll to form
                setTimeout(() => {
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            } else {
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'translateY(-30px)';
                
                setTimeout(() => {
                    contactForm.classList.remove('active');
                    if (contactBtn) {
                        contactBtn.textContent = 'Let\'s Talk';
                        contactBtn.style.background = 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))';
                    }
                }, 300);
            }
        });
    }

    // Add event listeners for both contact buttons
    if (contactBtn && contactForm) {
        contactBtn.addEventListener('click', toggleContactForm);
    }
    
    if (navCtaBtn && contactForm) {
        navCtaBtn.addEventListener('click', function() {
            // Scroll to contact section first
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                smoothScrollTo(targetPosition, 800);
                
                // Then show the form after scrolling
                setTimeout(() => {
                    if (!contactForm.classList.contains('active')) {
                        toggleContactForm();
                    }
                }, 900);
            } else {
                toggleContactForm();
            }
        });
    }
    
    // Enhanced form submission with loading states
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            
            if (!name || !email || !service || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            // Enhanced loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'linear-gradient(135deg, #666, #888)';
            submitBtn.innerHTML = '<span>Sending...</span><div class="spinner"></div>';
            
            // Add spinner CSS
            const spinnerStyle = document.createElement('style');
            spinnerStyle.textContent = `
                .spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-left: 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinnerStyle);
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))';
                
                // Hide form after successful submission
                setTimeout(() => {
                    if (contactForm.classList.contains('active')) {
                        contactBtn.click();
                    }
                }, 2000);
            }, 2000);
        });
    }
    
    // Advanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.content-section, .services-section, .contact-section, .service-item, .services-showcase, .showcase-card, .tech-item, .tech-mastery-section');
    animatableElements.forEach(element => {
        element.classList.add('animate-ready');
        observer.observe(element);
    });
    
    // Add CSS for animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-item.animate-ready {
            transform: translateY(30px) scale(0.95);
        }
        
        .service-item.animate-in {
            transform: translateY(0) scale(1);
        }
        
        .showcase-card.animate-ready {
            transform: translateY(40px) scale(0.9);
            opacity: 0;
        }
        
        .showcase-card.animate-in {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        .services-showcase.animate-ready {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .services-showcase.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tech-item.animate-ready {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
        }
        
        .tech-item.animate-in {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .hero-title {
            animation: fadeInUp 1s ease-out;
        }
        
        .hero-subtitle {
            animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Enhanced active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    
    // Enhanced service card interactions
    const serviceItems = document.querySelectorAll('.service-item');
    const showcaseCards = document.querySelectorAll('.showcase-card');
    serviceItems.forEach((item, index) => {
        // Stagger animation delay
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 188, 212, 0.25)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Enhanced showcase card interactions
    showcaseCards.forEach((card, index) => {
        // Stagger animation delay
        card.style.animationDelay = `${index * 0.15}s`;
        
        // Enhanced hover effects with 3D transform
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02) rotateX(5deg)';
            this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${e.layerX - 10}px;
                top: ${e.layerY - 10}px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactForm && contactForm.classList.contains('active')) {
                contactBtn.click();
            }
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Enhanced focus styles
    const focusStyles = document.createElement('style');
    focusStyles.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(0, 188, 212, 0.2);
        }
        
        .keyboard-navigation .nav-link:focus {
            background: rgba(0, 188, 212, 0.1);
            border-radius: 4px;
            padding: 8px 12px;
            margin: -8px -12px;
        }
    `;
    document.head.appendChild(focusStyles);
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
    
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.contact-btn, .form-submit');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Loading screen animation
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">SOMIKORONITS</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-bg) 0%, var(--gradient-end) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-logo {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-color);
            margin-bottom: 30px;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .loading-bar {
            width: 200px;
            height: 3px;
            background: rgba(0, 188, 212, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
            border-radius: 2px;
            animation: loadingProgress 2s ease-in-out;
        }
        
        @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                // Add page entrance animation
                document.body.style.animation = 'pageEntrance 1s ease-out';
            }, 500);
        }, 1000);
    });
    
    // Add smooth mouse tracking for floating elements
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // Update floating shapes based on mouse position
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const moveX = (mouseX - 0.5) * (20 + index * 5);
            const moveY = (mouseY - 0.5) * (20 + index * 5);
            shape.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Add page entrance animation styles
    const pageAnimationStyles = document.createElement('style');
    pageAnimationStyles.textContent = `
        @keyframes pageEntrance {
            from {
                transform: scale(1.02);
                filter: blur(2px);
            }
            to {
                transform: scale(1);
                filter: blur(0px);
            }
        }
        
        .floating-shape {
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(pageAnimationStyles);
    
    // Performance optimization
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    function updateAnimations() {
        updateHeader();
        updateActiveNav();
        ticking = false;
    }
    
    // Add custom cursor for interactive elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorStyles = document.createElement('style');
    cursorStyles.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            display: none;
        }
        
        @media (hover: hover) {
            .custom-cursor {
                display: block;
            }
            
            .custom-cursor.hover {
                transform: scale(1.5);
                background: rgba(0, 188, 212, 0.1);
            }
        }
    `;
    document.head.appendChild(cursorStyles);
    
    // Custom cursor movement
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Custom cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .service-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Tech items animation function
    function animateTechItems() {
        const techItems = document.querySelectorAll('.tech-item');
        const techSection = document.querySelector('.tech-mastery-section');
        
        if (techSection) {
            const sectionTop = techSection.getBoundingClientRect().top;
            const sectionBottom = techSection.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight && sectionBottom > 0) {
                techItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }
        }
    }
    
    // Initialize tech animation
    window.addEventListener('scroll', throttle(animateTechItems, 100));
    animateTechItems(); // Initial check
});

// Enhanced utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 18px;
        }
        
        .notification-success {
            background: linear-gradient(135deg, #28a745, #20c997);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #dc3545, #fd7e14);
        }
        
        .notification-warning {
            background: linear-gradient(135deg, #ffc107, #fd7e14);
            color: #212529;
        }
        
        .notification-info {
            background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
        }
    `;
    document.head.appendChild(notificationStyles);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}



// Add page transition effects
function addPageTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: opacity 0.3s ease;
        }
        
        .page-transition {
            opacity: 0;
        }
        
        .fade-in {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Initialize page transitions
addPageTransitions();

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', throttle(function() {
    // Adjust hero parallax on resize
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        hero.style.transform = 'translateY(0)';
    }
}, 250)); 