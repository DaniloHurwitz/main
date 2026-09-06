//  -  -  -  RENDERIZADO DE UI  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
// Responsabilidad: manipulación del DOM. No contiene lógica de negocio.

const UI = (() => {

  //  -  -  Pantallas  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById("screen-" + id);
    if (target) { target.classList.add("active"); }
  }

  //  -  -  Home  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function renderCaseList(cases, onStart) {
    const groups = { 1: [], 2: [] };
    Object.values(cases).forEach((c, i) => {
      (groups[c.parcial] || (groups[3] = [])).push({ ...c, index: i });
    });

    const container = document.getElementById("case-list");
    container.innerHTML = "";

    [1, 2].forEach(parcial => {
      const items = Object.values(cases)
        .map((c, i) => ({ ...c, globalIdx: i }))
        .filter(c => c.parcial === parcial);
      if (!items.length) return;

      const group = document.createElement("div");
      group.className = "case-list-group";
      // En mobile, colapsar el segundo parcial por defecto
      if (parcial === 2 && window.innerWidth <= 768) group.classList.add("collapsed");
      group.innerHTML = `<div class="case-list-group-label">${parcial === 1 ? "Primer parcial" : "Segundo parcial"}</div>`;

      items.forEach((c, localIdx) => {
        const item = document.createElement("div");
        item.className = "case-item";
        const badgeClass = c.difficulty === "dificil" ? "badge-dificil" : c.difficulty === "facil" ? "badge-facil" : "badge-normal";
        item.innerHTML = `
          <div class="case-item-left">
            <span class="case-item-num">${String(c.globalIdx + 1).padStart(2, "0")}</span>
            <div>
              <div class="case-item-label">Caso clínico · ${c.topic_label}</div>
              <div class="case-item-topic">${c.patient.context}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span class="badge ${badgeClass}">${c.difficulty}</span>
            <button class="btn btn-primary" data-caseid="${c.id}">Iniciar</button>
          </div>`;
        item.querySelector("button").addEventListener("click", () => onStart(c.id));
        group.appendChild(item);
      });

      container.appendChild(group);
    });
  }

  //  -  -  Timer  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function updateTimer(secondsLeft) {
    const box = document.getElementById("timer-box");
    const el  = document.getElementById("timer-display");
    if (!box || !el) return;
    // null = modo práctica, sin límite de tiempo
    if (secondsLeft === null) {
      box.style.display = "none";
      return;
    }
    box.style.display = "";
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    el.textContent = `${m}:${s}`;
    box.className = "timer";
    if (secondsLeft <= 120) box.classList.add("critical");
    else if (secondsLeft <= 300) box.classList.add("warning");
  }

  //  -  -  Transcript  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function appendTurn(turn) {
    const area = document.getElementById("transcript-area");
    if (!area) return;
    const div = document.createElement("div");
    div.className = `turn turn-${turn.type}`;

    if (turn.type === "student") {
      div.innerHTML = `
        <span class="turn-label">Vos</span>
        <div class="bubble bubble-student">${escHtml(turn.text)}</div>`;
    } else if (turn.type === "patient") {
      div.innerHTML = `
        <span class="turn-label">Paciente</span>
        <div class="bubble bubble-patient">${escHtml(turn.text)}</div>`;
    } else if (turn.type === "system") {
      div.innerHTML = `<div class="bubble bubble-system">${escHtml(turn.text)}</div>`;
    } else if (turn.type === "exam") {
      const label = turn.examId.replace(/_/g, " ");
      const labelCap = label.charAt(0).toUpperCase() + label.slice(1);
      div.innerHTML = `
        <div class="bubble bubble-exam">
          <div class="bubble-exam-title">Examen físico · ${labelCap}</div>
          ${escHtml(turn.text)}
        </div>`;
    } else if (turn.type === "study") {
      div.innerHTML = `
        <div class="bubble bubble-study">
          <div class="bubble-study-title">Resultado · ${escHtml(turn.label)}</div>
          ${escHtml(turn.text)}
        </div>`;
    } else if (turn.type === "study-pending") {
      div.innerHTML = `
        <div class="bubble bubble-exam" style="border-left-color:var(--text-3)">
          <div class="bubble-exam-title" style="color:var(--text-3)">Estudio anotado</div>
          ${escHtml(turn.label)}  -  resultado disponible al finalizar la consulta.
        </div>`;
    } else if (turn.type === "prescription") {
      const studies = (turn.fullStudies || "").split("\n").filter(s => s.trim()).map(s => `<li>${escHtml(s.trim())}</li>`).join("");
      div.innerHTML = `
        <span class="turn-label">Orden médica emitida</span>
        <div class="bubble bubble-prescription">
          <div class="bubble-prescription-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            Orden de estudios complementarios
          </div>
          ${studies ? `<ul class="bubble-prescription-list">${studies}</ul>` : `<p style="opacity:0.7">${escHtml(turn.text)}</p>`}
        </div>`;
    }

    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  }

  function showTypingIndicator() {
    const area = document.getElementById("transcript-area");
    if (!area) return;
    const div = document.createElement("div");
    div.className = "turn turn-patient";
    div.id = "typing-indicator";
    div.innerHTML = `
      <span class="turn-label">Paciente</span>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>`;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  //  -  -  Sidebar / ficha clínica  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  const CAT_LABELS = {
    "Enfermedad actual": "Enfermedad actual",
    "Síntomas asociados": "Síntomas asociados",
    "Antecedentes sexuales": "Antecedentes sexuales",
    "Antecedentes": "Antecedentes",
    "Gineco-obstétrico": "Gineco-obstétrico",
    "Examen físico": "Examen físico",
    "Preocupación": "Preocupación del paciente",
  };

  function updateSidebar(simState, caseData, simMode) {
    const revealed = simState.clinicalData.filter(d => d.revealed);
    const total = simState.clinicalData.length;
    const criticalIds = caseData.hidden_state.critical_data_ids || [];

    // Modo examen: ocultar sección de datos revelados
    const dataSection = document.getElementById("sidebar-data");
    if (dataSection) dataSection.style.display = simMode === "exam" ? "none" : "";

    // Progress
    const pct = total ? Math.round((revealed.length / total) * 100) : 0;
    const pfill = document.getElementById("progress-fill");
    const pval = document.getElementById("progress-value");
    if (pfill) pfill.style.width = pct + "%";
    if (pval) pval.textContent = `${revealed.length}/${total}`;

    // Trust dots
    const trustPct = simState.trustLevel;
    const dots = document.querySelectorAll(".trust-dot");
    dots.forEach((dot, i) => {
      const threshold = (i + 1) * 20;
      dot.classList.remove("filled", "partial");
      if (trustPct >= threshold) dot.classList.add("filled");
      else if (trustPct >= threshold - 10) dot.classList.add("partial");
    });

    // Data categories
    const body = document.getElementById("sidebar-body");
    if (!body) return;

    if (revealed.length === 0) {
      body.innerHTML = `
        <div class="sidebar-empty">
          <div class="sidebar-empty-text">La ficha se completa a medida que explorás la consulta.</div>
        </div>`;
      return;
    }

    // Agrupar por categoría
    const byCategory = {};
    revealed.forEach(d => {
      const cat = d.category || "Otros";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(d);
    });

    body.innerHTML = "";
    for (const [cat, items] of Object.entries(byCategory)) {
      const section = document.createElement("div");
      section.className = "data-category";
      const label = CAT_LABELS[cat] || cat;
      section.innerHTML = `<div class="data-category-title">${label}</div>`;
      items.forEach(d => {
        const item = document.createElement("div");
        const isCritical = criticalIds.includes(d.id);
        const isImportant = d.importance === "important";
        item.className = `data-item ${isCritical ? "critical" : isImportant ? "important" : ""}`;
        item.textContent = d.value;
        section.appendChild(item);
      });
      body.appendChild(section);
    }

    // Exámenes realizados
    if (simState.physicalExamsPerformed.length > 0) {
      const section = document.createElement("div");
      section.className = "data-category";
      section.innerHTML = `<div class="data-category-title">Examen físico realizado</div>`;
      simState.physicalExamsPerformed.forEach(e => {
        const item = document.createElement("div");
        item.className = "data-item";
        item.style.color = "var(--success)";
        item.textContent = " -  " + e.replace(/_/g, " ");
        section.appendChild(item);
      });
      body.appendChild(section);
    }

    // Estudios solicitados
    if (simState.studiesRequested.length > 0) {
      const section = document.createElement("div");
      section.className = "data-category";
      section.innerHTML = `<div class="data-category-title">Estudios solicitados</div>`;
      simState.studiesRequested.forEach(sid => {
        const study = caseData.hidden_state.studies.indicated.find(s => s.id === sid);
        const item = document.createElement("div");
        item.className = "data-item";
        item.innerHTML = study
          ? `<span style="color:var(--success)"> -  ${study.label}</span><br><span style="font-size:0.75rem;font-family:var(--font-mono)">${study.result}</span>`
          : `<span style="color:var(--text-3)"> -  ${sid}</span>`;
        section.appendChild(item);
      });
      body.appendChild(section);
    }
  }

  //  -  -  Study modal  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function openStudyModal(studies, requestedIds, onSelect) {
    const modal = document.getElementById("study-modal");
    const grid = document.getElementById("modal-study-grid");
    if (!modal || !grid) return;

    grid.innerHTML = "";
    studies.indicated.forEach(s => {
      const done = requestedIds.includes(s.id);
      const btn = document.createElement("button");
      btn.className = "modal-study-btn" + (done ? " done" : "");
      btn.innerHTML = done
        ? `<span>${s.label}</span><span class="modal-study-result">${s.result}</span>`
        : `<span>${s.label}</span>`;
      if (!done) btn.addEventListener("click", () => { closeStudyModal(); onSelect(s); });
      grid.appendChild(btn);
    });

    modal.classList.add("open");
  }

  function closeStudyModal() {
    const modal = document.getElementById("study-modal");
    if (modal) modal.classList.remove("open");
  }

  //  -  -  Status bar  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function setStatus(type, text) {
    const bar = document.getElementById("status-bar");
    if (!bar) return;
    if (!type) { bar.innerHTML = ""; return; }
    const icons = { listening: " -  - ", speaking: " -  - ", processing: " -  - ", error: "" };
    bar.innerHTML = `<span class="status-${type}">${icons[type] ? `<span class="status-dot"></span>` : ""}${escHtml(text)}</span>`;
  }

  //  -  -  Evaluation screen  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function renderEvaluation(evaluation, debriefing, caseData, simState) {
    const weights  = caseData.hidden_state.rubric_weights;
    const total    = computeTotal(evaluation.scores, weights);
    const scoreClass = total >= 80 ? "good" : total >= 60 ? "ok" : "low";
    const scoreLabel = total >= 80 ? "Buen desempeño" : total >= 60 ? "Desempeño aceptable" : "Requiere práctica";

    const dimLabels = {
      apertura:"Apertura", anamnesis:"Anamnesis", comunicacion:"Comunicación",
      examen_fisico:"Examen físico", razonamiento:"Razonamiento",
      diagnostico:"Diagnóstico", estudios:"Estudios"
    };

    const discovered = simState.clinicalData?.filter(d => d.revealed) || [];
    const total_data = simState.clinicalData?.length || 0;
    const coverage   = total_data ? Math.round(discovered.length / total_data * 100) : 0;
    const critIds    = caseData.hidden_state.critical_data_ids || [];
    const missed     = simState.clinicalData?.filter(d => !d.revealed) || [];
    const missedCrit = missed.filter(d => critIds.includes(d.id));

    const container = document.getElementById("eval-content");
    if (!container) return;

    // ── Header siempre visible ─────────────────────────────────────────────────
    const header = `
      <div class="eval-header">
        <div class="eval-score-circle ${scoreClass}">
          <div class="eval-score-num">${total}</div>
          <div class="eval-score-label">/ 100</div>
        </div>
        <div class="eval-header-right">
          <h2 style="font-family:var(--font-serif);margin-bottom:0.25rem">
            ${escHtml(caseData.topic_label)}
          </h2>
          <p style="font-size:0.875rem;color:var(--text-2);margin-bottom:0.5rem">
            ${escHtml(caseData.patient.chief_complaint)}
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:0.5rem;font-size:0.8125rem;color:var(--text-2)">
            <span>Cobertura: <strong style="color:var(--text-1)">${coverage}%</strong> (${discovered.length}/${total_data} datos)</span>
            <span>Exámenes: <strong style="color:var(--text-1)">${simState.physicalExamsPerformed?.length || 0}</strong></span>
            <span>Estudios: <strong style="color:var(--text-1)">${simState.studiesRequested?.length || 0}</strong></span>
          </div>
          <div class="eval-diagnosis-row">
            <span class="eval-diag-badge ${evaluation.diagnosis_correct ? "eval-diag-correct" : "eval-diag-wrong"}">
              ${scoreLabel} · Diagnóstico ${evaluation.diagnosis_correct ? "correcto ✓" : "incorrecto ✗"}
            </span>
          </div>
        </div>
      </div>`;

    // ── Comparación diagnóstica ────────────────────────────────────────────────
    const diagBlock = `
      <div class="eval-diag-compare">
        <div>
          <div class="eval-diag-col-label">Tu hipótesis</div>
          <div class="eval-diag-col-value">${escHtml(simState.finalDiagnosis || "No declarado")}</div>
          <div style="font-size:0.8125rem;color:var(--text-2)">${escHtml(simState.finalDifferentials || "Sin diferenciales")}</div>
        </div>
        <div>
          <div class="eval-diag-col-label">Diagnóstico real</div>
          <div class="eval-diag-col-value">${escHtml(caseData.diagnosis_label)}</div>
          <div style="font-size:0.8125rem;color:var(--text-2)">Diferenciales: ${escHtml(caseData.differentials.join(", "))}</div>
        </div>
      </div>`;

    // ── Acordeón 1: Puntajes por dimensión ────────────────────────────────────
    const fallbackEvidence = {
      apertura:     ["Evaluado según la apertura de la consulta"],
      anamnesis:    [`Cobertura del ${coverage}% de los datos del caso`],
      comunicacion: ["Evaluado según el tono y la formulación de las preguntas"],
      examen_fisico:[`${simState.physicalExamsPerformed?.length || 0} exámenes realizados`],
      razonamiento: ["Evaluado según la integración de los datos obtenidos"],
      diagnostico:  [simState.finalDiagnosis ? `Propuesto: ${simState.finalDiagnosis}` : "No se declaró diagnóstico"],
      estudios:     [simState.studiesRequested?.length ? `Solicitados: ${simState.studiesRequested.join(", ")}` : "No se solicitaron estudios"],
    };

    let gridHtml = '<div class="eval-grid">';
    for (const [dim, label] of Object.entries(dimLabels)) {
      const data = (evaluation.scores || {})[dim] || {};
      const sc   = typeof data.score === "number" ? data.score : 0;
      const cls  = sc >= 80 ? "good" : sc >= 60 ? "ok" : "low";
      const evs  = (data.evidence?.length ? data.evidence : fallbackEvidence[dim] || []).slice(0,2);
      gridHtml += `
        <div class="eval-card">
          <div class="eval-card-header">
            <span class="eval-card-title">${label}</span>
            <span class="eval-card-score ${cls}">${sc}</span>
          </div>
          <div class="eval-score-bar"><div class="eval-score-fill ${cls}" style="width:${sc}%"></div></div>
          ${evs.map(e => `<div class="eval-evidence-item">· ${escHtml(String(e))}</div>`).join("")}
        </div>`;
    }
    gridHtml += "</div>";

    // ── Acordeón 2: Datos descubiertos / omitidos ─────────────────────────────
    // Convierte snake_case a etiqueta legible: "flujo_caracteristicas" → "Flujo y características"
    function idToLabel(id) {
      return id
        .replace(/_\d+$/, "")          // quitar sufijos numéricos (_2, _3)
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bRn\b/g, "RN")
        .replace(/\bItu\b/g, "ITU")
        .replace(/\bIts\b/g, "ITS")
        .replace(/\bVih\b/g, "VIH")
        .replace(/\bEf\b/g, "EF")
        .replace(/\bPap\b/g, "PAP")
        .replace(/\bSomf\b/g, "SOMF")
        .replace(/\bPsa\b/g, "PSA")
        .replace(/\bHta\b/g, "HTA")
        .replace(/\bDm\b/g, "DM")
        .replace(/\bDdc\b/g, "DDC")
        .replace(/\bCcu\b/g, "CCU")
        .replace(/\bEcg\b/g, "ECG")
        .replace(/\bTec\b/g, "TEC")
        .replace(/\bVph\b/g, "VPH");
    }

    function dataRow(d, isCrit, isMissed) {
      const star    = isCrit ? `<span class="data-star">★</span>` : `<span class="data-star-placeholder"></span>`;
      const label   = idToLabel(d.id);
      const imp     = d.importance === "critical" ? "crit" : d.importance === "important" ? "imp" : "sec";
      const rowCls  = "data-row" + (isMissed ? " missed" : "");
      return `<div class="${rowCls}" title="${escHtml(d.value)}">
        ${star}
        <div class="data-row-content">
          <span class="data-label imp-${imp}">${escHtml(label)}</span>
          <span class="data-preview">${escHtml(d.value)}</span>
        </div>
      </div>`;
    }

    const dataHtml = `
      <div class="data-grid">
        <div class="debriefing-section data-col" style="margin-bottom:0">
          <div class="debriefing-section-title good">✓ Descubiertos (${discovered.length}/${total_data})</div>
          ${discovered.length
            ? discovered.map(d => dataRow(d, critIds.includes(d.id), false)).join("")
            : '<div class="debriefing-item" style="font-style:italic;color:var(--text-3)">Ninguno</div>'}
        </div>
        <div class="debriefing-section data-col" style="margin-bottom:0;${missedCrit.length ? "border-color:var(--danger)" : ""}">
          <div class="debriefing-section-title ${missedCrit.length ? "bad" : "info"}">✗ No descubiertos (${missed.length})</div>
          ${missed.length
            ? missed.map(d => dataRow(d, critIds.includes(d.id), true)).join("")
            : '<div class="debriefing-item" style="font-style:italic;color:var(--text-3)">Todos descubiertos ✓</div>'}
        </div>
      </div>`;

    // ── Acordeón 3: Debriefing educativo ──────────────────────────────────────
    const erroresClinicos = debriefing.errores_clinicos?.length
      ? debriefing.errores_clinicos
      : (caseData.hidden_state.common_errors || []).slice(0, 3);

    function sec(title, items, cls, icon) {
      if (!items?.length) return "";
      return `<div class="debriefing-section">
        <div class="debriefing-section-title ${cls}">${icon} ${title}</div>
        ${items.map(i => `<div class="debriefing-item">${escHtml(String(i))}</div>`).join("")}
      </div>`;
    }

    const debriefContent = `
      ${sec("Lo que hiciste bien", debriefing.bien_hecho?.length ? debriefing.bien_hecho : (discovered.length > 0 ? [`Descubriste ${discovered.length} dato${discovered.length > 1 ? "s" : ""} del caso`] : ["Completaste la consulta"]), "good", "✓")}
      ${sec("A mejorar", debriefing.mejorar?.length ? debriefing.mejorar : ["Explorá más sistemáticamente los datos antes de concluir la consulta"], "warn", "⚠")}
      ${sec("Errores clínicos", erroresClinicos, "bad", "✗")}`;

    const objHtml = `
      <div class="objective-box">
        <div class="objective-box-label">Objetivo para la próxima simulación</div>
        <div class="objective-box-text">${escHtml(debriefing.objetivo_proxima || "Completar una anamnesis sistemática antes de cualquier conclusión diagnóstica.")}</div>
      </div>
      <div class="debriefing-section">
        <div class="debriefing-section-title info">Aprendizaje recomendado</div>
        <div class="debriefing-item">${escHtml(debriefing.aprendizaje_recomendado || `Revisar ${caseData.topic_label}`)}</div>
      </div>`;

    // ── Ensamblar con <details> para acordeones ───────────────────────────────
    container.innerHTML = `
      ${header}
      ${diagBlock}

      <details open style="margin-bottom:0.75rem">
        <summary class="eval-accordion-summary">📊 Análisis por dimensión</summary>
        ${gridHtml}
      </details>

      <details style="margin-bottom:0.75rem">
        <summary class="eval-accordion-summary">🗂 Datos descubiertos y omitidos</summary>
        <div style="padding:0.75rem 0">
          ${dataHtml}
        </div>
      </details>

      <details style="margin-bottom:0.75rem">
        <summary class="eval-accordion-summary">💬 Transcript de la consulta</summary>
        <div style="padding:0.5rem 0">
          ${buildTranscriptHTML(simState, caseData)}
        </div>
      </details>

      <details open style="margin-bottom:0.75rem">
        <summary class="eval-accordion-summary">🧠 Debriefing educativo</summary>
        <div style="padding:0.5rem 0">
          ${debriefContent}
          ${objHtml}
        </div>
      </details>`;
  }


  function escHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function computeTotal(scores, weights) {
    if (!scores || !weights) return 0;
    let total = 0, wSum = 0;
    for (const [k, w] of Object.entries(weights)) {
      if (scores[k]) { total += scores[k].score * w; wSum += w; }
    }
    return wSum ? Math.round(total / wSum) : 0;
  }

  //  -  -  Panel de examen físico interactivo  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function renderExamPanel(caseData, simState, onExamClick) {
    const panel = caseData.hidden_state.exam_panel;
    const list  = document.getElementById("exam-panel-list");
    if (!list || !panel) return;

    list.innerHTML = "";

    panel.forEach(option => {
      const status = SimulationEngine.canPerformExam(option, simState);
      const btn    = document.createElement("button");
      btn.className = `exam-option ${option.pertinence}${status === "done" ? " done" : ""}${status === "locked" ? " locked" : ""}`;
      btn.disabled  = status === "done" || status === "locked";

      if (status === "locked" && option.requires_data_label) {
        btn.setAttribute("data-tooltip", option.requires_data_label);
      }

      const pointsSign  = option.points >= 0 ? "+" : "";
      const pointsCls   = option.points >= 0 ? "positive" : "negative";
      const badgeText   = status === "done"
        ? "✓ Realizado"
        : status === "locked"
          ? "🔒 Bloqueado"
          : option.pertinence === "necessary" ? "Pertinente" : "Innecesario";
      const badgeCls    = status === "done" ? "badge-done"
        : status === "locked" ? "badge-locked"
        : option.pertinence === "necessary" ? "badge-necessary" : "badge-unnecessary";

      btn.innerHTML = `
        <div class="exam-option-left">
          <div class="exam-option-label">${escHtml(option.label)}</div>
          <div class="exam-option-desc">${escHtml(option.description)}</div>
        </div>
        <div style="flex-shrink:0">
          ${status === "done"
            ? `<span class="exam-option-badge badge-done">✓ Realizado</span>`
            : status === "locked"
              ? `<span class="exam-option-badge badge-locked">🔒</span>`
              : ""}
        </div>`;

      if (status === "available") {
        btn.addEventListener("click", () => onExamClick(option));
      }

      list.appendChild(btn);
    });
  }

  // Agrega al transcript la burbuja de resultado del examen del panel
  function appendExamPanelResult(option, finding) {
    const area = document.getElementById("transcript-area");
    if (!area) return;

    const div = document.createElement("div");
    div.className = "turn turn-exam turn-exam-panel";

    // Crear burbuja base sin imagen todavía
    div.innerHTML = `
      <span class="turn-label">Examen físico</span>
      <div class="turn-bubble">
        <strong>${escHtml(option.label)}</strong>
        ${finding
          ? `<p style="margin-top:0.375rem;font-size:0.875rem;line-height:1.6">${escHtml(finding)}</p>`
          : `<p style="margin-top:0.375rem;color:var(--text-3);font-style:italic;font-size:0.875rem">Sin hallazgos registrados para este examen.</p>`}
      </div>`;

    area.appendChild(div);

    // Agregar imagen programáticamente para asegurar la carga
    if (option.image_url) {
      const bubble  = div.querySelector(".turn-bubble");
      const wrapper = document.createElement("div");
      wrapper.className = "exam-result-image";

      // Placeholder mientras carga
      const placeholder = document.createElement("div");
      placeholder.className = "exam-result-image-placeholder";
      placeholder.textContent = "Cargando imagen de referencia…";
      wrapper.appendChild(placeholder);

      // Crédito
      if (option.image_credit) {
        const credit = document.createElement("div");
        credit.className = "exam-result-image-credit";
        credit.textContent = option.image_credit;
        wrapper.appendChild(credit);
      }

      bubble.appendChild(wrapper);

      // Crear img fuera del DOM, sin lazy
      const img = new Image();
      img.alt = option.label;
      img.style.cssText = "width:100%;max-height:220px;object-fit:cover;display:block;border-radius:4px 4px 0 0";

      img.onload = () => {
        placeholder.replaceWith(img);
        div.scrollIntoView({ behavior: "smooth", block: "end" });
      };

      img.onerror = () => {
        placeholder.textContent = "Imagen de referencia no disponible.";
        placeholder.style.color = "var(--text-3)";
      };

      // Asignar src después de definir handlers  -  dispara la carga
      img.src = option.image_url;
    }

    div.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  //  -  -  Transcript en evaluación  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 
  function buildTranscriptHTML(simState, caseData) {
    const turns = simState.transcript || [];
    if (!turns.length) return '<p style="color:var(--text-3);font-style:italic;font-size:0.875rem">Sin transcript disponible.</p>';

    // Palabras clave de buenos comportamientos clínicos
    const goodPatterns  = [/salud[o]?|buenos días|buenas|cómo está|bienvenid/i, /antecedente|familiar|embarazo|cirugía|medicación/i, /cuándo empezó|evolución|tiempo|desde cuándo/i, /permiso|le explico|¿puedo|con su consentimiento/i];
    const badPatterns   = [/no sé|ni idea|cualquier cosa|lo que sea/i];
    const examPatterns  = [/examen|inspección|palpación|auscult|signos vitales/i];

    function markTurn(turn) {
      if (turn.type === "patient" || turn.type === "system") return null;
      const txt = (turn.text || "").toLowerCase();
      if (goodPatterns.some(p => p.test(txt))) return "good";
      if (badPatterns.some(p => p.test(txt)))  return "bad";
      return null;
    }

    const rows = turns.map(turn => {
      let roleLabel = "", roleCls = "", text = escHtml(turn.text || "");

      if (turn.type === "student") {
        roleLabel = "Médico"; roleCls = "role-student";
        const mark = markTurn(turn);
        const chip = mark
          ? `<span class="turn-mark ${mark}">${mark === "good" ? "✓ Bien" : "✗ Revisar"}</span>`
          : "";
        return `<div class="eval-transcript-turn">
          <span class="eval-transcript-role ${roleCls}">${roleLabel}</span>
          <span class="eval-transcript-text">${text}${chip}</span>
        </div>`;
      } else if (turn.type === "patient") {
        roleLabel = "Paciente"; roleCls = "role-patient";
      } else if (turn.type === "exam" || turn.type === "exam_panel") {
        roleLabel = "Examen"; roleCls = "role-exam";
        text = `<strong>${escHtml(turn.examId || "")}</strong>: ${text}`;
      } else if (turn.type === "study") {
        roleLabel = "Estudio"; roleCls = "role-exam";
        text = `<strong>${escHtml(turn.label || "")}</strong>: ${text}`;
      } else {
        roleLabel = "Escena"; roleCls = "role-system";
      }

      return `<div class="eval-transcript-turn">
        <span class="eval-transcript-role ${roleCls}">${roleLabel}</span>
        <span class="eval-transcript-text">${text}</span>
      </div>`;
    }).join("");

    const studentCount = turns.filter(t => t.type === "student").length;
    const patientCount = turns.filter(t => t.type === "patient").length;
    const examCount    = turns.filter(t => t.type === "exam" || t.type === "exam_panel").length;

    return `<div style="font-size:0.8rem;color:var(--text-3);margin-bottom:0.75rem">
        ${studentCount} preguntas · ${patientCount} respuestas del paciente · ${examCount} exámenes realizados
      </div>
      <div>${rows}</div>`;
  }

  return {
    showScreen, renderCaseList, updateTimer, appendTurn,
    showTypingIndicator, removeTypingIndicator,
    updateSidebar, openStudyModal, closeStudyModal,
    setStatus, renderEvaluation,
    renderExamPanel, appendExamPanelResult,
  };
})();
