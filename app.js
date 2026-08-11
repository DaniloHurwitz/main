/* ══════════════════════════════════════════════════════════════
   DANILO HURWITZ · VIDEO EDITOR PORTFOLIO
   ══════════════════════════════════════════════════════════════ */

// ─── CALCULATOR ───
const calcState = { tipo: 'reel', qty: 1, urg: 'normal', complex: 'basic' };

const TIPO_CONFIG = {
  reel:  { basePerUnit: 20, min: 18, defaultQty: 1,  presets: [1, 2, 3, 5] },
  ad:    { basePerUnit: 60, min: 55, defaultQty: 1,  presets: [1, 2, 3, 5] },
  long:  { basePerUnit: 30, min: 80, defaultQty: 10, presets: [5, 10, 20, 30] },
  intro: { basePerUnit: 80, min: 80, defaultQty: 1,  presets: [1, 2, 3, 5] }
};
const URG_MULT = { normal: 1, urgente: 1.25, express: 1.6 };
const CPX_MULT = { basic: 1, mid: 1.35, high: 1.7 };
const TIERS = {
  low:  { t: 'Rango inicial',   d: 'Proyectos de entrada. Ideal para probar cómo trabajamos.' },
  mid:  { t: 'Rango estándar',  d: 'El punto justo para la mayoría de proyectos comerciales.' },
  high: { t: 'Rango premium',   d: 'Proyectos complejos, motion graphics, color grading o deadline agresivo.' }
};

function formatUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

function updateCalcPresets() {
  const cfg = TIPO_CONFIG[calcState.tipo];
  const presetBtns = document.querySelectorAll('#calcPresets .calc-preset:not(#calcPresetCustom)');
  presetBtns.forEach((b, i) => {
    if (cfg.presets[i] !== undefined) {
      b.dataset.preset = cfg.presets[i];
      b.textContent = cfg.presets[i];
    }
  });
  presetBtns.forEach(b => b.classList.remove('active'));
  const customBtn = document.getElementById('calcPresetCustom');
  if (customBtn) customBtn.classList.remove('active');
  const matched = Array.from(presetBtns).find(b => parseFloat(b.dataset.preset) === calcState.qty);
  if (matched) matched.classList.add('active');
  else if (customBtn) customBtn.classList.add('active');
  const qn = document.getElementById('calcQtyNum');
  if (qn) qn.textContent = calcState.qty;
}

function computeCalc() {
  const cfg = TIPO_CONFIG[calcState.tipo];
  let price = cfg.basePerUnit * calcState.qty * URG_MULT[calcState.urg] * CPX_MULT[calcState.complex];
  price = Math.max(price, cfg.min);
  let rounded = price < 100 ? Math.round(price/5)*5 : price < 500 ? Math.round(price/10)*10 : Math.round(price/25)*25;

  const rangeEl = document.getElementById('calcRange');
  if (rangeEl) {
    rangeEl.style.opacity = '0.5';
    setTimeout(() => { rangeEl.textContent = formatUSD(rounded); rangeEl.style.opacity = '1'; }, 80);
  }

  const tier = rounded >= 300 ? TIERS.high : rounded <= 30 ? TIERS.low : TIERS.mid;
  const infoEl = document.getElementById('calcInfo');
  if (infoEl) infoEl.innerHTML = `<strong>${tier.t}</strong><span>${tier.d}</span>`;

  const tipoLabels = { reel: 'Reel / Short', ad: 'Ad comercial', long: 'Video largo', intro: 'Intro / Outro' };
  const urgLabels  = { normal: 'Normal', urgente: 'Urgente', express: 'Express' };
  const cpxLabels  = { basic: 'Cortes + subtítulos', mid: '+ Motion graphics', high: '+ Color + efectos' };
  const msg = encodeURIComponent(
    `Hola Danilo, quiero cotizar:\n· Tipo: ${tipoLabels[calcState.tipo]}\n· Duración: ${calcState.qty} min\n· Urgencia: ${urgLabels[calcState.urg]}\n· Complejidad: ${cpxLabels[calcState.complex]}\n· Estimado: ${formatUSD(rounded)} USD`
  );
  const cta = document.getElementById('calcCtaBtn');
  if (cta) cta.href = `https://wa.me/5492302219422?text=${msg}`;
}

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
      // counters
      e.target.querySelectorAll('.result-counter').forEach(animateCounter);
      // bars
      e.target.querySelectorAll('.result-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.result-card:not(.result-card-donut)').forEach(c => obs.observe(c));

  // Donut
  const donutCard = document.querySelector('.result-card-donut');
  if (donutCard) {
    const donutObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || e.target.dataset.animated) return;
        e.target.dataset.animated = '1';
        const circumference = 2 * Math.PI * 72; // r=72
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
  // Mute/unmute buttons
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

  // Lazy play/pause on intersection
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

  // Hero video: play immediately
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

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  applyTheme(detectTheme());
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
  });

  // Add data-n to process steps
  document.querySelectorAll('.step').forEach((s, i) => {
    s.dataset.n = String(i + 1).padStart(2, '0');
  });

  // Calculator: tipo / urg / complex
  document.querySelectorAll('.calc-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const { field, val } = btn.dataset;
      calcState[field] = val;
      document.querySelectorAll(`.calc-opt[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (field === 'tipo') {
        calcState.qty = TIPO_CONFIG[val].defaultQty;
        updateCalcPresets();
      }
      computeCalc();
    });
  });

  // Calculator: presets
  document.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'calcPresetCustom') {
        const inp = document.getElementById('calcQtyInput');
        if (inp) { inp.focus(); inp.select(); }
        document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        return;
      }
      calcState.qty = parseFloat(btn.dataset.preset);
      document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const qn = document.getElementById('calcQtyNum');
      if (qn) qn.textContent = calcState.qty;
      computeCalc();
    });
  });

  // Calculator: custom input
  document.getElementById('calcQtyInput')?.addEventListener('input', e => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    calcState.qty = val;
    document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
    document.getElementById('calcPresetCustom')?.classList.add('active');
    const qn = document.getElementById('calcQtyNum');
    if (qn) qn.textContent = val;
    computeCalc();
  });

  updateCalcPresets();
  computeCalc();

  // Mobile sticky CTA
  const stickyBar = document.getElementById('mobileStickyBar');
  if (stickyBar) {
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

  initReveal();
  initStats();
  initMobileMenu();
  initVideos();
  initBASlider();
});
