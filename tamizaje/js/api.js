//  - -- - -- - -- SERVICIO DE API  - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - --
// Proveedor: Google Gemini
// Modelo: gemini-2.5-flash  - -- mejor precio/rendimiento, baja latencia
// API key: se guarda en localStorage, nunca en el código fuente del repo

const ApiService = (() => {
  const MODEL    = "gemini-3.5-flash-lite";

  // Apunta al Cloudflare Worker — cambia la URL por la tuya tras hacer wrangler deploy
  const WORKER_URL = "https://simulador-tamizaje-proxy.tamizaje-unmdp.workers.dev";

  function _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
 
  async function callGemini(systemPrompt, conversationHistory, _attempt = 0) {
    const contents = conversationHistory.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
 
    let res, data;
    try {
      res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.3 }
        })
      });
      data = await res.json();
    } catch (networkErr) {
      if (_attempt < 2) {
        await _wait(1500 * (_attempt + 1));
        return callGemini(systemPrompt, conversationHistory, _attempt + 1);
      }
      throw new Error("NETWORK_ERROR");
    }
 
    if ((res.status === 429 || res.status === 503) && _attempt < 3) {
      const delay = [2000, 5000, 10000][_attempt] ?? 10000;
      await _wait(delay);
      return callGemini(systemPrompt, conversationHistory, _attempt + 1);
    }
 
    if (!res.ok) {
      const err = new Error(data?.error?.message || `Error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
 
  //  - -- - -- Agente paciente  - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - --
  function buildPatientPrompt(caseData, trustLevel, revealedData) {
    const revealedStr = revealedData.length
      ? revealedData.map(d => `- ${d.value}`).join("\n")
      : "Ninguna todavía.";
 
    const trustDesc = trustLevel < 40
      ? "BAJA  - -- sé resistente a dar información sensible"
      : trustLevel < 65
        ? "MEDIA  - -- podés responder preguntas sensibles si están bien formuladas"
        : "ALTA  - -- podés revelar información sensible si te la preguntan directamente";
 
    return `${caseData.patient_persona_prompt}
 
NIVEL DE CONFIANZA ACTUAL: ${trustLevel}/100 (${trustDesc})
 
INFORMACIÓ-N YA REVELADA EN LA CONSULTA (no la repitas, podés confirmarla si preguntan):
${revealedStr}
 
REGLA FINAL: Respondé SOLO como el paciente. Nunca rompas el personaje.
Nunca ofrezcas información que no fue preguntada.
Máximo 3-4 oraciones por respuesta. Español rioplatense coloquial.
 
CIERRE DE CONSULTA  - -- si el médico se despide, agradece, dice "eso es todo", "hasta luego", "chau", "fue un placer", "te atenderán", resume con indicaciones finales o cierra la consulta de cualquier manera: respondé con exactamente [FIN_CONSULTA] al inicio de tu respuesta, seguido de tu despedida como paciente. Ejemplo: "[FIN_CONSULTA] Bueno, muchas gracias doctor."
 
CONDUCTA INAPROPIADA  - -- si el médico usa lenguaje agresivo, insultos, comentarios estigmatizantes o tono irrespetuoso sostenido: mostrá incomodidad o enojo en el personaje. Si se repite, respondé con [FIN_CONSULTA] y una frase como "La verdad, prefiero irme. No me siento cómoda/o."
 
VARIACION LINGUISTICA: Si te preguntan algo que ya contaste, NO repitas las mismas palabras. Reformula, usa sinonimos, di "sigue igual a como te conte", "mas o menos lo mismo". NUNCA copies textualmente una respuesta anterior tuya.`;
  }
 
  async function getPatientResponse(caseData, trustLevel, revealedData, conversationHistory) {
    const system = buildPatientPrompt(caseData, trustLevel, revealedData);
    return await callGemini(system, conversationHistory);
  }
 
  //  - -- - -- Agente evaluador  - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - --
  function buildEvaluatorPrompt(caseData, simState) {
    const discovered = simState.clinicalData.filter(d => d.revealed);
    const notDiscovered = simState.clinicalData.filter(d => !d.revealed);
    const criticalIds = caseData.hidden_state.critical_data_ids || [];
    const criticalFound = discovered.filter(d => criticalIds.includes(d.id));
    const criticalMissed = notDiscovered.filter(d => criticalIds.includes(d.id));
    const coveragePct = simState.clinicalData.length
      ? Math.round((discovered.length / simState.clinicalData.length) * 100) : 0;
 
    const studiesIndicated = (caseData.hidden_state.studies?.indicated || []).map(s => s.id);
    const examPanelSummary = SimulationEngine.getExamPanelSummary(simState, caseData);
    const studiesOmitted   = (caseData.hidden_state.studies?.omitted_critical || []).filter(s => !simState.studiesRequested.includes(s));
    const studiesUnnecessary = simState.studiesRequested.filter(s => !studiesIndicated.includes(s));
 
    const diagCorrect = simState.finalDiagnosis
      ? caseData.differentials.concat([caseData.diagnosis_label, caseData.diagnosis_real])
          .some(d => simState.finalDiagnosis.toLowerCase().includes(d.toLowerCase().split(" ")[0]))
      : false;
 
    const transcript = simState.transcript
      .filter(t => ["student","patient","exam","study"].includes(t.type))
      .map(t => {
        if (t.type === "student") return `[ESTUDIANTE] ${t.text}`;
        if (t.type === "patient") return `[PACIENTE] ${t.text}`;
        if (t.type === "exam")    return `[EXAMEN FÓ-SICO: ${t.examId}] ${t.text}`;
        if (t.type === "study")   return `[RESULTADO ESTUDIO: ${t.label}] ${t.text}`;
        return "";
      }).join("\n");
 
    return `Sos un evaluador de competencias clínicas para la materia Tamizaje y Ciencias del Diagnóstico (UNMdP). Tu trabajo es analizar la consulta y dar puntajes REALES basados en evidencia concreta del transcript.
 
 - -- - -- - -- DATOS DEL CASO  - -- - -- - --
Diagnóstico correcto: ${caseData.diagnosis_label}
Diferenciales correctos: ${caseData.differentials.join(", ")}
Datos críticos que debía descubrir: ${criticalIds.join(", ")}
Errores frecuentes en este caso: ${(caseData.hidden_state.common_errors || []).join(" | ")}
 
 - -- - -- - -- LO QUE HIZO EL ESTUDIANTE  - -- - -- - --
Datos descubiertos (${discovered.length}/${simState.clinicalData.length}  - -- ${coveragePct}%):
${discovered.map(d => `   - -- [${d.importance.toUpperCase()}] ${d.value}`).join("\n") || "  Ninguno"}
 
Datos NO descubiertos:
${notDiscovered.map(d => `   - - - -- [${d.importance.toUpperCase()}] ${d.id}`).join("\n") || "  Ninguno"}
 
Datos críticos encontrados: ${criticalFound.length}/${criticalIds.length}
Datos críticos OMITIDOS: ${criticalMissed.map(d => d.id).join(", ") || "Ninguno"}
 
Exámenes físicos realizados: ${simState.physicalExamsPerformed.join(", ") || "Ninguno"}
Estudios solicitados: ${simState.studiesRequested.join(", ") || "Ninguno"}
Estudios críticos omitidos: ${studiesOmitted.join(", ") || "Ninguno"}
Estudios innecesarios: ${studiesUnnecessary.join(", ") || "Ninguno"}
 
Panel de examen físico interactivo:
${examPanelSummary.has_panel ? `Pertinentes realizados: ${examPanelSummary.necessary_done.join(", ")||"ninguno"} | Pertinentes omitidos: ${examPanelSummary.necessary_missed.join(", ")||"ninguno"} | Innecesarios realizados: ${examPanelSummary.unnecessary_done.join(", ")||"ninguno"} | Puntos del panel: ${examPanelSummary.points>0?"+":""}${examPanelSummary.points}` : "No disponible en este caso"}
 
Diagnóstico propuesto: ${simState.finalDiagnosis || "No declarado"}
Diferenciales propuestos: ${simState.finalDifferentials || "Ninguno"}
 
 - -- - -- - -- TRANSCRIPT COMPLETO  - -- - -- - --
${transcript || "(vacío  - -- el estudiante no habló)"}
 
 - -- - -- - -- PESOS DE RÓ-BRICA  - -- - -- - --
${JSON.stringify(caseData.hidden_state.rubric_weights)}
 
 - -- - -- - -- INSTRUCCIONES DE EVALUACIÓ-N  - -- - -- - --
Analizá el transcript línea por línea. Para cada dimensión:
- apertura: Â¿Se presentó? Â¿Saludó? Â¿Explicó el rol? Â¿Encuadró la consulta?
- anamnesis: Â¿Preguntó motivo de consulta, tiempo de evolución, síntomas asociados, antecedentes, medicación, alergias? Â¿Exploró antecedentes relevantes para este caso?
- comunicacion: Â¿Tono respetuoso? Â¿Lenguaje claro? Â¿Escuchó al paciente? Â¿Interrumpió? Â¿Usó lenguaje estigmatizante?
- examen_fisico: Â¿Realizó los exámenes pertinentes para este caso? Â¿Los interpretó correctamente?
- razonamiento: Â¿Sus preguntas siguieron una lógica clínica? Â¿Integró los datos? Â¿Consideró los diferenciales correctos?
- diagnostico: Â¿El diagnóstico final es correcto o razonablemente cercano? Â¿Los diferenciales son adecuados?
- estudios: Â¿Solicitó los estudios indicados? Â¿Omitió estudios críticos? Â¿Pidió estudios innecesarios?
 
Si el transcript está vacío o el estudiante no habló, todos los scores son 0.
Si el estudiante hizo algo bien, reflejalo en el score. Si lo hizo mal, bajá el score con evidencia.
 
Respondé Ó-NICAMENTE con un objeto JSON válido. Sin texto antes ni después. Sin bloques de código:
{"scores":{"apertura":{"score":75,"evidence":["Se presentó correctamente","No explicó el motivo de las preguntas sensibles"]},"anamnesis":{"score":60,"evidence":["Preguntó tiempo de evolución y características","No exploró antecedentes sexuales"]},"comunicacion":{"score":80,"evidence":["Tono respetuoso durante toda la consulta"]},"examen_fisico":{"score":40,"evidence":["No realizó inspección de la lesión"]},"razonamiento":{"score":55,"evidence":["No integró los datos para el diferencial"]},"diagnostico":{"score":70,"evidence":["Diagnóstico correcto pero sin justificación"]},"estudios":{"score":50,"evidence":["Solicitó VDRL pero omitió test de VIH"]}},"coverage_percent":${coveragePct},"critical_covered":${criticalFound.length},"diagnosis_correct":${diagCorrect},"missed_critical":${JSON.stringify(criticalMissed.map(d => d.id))},"main_errors":${JSON.stringify((caseData.hidden_state.common_errors || []).filter((_, i) => i < 3))}}
 
Ese es un EJEMPLO del formato. Usá los valores reales del análisis, no los del ejemplo.`;
  }
 
  async function getEvaluation(caseData, simState) {
    const prompt = buildEvaluatorPrompt(caseData, simState);
    let raw = "";
    try {
      raw = await callGemini(
        "Sos un evaluador clinico. Respondés SOLO con JSON valido, sin texto adicional ni markdown.",
        [{ role: "user", content: prompt }]
      );
    } catch(e) {
      raw = "";
    }
    const cleaned = raw.replace(/```(?:json)?\n?|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    try {
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
      if (parsed.scores) return parsed;
      throw new Error("sin scores");
    } catch {
      return _deterministicEvaluation(caseData, simState);
    }
  }
 
  // Fallback 100% determinista  -  sin LLM  -  específico al caso real
  function _deterministicEvaluation(caseData, simState) {
    const discovered   = simState.clinicalData.filter(d => d.revealed);
    const criticalIds  = caseData.hidden_state.critical_data_ids || [];
    const importantIds = caseData.hidden_state.important_data_ids || [];
    const criticalFound   = discovered.filter(d => criticalIds.includes(d.id));
    const importantFound  = discovered.filter(d => importantIds.includes(d.id));
    const criticalMissed  = simState.clinicalData.filter(d => !d.revealed && criticalIds.includes(d.id));
    const pct = simState.clinicalData.length
      ? Math.round(discovered.length / simState.clinicalData.length * 100) : 0;
 
    // Transcript: ¿el estudiante habló?
    const studentTurns = simState.transcript.filter(t => t.type === "student");
    const firstTurn    = studentTurns[0]?.text || "";
    const saludó       = /hola|buenas|buenos|bienvenid|soy el doctor|soy la doctora|cómo está|como esta/.test(firstTurn.toLowerCase());
    const exams        = simState.physicalExamsPerformed || [];
    const studies      = simState.studiesRequested || [];
    const studiesIndicated = (caseData.hidden_state.studies?.omitted_critical || []);
    const studiesDone  = studiesIndicated.filter(s => studies.includes(s));
    const studiesOmitted = studiesIndicated.filter(s => !studies.includes(s));
 
    // Detectar insultos / maltrato en el transcript
    const allStudentText = studentTurns.map(t => t.text).join(" ").toLowerCase();
    const hasMaltrato = /insult|puta|idiot|estupid|bolud|hdp|maldita|imbecil|pelotud|inutil/.test(allStudentText);
 
    // Calcular scores reales basados en evidencia concreta
    const aperturaScore = studentTurns.length === 0 ? 0
      : hasMaltrato ? 5
      : saludó ? 80 : 40;
 
    const anamnesisPct = pct;
    const anamnesisScore = studentTurns.length === 0 ? 0
      : hasMaltrato ? 0
      : Math.round(anamnesisPct * 0.7 + (criticalFound.length / Math.max(criticalIds.length, 1)) * 30);
 
    const comunicacionScore = studentTurns.length === 0 ? 0
      : hasMaltrato ? 0
      : saludó && pct > 40 ? 70 : pct > 20 ? 50 : 30;
 
    const efScore = exams.length === 0 ? 0
      : hasMaltrato ? 0
      : Math.min(100, exams.length * 20);
 
    const razonamientoScore = studentTurns.length === 0 || hasMaltrato ? 0
      : Math.round(anamnesisScore * 0.6 + efScore * 0.4);
 
    // Comparación de diagnóstico — usa _diagMatchLocal definida globalmente
    const diagCorrect = _diagMatchLocal(simState.finalDiagnosis, caseData);
    const diagScore = hasMaltrato ? 0
      : diagCorrect ? 80
      : simState.finalDiagnosis ? 30 : 0;
 
    const estudiosScore = hasMaltrato ? 0
      : studiesDone.length > 0
        ? Math.min(100, Math.round((studiesDone.length / Math.max(studiesIndicated.length, 1)) * 100))
        : studies.length > 0 ? 30 : 0;
 
    // Evidence concreta para cada dimensión
    const apertEv = hasMaltrato
      ? ["Lenguaje inapropiado detectado  -  apertura no evaluable"]
      : studentTurns.length === 0
        ? ["El estudiante no inició la consulta"]
        : saludó ? ["Saludó al paciente al inicio"] : ["No realizó saludo ni presentación"];
 
    const anamEv = hasMaltrato
      ? ["Conducta inapropiada impidió la anamnesis"]
      : discovered.length === 0
        ? ["No se obtuvo ningún dato clínico del paciente"]
        : [
            `Se descubrieron ${discovered.length}/${simState.clinicalData.length} datos (${pct}%)`,
            criticalFound.length > 0
              ? `Datos críticos obtenidos: ${criticalFound.map(d=>d.id.replace(/_/g," ")).join(", ")}`
              : `No se obtuvo ningún dato crítico del caso`,
          ].filter(Boolean);
 
    const commEv = hasMaltrato
      ? ["Se detectó lenguaje agresivo o irrespetuoso hacia el paciente  -  comunicación inaceptable"]
      : studentTurns.length === 0
        ? ["Sin interacción registrada"]
        : pct > 40 ? ["Comunicación funcional durante la consulta"] : ["Anamnesis muy acotada"];
 
    const efEv = exams.length === 0
      ? ["No se realizó ningún examen físico"]
      : [`Exámenes realizados: ${exams.join(", ")}`];
 
    const razEv = hasMaltrato || studentTurns.length === 0
      ? ["Sin razonamiento clínico aplicable"]
      : criticalMissed.length > 0
        ? [`Datos críticos no explorados: ${criticalMissed.map(d=>d.id.replace(/_/g," ")).slice(0,3).join(", ")}`]
        : ["Exploración clínica adecuada"];
 
    const diagEv = hasMaltrato
      ? ["Sin diagnóstico aplicable  -  conducta inapropiada"]
      : [simState.finalDiagnosis
          ? (diagCorrect ? `Diagnóstico correcto: "${simState.finalDiagnosis}"` : `Diagnóstico incorrecto: "${simState.finalDiagnosis}"  -  correcto era: ${caseData.diagnosis_label}`)
          : "No se declaró hipótesis diagnóstica"];
 
    const studEv = hasMaltrato
      ? ["Sin estudios aplicables"]
      : studiesOmitted.length > 0
        ? [`Estudios críticos omitidos: ${studiesOmitted.join(", ")}`]
        : studies.length > 0
          ? [`Solicitó: ${studies.join(", ")}`]
          : ["No se solicitó ningún estudio"];
 
    return {
      scores: {
        apertura:     { score: aperturaScore,       evidence: apertEv },
        anamnesis:    { score: anamnesisScore,      evidence: anamEv },
        comunicacion: { score: comunicacionScore,   evidence: commEv },
        examen_fisico:{ score: efScore,             evidence: efEv },
        razonamiento: { score: razonamientoScore,   evidence: razEv },
        diagnostico:  { score: diagScore,           evidence: diagEv },
        estudios:     { score: estudiosScore,       evidence: studEv },
      },
      coverage_percent: pct,
      critical_covered: criticalFound.length,
      diagnosis_correct: diagCorrect,
      missed_critical: criticalMissed.map(d => d.id),
      main_errors: hasMaltrato
        ? ["Conducta inapropiada hacia el paciente  -  la consulta no fue válida clínicamente"]
        : (caseData.hidden_state.common_errors || []).filter((_, i) => i < 3),
    };
  }
 
  function buildDebriefingPrompt(caseData, evaluation, studentReflection) {
    const discovered = [];  // ya procesado en evaluación
    return `Debriefing post-simulacion de Tamizaje UNMdP. Se breve y especifico.
 
CASO: ${caseData.topic_label}  -  ${caseData.diagnosis_label}
PUNTAJES: ${Object.entries(evaluation.scores||{}).map(([k,v])=>`${k}:${v.score}`).join(" | ")}
COBERTURA: ${evaluation.coverage_percent}% | CRITICOS OMITIDOS: ${(evaluation.missed_critical||[]).join(", ")||"ninguno"}
DIAGNOSTICO: ${evaluation.diagnosis_correct?"CORRECTO":"INCORRECTO"}  -  propuesto: "${caseData.hidden_state?.finalDiagnosis||"no declarado"}"  -  correcto: "${caseData.diagnosis_label}"
ERRORES DEL CASO: ${(caseData.hidden_state.common_errors||[]).join(" | ")}
REFLEXION ESTUDIANTE: ${studentReflection||"no proporcionó"}
 
Respondé SOLO con JSON. Máximo 2 items por array. Frases cortas:
{"bien_hecho":["..."],"mejorar":["..."],"errores_clinicos":["..."],"evaluacion_diagnostico":"...","aprendizaje_recomendado":"...","objetivo_proxima":"..."}`;
  }
 
  async function getDebriefing(caseData, evaluation, studentReflection) {
    const prompt = buildDebriefingPrompt(caseData, evaluation, studentReflection);
    let raw = "";
    try {
      raw = await callGemini(
        "Respondés SOLO con JSON valido, sin texto adicional.",
        [{ role: "user", content: prompt }]
      );
    } catch(e) {
      raw = "";
    }
    const cleaned = raw.replace(/```(?:json)?\n?|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    try {
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
      if (parsed.bien_hecho || parsed.mejorar) return parsed;
      throw new Error("sin campos");
    } catch {
      // Fallback determinista  -  siempre específico al caso
      const hasMaltrato = (caseData.hidden_state.common_errors||[]).length > 0 &&
        evaluation.scores?.comunicacion?.score === 0;
      const criticalMissed = evaluation.missed_critical || [];
      const pct = evaluation.coverage_percent || 0;
 
      return {
        bien_hecho: pct > 30
          ? [`Descubriste el ${pct}% de los datos del caso`]
          : hasMaltrato
            ? ["La simulación finalizó  -  revisá el código deontológico médico"]
            : ["Completaste la consulta"],
        mejorar: criticalMissed.length > 0
          ? [`Faltan datos críticos: ${criticalMissed.slice(0,2).map(id=>id.replace(/_/g," ")).join(", ")}`]
          : ["Sistematizá la anamnesis por aparatos"],
        errores_clinicos: hasMaltrato
          ? ["Trato irrespetuoso al paciente  -  esto invalida la consulta clínicamente"]
          : (caseData.hidden_state.common_errors||[]).slice(0,2),
        evaluacion_diagnostico: evaluation.diagnosis_correct
          ? `Diagnóstico correcto: ${caseData.diagnosis_label}`
          : `Diagnóstico incorrecto. Correcto: ${caseData.diagnosis_label}. Diferenciales: ${caseData.differentials.slice(0,2).join(", ")}`,
        aprendizaje_recomendado: `Revisar ${caseData.topic_label}  -  especialmente: ${(caseData.hidden_state.common_errors||["anamnesis sistemática"])[0]}`,
        objetivo_proxima: criticalMissed.length > 0
          ? `En el próximo caso del mismo tema: descubrir ${criticalMissed.slice(0,1).map(id=>id.replace(/_/g," ")).join(", ")}`
          : `Mejorar la cobertura de datos más allá del ${pct}%`,
      };
    }
  }
 
 
  // Comparación semántica de diagnóstico via LLM
  async function getDiagnosisMatch(proposed, caseData) {
    if (!proposed || !proposed.trim()) return false;
 
    const prompt = `Sos un evaluador de diagnósticos médicos. El estudiante propuso un diagnóstico en una simulación clínica.
 
DIAGNÓSTICO REAL DEL CASO: "${caseData.diagnosis_label}"
DIFERENCIALES ACEPTADOS: ${caseData.differentials.join(" | ")}
DIAGNÓSTICO PROPUESTO POR EL ESTUDIANTE: "${proposed}"
 
Evaluá si el diagnóstico propuesto es correcto o aceptablemente próximo al real.
Considerá correcto si:
- Nombra la misma enfermedad aunque use sinónimos o distinto nivel de detalle
- Identifica el problema principal aunque no sea exacto (ej: "pielonefritis" para "ITU febril con compromiso renal")
- Está dentro de los diferenciales aceptados
 
Considerá incorrecto si:
- Es un diagnóstico completamente diferente al real y a los diferenciales
- Es demasiado vago para ser clínicamente útil (ej: "algo en el colon", "enfermedad sistémica")
- Solo menciona el síntoma sin diagnóstico (ej: "fiebre", "dolor")
 
Respondé SOLO con una palabra: CORRECTO o INCORRECTO`;
 
    try {
      const result = await callGemini(
        "Respondés solo con CORRECTO o INCORRECTO, sin explicación.",
        [{ role: "user", content: prompt }]
      );
      return result.trim().toUpperCase().includes("CORRECTO");
    } catch {
      // Fallback al algoritmo local si falla la API
      return _diagMatchLocal(proposed, caseData);
    }
  }
 
  // Fallback local (sin API)
  function _diagMatchLocal(proposed, caseData) {
    if (!proposed) return false;
    const stop = new Set(["de","del","la","el","los","las","en","con","por","para","sin","una","un","que","se","es","no","al","su","como","resultado","estudio","pendiente","positivo","negativo","caso"]);
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/_/g," ");
    const kw   = s => norm(s).split(/\s+/).filter(w => w.length > 3 && !stop.has(w));
    const p    = norm(proposed);
    const targets = [caseData.diagnosis_real, caseData.diagnosis_label, ...(caseData.differentials||[])];
    return targets.some(t => {
      const words = kw(t);
      if (!words.length) return false;
      return words.filter(w => p.includes(w)).length / words.length >= 0.40;
    });
  }
 
  return { getPatientResponse, getEvaluation, getDebriefing, getDiagnosisMatch };
})();
