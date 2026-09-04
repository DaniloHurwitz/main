// ─── SERVICIO DE VOZ ──────────────────────────────────────────────────────────
// Abstracción sobre Web Speech API. Para cambiar de proveedor, solo reemplazar
// las implementaciones de transcribe() y speak().

const SpeechService = (() => {
  let recognition = null;
  let isListening = false;

  function isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function transcribe({ onResult, onEnd, onError }) {
    if (!isSupported()) { onError("NO_SUPPORT"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = e => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => { isListening = false; if (onEnd) onEnd(); };
    recognition.onerror = e => { isListening = false; onError(e.error); };
    recognition.start();
    isListening = true;
  }

  function stopTranscription() {
    if (recognition && isListening) { recognition.stop(); isListening = false; }
  }

  function speak(text, { onEnd, onStart } = {}) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-AR";
    utt.rate = 0.93;
    utt.pitch = 1.0;
    // Intentar voz en español
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith("es") && !v.name.toLowerCase().includes("google"))
                 || voices.find(v => v.lang.startsWith("es"));
    if (esVoice) utt.voice = esVoice;
    if (onStart) utt.onstart = onStart;
    if (onEnd) utt.onend = onEnd;
    utt.onerror = () => { if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utt);
  }

  function cancelSpeech() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function getIsListening() { return isListening; }

  return { isSupported, transcribe, stopTranscription, speak, cancelSpeech, getIsListening };
})();
