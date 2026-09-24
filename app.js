/* ══════════════════════════════════════════════════════════════
   DANILO HURWITZ · EDITOR DE VIDEO
   Vanilla JS, sin dependencias. Cada bloque se inicializa solo si
   su HTML existe: podés borrar una sección sin romper el resto.
   ══════════════════════════════════════════════════════════════ */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const COARSE = matchMedia('(pointer: coarse)').matches;
const ease = t => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const DESKTOP = () => innerWidth > 900;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Timecode HH:MM:SS:FF a 25 fps, como en Premiere
function tc(sec) {
  const f = Math.floor((sec % 1) * 25);
  const s = Math.floor(sec) % 60, m = Math.floor(sec / 60) % 60, h = Math.floor(sec / 3600);
  return [h, m, s, f].map(n => String(n).padStart(2, '0')).join(':');
}
const mmss = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';

// Un solo loop de scroll para todo (rAF), en vez de un listener por bloque
const onScroll = [];
let ticking = false;
function runScroll() { onScroll.forEach(fn => fn()); ticking = false; }
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }, { passive: true });
// En el celular, mostrar u ocultar la barra del navegador cambia el alto de la ventana
// y dispara resize. Eso no es un resize real: si recalculamos todo, la página "salta".
const resizers = [];
const onResize = fn => resizers.push(fn);
let lastW = innerWidth;
addEventListener('resize', () => {
  if (COARSE && innerWidth === lastW) return;
  lastW = innerWidth;
  resizers.forEach(fn => fn());
  requestAnimationFrame(runScroll);
});
const easeIO = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── HERO: el titular se dice como un subtítulo dinámico ───
function initKaraoke() {
  const words = $$('#heroTitle .w');
  if (!words.length) return;
  if (REDUCED) { words.forEach(w => w.classList.add('is-said')); return; }
  let i = 0;
  (function next() {
    if (i > 0) { words[i - 1].classList.remove('is-now'); words[i - 1].classList.add('is-said'); }
    if (i >= words.length) return;
    const w = words[i];
    const pause = w.classList.contains('w-cut') && !words[i - 1].classList.contains('w-cut') ? 420 : 0;
    setTimeout(() => { w.classList.add('is-now'); i++; setTimeout(next, 230); }, pause);
  })();
}

// ─── MARQUEE: acelera y cambia de sentido con el scroll ───
function initMarquee() {
  const track = $('#marqueeTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML;          // duplicado para loop continuo
  if (REDUCED) return;
  let x = 0, dir = 1, lastY = scrollY, boost = 0, inView = false, running = false;
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView && !running) { running = true; lastY = scrollY; requestAnimationFrame(loop); }
  }).observe(track.parentElement);
  function loop() {
    if (!inView) { running = false; return; }
    const dy = scrollY - lastY; lastY = scrollY;
    if (dy !== 0) dir = dy > 0 ? 1 : -1;
    boost = boost * 0.9 + Math.abs(dy) * 0.12;
    x -= (0.6 + boost) * dir;
    const half = track.scrollWidth / 2;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(loop);
  }
}

// ─── AUTOPLAY: solo se reproduce lo que está a la vista ───
function initAutoplay() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !REDUCED) v.play().catch(() => {});
    else if (!e.isIntersecting && v.muted) v.pause();
  }), { rootMargin: '150px 0px' });
  $$('video[data-auto]').forEach(v => io.observe(v));
}

function muteAllExcept(video) {
  $$('video').forEach(v => {
    if (v === video) return;
    v.muted = true;
    v.closest('[data-player]')?.classList.remove('has-sound');
  });
}


// ══════════════════════════════════════════════════════════════
// DISPOSITIVOS 3D (iPhone, MacBook, monitor)
// Secuencias de 72 imágenes dibujadas en canvas según el scroll, como en
// las páginas de producto de Apple. La pantalla es HTML real (video o UI)
// proyectado sobre el render con una homografía (matrix3d).
// ══════════════════════════════════════════════════════════════
const SCREENS = {
  phone: [[[[0.5995,0.1397],[0.26714,0.27829],[0.4825,0.8394],[0.75152,0.69196]],-0.7499],[[[0.5995,0.1397],[0.26713,0.27828],[0.4825,0.8394],[0.75153,0.69196]],-0.7499],[[[0.59953,0.1397],[0.26709,0.27824],[0.48248,0.83939],[0.75158,0.692]],-0.7501],[[[0.59959,0.13969],[0.26699,0.27814],[0.48244,0.83939],[0.75171,0.6921]],-0.7505],[[[0.59971,0.13967],[0.26677,0.27794],[0.48235,0.83939],[0.75196,0.69229]],-0.7514],[[[0.5999,0.13964],[0.26643,0.27762],[0.4822,0.83939],[0.75238,0.69262]],-0.7528],[[[0.6002,0.1396],[0.26591,0.27713],[0.48198,0.83938],[0.75299,0.6931]],-0.755],[[[0.60061,0.13954],[0.26521,0.27645],[0.48168,0.83937],[0.75385,0.69377]],-0.7579],[[[0.60116,0.13947],[0.26428,0.27554],[0.48127,0.83936],[0.75499,0.69467]],-0.7618],[[[0.60186,0.13937],[0.26312,0.27439],[0.48075,0.83934],[0.75643,0.69583]],-0.7668],[[[0.60274,0.13925],[0.26171,0.27295],[0.48011,0.83932],[0.75821,0.69727]],-0.7729],[[[0.60381,0.13912],[0.26006,0.2712],[0.47932,0.83928],[0.76035,0.69905]],-0.7803],[[[0.6051,0.13896],[0.25817,0.26912],[0.4784,0.83923],[0.76287,0.70119]],-0.7889],[[[0.60661,0.13877],[0.25606,0.26669],[0.47731,0.83916],[0.76578,0.70374]],-0.7988],[[[0.60837,0.13857],[0.25378,0.26388],[0.47607,0.83907],[0.76908,0.70672]],-0.81],[[[0.6104,0.13836],[0.25138,0.26068],[0.47466,0.83894],[0.77275,0.71018]],-0.8224],[[[0.6127,0.13813],[0.24895,0.25709],[0.47309,0.83877],[0.77678,0.71417]],-0.8359],[[[0.61528,0.13789],[0.24658,0.25309],[0.47135,0.83855],[0.78112,0.71871]],-0.8503],[[[0.61814,0.13765],[0.24442,0.24869],[0.46948,0.83827],[0.7857,0.72386]],-0.8654],[[[0.62129,0.13741],[0.2426,0.24391],[0.46748,0.83792],[0.79044,0.72964]],-0.8807],[[[0.62471,0.13717],[0.24133,0.23876],[0.46538,0.83748],[0.79521,0.73611]],-0.8959],[[[0.62836,0.13695],[0.24081,0.23329],[0.46323,0.83695],[0.79988,0.74329]],-0.9104],[[[0.63221,0.13675],[0.24128,0.22754],[0.46108,0.8363],[0.80424,0.7512]],-0.9234],[[[0.63618,0.13656],[0.24301,0.22157],[0.45902,0.83553],[0.80807,0.75986]],-0.9341],[[[0.64019,0.13639],[0.24629,0.21545],[0.45712,0.83463],[0.81108,0.76928]],-0.9415],[[[0.6441,0.13623],[0.25143,0.20927],[0.45552,0.8336],[0.81292,0.77943]],-0.9444],[[[0.64775,0.13607],[0.25872,0.20313],[0.45437,0.83245],[0.8132,0.79029]],-0.9415],[[[0.65091,0.13588],[0.26848,0.19713],[0.45383,0.83118],[0.81146,0.80177]],-0.9312],[[[0.65332,0.13564],[0.28099,0.1914],[0.45411,0.82982],[0.80716,0.81377]],-0.9119],[[[0.65461,0.1353],[0.2965,0.18602],[0.45546,0.82842],[0.79974,0.82615]],-0.8818],[[[0.65439,0.1348],[0.31521,0.18113],[0.45815,0.82704],[0.78859,0.83871]],-0.8391],[[[0.65215,0.13409],[0.33727,0.17679],[0.46245,0.82576],[0.77307,0.85118]],-0.7819],[[[0.64733,0.13307],[0.36273,0.17309],[0.46868,0.82469],[0.7526,0.86326]],-0.7086],[[[0.63932,0.13168],[0.39151,0.17004],[0.47713,0.82395],[0.7267,0.87458]],-0.6177],[[[0.62745,0.12982],[0.42342,0.16765],[0.48811,0.8237],[0.69507,0.88475]],-0.5084],[[[0.61108,0.12745],[0.45813,0.16584],[0.50184,0.8241],[0.65767,0.89334]],-0.3803],[[[0.58999,0.12458],[0.49455,0.16448],[0.51823,0.82531],[0.61552,0.89989]],-0.2363],[[[0.56628,0.12156],[0.52896,0.16345],[0.53563,0.82724],[0.57336,0.90392]],-0.0917],[[[0.54118,0.11858],[0.56039,0.16251],[0.55325,0.82977],[0.53313,0.90586]],0.0476],[[[0.51561,0.11579],[0.5886,0.16148],[0.57065,0.83274],[0.49581,0.90621]],0.1787],[[[0.49033,0.1133],[0.6135,0.16027],[0.58744,0.83602],[0.46198,0.90544]],0.2996],[[[0.46598,0.11118],[0.63515,0.15882],[0.60334,0.83949],[0.43192,0.90391]],0.4093],[[[0.44303,0.1095],[0.65367,0.15711],[0.61816,0.84305],[0.40569,0.90193]],0.5071],[[[0.4218,0.10825],[0.66925,0.15516],[0.63175,0.8466],[0.38313,0.89973]],0.593],[[[0.40247,0.10742],[0.68214,0.15301],[0.64406,0.85008],[0.36402,0.89747]],0.6676],[[[0.38512,0.10699],[0.69261,0.15069],[0.65505,0.85341],[0.34802,0.89527]],0.7315],[[[0.36975,0.10691],[0.70093,0.14827],[0.66475,0.85656],[0.33479,0.89321]],0.7855],[[[0.35628,0.10712],[0.70738,0.14578],[0.67321,0.85951],[0.32397,0.89133]],0.8306],[[[0.3446,0.10758],[0.71222,0.14328],[0.68051,0.86223],[0.31522,0.88965]],0.8678],[[[0.33456,0.10823],[0.71573,0.14081],[0.68673,0.86472],[0.30823,0.88818]],0.8982],[[[0.32599,0.10902],[0.71813,0.13841],[0.69199,0.86698],[0.3027,0.8869]],0.9226],[[[0.31874,0.1099],[0.71963,0.13611],[0.69638,0.86901],[0.29838,0.8858]],0.942],[[[0.31264,0.11083],[0.72043,0.13393],[0.70001,0.87082],[0.29505,0.88487]],0.9573],[[[0.30754,0.11178],[0.72069,0.1319],[0.70299,0.87242],[0.29252,0.88409]],0.969],[[[0.3033,0.11273],[0.72055,0.13002],[0.7054,0.87383],[0.29062,0.88344]],0.978],[[[0.2998,0.11363],[0.72013,0.12831],[0.70733,0.87506],[0.28922,0.88291]],0.9847],[[[0.29692,0.11449],[0.71952,0.12677],[0.70887,0.87613],[0.28821,0.88247]],0.9896],[[[0.29457,0.11528],[0.71882,0.12539],[0.71009,0.87705],[0.28749,0.8821]],0.9931],[[[0.29265,0.116],[0.71807,0.12418],[0.71104,0.87783],[0.287,0.88181]],0.9956],[[[0.29111,0.11664],[0.71733,0.12313],[0.71177,0.87849],[0.28667,0.88158]],0.9973],[[[0.28987,0.11719],[0.71664,0.12223],[0.71233,0.87904],[0.28645,0.88139]],0.9984],[[[0.28888,0.11767],[0.71601,0.12148],[0.71276,0.87949],[0.28632,0.88124]],0.9991],[[[0.28811,0.11807],[0.71546,0.12086],[0.71309,0.87986],[0.28624,0.88112]],0.9995],[[[0.28751,0.11839],[0.71499,0.12036],[0.71333,0.88015],[0.2862,0.88103]],0.9998],[[[0.28706,0.11864],[0.71462,0.11997],[0.7135,0.88038],[0.28618,0.88096]],0.9999],[[[0.28672,0.11884],[0.71433,0.11967],[0.71363,0.88055],[0.28617,0.88091]],1],[[[0.28649,0.11898],[0.71412,0.11946],[0.71371,0.88067],[0.28617,0.88088]],1],[[[0.28633,0.11907],[0.71398,0.11932],[0.71377,0.88075],[0.28617,0.88085]],1],[[[0.28624,0.11913],[0.71389,0.11923],[0.7138,0.88079],[0.28617,0.88084]],1],[[[0.28619,0.11916],[0.71385,0.11919],[0.71382,0.88082],[0.28617,0.88083]],1],[[[0.28617,0.11917],[0.71383,0.11917],[0.71383,0.88083],[0.28617,0.88083]],1],[[[0.28617,0.11917],[0.71383,0.11917],[0.71383,0.88083],[0.28617,0.88083]],1]],
  laptop: [[[[0.20067,0.81268],[0.7566,0.98313],[0.87623,0.78713],[0.40278,0.67736]],-0.3044],[[[0.20067,0.81267],[0.7566,0.98311],[0.87623,0.78713],[0.40278,0.67736]],-0.3043],[[[0.20066,0.81259],[0.75662,0.98299],[0.87622,0.78711],[0.40276,0.67736]],-0.3042],[[[0.20063,0.81237],[0.75668,0.98267],[0.8762,0.78707],[0.40271,0.67735]],-0.3038],[[[0.20058,0.81193],[0.75678,0.98205],[0.87616,0.78699],[0.40261,0.67734]],-0.303],[[[0.20049,0.81122],[0.75696,0.98103],[0.8761,0.78685],[0.40245,0.67731]],-0.3018],[[[0.20037,0.81015],[0.75723,0.97949],[0.876,0.78665],[0.4022,0.67728]],-0.2999],[[[0.20019,0.80866],[0.75759,0.97735],[0.87587,0.78636],[0.40187,0.67724]],-0.2972],[[[0.19996,0.80667],[0.75809,0.9745],[0.87569,0.78598],[0.40142,0.67718]],-0.2937],[[[0.19967,0.80411],[0.75872,0.97083],[0.87546,0.7855],[0.40084,0.6771]],-0.2891],[[[0.19932,0.8009],[0.75952,0.96623],[0.87516,0.78489],[0.40012,0.677]],-0.2834],[[[0.1989,0.79697],[0.7605,0.96061],[0.87481,0.78415],[0.39924,0.67689]],-0.2764],[[[0.19842,0.79222],[0.76168,0.95383],[0.87438,0.78326],[0.39819,0.67674]],-0.2679],[[[0.19788,0.78659],[0.76309,0.94579],[0.87386,0.78221],[0.39695,0.67658]],-0.2579],[[[0.19729,0.77997],[0.76475,0.93638],[0.87326,0.78099],[0.39551,0.67639]],-0.246],[[[0.19665,0.77228],[0.76667,0.92547],[0.87256,0.77958],[0.39384,0.67617]],-0.2323],[[[0.19598,0.76341],[0.76889,0.91293],[0.87175,0.77796],[0.39194,0.67591]],-0.2164],[[[0.19531,0.75328],[0.77142,0.89865],[0.87082,0.77613],[0.38979,0.67563]],-0.1983],[[[0.19465,0.74178],[0.77429,0.88249],[0.86976,0.77408],[0.38738,0.67531]],-0.1777],[[[0.19404,0.7288],[0.77752,0.86434],[0.86855,0.77178],[0.3847,0.67496]],-0.1544],[[[0.19351,0.71422],[0.78112,0.84407],[0.86719,0.76924],[0.38172,0.67458]],-0.1282],[[[0.19311,0.69796],[0.7851,0.82157],[0.86566,0.76643],[0.37844,0.67416]],-0.099],[[[0.19287,0.67989],[0.78947,0.79674],[0.86393,0.76334],[0.37484,0.67371]],-0.0665],[[[0.19284,0.65992],[0.79421,0.7695],[0.862,0.75997],[0.37092,0.67322]],-0.0306],[[[0.19308,0.63796],[0.7993,0.73978],[0.85984,0.75631],[0.36665,0.67271]],0.009],[[[0.19364,0.61395],[0.80469,0.70757],[0.85743,0.75236],[0.36203,0.67217]],0.0522],[[[0.19457,0.58784],[0.81033,0.67289],[0.85474,0.74809],[0.35704,0.67161]],0.0992],[[[0.19591,0.55962],[0.81611,0.63582],[0.85175,0.74352],[0.35168,0.67104]],0.1501],[[[0.19768,0.52932],[0.8219,0.59651],[0.84842,0.73865],[0.34592,0.67046]],0.2047],[[[0.19991,0.49705],[0.82754,0.55519],[0.84471,0.73348],[0.33977,0.66989]],0.2629],[[[0.20257,0.46297],[0.83282,0.51217],[0.8406,0.72801],[0.3332,0.66935]],0.3244],[[[0.20563,0.42734],[0.83749,0.4679],[0.83603,0.72227],[0.32621,0.66885]],0.3887],[[[0.20904,0.39038],[0.84099,0.42305],[0.8313,0.71653],[0.31923,0.66826]],0.4551],[[[0.21276,0.35252],[0.84307,0.37829],[0.82661,0.71095],[0.31253,0.66749]],0.5226],[[[0.21673,0.31445],[0.84369,0.3343],[0.82197,0.70554],[0.30607,0.66656]],0.5904],[[[0.22089,0.27694],[0.84285,0.29182],[0.81737,0.70032],[0.29983,0.6655]],0.6574],[[[0.2251,0.24135],[0.84056,0.25222],[0.81283,0.69534],[0.29382,0.66437]],0.7216],[[[0.22883,0.21102],[0.83718,0.21887],[0.80846,0.69085],[0.28817,0.66342]],0.7774],[[[0.23199,0.18595],[0.83299,0.1916],[0.80429,0.68686],[0.2829,0.66268]],0.8245],[[[0.23459,0.16557],[0.8282,0.16963],[0.80034,0.68334],[0.278,0.66212]],0.8639],[[[0.23667,0.14931],[0.82303,0.15223],[0.7966,0.68023],[0.27344,0.66172]],0.8963],[[[0.23829,0.1366],[0.81763,0.13872],[0.79309,0.67752],[0.26923,0.66146]],0.9227],[[[0.23952,0.12692],[0.81216,0.12848],[0.78981,0.67515],[0.26533,0.66133]],0.9439],[[[0.24041,0.11979],[0.80674,0.12096],[0.78676,0.67311],[0.26175,0.66129]],0.9605],[[[0.24104,0.11478],[0.80146,0.11567],[0.78395,0.67136],[0.25847,0.66134]],0.9734],[[[0.24146,0.11151],[0.79639,0.1122],[0.78138,0.66986],[0.25548,0.66144]],0.983],[[[0.24172,0.10965],[0.79158,0.11019],[0.77903,0.66858],[0.25277,0.66159]],0.9899],[[[0.24188,0.10889],[0.78709,0.10933],[0.77691,0.66751],[0.25032,0.66177]],0.9947],[[[0.24196,0.109],[0.78293,0.10935],[0.775,0.66662],[0.24812,0.66197]],0.9978],[[[0.24201,0.10977],[0.77912,0.11005],[0.7733,0.66589],[0.24616,0.66218]],0.9994],[[[0.24204,0.11101],[0.77566,0.11123],[0.7718,0.66528],[0.24443,0.66238]],1],[[[0.24207,0.11257],[0.77255,0.11275],[0.77049,0.6648],[0.24291,0.66258]],0.9997],[[[0.24213,0.11434],[0.76979,0.11448],[0.76935,0.66442],[0.24158,0.66276]],0.9988],[[[0.2422,0.11622],[0.76736,0.11632],[0.76838,0.66412],[0.24044,0.66292]],0.9976],[[[0.24231,0.11811],[0.76525,0.11819],[0.76756,0.6639],[0.23948,0.66307]],0.996],[[[0.24245,0.11997],[0.76343,0.12002],[0.76688,0.66374],[0.23866,0.66319]],0.9944],[[[0.24262,0.12175],[0.76189,0.12178],[0.76632,0.66363],[0.23798,0.66329]],0.9926],[[[0.24281,0.1234],[0.76059,0.12342],[0.76588,0.66356],[0.23743,0.66337]],0.9909],[[[0.24302,0.12491],[0.75952,0.12491],[0.76552,0.66352],[0.23699,0.66343]],0.9893],[[[0.24324,0.12625],[0.75864,0.12626],[0.76525,0.66351],[0.23664,0.66347]],0.9879],[[[0.24345,0.12743],[0.75793,0.12743],[0.76504,0.66351],[0.23637,0.6635]],0.9866],[[[0.24365,0.12844],[0.75737,0.12844],[0.76489,0.66352],[0.23616,0.66352]],0.9854],[[[0.24382,0.12928],[0.75692,0.12928],[0.76477,0.66353],[0.23599,0.66353]],0.9844],[[[0.24396,0.12997],[0.75656,0.12997],[0.76467,0.66355],[0.23586,0.66355]],0.9836],[[[0.24407,0.13051],[0.75628,0.13051],[0.7646,0.66356],[0.23576,0.66356]],0.983],[[[0.24415,0.13093],[0.75607,0.13093],[0.76454,0.66356],[0.23568,0.66356]],0.9825],[[[0.24421,0.13122],[0.75592,0.13122],[0.7645,0.66357],[0.23563,0.66357]],0.9821],[[[0.24425,0.13142],[0.75582,0.13142],[0.76447,0.66358],[0.23559,0.66358]],0.9819],[[[0.24427,0.13155],[0.75576,0.13155],[0.76446,0.66358],[0.23557,0.66358]],0.9818],[[[0.24428,0.13161],[0.75573,0.13161],[0.76445,0.66358],[0.23556,0.66358]],0.9817],[[[0.24429,0.13163],[0.75571,0.13163],[0.76445,0.66358],[0.23555,0.66358]],0.9816],[[[0.24429,0.13164],[0.75571,0.13164],[0.76445,0.66358],[0.23555,0.66358]],0.9816]],
  monitor: [[[[0.72317,0.15231],[0.36653,0.15129],[0.37105,0.70694],[0.71743,0.57429]],-0.5998],[[[0.72316,0.15231],[0.36654,0.15129],[0.37106,0.70694],[0.71742,0.57429]],-0.5998],[[[0.72312,0.15231],[0.36657,0.15128],[0.37109,0.70695],[0.71738,0.57429]],-0.5996],[[[0.723,0.15231],[0.36666,0.15126],[0.37118,0.70699],[0.71727,0.57428]],-0.5992],[[[0.72278,0.15231],[0.36684,0.15123],[0.37134,0.70706],[0.71705,0.57426]],-0.5985],[[[0.7224,0.15232],[0.36713,0.15116],[0.37163,0.70717],[0.71669,0.57423]],-0.5973],[[[0.72184,0.15232],[0.36756,0.15107],[0.37204,0.70734],[0.71615,0.57419]],-0.5955],[[[0.72106,0.15233],[0.36817,0.15094],[0.37263,0.70758],[0.7154,0.57414]],-0.593],[[[0.72002,0.15234],[0.36899,0.15077],[0.37342,0.70789],[0.71439,0.57407]],-0.5897],[[[0.71868,0.15235],[0.37005,0.15054],[0.37444,0.70829],[0.7131,0.57398]],-0.5854],[[[0.71701,0.15237],[0.37139,0.15026],[0.37573,0.70878],[0.71148,0.57387]],-0.58],[[[0.71495,0.15239],[0.37304,0.14991],[0.37732,0.70938],[0.7095,0.57374]],-0.5734],[[[0.71248,0.15242],[0.37505,0.14949],[0.37925,0.71009],[0.70711,0.57359]],-0.5655],[[[0.70955,0.15246],[0.37747,0.14898],[0.38158,0.71091],[0.70428,0.57342]],-0.556],[[[0.70611,0.15251],[0.38034,0.14839],[0.38434,0.71185],[0.70096,0.57324]],-0.5448],[[[0.70213,0.15257],[0.38372,0.14769],[0.3876,0.71292],[0.69711,0.57305]],-0.5318],[[[0.69755,0.15264],[0.38769,0.14687],[0.39142,0.7141],[0.69268,0.57286]],-0.5167],[[[0.69232,0.15274],[0.3923,0.14593],[0.39587,0.71541],[0.68762,0.57267]],-0.4995],[[[0.6864,0.15285],[0.39763,0.14486],[0.40101,0.71683],[0.68189,0.5725]],-0.4799],[[[0.67973,0.15299],[0.40378,0.14363],[0.40694,0.71834],[0.67543,0.57235]],-0.4576],[[[0.67227,0.15316],[0.41083,0.14223],[0.41374,0.71994],[0.66819,0.57224]],-0.4325],[[[0.66395,0.15336],[0.41889,0.14065],[0.42152,0.72161],[0.66012,0.57219]],-0.4044],[[[0.65471,0.1536],[0.42807,0.13888],[0.43038,0.72331],[0.65115,0.57222]],-0.373],[[[0.64451,0.15387],[0.43847,0.13689],[0.44043,0.72502],[0.64124,0.57235]],-0.3381],[[[0.63329,0.15418],[0.45022,0.13469],[0.45179,0.72669],[0.63032,0.57261]],-0.2995],[[[0.62099,0.15453],[0.46343,0.13225],[0.46457,0.72827],[0.61834,0.57302]],-0.2569],[[[0.60755,0.15492],[0.47821,0.12957],[0.47888,0.72971],[0.60524,0.57362]],-0.2102],[[[0.59292,0.15535],[0.49466,0.12666],[0.49482,0.73093],[0.59097,0.57444]],-0.1591],[[[0.57706,0.1558],[0.51285,0.1235],[0.51247,0.73187],[0.57548,0.57552]],-0.1036],[[[0.55992,0.15626],[0.53283,0.12014],[0.53188,0.73244],[0.55873,0.5769]],-0.0436],[[[0.54147,0.15672],[0.5546,0.11658],[0.55306,0.73256],[0.54067,0.57861]],0.0209],[[[0.52169,0.15715],[0.5781,0.11288],[0.57596,0.73213],[0.52128,0.58072]],0.0897],[[[0.50056,0.15751],[0.60319,0.10911],[0.60046,0.73106],[0.50055,0.58324]],0.1628],[[[0.47809,0.15776],[0.62965,0.10534],[0.62635,0.72928],[0.47848,0.58624]],0.2396],[[[0.45432,0.15783],[0.65712,0.10169],[0.6533,0.72671],[0.45509,0.58975]],0.3197],[[[0.42929,0.15766],[0.68516,0.09829],[0.68089,0.72332],[0.43043,0.59381]],0.4022],[[[0.40347,0.15716],[0.71279,0.09532],[0.70817,0.71914],[0.40496,0.59839]],0.485],[[[0.37913,0.15632],[0.73731,0.09311],[0.73247,0.71464],[0.38091,0.60307]],0.5604],[[[0.35662,0.15517],[0.75839,0.09162],[0.75345,0.71007],[0.35863,0.60772]],0.6276],[[[0.33591,0.15373],[0.77622,0.09077],[0.77127,0.70556],[0.33812,0.61227]],0.6869],[[[0.31696,0.15203],[0.79106,0.09047],[0.78616,0.70121],[0.3193,0.6167]],0.7387],[[[0.29969,0.1501],[0.80319,0.09062],[0.79842,0.6971],[0.30214,0.62096]],0.7836],[[[0.28402,0.148],[0.81294,0.09115],[0.80832,0.69326],[0.28655,0.62502]],0.8222],[[[0.26988,0.14575],[0.82061,0.09196],[0.81617,0.68973],[0.27246,0.62887]],0.8551],[[[0.25718,0.14341],[0.82649,0.09299],[0.82226,0.6865],[0.25978,0.63249]],0.883],[[[0.24581,0.14099],[0.83087,0.09417],[0.82684,0.68359],[0.24841,0.63588]],0.9063],[[[0.23568,0.13856],[0.834,0.09546],[0.83017,0.68097],[0.23827,0.63903]],0.9257],[[[0.22669,0.13612],[0.8361,0.0968],[0.83247,0.67863],[0.22926,0.64194]],0.9417],[[[0.21875,0.13373],[0.83737,0.09815],[0.83393,0.67655],[0.22128,0.64463]],0.9547],[[[0.21176,0.1314],[0.83799,0.0995],[0.83472,0.67471],[0.21425,0.64709]],0.9653],[[[0.20563,0.12915],[0.8381,0.10081],[0.835,0.6731],[0.20808,0.64932]],0.9737],[[[0.20028,0.12702],[0.83782,0.10206],[0.83488,0.67168],[0.20268,0.65135]],0.9803],[[[0.19563,0.125],[0.83728,0.10325],[0.83448,0.67044],[0.19798,0.65318]],0.9855],[[[0.1916,0.12313],[0.83655,0.10435],[0.83387,0.66937],[0.1939,0.65482]],0.9894],[[[0.18812,0.12139],[0.8357,0.10537],[0.83314,0.66843],[0.19038,0.65629]],0.9925],[[[0.18514,0.11981],[0.8348,0.1063],[0.83234,0.66763],[0.18736,0.65758]],0.9947],[[[0.18259,0.11838],[0.83389,0.10714],[0.83152,0.66694],[0.18477,0.65872]],0.9963],[[[0.18043,0.1171],[0.833,0.10788],[0.83071,0.66635],[0.18257,0.65971]],0.9975],[[[0.17861,0.11597],[0.83217,0.10854],[0.82994,0.66585],[0.18071,0.66056]],0.9983],[[[0.17708,0.11499],[0.83141,0.10911],[0.82924,0.66543],[0.17916,0.66129]],0.9989],[[[0.17582,0.11415],[0.83073,0.10959],[0.82861,0.66509],[0.17787,0.66191]],0.9993],[[[0.17479,0.11344],[0.83014,0.11],[0.82806,0.6648],[0.17681,0.66242]],0.9995],[[[0.17396,0.11285],[0.82964,0.11034],[0.82759,0.66457],[0.17596,0.66284]],0.9996],[[[0.1733,0.11238],[0.82922,0.11061],[0.82721,0.66439],[0.17529,0.66318]],0.9997],[[[0.17279,0.11201],[0.8289,0.11083],[0.8269,0.66425],[0.17477,0.66344]],0.9997],[[[0.17242,0.11173],[0.82865,0.11099],[0.82667,0.66414],[0.17439,0.66363]],0.9998],[[[0.17215,0.11153],[0.82847,0.1111],[0.8265,0.66407],[0.17411,0.66377]],0.9998],[[[0.17197,0.1114],[0.82835,0.11118],[0.82638,0.66402],[0.17393,0.66387]],0.9998],[[[0.17186,0.11132],[0.82827,0.11122],[0.82631,0.66399],[0.17382,0.66392]],0.9998],[[[0.1718,0.11128],[0.82823,0.11125],[0.82628,0.66397],[0.17376,0.66395]],0.9998],[[[0.17178,0.11126],[0.82822,0.11126],[0.82627,0.66397],[0.17374,0.66396]],0.9998],[[[0.17178,0.11126],[0.82822,0.11126],[0.82626,0.66397],[0.17374,0.66397]],0.9998]]
};
const DEVICES = {
  phone:   { dir: 'assets/phone/',   sw: 360,  sh: 782, rot: [0.03, 0.34], faceMin: 0.35 },
  laptop:  { dir: 'assets/laptop/',  sw: 1280, sh: 833, rot: [0, 0.3],     faceMin: 0.55 },
  monitor: { dir: 'assets/monitor/', sw: 1280, sh: 720, rot: [0.02, 0.36], faceMin: 0.45 }
};
const FRAMES = 72;

// transformación proyectiva de un rectángulo w×h a 4 puntos
function quadToMatrix(w, h, q) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]], A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
    for (let r = c + 1; r < 8; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; B[r] -= f * B[c]; }
  }
  const x = new Array(8);
  for (let r = 7; r >= 0; r--) { let s = B[r]; for (let k = r + 1; k < 8; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
  const [a, b, c, d, e, f, g, hh] = x;
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

// progreso 0–1 de una sección fija. Se mide contra el alto del sticky (100svh), que no
// cambia cuando el navegador del celular esconde su barra (innerHeight sí cambia).
const secProgress = sec => {
  const st = sec._st || (sec._st = sec.firstElementChild);
  return clamp((scrollY - sec.offsetTop) / Math.max(1, sec.offsetHeight - (st ? st.offsetHeight : innerHeight)));
};

// Hooks propios de cada sección (lo que pasa además del giro)
const DEVICE_HOOKS = {
  top(p) {                                   // hero: la frase se va cuando el iPhone gira
    const hero = $('#heroCopy'), cue = $('.stage-cue');
    const h = clamp((p - 0.04) / 0.12);
    hero.style.opacity = 1 - h;
    hero.style.transform = `translateY(${-h * 60}px)`;
    hero.style.pointerEvents = h > 0.5 ? 'none' : '';
    if (cue) cue.style.opacity = 1 - clamp(p / 0.04);
  },
  proceso(p, sec) {                          // MacBook: el playhead recorre los 4 pasos
    const run = clamp((p - 0.34) / 0.6);
    if (!sec._lw) sec._lw = $('.ls-lane', sec).offsetWidth;
    $('#lsPlayhead').style.transform = `translateX(${run * sec._lw}px)`;
    $('#lsTc').textContent = tc(run * 96);
    const k = Math.min(3, Math.floor(run * 4 * 0.9999));
    // chat de ejemplo: los mensajes llegan con cada paso (y se van si volvés para atrás)
    const kc = run < 0.02 ? -1 : k;
    if (sec._kc !== kc) {
      sec._kc = kc;
      $('#studioChat')?.classList.toggle('on', kc >= 0);
      let n = 0;
      $$('.msg', sec).forEach(m => {
        const st = +m.dataset.step, on = st <= kc;
        if (on && !m.classList.contains('on')) m.style.setProperty('--dl', st === kc ? (n++ * 0.7) + 's' : '0s');
        m.classList.toggle('on', on);
      });
    }
    if (sec._k === k) return;
    sec._k = k;
    $$('.ls-step', sec).forEach((s, i) => s.classList.toggle('is-on', i === k));
    $$('.sc-cap', sec).forEach((s, i) => s.classList.toggle('is-on', i === k));
    $$('.ls-clip', sec).forEach((c, i) => { c.classList.toggle('is-on', i === k); c.classList.toggle('is-done', i < k); });
  }
};

const FRAME_CACHE = {};                      // el panel de Enfoque usa el iPhone como B-roll
function initDevices() {
  $$('.device-sec').forEach(sec => {
    const cfg = DEVICES[sec.dataset.device], Q = SCREENS[sec.dataset.device];
    if (!cfg) return;
    const box = $('.device-box', sec), canvas = $('.device-canvas', sec), ctx = canvas.getContext('2d');
    const scr = $('.device-screen', sec), video = $('video', scr);
    const stepsBox = $('.steps-case', sec), steps = stepsBox ? $$('.sc', stepsBox) : [];
    const from = stepsBox ? +stepsBox.dataset.stepsFrom || 0.4 : 1;
    const dotsBox = stepsBox && $('.sc-dots', stepsBox);
    if (dotsBox) steps.forEach(() => dotsBox.appendChild(document.createElement('li')));
    const dots = dotsBox ? $$('li', dotsBox) : [];

    // cuadros: primero el 1 y el último (los que se ven quietos), después el resto
    const imgs = FRAME_CACHE[sec.dataset.device] = new Array(FRAMES);
    const load = i => { const im = new Image(); im.decoding = 'async'; im.src = `${cfg.dir}${String(i + 1).padStart(4, '0')}.webp`; im.onload = () => { if (Math.abs(i - cur) < 3 || cur < 0) { cur = -1; update(); } }; imgs[i] = im; };
    load(0); load(FRAMES - 1);
    const rest = () => { for (let i = 1; i < FRAMES - 1; i++) load(i); };
    if (sec.id === 'top') rest(); else new IntersectionObserver(([e], o) => { if (e.isIntersecting) { rest(); o.disconnect(); } }, { rootMargin: '150% 0px' }).observe(sec);

    let cur = -1, bw = 0, bh = 0, inView = sec.id === 'top', idle = sec.id === 'top' && !REDUCED, stepK = -2, placed = -1;
    function size() {
      bw = box.offsetWidth; bh = box.offsetHeight;          // offset*: no los afecta ninguna transformación
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(bw * dpr); canvas.height = Math.round(bh * dpr); cur = -1; placed = -1;
    }
    function draw(i) {
      let im = imgs[i];
      if (!im || !im.complete || !im.naturalWidth) {
        for (let d = 1; d < FRAMES; d++) {
          const a = imgs[i - d], b = imgs[i + d];
          if (a && a.complete && a.naturalWidth) { im = a; break; }
          if (b && b.complete && b.naturalWidth) { im = b; break; }
        }
      }
      if (!im || !im.complete || !im.naturalWidth) return false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      return true;
    }
    function place(f) {
      const [q, face] = Q[f];
      const o = clamp((face - cfg.faceMin) / 0.4);
      if (f !== placed) {                                   // la homografía solo cambia con el cuadro o el tamaño
        placed = f;
        scr.style.opacity = o;
        scr.style.transform = quadToMatrix(cfg.sw, cfg.sh, q.map(([x, y]) => [x * bw, y * bh]));
        scr.classList.toggle('is-live', o > 0.6);
      }
      if (!video) return;
      if (o > 0 && inView && !REDUCED) { if (video.paused) video.play().catch(() => {}); }
      else if (!video.paused && video.muted) video.pause();
    }
    function update() {
      const p = secProgress(sec);
      const r = REDUCED ? 1 : clamp((p - cfg.rot[0]) / (cfg.rot[1] - cfg.rot[0]));
      const f = Math.round(r * (FRAMES - 1));
      if (!idle && f !== cur && draw(f)) cur = f;
      if (!idle) place(f);
      DEVICE_HOOKS[sec.id]?.(p, sec);
      if (steps.length) {
        const k = p < from ? -1 : Math.min(steps.length - 1, Math.floor((p - from) / (1 - from) * steps.length));
        if (k !== stepK) {
          stepK = k;
          steps.forEach((el, i) => { el.classList.toggle('is-on', i === k); el.classList.toggle('is-past', k > i); });
          stepsBox.classList.toggle('is-on', k >= 0);
          dots.forEach((d, i) => { d.classList.toggle('on', i <= k); d.classList.toggle('now', i === k); });
        }
      }
    }
    // sonido: tocar la pantalla lo activa desde el principio
    if (video) {
      const snd = $('.phone-snd', scr);
      const setSound = on => {
        if (on) { muteAllExcept(video); video.currentTime = 0; video.play().catch(() => {}); }
        video.muted = !on; scr.classList.toggle('has-sound', on);
        snd?.setAttribute('aria-label', on ? 'Silenciar' : 'Escuchar con sonido desde el inicio');
      };
      scr.addEventListener('click', () => setSound(video.muted));
      video.addEventListener('dockclose', () => scr.classList.remove('has-sound'));
    }
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (!inView && video && video.muted) video.pause(); else update(); }, { rootMargin: '10% 0px' }).observe(sec);

    // reposo del hero: el iPhone se balancea hasta que scrolleás
    if (idle) (function sway(t) {
      if (scrollY > sec.offsetTop + 8) { idle = false; cur = -1; update(); return; }
      const f = Math.round((Math.sin(t / 900) * 0.5 + 0.5) * 6);
      if (f !== cur && draw(f)) cur = f;
      requestAnimationFrame(sway);
    })(0);

    size();
    onResize(() => { size(); sec._lw = 0; update(); });
    onScroll.push(() => { if (inView) update(); });
    update();
  });
}

// ─── BOBINA: progreso por los 4 trabajos (efecto gradiente de meta) ───
function initReel() {
  const reel = $('#reel');
  if (!reel) return;
  const segs = $$('a', reel);
  const secs = [$('.stage'), $('#caso-inazio'), $('#caso-cosami'), $('#caso-aitor'), $('#locales')];
  const focus = $('.focus');
  function prog(el, i) {
    const r = el.getBoundingClientRect();
    if (i === 0 || el.classList.contains('device-sec') || el.id === 'locales') return clamp(secProgress(el) / 0.98);
    return clamp((innerHeight * 0.6 - r.top) / r.height);
  }
  onScroll.push(() => {
    const vals = secs.map((s, i) => s ? prog(s, i) : 0);
    let now = 0;
    vals.forEach((v, i) => { segs[i].style.setProperty('--p', v); if (v > 0) now = i; });
    segs.forEach((a, i) => a.classList.toggle('is-now', i === now));
    const start = secs[0] && vals[0] > 0.3;
    const end = focus && focus.getBoundingClientRect().top < innerHeight * 0.6;
    reel.classList.toggle('is-on', !!(start && !end));
  });
}

// ─── CASO 002: el video aparece con un corte que baja ───
function initCut() {
  const el = $('#cutReveal');
  if (!el) return;
  let inView = true;
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { rootMargin: '20% 0px' }).observe(el);
  onScroll.push(() => {
    if (!inView) return;
    const r = el.getBoundingClientRect();
    const t = REDUCED ? 1 : ease(clamp((innerHeight * 0.92 - r.top) / (innerHeight * 0.62)));
    el.style.setProperty('--hide', ((1 - t) * 100) + '%');
    el.style.setProperty('--edge', (t * 100) + '%');
    el.style.setProperty('--zoom', 1.12 - 0.12 * t);
    el.style.setProperty('--razor', t >= 0.999 ? 0 : 1);
  });
}

// ─── CASO 003: el scroll scrubbea el video cuadro por cuadro ───
// Usa la secuencia assets/cosami/0001.webp… (suave, como Apple). Si no está, scrubbea el .mp4.
// Los cuadros se piden recién cuando la sección se acerca: primero uno de cada 8, después el resto.
function initScrub() {
  const box = $('#scrub'), sec = $('.case-scrub');
  if (!box || !sec) return;
  const canvas = $('.scrub-canvas', box), ctx = canvas.getContext('2d');
  const video = $('.scrub-video', box), tcEl = $('#scrubTc'), btn = $('#scrubPlay'), hint = $('#scrubHint'), strip = $('#scrubStrip');
  const dir = box.dataset.frames, count = +box.dataset.frameCount || 0, ext = box.dataset.ext || 'jpg';
  const end = Math.min(count, +box.dataset.frameEnd || count);   // el scrub cierra en el logo, antes del fundido a negro
  const name = i => `${dir}${String(i + 1).padStart(4, '0')}.${ext}`;
  let frames = null, playing = false, last = -1, want = 0, inView = false;

  const ready = im => im && im.complete && im.naturalWidth;
  function loadFrames() {
    const first = new Image();
    first.onload = () => {
      frames = new Array(count); frames[0] = first;
      canvas.width = first.naturalWidth; canvas.height = first.naturalHeight;
      box.classList.add('has-frames');
      const order = [];
      for (let i = 8; i < count; i += 8) order.push(i);
      for (let i = 1; i < count; i++) if (i % 8) order.push(i);
      order.forEach(i => {
        const im = new Image(); im.decoding = 'async';
        im.onload = () => { if (Math.abs(i - want) < 8) { last = -1; update(); } };
        im.src = name(i); frames[i] = im;
      });
      last = -1; update();
    };
    first.onerror = () => { video.preload = 'auto'; video.load(); };   // sin secuencia: scrub sobre el .mp4
    first.src = name(0);
  }
  if (count > 0) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); loadFrames(); } }, { rootMargin: '200% 0px' }).observe(sec);
  else { video.preload = 'auto'; video.load(); }

  function progress() {
    const r = sec.getBoundingClientRect();
    return clamp((innerHeight * 0.25 - r.top) / (r.height - innerHeight * 0.6));
  }
  function drawNearest(i) {
    let im = frames[i];
    for (let d = 1; !ready(im) && d < count; d++) im = ready(frames[i - d]) ? frames[i - d] : frames[i + d];
    if (ready(im)) ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
  }
  function update() {
    if (playing) return;
    const p = progress();
    strip?.style.setProperty('--p', p.toFixed(4));
    if (frames) {
      const i = want = Math.min(end - 1, Math.round(p * (end - 1)));
      if (i !== last) { drawNearest(i); last = i; }
      tcEl.textContent = tc(i / 8);                         // la secuencia está a 8 cuadros por segundo
    } else if (video.duration) {
      const t = p * (video.duration - 0.05);
      if (Math.abs(video.currentTime - t) > 0.04) video.currentTime = t;
      tcEl.textContent = tc(t);
    }
  }
  function setPlaying(on) {
    playing = on;
    box.classList.toggle('is-playing', on);
    btn.textContent = on ? 'Volver a scrubbear' : 'Ver con sonido';
    hint.textContent = on ? 'Reproduciendo' : 'Scrolleá para scrubbear el corte';
    if (on) { muteAllExcept(video); video.currentTime = 0; video.muted = false; video.loop = true; video.play().catch(() => {}); }
    else { video.pause(); video.muted = true; update(); }
  }
  btn.addEventListener('click', () => setPlaying(!playing));
  video.addEventListener('timeupdate', () => {
    if (!playing) return;
    tcEl.textContent = tc(video.currentTime);
    if (video.duration) strip?.style.setProperty('--p', (video.currentTime / video.duration).toFixed(4));
  });
  video.addEventListener('loadedmetadata', update);
  video.addEventListener('dockclose', () => { if (playing) setPlaying(false); });

  // la tira funciona como la regla del monitor de origen: tocás y vas a ese cuadro
  strip?.addEventListener('click', e => {
    const k = clamp((e.clientX - strip.getBoundingClientRect().left) / strip.offsetWidth);
    if (playing) { if (video.duration) video.currentTime = k * video.duration; return; }
    const r = sec.getBoundingClientRect();
    scrollTo({ top: scrollY + r.top - (innerHeight * 0.25 - k * (r.height - innerHeight * 0.6)), behavior: REDUCED ? 'auto' : 'smooth' });
  });

  // cada bloque de texto se enciende cuando pasa por el centro
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-on', e.isIntersecting)), { rootMargin: '-42% 0px -42% 0px' });
  $$('.cs-block').forEach(b => io.observe(b));
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) update(); }, { rootMargin: '10% 0px' }).observe(sec);
  onScroll.push(() => { if (inView) update(); });
}

// ─── PLAYER "now playing" ───
function initPlayers() {
  $$('[data-player]').forEach(pl => {
    const v = $('video', pl), play = $('.p-play', pl), snd = $('.p-snd', pl);
    const scrub = $('.p-scrub', pl), fill = $('.p-fill', pl), knob = $('.p-knob', pl), time = $('.p-time', pl);

    v.addEventListener('play', () => { pl.classList.add('is-playing'); play.setAttribute('aria-label', 'Pausar'); });
    v.addEventListener('pause', () => { pl.classList.remove('is-playing'); play.setAttribute('aria-label', 'Reproducir'); });
    v.addEventListener('timeupdate', () => {
      const p = v.duration ? v.currentTime / v.duration : 0;
      fill.style.width = knob.style.left = (p * 100) + '%';
      scrub.setAttribute('aria-valuenow', Math.round(p * 100));
      time.textContent = mmss(v.currentTime) + ' / ' + mmss(v.duration);
    });

    play.addEventListener('click', () => v.paused ? v.play().catch(() => {}) : v.pause());

    function setSound(on, fromStart) {
      if (on) { muteAllExcept(v); if (fromStart) v.currentTime = 0; v.play().catch(() => {}); }
      v.muted = !on;
      pl.classList.toggle('has-sound', on);
      snd.setAttribute('aria-pressed', String(on));
      snd.setAttribute('aria-label', on ? 'Silenciar' : 'Activar sonido');
    }
    snd.addEventListener('click', () => setSound(v.muted, false));
    v.addEventListener('click', () => setSound(v.muted, true));  // tocar el video: sonido desde el hook

    function seek(e) {
      const r = scrub.getBoundingClientRect();
      if (v.duration) v.currentTime = clamp((e.clientX - r.left) / r.width) * v.duration;
    }
    scrub.addEventListener('pointerdown', e => {
      if (v.preload === 'none' && !v.duration) v.load();
      scrub.classList.add('is-drag'); scrub.setPointerCapture(e.pointerId); seek(e);
    });
    scrub.addEventListener('pointermove', e => { if (scrub.classList.contains('is-drag')) seek(e); });
    const up = () => scrub.classList.remove('is-drag');
    scrub.addEventListener('pointerup', up); scrub.addEventListener('pointercancel', up);
    scrub.addEventListener('keydown', e => {
      const d = { ArrowLeft: -2, ArrowRight: 2 }[e.key];
      if (d && v.duration) { e.preventDefault(); v.currentTime = clamp(v.currentTime + d, 0, v.duration); }
    });
  });
}

// ─── ENFOQUE: el texto se ilumina a medida que lo leés ───
function initRead() {
  const el = $('#focusRead');
  if (!el) return;
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="fw">${w}</span>`).join(' ');
  const words = $$('.fw', el);
  if (REDUCED) { words.forEach(w => w.classList.add('is-lit')); return; }
  let inView = false, lit = -1;
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { rootMargin: '20% 0px' }).observe(el);
  onScroll.push(() => {
    if (!inView) return;
    const r = el.getBoundingClientRect();
    const p = clamp((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3));
    const n = Math.round(p * words.length);
    if (n === lit) return;
    lit = n;
    words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
  });
}

// ─── SUBTÍTULOS: un editor de subtítulos de verdad, en ES / EN / HE ───
// Una frase de 8 s partida en 4 subtítulos. El cabezal recorre la onda, el subtítulo
// activo se enciende en la pista, en el archivo SRT y en pantalla, palabra por palabra.
function initSubs() {
  const seg = $('#seg'), line = $('#subsLine');
  if (!seg || !line) return;
  const DUR = 8;
  const TIMES = [[0.2, 1.8], [1.8, 3.7], [4.1, 5.9], [5.9, 7.7]];
  const TXT = {
    es: { dir: 'ltr', cues: ['Los primeros 2 segundos', 'deciden si alguien se queda.', 'Por eso lo importante', 'va primero, no al final.'] },
    en: { dir: 'ltr', cues: ['The first 2 seconds', 'decide whether someone stays.', "That's why the key message", 'comes first, not last.'] },
    he: { dir: 'rtl', cues: ['שתי השניות הראשונות', 'קובעות אם מישהו נשאר.', 'לכן המסר החשוב', 'בא ראשון, לא בסוף.'] }
  };
  const btns = $$('button', seg), ind = $('.seg-ind', seg);
  const srt = $('#srt'), cuesEl = $('#stCues'), ph = $('#stPh'), tl = $('.subs-tl'), tcEl = $('#subsTc'), langEl = $('#subsLang');
  const srtTime = t => { const ms = Math.round(t * 1000); return `00:00:${String(Math.floor(ms / 1000)).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  let lang = 'es', auto = true, idx = 0, active = -2, words = [];

  function moveInd(b) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 5}px)`; }
  function set(l) {
    lang = l; const d = TXT[l];
    btns.forEach(b => b.setAttribute('aria-checked', String(b.dataset.lang === l)));
    moveInd($(`[data-lang="${l}"]`, seg));
    line.lang = l; line.dir = d.dir; langEl.textContent = l.toUpperCase();
    srt.innerHTML = ''; cuesEl.innerHTML = '';
    d.cues.forEach((c, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${i + 1}</b><em>${srtTime(TIMES[i][0])} --> ${srtTime(TIMES[i][1])}</em>`;
      const sp = document.createElement('span'); sp.dir = d.dir; sp.textContent = c; li.append(sp); srt.append(li);
      const k = document.createElement('span'); k.dir = d.dir; k.textContent = c;
      k.style.left = (TIMES[i][0] / DUR * 100) + '%'; k.style.width = ((TIMES[i][1] - TIMES[i][0]) / DUR * 100 - 0.6) + '%';
      cuesEl.append(k);
    });
    active = -2; render(REDUCED ? 1 : t);
  }
  function render(time) {
    const i = TIMES.findIndex(([a, b]) => time >= a && time < b);
    if (i !== active) {
      active = i;
      $$('li', srt).forEach((li, k) => li.classList.toggle('on', k === i));
      $$('span', cuesEl).forEach((c, k) => c.classList.toggle('on', k === i));
      line.classList.toggle('off', i < 0);
      if (i >= 0) {
        line.textContent = '';
        words = TXT[lang].cues[i].split(' ').map(w => { const b = document.createElement('b'); b.textContent = w; return b; });
        words.forEach((b, k) => { if (k) line.append(' '); line.append(b); });
      }
    }
    if (i >= 0) {
      const [a, b] = TIMES[i], n = Math.floor((time - a) / (b - a) * words.length);
      words.forEach((w, k) => { w.classList.toggle('now', k === n); w.classList.toggle('said', k < n); });
    }
    ph.style.setProperty('--x', (time / DUR * (tl.offsetWidth - 24)) + 'px');
    tcEl.textContent = tc(time);
  }
  btns.forEach((b, i) => {
    b.addEventListener('click', () => { auto = false; idx = i; set(b.dataset.lang); });
    if (FINE) b.addEventListener('pointerenter', () => moveInd(b));
  });
  seg.addEventListener('pointerleave', () => moveInd($('[aria-checked="true"]', seg)));
  $('#stWave').style.setProperty('--wave', waveSVG(5, 110));
  let t = 0;
  set('es');
  onResize(() => moveInd($('[aria-checked="true"]', seg)));
  document.fonts?.ready.then(() => moveInd($('[aria-checked="true"]', seg)));
  if (REDUCED) return;

  // el reloj corre solo con la demo a la vista; al terminar cada vuelta cambia de idioma (si nadie tocó)
  let inView = false, running = false, last = 0;
  function tick(now) {
    if (!inView) { running = false; return; }
    t += Math.min(50, now - last) / 1000; last = now;
    if (t >= DUR) { t = 0; if (auto) { idx = (idx + 1) % btns.length; set(btns[idx].dataset.lang); } }
    render(t);
    requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }).observe($('.subs') || seg);
}

// ─── SERVICIOS: un monitor de secuencia que cambia de formato con cada servicio ───
// Muestra trabajo real (los posters) en la relación de aspecto de cada servicio y
// avanza solo mientras nadie toque la lista.
function initServices() {
  const mon = $('#svcMon'), frame = $('#smFrame');
  if (!mon || !frame) return;
  const items = $$('.svc-item'), stage = $('.sm-stage', mon), imgs = $$('.sm-img', frame);
  const cap = $('#smCap'), res = $('#smRes'), ratio = $('#smRatio'), use = $('#smUse'), tcEl = $('#smTc');
  const F = [
    { r: 9 / 16, img: 'mda', res: '1080 × 1920', ratio: '9:16', use: 'Reels · TikTok · Shorts', cap: '' },
    { r: 16 / 9, img: 'testeo_intro', res: '1920 × 1080', ratio: '16:9', use: 'YouTube · intros · largos', cap: '' },
    { r: 4 / 5, img: 'fitness', res: '1080 × 1350', ratio: '4:5', use: 'Feed · ads', cap: '' },
    { r: 1, img: 'cosami-edit2', res: '1080 × 1080', ratio: '1:1', use: 'Marca · producto', cap: '' },
    { r: 16 / 9, img: 'testeo_intro', res: '1920 × 1080', ratio: '16:9 + SRT', use: 'Subtítulos · ES / EN / HE', cap: 'Lo importante va <b>primero</b>' }
  ];
  let cur = -1, flip = 0, auto = true, run = 0, inView = false, running = false, last = 0, clock = 0;
  const HOLD = 4500;
  function fit(i) {
    const W = stage.clientWidth * 0.84, H = stage.clientHeight * 0.84, r = F[i].r;
    let w = W, h = W / r;
    if (h > H) { h = H; w = H * r; }
    frame.style.width = Math.round(w) + 'px'; frame.style.height = Math.round(h) + 'px';
  }
  function show(i) {
    if (i === cur) return;
    cur = i; const f = F[i];
    fit(i);
    const next = imgs[flip = 1 - flip];
    next.src = `assets/posters/${f.img}.webp`;
    imgs.forEach(im => im.classList.toggle('is-on', im === next));
    cap.innerHTML = f.cap; res.textContent = f.res; ratio.textContent = f.ratio; use.textContent = f.use;
  }
  items.forEach((d, i) => {
    d.addEventListener('toggle', () => { if (d.open) show(i); });
    $('summary', d).addEventListener('click', () => { auto = false; items.forEach(x => x.style.removeProperty('--run')); });
  });
  const open = items.findIndex(d => d.open);
  show(open < 0 ? 0 : open);
  onResize(() => fit(cur));
  if (REDUCED) return;
  function tick(now) {
    if (!inView) { running = false; return; }
    const dt = Math.min(50, now - last); last = now;
    clock += dt / 1000; tcEl.textContent = tc(clock);
    if (auto && DESKTOP()) {
      run += dt;
      $('summary', items[cur]).style.setProperty('--run', Math.min(1, run / HOLD));
      if (run >= HOLD) { run = 0; items[cur].querySelector('summary').style.removeProperty('--run'); items[(cur + 1) % items.length].open = true; }
    }
    requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }, { threshold: 0.35 }).observe($('.svc-wrap'));
}

// ─── CONTADORES (solo números reales) ───
function initCounters() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (REDUCED) return;
    const el = e.target, to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const start = performance.now();
    (function f(now) {
      const t = clamp((now - start) / 1400), k = 1 - Math.pow(1 - t, 4);
      el.textContent = pre + Math.round(to * k) + suf;
      if (t < 1) requestAnimationFrame(f);
    })(start);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => io.observe(el));
}

// ─── RESEÑAS: carrusel arrastrable ───
function initCarousel() {
  const box = $('#carousel'), track = $('#carTrack');
  if (!box || !track) return;
  const cards = $$('.review', track), dots = $('#carDots');
  let i = 0, startX = 0, dx = 0, drag = false;
  cards.forEach((_, k) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', `Reseña ${k + 1}`);
    d.addEventListener('click', () => go(k));
    dots.appendChild(d);
  });
  const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
  function go(k, extra = 0) {
    i = clamp(k, 0, cards.length - 1);
    track.style.transition = extra ? 'none' : 'transform .6s cubic-bezier(.16,1,.3,1)';
    track.style.transform = `translateX(${-i * step() + extra}px)`;
    cards.forEach((c, n) => c.classList.toggle('is-on', n === i));
    $$('button', dots).forEach((d, n) => n === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
  }
  box.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; drag = true; startX = e.clientX; dx = 0; box.classList.add('is-drag'); box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', e => { if (!drag) return; dx = e.clientX - startX; go(i, dx * 0.9 || 0.001); });
  const end = () => { if (!drag) return; drag = false; box.classList.remove('is-drag'); go(Math.abs(dx) > 60 ? i + (dx < 0 ? 1 : -1) : i); };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
  $('#carPrev').addEventListener('click', () => go(i - 1));
  $('#carNext').addEventListener('click', () => go(i + 1));
  addEventListener('resize', () => go(i));
  go(0);
}

// ─── CIERRE: deslizá para escribirme ───
function initSlide() {
  const slide = $('#slide'), knob = $('#slideKnob');
  if (!slide || !knob) return;
  const text = $('.slide-text', slide), href = slide.dataset.href;
  let drag = false, start = 0, x = 0, moved = false;
  const max = () => slide.offsetWidth - knob.offsetWidth - 12;
  function set(v) { x = clamp(v, 0, max()); knob.style.transform = `translateX(${x}px)`; slide.style.setProperty('--fill', (x + knob.offsetWidth / 2 + 6) + 'px'); }
  function openWA() {
    text.textContent = 'Abriendo WhatsApp…';
    window.open(href, '_blank', 'noopener');
    setTimeout(() => { text.textContent = 'Deslizá para escribirme'; knob.classList.add('is-back'); set(0); }, 1600);
  }
  knob.addEventListener('pointerdown', e => { drag = true; moved = false; start = e.clientX - x; knob.classList.remove('is-back'); knob.setPointerCapture(e.pointerId); });
  knob.addEventListener('pointermove', e => { if (!drag) return; moved = true; set(e.clientX - start); });
  knob.addEventListener('pointerup', () => {
    if (!drag) return; drag = false;
    if (x > max() * 0.85) { set(max()); openWA(); }
    else { knob.classList.add('is-back'); set(0); }
  });
  knob.addEventListener('click', () => { if (!moved) openWA(); moved = false; });  // teclado y click simple también funcionan
}

// ─── CALCULADORA  ───
function initCalculator() {

  if (!document.getElementById('calcRange')) return;

  // ─── PRECIOS EDICIÓN ─────────────────────────────────────────────
  const BASE = {
    reel:  { min: 55,  max: 70,  fixedDur: false },
    ad:    { min: 90,  max: 120, fixedDur: true  },
    long:  { min: 200, max: 380, fixedDur: false },
    intro: { min: 60,  max: 80,  fixedDur: true  },
  };

  function durMult(mins) {
    if (mins <= 1)  return 1;
    if (mins <= 2)  return 1.2;
    if (mins <= 5)  return 1.5;
    if (mins <= 10) return 1.9;
    return 1.9 + (mins - 10) * 0.07;
  }

  const COMPLEX = { basic: 1, mid: 1.3, high: 1.6 };
  const URG     = { normal: 1, urgente: 1.3, express: 1.55 };

  // ─── PRECIOS SUBTITULADO ─────────────────────────────────────────
  // Base por minuto según par de idiomas:
  // mismo idioma (solo timing/formato): $4/min
  // es↔en: $8/min  |  es↔he o en↔he: $14/min (hebreo RTL, más complejo)
  // +$3/min si se quema al video
  function subsBasePerMin(src, dst) {
    if (src === dst) return 4;
    if ((src === 'he') || (dst === 'he')) return 14;
    return 8; // es↔en
  }

  // ─── PAQUETES MENSUALES ──────────────────────────────────────────
  const PACKS = {
    4:  { total: 200, perPiece: 50   },
    8:  { total: 380, perPiece: 47.5 },
    12: { total: 540, perPiece: 45   },
    20: { total: 840, perPiece: 42   },
  };

  const TIER_INFO = {
    reel:  { label: "Reel / Short",  desc: "Cortes, subtítulos, SFX y corrección de color. Editado para parar el scroll desde el primer segundo." },
    ad:    { label: "Ad comercial",  desc: "Hook, mensaje y CTA integrados. Funciona como pieza de performance, no solo como video bonito." },
    long:  { label: "Video largo",   desc: "Edición de retención para YouTube u otras plataformas. Mantiene al espectador sin sobrestimulación." },
    intro: { label: "Intro / Outro", desc: "Pieza de identidad para YouTube o redes. Define el tono del canal en los primeros segundos." },
    subs:  { label: "Subtitulado",   desc: "Transcripción, traducción y timing manual. Entrega en SRT/VTT o quemado al video." },
  };

  // ─── ESTADO ──────────────────────────────────────────────────────
  const state = {
    tipo: 'reel',
    urg: 'normal',
    complex: 'basic',
    qty: 1,
    monthly: false,
    monthlyQty: 4,
    // subtitulado
    subsLangSrc: 'es',
    subsLangDst: 'en',
    subsQty: 1,
    subsDeliv: 'file',
  };

  // ─── ELEMENTOS ───────────────────────────────────────────────────
  const rangeEl            = document.getElementById('calcRange');
  const infoEl             = document.getElementById('calcInfo');
  const ctaBtn             = document.getElementById('calcCtaBtn');
  const qtyNum             = document.getElementById('calcQtyNum');
  const qtyNum2            = document.getElementById('calcQtyNum2');
  const qtyUnit            = document.getElementById('calcQtyUnit');
  const customInp          = document.getElementById('calcCustomInput');
  const qtyInput           = document.getElementById('calcQtyInput');
  const presets            = document.getElementById('calcPresets');
  const monthlyPresets     = document.getElementById('calcMonthlyPresets');
  const urgGroup           = document.getElementById('calcUrgGroup');
  const complexGroup       = document.getElementById('calcComplexityGroup');
  const monthlyInfo        = document.getElementById('calcMonthlyInfo');
  const monthlyVal         = document.getElementById('calcMonthlyValue');
  const perPieceEl         = document.getElementById('calcPerPiece');
  const durGroup           = document.getElementById('calcDurGroup');
  const monthlyQtyGroup    = document.getElementById('calcMonthlyQtyGroup');
  const subsLangSrcGroup   = document.getElementById('calcSubsLangSrcGroup');
  const subsLangDstGroup   = document.getElementById('calcSubsLangDstGroup');
  const subsDurGroup       = document.getElementById('calcSubsDurGroup');
  const subsDelivGroup     = document.getElementById('calcSubsDelivGroup');
  const subsPresets        = document.getElementById('calcSubsPresets');
  const subsCustomInp      = document.getElementById('calcSubsCustomInput');
  const subsQtyInput       = document.getElementById('calcSubsQtyInput');
  const subsQtyNum         = document.getElementById('calcSubsQtyNum');

  // ─── ACCESIBILIDAD + TEXTOS ──────────────────────────────────────
  // cada fila de botones es un grupo con nombre; el botón activo se anuncia como presionado
  $$('.calc-group').forEach(g => {
    const l = $('.calc-label', g), opts = $('.calc-options, .calc-presets', g);
    if (l && opts) { opts.setAttribute('role', 'group'); opts.setAttribute('aria-label', ($('span', l) || l).textContent.trim()); }
  });
  const syncPressed = () => $$('.calc-opt, .calc-preset').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
  const fmtRange = (lo, hi) => lo === hi ? `$${lo}` : `$${lo} – $${hi}`;
  const optLabel = field => ($(`.calc-opt.active[data-field="${field}"]`)?.textContent || '').trim();

  // ─── VISIBILIDAD DE GRUPOS ───────────────────────────────────────
  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  function applyVisibility() {
    const t = state.tipo;
    const isMonthly = t === 'monthly';
    const isSubs    = t === 'subs';
    const isFixed   = !isSubs && !isMonthly && BASE[t] && BASE[t].fixedDur;

    // dur group (reel / long)
    isMonthly || isSubs || isFixed ? hide(durGroup) : show(durGroup);
    // monthly qty
    isMonthly ? show(monthlyQtyGroup) : hide(monthlyQtyGroup);
    // subs groups
    isSubs ? show(subsLangSrcGroup) : hide(subsLangSrcGroup);
    isSubs ? show(subsLangDstGroup) : hide(subsLangDstGroup);
    isSubs ? show(subsDurGroup)     : hide(subsDurGroup);
    isSubs ? show(subsDelivGroup)   : hide(subsDelivGroup);
    // urgencia y complejidad
    isMonthly ? hide(urgGroup)     : show(urgGroup);
    isMonthly || isSubs ? hide(complexGroup) : show(complexGroup);
    // info mensual y precio por pieza
    isMonthly ? show(monthlyInfo) : hide(monthlyInfo);
    isMonthly ? show(monthlyVal)  : hide(monthlyVal);
  }

  // ─── RENDER ──────────────────────────────────────────────────────
  function update() {
    applyVisibility();
    syncPressed();
    if (state.tipo === 'monthly') renderMonthly();
    else if (state.tipo === 'subs') renderSubs();
    else renderUnit();
  }

  function renderUnit() {
    const base = BASE[state.tipo];
    const dm   = base.fixedDur ? 1 : durMult(state.qty);
    const cm   = COMPLEX[state.complex];
    const um   = URG[state.urg];
    const lo   = Math.round(base.min * dm * cm * um / 5) * 5;
    const hi   = Math.round(base.max * dm * cm * um / 5) * 5;

    rangeEl.textContent = fmtRange(lo, hi);
    const tier = TIER_INFO[state.tipo];
    infoEl.innerHTML = `<strong>${tier.label}</strong><span>${tier.desc}</span>`;

    const durLine = base.fixedDur ? '' : `\n· Duración: ${state.qty} min`;
    ctaBtn.href = `https://wa.me/5492302219422?text=${encodeURIComponent(
      `Hola Danilo, quiero cotizar:\n· Tipo: ${tier.label}${durLine}\n· Urgencia: ${optLabel('urg')}\n· Complejidad: ${optLabel('complex')}\n· Estimado: ${fmtRange(lo, hi).replace(' – ', '–')} USD`
    )}`;
  }

  function renderSubs() {
    const base    = subsBasePerMin(state.subsLangSrc, state.subsLangDst);
    const burnAdd = state.subsDeliv === 'burned' ? 3 : 0;
    const urgM    = URG[state.urg];
    const mins    = state.subsQty;

    const lo = Math.round((base + burnAdd) * mins * urgM / 5) * 5;
    const hi = Math.round((base + burnAdd + 2) * mins * urgM / 5) * 5;

    rangeEl.textContent = fmtRange(lo, hi);

    const langLabel = { es: 'Español', en: 'Inglés', he: 'Hebreo' };
    const sameLang  = state.subsLangSrc === state.subsLangDst;
    const desc = sameLang
      ? `Subtítulos en ${langLabel[state.subsLangDst]} (mismo idioma). Timing, formato y entrega ${state.subsDeliv === 'burned' ? 'quemados al video' : 'en archivo SRT/VTT'}.`
      : `Traducción y subtítulos de ${langLabel[state.subsLangSrc]} a ${langLabel[state.subsLangDst]}. Entrega ${state.subsDeliv === 'burned' ? 'quemados al video' : 'en archivo SRT/VTT'}.`;

    infoEl.innerHTML = `<strong>Subtitulado</strong><span>${desc}</span>`;

    ctaBtn.href = `https://wa.me/5492302219422?text=${encodeURIComponent(
      `Hola Danilo, quiero cotizar subtitulado:\n· Origen: ${langLabel[state.subsLangSrc]}\n· Destino: ${langLabel[state.subsLangDst]}\n· Duración: ${mins} min\n· Entrega: ${state.subsDeliv === 'burned' ? 'Quemado al video' : 'SRT/VTT'}\n· Urgencia: ${optLabel('urg')}\n· Estimado: ${fmtRange(lo, hi).replace(' – ', '–')} USD`
    )}`;
  }

  function renderMonthly() {
    const pack = PACKS[state.monthlyQty] || PACKS[20];
    rangeEl.textContent    = `$${pack.total}`;
    perPieceEl.textContent = `$${pack.perPiece % 1 === 0 ? pack.perPiece : pack.perPiece.toFixed(1)}`;
    infoEl.innerHTML = `<strong>Paquete mensual · ${state.monthlyQty} piezas</strong><span>Precio por pieza menor al unitario. Incluye prioridad de agenda y comunicación directa por WhatsApp.</span>`;
    ctaBtn.href = `https://wa.me/5492302219422?text=${encodeURIComponent(
      `Hola Danilo, me interesa un paquete mensual de ${state.monthlyQty} piezas (~$${pack.total} USD/mes).`
    )}`;
  }

  // ─── EVENTOS: TIPO ───────────────────────────────────────────────
  document.querySelectorAll('.calc-opt[data-field="tipo"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-opt[data-field="tipo"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tipo = btn.dataset.val;
      if (state.tipo !== 'monthly') state.monthly = false;
      else state.monthly = true;
      update();
    });
  });

  // ─── EVENTOS: URG / COMPLEX / SUBS FIELDS ───────────────────────
  ['urg', 'complex', 'subsLangSrc', 'subsLangDst', 'subsDeliv'].forEach(field => {
    document.querySelectorAll(`.calc-opt[data-field="${field}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(`.calc-opt[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state[field] = btn.dataset.val;
        update();
      });
    });
  });

  // ─── EVENTOS: PRESETS DURACIÓN EDICIÓN ──────────────────────────
  presets.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      presets.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.preset === 'custom') {
        show(customInp);
        state.qty = parseInt(qtyInput.value) || 1;
        qtyNum.textContent = state.qty;
      } else {
        hide(customInp);
        state.qty = parseInt(btn.dataset.preset);
        qtyNum.textContent = state.qty;
      }
      update();
    });
  });

  qtyInput.addEventListener('input', () => {
    const v = Math.max(1, Math.min(180, parseInt(qtyInput.value) || 1));
    state.qty = v;
    qtyNum.textContent = v;
    update();
  });

  // ─── EVENTOS: PRESETS MENSUAL ────────────────────────────────────
  monthlyPresets.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      monthlyPresets.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.monthlyQty = parseInt(btn.dataset.preset);
      qtyNum2.textContent = state.monthlyQty + ' piezas';
      update();
    });
  });

  // ─── EVENTOS: PRESETS DURACIÓN SUBTITULADO ──────────────────────
  subsPresets.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      subsPresets.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.preset === 'custom') {
        show(subsCustomInp);
        state.subsQty = parseInt(subsQtyInput.value) || 1;
        subsQtyNum.textContent = state.subsQty;
      } else {
        hide(subsCustomInp);
        state.subsQty = parseInt(btn.dataset.preset);
        subsQtyNum.textContent = state.subsQty;
      }
      update();
    });
  });

  subsQtyInput.addEventListener('input', () => {
    const v = Math.max(1, Math.min(180, parseInt(subsQtyInput.value) || 1));
    state.subsQty = v;
    subsQtyNum.textContent = v;
    update();
  });

  // ─── INIT ────────────────────────────────────────────────────────
  update();
}


// onda de audio decorativa para la pista A1 (SVG generado)
function waveSVG(seed, bars = 64) {
  let r = seed, s = '';
  for (let i = 0; i < bars; i++) {
    r = (r * 9301 + 49297) % 233280;
    const h = 20 + (r / 233280) * 70 * (0.55 + 0.45 * Math.sin(i / 5 + seed));
    s += `<rect x="${i * 100 / bars + 0.3}" y="${50 - h / 2}" width="${100 / bars - 0.6}" height="${h}" fill="%232fb385"/>`;
  }
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${s.replace(/"/g, "'")}</svg>")`;
}

// ─── NAV: capítulo actual + progreso de la página ───
// [selector, nombre, nombre corto para el celular]
const CHAPTERS = [
  ['#top', 'Inicio', 'Inicio'], ['#caso-inazio', '002 · Inazio Coach', '002 · Inazio'], ['#caso-cosami', '003 · Cosami', '003 · Cosami'],
  ['#caso-aitor', '004 · Aitor Zabaleta Korta', '004 · Aitor'], ['#locales', '005 · Negocios locales', '005 · Locales'],
  ['#enfoque', 'Enfoque', 'Enfoque'], ['#servicios', 'Servicios', 'Servicios'], ['#subtitulos', 'Subtítulos', 'Subtítulos'], ['#proceso', 'Cómo trabajo', 'Proceso'],
  ['#resenas', 'Reseñas', 'Reseñas'], ['#sobre-mi', 'Sobre mí', 'Sobre mí'], ['#cotizar', 'Cotizar', 'Cotizar'], ['#contacto', 'Contacto', 'Contacto']
];
// las posiciones se miden una vez y se vuelven a medir solo si cambia el alto de la página
let chapterTops = [];
function measureChapters() { chapterTops = CHAPTERS.map(([sel]) => { const el = $(sel); return el ? el.getBoundingClientRect().top + scrollY : Infinity; }); }
function currentChapter() {
  if (!chapterTops.length) measureChapters();
  const probe = scrollY + innerHeight * 0.4;
  let idx = 0;
  chapterTops.forEach((t, i) => { if (t <= probe) idx = i; });
  return idx;
}
function chapterLabel(i) {
  if (i === 0) { const st = $('.stage'); return st && secProgress(st) > 0.18 ? '001 · MDA' : 'Inicio'; }
  return CHAPTERS[i][DESKTOP() ? 1 : 2];
}
function initNavMeta() {
  const label = $('#navChapter'), bar = $('#navProgress'), tcEl = $('#navTc');
  if (!label) return;
  let shown = '', shownTc = '', raf = 0;
  const remeasure = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { measureChapters(); runScroll(); }); };
  new ResizeObserver(remeasure).observe(document.body);
  onResize(remeasure);
  addEventListener('load', remeasure);
  onScroll.push(() => {
    const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    bar.style.transform = `scaleX(${p})`;
    // la página como una secuencia de 3 minutos: el timecode corre con el scroll
    const t = tc(p * 180);
    if (tcEl && t !== shownTc) { shownTc = t; tcEl.textContent = t; }
    const txt = chapterLabel(currentChapter());
    if (txt !== shown) {
      shown = txt; label.textContent = txt;
      label.classList.remove('swap'); void label.offsetWidth; label.classList.add('swap');
    }
  });
}

// ─── TOAST ───
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
}

// ─── ATAJOS J / K / L (los de Premiere): anterior, pausa, siguiente ───
function mostVisibleVideo() {
  let best = null, bestA = 0;
  $$('video').forEach(v => {
    const r = v.getBoundingClientRect();
    const a = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
    if (a > bestA && getComputedStyle(v).visibility !== 'hidden') { bestA = a; best = v; }
  });
  return best;
}
function initKeys() {
  const go = dir => {
    const i = clamp(currentChapter() + dir, 0, CHAPTERS.length - 1);
    const el = $(CHAPTERS[i][0]);
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - (i === 0 ? 0 : 64), behavior: REDUCED ? 'auto' : 'smooth' });
    toast((dir > 0 ? 'L · ' : 'J · ') + CHAPTERS[i][1]);
  };
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable || $('dialog[open]')) return;
    const k = e.key.toLowerCase();
    if (k === 'l') go(1);
    else if (k === 'j') go(-1);
    else if (k === 'k') {
      const v = dock.video && !dock.video.muted ? dock.video : mostVisibleVideo();
      if (!v) return;
      if (v.paused) { v.play().catch(() => {}); toast('K · reproducir'); } else { v.pause(); toast('K · pausa'); }
    }
  });
  $('#navKeys')?.addEventListener('click', () => toast('Atajos de edición: J anterior · K pausa · L siguiente'));
}

// ─── A CONTINUACIÓN: la barra se llena como el autoplay del próximo video ───
function initUpNext() {
  const items = $$('[data-upnext]');
  if (!items.length) return;
  const seen = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)), { rootMargin: '10% 0px' });
  items.forEach(el => io.observe(el));
  onScroll.push(() => seen.forEach(el => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--p', REDUCED ? 1 : clamp((innerHeight - r.top) / (innerHeight * 0.55)));
  }));
}

// ─── MINI-PLAYER: el video con sonido te sigue si seguís scrolleando ───
const dock = { video: null };
function initDock() {
  const el = $('#dock');
  if (!el) return;
  const canvas = $('#dockCanvas'), ctx = canvas.getContext('2d');
  const title = $('#dockTitle'), play = $('#dockPlay'), back = $('#dockBack'), close = $('#dockClose');
  let raf = 0, visible = false;

  $$('video').forEach(v => {
    v.addEventListener('volumechange', () => { if (!v.muted) dock.video = v; else if (dock.video === v) dock.video = null; });
    v.addEventListener('play', () => { if (!v.muted) dock.video = v; });
  });
  function onScreen(v) {
    const r = (v.closest('.stage-sticky, .cs-sticky, .cc-media, .lc-phone') || v).getBoundingClientRect();
    return r.bottom > innerHeight * 0.15 && r.top < innerHeight * 0.85;
  }
  function show(on) {
    if (on === visible) return;
    visible = on; el.hidden = !on;
    if (on) {
      const v = dock.video, vw = v.videoWidth || 9, vh = v.videoHeight || 16;
      el.style.setProperty('--dw', (vw >= vh ? 260 : 150) + 'px');
      canvas.width = vw >= vh ? 520 : 300; canvas.height = Math.round(canvas.width * vh / vw);
      title.textContent = v.dataset.title || 'Video';
      loop();
    } else cancelAnimationFrame(raf);
  }
  function loop() {
    const v = dock.video;
    if (v && v.readyState >= 2) ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    if (v) play.textContent = v.paused ? 'Play' : 'Pausa';
    raf = requestAnimationFrame(loop);
  }
  onScroll.push(() => {
    const v = dock.video;
    show(!!(v && !v.muted && !v.paused && !onScreen(v)) || (visible && v && !v.muted && !onScreen(v)));
  });
  const toggle = () => { const v = dock.video; if (v) v.paused ? v.play().catch(() => {}) : v.pause(); };
  play.addEventListener('click', toggle);
  canvas.addEventListener('click', toggle);
  back.addEventListener('click', () => {
    const v = dock.video; if (!v) return;
    const host = v.closest('section');
    let top = host.getBoundingClientRect().top + scrollY - 64;
    if (host.classList.contains('device-sec')) top = host.offsetTop + (host.offsetHeight - innerHeight) * 0.55;
    if (host.id === 'locales') { const card = v.closest('.lc'); top = host.offsetTop + (host._travel ? clamp((card.offsetLeft - innerWidth / 2 + card.offsetWidth / 2) / host._travel) * host._travel : 0); }
    scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
  });
  close.addEventListener('click', () => {
    const v = dock.video; if (!v) return;
    v.pause(); v.muted = true;
    v.closest('[data-player]')?.classList.remove('has-sound');
    v.closest('.lc')?.classList.remove('has-sound');
    v.dispatchEvent(new Event('dockclose'));
    dock.video = null; show(false);
  });
}


// ─── ANTES / DESPUÉS genérico: imágenes o una sola imagen partida ───
// data-mode="split-h": la imagen tiene el ANTES a la izquierda y el DESPUÉS a la derecha
// data-mode="split-v": ANTES arriba, DESPUÉS abajo  ·  sin data-src: usa las <img> internas
function initBA() {
  $$('[data-ba]').forEach(c => {
    const before = $('.ba-before', c), handle = $('.ba-handle', c);
    if (c.dataset.src) {
      const mode = c.dataset.mode || 'split-h', im = new Image();
      im.onload = () => {
        const w = im.naturalWidth, h = im.naturalHeight;
        const ar = mode === 'split-h' ? (w / 2) / h : mode === 'split-v' ? w / (h / 2) : w / h;
        c.style.setProperty('--ar', ar.toFixed(4));
      };
      im.src = c.dataset.src;
      const size = mode === 'split-h' ? '200% 100%' : mode === 'split-v' ? '100% 200%' : 'cover';
      $$('.gba-layer', c).forEach(l => { l.style.backgroundImage = `url("${c.dataset.src}")`; l.style.backgroundSize = size; });
      $('.gba-before', c).style.backgroundPosition = '0 0';
      $('.gba-after', c).style.backgroundPosition = mode === 'split-h' ? '100% 0' : mode === 'split-v' ? '0 100%' : 'center';
    }
    const apply = pct => {
      pct = clamp(pct, 2, 98);
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
      c.setAttribute('aria-valuenow', Math.round(pct));
    };
    let drag = false;
    const at = x => { const r = c.getBoundingClientRect(); apply((x - r.left) / r.width * 100); };
    c.addEventListener('pointerdown', e => { drag = true; c._touched = true; c.setPointerCapture(e.pointerId); at(e.clientX); e.stopPropagation(); });
    c.addEventListener('pointermove', e => { if (drag) at(e.clientX); });
    c.addEventListener('pointerup', () => drag = false);
    c.addEventListener('keydown', e => {
      const d = { ArrowLeft: -5, ArrowRight: 5 }[e.key];
      if (d) { e.preventDefault(); c._touched = true; apply((+c.getAttribute('aria-valuenow') || 50) + d); }
    });
    c._apply = apply;
    // una vez, se mueve solo para mostrar que se arrastra
    if (!REDUCED) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const keys = [50, 22, 78, 50], start = performance.now(), D = 2200;
        (function f(now) {
          if (c._touched) return;
          const t = clamp((now - start) / D), seg = Math.min(2, Math.floor(t * 3)), lt = t * 3 - seg;
          const k = lt < 0.5 ? 2 * lt * lt : 1 - Math.pow(-2 * lt + 2, 2) / 2;
          apply(lerp(keys[seg], keys[seg + 1], k));
          if (t < 1) requestAnimationFrame(f);
        })(start);
      }, { threshold: 0.7 });
      io.observe(c);
    }
  });
}

// ─── 005 · NEGOCIOS LOCALES: carrusel horizontal ───
// Desktop: el scroll vertical lo mueve de costado (sección fija).
// Mobile: se desliza con el dedo, con snap en cada tarjeta.
function initLocals() {
  const sec = $('#locales'), track = $('#localsTrack'), bar = $('#localsBar');
  if (!sec || !track) return;
  const sticky = $('.locals-sticky', sec), head = $('.locals-head', sec), barBox = bar.parentElement;
  const cards = $$('.lc', track);
  let pinned = false, skew = 0, lastY = scrollY, inView = false, settling = false;

  // Desktop: el título pasa a ser el primer panel del carrusel y cada tarjeta toma el alto
  // que queda libre, para que el título, el texto y los botones siempre entren.
  function fit() {
    const pin = DESKTOP();
    sec.classList.toggle('is-pinned', pin);
    if (pin && head.parentElement !== track) track.prepend(head);
    if (!pin && head.parentElement === track) sticky.prepend(head);
    if (!pin) { ['--lc-h', '--lc-w'].forEach(v => sec.style.removeProperty(v)); sec.classList.remove('is-tight'); return; }
    const cs = getComputedStyle(sticky);
    const room = innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      - barBox.offsetHeight - parseFloat(getComputedStyle(barBox).marginTop) - 16;
    sec.classList.toggle('is-tight', room < 640);
    const metaAt = w => {
      sec.style.setProperty('--lc-w', w + 'px');
      return Math.max(...$$('.lc-meta', track).map(m => m.offsetHeight));
    };
    // la tarjeta más ancha que entre con su video en 9:16; si ni la angosta entra, el video se recorta apenas
    let w = 320, meta = metaAt(w);
    while (w > 230 && w * 16 / 9 + meta > room) { w -= 10; meta = metaAt(w); }
    sec.style.setProperty('--lc-w', w + 'px');
    sec.style.setProperty('--lc-h', Math.round(clamp(room - meta, 200, w * 16 / 9)) + 'px');
  }
  function layout() {
    pinned = DESKTOP();
    fit();
    if (pinned) {
      track.style.transform = '';
      sec._travel = Math.max(0, track.scrollWidth - innerWidth);
      sec.style.height = (sticky.offsetHeight + sec._travel) + 'px';
    } else { sec._travel = 0; sec.style.height = ''; track.style.transform = ''; }
  }
  function focus() {                       // la tarjeta del centro manda: las demás se achican un poco
    const mid = innerWidth / 2;
    const rs = cards.map(c => c.getBoundingClientRect());  // primero todas las lecturas, después las escrituras
    cards.forEach((c, i) => {
      const d = Math.abs(rs[i].left + rs[i].width / 2 - mid) / innerWidth;
      c.style.setProperty('--sc', (1 - Math.min(0.08, d * 0.12)).toFixed(3));
      c.style.setProperty('--op', (1 - Math.min(0.45, d * 0.7)).toFixed(3));
    });
  }
  // el skew vuelve a 0 cuando dejás de scrollear (el loop corre solo mientras hace falta)
  function settle() {
    if (settling) return;
    settling = true;
    (function f() {
      skew *= 0.85;
      if (Math.abs(skew) < 0.02) skew = 0;
      track.style.setProperty('--skew', skew.toFixed(2) + 'deg');
      if (skew) requestAnimationFrame(f); else settling = false;
    })();
  }
  function update() {
    if (!inView) return;
    if (pinned) {
      const p = secProgress(sec);
      track.style.transform = `translateX(${-p * sec._travel}px)`;
      bar.style.transform = `scaleX(${p})`;
      const dy = scrollY - lastY; lastY = scrollY;
      if (!REDUCED) { skew = lerp(skew, clamp(dy * -0.06, -5, 5), 0.25); settle(); }
    }
    focus();
  }
  track.addEventListener('scroll', () => {
    if (pinned) return;
    bar.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`;
    focus();
  }, { passive: true });

  cards.forEach(card => {
    const v = $('video', card), snd = $('.lc-snd', card), prog = $('.lc-progress i', card);
    const front = $('.lc-front', card), back = $('.lc-back', card);
    const setSound = on => {
      if (on) { muteAllExcept(v); v.currentTime = 0; v.play().catch(() => {}); }
      v.muted = !on; card.classList.toggle('has-sound', on);
      snd.setAttribute('aria-label', (on ? 'Silenciar ' : 'Escuchar ') + v.dataset.title);
    };
    snd.addEventListener('click', e => { e.stopPropagation(); setSound(v.muted); });
    v.addEventListener('click', () => setSound(v.muted));
    v.addEventListener('volumechange', () => card.classList.toggle('has-sound', !v.muted));
    v.addEventListener('timeupdate', () => { if (v.duration) prog.style.transform = `scaleX(${v.currentTime / v.duration})`; });
    if (!back) return;
    // flip: la cara que no se ve queda inerte (ni foco ni lector de pantalla)
    back.inert = true;
    const flip = on => {
      card.classList.toggle('is-flipped', on);
      front.inert = on; back.inert = !on;
      if (on) { v.pause(); setTimeout(() => $('[data-lightbox].btn', back)?.focus({ preventScroll: true }), 450); }
      else { v.play().catch(() => {}); $('[data-flip]', front)?.focus({ preventScroll: true }); }
    };
    $('[data-flip]', card)?.addEventListener('click', e => { e.preventDefault(); flip(true); });
    $('[data-unflip]', card)?.addEventListener('click', () => flip(false));
    $$('[data-lightbox]', card).forEach(b => b.addEventListener('click', openLightbox));
  });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) { lastY = scrollY; update(); } }, { rootMargin: '10% 0px' }).observe(sec);
  layout(); update();
  onResize(() => { layout(); update(); });
  addEventListener('load', () => { layout(); update(); });
  document.fonts?.ready.then(() => { layout(); update(); });
  onScroll.push(update);
}

// ─── VISOR: el antes/después del color en grande ───
function openLightbox() {
  const lb = $('#lightbox');
  if (!lb || typeof lb.showModal !== 'function') { location.href = 'assets/color-grading.webp'; return; }
  const img = $('img', lb);
  if (!img.getAttribute('src')) img.src = img.dataset.src;   // la imagen grande se pide recién acá
  lb.showModal();
}
function initLightbox() {
  const lb = $('#lightbox');
  if (!lb) return;
  $('[data-close]', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });   // tocar afuera cierra
}

// ─── ENTRADAS: listas y bloques de texto suben suave al aparecer ───
function initRise() {
  const els = [];
  ['.svc-item', '.stat', '.focus-text p', '.about-text > p, .tooldock, .clients-row, .about-links'].forEach(sel =>
    $$(sel).forEach((el, i) => { el.classList.add('rise'); el.style.setProperty('--i', i); els.push(el); }));
  if (REDUCED) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
}

// ─── TÍTULOS: cada palabra sube desde una máscara, una sola vez ───
function initReveal() {
  const els = $$('.sec-head h2, .case-h, .studio-head h2, .subs-copy h2, .about-text h2, .locals-head h2, .final-title, .focus-kicker');
  els.forEach(el => {
    el.classList.add('rv');
    let i = 0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="rw"><span style="--i:${i++}">${w}</span></span>`).join(' ');
  });
  if (REDUCED) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.3 });
  els.forEach(el => io.observe(el));
}

// ─── "Trabajo" lleva al primer caso dentro del iPhone, no al principio ───
function initAnchors() {
  $$('a[href="#trabajo"]').forEach(a => a.addEventListener('click', e => {
    const st = $('.stage'); if (!st) return;
    e.preventDefault();
    scrollTo({ top: st.offsetTop + (st.offsetHeight - innerHeight) * 0.3, behavior: REDUCED ? 'auto' : 'smooth' });
  }));
}

// ─── DOCK DE HERRAMIENTAS: magnificación tipo macOS ───
function initToolDock() {
  const d = $('#tooldock');
  if (!d || !FINE || REDUCED) return;
  const items = $$('li', d);
  d.addEventListener('pointermove', e => items.forEach(li => {
    const r = li.getBoundingClientRect(), dist = Math.abs(e.clientX - (r.left + r.width / 2));
    const s = 1 + 0.55 * Math.max(0, 1 - dist / 130);
    li.style.transform = `scale(${s})`;
    li.style.margin = `0 ${(s - 1) * 14}px`;
  }));
  d.addEventListener('pointerleave', () => items.forEach(li => { li.style.transform = ''; li.style.margin = ''; }));
}

// ══════════════════════════════════════════════════════════════
// ENFOQUE · una edición que se arma sola, en loop
// Importa una toma, corta silencios, pone el mejor momento primero, punch-ins,
// B-roll, subtítulos, música y color; la revisa, exporta y abre la versión siguiente.
// Todo corre sobre un reloj propio que solo avanza con el panel a la vista.
// El monitor siempre muestra lo que hay bajo el cabezal, como en Premiere.
// ══════════════════════════════════════════════════════════════
function initPremiere() {
  const pr = $('#pr');
  if (!pr) return;
  const SEQ = 30;                                            // segundos que muestra la regla
  const canvas = $('.pr-canvas', pr), cx = canvas.getContext('2d');
  const capEl = $('#prCap'), tcEl = $('#prTc'), ph = $('#prPh'), cursor = $('#prCursor');
  const stepEl = $('#prStep'), msgEl = $('#prMsg'), keyEl = $('#prKey'), fileEl = $('#prFile'), durEl = $('#prDur');
  const exp = $('#prExport'), expBar = $('#prExpBar'), expPct = $('#prExpPct'), expName = $('#prExpName');
  const meters = [$('#prMeterL'), $('#prMeterR')], rules = $$('#rules li'), lum = $$('#prLum li');
  const lane = t => $(`.pr-track[data-track="${t}"] .pr-lane`, pr);

  // footage: la foto de Sobre mí es la toma principal; el iPhone del hero, el B-roll de producto
  const photo = new Image();
  photo.decoding = 'async';

  // ── regla ──
  const ruler = $('#prRuler');
  for (let t = 0; t <= SEQ; t++) {
    const i = document.createElement('i');
    i.style.left = (t / SEQ * 100) + '%';
    if (t % 5 === 0) {
      i.className = 'maj';
      const b = document.createElement('b');
      b.style.left = i.style.left; b.textContent = '00:' + String(t).padStart(2, '0');
      ruler.append(b);
    }
    ruler.append(i);
  }

  // ── audio: una onda por fuente (con silencios reales donde después se corta) ──
  function makeWave(seed, gaps, dense) {
    const n = 240, amp = [];
    let r = seed, d = '';
    for (let i = 0; i < n; i++) {
      r = (r * 9301 + 49297) % 233280;
      const t = i / n * SEQ, q = gaps.some(([a, b]) => t > a && t < b);
      const h = q ? 2 + (r / 233280) * 4 : (dense ? 34 : 16) + (r / 233280) * (dense ? 40 : 70) * (0.55 + 0.45 * Math.sin(i / 6 + seed));
      amp.push(h / 100);
      d += `M${(i / n * 100).toFixed(2)} ${(50 - h / 2).toFixed(1)}v${h.toFixed(1)}`;
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${d}' stroke='%23a8ecd2' stroke-width='1' vector-effect='non-scaling-stroke' fill='none'/></svg>`;
    return { uri: `url("data:image/svg+xml,${svg}")`, amp };
  }
  const VOICE = makeWave(7, [[5.3, 7.4], [14.8, 16.6]]), MUSIC = makeWave(3, [], true);
  const ampAt = (w, t) => w.amp[clamp(Math.floor(t / SEQ * w.amp.length), 0, w.amp.length - 1)];

  // ── clips ──
  let clips = [];
  const live = tr => clips.filter(c => c.track === tr && !c.dead).sort((a, b) => a.start - b.start);
  const clipAt = (tr, t) => clips.find(c => c.track === tr && !c.dead && t >= c.start && t < c.start + c.dur);
  function add(c) {
    c.el = document.createElement('span');
    c.el.className = `pc pc--${c.track} new`;
    lane(c.track).append(c.el);
    clips.push(c);
    draw(c);
    return c;
  }
  function draw(c) {                                          // posición + contenido del clip
    c.el.style.setProperty('--s', (c.start / SEQ * 100).toFixed(3));
    c.el.style.setProperty('--d', (c.dur / SEQ * 100).toFixed(3));
    c.el.textContent = '';
    if (c.wave) {                                             // la onda se recorta según el punto de entrada
      const w = document.createElement('i');
      w.className = 'w';
      w.style.left = (-c.in / c.dur * 100) + '%';
      w.style.width = (SEQ / c.dur * 100) + '%';
      w.style.backgroundImage = c.wave.uri;
      c.el.append(w);
    }
    const label = document.createElement('span');
    label.textContent = c.text || c.label;
    c.el.append(label);
    if (c.fx) { const f = document.createElement('i'); f.className = 'fx'; f.textContent = 'fx'; c.el.append(f); }
    if (c.kf) [0.12, 0.7].forEach(x => { const k = document.createElement('i'); k.className = 'kf'; k.style.left = x * 100 + '%'; c.el.append(k); });
    if (c.vol != null) { const v = document.createElement('i'); v.className = 'vol'; v.style.setProperty('--vol', c.vol + '%'); c.el.append(v); }
  }
  function remove(c) {
    c.dead = true;
    c.el.classList.add('gone');
    setTimeout(() => c.el.remove(), 450);
    if (c.link && !c.link.dead) remove(c.link);
  }
  function split(x) {                                         // la navaja: corta el clip de V1 (y su audio) en x
    const c = clipAt('v1', x);
    if (!c || x - c.start < 0.05 || c.start + c.dur - x < 0.05) return null;
    const n = add({ ...c, el: null, link: null, start: x, dur: c.start + c.dur - x, in: c.in + x - c.start });
    n.el.classList.remove('new');
    c.dur = x - c.start; draw(c);
    if (c.link) {
      const a = c.link;
      n.link = add({ ...a, el: null, start: x, dur: n.dur, in: n.in });
      n.link.el.classList.remove('new');
      a.dur = c.dur; draw(a);
    }
    const cut = document.createElement('span');
    cut.className = 'pr-cut'; cut.style.left = (x / SEQ * 100) + '%';
    lane('v1').append(cut); setTimeout(() => cut.remove(), 600);
    return n;
  }
  function ripple(first) {                                    // todo V1 pegado desde 0; el audio lo sigue
    let t = 0;
    const list = live('v1');
    if (first) list.sort((a, b) => (a === first ? -1 : b === first ? 1 : a.start - b.start));
    list.forEach(c => { c.start = t; t += c.dur; draw(c); if (c.link) { c.link.start = c.start; draw(c.link); } });
    return t;
  }
  const select = (c, on = true) => c.el.classList.toggle('sel', on);

  // ── reloj: solo avanza con el panel a la vista ──
  const jobs = new Set();
  let visible = false, looping = false, last = 0;
  function frame(now) {
    if (!visible) { looping = false; return; }
    const dt = Math.min(50, now - last); last = now;
    jobs.forEach(j => j(dt));
    paint();
    requestAnimationFrame(frame);
  }
  function wake() { if (looping || !visible) return; looping = true; last = performance.now(); requestAnimationFrame(frame); }
  const wait = ms => new Promise(res => { let left = ms; const j = dt => { if ((left -= dt) <= 0) { jobs.delete(j); res(); } }; jobs.add(j); });
  const tween = (ms, fn, e = easeIO) => new Promise(res => {
    let t = 0;
    const j = dt => { t += dt; const k = Math.min(1, t / ms); fn(e(k)); if (k >= 1) { jobs.delete(j); res(); } };
    jobs.add(j);
  });

  // ── cabezal + monitor ──
  let T = 0, playing = false;
  const level = [0, 0];
  const setT = (x, ms = 260) => { const a = T; return tween(ms, k => { T = lerp(a, x, k); }); };
  async function play(from, to, ms) { T = from; playing = true; await tween(ms, k => { T = lerp(from, to, k); }, k => k); playing = false; }
  function sizeCanvas() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    if (r.width) { canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); }
  }
  function drawAcam(c, st) {                                  // la toma principal: encuadre 9:16 sobre la cara
    if (!photo.naturalWidth) return;
    const W = canvas.width, H = canvas.height, iw = photo.naturalWidth, ih = photo.naturalHeight;
    const breathe = 1 + 0.012 * Math.sin(st * 1.3);
    const ch = ih * 0.98 / ((c.zoom || 1) * breathe), cw = ch * 9 / 16;
    const x = clamp(iw * 0.49 - cw / 2 + Math.sin(st * 0.4) * iw * 0.004, 0, iw - cw);
    const y = clamp(ih * 0.43 - ch * 0.42, 0, ih - ch);
    cx.drawImage(photo, x, y, cw, ch, 0, 0, W, H);
  }
  function drawBroll(c, lt) {
    const W = canvas.width, H = canvas.height;
    if (c.src === 'screen' && photo.naturalWidth) {          // plano detalle del monitor de fondo, con paneo
      const iw = photo.naturalWidth, ih = photo.naturalHeight, cw = iw * 0.14, ch = cw * 16 / 9;
      cx.drawImage(photo, clamp(iw * 0.1 + lt / c.dur * iw * 0.1, 0, iw - cw), ih * 0.47, cw, ch, 0, 0, W, H);
      return;
    }
    const fr = FRAME_CACHE.phone;                             // producto girando: los mismos cuadros del hero
    cx.fillStyle = '#17181b'; cx.fillRect(0, 0, W, H);
    const im = fr && fr[Math.min(71, Math.floor(lt / c.dur * 72))];
    if (im && im.complete && im.naturalWidth) { const w = W * 1.25, h = w * 1.22; cx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); }
  }
  let capClip = null, capWords = [];
  function caption(c) {
    if (c !== capClip) {
      capClip = c;
      capEl.textContent = '';
      capWords = c ? c.text.split(' ').map(w => { const b = document.createElement('b'); b.textContent = w; return b; }) : [];
      capWords.forEach((b, i) => { if (i) capEl.append(' '); capEl.append(b); });
    }
    if (!c) return;
    const k = Math.min(capWords.length - 1, Math.floor((T - c.start) / c.dur * capWords.length));
    capWords.forEach((b, i) => b.classList.toggle('now', i === k));
  }
  function paint() {
    cx.fillStyle = '#000'; cx.fillRect(0, 0, canvas.width, canvas.height);
    const b = clipAt('v2', T), a = clipAt('v1', T);
    if (b) drawBroll(b, T - b.start); else if (a) drawAcam(a, T - a.start + a.in);
    caption(clipAt('c1', T));
    ph.style.setProperty('--t', (T / SEQ).toFixed(4));
    tcEl.textContent = tc(T);
    // vúmetros: la voz bajo el cabezal + la música (más baja cuando se mezcla)
    const v = clipAt('a1', T), m = clipAt('a2', T);
    const tgt = playing ? [v ? ampAt(VOICE, T - v.start + v.in) : 0, m ? ampAt(MUSIC, T) * (m.vol > 40 ? 0.35 : 0.8) : 0] : [0, 0];
    [0, 1].forEach(i => {
      const x = clamp(tgt[0] * (i ? 0.92 : 1) + tgt[1] + (playing ? Math.random() * 0.06 : 0));
      level[i] = x > level[i] ? x : level[i] * 0.9;
      meters[i].style.setProperty('--lv', (level[i] * 100).toFixed(1) + '%');
    });
  }

  // ── cursor ──
  let cxy = [40, 60];
  const setCursor = (x, y) => { cxy = [x, y]; cursor.style.transform = `translate(${x - 3}px, ${y - 2}px)`; };
  function at(el, fx = 0.5, fy = 0.5) {
    const r = el.getBoundingClientRect(), P = pr.getBoundingClientRect();
    return [r.left - P.left + r.width * fx, r.top - P.top + r.height * fy];
  }
  function atT(track, t) { const [x0, y] = at(lane(track), 0, 0.5); return [x0 + lane(track).offsetWidth * t / SEQ, y]; }
  function move(to, ms, onStep) {
    const from = cxy.slice(), d = Math.hypot(to[0] - from[0], to[1] - from[1]);
    return tween(ms ?? clamp(240 + d * 0.9, 240, 900), k => { setCursor(lerp(from[0], to[0], k), lerp(from[1], to[1], k)); onStep?.(); });
  }
  async function click() { cursor.classList.add('down'); await wait(110); cursor.classList.remove('down'); await wait(70); }
  async function drag(item, track, t, label, color) {         // del panel Proyecto a la timeline
    const li = $(`[data-item="${item}"]`, pr), to = atT(track, t);
    const binOn = li && li.offsetParent !== null;             // en el panel angosto el bin está oculto
    if (binOn) { li.classList.add('hot'); preview(item); await move(at(li, 0.3)); } else await move([to[0] + 20, to[1] - 36]);
    await click();
    const g = document.createElement('span');
    g.className = 'pr-ghost'; g.textContent = label; g.style.setProperty('--c', color);
    pr.append(g);
    const follow = () => { g.style.transform = `translate(${cxy[0] + 10}px, ${cxy[1] + 8}px)`; };
    follow();
    await move(to, null, follow);
    await click();
    g.remove(); li?.classList.remove('hot');
  }
  // vista previa del Proyecto: el clip que se está por usar, con sus datos
  const thumb = $('#prThumb'), tx = thumb.getContext('2d'), metaEl = $('#prMeta');
  const META = {
    acam: 'A001_C012.mov\n3840 × 2160 · 25 fps · 00:00:30:00', broll1: 'pantalla_B.mov\n1920 × 1080 · 25 fps · 00:00:04:00',
    broll2: 'producto_giro.mov\n1920 × 1080 · 25 fps · 00:00:05:00', music: 'musica_base.wav\n48 kHz · estéreo · 00:00:30:00',
    lumetri: 'Lumetri · cálido\nPreajuste de color'
  };
  function preview(item) {
    const W = thumb.width, H = thumb.height, iw = photo.naturalWidth, ih = photo.naturalHeight;
    tx.fillStyle = '#000'; tx.fillRect(0, 0, W, H);
    metaEl.textContent = META[item];
    if (item === 'music') {
      tx.strokeStyle = '#2fb385'; tx.beginPath();
      MUSIC.amp.forEach((a, i) => { const x = i / MUSIC.amp.length * W; tx.moveTo(x, H / 2 - a * H * 0.4); tx.lineTo(x, H / 2 + a * H * 0.4); });
      tx.stroke(); return;
    }
    if (item === 'broll2') {
      const im = FRAME_CACHE.phone?.[20];
      tx.fillStyle = '#17181b'; tx.fillRect(0, 0, W, H);
      if (im?.naturalWidth) tx.drawImage(im, W / 2 - H * 0.8, -H * 0.3, H * 1.6, H * 1.95);
      return;
    }
    if (!iw) return;
    if (item === 'broll1') { tx.drawImage(photo, iw * 0.04, ih * 0.5, iw * 0.3, ih * 0.169, 0, 0, W, H); return; }
    const sw = iw, sh = iw * 9 / 16, sy = ih * 0.2;
    tx.drawImage(photo, 0, sy, sw, sh, 0, 0, W, H);
    if (item === 'lumetri') {                                 // antes/después partido al medio
      tx.save(); tx.beginPath(); tx.rect(0, 0, W / 2, H); tx.clip();
      tx.filter = 'saturate(0.3) contrast(0.8) brightness(1.1)';
      tx.drawImage(photo, 0, sy, sw, sh, 0, 0, W, H);
      tx.restore(); tx.fillStyle = '#fff'; tx.fillRect(W / 2 - 1, 0, 2, H);
    }
  }
  const tool = name => { pr.classList.toggle('razor', name === 'razor'); $$('#prTools i', pr).forEach(i => i.classList.toggle('on', i.dataset.tool === name)); };
  const ws = name => $$('.pr-ws b', pr).forEach(b => b.classList.toggle('on', b.dataset.ws === name));
  const rulesBox = $('.rules'), rnText = $('#rnText'), rnNum = $('#rnNum'), rnTc = $('#rnTc'), ticks = $$('#rnTicks li');
  const seenRules = new Set();
  let shownRule = -1;
  function marker(rule) {                                     // la regla del paso actual, como un marcador de Premiere
    if (rule < 0 || rule === shownRule || !rnText) return;
    shownRule = rule; seenRules.add(rule);
    rulesBox.classList.add('is-live');
    const old = $('span', rnText);
    if (old) { old.className = 'out'; setTimeout(() => old.remove(), 460); }
    const sp = document.createElement('span'); sp.textContent = rules[rule].textContent; rnText.append(sp);
    rnNum.textContent = `${String(rule + 1).padStart(2, '0')} / 06`;
    rnTc.textContent = 'Marcador · ' + tc(T);
    ticks.forEach((li, i) => { li.classList.toggle('now', i === rule); li.classList.toggle('done', seenRules.has(i) && i !== rule); });
  }
  function step(tag, msg, key, rule) {
    stepEl.textContent = tag; msgEl.textContent = msg; keyEl.textContent = key;
    rules.forEach((li, i) => li.classList.toggle('is-now', i === rule));
    marker(rule);
  }
  const LUM = [['0,0', 50], ['0,0', 50], ['0,0', 50], ['0,0', 50], ['0,0', 50], ['0,0', 50], ['100', 50]];
  const LUM_OK = [['9,6', 63], ['2,1', 54], ['0,3', 53], ['24,0', 69], ['−18,0', 38], ['12,0', 58], ['118', 61]];
  const setLum = (vals, on) => lum.forEach((li, i) => { li.classList.toggle('on', !!on); $('b', li).style.setProperty('--v', vals[i][1] + '%'); $('em', li).textContent = vals[i][0]; });

  // ── la edición ──
  const SUFFIX = ['', '_final', '_final_final', '_ahora_si', '_ESTE', '_ESTE_de_verdad'];
  const SCRIPTS = [
    ['Tenés dos segundos.', 'Después, la gente scrollea.', 'Por eso corto los silencios,', 'muestro lo que se dice', 'y subtitulo todo:', 'mucha gente mira sin sonido.'],
    ['Estudio Medicina.', 'Y edito video.', 'Las dos cosas tratan', 'de lo mismo:', 'cómo presta atención', 'una persona.'],
    ['Cortar no es quitar.', 'Es elegir qué se queda.', 'Cada corte', 'tiene que ganarse', 'el siguiente segundo.', 'Si no, afuera.']
  ];
  const jit = (k = 0.5) => (Math.random() - 0.5) * k;
  let n = 0;

  function reset(name) {
    clips.forEach(c => c.el.remove());
    clips = [];
    $$('.mk', ruler).forEach(m => m.remove());
    pr.classList.remove('is-graded');
    setLum(LUM, false); tool('select'); ws('edit');
    T = 0; capClip = undefined; caption(null);
    fileEl.textContent = name + '.prproj'; durEl.textContent = tc(SEQ);
    preview('acam');
  }

  async function episode() {
    n++;
    const name = `reel_v${n}${SUFFIX[(n - 1) % SUFFIX.length]}`, script = SCRIPTS[(n - 1) % SCRIPTS.length];
    reset(name);

    // 1 · importar y mirar el crudo
    step('Importar', 'Material crudo: una sola toma de 30 segundos.', 'I', -1);
    await wait(400);
    await drag('acam', 'v1', 0, 'A001_C012.mov', 'var(--accent)');
    const A = add({ track: 'v1', start: 0, dur: SEQ, in: 0, label: 'A001_C012.mov', zoom: 1 });
    A.link = add({ track: 'a1', start: 0, dur: SEQ, in: 0, label: 'A001_C012.mov', wave: VOICE });
    step('Revisar', 'Primero la miro entera, sin tocar nada.', 'Espacio', -1);
    await play(0, 8, 1600);

    // 2 · cortar silencios + ripple
    step('Cortar', 'Corto los silencios: el ritmo de corte sostiene la retención.', 'C', 1);
    tool('razor');
    const cuts = [5.4 + jit(0.3), 7.3 + jit(0.2), 14.9 + jit(0.3), 16.5 + jit(0.2)];
    for (const x of cuts) { await move(atT('v1', x)); await click(); split(x); await setT(x, 180); }
    tool('select');
    const gaps = [clipAt('v1', (cuts[0] + cuts[1]) / 2), clipAt('v1', (cuts[2] + cuts[3]) / 2)];
    for (const c of gaps) { await move(atT('v1', c.start + c.dur / 2)); await click(); select(c); }
    step('Ripple', 'Borro los huecos y todo lo demás se corre solo.', 'Supr', 1);
    await wait(350);
    gaps.forEach(remove);
    await wait(300);
    let end = ripple();
    await wait(550);

    // 3 · hook: el mejor momento va primero
    step('Hook', 'Lo mejor va primero: los primeros 2 segundos deciden.', 'M', 0);
    const src = 24 + jit(0.6), C = live('v1').find(c => src >= c.in && src < c.in + c.dur);
    const hs = C.start + (src - C.in);
    await move([at(ruler, 0, 0.5)[0] + ruler.offsetWidth * hs / SEQ, at(ruler)[1]]); await click();
    const mk = document.createElement('span'); mk.className = 'mk'; mk.style.left = (hs / SEQ * 100) + '%'; ruler.append(mk);
    await setT(hs);
    tool('razor');
    await move(atT('v1', hs)); await click(); split(hs);
    await move(atT('v1', hs + 2.6)); await click(); split(hs + 2.6);
    tool('select');
    const H = clipAt('v1', hs + 1.3);
    await move(atT('v1', hs + 1.3)); await click();
    H.label = '★ hook'; draw(H); select(H);
    await move(atT('v1', 1.3), 700);
    end = ripple(H); select(H, false); mk.remove();
    await setT(0.6, 300);
    await wait(500);

    // 4 · punch-ins
    step('Punch-in', 'Un cambio visual cada pocos segundos: zoom en los cortes.', 'Z', 2);
    const segs = live('v1');
    for (let i = 0; i < segs.length; i += 2) {
      segs[i].zoom = i ? 1.13 : 1.22; segs[i].kf = true;
      await move(atT('v1', segs[i].start + segs[i].dur * 0.5)); await click();
      draw(segs[i]); await setT(segs[i].start + 0.4, 200);
    }

    // 5 · B-roll sobre los cortes
    step('B-roll', 'B-roll sobre los cortes: que se vea lo que se dice.', 'B', 2);
    const b1 = Math.max(0.2, segs[1].start - 1.1), b2 = Math.max(b1 + 3.6, segs[3].start - 1.4);
    await drag('broll1', 'v2', b1, 'pantalla_B.mov', '#6c66a8');
    add({ track: 'v2', start: b1, dur: 3, label: 'pantalla_B.mov', src: 'screen' });
    await setT(b1 + 1.2);
    await drag('broll2', 'v2', b2, 'producto_giro.mov', '#6c66a8');
    add({ track: 'v2', start: b2, dur: 3.4, label: 'producto_giro.mov', src: 'phone' });
    await setT(b2 + 1.5);

    // 6 · subtítulos palabra por palabra
    step('Subtítulos', 'Subtítulos palabra por palabra: se entiende sin sonido.', 'T', 3);
    tool('text');
    const hook = H.dur, rest = (end - hook - 0.3) / (script.length - 1);
    for (let i = 0; i < script.length; i++) {
      const s0 = i ? hook + (i - 1) * rest : 0.1, d = i ? rest - 0.1 : hook - 0.15;
      await move(atT('c1', s0 + d / 2), 220);
      add({ track: 'c1', start: s0, dur: d, text: script[i] });
      await setT(s0 + d * 0.4, 140);
    }
    tool('select');
    await setT(0.9);
    await wait(400);

    // 7 · música por debajo de la voz
    step('Música', 'La música, por debajo de la voz: el sonido marca la energía.', 'A', 4);
    ws('audio');
    await drag('music', 'a2', 0, 'musica_base.wav', '#1b5f59');
    const M = add({ track: 'a2', start: 0, dur: end, in: 0, label: 'musica_base.wav', wave: MUSIC, vol: 22 });
    await wait(300);
    await move(atT('a2', end * 0.55)); await click();
    M.vol = 62; M.el.querySelector('.vol').style.setProperty('--vol', '62%');
    msgEl.textContent = 'Música a −18 dB: acompaña, no tapa.';
    await play(T, T + 2.5, 900);
    ws('edit');

    // 8 · color
    step('Color', 'Lumetri: contraste y piel cálida. El ojo va al sujeto.', 'L', 5);
    ws('color');
    await drag('lumetri', 'v1', live('v1')[1].start + 1, 'Lumetri · cálido', '#d9d6cc');
    await setT(live('v1')[1].start + 1.5, 200);
    live('v1').forEach(c => { c.fx = true; draw(c); });
    for (let i = 0; i < lum.length; i++) {
      lum[i].classList.add('on');
      $('b', lum[i]).style.setProperty('--v', LUM_OK[i][1] + '%'); $('em', lum[i]).textContent = LUM_OK[i][0];
      if (i === 3) pr.classList.add('is-graded');
      await wait(170);
    }
    await wait(1100);
    ws('edit');

    // 9 · revisar de punta a punta
    step('Revisar', 'La miro de punta a punta, como alguien que no me conoce.', 'Espacio', -1);
    await setT(0, 300);
    await play(0, end, end * 210);

    // 10 · exportar
    step('Exportar', `${name}.mp4 · H.264 · 1080×1920`, '⌘M', -1);
    expName.textContent = name + '.mp4';
    exp.classList.add('on');
    await tween(1900, k => { expBar.style.setProperty('--p', k); expPct.textContent = Math.round(k * 100) + '%'; }, k => k);
    await wait(350);
    exp.classList.remove('on');
    step('Listo', 'Exportado. Va para el cliente… y arranca la versión siguiente.', '✓', -1);
    await wait(1300);
    clips.forEach(c => c.el.classList.add('gone'));
    await wait(450);
  }

  // estado final quieto (reduced-motion): la edición ya armada
  function still() {
    reset('reel_v3_final_final');
    const parts = [[24, 2.6, 1.22], [0, 5.4, 1], [7.3, 7.6, 1.13], [16.5, 7.5, 1], [26.6, 3.4, 1.13]];
    let t = 0;
    parts.forEach(([i, d, z], k) => {
      const c = add({ track: 'v1', start: t, dur: d, in: i, label: k ? 'A001_C012.mov' : '★ hook', zoom: z, fx: true, kf: z > 1 });
      c.link = add({ track: 'a1', start: t, dur: d, in: i, label: 'A001_C012.mov', wave: VOICE });
      t += d;
    });
    add({ track: 'v2', start: 6.9, dur: 3, label: 'pantalla_B.mov', src: 'screen' });
    add({ track: 'v2', start: 13.9, dur: 3.4, label: 'producto_giro.mov', src: 'phone' });
    const sc = SCRIPTS[0], rest = (t - 2.9) / (sc.length - 1);
    sc.forEach((txt, i) => add({ track: 'c1', start: i ? 2.6 + (i - 1) * rest : 0.1, dur: i ? rest - 0.1 : 2.45, text: txt }));
    add({ track: 'a2', start: 0, dur: t, in: 0, label: 'musica_base.wav', wave: MUSIC, vol: 62 });
    pr.classList.add('is-graded'); setLum(LUM_OK, true);
    step('Listo', 'Una edición terminada: cortes, hook, B-roll, subtítulos, música y color.', '✓', -1);
    $$('.pc', pr).forEach(e => e.classList.remove('new'));
    T = 1.2; sizeCanvas(); paint();
  }

  if (!REDUCED) marker(0);
  photo.onload = () => { preview(REDUCED ? 'lumetri' : 'acam'); if (REDUCED) { sizeCanvas(); paint(); } };
  let started = false;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) return;
    if (!photo.src) photo.src = 'assets/danilo-photo.webp';
    sizeCanvas();
    if (REDUCED) { if (!started) { started = true; still(); } return; }
    if (!started) { started = true; setCursor(40, 60); (async () => { for (;;) await episode(); })(); }
    wake();
  }, { rootMargin: '0px 0px -10% 0px' }).observe(pr);
  onResize(() => { sizeCanvas(); if (REDUCED) paint(); });
}

// ─── 002 · EDITADO / CRUDO: el mismo proyecto antes y después de pasar por la timeline ───
// Aparece solo si existe assets/Fitness_antes.mp4. Cada versión corre con su propio tiempo:
// no son cuadro a cuadro, la gracia es ver cuánto se cortó y cómo cambia el ritmo.
function initAB() {
  const box = $('#ab'), media = box?.closest('.cc-media');
  if (!box || !media) return;
  const main = $('video[data-auto]', media), raw = $('.ab-raw', media), dur = $('#abDur');
  const btns = $$('button', box);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); raw.preload = 'metadata'; raw.load(); } }, { rootMargin: '100% 0px' }).observe(media);
  const label = () => { if (raw.duration && main.duration) dur.textContent = `crudo ${mmss(raw.duration)} → editado ${mmss(main.duration)}`; };
  raw.addEventListener('loadedmetadata', () => { box.hidden = false; label(); });
  main.addEventListener('loadedmetadata', label);
  raw.addEventListener('error', () => { box.hidden = true; }, true);
  function set(mode) {
    const isRaw = mode === 'raw';
    btns.forEach(b => b.setAttribute('aria-checked', String(b.dataset.ab === mode)));
    media.classList.toggle('is-raw', isRaw);
    if (isRaw) { main.pause(); raw.muted = main.muted; main.muted = true; raw.play().catch(() => {}); }
    else { raw.pause(); if (!raw.muted) { raw.muted = true; main.muted = false; } main.play().catch(() => {}); }
  }
  btns.forEach(b => b.addEventListener('click', () => set(b.dataset.ab)));
  raw.addEventListener('click', () => { raw.muted = !raw.muted; if (!raw.muted) muteAllExcept(raw); });
}

// ─── TU VISITA, EDITADA ───
// Mientras mirás, el sitio anota cuánto tiempo pasás en cada sección (solo en tu navegador,
// no se guarda ni se envía). Al final te la muestra como una timeline: tu propia retención.
function initVisit() {
  const box = $('#visit'), lane = $('#visitLane'), head = $('#visitH'), tcEl = $('#visitTc');
  if (!box) return;
  box.hidden = false;
  const CASES = /^00[1-5]/;
  const segs = [];                                          // [{ label, t }] en el orden en que los viste
  let lastAct = performance.now(), last = performance.now(), total = 0, inView = false;
  ['scroll', 'pointermove', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, () => { lastAct = performance.now(); }, { passive: true }));
  setInterval(() => {
    const now = performance.now(), dt = (now - last) / 1000; last = now;
    if (document.hidden || now - lastAct > 45000) return;   // pestaña oculta o nadie mirando: no cuenta
    const label = chapterLabel(currentChapter());
    const cur = segs[segs.length - 1];
    if (cur && cur.label === label) cur.t += dt; else segs.push({ label, t: dt });
    total += dt;
    if (inView) render();
  }, 250);
  const fmt = t => t < 60 ? `${Math.round(t)} s` : `${Math.floor(t / 60)} min ${Math.round(t % 60)} s`;
  const name = l => l.replace(/^00\d · /, '');
  let lastHead = '';
  function render() {
    tcEl.textContent = tc(total);
    // la timeline: cortes chicos (< 1 s) se funden con el anterior, como un ripple
    const clips = [];
    segs.forEach(s => { const c = clips[clips.length - 1]; if (c && (c.label === s.label || s.t < 1)) c.t += s.t; else clips.push({ ...s }); });
    const sums = {};
    segs.forEach(s => { sums[s.label] = (sums[s.label] || 0) + s.t; });
    const ranked = Object.entries(sums).filter(([l]) => l !== 'Contacto' && l !== 'Inicio').sort((a, b) => b[1] - a[1]);
    const top = ranked[0]?.[0];
    while (lane.children.length > clips.length) lane.lastChild.remove();
    clips.forEach((c, i) => {
      let el = lane.children[i];
      if (!el) { el = document.createElement('span'); el.innerHTML = '<b></b><i></i>'; lane.append(el); }
      el.style.setProperty('--w', c.t.toFixed(2));
      el.className = (CASES.test(c.label) ? 'case' : '') + (c.label === top ? ' top' : '') + (i === clips.length - 1 ? ' now' : '');
      el.firstChild.textContent = name(c.label); el.lastChild.textContent = fmt(c.t);
      el.title = `${c.label} · ${fmt(c.t)}`;
    });
    // el titular: dónde te quedaste y dónde te fuiste
    let h;
    const passed = ranked.filter(([, t]) => t >= 0.5);
    if (total < 25 || passed.length < 3) h = `Llegaste al final en <em>${fmt(total)}</em>. Casi lo mismo que tarda alguien en pasar de largo un reel.`;
    else {
      const low = passed[passed.length - 1];
      h = `Te quedaste <em>${fmt(ranked[0][1])}</em> en ${name(ranked[0][0])} y pasaste en <em>${fmt(low[1])}</em> por ${name(low[0])}.`;
    }
    if (h !== lastHead) { lastHead = h; head.innerHTML = h; }
  }
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) render(); }).observe(box);
}

// ─── Si cambiás de pestaña, la secuencia queda en pausa ───
function initTabTitle() {
  const t = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? '❚❚ En pausa · Danilo Hurwitz' : t; });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // los videos traen controles nativos para cuando no hay JS; con JS usamos los nuestros
  $$('video[controls]').forEach(v => { v.controls = false; });
  initKaraoke();
  initDevices();
  initReel();
  initMarquee();
  initAutoplay();
  initCut();
  initScrub();
  initPlayers();
  initRead();
  initSubs();
  initServices();
  initCounters();
  initCarousel();
  initSlide();
  initCalculator();
  initNavMeta();
  initKeys();
  initUpNext();
  initDock();
  initToolDock();
  initBA();
  initLocals();
  initReveal();
  initAnchors();
  initLightbox();
  initRise();
  initPremiere();
  initAB();
  initVisit();
  initTabTitle();

  const range = $('#calcRange');
  if (range) new MutationObserver(() => { range.classList.remove('bump'); void range.offsetWidth; range.classList.add('bump'); })
    .observe(range, { childList: true, characterData: true, subtree: true });

  runScroll();
});
