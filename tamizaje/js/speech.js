// ─── SERVICIO DE VOZ ──────────────────────────────────────────────────────────
// STT : Web Speech API con resultados intermedios (transcripción en tiempo real)
//       El texto aparece letra a letra mientras se habla — el usuario controla
//       cuándo enviar (Enter o botón). Sin auto-envío.
// TTS : Web Speech API (instantánea) con selección inteligente de voz por género

const SpeechService = (() => {
  let recognition     = null;
  let continuousMode  = false;
  let isListening     = false;
  let isSpeaking      = false;
  let currentUtts     = [];
  let silenceTimer    = null;

  // Callbacks
  let onInterimCb  = null;  // texto parcial mientras habla
  let onFinalCb    = null;  // texto final de cada frase
  let onErrorCb    = null;

  // Cache de voces
  let cachedVoiceF = null;
  let cachedVoiceM = null;

  function getApiKey() { return localStorage.getItem("gemini_api_key") || ""; }

  // ── Selección de voz por género ─────────────────────────────────────────────
  function pickVoice(isFemale) {
    const voices = window.speechSynthesis?.getVoices() || [];
    const es = voices.filter(v => v.lang.startsWith("es"));
    if (!es.length) return null;

    // 1. Nombre explícito de género
    const femaleNames = /\b(sabina|conchita|marisol|paula|lucia|elena|rosa|maria|camila|monica|pilar|lupe|female|mujer|woman)\b/i;
    const maleNames   = /\b(jorge|diego|carlos|miguel|juan|alberto|ramon|pablo|andres|male|hombre|man)\b/i;
    const byName = isFemale
      ? es.find(v => femaleNames.test(v.name))
      : es.find(v => maleNames.test(v.name));
    if (byName) return byName;

    // 2. Microsoft voices en español (F suele ser primera)
    const ms = es.filter(v => v.name.includes("Microsoft"));
    if (ms.length >= 2) return isFemale ? ms[0] : ms[ms.length - 1];
    if (ms.length === 1) return ms[0];

    // 3. Google voices en español
    const goog = es.filter(v => v.name.toLowerCase().includes("google"));
    if (goog.length >= 2) return isFemale ? goog[0] : goog[goog.length - 1];
    if (goog.length === 1) return goog[0];

    // 4. Voz local
    return es.find(v => v.localService) || es[0] || null;
  }

  function getVoice(patientSex) {
    const f = patientSex === "F";
    if (f) { if (!cachedVoiceF) cachedVoiceF = pickVoice(true);  return cachedVoiceF; }
    else   { if (!cachedVoiceM) cachedVoiceM = pickVoice(false); return cachedVoiceM; }
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { cachedVoiceF = null; cachedVoiceM = null; };
  }

  // ── STT ─────────────────────────────────────────────────────────────────────
  function isSTTSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Modo llamada: escucha continua con resultados intermedios
  // onInterim(text) — llamado con cada actualización parcial mientras habla
  // onFinal(text)   — llamado al completar cada frase (para acumular en el campo)
  // onError(err)    — errores
  function startContinuous({ onInterim, onFinal, onError }) {
    if (!isSTTSupported()) { onError("NO_SUPPORT"); return; }
    continuousMode = true;
    onInterimCb = onInterim;
    onFinalCb   = onFinal;
    onErrorCb   = onError;
    _startInner();
  }

  function _makeRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r  = new SR();
    r.lang            = "es-AR";
    r.continuous      = true;
    r.interimResults  = true;   // ← clave: resultados parciales en tiempo real
    r.maxAlternatives = 1;
    return r;
  }

  let _permissionGranted = false;  // evitar loop mientras el navegador pide permiso
  let _waitingForPermission = false;

  function _startInner() {
    if (!continuousMode) return;
    if (_waitingForPermission) return;  // ya esperando — no reintentar
    clearTimeout(silenceTimer);
    try {
      recognition = _makeRecognition();
      isListening = true;

      recognition.onresult = e => {
        _permissionGranted = true;
        _waitingForPermission = false;
        if (isSpeaking) cancelSpeech();

        let interim = "";
        let finalChunk = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalChunk += t;
          else interim += t;
        }
        if (interim && onInterimCb) onInterimCb(interim);
        if (finalChunk.trim() && onFinalCb) onFinalCb(finalChunk.trim());
      };

      recognition.onerror = e => {
        _waitingForPermission = false;
        if (e.error === "not-allowed") {
          // Permiso denegado definitivamente
          continuousMode = false;
          _permissionGranted = false;
          if (onErrorCb) onErrorCb("not-allowed");
          return;
        }
        if (e.error === "service-not-allowed") {
          // Navegador esperando permiso — no reintentar en loop
          _waitingForPermission = true;
          return;
        }
        // no-speech u otros errores transitorios: reiniciar
        if (e.error !== "aborted") _scheduleRestart();
      };

      recognition.onstart = () => {
        _permissionGranted = true;
        _waitingForPermission = false;
      };

      recognition.onend = () => {
        isListening = false;
        _waitingForPermission = false;
        if (continuousMode && _permissionGranted) _scheduleRestart();
      };

      recognition.start();
    } catch(err) {
      _waitingForPermission = false;
      _scheduleRestart();
    }
  }

  function _scheduleRestart() {
    if (!continuousMode || _waitingForPermission) return;
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => { if (continuousMode && !_waitingForPermission) _startInner(); }, 400);
  }

  function stopContinuous() {
    continuousMode = false;
    onInterimCb = null;
    onFinalCb   = null;
    onErrorCb   = null;
    clearTimeout(silenceTimer);
    if (recognition) { try { recognition.stop(); } catch {} recognition = null; }
    isListening = false;
  }

  // Modo puntual (compatibilidad)
  function transcribe({ onResult, onEnd, onError }) {
    if (!isSTTSupported()) { onError("NO_SUPPORT"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = e => {
      const text = e.results[0]?.[0]?.transcript || "";
      if (text.trim()) onResult(text.trim());
    };
    recognition.onend   = () => { isListening = false; if (onEnd) onEnd(); };
    recognition.onerror = e => { isListening = false; onError(e.error); };
    recognition.start();
    isListening = true;
  }

  function stopTranscription() {
    stopContinuous();
    if (recognition) { try { recognition.stop(); } catch {} recognition = null; }
    isListening = false;
  }

  // ── TTS ─────────────────────────────────────────────────────────────────────
  function speak(text, patientSex, { onStart, onEnd } = {}) {
    if (!text) { if (onEnd) onEnd(); return; }
    cancelSpeech();
    if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }

    const voice    = getVoice(patientSex);
    const isFemale = patientSex === "F";
    const chunks   = splitChunks(text, 220);
    let idx        = 0;
    isSpeaking     = true;
    currentUtts    = [];

    function next() {
      if (!isSpeaking || idx >= chunks.length) {
        isSpeaking = false;
        currentUtts = [];
        if (onEnd) onEnd();
        return;
      }
      const utt    = new SpeechSynthesisUtterance(chunks[idx]);
      utt.lang     = "es-AR";
      utt.rate     = isFemale ? 1.1 : 1.05;
      utt.pitch    = isFemale ? 1.3 : 0.82;
      utt.volume   = 1.0;
      if (voice) utt.voice = voice;
      if (idx === 0 && onStart) utt.onstart = onStart;
      utt.onend    = () => { idx++; next(); };
      utt.onerror  = e => {
        if (e.error !== "interrupted" && e.error !== "canceled") { idx++; next(); }
      };
      currentUtts.push(utt);
      window.speechSynthesis.speak(utt);
    }
    setTimeout(next, 0);
  }

  function cancelSpeech() {
    isSpeaking = false;
    currentUtts = [];
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function splitChunks(text, max) {
    if (text.length <= max) return [text];
    const chunks = [];
    const sents  = text.match(/[^.!?]+[.!?]*/g) || [text];
    let cur = "";
    for (const s of sents) {
      if ((cur + s).length > max && cur) { chunks.push(cur.trim()); cur = s; }
      else cur += s;
    }
    if (cur.trim()) chunks.push(cur.trim());
    return chunks;
  }

  function getIsListening()   { return isListening; }
  function getIsSpeaking()    { return isSpeaking; }
  function isContinuousMode() { return continuousMode; }

  return {
    isSTTSupported,
    startContinuous, stopContinuous,
    transcribe, stopTranscription,
    speak, cancelSpeech,
    getIsListening, getIsSpeaking, isContinuousMode,
  };
})();
