/**
 * Main JavaScript file for Pluriscience
 * Contains common functionality used across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCarousel();
    initStatsCounter();
    initProfile();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transition = 'all 0.3s ease';
            });
            
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Carousel Functionality
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || !track || slides.length === 0) return;
    
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    // maxIndex = nombre total de slides - nombre visible (pour défiler d'un bloc à la fois)
    let maxIndex = slides.length - slidesPerView;
    
    // Create dots (un dot par slide)
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Aller à la slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function getSlidesPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }
    
    function updateCarousel() {
        const slideWidth = 100 / slidesPerView;
        // Déplace d'un seul bloc à la fois
        const offset = currentIndex * slideWidth;
        track.style.transform = `translateX(-${offset}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1 < 0 ? maxIndex : currentIndex - 1);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            slidesPerView = getSlidesPerView();
            maxIndex = slides.length - slidesPerView;
            currentIndex = Math.min(currentIndex, maxIndex);
            createDots();
            updateCarousel();
        }, 100);
    });
    
    // Initialize
    createDots();
    updateCarousel();
    
    // Auto-play avec intervalle plus long (7 secondes)
    let autoPlayInterval = setInterval(nextSlide, 7000);
    
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 7000);
    });
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.target);
                animateCounter(target, finalValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Local Storage Helpers
 */
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error writing to localStorage:', e);
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

// Export for use in other files
window.Storage = Storage;

/**
 * Profile Management
 */
function initProfile() {
    const user = Storage.get('user');
    
    if (user) {
        showLoggedInState(user);
    } else {
        showLoggedOutState();
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('profileDropdown');
        const avatarBtn = document.querySelector('.profile-avatar-btn');
        
        if (dropdown && avatarBtn && !dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

function showLoggedInState(user) {
    const loggedOut = document.getElementById('profileLoggedOut');
    const loggedIn = document.getElementById('profileLoggedIn');
    const avatar = document.getElementById('profileAvatar');
    
    if (loggedOut) loggedOut.style.display = 'none';
    if (loggedIn) loggedIn.style.display = 'block';
    if (avatar && user.avatar) {
        avatar.src = user.avatar;
    } else if (avatar) {
        // Default avatar placeholder
        avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User') + '&background=1e5a7e&color=fff';
    }
}

function showLoggedOutState() {
    const loggedOut = document.getElementById('profileLoggedOut');
    const loggedIn = document.getElementById('profileLoggedIn');
    
    if (loggedOut) loggedOut.style.display = 'flex';
    if (loggedIn) loggedIn.style.display = 'none';
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function openAuthModal(type) {
    // Placeholder pour ouvrir un modal de connexion/inscription
    // Vous pouvez implémenter votre propre système d'authentification ici
    if (type === 'login') {
        // Simulation de connexion pour démonstration
        const demoUser = {
            name: 'Utilisateur Demo',
            email: 'demo@pluriscience.fr',
            avatar: null
        };
        Storage.set('user', demoUser);
        showLoggedInState(demoUser);
        alert('Connexion simulée ! (Remplacez par votre système d\'authentification)');
    } else if (type === 'signup') {
        alert('Inscription - Implémentez votre formulaire d\'inscription ici');
    }
}

function logout() {
    Storage.remove('user');
    showLoggedOutState();
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('active');
}

// Export functions globally
window.toggleProfileMenu = toggleProfileMenu;
window.openAuthModal = openAuthModal;
window.logout = logout;
