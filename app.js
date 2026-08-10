/* ══════════════════════════════════════════════════════════════
   DANILO HURWITZ · VIDEO EDITOR PORTFOLIO
   Calculator · Theme · Video controls · Mobile
   ══════════════════════════════════════════════════════════════ */

// ─── CALCULATOR ───
const calcState = {
  tipo: 'reel',
  qty: 1,
  urg: 'normal',
  complex: 'basic'
};

const TIPO_CONFIG = {
  reel:  { basePerUnit: 20, minProject: 18, defaultQty: 1,  presets: [1, 2, 3, 5] },
  ad:    { basePerUnit: 60, minProject: 55, defaultQty: 1,  presets: [1, 2, 3, 5] },
  long:  { basePerUnit: 30, minProject: 80, defaultQty: 10, presets: [5, 10, 20, 30] },
  intro: { basePerUnit: 80, minProject: 80, defaultQty: 1,  presets: [1, 2, 3, 5] }
};

const URG = { normal: 1, urgente: 1.25, express: 1.6 };
const COMPLEX = { basic: 1, mid: 1.35, high: 1.7 };

const TIERS = {
  low:  { t: 'Rango inicial', d: 'Proyectos de entrada con edición básica. Ideal para probar cómo trabajamos.' },
  mid:  { t: 'Rango estándar', d: 'El punto justo para la mayoría de proyectos comerciales con calidad profesional.' },
  high: { t: 'Rango premium', d: 'Proyectos complejos con motion graphics, color grading o deadline agresivo.' }
};

function formatUSD(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function updateCalcQtyUI() {
  const cfg = TIPO_CONFIG[calcState.tipo];
  const qtyNum = document.getElementById('calcQtyNum');
  const qtyInput = document.getElementById('calcQtyInput');
  const presetsWrap = document.getElementById('calcPresets');

  if (calcState.qty < 1) calcState.qty = cfg.defaultQty;

  if (presetsWrap) {
    const presetBtns = presetsWrap.querySelectorAll('.calc-preset:not(#calcPresetCustom)');
    cfg.presets.forEach((val, i) => {
      if (presetBtns[i]) {
        presetBtns[i].dataset.preset = val;
        presetBtns[i].textContent = val;
      }
    });
    presetBtns.forEach(b => b.classList.remove('active'));
    const customBtn = document.getElementById('calcPresetCustom');
    if (customBtn) customBtn.classList.remove('active');
    const matched = Array.from(presetBtns).find(b => parseFloat(b.dataset.preset) === calcState.qty);
    if (matched) matched.classList.add('active');
    else if (customBtn) customBtn.classList.add('active');
  }

  if (qtyNum) qtyNum.textContent = calcState.qty;
  if (qtyInput) {
    qtyInput.value = calcState.qty;
    qtyInput.min = 1;
    qtyInput.max = 180;
  }
}

function computeCalc() {
  const cfg = TIPO_CONFIG[calcState.tipo];

  let price = cfg.basePerUnit * calcState.qty;
  price *= URG[calcState.urg];
  price *= COMPLEX[calcState.complex];
  price = Math.max(price, cfg.minProject);

  let rounded;
  if (price < 100) rounded = Math.round(price / 5) * 5;
  else if (price < 500) rounded = Math.round(price / 10) * 10;
  else rounded = Math.round(price / 25) * 25;

  const rangeEl = document.getElementById('calcRange');
  if (rangeEl) rangeEl.textContent = formatUSD(rounded);

  let tier = TIERS.mid;
  if (rounded >= 300) tier = TIERS.high;
  else if (rounded <= 30) tier = TIERS.low;

  const infoEl = document.getElementById('calcInfo');
  if (infoEl) infoEl.innerHTML = `<strong>${tier.t}</strong><span>${tier.d}</span>`;

  // WhatsApp context
  const tipoLabels = { reel: 'Reel / Short', ad: 'Ad comercial', long: 'Video largo', intro: 'Intro / Outro' };
  const urgLabels = { normal: 'Normal', urgente: 'Urgente', express: 'Express' };
  const complexLabels = { basic: 'Cortes + subtítulos', mid: '+ Motion graphics', high: '+ Color + efectos' };

  const msg = encodeURIComponent(
    `Hola Danilo, quiero cotizar un proyecto:\n· Tipo: ${tipoLabels[calcState.tipo]}\n· Duración: ${calcState.qty} min\n· Urgencia: ${urgLabels[calcState.urg]}\n· Complejidad: ${complexLabels[calcState.complex]}\n· Estimado: ${formatUSD(rounded)} USD`
  );
  const cta = document.getElementById('calcCtaBtn');
  if (cta) cta.href = `https://wa.me/5492302219422?text=${msg}`;
}

// ─── THEME ───
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  try { localStorage.setItem('dh-theme', theme); } catch(e) {}
  const icon = document.querySelector('#themeToggle svg');
  if (icon) {
    if (theme === 'dark') {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
    }
  }
}

function detectTheme() {
  try {
    const saved = localStorage.getItem('dh-theme');
    if (saved) return saved;
  } catch(e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ─── MOBILE MENU ───
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    links.classList.toggle('mobile-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('mobile-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  applyTheme(detectTheme());
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const newT = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newT);
  });

  // Calculator: tipo/urgencia/complexity
  document.querySelectorAll('.calc-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const val = btn.dataset.val;
      calcState[field] = val;
      document.querySelectorAll(`.calc-opt[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (field === 'tipo') {
        calcState.qty = TIPO_CONFIG[val].defaultQty;
        updateCalcQtyUI();
      }
      computeCalc();
    });
  });

  // Calculator: presets
  document.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'calcPresetCustom') {
        const ci = document.getElementById('calcQtyInput');
        if (ci) { ci.focus(); ci.select(); }
        document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        return;
      }
      calcState.qty = parseFloat(btn.dataset.preset);
      document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCalcQtyUI();
      computeCalc();
    });
  });

  // Calculator: custom input
  const calcQtyInput = document.getElementById('calcQtyInput');
  if (calcQtyInput) {
    calcQtyInput.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      calcState.qty = val;
      document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      document.getElementById('calcPresetCustom')?.classList.add('active');
      const qn = document.getElementById('calcQtyNum');
      if (qn) qn.textContent = val;
      computeCalc();
    });
  }

  updateCalcQtyUI();
  computeCalc();

  // Video mute/unmute
  document.querySelectorAll('.vid-mute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.project-video') || btn.closest('.hero-reel');
      if (!container) return;
      const video = container.querySelector('video');
      if (!video) return;
      video.muted = !video.muted;
      btn.querySelector('.icon-vol-off').style.display = video.muted ? '' : 'none';
      btn.querySelector('.icon-vol-on').style.display = video.muted ? 'none' : '';
    });
  });

  // Video lazy loading: play when visible, pause when not
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('video[data-lazy]').forEach(v => {
    v.pause();
    videoObserver.observe(v);
  });

  // Hero video: always try to play
  const heroVid = document.querySelector('.hero-reel video');
  if (heroVid) heroVid.play().catch(() => {});

  // Mobile menu
  initMobileMenu();

  // Mobile sticky CTA
  const stickyBar = document.getElementById('mobileStickyBar');
  if (stickyBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const heroEnd = document.querySelector('.hero')?.offsetHeight || 500;
          stickyBar.classList.toggle('visible', window.scrollY > heroEnd);
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
