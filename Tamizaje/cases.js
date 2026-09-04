// ─── CASOS CLÍNICOS ──────────────────────────────────────────────────────────
// Cada caso contiene toda la información necesaria para la simulación.
// Para agregar un caso nuevo: copiar la estructura de cualquiera de estos
// y agregarlo al objeto CASES al final del archivo.

const ITS_001 = {
  id: "its-001",
  topic_id: "its",
  topic_label: "ITS",
  parcial: 2,
  difficulty: "normal",
  diagnosis_real: "sifilis_primaria",
  diagnosis_label: "Sífilis primaria (úlcera de Hunterian)",
  differentials: ["Herpes genital primario", "Chancro blando", "Linfogranuloma venéreo"],

  patient: {
    sex: "F",
    chief_complaint: "Una lesión en la zona íntima que no duele",
    context: "Guardia de hospital público"
  },

  personality: {
    trust_base: 40,
    type: "reservada_avergonzada"
  },

  hidden_state: {
    opening_scene_variants: [
      "Una joven entra al consultorio. Cierra la puerta con cuidado, se sienta y cruza los brazos. No dice nada. Espera.",
      "Entra una paciente joven. Evita el contacto visual. Se acomoda en la silla lentamente, como sin ganas de estar ahí.",
      "Una mujer joven empuja la puerta y entra. Se sienta frente al médico con una expresión contenida. Saluda apenas con un gesto."
    ],

    clinical_data: [
      {
        id: "lesion_tiempo",
        category: "Enfermedad actual",
        importance: "important",
        revealed: false,
        value: "La lesión tiene aproximadamente 10 días de evolución",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["cuando", "cuanto tiempo", "hace cuanto", "cuándo", "cuánto", "empezó", "empezo", "apareció", "aparecio", "evolución", "evolucion", "días", "dias", "tiempo tiene"]
      },
      {
        id: "lesion_caracteristicas",
        category: "Enfermedad actual",
        importance: "critical",
        revealed: false,
        value: "Lesión única en labio mayor izquierdo. No duele. Bordes definidos. No sangra.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["como es", "cómo es", "duele", "sangra", "sangró", "tipo de lesión", "qué tiene", "que tiene", "describí", "describi", "cómo la", "como la", "qué tipo", "que tipo"]
      },
      {
        id: "pareja_nueva",
        category: "Antecedentes sexuales",
        importance: "critical",
        revealed: false,
        value: "Tuvo relaciones sexuales sin preservativo con una pareja nueva hace 6 semanas",
        reveal_threshold_trust: 45,
        exam_required: false,
        keywords: ["pareja", "relaciones", "relación", "sexual", "sexuales", "con quién", "con quien", "alguien nuevo", "última relación", "ultima relacion", "reciente"]
      },
      {
        id: "sin_preservativo",
        category: "Antecedentes sexuales",
        importance: "critical",
        revealed: false,
        value: "No usaron preservativo. Fue una relación espontánea.",
        reveal_threshold_trust: 55,
        exam_required: false,
        keywords: ["preservativo", "protección", "proteccion", "cuidó", "cuido", "método anticonceptivo", "metodo", "se cuidaron"]
      },
      {
        id: "fiebre_ausente",
        category: "Síntomas asociados",
        importance: "important",
        revealed: false,
        value: "Sin fiebre, sin rash cutáneo, sin cefalea, sin adenopatías dolorosas",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["fiebre", "temperatura", "sarpullido", "rash", "otros síntomas", "otros sintomas", "acompaña", "más síntomas", "mas sintomas", "manchas"]
      },
      {
        id: "its_previas",
        category: "Antecedentes",
        importance: "important",
        revealed: false,
        value: "Niega antecedentes de ITS previas diagnosticadas",
        reveal_threshold_trust: 50,
        exam_required: false,
        keywords: ["its", "infección de transmisión", "infeccion de transmision", "enfermedad sexual", "antes", "historia", "antecedentes sexuales", "previas", "alguna vez tuvo"]
      },
      {
        id: "menstruacion",
        category: "Gineco-obstétrico",
        importance: "secondary",
        revealed: false,
        value: "Última menstruación hace 15 días. Regular. No está embarazada.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["menstruación", "menstruacion", "período", "periodo", "regla", "atraso", "embarazo", "embarazada"]
      },
      {
        id: "medicacion",
        category: "Antecedentes",
        importance: "secondary",
        revealed: false,
        value: "Anticonceptivos orales. Sin otras medicaciones. Sin alergias conocidas.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["medicación", "medicacion", "medicamento", "pastilla", "toma algo", "anticonceptivo", "alergia", "droga", "fármaco"]
      },
      {
        id: "adenopatias_ef",
        category: "Examen físico",
        importance: "important",
        revealed: false,
        value: "Adenopatía inguinal bilateral no dolorosa, firme, móvil. Mayor: ≈1.5 cm.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["palpacion_ganglios_inguinales", "palpacion_ganglios"],
        keywords: []
      },
      {
        id: "lesion_ef",
        category: "Examen físico",
        importance: "critical",
        revealed: false,
        value: "Úlcera única, ≈1 cm, bordes indurados (duros al tacto), base limpia, indolora. Labio mayor izquierdo.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["inspeccion_genital"],
        keywords: []
      }
    ],

    physical_exam: {
      findings: {
        inspeccion_general: "Paciente en buen estado general, orientada, sin compromiso sistémico.",
        inspeccion_genital: "Úlcera única, ≈1 cm, bordes indurados, base limpia sin exudado, indolora a la palpación. Labio mayor izquierdo.",
        palpacion_ganglios_inguinales: "Adenopatía inguinal bilateral. Ganglios firmes, móviles, no dolorosos. Mayor ≈1.5 cm.",
        palpacion_ganglios: "Adenopatía inguinal bilateral. Ganglios firmes, móviles, no dolorosos. Mayor ≈1.5 cm.",
        signos_vitales: "TA 110/70 mmHg · FC 78 lpm · T° 36.8°C · FR 16 rpm",
        palpacion_abdomen: "Blando, depresible, sin dolor, sin visceromegalias."
      }
    },

    studies: {
      indicated: [
        { id: "vdrl", label: "VDRL", result: "Reactivo 1/32", pertinence: "critical" },
        { id: "fta_abs", label: "FTA-ABS / TPHA", result: "Positivo", pertinence: "critical" },
        { id: "vih", label: "Test de VIH 4ª generación", result: "No reactivo", pertinence: "important" },
        { id: "hepatitis_b", label: "HBsAg (Hepatitis B)", result: "Negativo", pertinence: "important" },
        { id: "naat", label: "NAAT Chlamydia / Gonorrea", result: "Negativo", pertinence: "important" }
      ],
      omitted_critical: ["vdrl", "fta_abs", "vih"]
    },

    rubric_weights: {
      apertura: 5,
      anamnesis: 25,
      comunicacion: 20,
      examen_fisico: 15,
      razonamiento: 15,
      diagnostico: 10,
      estudios: 10
    },

    critical_data_ids: ["lesion_caracteristicas", "pareja_nueva", "sin_preservativo", "lesion_ef"],
    important_data_ids: ["lesion_tiempo", "fiebre_ausente", "adenopatias_ef", "its_previas"],
    secondary_data_ids: ["menstruacion", "medicacion"],

    common_errors: [
      "No explorar antecedentes sexuales recientes",
      "No preguntar por uso de preservativo",
      "No realizar examen físico de la zona genital",
      "No palpar ganglios inguinales",
      "No solicitar VDRL como tamizaje inicial",
      "No solicitar test de VIH en contexto de ITS",
      "No considerar herpes genital en el diferencial"
    ]
  },

  patient_persona_prompt: `Sos una joven de unos 20 años. Consultás por una lesión genital que no te duele.

PERSONALIDAD: Reservada y avergonzada. Respondés con frases cortas. No das información sensible hasta ganar confianza.

INFORMACIÓN QUE TENÉS:
- La lesión está en la zona íntima hace unos 10 días. No duele. La viste por casualidad.
- Hace unos 6 semanas tuviste una relación con alguien que conociste, sin preservativo. Fue espontáneo.
- Tenés una pareja estable desde hace 3 meses, con quien sí usás preservativo generalmente.
- Sin fiebre ni otros síntomas.
- Tomás anticonceptivos orales. Sin alergias.

REGLAS:
- Sobre la relación sin preservativo: solo si pregunta directamente por relaciones recientes o parejas, Y el médico fue amable y generó confianza.
- Si preguntan si tenés pareja: "sí", pero no mencionés la otra relación espontáneamente.
- Respondé solo lo que te preguntan. Frases cortas. Podés decir "¿por qué me pregunta eso?" si la pregunta parece muy directa sin contexto.
- Usá lenguaje coloquial. No usés términos médicos.
- Máximo 3-4 oraciones por respuesta.
- Respondé en español rioplatense informal.`
};

const ITS_002 = {
  id: "its-002",
  topic_id: "its",
  topic_label: "ITS",
  parcial: 2,
  difficulty: "dificil",
  diagnosis_real: "vih_infeccion_aguda",
  diagnosis_label: "Síndrome retroviral agudo (primoinfección VIH)",
  differentials: ["Mononucleosis infecciosa", "Toxoplasmosis", "Sífilis secundaria", "Linfoma"],

  patient: {
    sex: "M",
    chief_complaint: "Fiebre, ganglios inflamados y un sarpullido",
    context: "Consulta de clínica médica"
  },

  personality: {
    trust_base: 60,
    type: "ansioso_informado"
  },

  hidden_state: {
    opening_scene_variants: [
      "Un hombre joven entra rápido al consultorio. Tiene cara de preocupado. Antes de sentarse ya empieza a hablar.",
      "Entra un paciente masculino joven. Se sienta, apoya los codos en la mesa. Parece que tiene mucho para decir.",
      "Un hombre entra al consultorio, cierra la puerta detrás suyo. Se sienta y mira al médico fijo, como esperando algo."
    ],

    clinical_data: [
      {
        id: "fiebre_duracion",
        category: "Enfermedad actual",
        importance: "important",
        revealed: false,
        value: "Fiebre de 38.5°C desde hace 8 días. No cede del todo con paracetamol.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["fiebre", "temperatura", "cuánto hace", "cuanto hace", "hace cuánto", "hace cuanto", "días", "dias", "cuándo empezó", "cuando empezo", "paracetamol"]
      },
      {
        id: "rash",
        category: "Enfermedad actual",
        importance: "critical",
        revealed: false,
        value: "Sarpullido maculopapular en tronco y cara interna de brazos. No pica. Hace 5 días.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["sarpullido", "rash", "manchas", "erupción", "erupcion", "piel", "manchitas", "granitos", "lesiones en la piel"]
      },
      {
        id: "faringitis",
        category: "Síntomas asociados",
        importance: "important",
        revealed: false,
        value: "Dolor de garganta desde hace 10 días",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["garganta", "dolor de garganta", "tragar", "deglución", "deglucion", "faringe"]
      },
      {
        id: "astenia",
        category: "Síntomas asociados",
        importance: "important",
        revealed: false,
        value: "Cansancio importante. Perdió 2 kg en la última semana.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["cansancio", "cansado", "fatigado", "fatiga", "energía", "energia", "peso", "bajó de peso", "bajo de peso"]
      },
      {
        id: "adenopatias_multiples",
        category: "Examen físico",
        importance: "critical",
        revealed: false,
        value: "Adenopatías cervicales, axilares e inguinales bilaterales. Móviles, no dolorosas. Mayor ≈1.5 cm.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["palpacion_ganglios", "palpacion_ganglios_inguinales"],
        keywords: []
      },
      {
        id: "hepatomegalia",
        category: "Examen físico",
        importance: "important",
        revealed: false,
        value: "Hepatomegalia leve. Borde hepático a 2 cm del reborde costal. Bazo no palpable.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["palpacion_abdomen"],
        keywords: []
      },
      {
        id: "relacion_riesgo",
        category: "Antecedentes sexuales",
        importance: "critical",
        revealed: false,
        value: "Relación sexual sin preservativo con un hombre desconocido hace 3 semanas",
        reveal_threshold_trust: 55,
        exam_required: false,
        keywords: ["relaciones", "sexual", "pareja", "preservativo", "vida sexual", "último contacto", "ultimo contacto", "protección", "proteccion"]
      },
      {
        id: "preocupacion_vih",
        category: "Preocupación",
        importance: "critical",
        revealed: false,
        value: "Buscó en internet y cree que puede tener VIH. No lo dice de entrada.",
        reveal_threshold_trust: 45,
        exam_required: false,
        keywords: ["qué cree", "que cree", "sospecha", "preocupa", "encontró", "encontro", "buscó", "busco", "internet", "diagnóstico propio", "diagnostico"]
      },
      {
        id: "medicacion",
        category: "Antecedentes",
        importance: "secondary",
        revealed: false,
        value: "Paracetamol 1g c/8h desde hace 5 días. Sin alergias.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["medicación", "medicacion", "medicamento", "toma algo", "alergia", "paracetamol"]
      }
    ],

    physical_exam: {
      findings: {
        signos_vitales: "TA 120/75 mmHg · FC 92 lpm · T° 38.6°C · FR 18 rpm · SatO₂ 98%",
        inspeccion_general: "Paciente adelgazado, en regular estado general, febril al examen.",
        orofaringe: "Orofaringe eritematosa, sin exudados. Sin petequias palatinas.",
        palpacion_ganglios: "Adenopatías cervicales, axilares e inguinales bilaterales. Móviles, no dolorosas, consistencia elástica. Mayor ≈1.5 cm.",
        palpacion_ganglios_inguinales: "Adenopatías inguinales bilaterales, móviles, no dolorosas. Mayor ≈1.5 cm.",
        inspeccion_piel: "Exantema maculopapular eritematoso en tronco y cara interna de brazos. No pruriginoso. No confluente.",
        palpacion_abdomen: "Hepatomegalia leve, borde a 2 cm bajo el reborde costal. Bazo no palpable. Sin dolor."
      }
    },

    studies: {
      indicated: [
        { id: "vih_4gen", label: "Test VIH 4ª generación (Ag p24 + Ac)", result: "Reactivo", pertinence: "critical" },
        { id: "hemograma", label: "Hemograma", result: "Linfopenia 900/mm³ · Plaquetas 130.000", pertinence: "important" },
        { id: "hepatograma", label: "Hepatograma", result: "TGP 65 UI/L (elevada) · Resto normal", pertinence: "important" },
        { id: "monotest", label: "Monotest (mononucleosis)", result: "Negativo", pertinence: "important" },
        { id: "vdrl", label: "VDRL (sífilis)", result: "No reactivo", pertinence: "important" }
      ],
      omitted_critical: ["vih_4gen"]
    },

    rubric_weights: {
      apertura: 5,
      anamnesis: 20,
      comunicacion: 25,
      examen_fisico: 15,
      razonamiento: 15,
      diagnostico: 10,
      estudios: 10
    },

    critical_data_ids: ["rash", "adenopatias_multiples", "relacion_riesgo"],
    important_data_ids: ["fiebre_duracion", "faringitis", "astenia", "hepatomegalia"],
    secondary_data_ids: ["preocupacion_vih", "medicacion"],

    common_errors: [
      "Quedarse solo con mononucleosis sin considerar VIH",
      "No preguntar antecedentes sexuales en síndrome febril con rash y adenopatías",
      "No solicitar test de VIH de 4ª generación",
      "No explorar abdomen",
      "Tono estigmatizante al preguntar por vida sexual"
    ]
  },

  patient_persona_prompt: `Sos un hombre joven de unos 29 años. Consultás por fiebre, ganglios inflamados y un sarpullido.

PERSONALIDAD: Ansioso, informado y un poco hablador. Ya buscaste en internet y tenés miedos concretos que no querés decir de entrada.

INFORMACIÓN QUE TENÉS:
- Fiebre de casi 39°C desde hace 8 días. Tomaste paracetamol pero no baja del todo.
- Sarpullido en tronco desde hace 5 días. No pica.
- Dolor de garganta desde hace 10 días.
- Ganglios en cuello, axilas e ingles.
- Estás muy cansado y bajaste 2 kg en una semana.
- Hace 3 semanas tuviste una relación sexual con un hombre que conociste en una app, sin preservativo.
- Buscaste en internet y te preocupa VIH, pero no lo decís de entrada.
- Tomás paracetamol. Sin alergias.

REGLAS:
- De los síntomas principales (fiebre, sarpullido, ganglios) hablás libremente y con detalle.
- Sobre vida sexual: solo si el médico pregunta directamente y de manera respetuosa.
- Si preguntan qué creés que tenés: podés decir "vi en internet que puede ser mononucleosis... u otras cosas" con hesitación.
- Hablás en oraciones más largas que el promedio. Tendés a dar contexto.
- Máximo 4-5 oraciones por respuesta.
- Respondé en español rioplatense informal.`
};

const TEC_001 = {
  id: "tec-001",
  topic_id: "tec",
  topic_label: "TEC",
  parcial: 1,
  difficulty: "normal",
  diagnosis_real: "tec_leve_con_criterios_tc",
  diagnosis_label: "TEC leve con criterios de TC de cráneo (vómitos repetidos + pérdida de consciencia)",
  differentials: ["TEC moderado", "Hematoma epidural en fase lucida", "Hematoma subdural agudo"],

  patient: {
    sex: "M",
    chief_complaint: "Golpe en la cabeza jugando al fútbol, vomitó dos veces",
    context: "Guardia de hospital"
  },

  personality: {
    trust_base: 65,
    type: "cooperativo_adolescente"
  },

  hidden_state: {
    opening_scene_variants: [
      "Entra un adolescente acompañado de una mujer mayor. Tiene un gesto de dolor contenido. Se sienta y espera.",
      "Un chico joven entra al consultorio con una mujer que parece su madre. Él tiene una mano en la cabeza. Se sienta despacio.",
      "Pasa un adolescente. Lo acompaña una adulta que está más nerviosa que él. Él se sienta y saluda con un movimiento de cabeza."
    ],

    clinical_data: [
      {
        id: "mecanismo",
        category: "Enfermedad actual",
        importance: "critical",
        revealed: false,
        value: "Choque cabeza a cabeza con otro jugador jugando al fútbol. Cayó al piso.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["cómo pasó", "como paso", "qué pasó", "que paso", "cómo fue", "como fue", "mecanismo", "golpe", "accidente", "qué hizo", "que hizo", "cómo se lastimó", "como se lastimo"]
      },
      {
        id: "perdida_consciencia",
        category: "Enfermedad actual",
        importance: "critical",
        revealed: false,
        value: "Perdió el conocimiento aproximadamente 1 minuto. Sus compañeros lo vieron. Él no lo recuerda.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["consciencia", "conciencia", "desmayó", "desmayo", "perdió el conocimiento", "perdio el conocimiento", "compañeros", "companeros", "recuerda", "qué pasó después", "que paso despues", "estuvo inconsciente"]
      },
      {
        id: "amnesia",
        category: "Enfermedad actual",
        importance: "important",
        revealed: false,
        value: "No recuerda el momento del golpe ni los 5 minutos previos.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["recuerda", "memoria", "antes del golpe", "qué recuerda", "que recuerda", "acordás", "acordas", "amnesia"]
      },
      {
        id: "vomitos",
        category: "Enfermedad actual",
        importance: "critical",
        revealed: false,
        value: "Vomitó dos veces desde el golpe. El último hace 30 minutos.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["vóm", "vom", "náusea", "nausea", "devolvió", "devolvio", "cuántas veces", "cuantas veces", "vomitó", "vomito", "arcadas"]
      },
      {
        id: "cefalea",
        category: "Síntomas asociados",
        importance: "important",
        revealed: false,
        value: "Cefalea 6/10, frontal y occipital, constante desde el golpe.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["cabeza", "duele la cabeza", "cefalea", "dolor de cabeza", "le duele", "intensidad", "cuánto le duele"]
      },
      {
        id: "glasgow",
        category: "Examen físico",
        importance: "critical",
        revealed: false,
        value: "Glasgow 15/15: O4 + V5 + M6. Orientado en tiempo y espacio.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["evaluacion_glasgow"],
        keywords: []
      },
      {
        id: "pupilas",
        category: "Examen físico",
        importance: "important",
        revealed: false,
        value: "Pupilas isocóricas y reactivas, 3 mm bilateral. Reflejo fotomotor presente y simétrico.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["examen_pupilas"],
        keywords: []
      },
      {
        id: "hematoma_ef",
        category: "Examen físico",
        importance: "important",
        revealed: false,
        value: "Hematoma occipital derecho 3×3 cm. Sin herida abierta. Sin hundimiento palpable.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["inspeccion_cabeza", "palpacion_craneo"],
        keywords: []
      },
      {
        id: "examen_neuro",
        category: "Examen físico",
        importance: "important",
        revealed: false,
        value: "Sin focalidad neurológica. Fuerza 5/5 en 4 miembros. Reflejos simétricos. Plantar flexor bilateral.",
        reveal_threshold_trust: 0,
        exam_required: true,
        exam_ids: ["examen_neurologico"],
        keywords: []
      },
      {
        id: "antecedentes",
        category: "Antecedentes",
        importance: "secondary",
        revealed: false,
        value: "Sin antecedentes relevantes. Sin medicación. Sin anticoagulantes. Sin cirugías previas.",
        reveal_threshold_trust: 0,
        exam_required: false,
        keywords: ["antecedente", "enfermedad previa", "medicación", "medicacion", "pastilla", "anticoagulante", "cirugía", "cirugia", "alergia", "operación", "operacion"]
      }
    ],

    physical_exam: {
      findings: {
        signos_vitales: "TA 118/72 mmHg · FC 88 lpm · T° 36.9°C · FR 16 rpm · SatO₂ 99%",
        inspeccion_general: "Adolescente en buen estado general, consciente y orientado. Con expresión de dolor leve.",
        inspeccion_cabeza: "Hematoma occipital derecho 3×3 cm. Sin herida abierta. Sin hundimiento palpable.",
        palpacion_craneo: "Sin hundimiento. Dolor leve a la palpación sobre el hematoma.",
        evaluacion_glasgow: "Glasgow 15/15. Orientado en tiempo y espacio. Responde preguntas adecuadamente.",
        examen_pupilas: "Pupilas isocóricas 3 mm. Reflejo fotomotor directo y consensual presente y simétrico.",
        examen_neurologico: "Fuerza 5/5 en 4 miembros. Reflejos osteotendinosos simétricos. Reflejo plantar flexor bilateral. Sin dismetría. Sin nistagmo."
      }
    },

    studies: {
      indicated: [
        { id: "tc_craneo", label: "TC de cráneo sin contraste", result: "Sin lesiones intracraneanas agudas. Sin fracturas de cráneo.", pertinence: "critical", note: "Indicada: vómitos repetidos + pérdida de consciencia" }
      ],
      omitted_critical: ["tc_craneo"]
    },

    rubric_weights: {
      apertura: 5,
      anamnesis: 20,
      examen_fisico: 25,
      razonamiento: 20,
      diagnostico: 15,
      estudios: 15
    },

    critical_data_ids: ["perdida_consciencia", "vomitos", "glasgow"],
    important_data_ids: ["mecanismo", "amnesia", "cefalea", "pupilas", "hematoma_ef", "examen_neuro"],
    secondary_data_ids: ["antecedentes"],

    common_errors: [
      "No preguntar específicamente por pérdida de consciencia",
      "No preguntar cuántas veces vomitó",
      "No evaluar la escala de Glasgow",
      "No realizar examen neurológico completo",
      "Solicitar radiografía de cráneo en vez de TC",
      "No reconocer los criterios de TC (vómitos repetidos + pérdida de consciencia)"
    ]
  },

  patient_persona_prompt: `Sos un adolescente de unos 17 años. Estás en la guardia porque te golpeaste la cabeza jugando al fútbol y vomitaste.

PERSONALIDAD: Cooperativo pero de pocas palabras. Adolescente. Un poco asustado pero lo disimulás.

INFORMACIÓN QUE TENÉS:
- Chocaste de cabeza con otro jugador. Caíste al piso.
- Tus compañeros dicen que "te fuiste" un minuto, pero vos no lo recordás.
- No recordás el golpe ni los minutos antes.
- Vomitaste dos veces. La última fue hace como media hora.
- Te duele la cabeza bastante.
- Estás orientado y respondés bien.

REGLAS:
- Sobre la pérdida de consciencia: si preguntan si te desmayaste o perdiste el conocimiento, decí que no sabés, que no lo recordás. Si preguntan qué dicen los compañeros, ahí contás lo que ellos dicen.
- Respondés directamente y con pocas palabras. No sos dramático.
- Máximo 2-3 oraciones por respuesta.
- Respondé en español rioplatense informal.`
};

// ─── REGISTRO DE CASOS ───────────────────────────────────────────────────────
// Para agregar un nuevo caso: crear la constante arriba y agregarla acá.
const CASES = {
  "its-001": ITS_001,
  "its-002": ITS_002,
  "tec-001": TEC_001
};
