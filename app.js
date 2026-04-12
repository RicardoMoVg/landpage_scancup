// =========================================
//  SCAN CUP — Landing Page Scripts
// =========================================

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// --- Hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '72px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(5,11,20,.97)';
  navLinks.style.backdropFilter = 'blur(20px)';
  navLinks.style.padding = '20px 24px 28px';
  navLinks.style.gap = '20px';
  navLinks.style.borderBottom = '1px solid rgba(255,255,255,.08)';
  navLinks.style.zIndex = '99';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.style.display = 'none';
  });
});

// --- Particle system ---
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#008751', '#00D1B2', '#E63946', '#FFD700', '#ffffff'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -10px;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 10}s;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width:  ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
}

createParticles();

// --- Intersection Observer for animations ---
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class to elements
const animatable = document.querySelectorAll(
  '.feature-card, .step, .player-card, .testimonial, .stat'
);

animatable.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
  animateOnScroll.observe(el);
});

const styleSheet = document.createElement('style');
styleSheet.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleSheet);

// --- Counter animation for hero stats ---
function animateCounter(el, target, duration = 1800) {
  const suffix = el.textContent.replace(/[\d.]/g, '');
  const start  = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current >= 1000
      ? (current / 1000).toFixed(0) + 'K' + suffix.replace('K', '')
      : current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat__number');
      nums.forEach(n => {
        const raw = n.textContent;
        const num = parseInt(raw.replace(/\D/g, ''));
        const suf = raw.replace(/[\d]/g, '');
        if (!isNaN(num)) animateCounter(n, num);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Tilt effect on player cards ---
document.querySelectorAll('.player-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `
      translateY(-12px)
      rotateX(${-y * 12}deg)
      rotateY(${x * 12}deg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
    setTimeout(() => { card.style.transition = ''; }, 400);
  });
});

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  navItems.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? '#00D1B2'
      : '';
  });
}, { passive: true });
