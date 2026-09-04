// ─── SERVICIO DE API ──────────────────────────────────────────────────────────
// Responsabilidad: construcción de prompts y llamadas a la API de Anthropic.
// Para cambiar de modelo o proveedor: solo modificar este archivo.

const ApiService = (() => {
  const MODEL = "claude-sonnet-4-6";
  const MAX_TOKENS = 1000;
  const ENDPOINT = "https://api.anthropic.com/v1/messages";

  async function callClaude(systemPrompt, conversationHistory) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: conversationHistory
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);
    const block = data.content.find(b => b.type === "text");
    return block?.text || "";
  }

  // ── Agente paciente ─────────────────────────────────────────────────────────
  function buildPatientPrompt(caseData, trustLevel, revealedData) {
    const revealedStr = revealedData.length
      ? revealedData.map(d => `- ${d.value}`).join("\n")
      : "Ninguna todavía.";

    const trustDesc = trustLevel < 40
      ? "BAJA — sé más resistente a dar información sensible"
      : trustLevel < 65
        ? "MEDIA — podés responder preguntas sensibles si están bien formuladas"
        : "ALTA — podés revelar información sensible si te la preguntan directamente";

    return `${caseData.patient_persona_prompt}

NIVEL DE CONFIANZA ACTUAL: ${trustLevel}/100 (${trustDesc})

INFORMACIÓN YA REVELADA EN LA CONSULTA (no la repitas, pero podés confirmarla):
${revealedStr}

REGLA FINAL: Respondé SOLO como el paciente. Nunca rompas el personaje.
Nunca ofrezcas información que no fue preguntada.
Máximo 3-4 oraciones por respuesta. Español rioplatense coloquial.`;
  }

  async function getPatientResponse(caseData, trustLevel, revealedData, conversationHistory) {
    const system = buildPatientPrompt(caseData, trustLevel, revealedData);
    return await callClaude(system, conversationHistory);
  }

  // ── Agente evaluador ────────────────────────────────────────────────────────
  function buildEvaluatorPrompt(caseData, simState) {
    const discovered = simState.clinicalData.filter(d => d.revealed);
    const transcript = simState.transcript
      .filter(t => t.type === "student" || t.type === "patient")
      .map(t => `[${t.type === "student" ? "ESTUDIANTE" : "PACIENTE"}] ${t.text}`)
      .join("\n");

    return `Sos un evaluador de competencias clínicas para Tamizaje y Ciencias del Diagnóstico (UNMdP).

CASO REAL:
- Diagnóstico: ${caseData.diagnosis_label}
- Diferenciales correctos: ${caseData.differentials.join(", ")}
- Datos críticos del caso: ${(caseData.hidden_state.critical_data_ids || []).join(", ")}
- Errores comunes: ${(caseData.hidden_state.common_errors || []).join("; ")}

DATOS DESCUBIERTOS POR EL ESTUDIANTE (${discovered.length}/${simState.clinicalData.length}):
${discovered.map(d => `✓ [${d.importance}] ${d.id}: ${d.value}`).join("\n") || "Ninguno"}

DATOS NO DESCUBIERTOS:
${simState.clinicalData.filter(d => !d.revealed).map(d => `✗ [${d.importance}] ${d.id}`).join("\n") || "Ninguno"}

EXÁMENES REALIZADOS: ${simState.physicalExamsPerformed.join(", ") || "Ninguno"}
ESTUDIOS SOLICITADOS: ${simState.studiesRequested.join(", ") || "Ninguno"}
DIAGNÓSTICO DECLARADO: ${simState.finalDiagnosis || "No declarado"}
DIFERENCIALES DECLARADOS: ${simState.finalDifferentials || "Ninguno"}

TRANSCRIPT:
${transcript}

PESOS DE RÚBRICA: ${JSON.stringify(caseData.hidden_state.rubric_weights)}

Evaluá cada dimensión con un número 0-100 basado ÚNICAMENTE en evidencia observable del transcript.
Respondé SOLO JSON válido sin bloques de código:
{
  "scores": {
    "apertura": {"score": 0-100, "evidence": ["evidencia concreta 1", "evidencia 2"]},
    "anamnesis": {"score": 0-100, "evidence": ["..."]},
    "comunicacion": {"score": 0-100, "evidence": ["..."]},
    "examen_fisico": {"score": 0-100, "evidence": ["..."]},
    "razonamiento": {"score": 0-100, "evidence": ["..."]},
    "diagnostico": {"score": 0-100, "evidence": ["..."]},
    "estudios": {"score": 0-100, "evidence": ["..."]}
  },
  "coverage_percent": 0-100,
  "critical_covered": 0-4,
  "diagnosis_correct": true/false,
  "missed_critical": ["dato crítico no descubierto con consecuencia clínica"],
  "main_errors": ["error principal 1", "error 2"]
}`;
  }

  async function getEvaluation(caseData, simState) {
    const system = buildEvaluatorPrompt(caseData, simState);
    const raw = await callClaude(system, [{ role: "user", content: "Evaluá la consulta." }]);
    try {
      return JSON.parse(raw.replace(/```(?:json)?|```/g, "").trim());
    } catch {
      return { scores: {}, coverage_percent: 0, diagnosis_correct: false, missed_critical: [], main_errors: ["Error al parsear evaluación"] };
    }
  }

  // ── Agente debriefing ───────────────────────────────────────────────────────
  function buildDebriefingPrompt(caseData, evaluation, studentReflection) {
    return `Sos un docente de Tamizaje y Ciencias del Diagnóstico (UNMdP). Generás el debriefing post-simulación.

CASO: ${caseData.diagnosis_label}
EVALUACIÓN OBJETIVA: ${JSON.stringify(evaluation)}
REFLEXIÓN DEL ESTUDIANTE: ${studentReflection || "No proporcionó reflexión."}

Generá un debriefing educativo, específico y honesto. Cada punto debe ser concreto y referirse a lo que realmente ocurrió.
Respondé SOLO JSON válido sin bloques de código:
{
  "bien_hecho": ["logro específico basado en evidencia 1", "logro 2"],
  "mejorar": ["aspecto concreto a mejorar con sugerencia práctica 1", "aspecto 2"],
  "no_detecto": ["dato no descubierto con su impacto clínico"],
  "errores_clinicos": ["error de razonamiento o conocimiento específico, si hubo"],
  "evaluacion_diagnostico": "Análisis del diagnóstico propuesto vs real, en 2-3 oraciones",
  "aprendizaje_recomendado": "Sección curricular o concepto específico a repasar",
  "objetivo_proxima": "Un objetivo concreto y medible para la próxima simulación",
  "percepcion_vs_realidad": "Comparación entre lo que creyó que hizo bien y lo que realmente hizo"
}`;
  }

  async function getDebriefing(caseData, evaluation, studentReflection) {
    const system = buildDebriefingPrompt(caseData, evaluation, studentReflection);
    const raw = await callClaude(system, [{ role: "user", content: "Generá el debriefing." }]);
    try {
      return JSON.parse(raw.replace(/```(?:json)?|```/g, "").trim());
    } catch {
      return { bien_hecho: [], mejorar: [], aprendizaje_recomendado: "Revisar el contenido del caso.", objetivo_proxima: "Practicar anamnesis completa." };
    }
  }

  return { getPatientResponse, getEvaluation, getDebriefing };
})();
