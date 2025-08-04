// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 2000);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Phone Screen Animation
let currentScreen = 0;
const screens = document.querySelectorAll('.app-screen');
const totalScreens = screens.length;

function switchScreen() {
    screens[currentScreen].classList.remove('active');
    currentScreen = (currentScreen + 1) % totalScreens;
    screens[currentScreen].classList.add('active');
}

// Auto-switch phone screens every 4 seconds
setInterval(switchScreen, 4000);

// Water Level Animation
function animateWaterLevel() {
    const waterFill = document.querySelector('.water-fill');
    if (waterFill) {
        const levels = ['45%', '65%', '80%', '95%'];
        const texts = ['1.1L / 2.5L', '1.6L / 2.5L', '2.0L / 2.5L', '2.4L / 2.5L'];
        let currentLevel = 0;
        
        setInterval(() => {
            waterFill.style.height = levels[currentLevel];
            const levelText = document.querySelector('.level-text');
            if (levelText) {
                levelText.textContent = texts[currentLevel];
            }
            currentLevel = (currentLevel + 1) % levels.length;
        }, 3000);
    }
}

// Start water level animation after page load
setTimeout(animateWaterLevel, 3000);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, [data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (target === 2.1) {
                    counter.textContent = current.toFixed(1);
                } else if (target === 4.8) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target === 2.1) {
                    counter.textContent = '2.1';
                } else if (target === 4.8) {
                    counter.textContent = '4.8';
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Screenshots Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.screenshot-item');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Feature Cards Hover Effect
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.feature-icon i');
        if (icon) {
            icon.style.animation = 'pulse 0.6s ease-in-out';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.feature-icon i');
        if (icon) {
            icon.style.animation = '';
        }
    });
});

// Add Button Click Effects
const addButtons = document.querySelectorAll('.add-btn');
addButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Animate water level increase
        const waterFill = document.querySelector('.water-fill');
        const levelText = document.querySelector('.level-text');
        if (waterFill && levelText) {
            const currentHeight = parseInt(waterFill.style.height) || 65;
            const newHeight = Math.min(currentHeight + 10, 100);
            waterFill.style.height = newHeight + '%';
            
            // Update text based on height
            const amount = (newHeight / 100 * 2.5).toFixed(1);
            levelText.textContent = `${amount}L / 2.5L`;
        }
    });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Lütfen tüm alanları doldurun.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Gönderiliyor...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showNotification('Mesajınız başarıyla gönderildi!', 'success');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#4CAF50';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        default:
            notification.style.background = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.wave');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateX(-50%) rotate(${scrolled * speed * 0.1}deg)`;
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .add-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Lazy Loading for Images (if any images are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
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

// Initialize lazy loading
lazyLoadImages();

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional)
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-water);
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', scrollToTop);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Add hover effects to download buttons
const downloadButtons = document.querySelectorAll('.download-btn');
downloadButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        showSlide(currentSlide);
    } else if (e.key === 'ArrowRight') {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
});

// Add focus management for accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize focus trap for mobile menu when active
const mobileMenuObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (navMenu.classList.contains('active')) {
                trapFocus(navMenu);
            }
        }
    });
});

mobileMenuObserver.observe(navMenu, { attributes: true });

// Reviews Carousel
document.addEventListener('DOMContentLoaded', () => {
    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (reviewsTrack && prevBtn && nextBtn) {
        let currentIndex = 0;
        const reviewCards = reviewsTrack.querySelectorAll('.review-card');
        const totalCards = reviewCards.length;
        const cardsToShow = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
        const cardWidth = 350 + 30; // card width + gap
        
        // Auto scroll functionality
        let autoScrollInterval;
        
        function updateCarousel() {
            const translateX = -(currentIndex * cardWidth);
            reviewsTrack.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalCards - cardsToShow;
        }
        
        function nextSlide() {
            if (currentIndex < totalCards - cardsToShow) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        }
        
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalCards - cardsToShow; // Loop to end
            }
            updateCarousel();
        }
        
        function startAutoScroll() {
            autoScrollInterval = setInterval(nextSlide, 4000);
        }
        
        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            nextSlide();
            startAutoScroll();
        });
        
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            prevSlide();
            startAutoScroll();
        });
        
        // Pause auto-scroll on hover
        reviewsTrack.addEventListener('mouseenter', stopAutoScroll);
        reviewsTrack.addEventListener('mouseleave', startAutoScroll);
        
        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        reviewsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoScroll();
        });
        
        reviewsTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoScroll();
        });
        
        // Responsive updates
        window.addEventListener('resize', () => {
            const newCardsToShow = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
            if (currentIndex >= totalCards - newCardsToShow) {
                currentIndex = Math.max(0, totalCards - newCardsToShow);
            }
            updateCarousel();
        });
        
        // Initialize
        updateCarousel();
        startAutoScroll();
    }
});

console.log('Su Takip website loaded successfully! 💧');
