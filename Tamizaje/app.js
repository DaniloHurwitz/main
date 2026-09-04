// ─── APP — ORQUESTADOR PRINCIPAL ─────────────────────────────────────────────
// Responsabilidad: estados globales, eventos del DOM, flujo de la simulación.

(function () {
  // ── Estado global ──────────────────────────────────────────────────────────
  let simState = null;
  let caseData = null;
  let conversationHistory = [];
  let timerInterval = null;
  let timeLeft = 600;
  let isProcessing = false;

  const SCENES_BY_SEX = {
    F: [
      "Una joven entra al consultorio. Cierra la puerta con cuidado y se sienta frente al médico sin decir nada todavía.",
      "Entra una paciente. Evita el contacto visual al principio y espera en silencio a que el médico la invite a hablar.",
      "Una mujer joven empuja la puerta y entra. Se sienta y saluda apenas con un gesto. Parece contenida."
    ],
    M: [
      "Un hombre joven entra al consultorio y se sienta frente al médico. Asiente brevemente a modo de saludo.",
      "Entra un paciente masculino. Cierra la puerta detrás suyo y ocupa la silla. Espera.",
      "Un joven entra, mira al médico un momento antes de sentarse. Saluda con un movimiento de cabeza."
    ]
  };

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    UI.renderCaseList(CASES, startSimulation);
    bindHomeEvents();
    bindConsultEvents();
    bindDiagnosisEvents();
    bindReflectionEvents();
    bindEvalEvents();
    bindStudyModal();
    UI.showScreen("home");
  }

  // ── Home events ────────────────────────────────────────────────────────────
  function bindHomeEvents() {
    document.getElementById("btn-random").addEventListener("click", () => {
      const keys = Object.keys(CASES);
      startSimulation(keys[Math.floor(Math.random() * keys.length)]);
    });
  }

  // ── Start simulation ───────────────────────────────────────────────────────
  function startSimulation(caseId) {
    caseData = CASES[caseId];
    if (!caseData) return;

    simState = SimulationEngine.createState(caseData);
    conversationHistory = [];
    timeLeft = 600;
    isProcessing = false;

    // Reset UI fields
    document.getElementById("transcript-area").innerHTML = "";
    document.getElementById("input-field").value = "";
    document.getElementById("status-bar").innerHTML = "";

    // Sidebar header
    document.getElementById("sidebar-chief").textContent = caseData.patient.chief_complaint;
    document.getElementById("sidebar-context").textContent = caseData.patient.context;
    UI.updateSidebar(simState, caseData);

    // Timer
    UI.updateTimer(timeLeft);

    // Topbar meta (topic only, no spoilers)
    document.getElementById("topbar-topic").textContent = caseData.topic_label + " · " + caseData.difficulty;

    UI.showScreen("consultation");
    startTimer();

    // Escena de apertura aleatoria
    const scenes = caseData.hidden_state.opening_scene_variants
      || SCENES_BY_SEX[caseData.patient.sex]
      || SCENES_BY_SEX.M;
    const scene = scenes[Math.floor(Math.random() * scenes.length)];

    const sceneTurn = { type: "system", text: scene };
    simState.transcript.push(sceneTurn);
    UI.appendTurn(sceneTurn);
  }

  // ── Timer ──────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      UI.updateTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        goToDiagnosis();
      }
    }, 1000);
  }

  function stopTimer() { clearInterval(timerInterval); }

  // ── Consultation events ────────────────────────────────────────────────────
  function bindConsultEvents() {
    const field = document.getElementById("input-field");
    const btnSend = document.getElementById("btn-send");
    const btnMic = document.getElementById("btn-mic");
    const btnEnd = document.getElementById("btn-end");

    field.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(field.value); }
    });

    btnSend.addEventListener("click", () => sendMessage(field.value));

    btnMic.addEventListener("click", () => {
      if (!SpeechService.isSupported()) {
        UI.setStatus("error", "Tu navegador no soporta reconocimiento de voz.");
        return;
      }
      if (SpeechService.getIsListening()) {
        SpeechService.stopTranscription();
        btnMic.classList.remove("listening");
        UI.setStatus(null);
        return;
      }
      SpeechService.cancelSpeech();
      btnMic.classList.add("listening");
      UI.setStatus("listening", "Escuchando...");
      SpeechService.transcribe({
        onResult: text => {
          btnMic.classList.remove("listening");
          UI.setStatus(null);
          field.value = text;
          sendMessage(text);
        },
        onEnd: () => { btnMic.classList.remove("listening"); UI.setStatus(null); },
        onError: err => {
          btnMic.classList.remove("listening");
          UI.setStatus("error", err === "NO_SUPPORT" ? "Sin soporte de voz." : "Error de micrófono. Usá el texto.");
        }
      });
    });

    btnEnd.addEventListener("click", () => {
      stopTimer();
      SpeechService.cancelSpeech();
      goToDiagnosis();
    });
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (!text || !text.trim() || isProcessing) return;
    text = text.trim();
    document.getElementById("input-field").value = "";
    isProcessing = true;

    // Agregar turno del estudiante
    const studentTurn = { type: "student", text };
    simState.transcript.push(studentTurn);
    UI.appendTurn(studentTurn);

    // Procesar en el motor
    const { newState, examResults, studyResults } = SimulationEngine.processStudentTurn(simState, caseData, text);
    simState = newState;

    // Mostrar hallazgos de examen físico (antes de la respuesta del paciente)
    examResults.forEach(er => {
      const examTurn = { type: "exam", examId: er.examId, text: er.result };
      simState.transcript.push(examTurn);
      UI.appendTurn(examTurn);
    });

    // Mostrar resultados de estudios
    studyResults.forEach(s => {
      const studyTurn = { type: "study", label: s.label, text: s.result };
      simState.transcript.push(studyTurn);
      UI.appendTurn(studyTurn);
    });

    // Actualizar sidebar
    UI.updateSidebar(simState, caseData);

    // Respuesta del paciente via LLM
    UI.showTypingIndicator();
    UI.setStatus("processing", "El paciente está pensando...");

    try {
      conversationHistory.push({ role: "user", content: text });
      const revealed = SimulationEngine.getRevealedData(simState);
      const response = await ApiService.getPatientResponse(
        caseData, simState.trustLevel, revealed,
        conversationHistory.slice(-12)
      );
      conversationHistory.push({ role: "assistant", content: response });

      UI.removeTypingIndicator();
      UI.setStatus(null);

      const patientTurn = { type: "patient", text: response };
      simState.transcript.push(patientTurn);
      UI.appendTurn(patientTurn);

      SpeechService.speak(response, {
        onStart: () => UI.setStatus("speaking", "El paciente está hablando..."),
        onEnd: () => UI.setStatus(null)
      });

    } catch (err) {
      UI.removeTypingIndicator();
      UI.setStatus("error", "Error de conexión. Verificá tu acceso a internet.");
    } finally {
      isProcessing = false;
    }
  }

  // ── Study modal ────────────────────────────────────────────────────────────
  function bindStudyModal() {
    document.getElementById("btn-study").addEventListener("click", () => {
      UI.openStudyModal(caseData.hidden_state.studies, simState.studiesRequested, (study) => {
        sendMessage(`Solicito ${study.label}`);
      });
    });

    document.getElementById("modal-close").addEventListener("click", UI.closeStudyModal);

    document.getElementById("modal-custom-send").addEventListener("click", () => {
      const val = document.getElementById("modal-custom-input").value.trim();
      if (val) { UI.closeStudyModal(); sendMessage(`Solicito ${val}`); document.getElementById("modal-custom-input").value = ""; }
    });

    document.getElementById("modal-custom-input").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("modal-custom-send").click();
    });

    document.getElementById("study-modal").addEventListener("click", e => {
      if (e.target === document.getElementById("study-modal")) UI.closeStudyModal();
    });
  }

  // ── Diagnosis screen ───────────────────────────────────────────────────────
  function goToDiagnosis() {
    stopTimer();
    SpeechService.cancelSpeech();
    SpeechService.stopTranscription();
    UI.showScreen("diagnosis");
    document.getElementById("diag-input").value = "";
    document.getElementById("diff-input").value = "";
    document.getElementById("studies-input").value = "";
    document.getElementById("diag-error").textContent = "";
  }

  function bindDiagnosisEvents() {
    document.getElementById("btn-diag-submit").addEventListener("click", () => {
      const diag = document.getElementById("diag-input").value.trim();
      if (!diag) { document.getElementById("diag-error").textContent = "Ingresá un diagnóstico presuntivo."; return; }
      simState.finalDiagnosis = diag;
      simState.finalDifferentials = document.getElementById("diff-input").value.trim();
      simState.finalStudiesText = document.getElementById("studies-input").value.trim();
      UI.showScreen("reflection");
      document.getElementById("reflection-textarea").value = "";
      document.getElementById("reflection-error").textContent = "";
    });
  }

  // ── Reflection → Evaluation ────────────────────────────────────────────────
  function bindReflectionEvents() {
    document.getElementById("btn-reflection-submit").addEventListener("click", async () => {
      const reflection = document.getElementById("reflection-textarea").value.trim();
      const errEl = document.getElementById("reflection-error");
      errEl.textContent = "";

      const btn = document.getElementById("btn-reflection-submit");
      btn.disabled = true;
      btn.textContent = "Generando evaluación...";

      try {
        const evaluation = await ApiService.getEvaluation(caseData, simState);
        const debriefing = await ApiService.getDebriefing(caseData, evaluation, reflection);
        UI.renderEvaluation(evaluation, debriefing, caseData, simState);
        UI.showScreen("evaluation");
      } catch (err) {
        errEl.textContent = "Error al generar la evaluación. Verificá tu conexión.";
      } finally {
        btn.disabled = false;
        btn.textContent = "Ver evaluación";
      }
    });
  }

  // ── Eval screen ────────────────────────────────────────────────────────────
  function bindEvalEvents() {
    document.getElementById("btn-repeat").addEventListener("click", () => startSimulation(caseData.id));
    document.getElementById("btn-new-case").addEventListener("click", () => UI.showScreen("home"));
    document.getElementById("btn-home-from-diag").addEventListener("click", () => UI.showScreen("home"));
    document.getElementById("btn-home-from-reflection").addEventListener("click", () => UI.showScreen("home"));
  }

  // ── Run ────────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);
})();
