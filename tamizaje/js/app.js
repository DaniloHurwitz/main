// ─── APP  -  ORQUESTADOR PRINCIPAL ─────────────────────────────────────────────

(function () {
  let simState = null;
  let caseData = null;
  let conversationHistory = [];
  let timerInterval = null;
  let timeLeft = 600;
  let isProcessing = false;
  let consultMode = "chat";        // "call" | "chat"
  let accumulatedText = "";        // texto acumulado en modo llamada
  let simMode = "practice";        // "practice" | "exam"
  let endlessMode = false;         // modo interminable activo
  let endlessScore = 0;            // racha actual
  let pendingCaseId = null;        // caso esperando selección de modo

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    UI.renderCaseList(CASES, (caseId) => {
      if (!checkKey()) return;
      endlessMode = false;
      openCaseModeModal(caseId);
    });
    bindHomeEvents();
    bindConsultEvents();
    bindDiagnosisEvents();
    bindReflectionEvents();
    bindEvalEvents();
    bindStudyModal();
    bindModeOverlay();
    bindExamPanel();
    bindCaseModeModal();
    UI.showScreen("home");
  }

  // API key eliminada — las keys viven en el Cloudflare Worker

  // ── Home ───────────────────────────────────────────────────────────────────
  function bindHomeEvents() {
    // Al azar
    document.getElementById("btn-random").addEventListener("click", () => {
      if (!checkKey()) return;
      const keys = Object.keys(CASES);
      pendingCaseId = keys[Math.floor(Math.random() * keys.length)];
      endlessMode = false;
      openCaseModeModal(pendingCaseId);
    });

    // Modo interminable
    document.getElementById("btn-endless").addEventListener("click", () => {
      if (!checkKey()) return;
      endlessMode = true;
      endlessScore = 0;
      simMode = "exam";
      const keys = Object.keys(CASES);
      pendingCaseId = keys[Math.floor(Math.random() * keys.length)];
      startSimulation(pendingCaseId);
    });

    // Parciales colapsables en mobile
    document.addEventListener("click", e => {
      const label = e.target.closest(".case-list-group-label");
      if (!label) return;
      if (window.innerWidth > 768) return;
      label.closest(".case-list-group")?.classList.toggle("collapsed");
    });

    // Sidebar expandible en mobile
    document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
      if (window.innerWidth > 768) return;
      document.getElementById("sidebar")?.classList.toggle("expanded");
    });
  }

  // ── Modal de modo por caso ────────────────────────────────────────────────
  function openCaseModeModal(caseId) {
    pendingCaseId = caseId;
    const c = CASES[caseId];
    if (!c) return;
    const topicEl = document.getElementById("case-mode-topic");
    if (topicEl) topicEl.textContent = c.topic_label + " · " + c.difficulty;
    document.getElementById("case-mode-overlay")?.classList.add("open");
  }

  function bindCaseModeModal() {
    document.getElementById("btn-mode-practice")?.addEventListener("click", () => {
      simMode = "practice";
      document.getElementById("case-mode-overlay")?.classList.remove("open");
      startSimulation(pendingCaseId);
    });
    document.getElementById("btn-mode-exam")?.addEventListener("click", () => {
      simMode = "exam";
      document.getElementById("case-mode-overlay")?.classList.remove("open");
      startSimulation(pendingCaseId);
    });
    document.getElementById("btn-case-mode-cancel")?.addEventListener("click", () => {
      document.getElementById("case-mode-overlay")?.classList.remove("open");
      pendingCaseId = null;
    });
    document.getElementById("case-mode-overlay")?.addEventListener("click", e => {
      if (e.target === document.getElementById("case-mode-overlay")) {
        document.getElementById("case-mode-overlay").classList.remove("open");
        pendingCaseId = null;
      }
    });
  }

  function checkKey() { return true; }

  // ── Start simulation ───────────────────────────────────────────────────────
  function startSimulation(caseId) {
    if (!checkKey()) return;
    caseData = CASES[caseId];
    if (!caseData) return;

    simState = SimulationEngine.createState(caseData);
    conversationHistory = [];
    timeLeft = 600;
    isProcessing = false;

    document.getElementById("transcript-area").innerHTML = "";
    document.getElementById("input-field").value = "";
    document.getElementById("status-bar").innerHTML = "";

    document.getElementById("sidebar-chief").textContent   = caseData.patient.chief_complaint;
    document.getElementById("sidebar-context").textContent = caseData.patient.context;
    document.getElementById("topbar-topic").textContent    = caseData.topic_label + " · " + caseData.difficulty;

    // Cargar imagen del paciente según visual_id del caso
    const img = document.getElementById("patient-img");
    if (img && caseData.patient.visual_id) {
      img.classList.remove("loaded");
      img.src = "images/" + caseData.patient.visual_id + ".png";
      img.onload = () => img.classList.add("loaded");
      img.onerror = () => { img.src = ""; };
    }

    // Aplicar configuración de modo
    timeLeft = (simMode === "practice") ? 99999 : 600;  // práctica = sin límite real

    UI.updateSidebar(simState, caseData, simMode);
    UI.updateTimer(simMode === "practice" ? null : timeLeft);
    UI.showScreen("consultation");

    // Badge de modo en topbar
    const existBadge = document.getElementById("sim-mode-badge");
    if (existBadge) existBadge.remove();
    const badge = document.createElement("span");
    badge.id = "sim-mode-badge";
    badge.className = "sim-mode-badge " + (endlessMode ? "endless" : simMode);
    badge.textContent = endlessMode ? `♾ Racha: ${endlessScore}` : simMode === "practice" ? "Práctica" : "Examen";
    document.getElementById("topbar-topic").appendChild(badge);

    if (simMode === "exam" || endlessMode) startTimer();

    // Mostrar overlay de selección de modo
    const modeOverlay = document.getElementById("mode-overlay");
    if (modeOverlay) modeOverlay.classList.add("open");

    // Mostrar botón de examen físico solo si el caso tiene panel interactivo
    const btnExamPanel = document.getElementById("btn-exam-panel");
    if (btnExamPanel) {
      btnExamPanel.style.display = caseData.hidden_state.exam_panel?.length ? "" : "none";
    }

    // Escena de entrada aleatoria
    const variants = caseData.hidden_state.opening_scene_variants;
    const scene = variants[Math.floor(Math.random() * variants.length)];
    const turn = { type: "system", text: scene };
    simState.transcript.push(turn);
    UI.appendTurn(turn);
  }

  // ── Timer ──────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      UI.updateTimer(timeLeft);
      if (timeLeft <= 0) { clearInterval(timerInterval); goToDiagnosis(); }
    }, 1000);
  }

  function stopTimer() { clearInterval(timerInterval); }

  // ── Panel de examen físico interactivo ───────────────────────────────────
  function bindExamPanel() {
    const overlay   = document.getElementById("exam-panel-overlay");
    const btnOpen   = document.getElementById("btn-exam-panel");
    const btnClose  = document.getElementById("btn-exam-panel-close");

    btnOpen?.addEventListener("click", openExamPanel);
    btnClose?.addEventListener("click", () => overlay?.classList.remove("open"));

    // Cerrar al hacer clic en el fondo
    overlay?.addEventListener("click", e => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  }

  function openExamPanel() {
    const overlay = document.getElementById("exam-panel-overlay");
    if (!overlay || !caseData?.hidden_state.exam_panel) return;

    // Renderizar el panel con el estado actual
    UI.renderExamPanel(caseData, simState, handleExamOptionClick);
    overlay.classList.add("open");
  }

  async function handleExamOptionClick(option) {
    document.getElementById("exam-panel-overlay")?.classList.remove("open");

    // Procesar en el motor
    const { newState, finding } = SimulationEngine.performExamOption(simState, caseData, option);
    simState = newState;

    // Mostrar burbuja en el transcript
    UI.appendExamPanelResult(option, finding);

    // Registrar en transcript (solo una vez, marcado como panel)
    simState.transcript.push({
      type:       "exam_panel",
      examId:     option.id,
      text:       finding || "(sin hallazgo registrado)",
      pertinence: option.pertinence,
      points:     option.points,
    });

    // Agregar al historial del LLM para que sepa que se realizó el examen
    conversationHistory.push({
      role:    "user",
      content: `[EXAMEN FÍSICO: ${option.label}] ${finding || "sin hallazgo"}`,
    });

    // No llamar al LLM — el paciente no responde a exámenes físicos
    UI.updateSidebar(simState, caseData, simMode);
  }

  // ── Overlay de selección de modo ─────────────────────────────────────────
  function bindModeOverlay() {
    document.getElementById("btn-mode-call")?.addEventListener("click", () => {
      setConsultMode("call");
      document.getElementById("mode-overlay")?.classList.remove("open");
    });
    document.getElementById("btn-mode-chat")?.addEventListener("click", () => {
      setConsultMode("chat");
      document.getElementById("mode-overlay")?.classList.remove("open");
    });
  }

  function setConsultMode(mode) {
    consultMode = mode;
    const hint  = document.getElementById("input-hint");
    const btnMic = document.getElementById("btn-mic");

    if (mode === "call") {
      // Arrancar escucha continua
      startContinuousListening();
      if (hint) hint.textContent = "Modo llamada · Hablá cuando quieras  -  Enter o Enviar para mandar";
      btnMic?.classList.remove("hidden");
    } else {
      // Detener mic
      stopContinuousListening();
      if (hint) hint.textContent = 'Modo texto · Ejemplos: "¿Cuándo empezó?" · "Quiero examinar la lesión"';
      btnMic?.classList.remove("listening");
    }
  }

  // ── Modo llamada  -  escucha continua con interim results ──────────────────
  function startContinuousListening() {
    if (!SpeechService.isSTTSupported()) return;
    const btnMic = document.getElementById("btn-mic");
    const field  = document.getElementById("input-field");
    btnMic?.classList.add("listening");
    accumulatedText = field?.value || "";

    SpeechService.startContinuous({
      onInterim: interim => {
        // Mostrar texto parcial en gris mientras habla
        if (!field) return;
        field.value = accumulatedText + interim;
        field.classList.add("interim-typing");
      },
      onFinal: finalChunk => {
        // Acumular frase completa en el campo (sin enviar)
        accumulatedText = (accumulatedText + " " + finalChunk).trim();
        if (field) {
          field.value = accumulatedText;
          field.classList.remove("interim-typing");
        }
        // Mostrar indicador de voz activa
        UI.setStatus("listening", "Escuchando... (Enter o Enviar para mandar)");
      },
      onError: err => {
        btnMic?.classList.remove("listening");
        if (err === "not-allowed") {
          UI.setStatus("error", "Permiso de micrófono denegado. Usá el texto.");
          consultMode = "chat";
        }
      }
    });

    UI.setStatus("listening", "Escuchando...");
  }

  function stopContinuousListening() {
    SpeechService.stopContinuous();
    const btnMic = document.getElementById("btn-mic");
    btnMic?.classList.remove("listening");
    UI.setStatus(null);
    accumulatedText = "";
  }

  // ── Consultation ───────────────────────────────────────────────────────────
  function bindConsultEvents() {
    const field   = document.getElementById("input-field");
    const btnSend = document.getElementById("btn-send");
    const btnMic  = document.getElementById("btn-mic");
    const btnEnd  = document.getElementById("btn-end");

    field.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // Usar el valor actual del campo (puede tener texto acumulado de voz)
        const textToSend = field.value.trim();
        if (textToSend) sendMessage(textToSend);
      }
    });

    btnSend.addEventListener("click", () => {
      const textToSend = field.value.trim();
      if (textToSend) sendMessage(textToSend);
    });

    // Mic = toggle entre escuchar/silenciar en modo llamada
    btnMic.addEventListener("click", () => {
      if (!SpeechService.isSTTSupported()) {
        UI.setStatus("error", "Tu navegador no soporta reconocimiento de voz.");
        return;
      }
      if (SpeechService.isContinuousMode()) {
        SpeechService.stopContinuous();
        btnMic.classList.remove("listening");
        UI.setStatus("processing", "Micrófono silenciado  -  clic para reactivar");
      } else {
        SpeechService.cancelSpeech();
        startContinuousListening();
      }
    });

    btnEnd.addEventListener("click", () => {
      stopTimer();
      stopContinuousListening();
      SpeechService.cancelSpeech();
      goToDiagnosis();
    });
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function sendMessage(text, opts = {}) {
    if (!text || !text.trim() || isProcessing) return;
    text = text.trim();
    if (!opts.silent) {
      const field = document.getElementById("input-field");
      if (field) { field.value = ""; field.classList.remove("interim-typing"); }
      accumulatedText = "";
    }
    isProcessing = true;

    // Si es una orden médica, mostrar burbuja especial de orden
    if (opts.orderSummary) {
      const orderTurn = { type: "prescription", text: opts.orderSummary, fullStudies: opts.fullStudies };
      simState.transcript.push(orderTurn);
      UI.appendTurn(orderTurn);
    } else {
      const studentTurn = { type: "student", text };
      simState.transcript.push(studentTurn);
      UI.appendTurn(studentTurn);
    }

    // Órdenes médicas (silent=true): no correr processStudentTurn
    // porque los estudios ya se registraron en submitPrescription
    let examResults = [], newStudies = [];
    if (!opts.silent) {
      const result = SimulationEngine.processStudentTurn(simState, caseData, text);
      simState      = result.newState;
      examResults   = result.examResults || [];
      newStudies    = result.newStudies  || [];

      // Exámenes físicos detectados por texto (no del panel — esos ya tienen su burbuja)
      examResults.forEach(er => {
        // Solo agregar si no fue ya procesado por el panel interactivo
        const alreadyInPanel = simState.examPanelUsed?.includes(er.examId);
        if (!alreadyInPanel) {
          const t = { type: "exam", examId: er.examId, text: er.result };
          simState.transcript.push(t);
          UI.appendTurn(t);
        }
      });

      // Estudios: anotar como pendientes
      newStudies.forEach(s => {
        const t = { type: "study-pending", label: s.label, text: `${s.label} — resultado disponible al finalizar la consulta.` };
        simState.transcript.push(t);
        UI.appendTurn(t);
      });
    }

    UI.updateSidebar(simState, caseData, simMode);

    // Si fue solo solicitud de estudios por texto, no llamar al LLM
    const isStudyOnlyTurn = !opts.silent && newStudies.length > 0 && examResults.length === 0 &&
      /^(solicito|pido|quiero|necesito|orden[oa]|pedí|me gustaría)\s/i.test(text) &&
      text.length < 120;

    // Si es una orden médica (silent), tampoco llamar al LLM
    if (isStudyOnlyTurn || opts.silent) {
      isProcessing = false;
      return;
    }
    UI.showTypingIndicator();
    UI.setStatus("processing", "El paciente está pensando...");

    try {
      conversationHistory.push({ role: "user", content: text });
      const revealed  = SimulationEngine.getRevealedData(simState);
      const response  = await ApiService.getPatientResponse(
        caseData, simState.trustLevel, revealed,
        conversationHistory.slice(-14)
      );
      conversationHistory.push({ role: "assistant", content: response });

      UI.removeTypingIndicator();
      UI.setStatus(null);

      // Detectar señal de cierre de consulta
      const consultaCerrada = response.startsWith("[FIN_CONSULTA]");
      const patientText = response.replace("[FIN_CONSULTA]", "").trim();

      const patientTurn = { type: "patient", text: patientText };
      simState.transcript.push(patientTurn);
      UI.appendTurn(patientTurn);

      if (consultaCerrada) {
        // El paciente cerró la consulta  -  esperar que termine el audio y luego ir al diagnóstico
        SpeechService.speak(patientText, caseData.patient.sex, {
          onStart: () => UI.setStatus("speaking", "El paciente está hablando..."),
          onEnd:   () => {
            UI.setStatus(null);
            setTimeout(() => goToDiagnosis(), 800);
          }
        });
      } else {
        // TTS del paciente  -  con voz del género correcto
        SpeechService.speak(patientText, caseData.patient.sex, {
          onStart: () => UI.setStatus("speaking", "El paciente está hablando..."),
          onEnd:   () => UI.setStatus(null)
        });
      }

    } catch (err) {
      UI.removeTypingIndicator();
      UI.setStatus("error", "Error de conexión: " + err.message);
    } finally {
      isProcessing = false;
    }
  }

  // ── Orden médica (prescripción) ───────────────────────────────────────────
  let rxOrderNum = 1;

  function generateDNI(caseData) {
    // DNI coherente con la edad del paciente
    // Argentina: DNI 1-10M nacidos antes 1990, 10M-40M post 1990
    // Extraemos edad del prompt del paciente
    const prompt = caseData.patient_persona_prompt || "";
    const ageMatch = prompt.match(/(\d{1,2}) años/);
    const age = ageMatch ? parseInt(ageMatch[1]) : 35;
    const birthYear = new Date().getFullYear() - age;
    let base;
    if (birthYear < 1970)       base = Math.floor(Math.random() * 5_000_000) + 1_000_000;
    else if (birthYear < 1985)  base = Math.floor(Math.random() * 8_000_000) + 8_000_000;
    else if (birthYear < 1995)  base = Math.floor(Math.random() * 8_000_000) + 18_000_000;
    else if (birthYear < 2005)  base = Math.floor(Math.random() * 8_000_000) + 28_000_000;
    else                         base = Math.floor(Math.random() * 5_000_000) + 40_000_000;
    return base.toLocaleString("es-AR");
  }

  function generatePatientName(caseData) {
    const femaleNames = ["García Valentina","López Camila","Fernández Lucía","Martínez Sofía","González Martina","Rodríguez Agustina","Pérez Florencia","Sánchez Valeria","Romero Celeste","Torres Julieta"];
    const maleNames   = ["García Matías","López Ignacio","Fernández Lucas","Martínez Tomás","González Facundo","Rodríguez Sebastián","Pérez Nicolás","Sánchez Rodrigo","Romero Diego","Torres Leandro"];
    const names = caseData.patient.sex === "F" ? femaleNames : maleNames;
    return names[Math.floor(Math.random() * names.length)];
  }

  function openPrescriptionModal(preloadStudy) {
    const modal = document.getElementById("study-modal");
    if (!modal) return;

    // Número de orden autoincremental
    document.getElementById("rx-numero").value = String(rxOrderNum).padStart(4,"0");

    // Fecha de hoy
    const hoy = new Date();
    document.getElementById("rx-fecha").value =
      String(hoy.getDate()).padStart(2,"0") + "/" +
      String(hoy.getMonth()+1).padStart(2,"0") + "/" +
      hoy.getFullYear();

    // Prefill con nombre y DNI del paciente si no fue llenado antes
    const nombreEl = document.getElementById("rx-paciente-nombre");
    const dniEl    = document.getElementById("rx-dni");
    if (!nombreEl.value) nombreEl.value = generatePatientName(caseData);
    if (!dniEl.value)    dniEl.value    = generateDNI(caseData);

    // Estudios sugeridos del caso — chips seleccionables
    const suggested = document.getElementById("rx-study-suggested");
    suggested.innerHTML = "";
    const studies = caseData.hidden_state.studies?.indicated || [];
    studies.forEach(s => {
      if (simState.studiesRequested.includes(s.id)) return; // ya solicitado
      const chip = document.createElement("button");
      chip.className = "rx-study-chip";
      chip.type = "button";
      chip.innerHTML = `${escapeHtml(s.label)} <span class="rx-study-chip-label">(sugerido)</span>`;
      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        updateStudiesTextarea();
      });
      suggested.appendChild(chip);
    });

    // Si viene de sendMessage con estudio detectado, prellenar textarea
    const textarea = document.getElementById("rx-estudios");
    textarea.value = preloadStudy || "";

    document.getElementById("rx-error").textContent = "";
    modal.classList.add("open");

    // Foco en el primer campo vacío
    setTimeout(() => {
      if (!document.getElementById("rx-medico-nombre").value)
        document.getElementById("rx-medico-nombre").focus();
      else
        textarea.focus();
    }, 150);
  }

  function updateStudiesTextarea() {
    const chips    = document.querySelectorAll(".rx-study-chip.selected");
    // Leer solo el texto del nodo de texto directo (ignora el span .rx-study-chip-label)
    const selected = Array.from(chips).map(chip => {
      // Clonar y quitar el span de label antes de leer el texto
      const clone = chip.cloneNode(true);
      clone.querySelectorAll(".rx-study-chip-label").forEach(el => el.remove());
      return clone.textContent.trim();
    }).filter(Boolean);
    const textarea = document.getElementById("rx-estudios");
    const existing = textarea.value.split("\n").filter(l => l.trim() && !selected.includes(l.trim()));
    textarea.value = [...selected, ...existing].join("\n").trim();
  }

  function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function submitPrescription() {
    const errEl  = document.getElementById("rx-error");
    const fecha  = document.getElementById("rx-fecha").value.trim();
    const nombre = document.getElementById("rx-paciente-nombre").value.trim();
    const dni    = document.getElementById("rx-dni").value.trim();
    const obra   = document.getElementById("rx-obra-social").value.trim();
    const estud  = document.getElementById("rx-estudios").value.trim();
    const medico = document.getElementById("rx-medico-nombre").value.trim();
    const mat    = document.getElementById("rx-matricula").value.trim();

    if (!fecha)   { errEl.textContent = "Completá la fecha."; return; }
    if (!nombre)  { errEl.textContent = "Completá el nombre del paciente."; return; }
    if (!dni)     { errEl.textContent = "Completá el DNI del paciente."; return; }
    if (!obra)    { errEl.textContent = "Seleccioná la cobertura médica."; return; }
    if (!estud)   { errEl.textContent = "Describí los estudios solicitados."; return; }
    if (!medico)  { errEl.textContent = "Completá el nombre del médico solicitante."; return; }
    if (!mat)     { errEl.textContent = "Completá la matrícula."; return; }

    errEl.textContent = "";

    // Cerrar modal e incrementar número de orden
    document.getElementById("study-modal").classList.remove("open");
    rxOrderNum++;

    // Limpiar el texto de estudios (quitar líneas vacías y texto residual)
    const estudLines = estud.split("\n")
      .map(l => l.trim())
      .filter(l => l && l !== medico && l !== mat && l !== nombre);
    const estudClean = estudLines.join("\n");

    const orderNum  = document.getElementById("rx-numero").value;
    const orderText = `Orden N° ${orderNum} | Paciente: ${nombre} | DNI: ${dni} | ${obra} | Médico: ${medico} (${mat})`;

    // Registrar cada estudio detectado en simState
    estudLines.forEach(studyText => {
      const found = caseData.hidden_state.studies?.indicated?.find(s =>
        studyText.toLowerCase().includes(s.label.toLowerCase().split(" ")[0].toLowerCase())
      );
      if (found && !simState.studiesRequested.includes(found.id)) {
        simState.studiesRequested.push(found.id);
      }
    });

    sendMessage("orden medica", { silent: true, orderSummary: orderText, fullStudies: estudClean });
  }

  function bindStudyModal() {
    document.getElementById("btn-study").addEventListener("click", () => {
      if (!caseData) return;
      openPrescriptionModal("");
    });
    document.getElementById("modal-close")?.addEventListener("click", () => {
      document.getElementById("study-modal").classList.remove("open");
    });
    document.getElementById("rx-submit")?.addEventListener("click", submitPrescription);
    document.getElementById("study-modal")?.addEventListener("click", e => {
      if (e.target === document.getElementById("study-modal"))
        document.getElementById("study-modal").classList.remove("open");
    });
    // Enter en matrícula dispara submit
    document.getElementById("rx-matricula")?.addEventListener("keydown", e => {
      if (e.key === "Enter") submitPrescription();
    });
  }

  // ── Diagnosis ──────────────────────────────────────────────────────────────
  function goToDiagnosis() {
    stopTimer();
    stopContinuousListening();
    SpeechService.cancelSpeech();
    SpeechService.stopTranscription();

    // Mostrar resultados de estudios solicitados durante la consulta
    if (simState && caseData && simState.studiesRequested.length > 0) {
      simState.studiesRequested.forEach(sid => {
        const study = caseData.hidden_state.studies.indicated.find(s => s.id === sid);
        if (study) {
          const t = { type: "study", label: study.label, text: study.result };
          // Solo agregar si no está ya en el transcript como resultado
          const alreadyShown = simState.transcript.some(tr => tr.type === "study" && tr.label === study.label);
          if (!alreadyShown) {
            simState.transcript.push(t);
            UI.appendTurn(t);
          }
        }
      });
    }

    UI.showScreen("diagnosis");
    ["diag-input","diff-input","studies-input"].forEach(id => { const el = document.getElementById(id); if(el) el.value=""; });
    const errEl = document.getElementById("diag-error"); if(errEl) errEl.textContent="";
  }

  function bindDiagnosisEvents() {
    document.getElementById("btn-diag-submit").addEventListener("click", () => {
      const diag = document.getElementById("diag-input").value.trim();
      if (!diag) { document.getElementById("diag-error").textContent = "Ingresá un diagnóstico presuntivo."; return; }
      simState.finalDiagnosis     = diag;
      simState.finalDifferentials = document.getElementById("diff-input").value.trim();
      simState.finalStudiesText   = document.getElementById("studies-input").value.trim();

      if (endlessMode) {
        // Verificar si el diagnóstico es correcto (comparación simple)
        const correct = checkDiagnosisCorrect(diag, caseData);
        if (correct) {
          endlessScore++;
          // Actualizar badge
          const badge = document.getElementById("sim-mode-badge");
          if (badge) badge.textContent = `♾ Racha: ${endlessScore}`;
          // Siguiente caso aleatorio
          const keys = Object.keys(CASES);
          const nextId = keys[Math.floor(Math.random() * keys.length)];
          startSimulation(nextId);
        } else {
          // Mostrar modal de fin de racha
          showEndlessEnd(diag);
        }
        return;
      }

      UI.showScreen("reflection");
      document.getElementById("reflection-textarea").value = "";
      document.getElementById("reflection-error").textContent = "";
    });
  }

  function checkDiagnosisCorrect(proposed, cd) {
    const p = proposed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

    // Stopwords — palabras genéricas que no aportan al diagnóstico
    const stop = new Set(["de","del","la","el","los","las","en","con","por","para","sin","una","uno","un","que","se","es","no","al","su","sus","como","ante","bajo","sobre","segun","hay","positivo","negativo","resultado","estudio","pendiente","diagnostico","caso","manejo","clinico","por"]);

    function keywords(str) {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/_/g," ").split(/\s+/)
        .filter(w => w.length > 3 && !stop.has(w));
    }

    // Palabras clave del diagnóstico real y su label
    const realKw   = keywords(cd.diagnosis_real);
    const labelKw  = keywords(cd.diagnosis_label);
    // Unir todas las keywords relevantes sin duplicados
    const allKw    = [...new Set([...realKw, ...labelKw])];

    if (!allKw.length) return false;

    const matched  = allKw.filter(w => p.includes(w));
    const ratio    = matched.length / allKw.length;

    // También buscar match directo con diferenciales
    const diffMatch = (cd.differentials || []).some(d =>
      keywords(d).filter(w => p.includes(w)).length >= 2
    );

    // Correcto si matchea >= 40% de keywords OR un diferencial claro
    return ratio >= 0.40 || diffMatch;
  }

  function showEndlessEnd(studentDiag) {
    document.getElementById("endless-score-num").textContent  = endlessScore;
    document.getElementById("endless-student-diag").textContent = studentDiag;
    document.getElementById("endless-correct-diag").textContent = caseData.diagnosis_label;
    document.getElementById("endless-end-desc").textContent =
      endlessScore === 0
        ? "Fallaste el primer diagnóstico  -  ¡así empieza la racha!"
        : `Llegaste a ${endlessScore} caso${endlessScore===1?"":"s"} seguidos correctos.`;
    document.getElementById("endless-end-overlay")?.classList.add("open");
    endlessScore = 0;
  }

  // ── Reflection → Evaluation ────────────────────────────────────────────────
  function bindReflectionEvents() {
    document.getElementById("btn-reflection-submit").addEventListener("click", async () => {
      const reflection = document.getElementById("reflection-textarea").value.trim();
      const errEl = document.getElementById("reflection-error");
      const btn   = document.getElementById("btn-reflection-submit");
      errEl.textContent = "";
      btn.disabled = true;
      btn.textContent = "Generando evaluación...";
      try {
        const evaluation = await ApiService.getEvaluation(caseData, simState);
        const debriefing = await ApiService.getDebriefing(caseData, evaluation, reflection);
        UI.renderEvaluation(evaluation, debriefing, caseData, simState);
        UI.showScreen("evaluation");
        // Mostrar overlay de donación después de cada ronda
        setTimeout(() => {
          const overlay = document.getElementById("donation-overlay");
          if (overlay) overlay.classList.add("open");
        }, 1200);
      } catch (err) {
        errEl.textContent = "Error al generar la evaluación: " + err.message;
      } finally {
        btn.disabled = false;
        btn.textContent = "Ver evaluación";
      }
    });
  }

  // ── Eval ───────────────────────────────────────────────────────────────────
  function bindEvalEvents() {
    document.getElementById("btn-repeat").addEventListener("click", () => {
      simMode = "practice"; endlessMode = false;
      startSimulation(caseData.id);
    });
    document.getElementById("btn-new-case").addEventListener("click", () => UI.showScreen("home"));
    document.getElementById("btn-home-from-diag").addEventListener("click", () => UI.showScreen("home"));
    document.getElementById("btn-home-from-reflection").addEventListener("click", () => UI.showScreen("home"));

    // Endless end modal
    document.getElementById("btn-endless-retry")?.addEventListener("click", () => {
      document.getElementById("endless-end-overlay")?.classList.remove("open");
      endlessMode = true; endlessScore = 0; simMode = "exam";
      const keys = Object.keys(CASES);
      startSimulation(keys[Math.floor(Math.random() * keys.length)]);
    });
    document.getElementById("btn-endless-home")?.addEventListener("click", () => {
      document.getElementById("endless-end-overlay")?.classList.remove("open");
      endlessMode = false;
      UI.showScreen("home");
    });

    // Overlay de donación
    document.getElementById("btn-donation-skip")?.addEventListener("click", () => {
      document.getElementById("donation-overlay")?.classList.remove("open");
    });
    document.getElementById("donation-overlay")?.addEventListener("click", e => {
      if (e.target === document.getElementById("donation-overlay")) {
        document.getElementById("donation-overlay").classList.remove("open");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
