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
    Profile.bind();
    QuizMode.bind();
    UI.showScreen("home");
  }

  // API key eliminada — las keys viven en el Cloudflare Worker

  // ── Home ───────────────────────────────────────────────────────────────────
  function bindHomeEvents() {
    // Función compartida para "al azar"
    function handleRandom() {
      if (!checkKey()) return;
      const keys = Object.keys(CASES);
      pendingCaseId = keys[Math.floor(Math.random() * keys.length)];
      endlessMode = false;
      openCaseModeModal(pendingCaseId);
    }

    // Función compartida para "modo interminable"
    function handleEndless() {
      if (!checkKey()) return;
      endlessMode = true;
      endlessScore = 0;
      simMode = "exam";
      const keys = Object.keys(CASES);
      pendingCaseId = keys[Math.floor(Math.random() * keys.length)];
      startSimulation(pendingCaseId);
    }

    // Botones del home body (los canónicos)
    document.getElementById("btn-random")?.addEventListener("click", handleRandom);
    document.getElementById("btn-endless")?.addEventListener("click", handleEndless);

    // Botones de la topbar (misma lógica)
    document.getElementById("btn-random-top")?.addEventListener("click", handleRandom);
    document.getElementById("btn-endless-top")?.addEventListener("click", handleEndless);

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

      // Exámenes físicos detectados por texto
      examResults.forEach(er => {
        const alreadyInPanel = simState.examPanelUsed?.includes(er.examId);
        if (!alreadyInPanel) {
          const t = { type: "exam", examId: er.examId, text: er.result };
          simState.transcript.push(t);
          UI.appendTurn(t);
        }
      });

      // Estudios: solo anotar los que están indicados en ESTE caso
      const caseStudyIds = new Set(
        (caseData.hidden_state.studies?.indicated || []).map(s => s.id)
      );
      const relevantStudies = newStudies.filter(s => caseStudyIds.has(s.id));
      relevantStudies.forEach(s => {
        const t = { type: "study-pending", label: s.label, text: `${s.label} - resultado disponible al finalizar la consulta.` };
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
        // Usar LLM para comparar semánticamente — con fallback local
        UI.setStatus("processing", "Evaluando diagnóstico...");
        ApiService.getDiagnosisMatch(diag, caseData).then(correct => {
          UI.setStatus(null);
          if (correct) {
            endlessScore++;
            const badge = document.getElementById("sim-mode-badge");
            if (badge) badge.textContent = `♾ Racha: ${endlessScore}`;
            const keys = Object.keys(CASES);
            startSimulation(keys[Math.floor(Math.random() * keys.length)]);
          } else {
            showEndlessEnd(diag);
          }
        });
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

        // Registrar en perfil
        const total = computeTotal(evaluation.scores, caseData.hidden_state.rubric_weights);
        Profile.recordCase(caseData.id, caseData.topic_label, total, evaluation.diagnosis_correct);
        if (endlessMode) Profile.updateBestStreak(endlessScore);

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

// ═══════════════════════════════════════════════════════════════════════════
// PERFIL Y ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════════════════════

const Profile = (() => {
  const KEY = "simulador_profile";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || _empty(); }
    catch { return _empty(); }
  }

  function _empty() {
    return { name: "", cases: [], bestStreak: 0 };
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function recordCase(caseId, topicLabel, score, diagCorrect) {
    const p = load();
    p.cases.push({ id: caseId, topic: topicLabel, score, diagCorrect, date: Date.now() });
    save(p);
    updateHomeBar();
  }

  function updateBestStreak(streak) {
    const p = load();
    if (streak > (p.bestStreak || 0)) { p.bestStreak = streak; save(p); }
  }

  function stats() {
    const p = load();
    const cs = p.cases || [];
    const total  = cs.length;
    const avg    = total ? Math.round(cs.reduce((a, c) => a + c.score, 0) / total) : 0;
    const perfect = cs.filter(c => c.score >= 90).length;
    const streak = p.bestStreak || 0;
    // Mejor tema (mayor promedio con >= 2 casos)
    const byTopic = {};
    cs.forEach(c => {
      if (!byTopic[c.topic]) byTopic[c.topic] = [];
      byTopic[c.topic].push(c.score);
    });
    let bestTopic = null, bestAvg = 0;
    Object.entries(byTopic).forEach(([t, scores]) => {
      if (scores.length < 2) return;
      const a = Math.round(scores.reduce((x, y) => x + y, 0) / scores.length);
      if (a > bestAvg) { bestAvg = a; bestTopic = t; }
    });
    return { total, avg, perfect, streak, bestTopic, bestAvg, name: p.name };
  }

  function initials(name) {
    if (!name) return "?";
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
  }

  function updateHomeBar() {
    const s = stats();
    const nameEl  = document.getElementById("profile-name-display");
    const miniEl  = document.getElementById("profile-stats-mini");
    const av1     = document.getElementById("profile-avatar");
    const av2     = document.getElementById("profile-avatar-big");
    if (nameEl) nameEl.textContent = s.name || "Sin nombre";
    if (miniEl) miniEl.textContent = `${s.total} casos · ${s.avg} pts promedio`;
    const ini = initials(s.name);
    if (av1) av1.textContent = ini;
    if (av2) av2.textContent = ini;
  }

  function openModal() {
    const s  = stats();
    const p  = load();
    const ni = document.getElementById("profile-name-input");
    if (ni) ni.value = p.name || "";
    document.getElementById("stat-total").textContent   = s.total;
    document.getElementById("stat-avg").textContent     = s.avg;
    document.getElementById("stat-streak").textContent  = s.streak;
    document.getElementById("stat-perfect").textContent = s.perfect;
    const btEl = document.getElementById("profile-best-topic");
    if (btEl) btEl.textContent = s.bestTopic
      ? `Mejor tema: ${s.bestTopic} (${s.bestAvg} pts prom.)`
      : s.total ? "Completá mas casos para ver tu mejor tema." : "Todavia no completaste ningun caso.";
    updateHomeBar();
    document.getElementById("profile-overlay")?.classList.add("open");
    setTimeout(() => ni?.focus(), 150);
  }

  function bind() {
    document.getElementById("btn-open-profile")?.addEventListener("click", openModal);
    document.getElementById("btn-profile-close")?.addEventListener("click", () => {
      document.getElementById("profile-overlay")?.classList.remove("open");
    });
    document.getElementById("profile-overlay")?.addEventListener("click", e => {
      if (e.target === document.getElementById("profile-overlay"))
        document.getElementById("profile-overlay").classList.remove("open");
    });
    document.getElementById("btn-profile-save")?.addEventListener("click", () => {
      const val = document.getElementById("profile-name-input").value.trim();
      const p   = load();
      p.name    = val;
      save(p);
      updateHomeBar();
      document.getElementById("profile-overlay")?.classList.remove("open");
    });
    document.getElementById("btn-profile-reset")?.addEventListener("click", () => {
      if (!confirm("Reiniciar todo el progreso? Esto no se puede deshacer.")) return;
      const p = load();
      p.cases = [];
      p.bestStreak = 0;
      save(p);
      openModal();
    });
    updateHomeBar();
  }

  return { load, save, recordCase, updateBestStreak, stats, bind, updateHomeBar, initials };
})();

// ═══════════════════════════════════════════════════════════════════════════
// REPASO RAPIDO (Quiz de 3 preguntas por caso)
// ═══════════════════════════════════════════════════════════════════════════

const QuizMode = (() => {
  let currentCase  = null;
  let questions    = [];
  let qIndex       = 0;
  let score        = 0;
  let answered     = false;

  // Genera 3 preguntas de opción múltiple a partir del caso
  function buildQuestions(cd) {
    const qs = [];

    // Pregunta 1: Diagnóstico principal
    const wrongDiags = [
      ...cd.differentials,
      "Enfermedad autoinmune sistémica",
      "Infección bacteriana inespecífica",
      "Trastorno funcional",
      "Patología de origen psicosomático",
    ].filter(d => d !== cd.diagnosis_label).slice(0, 3);

    qs.push({
      num:         1,
      text:        "En base a la presentación clinica, cual es el diagnostico mas probable?",
      correct:     cd.diagnosis_label,
      options:     shuffle([cd.diagnosis_label, ...wrongDiags.slice(0, 3)]),
      explanation: `El diagnostico correcto es "${cd.diagnosis_label}". ${cd.differentials.length ? "Los diferenciales a considerar incluyen: " + cd.differentials.join(", ") + "." : ""}`,
    });

    // Pregunta 2: Estudio clave
    const studies = cd.hidden_state.studies?.indicated || [];
    const criticalStudy = studies.find(s => s.pertinence === "critical");
    if (criticalStudy) {
      const wrongStudies = [
        "Resonancia magnetica de cerebro",
        "Hemograma simple sin formula",
        "Radiografia de torax de rutina",
        "Ecografia de partes blandas",
      ].slice(0, 3);
      qs.push({
        num:         2,
        text:        "Cual es el estudio complementario mas importante para este caso?",
        correct:     criticalStudy.label,
        options:     shuffle([criticalStudy.label, ...wrongStudies]),
        explanation: `El estudio clave es "${criticalStudy.label}". Resultado esperado: ${criticalStudy.result}`,
      });
    } else {
      qs.push({
        num:         2,
        text:        "Cual de los siguientes hallazgos clinicos es el mas relevante en este caso?",
        correct:     cd.hidden_state.critical_data_ids?.[0]?.replace(/_/g, " ") || "Anamnesis completa",
        options:     shuffle([
          cd.hidden_state.critical_data_ids?.[0]?.replace(/_/g, " ") || "Anamnesis completa",
          "Antecedentes quirurgicos previos",
          "Habitos alimentarios del paciente",
          "Medicacion ambulatoria habitual",
        ]),
        explanation: "El dato clinico critico es el que orienta directamente al diagnostico principal del caso.",
      });
    }

    // Pregunta 3: Error clinico comun
    const errors = cd.hidden_state.common_errors || [];
    if (errors.length >= 2) {
      const correctError = errors[0];
      const fakeErrors = [
        "No saludar al paciente al inicio",
        "Solicitar demasiados estudios sin indicacion",
        "Hablar demasiado rapido durante la consulta",
      ];
      qs.push({
        num:         3,
        text:        "Cual es el error clinico mas frecuente en el manejo de este tipo de caso?",
        correct:     correctError,
        options:     shuffle([correctError, ...fakeErrors.slice(0, 3)]),
        explanation: `El error mas comun es: "${correctError}". Recordalo para evitarlo en la consulta real.`,
      });
    } else {
      qs.push({
        num:         3,
        text:        "En que dimension es mas importante enfocarse en este caso?",
        correct:     "Anamnesis sistematica y completa",
        options:     shuffle([
          "Anamnesis sistematica y completa",
          "Solicitud masiva de estudios complementarios",
          "Derivacion inmediata sin evaluar",
          "Tratamiento empirico sin diagnostico",
        ]),
        explanation: "Una anamnesis bien realizada es el pilar de cualquier consulta clinica.",
      });
    }

    return qs;
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function start(caseId) {
    currentCase = CASES[caseId];
    if (!currentCase) return;
    questions   = buildQuestions(currentCase);
    qIndex      = 0;
    score       = 0;
    answered    = false;
    UI.showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    if (qIndex >= questions.length) { renderResult(); return; }

    const q   = questions[qIndex];
    const el  = document.getElementById("quiz-content");
    const prog= document.getElementById("quiz-progress-label");
    if (prog) prog.textContent = `Pregunta ${qIndex + 1} de ${questions.length}`;

    const letters = ["A", "B", "C", "D"];
    const optHtml = q.options.map((opt, i) => `
      <button class="quiz-option" data-opt="${escHtml(opt)}">
        <span class="quiz-option-letter">${letters[i]}</span>
        ${escHtml(opt)}
      </button>`).join("");

    el.innerHTML = `
      <div class="quiz-case-header">
        <div class="quiz-case-topic">${escHtml(currentCase.topic_label)} · ${escHtml(currentCase.difficulty)}</div>
        <div class="quiz-case-complaint">${escHtml(currentCase.patient.chief_complaint)}</div>
        <div class="quiz-case-vignette">${escHtml(currentCase.patient.context)}</div>
      </div>
      <div class="quiz-question">
        <div class="quiz-question-num">Pregunta ${q.num}</div>
        <div class="quiz-question-text">${escHtml(q.text)}</div>
        <div class="quiz-options" id="quiz-options">${optHtml}</div>
        <div id="quiz-explanation" style="display:none"></div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-primary" id="btn-quiz-next" style="display:none">
          ${qIndex < questions.length - 1 ? "Siguiente pregunta" : "Ver resultado"}
        </button>
      </div>`;

    // Bind opciones
    document.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen  = btn.dataset.opt;
        const correct = q.correct;
        const isRight = chosen === correct;
        if (isRight) score++;

        document.querySelectorAll(".quiz-option").forEach(b => {
          b.disabled = true;
          if (b.dataset.opt === correct) b.classList.add("correct");
          else if (b === btn && !isRight) b.classList.add("wrong");
          else b.classList.add("revealed-correct");
        });

        const expEl = document.getElementById("quiz-explanation");
        expEl.style.display = "block";
        expEl.innerHTML = `<strong>${isRight ? "Correcto!" : "Incorrecto."}</strong> ${escHtml(q.explanation)}`;

        document.getElementById("btn-quiz-next").style.display = "";
      });
    });

    document.getElementById("btn-quiz-next")?.addEventListener("click", () => {
      qIndex++;
      answered = false;
      renderQuestion();
    });
  }

  function renderResult() {
    const el  = document.getElementById("quiz-content");
    const pct = Math.round((score / questions.length) * 100);
    const msg = score === questions.length
      ? "Perfecto! Dominas este tema."
      : score >= 2 ? "Bien! Repasa los conceptos que fallaste."
      : "Seguí practicando — la consulta completa te va a ayudar.";

    el.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-score">${score}/${questions.length}</div>
        <div class="quiz-result-label">${pct}% correcto</div>
        <div class="quiz-result-msg">${msg}</div>
        <div style="display:flex;flex-direction:column;gap:0.625rem;max-width:280px;margin:0 auto">
          <button class="btn btn-primary" id="btn-quiz-again">Otro caso al azar</button>
          <button class="btn btn-secondary" id="btn-quiz-consult">Hacer la consulta completa</button>
          <button class="btn btn-ghost" id="btn-quiz-home">Volver al inicio</button>
        </div>
      </div>`;

    document.getElementById("btn-quiz-again")?.addEventListener("click", () => {
      const keys = Object.keys(CASES);
      start(keys[Math.floor(Math.random() * keys.length)]);
    });
    document.getElementById("btn-quiz-consult")?.addEventListener("click", () => {
      pendingCaseId = currentCase.id;
      simMode = "practice";
      endlessMode = false;
      UI.showScreen("home");
      openCaseModeModal(currentCase.id);
    });
    document.getElementById("btn-quiz-home")?.addEventListener("click", () => UI.showScreen("home"));

    if (prog) prog.textContent = "Resultado";
  }

  function escHtml(str) {
    return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function bind() {
    document.getElementById("btn-quiz")?.addEventListener("click", () => {
      const keys = Object.keys(CASES);
      start(keys[Math.floor(Math.random() * keys.length)]);
    });
    document.getElementById("btn-quiz-exit")?.addEventListener("click", () => UI.showScreen("home"));
  }

  return { start, bind };
})();
