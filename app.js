/* ══════════════════════════════════════════════════════════════
   DANILO HURWITZ · VIDEO EDITOR PORTFOLIO
   ══════════════════════════════════════════════════════════════ */

// ─── THEME ───
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  try { localStorage.setItem('dh-theme', theme); } catch(e) {}
  const icon = document.querySelector('#themeToggle svg');
  if (!icon) return;
  icon.innerHTML = theme === 'dark'
    ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
}

function detectTheme() {
  try { const s = localStorage.getItem('dh-theme'); if (s) return s; } catch(e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ─── REVEAL ON SCROLL ───
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('shown'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── ANIMATED COUNTERS ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initStats() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.animated) return;
      e.target.dataset.animated = '1';
      e.target.querySelectorAll('.result-counter').forEach(animateCounter);
      e.target.querySelectorAll('.result-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.result-card:not(.result-card-donut)').forEach(c => obs.observe(c));

  const donutCard = document.querySelector('.result-card-donut');
  if (donutCard) {
    const donutObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || e.target.dataset.animated) return;
        e.target.dataset.animated = '1';
        const circumference = 2 * Math.PI * 72;
        e.target.querySelectorAll('.donut-seg').forEach(seg => {
          const pct = parseFloat(seg.dataset.pct);
          const offset = seg.dataset.offset ? (parseFloat(seg.dataset.offset) / 100) * circumference : 0;
          seg.style.strokeDashoffset = -offset;
          setTimeout(() => {
            seg.style.strokeDasharray = `${(pct/100)*circumference} ${circumference}`;
          }, 150);
        });
      });
    }, { threshold: 0.3 });
    donutObs.observe(donutCard);
  }
}

// ─── MOBILE MENU ───
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    links.classList.toggle('mobile-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('mobile-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── VIDEO CONTROLS ───
function initVideos() {
  document.querySelectorAll('.vid-mute-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const container = btn.closest('.project-video') || btn.closest('.hero-reel');
      const video = container && container.querySelector('video');
      if (!video) return;
      video.muted = !video.muted;
      btn.querySelector('.icon-vol-off').style.display = video.muted ? '' : 'none';
      btn.querySelector('.icon-vol-on').style.display  = video.muted ? 'none' : '';
    });
  });

  const videoObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('video[data-lazy]').forEach(v => {
    v.pause();
    videoObs.observe(v);
  });

  const heroVid = document.querySelector('.hero-reel video');
  if (heroVid) heroVid.play().catch(() => {});
}

// ─── BEFORE/AFTER SLIDER ───
function initBASlider() {
  const container = document.getElementById('baContainer');
  const before = container && container.querySelector('.ba-before');
  const handle = document.getElementById('baHandle');
  if (!container || !before || !handle) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  container.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
  window.addEventListener('mousemove', e => { if (!dragging) return; e.preventDefault(); setPosition(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  container.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (!dragging) return; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
}

// ─── MOBILE STICKY CTA ───
function initStickyCTA() {
  const stickyBar = document.getElementById('mobileStickyBar');
  if (!stickyBar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const heroH = document.querySelector('.hero')?.offsetHeight || 500;
      stickyBar.classList.toggle('visible', window.scrollY > heroH);
      ticking = false;
    });
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(detectTheme());
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
  });

  document.querySelectorAll('.step').forEach((s, i) => {
    s.dataset.n = String(i + 1).padStart(2, '0');
  });

  initReveal();
  initStats();
  initMobileMenu();
  initVideos();
  initBASlider();
  initStickyCTA();
});
