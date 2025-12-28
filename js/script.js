/*
 * WAITING FOR YOU - MAIN SCRIPT
 * Handles all functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadConfigData();
    initCountdown();
    initFloatingStars();
    initScrollReveal();
    initLightbox();
}

/* =========================================
   1. LOAD DATA FROM CONFIG
   ========================================= */
function loadConfigData() {
    // Hero Section
    document.getElementById('friend-photo').src = CONFIG.friend.photo;
    document.getElementById('hero-title').textContent = `Waiting for you, ${CONFIG.friend.name}`;
    document.getElementById('hero-subtitle').textContent = `until we ${CONFIG.reunion.activity} 🙌`;
    document.getElementById('reunion-place').textContent = CONFIG.reunion.place;

    // Format date nicely
    const dateObj = new Date(CONFIG.reunion.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('reunion-date-display').textContent = dateObj.toLocaleDateString('en-US', options);

    // Message Section
    document.getElementById('msg-greeting').textContent = CONFIG.letter.greeting;
    document.getElementById('msg-body').textContent = CONFIG.letter.message;
    document.getElementById('msg-closing').textContent = CONFIG.letter.closing;
    document.getElementById('msg-signature').textContent = CONFIG.letter.signature;

    // Memories Section
    const memoriesGrid = document.getElementById('memories-grid');
    CONFIG.memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card reveal';
        card.style.transitionDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${memory.photo}" alt="Memory" class="memory-img">
            <div class="memory-info">
                <p class="memory-caption">${memory.caption}</p>
                ${CONFIG.settings.showPhotoDates ? `<p class="memory-date">${memory.date}</p>` : ''}
            </div>
        `;

        // Add click event for lightbox
        card.addEventListener('click', () => openLightbox(memory));
        memoriesGrid.appendChild(card);
    });

    // Reasons Section
    const reasonsList = document.getElementById('reasons-list');
    CONFIG.reasons.forEach((reason, index) => {
        const item = document.createElement('div');
        item.className = 'reason-card reveal';
        item.style.transitionDelay = `${index * 0.1}s`;

        item.innerHTML = `
            <div class="reason-emoji">${reason.emoji}</div>
            <div class="reason-text">${reason.text}</div>
        `;
        reasonsList.appendChild(item);
    });

    // Final Section
    document.getElementById('final-quote').textContent = CONFIG.quotes.final;
    document.getElementById('creator-photo').src = CONFIG.creator.photo;
    document.getElementById('friend-photo-final').src = CONFIG.friend.photo;
    document.getElementById('names-display').textContent = `${CONFIG.creator.name} & ${CONFIG.friend.name}`;

    // Footer
    document.getElementById('footer-text').textContent = CONFIG.quotes.footer;
}

/* =========================================
   2. COUNTDOWN TIMER
   ========================================= */
function initCountdown() {
    const reunionDate = new Date(CONFIG.reunion.date).getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = reunionDate - now;

        // Calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        updateNumber('days', days);
        updateNumber('hours', hours);
        updateNumber('minutes', minutes);
        updateNumber('seconds', seconds);

        // If countdown finished
        if (distance < 0) {
            clearInterval(timer);
            startCelebration();
        }
    }, 1000);
}

function updateNumber(id, value) {
    const element = document.getElementById(id);
    const formatted = value < 10 ? `0${value}` : value;
    if (element.textContent != formatted) {
        element.textContent = formatted;
        // Small pop animation could go here
    }
}

/* =========================================
   3. REUNION / CELEBRATION MODE
   ========================================= */
function startCelebration() {
    const heroSection = document.getElementById('hero');
    heroSection.classList.add('celebrate');

    // Switch Texts
    document.getElementById('hero-title').textContent = CONFIG.reunionDay.title;
    document.getElementById('hero-subtitle').textContent = CONFIG.reunionDay.subtitle;

    // Show Reunion Message
    const msgBox = document.getElementById('reunion-message');
    msgBox.classList.remove('hidden');
    msgBox.querySelector('.reunion-title').textContent = "IT'S TIME!";
    msgBox.querySelector('.reunion-subtitle').textContent = CONFIG.reunionDay.message;
    msgBox.querySelector('.reunion-body').textContent = CONFIG.reunionDay.cta;

    // Start Confetti
    startConfetti();
}

function startConfetti() {
    // Simple confetti using CSS and JS creation
    const colors = ['#FF9B50', '#FFBB70', '#E25E3E', '#9B59B6', '#45B7AA', '#FFD700'];
    const container = document.body;

    setInterval(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        // Animation
        const duration = Math.random() * 3 + 2;
        confetti.style.transition = `top ${duration}s linear, transform ${duration}s ease-in-out`;

        container.appendChild(confetti);

        // Trigger animation next frame
        requestAnimationFrame(() => {
            confetti.style.top = '100vh';
            confetti.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 50 - 25}px)`;
        });

        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }, 100);
}

/* =========================================
   4. FLOATING STARS BACKGROUND
   ========================================= */
function initFloatingStars() {
    const container = document.getElementById('floating-stars');
    const starSymbols = ['✨', '⭐', '💫', '🌟'];
    const starCount = 20;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
        star.className = 'star';

        // Random positioning
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random animation properties
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * -30;

        star.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
        star.style.fontSize = `${10 + Math.random() * 20}px`;

        container.appendChild(star);
    }
}

/* =========================================
   5. SCROLL REVEAL
   ========================================= */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* =========================================
   6. LIGHTBOX
   ========================================= */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');

    // Close events
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

function openLightbox(memory) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = memory.photo;
    caption.textContent = memory.caption;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}
