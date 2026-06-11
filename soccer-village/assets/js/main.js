// Sticky nav on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Product tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Countdown timer
function updateCountdown() {
  const end = new Date();
  end.setDate(end.getDate() + 2);
  end.setHours(23, 59, 59, 0);
  const diff = end - new Date();
  if (diff <= 0) return;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
  set('cd-d', d); set('cd-h', h); set('cd-m', m); set('cd-s', s);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Wishlist toggle
document.querySelectorAll('.product-wish').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
  });
});

// Cart add animation
document.querySelectorAll('.product-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = parseInt(badge.textContent || 0) + 1;
      badge.style.transform = 'scale(1.4)';
      setTimeout(() => badge.style.transform = '', 200);
    }
    btn.style.transform = 'scale(.85)';
    setTimeout(() => btn.style.transform = '', 200);
  });
});

// Newsletter form
const form = document.querySelector('.newsletter-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');
    if (input && input.value) {
      btn.textContent = 'Subscribed ✓';
      btn.style.background = '#1a7a3c';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
    }
  });
}
