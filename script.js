// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in copyright
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize animations
    initAnimations();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Add hover effects to service cards
    initCardEffects();
    
    // Loading screen removal
    setTimeout(() => {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading';
        loadingScreen.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loadingScreen);
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
    }, 100);
});

// Initialize animations
function initAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .step, .contact-item').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Smooth scroll to sections
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Card hover effects
function initCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Social link click tracking (example)
function trackSocialClick(platform) {
    console.log(`Social link clicked: ${platform}`);
    // Here you can add analytics tracking
    // Example: gtag('event', 'social_click', { platform: platform });
}

// Add click event listeners to social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        const platform = this.querySelector('span').textContent;
        trackSocialClick(platform);
    });
});

// Dynamic text effect for agency name
function initAgencyNameEffect() {
    const agencyName = document.querySelector('.agency-name');
    if (!agencyName) return;
    
    // Add periodic glow effect
    setInterval(() => {
        agencyName.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            agencyName.style.filter = 'brightness(10)';
        }, 80);
    }, 85);
}

// Call additional initialization
initAgencyNameEffect();

// Responsive adjustments
window.addEventListener('resize', function() {
    // Adjust social links grid on resize
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks && window.innerWidth < 768) {
        socialLinks.style.gap = '10px';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab key navigation focus styles
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const keyboardNavCSS = `
.keyboard-navigation a:focus,
.keyboard-navigation button:focus,
.keyboard-navigation .social-link:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
}
`;

// Inject keyboard navigation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = keyboardNavCSS;
document.head.appendChild(styleSheet);