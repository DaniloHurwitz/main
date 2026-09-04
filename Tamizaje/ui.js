// ─── RENDERIZADO DE UI ────────────────────────────────────────────────────────
// Responsabilidad: manipulación del DOM. No contiene lógica de negocio.

const UI = (() => {

  // ── Pantallas ──────────────────────────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById("screen-" + id);
    if (target) { target.classList.add("active"); }
  }

  // ── Home ───────────────────────────────────────────────────────────────────
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

  // ── Timer ──────────────────────────────────────────────────────────────────
  function updateTimer(secondsLeft) {
    const el = document.getElementById("timer-display");
    if (!el) return;
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    el.textContent = `${m}:${s}`;
    const box = document.getElementById("timer-box");
    if (!box) return;
    box.className = "timer";
    if (secondsLeft <= 120) box.classList.add("critical");
    else if (secondsLeft <= 300) box.classList.add("warning");
  }

  // ── Transcript ─────────────────────────────────────────────────────────────
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

  // ── Sidebar / ficha clínica ────────────────────────────────────────────────
  const CAT_LABELS = {
    "Enfermedad actual": "Enfermedad actual",
    "Síntomas asociados": "Síntomas asociados",
    "Antecedentes sexuales": "Antecedentes sexuales",
    "Antecedentes": "Antecedentes",
    "Gineco-obstétrico": "Gineco-obstétrico",
    "Examen físico": "Examen físico",
    "Preocupación": "Preocupación del paciente",
  };

  function updateSidebar(simState, caseData) {
    const revealed = simState.clinicalData.filter(d => d.revealed);
    const total = simState.clinicalData.length;
    const criticalIds = caseData.hidden_state.critical_data_ids || [];

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
        item.textContent = "✓ " + e.replace(/_/g, " ");
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
          ? `<span style="color:var(--success)">→ ${study.label}</span><br><span style="font-size:0.75rem;font-family:var(--font-mono)">${study.result}</span>`
          : `<span style="color:var(--text-3)">→ ${sid}</span>`;
        section.appendChild(item);
      });
      body.appendChild(section);
    }
  }

  // ── Study modal ────────────────────────────────────────────────────────────
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

  // ── Status bar ─────────────────────────────────────────────────────────────
  function setStatus(type, text) {
    const bar = document.getElementById("status-bar");
    if (!bar) return;
    if (!type) { bar.innerHTML = ""; return; }
    const icons = { listening: "●", speaking: "●", processing: "●", error: "" };
    bar.innerHTML = `<span class="status-${type}">${icons[type] ? `<span class="status-dot"></span>` : ""}${escHtml(text)}</span>`;
  }

  // ── Evaluation screen ──────────────────────────────────────────────────────
  function renderEvaluation(evaluation, debriefing, caseData, simState) {
    const weights = caseData.hidden_state.rubric_weights;
    const total = computeTotal(evaluation.scores, weights);

    const scoreClass = total >= 80 ? "good" : total >= 60 ? "ok" : "low";

    const dimLabels = {
      apertura: "Apertura", anamnesis: "Anamnesis", comunicacion: "Comunicación",
      examen_fisico: "Examen físico", razonamiento: "Razonamiento",
      diagnostico: "Diagnóstico", estudios: "Estudios"
    };

    const container = document.getElementById("eval-content");
    if (!container) return;

    // Header
    let headerHtml = `
      <div class="eval-header">
        <div class="eval-score-circle ${scoreClass}">
          <div class="eval-score-num">${total}</div>
          <div class="eval-score-label">/ 100</div>
        </div>
        <div class="eval-header-right">
          <h2 style="font-family:var(--font-serif);margin-bottom:0.25rem">Evaluación · ${caseData.topic_label}</h2>
          <div style="font-size:0.875rem;color:var(--text-2);margin-bottom:0.5rem">
            ${total >= 80 ? "Buen desempeño" : total >= 60 ? "Desempeño aceptable" : "Requiere práctica"}
          </div>
          <div class="eval-diagnosis-row">
            <span style="font-size:0.875rem;color:var(--text-2)">Diagnóstico propuesto:</span>
            <span class="eval-diag-badge ${evaluation.diagnosis_correct ? "eval-diag-correct" : "eval-diag-wrong"}">
              ${evaluation.diagnosis_correct ? "Correcto ✓" : "Incorrecto ✗"}
            </span>
          </div>
        </div>
      </div>`;

    // Score grid
    let gridHtml = '<div class="eval-grid">';
    for (const [dim, data] of Object.entries(evaluation.scores || {})) {
      const sc = data.score;
      const cls = sc >= 80 ? "good" : sc >= 60 ? "ok" : "low";
      gridHtml += `
        <div class="eval-card">
          <div class="eval-card-header">
            <span class="eval-card-title">${dimLabels[dim] || dim}</span>
            <span class="eval-card-score ${cls}">${sc}</span>
          </div>
          <div class="eval-score-bar">
            <div class="eval-score-fill ${cls}" style="width:${sc}%"></div>
          </div>
          ${(data.evidence || []).slice(0, 2).map(e => `<div class="eval-evidence-item">· ${escHtml(e)}</div>`).join("")}
        </div>`;
    }
    gridHtml += "</div>";

    // Diagnosis compare
    const diagCompare = `
      <div class="eval-diag-compare">
        <div>
          <div class="eval-diag-col-label">Tu hipótesis</div>
          <div class="eval-diag-col-value">${escHtml(simState.finalDiagnosis || "No declarado")}</div>
          <div class="eval-diag-col-diff">${escHtml(simState.finalDifferentials || "")}</div>
        </div>
        <div>
          <div class="eval-diag-col-label">Diagnóstico real</div>
          <div class="eval-diag-col-value">${escHtml(caseData.diagnosis_label)}</div>
          <div class="eval-diag-col-diff">Diferenciales: ${escHtml(caseData.differentials.join(", "))}</div>
        </div>
      </div>
      ${debriefing.evaluacion_diagnostico ? `<div class="debriefing-section"><p style="font-size:0.875rem;color:var(--text-2)">${escHtml(debriefing.evaluacion_diagnostico)}</p></div>` : ""}`;

    // Debriefing sections
    function debriefSection(title, items, className) {
      if (!items || !items.length) return "";
      return `
        <div class="debriefing-section">
          <div class="debriefing-section-title ${className}">${title}</div>
          ${items.map(i => `<div class="debriefing-item">${escHtml(i)}</div>`).join("")}
        </div>`;
    }

    const debriefHtml = `
      ${debriefSection("Lo que hiciste bien", debriefing.bien_hecho, "good")}
      ${debriefSection("A mejorar", debriefing.mejorar, "warn")}
      ${debriefSection("Información no descubierta", debriefing.no_detecto, "bad")}
      ${debriefSection("Errores clínicos", debriefing.errores_clinicos, "bad")}
    `;

    // Missed critical
    const missedHtml = evaluation.missed_critical?.length
      ? `<div class="debriefing-section">
           <div class="debriefing-section-title bad">Datos críticos omitidos</div>
           ${evaluation.missed_critical.map(m => `<div class="debriefing-item">${escHtml(m)}</div>`).join("")}
         </div>`
      : "";

    // Objective
    const objHtml = `
      <div class="objective-box">
        <div class="objective-box-label">Objetivo para la próxima simulación</div>
        <div class="objective-box-text">${escHtml(debriefing.objetivo_proxima || "")}</div>
      </div>
      <div class="debriefing-section">
        <div class="debriefing-section-title info">Aprendizaje recomendado</div>
        <div class="debriefing-item">${escHtml(debriefing.aprendizaje_recomendado || "")}</div>
      </div>`;

    container.innerHTML = headerHtml + gridHtml + diagCompare + debriefHtml + missedHtml + objHtml;
  }

  // ── Utils ──────────────────────────────────────────────────────────────────
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

  return {
    showScreen, renderCaseList, updateTimer, appendTurn,
    showTypingIndicator, removeTypingIndicator,
    updateSidebar, openStudyModal, closeStudyModal,
    setStatus, renderEvaluation,
  };
})();
