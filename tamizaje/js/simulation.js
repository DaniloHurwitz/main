// ─── MOTOR DE SIMULACIÓN ─────────────────────────────────────────────────────
// Responsabilidad: estado oculto del caso, revelación de datos, trust, keywords.
// No toca el DOM. No llama a APIs.

const SimulationEngine = (() => {

  // Normaliza texto: minúsculas, sin acentos, sin puntuación extra
  function norm(str) {
    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!,.;:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ── EXÁMENES FÍSICOS ─────────────────────────────────────────────────────────
  // 15-20 sinónimos por examen para capturar lenguaje natural variado
  const EXAM_KEYWORDS = {
    inspeccion_genital: [
      "examinar la lesion","ver la lesion","mirar la lesion","observar la zona",
      "explorar genitales","inspeccion genital","examen de la zona","quiero ver",
      "mostrame la zona","descubrir la zona","evaluar la zona","examino la zona",
      "inspecciono la lesion","ver la zona genital","mirar la zona intima",
      "examen de genitales","examino genitales","reviso la lesion","veo la lesion",
      "observo la lesion","quiero mirar","quiero examinar la lesion"
    ],
    palpacion_ganglios_inguinales: [
      "palpar ganglios inguinales","palpo ganglios inguinales",
      "examinar ganglios inguinales","palpo las ingles","palpar las ingles",
      "busco ganglios en la ingle","ganglios inguinales","examino las ingles",
      "palpar la ingle","reviso los ganglios inguinales","busco adenopatias inguinales",
      "adenopatias inguinales","evaluo las ingles"
    ],
    palpacion_ganglios: [
      "palpar ganglios","palpo ganglios","examinar ganglios","palpo los ganglios",
      "examino los ganglios","busco ganglios","adenopatias","busco adenopatias",
      "palpo el cuello","palpar el cuello","examino el cuello","ganglios cervicales",
      "ganglios axilares","palpar axilas","palpo axilas","busco adenopatias cervicales",
      "palpar ganglios cervicales","reviso los ganglios"
    ],
    signos_vitales: [
      "tomar los signos vitales","tomo los signos vitales","medir signos vitales",
      "signos vitales","tomar la presion","mido la presion","medir la presion",
      "tomar la temperatura","tomo la temperatura","medir la frecuencia cardiaca",
      "tomar el pulso","mido el pulso","saturacion de oxigeno","frecuencia respiratoria",
      "tomo la tension","mido la tension","evaluo los signos","reviso los signos vitales",
      "presion arterial","tension arterial","frecuencia cardiaca","temperatura corporal"
    ],
    palpacion_abdomen: [
      "palpar el abdomen","palpo el abdomen","palpacion abdominal",
      "examinar el abdomen","examino el abdomen","palpar la panza","palpo la panza",
      "examinar la panza","reviso el abdomen","palpo el higado","palpar el higado",
      "palpo el bazo","busco hepatomegalia","busco esplenomegalia",
      "palpacion del higado","evaluo el abdomen","palpar el vientre",
      "signo de blumberg","rebote","signo de murphy","defensa abdominal",
      "punto de mcburney","palpo la fosa iliaca"
    ],
    evaluacion_glasgow: [
      "evaluo el glasgow","evaluar el glasgow","escala de glasgow",
      "aplico glasgow","glasgow","evaluo nivel de conciencia",
      "nivel de consciencia","nivel de conciencia","evaluacion neurologica basica",
      "respuesta al estimulo","evaluo respuesta ocular","escala de coma"
    ],
    examen_pupilas: [
      "examinar las pupilas","examino las pupilas","evaluo las pupilas",
      "reflejo fotomotor","isocoricas","pupilas","miro las pupilas",
      "ver las pupilas","revisar las pupilas","midriasis","miosis","anisocoria",
      "reflejo pupilar","ilumino los ojos","uso la linterna en los ojos"
    ],
    examen_neurologico: [
      "examen neurologico","examino neurologicamente","evaluo fuerza muscular",
      "evaluo reflejos","busco focalidad neurologica","examen motor",
      "evaluo la sensibilidad","evaluo el tono","reflejo patelar","reflejo aquileo",
      "signo de babinski","plantar","evaluo la marcha","evaluo coordinacion",
      "dismetria","evaluo pares craneales","fuerza en los miembros",
      "evaluo los cuatro miembros","evaluo fuerza"
    ],
    inspeccion_cabeza: [
      "inspeccionar la cabeza","examinar la cabeza","examino la cabeza",
      "inspecciono la cabeza","ver la cabeza","mirar la cabeza",
      "reviso la cabeza","busco heridas","busco hematoma","hematoma en la cabeza",
      "examino el craneo","inspeccionar el craneo","ver el craneo",
      "examinar el cuero cabelludo"
    ],
    palpacion_craneo: [
      "palpar el craneo","palpo el craneo","palpacion de craneo",
      "palpar la cabeza","palpo la cabeza","busco hundimiento",
      "evaluo el craneo","toco el craneo"
    ],
    inspeccion_piel: [
      "inspeccionar la piel","examinar el sarpullido","examino el sarpullido",
      "ver el sarpullido","inspeccion de piel","examino la piel",
      "ver el exantema","examinar el exantema","inspecciono el rash",
      "ver el rash","evaluo las lesiones de piel","inspeccionar el rash",
      "busco lesiones cutaneas","ver las manchas","examino las manchas"
    ],
    orofaringe: [
      "examinar la garganta","examino la garganta","ver la orofaringe",
      "examinar orofaringe","inspecciono la faringe","examino la faringe",
      "ver la garganta","revisar la garganta","mirar la garganta",
      "examinar la boca","ver la boca","abrir la boca","examen de faringe",
      "inspeccion oral","eritema faringeo"
    ],
    inspeccion_general: [
      "inspeccion general","examino al paciente","evaluacion general del paciente",
      "examen fisico general","examen fisico","examino al bebe","examino al nino",
      "examino al rn","examen del recien nacido","evaluo al paciente",
      "reviso al paciente","examen clinico","veo al paciente"
    ],
    examen_neonato: [
      "examinar al bebe","examino al bebe","examen neonatal","evaluo al recien nacido",
      "examino al recien nacido","examen del recien nacido","examen del neonato",
      "evaluo al neonato","examino al rn","reviso al bebe","tono muscular",
      "evaluo el tono","moro","reflejo de moro","succion","reflejo de succion",
      "fontanela","peso del bebe","antropometria"
    ],
    examen_caderas: [
      "examinar las caderas","examino las caderas","ortolani","barlow",
      "maniobra de ortolani","maniobra de barlow","abduccion de cadera",
      "evaluo las caderas","reviso las caderas","examen de cadera",
      "galeazzi","signo de galeazzi","simetria de pliegues","pliegues gluteos"
    ],
    examen_pediatrico: [
      "examen pediatrico","examino al nino","evaluo al nino","examen del nino",
      "reviso al nino","examen fisico pediatrico","examinar al nino",
      "otoscopia","examinar los oidos","examino los oidos","ver los oidos",
      "genitales","examino los genitales","examinar genitales"
    ],
    examen_mamario: [
      "examinar la mama","examino la mama","examen mamario","palpar la mama",
      "palpo la mama","examinar el seno","palpar el seno","palpar el nodulo",
      "palpo el nodulo","examinar el nodulo","palpacion mamaria",
      "examino el pecho","palpo el pecho","busco nodulos","reviso la mama"
    ],
    examen_ginecologico: [
      "examen ginecologico","examino ginecologicamente","especuloscopía",
      "especulo","coloco el especulo","examen con especulo","toucher vaginal",
      "tacto vaginal","examen de cuello","examinar el cuello uterino",
      "examen del cervix","movilizacion cervical","chandelier"
    ],
    auscultacion_cardiaca: [
      "auscultar el corazon","ausculto el corazon","auscultacion cardiaca",
      "escuchar el corazon","auscultar el torax","ausculto el torax",
      "auscultacion pulmonar","soplos","ruidos cardiacos","escuchar los ruidos",
      "ausculto","uso el estetoscopio","frote pericardico","galope"
    ],
    examen_reflejo_rojo: [
      "reflejo rojo","examinar el ojo","examino el ojo","ver los ojos",
      "usar el oftalmoscopio","oftalmoscopio","examen ocular","fondo de ojo",
      "evaluo los ojos","revisar los ojos","mirar los ojos","prueba del reflejo rojo",
      "leucocoria","evaluo la pupila del bebe"
    ],
    tacto_rectal: [
      "tacto rectal","examinar la prostata","examino la prostata",
      "palpar la prostata","palpo la prostata","examen rectal","tacto",
      "via rectal","examinar por via rectal"
    ],
    miembros_inferiores: [
      "examinar las piernas","examino las piernas","evaluo los miembros inferiores",
      "palpar las pantorrillas","palpo las pantorrillas","busco edemas",
      "edemas","homan","signo de homan","examinar los pies","examino los pies",
      "monofilamento","sensibilidad en los pies","reflejos en los pies"
    ],
  };

  // ── ESTUDIOS DIAGNÓSTICOS ────────────────────────────────────────────────────
  const STUDY_KEYWORDS = {
    // ITS
    vdrl:                ["vdrl","serologia para sifilis","tamizaje sifilis","rpr","prueba no treponemical para sifilis"],
    fta_abs:             ["fta-abs","fta abs","tpha","prueba treponemical","confirmar sifilis","treponema pallidum"],
    vih:                 ["vih","hiv","test de vih","serologia vih","elisa vih","test vih","prueba de vih","testeo de vih"],
    vih_4gen:            ["cuarta generacion","ag p24","test vih 4","vih cuarta","4 generacion","antígeno p24"],
    hepatitis_b:         ["hepatitis b","hbsag","antigeno de hepatitis b","marcador de hepatitis b"],
    hepatitis_c:         ["hepatitis c","anti hcv","anticuerpos hepatitis c","marcadores hepatitis c"],
    naat:                ["naat","clamidia","gonococo","gonorrea","pcr clamidia","pcr gonorrea","pcr para clamidia"],
    pcr_vhs:             ["pcr vhs","pcr herpes","herpes","vhs","virus herpes simple"],
    // Neurología / TEC
    tc_craneo:           ["tomografia de craneo","tc de craneo","tac de craneo","tc cerebral","tomografia cerebral","scanner de craneo","tomografia computada de craneo"],
    rx_craneo:           ["radiografia de craneo","rx de craneo","placa de craneo","radiografia de cabeza"],
    // Hematología
    hemograma:           ["hemograma","hematologia","recuento globular","recuento sanguineo","cbc"],
    grupo_rh_rn:         ["grupo y rh","grupo sanguineo","factor rh","tipificacion","tipo de sangre"],
    coombs_directo:      ["coombs","coombs directo","prueba de antiglobulina","antiglobulina directa"],
    // Bioquímica general
    hepatograma:         ["hepatograma","transaminasas","tgp","tgo","ast","alt","funcion hepatica","enzimas hepaticas","ggt","fosfatasa alcalina"],
    bilirrubina_total:   ["bilirrubina","bilirrubina total","bilirrubina directa","bilirrubina indirecta","fraccion directa"],
    bilirrubina_fracciones: ["bilirrubina directa","bilirrubina indirecta","fraccion directa","patron colestatico"],
    glucemia:            ["glucemia","azucar en sangre","glucosa","glucosa en sangre","glucemia en ayunas"],
    hba1c:               ["hemoglobina glicosilada","hba1c","hb glicosilada","hemoglobina a1c","glicada"],
    lipidos:             ["perfil lipidico","colesterol","ldl","hdl","trigliceridos","lipidos","colesterolemia"],
    creatinina:          ["creatinina","funcion renal","tasa de filtrado","filtrado glomerular","clearance de creatinina"],
    microalbuminuria:    ["microalbuminuria","albumina en orina","proteinuria","albumina urinaria"],
    pcr_hemograma:       ["pcr","proteina c reactiva","reactantes de fase aguda","inflamacion"],
    tsh:                 ["tsh","tiroides","funcion tiroidea","tiroxina","t4","hipotiroidismo"],
    // Orina
    sedimento_urinario:  ["sedimento urinario","analisis de orina","orina completa","urina","leucocituria","nitrito","tira reactiva"],
    urocultivo:          ["urocultivo","cultivo de orina","cultivo urinario"],
    // Cardiovascular
    ecg:                 ["ecg","electrocardiograma","electro","ecgrama","ekg","trazado cardiaco"],
    troponina:           ["troponina","marcadores de necros","marcadores cardiacos","enzimas cardiacas"],
    ddimero:             ["dimero d","d-dimero","fibrinogeno degradacion"],
    // Imágenes
    rx_torax:            ["radiografia de torax","rx de torax","placa de torax","radiografia de pecho","rx torax"],
    ecografia_abdominal: ["ecografia abdominal","eco abdominal","ecografia de abdomen","ultrasonido abdominal"],
    ecografia_renal:     ["ecografia renal","eco renal","ecografia de rinon","ultrasonido renal"],
    ecografia_pelvica:   ["ecografia pelvica","eco pelvica","ecografia de pelvis","ultrasonido pelvico"],
    ecografia_mamaria:   ["ecografia mamaria","eco mamaria","ecografia de mama","ultrasonido mamario"],
    mamografia:          ["mamografia","mamografía","estudio de mama","mammografia"],
    angiotc:             ["angio tc","angiotomografia","angio tomografia","tc de torax","tomografia de torax","angio tac"],
    colonoscopia:        ["colonoscopia","colonoscopía","colono","endoscopia de colon","videoconoscopía"],
    cistouretrografia:   ["cistouretrografia","cug","cistografia","uretrocistografia","cistouretrografía"],
    centellograma_dmsa:  ["centellograma","dmsa","centellograma renal","medicina nuclear renal","gammagrafia renal"],
    ecografia_caderas:   ["ecografia de cadera","eco de caderas","ultrasonido de cadera","ecografia de caderita"],
    rx_cadera:           ["radiografia de cadera","rx de cadera","placa de cadera","radiografia de cadera"],
    densitometria:       ["densitometria","densidad osea","dexa","densitometría osea"],
    // Ginecología / Oncología
    pap:                 ["pap","papanicolaou","citologia cervical","frotis cervical","citologia"],
    test_vph_reflejo:    ["test de vph","test vph","prueba de vph","vph","hpv","papilomavirus"],
    colposcopia:         ["colposcopia","colposcopía","examen colposcopico"],
    biopsia_core:        ["biopsia","core biopsia","biopsia de mama","biopsia core"],
    somf:                ["somf","sangre oculta","materia fecal","heces oculta","hemoccult"],
    psa:                 ["psa","antigeno prostatico","antígeno prostático específico"],
    // Neonatal / Pediátrico
    oea_repeticion:      ["otoemisiones","oea","otoemisiones acusticas","test de audicion","audiometria neonatal"],
    tshs_t4_confirmacion:["tsh serico","t4 libre","hormona tiroidea suerica","confirmar hipotiroidismo"],
    anticuerpos_celiaca: ["anticuerpos para celiaqua","transglutaminasa","ttg","antitransglutaminasa","iga celiaca","anti-ttg"],
    bilirrubina_fracciones_neonatal: ["bilirrubina neonatal","bilirrubina del bebe","medir la bilirrubina"],
    // Respiratorio / Infeccioso
    monotest:            ["monotest","mononucleosis","paul-bunnell","test para mono"],
    gasometria:          ["gases en sangre","gasometria","saturacion arterial","gases arteriales","ph arterial"],
    // Otros
    audit_score:         ["audit","cuestionario de alcohol","test de alcohol","evaluo el consumo","escala audit"],
    rx_muneca:           ["radiografia de muneca","rx de muneca","placa de muneca","radiografia de brazo","rx de antebrazo"],
  };

  function detectPhysicalExam(text) {
    const n = norm(text);
    const detected = [];
    for (const [examId, keywords] of Object.entries(EXAM_KEYWORDS)) {
      if (keywords.some(k => n.includes(norm(k)))) detected.push(examId);
    }
    return detected;
  }

  function detectStudyRequest(text) {
    const n = norm(text);
    const detected = [];
    for (const [studyId, keywords] of Object.entries(STUDY_KEYWORDS)) {
      if (keywords.some(k => n.includes(norm(k)))) detected.push(studyId);
    }
    return detected;
  }

  function updateTrust(currentTrust, studentText) {
    const lower = studentText.toLowerCase();
    let delta = 0;
    if (/buenos? días|buenas|hola|cómo está|como esta|cómo se siente|como se siente/.test(lower)) delta += 5;
    if (/por qué|para qué|le explico|le voy a explicar|entiendo su preocupación/.test(lower)) delta += 4;
    if (/entiendo|comprendo|claro|gracias|de acuerdo/.test(lower)) delta += 3;
    if (/puede ser|podría|sin problema|cuando quiera|tómese su tiempo/.test(lower)) delta += 2;
    if (lower.length < 8) delta -= 3;
    return Math.min(100, Math.max(0, currentTrust + delta));
  }

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
      examPanelUsed: [],          // ids de opciones del panel interactivo usadas
      examPanelPoints: 0,         // puntos acumulados del panel
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

    const examResults = detectedExams
      .filter(eid => caseData.hidden_state.physical_exam.findings[eid])
      .map(eid => ({
        examId: eid,
        result: caseData.hidden_state.physical_exam.findings[eid]
      }));

    const newStudies = detectedStudies
      .filter(sid => !state.studiesRequested.includes(sid))
      .map(sid => caseData.hidden_state.studies.indicated.find(s => s.id === sid) || { id: sid, label: sid, result: "Pendiente" });

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
      newStudies,
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

  // ── PANEL DE EXAMEN FÍSICO INTERACTIVO ──────────────────────────────────────

  // Evalúa si un examen del panel puede realizarse dado el estado actual
  function canPerformExam(examOption, state) {
    // Ya realizado
    if (state.examPanelUsed.includes(examOption.id)) return "done";
    // Sin requisito: siempre disponible
    if (!examOption.requires_data) return "available";
    // Verificar si el dato requerido fue revelado
    const dataRevealed = state.clinicalData.some(
      d => d.id === examOption.requires_data && d.revealed
    );
    return dataRevealed ? "available" : "locked";
  }

  // Procesa una opción del panel de examen físico
  // Devuelve el nuevo estado y el resultado del examen
  function performExamOption(state, caseData, examOption) {
    const finding = caseData.hidden_state.physical_exam.findings[examOption.id] || null;

    // Revelar datos clínicos asociados al examen
    const updatedData = state.clinicalData.map(d => {
      if (!d.revealed && d.exam_required && (d.exam_ids || []).includes(examOption.id)) {
        return { ...d, revealed: true };
      }
      return d;
    });

    const newExamPanelUsed   = [...state.examPanelUsed, examOption.id];
    const newExamPanelPoints = state.examPanelPoints + (examOption.points || 0);
    const newExamsPerformed  = [...new Set([...state.physicalExamsPerformed, examOption.id])];

    return {
      newState: {
        ...state,
        clinicalData:        updatedData,
        physicalExamsPerformed: newExamsPerformed,
        examPanelUsed:       newExamPanelUsed,
        examPanelPoints:     newExamPanelPoints,
      },
      finding,
      examOption,
    };
  }

  // Resumen del panel para la evaluación
  function getExamPanelSummary(state, caseData) {
    const panel = caseData.hidden_state.exam_panel || [];
    const used  = state.examPanelUsed;
    const necessary   = panel.filter(e => e.pertinence === "necessary").map(e => e.id);
    const unnecessary = panel.filter(e => e.pertinence === "unnecessary").map(e => e.id);
    return {
      performed:           used,
      necessary_done:      used.filter(id => necessary.includes(id)),
      unnecessary_done:    used.filter(id => unnecessary.includes(id)),
      necessary_missed:    necessary.filter(id => !used.includes(id)),
      points:              state.examPanelPoints,
      has_panel:           panel.length > 0,
    };
  }

  return {
    createState,
    processStudentTurn,
    getRevealedData,
    getCoverage,
    detectPhysicalExam,
    detectStudyRequest,
    canPerformExam,
    performExamOption,
    getExamPanelSummary,
  };
})();
