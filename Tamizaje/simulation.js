// ─── MOTOR DE SIMULACIÓN ─────────────────────────────────────────────────────
// Responsabilidad: estado oculto del caso, revelación de datos, trust, keywords.
// No toca el DOM. No llama a APIs.

const SimulationEngine = (() => {

  // Normaliza texto para comparación sin acentos ni mayúsculas
  function norm(str) {
    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Exámenes físicos: solo frases de acción explícita para evitar falsos positivos
  const EXAM_KEYWORDS = {
    inspeccion_genital:           ["examinar la lesion", "ver la lesion", "inspeccion genital", "examino la zona genital", "examen genital", "quiero ver la lesion", "inspeccionar la lesion", "examen de la zona"],
    palpacion_ganglios_inguinales:["palpar ganglios inguinales", "palpo ganglios inguinales", "examinar ganglios inguinales", "palpo las ingles"],
    palpacion_ganglios:           ["palpar ganglios", "palpo ganglios", "examinar ganglios", "palpo los ganglios", "examino los ganglios"],
    signos_vitales:               ["tomar los signos vitales", "tomo los signos vitales", "medir signos vitales", "signos vitales", "tomar la presion arterial", "mido la presion"],
    palpacion_abdomen:            ["palpar el abdomen", "palpo el abdomen", "palpacion abdominal", "examinar el abdomen", "examino el abdomen"],
    evaluacion_glasgow:           ["evaluo el glasgow", "evaluar el glasgow", "escala de glasgow", "aplico glasgow", "escala de glasglow"],
    examen_pupilas:               ["examinar las pupilas", "examino las pupilas", "evaluo las pupilas", "reflejo fotomotor", "isocoricas"],
    examen_neurologico:           ["examen neurologico", "examino neurologicamente", "evaluo fuerza muscular", "evaluo reflejos", "busco focalidad neurologica", "examen motor"],
    inspeccion_cabeza:            ["inspeccionar la cabeza", "examinar la cabeza", "examino la cabeza", "inspecciono la cabeza", "palpar el craneo", "palpo el craneo", "inspecciono el craneo"],
    palpacion_craneo:             ["palpar el craneo", "palpo el craneo", "palpacion de craneo"],
    inspeccion_piel:              ["inspeccionar la piel", "examinar el sarpullido", "examino el sarpullido", "ver el sarpullido", "inspeccion de piel", "examino la piel"],
    orofaringe:                   ["examinar la garganta", "examino la garganta", "ver la orofaringe", "examinar orofaringe", "inspecciono la faringe", "examino la faringe"],
    inspeccion_general:           ["inspeccion general", "examino al paciente", "evaluacion general del paciente", "examen fisico general"],
  };

  // Estudios: keywords para detección en texto libre
  const STUDY_KEYWORDS = {
    vdrl:        ["vdrl", "serologia para sifilis", "tamizaje sifilis", "rpr"],
    fta_abs:     ["fta-abs", "tpha", "prueba treponemical", "confirmar sifilis", "fta abs"],
    vih:         ["vih", "hiv", "test de vih", "serologia vih", "elisa vih", "test vih"],
    vih_4gen:    ["cuarta generacion", "ag p24", "test vih 4", "vih cuarta", "4 generacion"],
    hepatitis_b: ["hepatitis b", "hbsag", "antigeno de hepatitis"],
    naat:        ["naat", "clamidia", "gonococo", "gonorrea", "pcr clamidia"],
    tc_craneo:   ["tomografia de craneo", "tc de craneo", "tac de craneo", "tc cerebral", "tomografia cerebral", "scanner de craneo"],
    hemograma:   ["hemograma", "hematologia", "recuento globular"],
    hepatograma: ["hepatograma", "transaminasas", "tgp", "tgo", "ast", "alt"],
    monotest:    ["monotest", "mononucleosis", "paul-bunnell"],
    rx_craneo:   ["radiografia de craneo", "rx de craneo", "placa de craneo"],
  };

  function detectPhysicalExam(text) {
    const n = norm(text);
    const detected = [];
    for (const [examId, keywords] of Object.entries(EXAM_KEYWORDS)) {
      if (keywords.some(k => n.includes(k))) detected.push(examId);
    }
    return detected;
  }

  function detectStudyRequest(text) {
    const n = norm(text);
    const detected = [];
    for (const [studyId, keywords] of Object.entries(STUDY_KEYWORDS)) {
      if (keywords.some(k => n.includes(k))) detected.push(studyId);
    }
    return detected;
  }

  function updateTrust(currentTrust, studentText) {
    const lower = studentText.toLowerCase();
    let delta = 0;
    if (/buenos? días|buenas|hola|cómo está|como esta/.test(lower)) delta += 5;
    if (/por qué|para qué|le explico|le voy a explicar/.test(lower)) delta += 4;
    if (/entiendo|comprendo|claro|gracias/.test(lower)) delta += 3;
    if (/puede ser|podría|sin problema|cuando quiera/.test(lower)) delta += 2;
    if (lower.length < 8) delta -= 3;
    return Math.min(100, Math.max(0, currentTrust + delta));
  }

  // Determina qué datos se revelan dado el texto del estudiante y los exámenes detectados
  function revealData(clinicalData, studentText, newTrust, detectedExams) {
    const n = norm(studentText);
    return clinicalData.map(d => {
      if (d.revealed) return d;
      if (newTrust < d.reveal_threshold_trust) return d;

      if (d.exam_required) {
        const examMatch = (d.exam_ids || []).some(eid => detectedExams.includes(eid));
        return examMatch ? { ...d, revealed: true } : d;
      }

      const matched = (d.keywords || []).some(k => n.includes(norm(k)));
      return matched ? { ...d, revealed: true } : d;
    });
  }

  function createState(caseData) {
    return {
      caseId: caseData.id,
      trustLevel: caseData.personality.trust_base,
      clinicalData: caseData.hidden_state.clinical_data.map(d => ({ ...d })),
      transcript: [],
      physicalExamsPerformed: [],
      studiesRequested: [],
      questionCount: 0,
      startTime: Date.now(),
    };
  }

  function processStudentTurn(state, caseData, studentText) {
    const newTrust = updateTrust(state.trustLevel, studentText);
    const detectedExams = detectPhysicalExam(studentText);
    const detectedStudies = detectStudyRequest(studentText);
    const updatedData = revealData(state.clinicalData, studentText, newTrust, detectedExams);
    const updatedExams = [...new Set([...state.physicalExamsPerformed, ...detectedExams])];
    const updatedStudies = [...new Set([...state.studiesRequested, ...detectedStudies])];

    // Resultados de examen físico (van como turnos de sistema)
    const examResults = detectedExams
      .filter(eid => caseData.hidden_state.physical_exam.findings[eid])
      .map(eid => ({
        examId: eid,
        result: caseData.hidden_state.physical_exam.findings[eid]
      }));

    // Resultados de estudios (van como turnos de sistema)
    const studyResults = detectedStudies
      .map(sid => caseData.hidden_state.studies.indicated.find(s => s.id === sid))
      .filter(Boolean)
      .filter(s => !state.studiesRequested.includes(s.id)); // solo nuevos

    return {
      newState: {
        ...state,
        trustLevel: newTrust,
        clinicalData: updatedData,
        physicalExamsPerformed: updatedExams,
        studiesRequested: updatedStudies,
        questionCount: state.questionCount + 1,
      },
      detectedExams,
      detectedStudies,
      examResults,
      studyResults,
    };
  }

  function getRevealedData(state) {
    return state.clinicalData.filter(d => d.revealed);
  }

  function getCoverage(state, caseData) {
    const total = state.clinicalData.length;
    const revealed = state.clinicalData.filter(d => d.revealed).length;
    const criticalIds = caseData.hidden_state.critical_data_ids || [];
    const criticalRevealed = state.clinicalData.filter(d => d.revealed && criticalIds.includes(d.id)).length;
    return {
      total, revealed,
      criticalTotal: criticalIds.length,
      criticalRevealed,
      percent: total ? Math.round((revealed / total) * 100) : 0,
    };
  }

  return {
    createState,
    processStudentTurn,
    getRevealedData,
    getCoverage,
    detectPhysicalExam,
    detectStudyRequest,
  };
})();
