// ═══════════════════════════════════════════════════════════════════════════════
// CASOS CLÍNICOS  -  Tamizaje y Ciencias del Diagnóstico  -  UNMdP 2026
// Imágenes disponibles: paciente-masculino, paciente-femenino, paciente-hijo
// Para agregar un caso: copiar estructura y agregar en CASES al final
// ═══════════════════════════════════════════════════════════════════════════════

const ICTNEO_001 = {
  id:"ictneo-001", topic_id:"ictericia_neonatal", topic_label:"Ictericia neonatal",
  parcial:1, difficulty:"facil",
  diagnosis_real:"ictericia_fisiologica",
  diagnosis_label:"Ictericia neonatal fisiológica",
  differentials:["Ictericia por lactancia materna","Incompatibilidad ABO","Enfermedad hemolítica del RN"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi bebé amaneció amarillo", context:"Consultorio pediátrico" },
  personality:{ trust_base:70, type:"madre_ansiosa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer joven entra al consultorio con un recién nacido en brazos. Tiene cara de no haber dormido.",
      "Entra una madre joven con su bebé. Se sienta rápido y empieza a hablar antes de que el médico diga algo.",
    ],
    clinical_data:[
      { id:"edad_rn", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Bebé de 3 días. Nacido a término (39 semanas), parto vaginal sin complicaciones.", reveal_threshold_trust:0, exam_required:false, keywords:["cuántos días","edad","cuando nació","semanas"] },
      { id:"ictericia_inicio", category:"Enfermedad actual", importance:"important", revealed:false, value:"La ictericia comenzó hoy a la mañana, empezó en la cara y se extendió al tronco.", reveal_threshold_trust:0, exam_required:false, keywords:["cuando empezó","apareció","comenzó","desde cuando"] },
      { id:"alimentacion", category:"Antecedentes", importance:"critical", revealed:false, value:"Lactancia materna exclusiva. El bebé agarra bien el pecho, 6-8 mamadas por día.", reveal_threshold_trust:0, exam_required:false, keywords:["alimentación","pecho","mamar","lactancia","toma","come"] },
      { id:"deposiciones", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Deposiciones amarillas normales. Orina clara.", reveal_threshold_trust:0, exam_required:false, keywords:["caca","deposición","materia fecal","orina","pis","color"] },
      { id:"grupo_sanguineo", category:"Antecedentes", importance:"important", revealed:false, value:"Madre grupo A positivo. Grupo del bebé aún no conocido.", reveal_threshold_trust:0, exam_required:false, keywords:["grupo","sangre","Rh","tipo de sangre"] },
      { id:"antecedentes_perinatales", category:"Antecedentes", importance:"secondary", revealed:false, value:"Embarazo sin complicaciones. Serologías maternas normales.", reveal_threshold_trust:0, exam_required:false, keywords:["embarazo","parto","complicaciones","controles"] },
      { id:"examen_ictericia", category:"Examen físico", importance:"critical", revealed:false, value:"Ictericia en cara y tronco (zona 1-2 de Kramer). No afecta palmas ni plantas. Bebé activo, succión presente, tono normal.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","examen_neonato"], keywords:[] },
      { id:"no_coluria_acolia", category:"Síntomas asociados", importance:"important", revealed:false, value:"No hay coluria ni acolia. Orina clara y deposiciones amarillas.", reveal_threshold_trust:0, exam_required:false, keywords:["orina oscura","caca blanca","acolia","coluria"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"RN activo. Ictericia en cara y tronco. No palmas ni plantas. Sin hepatoesplenomegalia.",
      examen_neonato:"Tono normal. Moro presente. Succión fuerte. Fontanela normotensa. Peso 3.250 g.",
      signos_vitales:"FC 148 · FR 42 · T° 36.8°C · Peso 3.250 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso, talla",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neonato",
        label:"Examen neonatal completo",
        description:"Tono, reflejos, fontanela, antropometría",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  ictericia",
        description:"Evaluar zona de Kramer, extensión de ictericia",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ictneo_ictericia_neonatal.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ictericia neonatal",
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatoesplenomegalia, masas",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado en ictericia fisiológica sin signos de alarma",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"bilirrubina_total", label:"Bilirrubina total y directa", result:"BT 11 mg/dL · BD 0.3 mg/dL  -  patrón indirecto (fisiológico)", pertinence:"critical" },
      { id:"grupo_rh_rn", label:"Grupo y Rh del RN", result:"A positivo  -  sin incompatibilidad ABO", pertinence:"important" },
      { id:"coombs_directo", label:"Coombs directo", result:"Negativo", pertinence:"important" },
    ], omitted_critical:["bilirrubina_total"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:20, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["edad_rn","deposiciones","examen_ictericia"],
    important_data_ids:["ictericia_inicio","alimentacion","grupo_sanguineo","no_coluria_acolia"],
    secondary_data_ids:["antecedentes_perinatales"],
    common_errors:["No preguntar por color de deposiciones","No evaluar zona de Kramer","No solicitar bilirrubina"]
  },
  patient_persona_prompt:`Sos una madre de 27 años. Traés tu bebé de 3 días porque amaneció amarillo. Estás nerviosa pero cooperativa.
INFORMACIÓN: Bebé de 3 días, nacido bien. Amarillo desde esta mañana, primero en la cara. Lactancia materna, mama bien. Deposiciones amarillas, orina clara. Grupo A positivo.
REGLAS: Vocabulario coloquial. Máximo 3-4 oraciones. Español rioplatense.`
};

const ICTNEO_002 = {
  id:"ictneo-002", topic_id:"ictericia_neonatal", topic_label:"Ictericia neonatal",
  parcial:1, difficulty:"normal",
  diagnosis_real:"enfermedad_hemolitica_rn_abo",
  diagnosis_label:"Enfermedad hemolítica del RN por incompatibilidad ABO",
  differentials:["Ictericia fisiológica","Esferocitosis hereditaria","Déficit de G6PD"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi bebé está muy amarillo y no para de llorar", context:"Guardia pediátrica" },
  personality:{ trust_base:55, type:"madre_muy_asustada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer entra a la guardia con un bebé con piel claramente amarilla. Está llorando.",
      "Entra una madre con cara de agotamiento total. Trae al bebé apretado contra el pecho.",
    ],
    clinical_data:[
      { id:"edad_rn", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Bebé de 5 días. Nacido a término (38 semanas), parto vaginal.", reveal_threshold_trust:0, exam_required:false, keywords:["cuántos días","edad","cuando nació","días tiene","semanas"] },
      { id:"ictericia_precoz", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Ictericia a las 24 horas de vida. Alta con algo de amarillo  -  dijeron que era normal. Hoy mucho más intensa.", reveal_threshold_trust:0, exam_required:false, keywords:["cuando empezó","cuándo","en la clínica","alta","antes"] },
      { id:"grupo_sanguineo", category:"Antecedentes", importance:"critical", revealed:false, value:"Madre O positivo. Bebé A positivo (informado al alta).", reveal_threshold_trust:0, exam_required:false, keywords:["grupo","sangre","Rh","O","A"] },
      { id:"examen_ictericia", category:"Examen físico", importance:"critical", revealed:false, value:"Ictericia intensa, zonas 4-5 de Kramer (palmas y plantas amarillas). Bebé irritable, hipertónico.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","examen_neonato"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Ictericia intensa con compromiso de palmas y plantas. Irritable, hipertónico.",
      examen_neonato:"Fontanela normotensa. Tono aumentado. Llanto agudo. Peso 3.150 g.",
      signos_vitales:"FC 162 · FR 46 · T° 37°C · Peso 3.150 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  ictericia",
        description:"Zona de Kramer, palidez por hemólisis",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ictneo_ictericia_neonatal.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ictericia neonatal",
      },
      {
        id:"examen_neonato",
        label:"Examen neonatal",
        description:"Tono, reflejos, fontanela",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatoesplenomegalia (hemólisis)",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico extenso",
        description:"No indicado de entrada salvo signos de kernícterus",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"bilirrubina_total", label:"Bilirrubina total y directa", result:"BT 24 mg/dL · BD 0.8 mg/dL  -  hiperbilirrubinemia indirecta grave. Fototerapia urgente.", pertinence:"critical" },
      { id:"coombs_directo", label:"Coombs directo", result:"Positivo débil (+)  -  compatible con incompatibilidad ABO", pertinence:"critical" },
      { id:"hemograma_rn", label:"Hemograma", result:"Hb 13.5 g/dL. Reticulocitos 8% (hemólisis). Esferocitos en frotis.", pertinence:"important" },
    ], omitted_critical:["bilirrubina_total","coombs_directo"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:20, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["edad_rn","ictericia_precoz","grupo_sanguineo","examen_ictericia"],
    important_data_ids:[],
    secondary_data_ids:[],
    common_errors:["No preguntar grupo sanguíneo de la madre","No reconocer que ictericia en primeras 24h es siempre patológica","No evaluar palmas y plantas (Kramer 4-5)"]
  },
  patient_persona_prompt:`Sos una madre de 30 años. Tu bebé de 5 días está muy amarillo e irritable. Estás agotada y asustada.
INFORMACIÓN: Bebé de 5 días. En la clínica dijeron que el amarillo era normal. Hoy está mucho más amarillo y no para de llorar. Tu grupo es O positivo, el del bebé A positivo.
REGLAS: Vocabulario coloquial. Máximo 3 oraciones. Español rioplatense.`
};

const ICTNEO_003 = {
  id:"ictneo-003", topic_id:"ictericia_neonatal", topic_label:"Ictericia neonatal",
  parcial:1, difficulty:"dificil",
  diagnosis_real:"atresia_vias_biliares",
  diagnosis_label:"Sospecha de atresia de vías biliares (ictericia colestásica neonatal)",
  differentials:["Hepatitis neonatal idiopática","Déficit de alfa-1-antitripsina","Quiste de colédoco"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi bebé todavía está amarillo y las deposiciones cambiaron de color", context:"Consultorio pediátrico" },
  personality:{ trust_base:60, type:"madre_preocupada_reflexiva" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer entra con un bebé de semanas. Trae una foto en el celular que quiere mostrar.",
      "Entra una madre. Se sienta y dice: 'Sé que algo no está bien, llevo semanas con esto'.",
    ],
    clinical_data:[
      { id:"edad_duracion", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Bebé de 3 semanas. La ictericia nunca desapareció desde el nacimiento.", reveal_threshold_trust:0, exam_required:false, keywords:["cuánto tiene","edad","semanas","días","desde cuando"] },
      { id:"acolia", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Deposiciones blancas o grisáceas desde hace una semana. Trae fotos en el celular.", reveal_threshold_trust:0, exam_required:false, keywords:["caca","deposición","color","blanca","gris","pálida"] },
      { id:"coluria", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Orina oscura, color té.", reveal_threshold_trust:0, exam_required:false, keywords:["orina","pis","color","oscura","marrón","té"] },
      { id:"examen_colestasis", category:"Examen físico", importance:"critical", revealed:false, value:"Ictericia intensa con tinte verdoso. Hepatomegalia 3 cm, consistencia firme. Bazo palpable.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","palpacion_abdomen","examen_neonato"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Ictericia intensa de tinte verdoso. Deposición blanquecina en el pañal.",
      palpacion_abdomen:"Hepatomegalia 3 cm, consistencia firme. Bazo palpable 1 cm. Sin ascitis.",
      examen_neonato:"Peso adecuado. Tono normal. Fontanela normotensa.",
      signos_vitales:"FC 144 · FR 40 · T° 36.9°C · Peso 4.100 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  ictericia",
        description:"Zona de Kramer, coloración de heces y orina",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ictneo_ictericia_neonatal.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ictericia neonatal",
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatomegalia, esplenomegalia",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No prioritario en atresia biliar",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"orofaringe",
        label:"Examen de orofaringe",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"bilirrubina_fracciones", label:"Bilirrubina total, directa e indirecta", result:"BT 14 mg/dL · BD 9.8 mg/dL (70%  -  patrón colestásico). Estudio urgente.", pertinence:"critical" },
      { id:"hepatograma", label:"Hepatograma (TGP, TGO, FA, GGT)", result:"TGP 85 · TGO 72 · FA 890 · GGT 312 UI/L  -  GGT muy elevada, sugestiva de atresia biliar.", pertinence:"critical" },
      { id:"ecografia_abdominal", label:"Ecografía abdominal", result:"Vesícula pequeña, pared irregular. No se visualiza colédoco. Hígado heterogéneo.", pertinence:"critical" },
    ], omitted_critical:["bilirrubina_fracciones","hepatograma","ecografia_abdominal"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:20, razonamiento:20, diagnostico:10, estudios:5 },
    critical_data_ids:["edad_duracion","acolia","coluria","examen_colestasis"],
    important_data_ids:[],
    secondary_data_ids:[],
    common_errors:["No preguntar por color de deposiciones","No preguntar por color de orina","No palpar abdomen","Tranquilizar sin solicitar bilirrubina directa","Ictericia colestásica >2 semanas requiere estudio urgente"]
  },
  patient_persona_prompt:`Sos una madre de 32 años. Tu bebé de 3 semanas sigue amarillo y las cacas están blancas. Traés fotos.
INFORMACIÓN: Bebé de 3 semanas. Ictericia desde el nacimiento. Deposiciones blancas hace una semana. Orina oscura, color té. Mama bien, gana peso.
REGLAS: Si preguntan por las cacas, ofrecés mostrar la foto. Máximo 3-4 oraciones. Español rioplatense.`
};

const PESQNEO_001 = {
  id:"pesqneo-001", topic_id:"pesquisa_neonatal", topic_label:"Pesquisa neonatal",
  parcial:1, difficulty:"normal",
  diagnosis_real:"hipotiroidismo_congenito",
  diagnosis_label:"Hipotiroidismo congénito primario (pesquisa alterada)",
  differentials:["Hipotiroidismo transitorio","Falso positivo","Hipotiroidismo central"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Me llamaron del hospital por los análisis del bebé, dicen que salió algo alterado", context:"Consultorio pediátrico" },
  personality:{ trust_base:55, type:"madre_confundida_asustada" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre joven entra con un bebé de 2 semanas. Tiene un papel en la mano. No entiende qué dice.",
      "Entra una mujer con el bebé en el cochecito. 'No entiendo qué dice esto', dice antes de sentarse.",
    ],
    clinical_data:[
      { id:"edad_rn", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Bebé de 14 días. Nacida a término, parto normal.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","días","semanas","cuánto tiene"] },
      { id:"resultado_pesquisa", category:"Enfermedad actual", importance:"critical", revealed:false, value:"TSH en papel de filtro: 45 mUI/L (corte: 10 mUI/L). La llamaron para confirmación.", reveal_threshold_trust:0, exam_required:false, keywords:["resultado","análisis","papel","qué dice","TSH"] },
      { id:"cuando_se_saco", category:"Antecedentes", importance:"important", revealed:false, value:"Muestra sacada a las 48 horas de vida  -  dentro del plazo correcto.", reveal_threshold_trust:0, exam_required:false, keywords:["cuando sacaron","muestra","sangre"] },
      { id:"sintomas_hipotiroidismo", category:"Síntomas asociados", importance:"important", revealed:false, value:"Bebé muy tranquila, duerme mucho, mama despacio, constipación desde hace días.", reveal_threshold_trust:0, exam_required:false, keywords:["duerme","tranquila","mama","caca","constipación","síntomas"] },
      { id:"examen_hipotiroidismo", category:"Examen físico", importance:"important", revealed:false, value:"Hipotonía leve. Fontanela posterior amplia. Piel seca. Macroglosia leve. Sin bocio.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_neonato","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"RN tranquila, hipoactiva. Piel seca. Macroglosia sutil.",
      examen_neonato:"Hipotonía axial leve. Fontanela posterior amplia (>1 cm). Succión lenta. Sin bocio.",
      signos_vitales:"FC 130 · FR 36 · T° 36.5°C · Peso 3.500 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso, talla",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neonato",
        label:"Examen neonatal completo",
        description:"Tono, reflejos, fontanela (puede estar abombada en hipotiroidismo)",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Rasgos de hipotiroidismo: macroglosia, piel seca, hipoactividad",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal extensa",
        description:"Sin indicación prioritaria en pesquisa neonatal inicial",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"tshs_t4_confirmacion", label:"TSH y T4 libre séricos (confirmación)", result:"TSH 98 mUI/L · T4 libre 0.6 ng/dL  -  confirma hipotiroidismo congénito primario.", pertinence:"critical" },
      { id:"ecografia_tiroidea", label:"Ecografía tiroidea", result:"Tiroides pequeña en posición normal. Sin bocio.", pertinence:"important" },
    ], omitted_critical:["tshs_t4_confirmacion"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:25, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["resultado_pesquisa","sintomas_hipotiroidismo"],
    important_data_ids:["edad_rn","cuando_se_saco","examen_hipotiroidismo"],
    secondary_data_ids:[],
    common_errors:["No explicar qué es la pesquisa neonatal","No confirmar con TSH sérica","No buscar signos clínicos de hipotiroidismo","No aclarar que el tratamiento debe comenzar antes de los 30 días"]
  },
  patient_persona_prompt:`Sos una madre de 25 años. Te llamaron porque el análisis de pesquisa de tu bebé de 2 semanas salió alterado. No entendés qué significa TSH.
INFORMACIÓN: Bebé de 14 días, nacida bien. El papel dice TSH elevada. Bebé duerme mucho, es muy tranquila, mama despacio, tiene constipación. La muestra la sacaron a las 48hs de vida.
REGLAS: No entendés los términos médicos  -  pedís explicaciones. Máximo 3-4 oraciones. Español rioplatense.`
};


const ITU_001 = {
  id:"itu-001", topic_id:"itu_pediatrica", topic_label:"ITU pediátrica",
  parcial:1, difficulty:"normal",
  diagnosis_real:"itu_alta_pielonefritis",
  diagnosis_label:"Pielonefritis aguda  -  primera ITU febril",
  differentials:["ITU baja","Fiebre sin foco por otra causa","Apendicitis atípica"],
  patient:{ sex:"F", visual_id:"paciente-hijo", chief_complaint:"Mi hija tiene fiebre alta hace 2 días y no sé de dónde viene", context:"Guardia pediátrica" },
  personality:{ trust_base:65, type:"madre_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer entra a la guardia con una nena de 3 años que parece decaída. No quiere bajarse de los brazos de la mamá.",
      "Entra una mamá con su hija pequeña. La nena tiene cara de dormida.",
    ],
    clinical_data:[
      { id:"edad_paciente", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Niña de 3 años.", reveal_threshold_trust:0, exam_required:false, keywords:["cuántos años","edad","años tiene"] },
      { id:"fiebre_duracion", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Fiebre de 39.5°C desde hace 2 días. No cede bien con ibuprofeno.", reveal_threshold_trust:0, exam_required:false, keywords:["fiebre","temperatura","cuánto","desde cuándo","días"] },
      { id:"sin_foco_respiratorio", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin tos, sin mocos, sin odinofagia.", reveal_threshold_trust:0, exam_required:false, keywords:["tos","mocos","garganta","resfrío","respiratorio"] },
      { id:"sintomas_urinarios", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Llora cuando hace pis desde ayer. Orina con olor raro, más fuerte.", reveal_threshold_trust:0, exam_required:false, keywords:["pis","orina","llora","le duele","ardor","huele","olor"] },
      { id:"itu_previa", category:"Antecedentes", importance:"critical", revealed:false, value:"Primera infección urinaria  -  nunca tuvo antes.", reveal_threshold_trust:0, exam_required:false, keywords:["antes","primera vez","otras veces","ITU previa"] },
      { id:"examen_fisico_itu", category:"Examen físico", importance:"important", revealed:false, value:"Puño-percusión renal positiva bilateral (más intensa derecha). Sin defensa abdominal.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen","examen_pediatrico"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Niña de 3 años, decaída, febril. Sin foco en vías aéreas superiores.",
      palpacion_abdomen:"Blando. Puño-percusión lumbar positiva bilateral (más derecha). Sin defensa.",
      examen_pediatrico:"Faringe sin eritema. Otoscopia normal. Genitales sin vulvovaginitis.",
      signos_vitales:"T° 39.3°C · FC 132 · FR 28 · TA 90/60 · Peso 14 kg"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación lumbar y abdominal",
        description:"Puño-percusión lumbar, globo vesical",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_pediatrico",
        label:"Examen genitourinario pediátrico",
        description:"Genitales externos, fimosis, prepucio",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Hidratación, estado general, palidez",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"signos_vitales",
        label:"Signos vitales completos",
        description:"T°, FC, FR, TA",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación en ITU febril pediátrica",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"orofaringe",
        label:"Examen de orofaringe",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"sedimento_urinario", label:"Sedimento urinario", result:"80 leucocitos/campo · Bacteriuria ++ · Nitritos positivos · Hematíes 15/campo.", pertinence:"critical" },
      { id:"urocultivo", label:"Urocultivo (previo al antibiótico)", result:"Pendiente 48-72hs.", pertinence:"critical" },
      { id:"hemograma_pcr", label:"Hemograma y PCR", result:"Leucocitosis 18.000 (PMN 82%) · PCR 85 mg/L.", pertinence:"important" },
      { id:"ecografia_renal", label:"Ecografía renal y vesical", result:"Riñón derecho levemente aumentado, pérdida leve de diferenciación corticomedular. Sin uronefrosis.", pertinence:"important" },
    ], omitted_critical:["sedimento_urinario","urocultivo"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:20, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["fiebre_duracion","sintomas_urinarios","itu_previa"],
    important_data_ids:["edad_paciente","sin_foco_respiratorio","examen_fisico_itu"],
    secondary_data_ids:[],
    common_errors:["No preguntar síntomas urinarios en fiebre sin foco","No preguntar si es la primera ITU","No realizar puño-percusión lumbar","No solicitar urocultivo previo al antibiótico"]
  },
  patient_persona_prompt:`Sos la madre de una nena de 3 años. Traés a tu hija a la guardia por fiebre alta de 2 días. Cansada de 2 noches sin dormir pero cooperativa.
INFORMACIÓN: Nena de 3 años, fiebre 39.5° hace 2 días, no baja bien. Sin tos ni mocos. Llora cuando hace pis desde ayer, la orina huele raro. Primera vez que le pasa.
REGLAS: Hablás sobre tu hija. Vocabulario coloquial. Máximo 3-4 oraciones. Español rioplatense.`
};

const CEL_001 = {
  id:"cel-001", topic_id:"diarrea_cronica", topic_label:"Celiaquía",
  parcial:1, difficulty:"normal",
  diagnosis_real:"enfermedad_celiaca",
  diagnosis_label:"Enfermedad celíaca (diagnóstico inicial)",
  differentials:["Intolerancia a la lactosa","Síndrome de intestino irritable","EII","Parasitosis intestinal"],
  patient:{ sex:"F", visual_id:"paciente-hijo", chief_complaint:"Mi hijo tiene diarrea hace meses y no crece bien", context:"Consultorio pediátrico" },
  personality:{ trust_base:65, type:"madre_preocupada_cansada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer entra con un nene de 4 años que parece delgado. La madre trae una carpeta con papeles.",
      "Entra una madre con su hijo de la mano. El nene tiene la panza distendida.",
    ],
    clinical_data:[
      { id:"edad_duracion", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Nene de 4 años. Diarrea crónica desde los 18 meses, cuando empezó a comer pan.", reveal_threshold_trust:0, exam_required:false, keywords:["cuántos años","edad","cuándo empezó","desde cuándo","tiempo"] },
      { id:"caracteristicas_diarrea", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Deposiciones blandas a líquidas 3-5 por día, brillantes, difíciles de limpiar del inodoro (esteatorrea).", reveal_threshold_trust:0, exam_required:false, keywords:["caca","deposición","blanda","líquida","veces","brillante","grasa"] },
      { id:"crecimiento", category:"Síntomas asociados", importance:"critical", revealed:false, value:"No crece bien desde los 2 años. Pediatra dijo que está por debajo de la curva.", reveal_threshold_trust:0, exam_required:false, keywords:["crecer","peso","talla","curva","bajo"] },
      { id:"relacion_gluten", category:"Antecedentes", importance:"critical", revealed:false, value:"Empeora cuando come pan, fideos o galletitas. Mejora cuando come más arroz y papa.", reveal_threshold_trust:0, exam_required:false, keywords:["pan","pasta","fideos","trigo","gluten","empeora","mejora"] },
      { id:"antecedentes_familiares", category:"Antecedentes", importance:"important", revealed:false, value:"Una tía paterna tiene 'algo con el gluten'.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","celiaco","tía","papá","gluten","antecedentes"] },
      { id:"examen_celiaco", category:"Examen físico", importance:"important", revealed:false, value:"Talla P10. Peso P5. Distensión abdominal importante. Masa muscular reducida. Pelo seco. Piel pálida.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen","examen_pediatrico"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Nene delgado. Distensión abdominal. Masa muscular glútea reducida. Pelo opaco. Piel pálida.",
      palpacion_abdomen:"Distendido, timpánico. Sin dolor. Sin visceromegalias.",
      examen_pediatrico:"Talla 95 cm (P10). Peso 14 kg (P5).",
      signos_vitales:"T° 36.6°C · FC 100 · Peso 14 kg · Talla 95 cm"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, peso, talla  -  buscar retraso del crecimiento",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Distensión, meteorismo, masas",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado nutricional, palidez, distensión abdominal",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_piel",
        label:"Inspección de piel",
        description:"Dermatitis herpetiforme",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/cel_dermatitis_herpetiforme.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Dermatitis herpetiforme",
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado como primer paso en celiaquía",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca extensa",
        description:"Sin sospecha cardíaca",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"anticuerpos_celiaca", label:"Anti-transglutaminasa IgA (tTG-IgA) + IgA total", result:"tTG-IgA 145 U/mL (VN <10)  -  muy elevado. IgA total normal.", pertinence:"critical" },
      { id:"hemograma_anemia", label:"Hemograma y ferritina", result:"Hb 9.8 g/dL · VCM 72 · Ferritina 4 µg/L  -  anemia ferropénica.", pertinence:"important" },
      { id:"biopsia_intestinal", label:"Biopsia duodenal (confirmación)", result:"Atrofia vellositaria severa (Marsh 3c). Confirma celiaquía.", pertinence:"critical" },
    ], omitted_critical:["anticuerpos_celiaca","biopsia_intestinal"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["caracteristicas_diarrea","crecimiento","relacion_gluten"],
    important_data_ids:["edad_duracion","antecedentes_familiares","examen_celiaco"],
    secondary_data_ids:[],
    common_errors:["No preguntar si las deposiciones son brillantes","No preguntar relación con gluten","No preguntar antecedentes familiares de celiaquía","Solicitar biopsia sin anticuerpos previos"]
  },
  patient_persona_prompt:`Sos la madre de un nene de 4 años. Venís porque tiene diarrea hace meses y no crece bien. Traés carpeta con análisis anteriores.
INFORMACIÓN: 4 años, diarrea desde los 18 meses cuando empezó con pan. Deposiciones blandas 3-5 veces por día, brillantes, difíciles de limpiar. No crece bien. Empeora con pan, pasta, galletitas. Mejora con arroz. Una tía tiene algo con el gluten.
REGLAS: Muy detallista. Máximo 4 oraciones. Español rioplatense.`
};

const TEC_001 = {
  id:"tec-001", topic_id:"tec", topic_label:"TEC",
  parcial:1, difficulty:"normal",
  diagnosis_real:"tec_leve_con_criterios_tc",
  diagnosis_label:"TEC leve con criterios de TC (vómitos repetidos + pérdida de consciencia)",
  differentials:["TEC moderado","Hematoma epidural en fase lúcida","Hematoma subdural agudo"],
  patient:{ sex:"M", visual_id:"paciente-hijo", chief_complaint:"Me golpeé la cabeza jugando al fútbol y vomité", context:"Guardia de hospital" },
  personality:{ trust_base:65, type:"cooperativo_adolescente" },
  hidden_state:{
    opening_scene_variants:[
      "Un adolescente entra a la guardia acompañado de su madre. Tiene una mano en la cabeza. Se sienta despacio.",
      "Entra un chico joven. Lo acompaña un adulto nervioso. El chico saluda con un gesto.",
    ],
    clinical_data:[
      { id:"mecanismo", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Choque cabeza a cabeza con otro jugador en fútbol. Cayó al piso.", reveal_threshold_trust:0, exam_required:false, keywords:["cómo pasó","qué pasó","mecanismo","golpe","accidente"] },
      { id:"perdida_consciencia", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Perdió el conocimiento ~1 minuto. Sus compañeros lo vieron. Él no lo recuerda.", reveal_threshold_trust:0, exam_required:false, keywords:["consciencia","desmayó","perdió el conocimiento","compañeros","recuerda","inconsciente"] },
      { id:"amnesia", category:"Enfermedad actual", importance:"important", revealed:false, value:"No recuerda el golpe ni los 5 minutos previos.", reveal_threshold_trust:0, exam_required:false, keywords:["recuerda","memoria","antes del golpe","amnesia"] },
      { id:"vomitos", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Vomitó dos veces. El último hace 30 minutos.", reveal_threshold_trust:0, exam_required:false, keywords:["vóm","vom","náusea","devolvió","cuántas veces","vomitó"] },
      { id:"cefalea", category:"Síntomas asociados", importance:"important", revealed:false, value:"Cefalea 6/10, frontal y occipital, constante.", reveal_threshold_trust:0, exam_required:false, keywords:["cabeza","duele","cefalea","dolor de cabeza"] },
      { id:"glasgow", category:"Examen físico", importance:"critical", revealed:false, value:"Glasgow 15/15. Orientado en tiempo y espacio.", reveal_threshold_trust:0, exam_required:true, exam_ids:["evaluacion_glasgow"], keywords:[] },
      { id:"pupilas", category:"Examen físico", importance:"important", revealed:false, value:"Pupilas isocóricas y reactivas, 3 mm bilateral.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_pupilas"], keywords:[] },
      { id:"hematoma_ef", category:"Examen físico", importance:"important", revealed:false, value:"Hematoma occipital derecho 3×3 cm. Sin herida abierta. Sin hundimiento.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_cabeza","palpacion_craneo"], keywords:[] },
      { id:"examen_neuro", category:"Examen físico", importance:"important", revealed:false, value:"Sin focalidad neurológica. Fuerza 5/5 en 4 miembros. Reflejos simétricos.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_neurologico"], keywords:[] },
      { id:"antecedentes", category:"Antecedentes", importance:"secondary", revealed:false, value:"Sin antecedentes. Sin medicación. Sin anticoagulantes.", reveal_threshold_trust:0, exam_required:false, keywords:["antecedente","enfermedad","medicación","anticoagulante"] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 118/72 · FC 88 · T° 36.9°C · FR 16 · SatO₂ 99%",
      inspeccion_general:"Adolescente consciente y orientado. Hematoma occipital derecho visible.",
      inspeccion_cabeza:"Hematoma occipital derecho 3×3 cm. Sin herida abierta. Sin hundimiento.",
      palpacion_craneo:"Sin hundimiento. Dolor leve a la palpación.",
      evaluacion_glasgow:"Glasgow 15/15. Orientado. Responde adecuadamente.",
      examen_pupilas:"Isocóricas 3 mm. Reflejo fotomotor simétrico.",
      examen_neurologico:"Fuerza 5/5. Reflejos simétricos. Plantar flexor. Sin dismetría."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA, saturación",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"evaluacion_glasgow",
        label:"Escala de Glasgow",
        description:"Evaluación del nivel de conciencia",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_pupilas",
        label:"Examen pupilar",
        description:"Tamaño, simetría, reflejo fotomotor",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_cabeza",
        label:"Inspección de cráneo",
        description:"Hematomas, heridas, deformidades",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Focalidad neurológica",
        description:"Fuerza, sensibilidad, pares craneales",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal completa",
        description:"No prioritaria en TEC aislado sin trauma abdominal",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con TEC",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"tc_craneo", label:"TC de cráneo sin contraste (urgente)", result:"Sin lesiones intracraneanas. Sin fracturas. Hematoma de partes blandas occipital.", pertinence:"critical" },
    ], omitted_critical:["tc_craneo"] },
    rubric_weights:{ apertura:5, anamnesis:20, examen_fisico:25, razonamiento:20, diagnostico:15, estudios:15 },
    critical_data_ids:["perdida_consciencia","vomitos","glasgow"],
    important_data_ids:["mecanismo","amnesia","cefalea","pupilas","hematoma_ef","examen_neuro"],
    secondary_data_ids:["antecedentes"],
    common_errors:["No preguntar por pérdida de consciencia","No preguntar cuántas veces vomitó","No evaluar Glasgow","Solicitar Rx en vez de TC","No reconocer criterios de TC en TEC leve"]
  },
  patient_persona_prompt:`Sos un adolescente de 17 años. Estás en la guardia porque te golpeaste la cabeza jugando al fútbol y vomitaste. Pocas palabras, un poco asustado.
INFORMACIÓN: Chocaste de cabeza con otro jugador. Caíste al piso. Tus compañeros dicen que te fuiste un minuto pero no lo recordás. No recordás el golpe ni los minutos antes. Vomitaste dos veces, la última hace media hora. Te duele la cabeza bastante.
REGLAS: Si preguntan si perdiste el conocimiento: 'No sé, no lo recuerdo. Mis compañeros dicen que sí.' Máximo 2-3 oraciones. Español rioplatense.`
};

const TEC_002 = {
  id:"tec-002", topic_id:"tec", topic_label:"TEC",
  parcial:1, difficulty:"facil",
  diagnosis_real:"tec_leve_sin_criterios_tc",
  diagnosis_label:"TEC leve sin criterios de TC  -  observación domiciliaria",
  differentials:["TEC moderado","Síndrome postconmocional"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Me di un golpe en la cabeza cayéndome de la bicicleta", context:"Guardia de hospital" },
  personality:{ trust_base:75, type:"adulto_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 35 años entra caminando bien. Tiene un raspón en la frente. 'Vine por las dudas', dice.",
      "Entra un hombre adulto. Se lo ve bien. Se sienta y espera.",
    ],
    clinical_data:[
      { id:"mecanismo", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Caída de bicicleta a baja velocidad. Golpe frontal. Usaba casco.", reveal_threshold_trust:0, exam_required:false, keywords:["cómo pasó","qué pasó","bicicleta","mecanismo","casco","caída"] },
      { id:"sin_perdida_consciencia", category:"Enfermedad actual", importance:"critical", revealed:false, value:"No perdió el conocimiento. Recuerda todo.", reveal_threshold_trust:0, exam_required:false, keywords:["consciencia","desmayó","perdió","recuerda","inconsciente"] },
      { id:"sin_vomitos", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Sin náuseas ni vómitos.", reveal_threshold_trust:0, exam_required:false, keywords:["vomitó","náusea","devolvió","mareo"] },
      { id:"cefalea_leve", category:"Síntomas asociados", importance:"important", revealed:false, value:"Leve dolor de cabeza en el sitio del golpe, 3/10. Sin progresión.", reveal_threshold_trust:0, exam_required:false, keywords:["cabeza","duele","dolor","cefalea"] },
      { id:"glasgow_normal", category:"Examen físico", importance:"critical", revealed:false, value:"Glasgow 15/15. Orientado en tiempo, persona y espacio.", reveal_threshold_trust:0, exam_required:true, exam_ids:["evaluacion_glasgow"], keywords:[] },
      { id:"herida_frente", category:"Examen físico", importance:"important", revealed:false, value:"Herida superficial frontal 2 cm, limpia. Sin hundimiento.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_cabeza"], keywords:[] },
      { id:"antecedentes", category:"Antecedentes", importance:"secondary", revealed:false, value:"Sin antecedentes. No toma anticoagulantes. No alcohol.", reveal_threshold_trust:0, exam_required:false, keywords:["antecedente","medicación","anticoagulante","alcohol"] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 125/78 · FC 78 · T° 36.7°C · SatO₂ 99%",
      inspeccion_general:"Adulto en buen estado general. Alerta, orientado.",
      inspeccion_cabeza:"Herida superficial frontal 2 cm, limpia. Sin hundimiento. Sin hematoma significativo.",
      evaluacion_glasgow:"Glasgow 15/15. Orientado.",
      examen_neurologico:"Sin focalidad. Fuerza y reflejos normales.",
      examen_pupilas:"Isocóricas, reactivas, simétricas."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA, saturación",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"evaluacion_glasgow",
        label:"Escala de Glasgow",
        description:"Nivel de conciencia  -  criterio para TC",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_pupilas",
        label:"Examen pupilar",
        description:"Isocoria, reflejo fotomotor",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_cabeza",
        label:"Inspección y palpación de cráneo",
        description:"Heridas, hundimientos, equimosis",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Sin trauma abdominal reportado",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[], omitted_critical:[] },
    rubric_weights:{ apertura:5, anamnesis:25, examen_fisico:25, razonamiento:20, diagnostico:15, estudios:10 },
    critical_data_ids:["sin_perdida_consciencia","sin_vomitos","glasgow_normal"],
    important_data_ids:["mecanismo","cefalea_leve","herida_frente"],
    secondary_data_ids:["antecedentes"],
    common_errors:["Solicitar TC sin criterios","No evaluar Glasgow","No preguntar si usaba casco","No preguntar por pérdida de consciencia ni vómitos antes de decidir conducta"]
  },
  patient_persona_prompt:`Sos un hombre de 35 años. Te caíste de la bici, te golpeaste la cabeza y viniste por las dudas. Te sentís bien.
INFORMACIÓN: Caída de bici a baja velocidad. Usabas casco. Golpe en la frente. No perdiste el conocimiento, recordás todo. Sin náuseas ni vómitos. Leve dolor en el lugar del golpe. Sin medicaciones ni enfermedades previas. No tomaste alcohol.
REGLAS: Respondés todo. Directo. Máximo 2-3 oraciones. Español rioplatense.`
};

const ITS_001 = {
  id:"its-001", topic_id:"its", topic_label:"ITS", parcial:2, difficulty:"normal",
  diagnosis_real:"sifilis_primaria", diagnosis_label:"Sífilis primaria (úlcera de Hunterian)",
  differentials:["Herpes genital primario","Chancro blando","Linfogranuloma venéreo"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Una lesión en la zona íntima que no me duele", context:"Guardia de hospital público" },
  personality:{ trust_base:40, type:"reservada_avergonzada" },
  hidden_state:{
    opening_scene_variants:[
      "Una joven entra al consultorio. Cierra la puerta con cuidado y se sienta sin decir nada todavía.",
      "Entra una paciente joven. Evita el contacto visual. Se acomoda con los brazos cruzados.",
    ],
    clinical_data:[
      { id:"lesion_tiempo", category:"Enfermedad actual", importance:"important", revealed:false, value:"La lesión tiene aproximadamente 10 días de evolución.", reveal_threshold_trust:0, exam_required:false, keywords:["cuando","cuanto tiempo","hace cuanto","empezó","apareció","días"] },
      { id:"lesion_caracteristicas", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Lesión única en labio mayor izquierdo. No duele. Bordes definidos. No sangra.", reveal_threshold_trust:0, exam_required:false, keywords:["como es","duele","sangra","tipo","describí"] },
      { id:"pareja_nueva", category:"Antecedentes sexuales", importance:"critical", revealed:false, value:"Tuvo relaciones sexuales sin preservativo con una pareja nueva hace 6 semanas.", reveal_threshold_trust:45, exam_required:false, keywords:["pareja","relaciones","sexual","sexuales","alguien nuevo","última relación"] },
      { id:"sin_preservativo", category:"Antecedentes sexuales", importance:"critical", revealed:false, value:"No usaron preservativo. Fue una relación espontánea.", reveal_threshold_trust:55, exam_required:false, keywords:["preservativo","protección","cuidó","método"] },
      { id:"fiebre_ausente", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin fiebre, sin rash, sin cefalea.", reveal_threshold_trust:0, exam_required:false, keywords:["fiebre","temperatura","sarpullido","rash","otros síntomas"] },
      { id:"its_previas", category:"Antecedentes", importance:"important", revealed:false, value:"Niega ITS previas.", reveal_threshold_trust:50, exam_required:false, keywords:["its","infección sexual","antes","historia","antecedentes"] },
      { id:"menstruacion", category:"Gineco-obstétrico", importance:"secondary", revealed:false, value:"Última menstruación hace 15 días. Regular. No embarazada.", reveal_threshold_trust:0, exam_required:false, keywords:["menstruación","período","regla","atraso","embarazo"] },
      { id:"medicacion", category:"Antecedentes", importance:"secondary", revealed:false, value:"Anticonceptivos orales. Sin alergias.", reveal_threshold_trust:0, exam_required:false, keywords:["medicación","pastilla","anticonceptivo","alergia"] },
      { id:"adenopatias_ef", category:"Examen físico", importance:"important", revealed:false, value:"Adenopatía inguinal bilateral no dolorosa, firme, móvil. Mayor ~1.5 cm.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_ganglios_inguinales","palpacion_ganglios"], keywords:[] },
      { id:"lesion_ef", category:"Examen físico", importance:"critical", revealed:false, value:"Úlcera única ~1 cm, bordes indurados, base limpia, indolora. Labio mayor izquierdo.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_genital"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Buen estado general. Sin compromiso sistémico.",
      inspeccion_genital:"Úlcera única ~1 cm, bordes indurados, base limpia, indolora. Labio mayor izquierdo.",
      palpacion_ganglios_inguinales:"Adenopatía bilateral inguinal. Firme, móvil, no dolorosa. Mayor ~1.5 cm.",
      palpacion_ganglios:"Adenopatía bilateral inguinal. Firme, móvil, no dolorosa.",
      signos_vitales:"TA 110/70 · FC 78 · T° 36.8°C",
      palpacion_abdomen:"Blando, sin dolor, sin visceromegalias."
    }},

    // ── PANEL DE EXAMEN FÍSICO INTERACTIVO ───────────────────────────────────
    // pertinence: "necessary" | "unnecessary"
    // requires_data: id de dato clínico que debe estar revelado para desbloquear
    // points: positivo suma, negativo resta
    // image_url / image_credit: imagen de referencia opcional
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, FR, saturación O₂",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección de la lesión genital",
        description:"Observación directa de la zona genital con guantes",
        pertinence:"necessary",
        points:8,
        requires_data:"lesion_caracteristicas",
        requires_data_label:"Preguntá sobre la lesión antes",
        image_url:"images/examen_fisico/its_sifilis_chancro.jpg",
        image_credit:"CDC Public Health Image Library (dominio público)  -  Chancro sifilítico, sífilis primaria",
      },
      {
        id:"palpacion_ganglios_inguinales",
        label:"Palpación de ganglios inguinales",
        description:"Búsqueda de adenopatías inguinales bilaterales",
        pertinence:"necessary",
        points:5,
        requires_data:"lesion_caracteristicas",
        requires_data_label:"Explorá la lesión primero",
        image_url:"images/examen_fisico/its_adenopatia_inguinal.jpg",
        image_credit:"CDC Public Health Image Library (dominio público)  -  Adenopatía inguinal, sífilis primaria",
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación de ganglios cervicales y axilares",
        description:"Búsqueda de adenopatías generalizadas",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_piel",
        label:"Inspección de piel (rash, lesiones)",
        description:"Búsqueda de exantema o lesiones cutáneas a distancia",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación de abdomen",
        description:"Palpación de vísceras y búsqueda de masas",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Fuerza, reflejos, coordinación, pares craneales",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, aspecto, orientación, hidratación",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        image_url:null,
        image_credit:null,
      },
    ],

    studies:{ indicated:[
      { id:"vdrl", label:"VDRL", result:"Reactivo 1/32", pertinence:"critical" },
      { id:"fta_abs", label:"FTA-ABS / TPHA", result:"Positivo  -  confirma sífilis", pertinence:"critical" },
      { id:"vih", label:"Test de VIH 4ª generación", result:"No reactivo", pertinence:"important" },
      { id:"hepatitis_b", label:"HBsAg", result:"Negativo", pertinence:"important" },
      { id:"naat", label:"NAAT Chlamydia/Gonorrea", result:"Negativo", pertinence:"important" },
    ], omitted_critical:["vdrl","fta_abs","vih"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["lesion_caracteristicas","pareja_nueva","sin_preservativo","lesion_ef"],
    important_data_ids:["lesion_tiempo","fiebre_ausente","adenopatias_ef","its_previas"],
    secondary_data_ids:["menstruacion","medicacion"],
    common_errors:["No explorar antecedentes sexuales","No realizar examen físico genital","No palpar ganglios inguinales","No solicitar VDRL","No solicitar test de VIH"]
  },
  patient_persona_prompt:`Sos una joven de 24 años. Consultás por una lesión genital que no te duele. Reservada y avergonzada, frases cortas, no das información sensible sin confianza.
INFORMACIÓN: Lesión en zona íntima hace 10 días, no duele. Hace 6 semanas relaciones sin preservativo con alguien que conociste. Tenés pareja estable hace 3 meses. Sin fiebre. Anticonceptivos. Sin alergias.
REGLAS: Info sensible solo si el médico fue amable. Podés decir ¿por qué me pregunta eso? Máximo 3 oraciones. Español rioplatense.`
};

const ITS_002 = {
  id:"its-002", topic_id:"its", topic_label:"ITS", parcial:2, difficulty:"dificil",
  diagnosis_real:"vih_infeccion_aguda", diagnosis_label:"Síndrome retroviral agudo (primoinfección VIH)",
  differentials:["Mononucleosis infecciosa","Toxoplasmosis","Sífilis secundaria","Linfoma"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Fiebre, ganglios inflamados y un sarpullido", context:"Consulta de clínica médica" },
  personality:{ trust_base:60, type:"ansioso_informado" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre joven entra rápido. Tiene cara de preocupado. Antes de sentarse ya empieza a hablar.",
      "Entra un paciente masculino joven. Se sienta, apoya los codos en la mesa.",
    ],
    clinical_data:[
      { id:"fiebre_duracion", category:"Enfermedad actual", importance:"important", revealed:false, value:"Fiebre 38.5°C desde hace 8 días. No cede del todo con paracetamol.", reveal_threshold_trust:0, exam_required:false, keywords:["fiebre","temperatura","cuánto hace","días","paracetamol"] },
      { id:"rash", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Sarpullido maculopapular en tronco y brazos, no pruriginoso, hace 5 días.", reveal_threshold_trust:0, exam_required:false, keywords:["sarpullido","rash","manchas","erupción","piel"] },
      { id:"faringitis", category:"Síntomas asociados", importance:"important", revealed:false, value:"Dolor de garganta desde hace 10 días.", reveal_threshold_trust:0, exam_required:false, keywords:["garganta","dolor de garganta","tragar"] },
      { id:"astenia", category:"Síntomas asociados", importance:"important", revealed:false, value:"Cansancio importante. Perdió 2 kg en una semana.", reveal_threshold_trust:0, exam_required:false, keywords:["cansancio","cansado","peso","bajó de peso"] },
      { id:"adenopatias_multiples", category:"Examen físico", importance:"critical", revealed:false, value:"Adenopatías cervicales, axilares e inguinales bilaterales. Móviles, no dolorosas. Mayor ~1.5 cm.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_ganglios","palpacion_ganglios_inguinales"], keywords:[] },
      { id:"hepatomegalia", category:"Examen físico", importance:"important", revealed:false, value:"Hepatomegalia leve. Borde a 2 cm del reborde costal.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen"], keywords:[] },
      { id:"relacion_riesgo", category:"Antecedentes sexuales", importance:"critical", revealed:false, value:"Relación sexual sin preservativo con un hombre desconocido hace 3 semanas.", reveal_threshold_trust:55, exam_required:false, keywords:["relaciones","sexual","pareja","preservativo","vida sexual","contacto"] },
      { id:"preocupacion_vih", category:"Preocupación", importance:"critical", revealed:false, value:"Buscó en internet y cree que puede tener VIH. No lo dice de entrada.", reveal_threshold_trust:45, exam_required:false, keywords:["qué cree","sospecha","preocupa","buscó","internet"] },
      { id:"medicacion", category:"Antecedentes", importance:"secondary", revealed:false, value:"Paracetamol. Sin alergias.", reveal_threshold_trust:0, exam_required:false, keywords:["medicación","toma","alergia"] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 120/75 · FC 92 · T° 38.6°C · FR 18 · SatO₂ 98%",
      inspeccion_general:"Adelgazado, febril, regular estado general.",
      orofaringe:"Eritematosa, sin exudados.",
      palpacion_ganglios:"Adenopatías cervicales, axilares e inguinales bilaterales. Móviles, no dolorosas. Mayor ~1.5 cm.",
      palpacion_ganglios_inguinales:"Adenopatías inguinales bilaterales, móviles, no dolorosas.",
      inspeccion_piel:"Exantema maculopapular en tronco y cara interna de brazos. No pruriginoso.",
      palpacion_abdomen:"Hepatomegalia leve 2 cm. Bazo no palpable."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Aspecto general, adenopatías visibles, rash",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación de ganglios generalizados",
        description:"Cervicales, axilares, inguinales  -  VIH agudo puede dar poliadenopatías",
        pertinence:"necessary",
        points:6,
        requires_data:"sintomas_vih",
        requires_data_label:"Preguntá sobre los síntomas primero",
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_piel",
        label:"Inspección de piel",
        description:"Rash, exantema por seroconversión",
        pertinence:"necessary",
        points:5,
        requires_data:"sintomas_vih",
        requires_data_label:"Preguntá sobre síntomas antes",
        image_url:null,
        image_credit:null,
      },
      {
        id:"orofaringe",
        label:"Inspección de orofaringe",
        description:"Candidiasis, úlceras, faringitis  -  frecuentes en VIH agudo",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado de rutina en VIH agudo sin focalidad",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal extensa",
        description:"No prioritaria en presentación aguda de VIH",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"vih_4gen", label:"Test VIH 4ª generación (Ag p24 + Ac)", result:"Reactivo  -  confirmar con Western Blot.", pertinence:"critical" },
      { id:"hemograma", label:"Hemograma", result:"Linfopenia 900/mm³ · Plaquetas 130.000", pertinence:"important" },
      { id:"hepatograma", label:"Hepatograma", result:"TGP 65 UI/L (elevada) · Resto normal", pertinence:"important" },
      { id:"monotest", label:"Monotest (mononucleosis)", result:"Negativo", pertinence:"important" },
      { id:"vdrl", label:"VDRL", result:"No reactivo", pertinence:"important" },
    ], omitted_critical:["vih_4gen"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:25, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["rash","adenopatias_multiples","relacion_riesgo"],
    important_data_ids:["fiebre_duracion","faringitis","astenia","hepatomegalia"],
    secondary_data_ids:["preocupacion_vih","medicacion"],
    common_errors:["No preguntar antecedentes sexuales en síndrome febril con rash","No solicitar VIH de 4ª generación","No explorar abdomen","Tono estigmatizante"]
  },
  patient_persona_prompt:`Sos un hombre de 29 años. Fiebre, ganglios y sarpullido. Ya buscaste en internet. Ansioso, informado, hablador.
INFORMACIÓN: Fiebre 38.5° hace 8 días, no baja. Sarpullido en tronco hace 5 días, no pica. Dolor de garganta hace 10 días. Ganglios en cuello, axilas e ingles. Muy cansado, bajaste 2 kg. Hace 3 semanas relaciones sin preservativo con un hombre de una app. Buscaste en internet, te preocupa VIH.
REGLAS: Síntomas: libremente. Vida sexual: solo si preguntan con respeto. Máximo 4 oraciones. Español rioplatense.`
};

const ITS_003 = {
  id:"its-003", topic_id:"its", topic_label:"ITS", parcial:2, difficulty:"normal",
  diagnosis_real:"gonorrea_clamidia", diagnosis_label:"Infección cervical por gonorrea / Chlamydia trachomatis",
  differentials:["Vaginosis bacteriana","Tricomoniasis","Vulvovaginitis candidiásica"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Flujo amarillo-verdoso y dolor en la panza baja hace una semana", context:"Centro de salud" },
  personality:{ trust_base:50, type:"reservada_pero_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer joven entra al centro de salud. Se sienta con los brazos cruzados. Parece incómoda.",
      "Entra una paciente de unos 22 años. Saluda y baja la voz para hablar.",
    ],
    clinical_data:[
      { id:"flujo_caracteristicas", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Flujo amarillo-verdoso, abundante, con mal olor, desde hace 7 días.", reveal_threshold_trust:0, exam_required:false, keywords:["flujo","secreción","amarillo","verde","olor","cuándo empezó"] },
      { id:"dolor_pelvis", category:"Síntomas asociados", importance:"important", revealed:false, value:"Dolor leve en la parte baja del abdomen. Sin fiebre.", reveal_threshold_trust:0, exam_required:false, keywords:["dolor","panza","pelvis","abdomen","fiebre"] },
      { id:"dispareunia", category:"Síntomas asociados", importance:"important", revealed:false, value:"Dolor durante las relaciones sexuales desde hace una semana.", reveal_threshold_trust:40, exam_required:false, keywords:["relaciones","duele","sexo","dispareunia"] },
      { id:"pareja_nueva_2", category:"Antecedentes sexuales", importance:"critical", revealed:false, value:"Pareja nueva hace 3 semanas. Sin preservativo.", reveal_threshold_trust:50, exam_required:false, keywords:["pareja","relaciones","sexual","preservativo","nuevo"] },
      { id:"its_previa_2", category:"Antecedentes", importance:"important", revealed:false, value:"Gonorrea hace 2 años, tratada.", reveal_threshold_trust:50, exam_required:false, keywords:["antes","otras veces","ITS","gonorrea","antecedentes"] },
      { id:"examen_gineco", category:"Examen físico", importance:"critical", revealed:false, value:"Cérvix eritematoso con secreción mucopurulenta en OCE. Dolor a la movilización cervical. Útero levemente doloroso.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_ginecologico","inspeccion_genital"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general, afebril.",
      signos_vitales:"TA 118/72 · T° 36.9°C · FC 82",
      inspeccion_genital:"Flujo vaginal amarillo-verdoso, abundante.",
      examen_ginecologico:"Cérvix eritematoso con flujo mucopurulento. Chandelier positivo. Útero levemente doloroso. Sin masas.",
      palpacion_abdomen:"Leve dolor en hipogastrio. Sin defensa."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Secreción uretral, eritema, edema",
        pertinence:"necessary",
        points:8,
        requires_data:"secrecion_caracteristicas",
        requires_data_label:"Preguntá sobre la secreción antes",
        image_url:"images/examen_fisico/its_gonorrea_secrecion.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Secreción gonorreica",
      },
      {
        id:"palpacion_ganglios_inguinales",
        label:"Palpación ganglios inguinales",
        description:"Adenopatías regionales",
        pertinence:"necessary",
        points:4,
        requires_data:"secrecion_caracteristicas",
        requires_data_label:"Explorá el motivo de consulta primero",
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en gonorrea no complicada",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal completa",
        description:"Solo indicada si hay sospecha de EPI",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"naat_gonorrea_clamidia", label:"NAAT para Neisseria gonorrhoeae y Chlamydia (hisopado cervical)", result:"Positivo para Neisseria gonorrhoeae. Negativo Chlamydia (tratar ambas igual).", pertinence:"critical" },
      { id:"vih_2", label:"Test de VIH", result:"No reactivo", pertinence:"important" },
      { id:"vdrl_2", label:"VDRL", result:"No reactivo", pertinence:"important" },
    ], omitted_critical:["naat_gonorrea_clamidia","vih_2"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["flujo_caracteristicas","pareja_nueva_2","examen_gineco"],
    important_data_ids:["dolor_pelvis","dispareunia","its_previa_2"],
    secondary_data_ids:[],
    common_errors:["No explorar antecedentes sexuales","No realizar especuloscopía","No solicitar NAAT","No tratar ambas (gonorrea Y clamidia)","No solicitar VIH"]
  },
  patient_persona_prompt:`Sos una mujer de 22 años. Tenés flujo amarillo-verdoso y dolor en la panza baja. Reservada pero cooperativa, bajás la voz para cosas íntimas.
INFORMACIÓN: Flujo amarillo-verdoso con mal olor hace 7 días. Dolor en la panza baja leve. Sin fiebre. Duele cuando tenés relaciones. Pareja nueva hace 3 semanas, sin preservativo. Tuviste gonorrea hace 2 años.
REGLAS: Vida sexual solo si preguntan con respeto. Máximo 3 oraciones. Español rioplatense.`
};

const ITS_004 = {
  id:"its-004", topic_id:"its", topic_label:"ITS", parcial:2, difficulty:"normal",
  diagnosis_real:"herpes_genital_primario", diagnosis_label:"Herpes genital primario (VHS-2)",
  differentials:["Sífilis primaria","Chancro blando","Foliculitis genital"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Tengo unas ampollas en la zona genital que duelen muchísimo", context:"Centro de salud" },
  personality:{ trust_base:55, type:"adolescente_asustado" },
  hidden_state:{
    opening_scene_variants:[
      "Un chico joven entra al consultorio. Cierra la puerta y se queda parado un momento. Le cuesta arrancar.",
      "Entra un adolescente muy incómodo. Se sienta en el borde de la silla. Habla bajito.",
    ],
    clinical_data:[
      { id:"vesiculas_dolor", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Vesículas dolorosas en el pene, múltiples, agrupadas, desde hace 4 días. Dolor 8/10.", reveal_threshold_trust:0, exam_required:false, keywords:["ampollas","vesículas","duele","pene","lesiones","cuándo empezó"] },
      { id:"sintomas_sistemicos", category:"Síntomas asociados", importance:"important", revealed:false, value:"Fiebre 38°C los primeros 2 días. Ganglios en la ingle dolorosos. Ardor al orinar.", reveal_threshold_trust:0, exam_required:false, keywords:["fiebre","ganglios","ingle","orina","ardor","síntomas generales"] },
      { id:"primera_vez", category:"Enfermedad actual", importance:"important", revealed:false, value:"Primera vez que le pasa. Nunca tuvo algo así.", reveal_threshold_trust:0, exam_required:false, keywords:["primera vez","antes","nunca","otras veces"] },
      { id:"relacion_reciente", category:"Antecedentes sexuales", importance:"critical", revealed:false, value:"Relación sexual sin preservativo hace 10 días con alguien que conoció en una fiesta.", reveal_threshold_trust:45, exam_required:false, keywords:["relaciones","pareja","preservativo","cuándo","sexual"] },
      { id:"examen_herpes", category:"Examen físico", importance:"critical", revealed:false, value:"Vesículas múltiples agrupadas sobre base eritematosa en glande y prepucio. Algunas ulceradas. Adenopatías inguinales dolorosas.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_genital","palpacion_ganglios_inguinales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Buen estado general. Afebril.",
      signos_vitales:"T° 36.8°C · FC 88",
      inspeccion_genital:"Vesículas múltiples agrupadas sobre base eritematosa en glande y prepucio. Algunas ulceradas. Muy dolorosas.",
      palpacion_ganglios_inguinales:"Adenopatías inguinales bilaterales dolorosas, blandas, móviles. Mayor ~2 cm."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Vesículas, úlceras, eritema",
        pertinence:"necessary",
        points:8,
        requires_data:"lesion_herpes",
        requires_data_label:"Preguntá sobre las lesiones primero",
        image_url:"images/examen_fisico/its_herpes_vesiculas.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Vesículas herpéticas",
      },
      {
        id:"palpacion_ganglios_inguinales",
        label:"Palpación ganglios inguinales",
        description:"Adenopatías dolorosas en herpes",
        pertinence:"necessary",
        points:4,
        requires_data:"lesion_herpes",
        requires_data_label:"Explorá las lesiones primero",
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Solo si hay parestesias o retención urinaria",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal completa",
        description:"Sin indicación en herpes genital no complicado",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"pcr_vhs", label:"PCR para VHS en lesión", result:"VHS-2 positivo. Confirma herpes genital primario.", pertinence:"critical" },
      { id:"vdrl_3", label:"VDRL", result:"No reactivo", pertinence:"important" },
      { id:"vih_3", label:"Test de VIH", result:"No reactivo", pertinence:"important" },
    ], omitted_critical:["pcr_vhs","vih_3"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["vesiculas_dolor","relacion_reciente","examen_herpes"],
    important_data_ids:["sintomas_sistemicos","primera_vez"],
    secondary_data_ids:[],
    common_errors:["No diferenciar vesículas (herpes) de úlcera indurada (sífilis)","No solicitar PCR de lesión","No informar sobre cronicidad del herpes","No solicitar VIH"]
  },
  patient_persona_prompt:`Sos un chico de 19 años. Tenés ampollas muy dolorosas en la zona genital. Estás asustado y avergonzado.
INFORMACIÓN: Ampollas dolorosas en el pene hace 4 días. Dolor 8/10. Primeros 2 días fiebre y ganglios en la ingle dolorosos. Duele mucho al orinar. Primera vez que te pasa. Hace 10 días relaciones sin preservativo con alguien de una fiesta.
REGLAS: Hablás bajito, te avergonzás. Vida sexual solo si el médico es respetuoso. Máximo 3 oraciones. Español rioplatense.`
};

const ALC_001 = {
  id:"alc-001", topic_id:"alcoholismo", topic_label:"Hepatopatía alcohólica", parcial:2, difficulty:"normal",
  diagnosis_real:"hepatopatia_alcoholica", diagnosis_label:"Hepatopatía alcohólica (esteatosis / hepatitis alcohólica leve)",
  differentials:["Hepatitis viral crónica B o C","HGNA","Hepatopatía por fármacos"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Me dijeron que los análisis del hígado están mal", context:"Consultorio de medicina general" },
  personality:{ trust_base:45, type:"minimizador_defensivo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 48 años entra. Se sienta cruzando los brazos. Tiene cara de no querer estar ahí.",
      "Entra un hombre adulto, algo a la defensiva. Entrega los análisis sin decir mucho.",
    ],
    clinical_data:[
      { id:"motivo_analisis", category:"Enfermedad actual", importance:"important", revealed:false, value:"Análisis de rutina hace 2 semanas. Transaminasas elevadas.", reveal_threshold_trust:0, exam_required:false, keywords:["análisis","hígado","laboratorio","transaminasas","por qué vino"] },
      { id:"consumo_alcohol", category:"Antecedentes", importance:"critical", revealed:false, value:"Toma 5-6 cervezas por día, todos los días. Los fines de semana más. Dice que 'toma como cualquiera'.", reveal_threshold_trust:35, exam_required:false, keywords:["alcohol","toma","bebe","cerveza","vino","bebida","cuánto"] },
      { id:"sintomas_higado", category:"Síntomas asociados", importance:"important", revealed:false, value:"Cansancio desde hace meses. Molestia leve en hipocondrio derecho. Sin ictericia.", reveal_threshold_trust:0, exam_required:false, keywords:["cansancio","panza","hígado","costado","ictericia","síntomas"] },
      { id:"medicacion_hepatotoxica", category:"Antecedentes", importance:"important", revealed:false, value:"Ibuprofeno frecuente para dolores de cabeza.", reveal_threshold_trust:0, exam_required:false, keywords:["medicación","pastillas","ibuprofeno","paracetamol"] },
      { id:"examen_higado", category:"Examen físico", importance:"important", revealed:false, value:"Hepatomegalia leve 2 cm, consistencia blanda. Sin ictericia. Sin arañas vasculares. Sin ascitis.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre en buen estado. Sin ictericia. Sin arañas vasculares. IMC 28.",
      palpacion_abdomen:"Hepatomegalia 2 cm, consistencia blanda. Sin esplenomegalia. Sin ascitis.",
      signos_vitales:"TA 138/88 · FC 84 · T° 36.7°C · IMC 28"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatomegalia, esplenomegalia, dolor en HD",
        pertinence:"necessary",
        points:7,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/alc_ascitis.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Hepatopatía alcohólica",
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Ictericia, arañas vasculares, eritema palmar",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/alc_ictericia_adulto.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ictericia",
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Solo si hay signos de encefalopatía hepática",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"hepatograma_completo", label:"Hepatograma completo (TGO, TGP, FA, GGT, Bilirrubina)", result:"TGO 95 · TGP 48 UI/L (TGO/TGP >2  -  patrón alcohólico) · GGT 245 UI/L muy elevada · FA y Bili normales.", pertinence:"critical" },
      { id:"hepatitis_viral", label:"Serología hepatitis B y C", result:"HBsAg neg · Anti-HBc neg · Anti-HCV neg.", pertinence:"critical" },
      { id:"ecografia_higado", label:"Ecografía abdominal", result:"Hígado aumentado, hiperecogénico difuso  -  compatible con esteatosis.", pertinence:"important" },
      { id:"audit_score", label:"Test AUDIT", result:"Score 22/40  -  consumo perjudicial/dependencia probable.", pertinence:"critical" },
    ], omitted_critical:["hepatograma_completo","audit_score"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:20, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["consumo_alcohol"],
    important_data_ids:["motivo_analisis","sintomas_higado","medicacion_hepatotoxica","examen_higado"],
    secondary_data_ids:[],
    common_errors:["No explorar consumo de alcohol directamente","Aceptar la minimización sin repregunta","No calcular AUDIT","No solicitar serologías hepatitis","No reconocer patrón TGO/TGP >2"]
  },
  patient_persona_prompt:`Sos un hombre de 48 años. Viniste porque los análisis del hígado están mal. Tomás cerveza todos los días pero lo minimizás.
INFORMACIÓN: Transaminasas elevadas en análisis de rutina. Tomás 5-6 cervezas por día. Como cualquiera. No es un problema. Cansancio desde hace meses, molestia en el costado derecho. Ibuprofeno frecuente.
REGLAS: Si preguntan por alcohol, minimizás al principio. Sin juicio, reconocés 'quizás un poco más de lo normal'. Máximo 3 oraciones. Español rioplatense.`
};

const DM_001 = {
  id:"dm-001", topic_id:"diabetes", topic_label:"Diabetes", parcial:2, difficulty:"facil",
  diagnosis_real:"prediabetes", diagnosis_label:"Prediabetes (glucemia en ayunas 118 mg/dL)",
  differentials:["Diabetes mellitus tipo 2","Glucemia elevada por stress","Error de laboratorio"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Me salió un análisis alterado en el control anual  -  el azúcar", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulto_cooperativo_preocupado" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 52 años entra con los análisis en la mano.",
      "Entra un hombre adulto que parece preocupado. Saca los papeles de la cartera antes de sentarse.",
    ],
    clinical_data:[
      { id:"glucemia_resultado", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Glucemia en ayunas 118 mg/dL (repetida dos veces). Primera vez que sale así.", reveal_threshold_trust:0, exam_required:false, keywords:["azúcar","glucemia","resultado","análisis","número","cuánto"] },
      { id:"sintomas_dm", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Sin poliuria, sin polidipsia, sin polifagia, sin pérdida de peso. Asintomático.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","pis","toma agua","hambre","cansancio","peso"] },
      { id:"factores_riesgo", category:"Antecedentes", importance:"critical", revealed:false, value:"IMC 29, sedentario, dieta con muchas harinas y bebidas azucaradas.", reveal_threshold_trust:0, exam_required:false, keywords:["actividad","ejercicio","dieta","come","peso","sedentario"] },
      { id:"antecedentes_familiares_dm", category:"Antecedentes", importance:"important", revealed:false, value:"Padre con diabetes tipo 2 a los 55 años.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","madre","diabetes","antecedentes familiares"] },
      { id:"examen_dm", category:"Examen físico", importance:"important", revealed:false, value:"TA 138/86 mmHg. IMC 29. Perímetro abdominal 102 cm. Sin acantosis nigricans.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 138/86 · FC 80 · Peso 88 kg · IMC 29 · P.abd 102 cm",
      inspeccion_general:"Hombre adulto con sobrepeso. Sin acantosis nigricans."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Examen de pies",
        description:"Sensibilidad al monofilamento, pulsos, heridas",
        pertinence:"necessary",
        points:7,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/dm_pie_diabetico.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Pie diabético",
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado nutricional, deshidratación",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"Evaluación cardiovascular en prediabetes",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico extenso",
        description:"Solo monofilamento en pies  -  no examen completo",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación en este caso",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"glucemia_repetida", label:"Glucemia en ayunas (confirmación)", result:"118 mg/dL  -  glucemia en ayunas alterada (100-125 mg/dL = prediabetes).", pertinence:"critical" },
      { id:"hba1c", label:"HbA1c", result:"5.9% (prediabetes 5.7-6.4%)  -  confirma prediabetes.", pertinence:"critical" },
      { id:"lipidos", label:"Perfil lipídico", result:"LDL 148 · HDL 38 · TG 190  -  dislipemia mixta.", pertinence:"important" },
    ], omitted_critical:["glucemia_repetida","hba1c"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["glucemia_resultado","sintomas_dm","factores_riesgo"],
    important_data_ids:["antecedentes_familiares_dm","examen_dm"],
    secondary_data_ids:[],
    common_errors:["Diagnosticar diabetes con una sola glucemia","No confirmar con segunda glucemia o HbA1c","No evaluar factores de riesgo","No solicitar perfil lipídico"]
  },
  patient_persona_prompt:`Sos un hombre de 52 años. Te salió el azúcar un poco alta en el control anual. Preocupado pero sin síntomas.
INFORMACIÓN: Glucemia 118 mg/dL, dos veces. Sin síntomas. Sobrepeso, sedentario, comés muchas harinas y Coca-Cola. Tu papá tiene diabetes desde los 55.
REGLAS: Hacés preguntas como ¿tengo diabetes? ¿es grave? Máximo 3-4 oraciones. Español rioplatense.`
};

const DM_002 = {
  id:"dm-002", topic_id:"diabetes", topic_label:"Diabetes", parcial:2, difficulty:"normal",
  diagnosis_real:"diabetes_tipo_2", diagnosis_label:"Diabetes mellitus tipo 2 (glucemia 210 mg/dL con síntomas clásicos)",
  differentials:["LADA","Diabetes secundaria","Hiperglucemia por stress"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Tengo mucha sed y voy mucho al baño hace un mes", context:"Consultorio de medicina general" },
  personality:{ trust_base:65, type:"adulta_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 45 años entra al consultorio. Se sienta y empieza a contar directamente.",
      "Entra una paciente adulta. Parece que viene preparada para contar.",
    ],
    clinical_data:[
      { id:"polidipsia_poliuria", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Mucha sed, toma más de 3 litros de agua por día. Al baño 8-10 veces, de noche también. Hace un mes.", reveal_threshold_trust:0, exam_required:false, keywords:["sed","agua","toma","baño","orina","pis","cuánto","noche"] },
      { id:"perdida_peso", category:"Síntomas asociados", importance:"important", revealed:false, value:"Perdió 4 kg en el último mes sin hacer dieta.", reveal_threshold_trust:0, exam_required:false, keywords:["peso","bajó","adelgazó","kilos","sin querer"] },
      { id:"cansancio_dm", category:"Síntomas asociados", importance:"important", revealed:false, value:"Cansancio importante. Le cuesta concentrarse.", reveal_threshold_trust:0, exam_required:false, keywords:["cansancio","cansada","concentración","energía"] },
      { id:"factores_riesgo_dm", category:"Antecedentes", importance:"important", revealed:false, value:"Sobrepeso (IMC 32), sedentaria, dieta desordenada, madre con diabetes tipo 2.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","madre","diabetes","peso","actividad","dieta"] },
      { id:"glucemia_previa", category:"Antecedentes", importance:"critical", revealed:false, value:"Glucemia en ayunas 210 mg/dL ayer (derivada por médico de cabecera).", reveal_threshold_trust:0, exam_required:false, keywords:["análisis","azúcar","glucemia","resultado"] },
      { id:"examen_dm2", category:"Examen físico", importance:"important", revealed:false, value:"IMC 32. TA 142/90. Acantosis nigricans en cuello y axilas.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 142/90 · FC 86 · Peso 82 kg · IMC 32",
      inspeccion_general:"Mujer con sobrepeso. Acantosis nigricans en cuello y axilas."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Examen de pies  -  neuropatía",
        description:"Monofilamento, reflejos aquileos, heridas",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/dm_pie_diabetico.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Pie diabético",
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Hidratación, signos de hiperglucemia",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Fondo de ojo",
        description:"Retinopatía diabética",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/dm_retinopatia.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Retinopatía diabética",
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación directa",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"glucemia_dx", label:"Glucemia en ayunas (confirmación)", result:"214 mg/dL  -  criterio diagnóstico DM2 cumplido.", pertinence:"critical" },
      { id:"hba1c_dx", label:"HbA1c", result:"8.2%  -  DM2 con mal control. Meta <7%.", pertinence:"critical" },
      { id:"microalbuminuria", label:"Creatinina y microalbuminuria", result:"Microalbuminuria 45 mg/g (VN <30)  -  incipiente.", pertinence:"important" },
    ], omitted_critical:["glucemia_dx","hba1c_dx"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:20, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["polidipsia_poliuria","glucemia_previa"],
    important_data_ids:["perdida_peso","cansancio_dm","factores_riesgo_dm","examen_dm2"],
    secondary_data_ids:[],
    common_errors:["No reconocer la tríada clásica de DM","No confirmar con segunda glucemia","No buscar daño de órgano blanco"]
  },
  patient_persona_prompt:`Sos una mujer de 45 años. Mucha sed, muchas ganas de orinar y cansancio desde hace un mes. El azúcar salió alta ayer. Cooperativa.
INFORMACIÓN: Sed intensa, más de 3 litros de agua por día. Al baño 8-10 veces, también de noche. Perdiste 4 kg sin dieta. Muy cansada. Sobrepeso (IMC 32). Tu mamá tiene diabetes. Glucemia 210 mg/dL ayer.
REGLAS: Respondés todo. Máximo 3-4 oraciones. Español rioplatense.`
};

const HTA_001 = {
  id:"hta-001", topic_id:"hta", topic_label:"HTA", parcial:2, difficulty:"normal",
  diagnosis_real:"hta_esencial_estadio1", diagnosis_label:"Hipertensión arterial esencial estadio 1",
  differentials:["HTA secundaria","HTA de guardapolvo blanco","Medición técnicamente incorrecta"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Me midieron la presión en la farmacia y la tenía alta", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulto_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 50 años entra tranquilo. 'Me medí en la farmacia y salió 160 y algo', dice.",
      "Entra un hombre adulto. Se sienta sin apuro.",
    ],
    clinical_data:[
      { id:"medicion_previa", category:"Enfermedad actual", importance:"critical", revealed:false, value:"TA en farmacia: 162/98 mmHg hace 3 días. Dos mediciones.", reveal_threshold_trust:0, exam_required:false, keywords:["presión","farmacia","cuánto","número","midió","resultado"] },
      { id:"sintomas_hta", category:"Síntomas asociados", importance:"important", revealed:false, value:"Cefalea occipital leve algunas mañanas. Sin epistaxis, sin visión borrosa.", reveal_threshold_trust:0, exam_required:false, keywords:["dolor de cabeza","cefalea","síntomas","sangra","visión","mareo"] },
      { id:"factores_riesgo_hta", category:"Antecedentes", importance:"critical", revealed:false, value:"Fumador 1 paquete/día hace 20 años. Sobrepeso (IMC 28). Sedentario. Alta ingesta de sodio.", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","cigarrillo","tabaco","peso","actividad","sal","dieta"] },
      { id:"antecedentes_familiares_hta", category:"Antecedentes", importance:"important", revealed:false, value:"Padre con HTA e infarto a los 58 años.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","madre","presión","corazón","infarto","antecedentes"] },
      { id:"examen_hta", category:"Examen físico", importance:"critical", revealed:false, value:"TA 156/96 mmHg (brazo derecho, 2 mediciones). TA izquierdo 154/94. FC 80 lpm.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA der: 156/96 (2 mediciones) · TA izq: 154/94 · FC 80 · IMC 28",
      inspeccion_general:"Hombre adulto con sobrepeso leve. Sin signos de HTA severa.",
      palpacion_abdomen:"Sin masas ni soplos."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales  -  TA ambos brazos",
        description:"TA correcta (3 mediciones), FC, IMC",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Fondo de ojo",
        description:"Daño de órgano blanco  -  retinopatía hipertensiva",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/hta_fondo_ojo.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Fondo de ojo hipertensivo",
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"HVI  -  galope S4, soplos",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Pulsos y edemas",
        description:"Enfermedad vascular periférica, edema",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"segunda_medicion", label:"Segunda medición de TA (confirmación diagnóstica)", result:"TA 152/92 en segunda consulta  -  HTA estadio 1 confirmada.", pertinence:"critical" },
      { id:"ecg_hta", label:"ECG de 12 derivaciones", result:"Ritmo sinusal. Sin hipertrofia ventricular ni isquemia.", pertinence:"important" },
      { id:"laboratorio_hta", label:"Laboratorio: glucemia, creatinina, ionograma, colesterol, microalbuminuria", result:"Glucemia 102 · Creatinina 0.9 · Col 210 · LDL 138 · Microalbuminuria negativa.", pertinence:"important" },
    ], omitted_critical:["segunda_medicion"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:20, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["medicion_previa","factores_riesgo_hta","examen_hta"],
    important_data_ids:["sintomas_hta","antecedentes_familiares_hta"],
    secondary_data_ids:[],
    common_errors:["Diagnosticar HTA con una sola medición","No explorar factores de riesgo","No buscar daño de órgano blanco","No preguntar por tabaquismo"]
  },
  patient_persona_prompt:`Sos un hombre de 50 años. Te midieron la presión en la farmacia y salió alta. Cooperativo y tranquilo.
INFORMACIÓN: En la farmacia 162/98, dos veces, hace 3 días. Cefalea occipital algunas mañanas. Sin otros síntomas. Fumás 1 paquete por día hace 20 años. Sobrepeso. Sedentario. Mucho sodio. Papá tuvo HTA e infarto a los 58.
REGLAS: Respondés todo. Máximo 3 oraciones. Español rioplatense.`
};

const DT_001 = {
  id:"dt-001", topic_id:"dolor_toracico", topic_label:"Dolor torácico", parcial:2, difficulty:"dificil",
  diagnosis_real:"sca_iamsest", diagnosis_label:"Síndrome coronario agudo  -  IAMSEST",
  differentials:["Angina inestable","TEP","Pericarditis aguda","Disección aórtica","Costocondritis"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Dolor en el pecho desde hace 2 horas, me irradia al brazo", context:"Guardia de hospital" },
  personality:{ trust_base:65, type:"adulto_asustado_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 58 años entra con cara de dolor. Tiene una mano en el pecho. Se sienta despacio.",
      "Entra un hombre adulto. Se mueve con cuidado. Cara de malestar intenso.",
    ],
    clinical_data:[
      { id:"dolor_caracteristicas", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Dolor opresivo en el centro del pecho, 8/10, que irradia al brazo izquierdo y al cuello. 2 horas, en reposo.", reveal_threshold_trust:0, exam_required:false, keywords:["dolor","cómo es","tipo","opresivo","irradia","brazo","cuello","cuándo empezó"] },
      { id:"cortejo_vegetativo", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sudoración intensa, náuseas, sensación de muerte inminente.", reveal_threshold_trust:0, exam_required:false, keywords:["suda","náuseas","vómitos","sensación","malestar","acompaña"] },
      { id:"factores_riesgo_cv", category:"Antecedentes", importance:"critical", revealed:false, value:"HTA (enalapril), dislipemia (atorvastatina), exfumador 2 años, DM tipo 2.", reveal_threshold_trust:0, exam_required:false, keywords:["antecedentes","presión","colesterol","diabetes","fuma","corazón"] },
      { id:"angina_previa", category:"Antecedentes", importance:"important", revealed:false, value:"Últimas semanas: 2 episodios similares pero más cortos al caminar. No consultó.", reveal_threshold_trust:0, exam_required:false, keywords:["antes","otros episodios","parecido","caminando","esfuerzo"] },
      { id:"examen_cv", category:"Examen físico", importance:"important", revealed:false, value:"TA 148/90. FC 96. Sin soplos. Sin signos de insuficiencia cardíaca. Sin dolor palpatorio torácico.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general","auscultacion_cardiaca"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 148/90 · FC 96 · FR 20 · T° 36.8°C · SatO₂ 96%",
      inspeccion_general:"Hombre adulto sudoroso, con facies de dolor. Sin signos de insuficiencia cardíaca.",
      auscultacion_cardiaca:"Ruidos cardíacos rítmicos. Sin soplos. Sin tercer ruido.",
      inspeccion_general_toracica:"Sin dolor palpatorio. Sin rozamiento."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales + saturación",
        description:"TA, FC, T°, FR, SatO₂  -  urgencia cardiovascular",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"Galope, soplos, roce pericárdico",
        pertinence:"necessary",
        points:7,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Diaforesis, palidez, cianosis",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Pulsos y edemas",
        description:"Signos de bajo gasto, ingurgitación yugular",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con dolor torácico",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecg", label:"ECG de 12 derivaciones (urgente)", result:"Depresión ST 2 mm en V4-V6. Sin elevación. Compatible con isquemia subendocárdica.", pertinence:"critical" },
      { id:"troponina", label:"Troponina I alta sensibilidad (urgente)", result:"Troponina I 0.38 ng/mL (VN <0.04)  -  elevada. Confirma necrosis miocárdica.", pertinence:"critical" },
      { id:"rx_torax", label:"Radiografía de tórax", result:"Sin cardiomegalia. Sin edema pulmonar.", pertinence:"important" },
    ], omitted_critical:["ecg","troponina"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:10, examen_fisico:20, razonamiento:20, diagnostico:15, estudios:10 },
    critical_data_ids:["dolor_caracteristicas","factores_riesgo_cv"],
    important_data_ids:["cortejo_vegetativo","angina_previa","examen_cv"],
    secondary_data_ids:[],
    common_errors:["Demorar el ECG en dolor torácico opresivo","No preguntar por episodios previos","No solicitar troponina","Confundir con costocondritis sin explorar factores de riesgo CV"]
  },
  patient_persona_prompt:`Sos un hombre de 58 años. Tenés un dolor opresivo en el pecho desde hace 2 horas que te irradia al brazo izquierdo. Estás muy asustado.
INFORMACIÓN: Dolor opresivo en el pecho 8/10, irradia al brazo izquierdo y cuello. 2 horas, en reposo. Sudás mucho, náuseas, sensación de que algo muy malo pasa. HTA y colesterol con pastillas. Exfumador hace 2 años. Diabético. Las últimas semanas: 2 episodios parecidos pero cortos caminando.
REGLAS: Estás con dolor real. Respondés todo. Máximo 3 oraciones. Español rioplatense.`
};

const DT_002 = {
  id:"dt-002", topic_id:"dolor_toracico", topic_label:"Dolor torácico", parcial:2, difficulty:"dificil",
  diagnosis_real:"tep", diagnosis_label:"Tromboembolismo pulmonar (TEP)  -  probabilidad alta por Wells",
  differentials:["SCA","Pericarditis aguda","Neumotórax espontáneo","Neumonía"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Dolor en el pecho al respirar y me falta el aire desde esta mañana", context:"Guardia de hospital" },
  personality:{ trust_base:65, type:"adulta_asustada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 32 años entra rápido a la guardia. Respira con esfuerzo. Pone una mano en el pecho.",
      "Entra una paciente joven que parece ansiosa. 'Me falta el aire' dice antes de sentarse.",
    ],
    clinical_data:[
      { id:"dolor_pleuritico", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Dolor en hemitórax derecho, punzante, que aumenta con la respiración profunda y la tos. Desde esta mañana.", reveal_threshold_trust:0, exam_required:false, keywords:["dolor","cómo es","tipo","respira","punzante","cuándo","tos","fondo"] },
      { id:"disnea", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Disnea de inicio brusco esta mañana, en reposo. Taquicardia. Sin fiebre.", reveal_threshold_trust:0, exam_required:false, keywords:["falta aire","disnea","respirar","fiebre"] },
      { id:"factor_riesgo_tep", category:"Antecedentes", importance:"critical", revealed:false, value:"Vuelo de 14 horas desde Europa hace 3 días. Anticonceptivos orales combinados hace 2 años.", reveal_threshold_trust:0, exam_required:false, keywords:["viaje","vuelo","avión","anticonceptivos","pastillas","inmovilización"] },
      { id:"taquicardia_examen", category:"Examen físico", importance:"important", revealed:false, value:"FC 118 lpm. FR 24 rpm. SatO2 91% al aire ambiente. Sin TVP clínica.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 108/70 · FC 118 · FR 24 · T° 37.1°C · SatO₂ 91% (AA)",
      inspeccion_general:"Paciente ansiosa, taquipneica. Sin cianosis. Sin ingurgitación yugular.",
      auscultacion_pulmonar:"Murmullo vesicular conservado. Sin crepitantes. Sin roce.",
      miembros_inferiores:"Sin edema. Sin dolor ni eritema en pantorrillas."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales + saturación",
        description:"TA, FC, T°, FR, SatO₂  -  sospecha TEP",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca y pulmonar",
        description:"Frote pleural, taquicardia, crepitantes",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Examen de miembros inferiores",
        description:"TVP  -  edema, calor, Homan  -  fuente del TEP",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Cianosis, diaforesis, signos de fallo derecho",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con TEP",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ddimero", label:"Dímero D", result:"4.200 ng/mL (VN <500)  -  muy elevado.", pertinence:"critical" },
      { id:"angiotc", label:"Angio-TC de tórax (Gold standard)", result:"Defectos de relleno en ramas de arteria pulmonar derecha. Confirma TEP.", pertinence:"critical" },
      { id:"ecg_tep", label:"ECG", result:"Taquicardia sinusal. Patrón S1Q3T3. Sin cambios isquémicos.", pertinence:"important" },
      { id:"gasometria", label:"Gases en sangre arterial", result:"pH 7.46 · PO2 65 mmHg · PCO2 32  -  hipoxemia + hipocapnia.", pertinence:"important" },
    ], omitted_critical:["ddimero","angiotc"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:10, examen_fisico:20, razonamiento:20, diagnostico:15, estudios:10 },
    critical_data_ids:["dolor_pleuritico","disnea","factor_riesgo_tep"],
    important_data_ids:["taquicardia_examen"],
    secondary_data_ids:[],
    common_errors:["No preguntar por viaje reciente","No preguntar por anticonceptivos orales","No medir SatO2","No calcular Wells","Solo pedir ECG"]
  },
  patient_persona_prompt:`Sos una mujer de 32 años. Tenés dolor en el pecho que empeora al respirar y te falta el aire desde esta mañana. Estás asustada.
INFORMACIÓN: Dolor punzante en pecho derecho que empeora al respirar fondo o toser. De golpe esta mañana. Llegaste en avión de Europa hace 3 días  -  14 horas. Tomás anticonceptivos orales hace 2 años. Sin fiebre.
REGLAS: Si no preguntan por el viaje o los anticonceptivos, no los mencionás de entrada. Máximo 3 oraciones. Español rioplatense.`
};

const CCU_001 = {
  id:"ccu-001", topic_id:"cancer_cervicouterino", topic_label:"Cáncer cervicouterino", parcial:2, difficulty:"normal",
  diagnosis_real:"ascus_manejo", diagnosis_label:"ASCUS en PAP  -  manejo con test de VPH de reflejo",
  differentials:["LSIL","HSIL","Cambios inflamatorios reactivos"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"El resultado del PAP me salió alterado y no entiendo qué significa", context:"Consultorio ginecológico" },
  personality:{ trust_base:65, type:"preocupada_quiere_entender" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 35 años entra con el resultado del PAP. '¿ASCUS es cáncer?', pregunta antes de sentarse.",
      "Entra una paciente adulta. Trae el papel del PAP. Parece ansiosa.",
    ],
    clinical_data:[
      { id:"resultado_pap", category:"Enfermedad actual", importance:"critical", revealed:false, value:"PAP: ASCUS. Primer PAP alterado. Los anteriores fueron normales.", reveal_threshold_trust:0, exam_required:false, keywords:["pap","resultado","ascus","qué dice","análisis","alterado"] },
      { id:"ultimo_pap", category:"Antecedentes", importance:"important", revealed:false, value:"PAP anterior hace 2 años  -  normal. Hace 5 años  -  normal.", reveal_threshold_trust:0, exam_required:false, keywords:["último pap","antes","cuándo","previo","anteriores"] },
      { id:"sintomas_gineco", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin sangrado intermenstrual, sin dolor pélvico, sin flujo anormal.", reveal_threshold_trust:0, exam_required:false, keywords:["sangrado","flujo","dolor","síntomas","molestias"] },
      { id:"hpv_vacuna", category:"Antecedentes", importance:"secondary", revealed:false, value:"No se vacunó contra VPH.", reveal_threshold_trust:0, exam_required:false, keywords:["vacuna","HPV","VPH","vacunada"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general.",
      signos_vitales:"TA 118/72 · FC 78 · T° 36.7°C"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_ginecologico",
        label:"Examen ginecológico con especuloscopía",
        description:"Visualización del cuello uterino, toma de PAP",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ccu_colposcopia_normal.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Cuello uterino normal",
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación de ganglios inguinales",
        description:"Adenopatías en ITS asociadas",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en tamizaje cervical",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"test_vph_reflejo", label:"Test de VPH de alto riesgo (reflejo para ASCUS)", result:"VPH de alto riesgo positivo (genotipo 16)  -  indicación de colposcopía.", pertinence:"critical" },
      { id:"colposcopia", label:"Colposcopía (ante VPH AR positivo)", result:"Zona de transformación tipo 1. Lesión acetoblanca tenue. Biopsia indicada.", pertinence:"critical" },
    ], omitted_critical:["test_vph_reflejo"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:30, examen_fisico:5, razonamiento:20, diagnostico:10, estudios:10 },
    critical_data_ids:["resultado_pap"],
    important_data_ids:["ultimo_pap","sintomas_gineco"],
    secondary_data_ids:["hpv_vacuna"],
    common_errors:["Decir que ASCUS es cáncer","No explicar ASCUS de manera comprensible","No solicitar test de VPH como primer paso","Derivar a colposcopía directamente sin test de VPH"]
  },
  patient_persona_prompt:`Sos una mujer de 35 años. El PAP salió alterado  -  dice 'ASCUS'. Creés que puede ser cáncer. Preocupada, quiere entender, hacés muchas preguntas.
INFORMACIÓN: PAP dice ASCUS. No sabés qué es. Los anteriores (2 y 5 años) fueron normales. Sin sangrado, sin dolor, sin flujo. No te vacunaste contra VPH.
REGLAS: Hacés preguntas como ¿es cáncer?, ¿necesito operar?. Si el médico explica bien, te tranquilizás. Máximo 3-4 oraciones. Español rioplatense.`
};

const MAMA_001 = {
  id:"mama-001", topic_id:"cancer_mama", topic_label:"Cáncer de mama", parcial:2, difficulty:"normal",
  diagnosis_real:"nodulo_mama_estudio", diagnosis_label:"Nódulo mamario palpable  -  selección de método de imagen",
  differentials:["Fibroadenoma","Quiste simple","Carcinoma mamario"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Me encontré un bultito en la mama izquierda hace un mes", context:"Consultorio de medicina general" },
  personality:{ trust_base:65, type:"preocupada_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 42 años entra seria. Se sienta y dice 'Me encontré algo en la mama'.",
      "Entra una paciente adulta. Está controlada pero se nota la preocupación.",
    ],
    clinical_data:[
      { id:"nodulo_caracteristicas", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Nódulo en cuadrante superoexterno de mama izquierda. Descubierto hace 1 mes, parece crecer. No duele.", reveal_threshold_trust:0, exam_required:false, keywords:["bultito","nódulo","bulto","dónde","cuándo","duele","creció"] },
      { id:"piel_pezon", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin retracción del pezón, sin descarga, sin cambios en la piel.", reveal_threshold_trust:0, exam_required:false, keywords:["pezón","secreción","piel","hoyuelo","cambios","descarga"] },
      { id:"antecedentes_mama", category:"Antecedentes", importance:"critical", revealed:false, value:"Sin antecedentes personales de cáncer. Madre con cáncer de mama a los 50 años.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","madre","cáncer","antecedentes","hermana","tía"] },
      { id:"examen_mama", category:"Examen físico", importance:"critical", revealed:false, value:"Nódulo 2 cm, irregular, firme, poco móvil, en CSE de mama izquierda. Sin adenopatías axilares.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_mamario","palpacion_ganglios"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general.",
      examen_mamario:"Nódulo 2 cm, límites irregulares, firme, poco móvil, en CSE mama izquierda. Sin retracción ni hoyuelo. Mama derecha sin hallazgos.",
      palpacion_ganglios:"Sin adenopatías axilares ni supraclaviculares."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario bilateral",
        description:"Palpación de nódulos, adenopatías axilares, piel",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/mama_piel_naranja.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Signos cutáneos en cáncer de mama",
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación axilar y supraclavicular",
        description:"Adenopatías regionales",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en tamizaje mamario",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecografia_mamaria", label:"Ecografía mamaria bilateral", result:"Nódulo sólido, hipoecoico, bordes espiculados, 1.8 cm. BI-RADS 4B  -  biopsia recomendada.", pertinence:"critical" },
      { id:"mamografia", label:"Mamografía bilateral (>40 años)", result:"Densidad tipo C. Opacidad bordes irregulares en CSE. Microcalcificaciones. BI-RADS 4C.", pertinence:"critical" },
      { id:"biopsia_core", label:"Biopsia core (BI-RADS 4-5)", result:"Pendiente  -  derivar a mastología.", pertinence:"critical" },
    ], omitted_critical:["ecografia_mamaria","mamografia"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:25, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["nodulo_caracteristicas","antecedentes_mama","examen_mama"],
    important_data_ids:["piel_pezon"],
    secondary_data_ids:[],
    common_errors:["No realizar examen físico mamario","No explorar antecedentes familiares","Pedir solo ecografía en >40 años (también necesita mamografía)","No derivar ante BI-RADS 4"]
  },
  patient_persona_prompt:`Sos una mujer de 42 años. Te encontraste un bultito en la mama izquierda hace un mes. Estás preocupada pero cooperativa.
INFORMACIÓN: Nódulo en la mama izquierda, arriba y afuera. Lo descubriste hace 1 mes. Parece que creció. No duele. Sin cambios en el pezón ni la piel. Tu mamá tuvo cáncer de mama a los 50. Nunca embarazada.
REGLAS: Hacés preguntas como ¿puede ser cáncer?. Máximo 3-4 oraciones. Español rioplatense.`
};

const CCR_001 = {
  id:"ccr-001", topic_id:"cancer_colorrectal", topic_label:"Cáncer colorrectal", parcial:2, difficulty:"normal",
  diagnosis_real:"sangre_oculta_positiva_seguimiento", diagnosis_label:"SOMF positivo  -  indicación de colonoscopía",
  differentials:["Pólipo adenomatoso","Cáncer colorrectal","EII","Hemorroides"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Me salió positivo el análisis de la materia fecal en el control anual", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulto_preocupado_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 52 años entra con los análisis. Los pone sobre el escritorio.",
      "Entra un hombre adulto. 'Me dijeron que tengo que venir por esto', dice señalando el resultado.",
    ],
    clinical_data:[
      { id:"resultado_somf", category:"Enfermedad actual", importance:"critical", revealed:false, value:"SOMF inmunoquímica positivo. Primera vez que se lo hace.", reveal_threshold_trust:0, exam_required:false, keywords:["resultado","materia fecal","sangre","análisis","positivo"] },
      { id:"sintomas_colon", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin síntomas: no cambió el hábito intestinal, sin sangre visible, sin dolor, sin pérdida de peso.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","cambio","materia fecal","sangre","diarrea","constipación","dolor","peso"] },
      { id:"antecedentes_ccr", category:"Antecedentes", importance:"critical", revealed:false, value:"Sin antecedentes familiares de cáncer colorrectal. Sin cáncer personal previo.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","cáncer","colon","intestino","antecedentes","polipo"] },
      { id:"hemorroides", category:"Antecedentes", importance:"secondary", revealed:false, value:"Tiene hemorroides que a veces sangran. Cree que el resultado puede ser por eso.", reveal_threshold_trust:0, exam_required:false, keywords:["hemorroides","sangra","sangre roja"] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 132/84 · FC 78 · Peso 84 kg · IMC 27",
      inspeccion_general:"Hombre en buen estado general. Sin anemia clínica.",
      palpacion_abdomen:"Blando. Sin masas.",
      tacto_rectal:"Esfínter normal. Sin masas. Hemorroides internas grado II. Sin sangre visible al guante."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Masas, hepatomegalia, dolor",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal",
        description:"Sangre al guante, masas rectales",
        pertinence:"necessary",
        points:8,
        requires_data:"somf_positivo",
        requires_data_label:"Preguntá por el resultado de la SOMF primero",
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Palidez, pérdida de peso, estado general",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en SOMF positivo sin metástasis",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"colonoscopia", label:"Colonoscopía total (ante SOMF positivo)", result:"Pólipo sésil 1.2 cm en colon sigmoide. Resecado. AP: adenoma tubular con displasia de bajo grado.", pertinence:"critical" },
      { id:"hemograma_ccr", label:"Hemograma y ferritina", result:"Hb 12.8 · VCM 78 · Ferritina 8 µg/L  -  anemia ferropénica leve.", pertinence:"important" },
    ], omitted_critical:["colonoscopia"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:15, razonamiento:15, diagnostico:10, estudios:10 },
    critical_data_ids:["resultado_somf","antecedentes_ccr"],
    important_data_ids:["sintomas_colon"],
    secondary_data_ids:["hemorroides"],
    common_errors:["Atribuir SOMF positivo a hemorroides sin indicar colonoscopía","No explorar antecedentes familiares de CCR","No solicitar colonoscopía total"]
  },
  patient_persona_prompt:`Sos un hombre de 52 años. El SOMF del control anual salió positivo. Tenés hemorroides y creés que es por eso.
INFORMACIÓN: SOMF positivo, primera vez. Sin síntomas: sin cambios en la caca, sin sangre visible, sin dolor, sin pérdida de peso. Sin cáncer de colon en la familia. Tenés hemorroides que a veces sangran.
REGLAS: Si no preguntan por las hemorroides, no las mencionás de entrada. Máximo 3 oraciones. Español rioplatense.`
};

const CPR_001 = {
  id:"cpr-001", topic_id:"cancer_prostata", topic_label:"Cáncer de próstata", parcial:2, difficulty:"normal",
  diagnosis_real:"psa_elevado_estudio", diagnosis_label:"PSA elevado (6.5 ng/mL)  -  toma de decisiones compartida",
  differentials:["Cáncer de próstata","Hiperplasia prostática benigna","Prostatitis"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Mi médico me mandó porque el PSA salió elevado", context:"Consultorio de medicina general" },
  personality:{ trust_base:65, type:"adulto_mayor_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 62 años entra. Trae el análisis. 'El médico me dijo que el PSA salió alto', dice tranquilo.",
      "Entra un hombre mayor. Saluda y se sienta. Trae el análisis.",
    ],
    clinical_data:[
      { id:"psa_resultado", category:"Enfermedad actual", importance:"critical", revealed:false, value:"PSA total 6.5 ng/mL (VN según edad <4.0). Sin PSA anterior para comparar.", reveal_threshold_trust:0, exam_required:false, keywords:["PSA","resultado","cuánto","análisis","número"] },
      { id:"sintomas_prostaticos", category:"Síntomas asociados", importance:"important", revealed:false, value:"Chorro fino, demora para iniciar la micción, nicturia 2-3 veces. Sin hematuria. Sin dolor. Hace 2 años.", reveal_threshold_trust:0, exam_required:false, keywords:["orina","baño","chorro","noche","demora","síntomas","sangre"] },
      { id:"antecedentes_prostata", category:"Antecedentes", importance:"important", revealed:false, value:"Sin antecedentes familiares de cáncer de próstata.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","cáncer","próstata","antecedentes"] },
      { id:"tacto_rectal", category:"Examen físico", importance:"critical", revealed:false, value:"Próstata grado II/IV, consistencia elástica homogénea. Sin nódulos. Sin asimetría. Superficie lisa.", reveal_threshold_trust:0, exam_required:true, exam_ids:["tacto_rectal"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 130/82 · FC 76 · T° 36.6°C",
      inspeccion_general:"Hombre adulto mayor en buen estado general.",
      tacto_rectal:"Próstata grado II/IV. Consistencia elástica. Sin nódulos. Sin asimetría. Compatible con HPB."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal  -  próstata",
        description:"Tamaño, consistencia, nódulos, simetría",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Globo vesical, masas",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Solo si hay síntomas neurológicos",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario",
        description:"Sin indicación en hombre sin ginecomastia",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"psa_libre", label:"Índice PSA libre/total", result:"PSA libre 0.9 ng/mL. Índice 14%  -  zona gris.", pertinence:"important" },
      { id:"derivacion_urologo", label:"RM multiparamétrica de próstata ± biopsia", result:"Indicada  -  derivar a urología.", pertinence:"critical" },
    ], omitted_critical:[] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:25, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:10 },
    critical_data_ids:["psa_resultado","tacto_rectal"],
    important_data_ids:["sintomas_prostaticos","antecedentes_prostata"],
    secondary_data_ids:[],
    common_errors:["No realizar tacto rectal","No explicar limitaciones del PSA","Indicar biopsia sin RM previa","No aplicar toma de decisiones compartida"]
  },
  patient_persona_prompt:`Sos un hombre de 62 años. Tu médico te mandó porque el PSA salió alto (6.5). Cooperativo, tranquilo. Hacés preguntas razonables.
INFORMACIÓN: PSA 6.5 ng/mL. Chorro fino, demora para iniciar, te levantás 2-3 veces de noche. Hace 2 años. Sin sangre en la orina, sin dolor. Sin cáncer de próstata en la familia.
REGLAS: Hacés preguntas sobre el significado del resultado. Máximo 3 oraciones. Español rioplatense.`
};

const CP_001 = {
  id:"cp-001", topic_id:"control_periodico", topic_label:"Control periódico", parcial:2, difficulty:"normal",
  diagnosis_real:"control_periodico_primer_control", diagnosis_label:"Control periódico  -  hombre de 45 años sin controles en 10 años",
  differentials:[],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Vine a hacerme un control, hace como 10 años que no venía al médico", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulto_sin_habito_medico" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 45 años entra incómodo, como si no estuviera acostumbrado al consultorio. 'Vine porque mi señora me mandó', dice.",
      "Entra un hombre adulto. 'No estoy enfermo, pero hace mucho que no me controlaba', dice.",
    ],
    clinical_data:[
      { id:"ultimo_control", category:"Antecedentes", importance:"critical", revealed:false, value:"Último control médico hace más de 10 años. Sin enfermedades crónicas diagnosticadas.", reveal_threshold_trust:0, exam_required:false, keywords:["último médico","cuándo fue","mucho tiempo","controles","antes"] },
      { id:"tabaquismo", category:"Antecedentes", importance:"critical", revealed:false, value:"Fumador 1 paquete diario hace 20 años. No tiene intención de dejar.", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","cigarrillo","tabaco","cuánto"] },
      { id:"alcohol_cp", category:"Antecedentes", importance:"important", revealed:false, value:"2-3 cervezas los días de semana, más los fines de semana.", reveal_threshold_trust:40, exam_required:false, keywords:["alcohol","toma","bebe","cerveza","cuánto"] },
      { id:"dieta_actividad", category:"Antecedentes", importance:"important", revealed:false, value:"Dieta poco saludable. Sedentario. Trabaja sentado. IMC 30.", reveal_threshold_trust:0, exam_required:false, keywords:["come","dieta","actividad","ejercicio","peso","sedentario"] },
      { id:"antecedentes_familiares_cp", category:"Antecedentes", importance:"critical", revealed:false, value:"Padre murió de infarto a los 58. Madre con HTA y diabetes. Hermano con colesterol alto.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","madre","hermano","infarto","diabetes","corazón","antecedentes"] },
      { id:"examen_cp", category:"Examen físico", importance:"important", revealed:false, value:"TA 145/92 mmHg. IMC 30. Perímetro abdominal 102 cm.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 145/92 · FC 82 · Peso 90 kg · IMC 30 · P.abd 102 cm",
      inspeccion_general:"Hombre adulto con obesidad leve. Sin ictericia. Sin adenopatías.",
      palpacion_abdomen:"Blando, sin hepatoesplenomegalia."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC, cintura abdominal",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, xantomas, arco corneal",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"Soplos, ritmo  -  riesgo CV",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal",
        description:"Parte del control periódico masculino >45 años",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatomegalia, masas",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin indicación en adulto sano",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital completa",
        description:"Solo tacto rectal es el examen indicado aquí",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"laboratorio_completo", label:"Laboratorio: glucemia, lípidos, creatinina, hemograma, orina", result:"Glucemia 106 · LDL 158 · HDL 36 · TG 210 · Creatinina 0.9  -  dislipemia + prediabetes.", pertinence:"critical" },
      { id:"riesgo_cv", label:"Cálculo de riesgo cardiovascular global", result:"Riesgo CV a 10 años: 22%  -  ALTO (HTA + dislipemia + tabaquismo + AF).", pertinence:"critical" },
      { id:"ecg_cp", label:"ECG", result:"Ritmo sinusal. Sin alteraciones isquémicas.", pertinence:"important" },
    ], omitted_critical:["laboratorio_completo","riesgo_cv"] },
    rubric_weights:{ apertura:5, anamnesis:35, comunicacion:15, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:10 },
    critical_data_ids:["tabaquismo","antecedentes_familiares_cp","examen_cp"],
    important_data_ids:["ultimo_control","alcohol_cp","dieta_actividad"],
    secondary_data_ids:[],
    common_errors:["No preguntar por tabaquismo","No calcular riesgo cardiovascular global","No explorar antecedentes familiares cardiovasculares","No solicitar perfil lipídico ni glucemia"]
  },
  patient_persona_prompt:`Sos un hombre de 45 años. Viniste porque tu señora te mandó. Hace 10 años que no ibas al médico. No estás enfermo.
INFORMACIÓN: Último médico hace más de 10 años. Fumás 1 paquete por día hace 20 años. No pensás dejar. 2-3 cervezas los días de semana, más el fin de semana. Comés mal, sos sedentario. Papá murió de infarto a los 58. Mamá tiene presión y diabetes. Hermano con colesterol alto.
REGLAS: Alcohol: no lo mencionás espontáneamente. Cigarrillo: sos defensivo ('todos fuman'). Máximo 3-4 oraciones. Español rioplatense.`
};


// ═══════════════════════════════════════════════════════════════════════════════
// CASOS NUEVOS  -  PRIMER PARCIAL
// ═══════════════════════════════════════════════════════════════════════════════

// ── GENERALIDADES DE TAMIZAJE ─────────────────────────────────────────────────

const TAM_001 = {
  id:"tam-001", topic_id:"generalidades", topic_label:"Generalidades de tamizaje",
  parcial:1, difficulty:"normal",
  diagnosis_real:"resultado_falso_positivo_tamizaje",
  diagnosis_label:"Resultado falso positivo en tamizaje  -  consejería y manejo",
  differentials:["Verdadero positivo","Error de laboratorio","Sobrediagnóstico"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Me salió positivo el tamizaje de cáncer de colon y estoy muy asustada", context:"Consultorio de medicina general" },
  personality:{ trust_base:60, type:"asustada_informatizada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 48 años entra al consultorio con papeles en la mano. Tiene cara de angustia.",
      "Entra una paciente adulta. Se sienta y antes de que el médico diga algo, pone los análisis sobre el escritorio.",
    ],
    clinical_data:[
      { id:"contexto_tamizaje", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Se hizo sangre oculta en materia fecal como parte del programa de tamizaje municipal  -  nunca tuvo síntomas.", reveal_threshold_trust:0, exam_required:false, keywords:["cómo","cuándo","programa","tamizaje","control","se lo hizo"] },
      { id:"sin_sintomas", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Completamente asintomática. Sin cambios en el hábito intestinal, sin dolor, sin sangre visible, sin pérdida de peso.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","sangre","dolor","deposición","cambios","baño"] },
      { id:"resultado_somf", category:"Enfermedad actual", importance:"critical", revealed:false, value:"SOMF inmunoquímica positivo. Es la primera vez. Le explicaron que eso significa que puede haber sangre en la materia fecal.", reveal_threshold_trust:0, exam_required:false, keywords:["resultado","qué dice","análisis","positivo","sangre","materia fecal"] },
      { id:"antecedentes_ccr", category:"Antecedentes", importance:"important", revealed:false, value:"Sin antecedentes familiares de cáncer de colon. Sin antecedentes personales de pólipos.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","cáncer","colon","antecedentes","polipo"] },
      { id:"busqueda_internet", category:"Preocupación", importance:"important", revealed:false, value:"Buscó en internet y encontró que sangre oculta positiva significa cáncer de colon en muchos sitios. Está convencida de que tiene cáncer.", reveal_threshold_trust:40, exam_required:false, keywords:["qué cree","internet","buscó","preocupa","cáncer"] },
      { id:"hemorroides", category:"Antecedentes", importance:"important", revealed:false, value:"Tiene hemorroides internas conocidas. A veces nota sangrado rojo tras la deposición.", reveal_threshold_trust:0, exam_required:false, keywords:["hemorroides","sangre roja","sangrado","interno","externo"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general. Sin palidez. Sin signos de desnutrición.",
      signos_vitales:"TA 118/74 · FC 80 · T° 36.6°C · IMC 26",
      palpacion_abdomen:"Abdomen blando, sin masas, sin dolor. Sin hepatoesplenomegalia.",
      tacto_rectal:"Hemorroides internas grado II. Sin masas palpables. Sin sangre al guante."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, FR, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, coloración, hidratación",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación de abdomen",
        description:"Masas, dolor, hepatoesplenomegalia",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal",
        description:"Sangre al guante, masas, hemorroides",
        pertinence:"necessary",
        points:5,
        requires_data:"resultado_somf",
        requires_data_label:"Preguntá por el resultado primero",
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación en este caso",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca completa",
        description:"Sin relación con el motivo de consulta",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"colonoscopia", label:"Colonoscopía total (indicación ante SOMF positivo)", result:"Sin pólipos. Sin lesiones neoplásicas. Hemorroides internas grado II confirmadas. Mucosa de colon normal.", pertinence:"critical" },
    ], omitted_critical:["colonoscopia"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:35, examen_fisico:10, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["contexto_tamizaje","sin_sintomas","resultado_somf"],
    important_data_ids:["antecedentes_ccr","busqueda_internet","hemorroides"],
    secondary_data_ids:[],
    common_errors:["Decir 'probablemente sea benigno' sin indicar colonoscopía","No explicar qué es un resultado positivo en tamizaje y su significado real","No explorar la causa posible (hemorroides) sin por eso saltear la colonoscopía","No contener la angustia de la paciente antes de dar explicaciones técnicas"]
  },
  patient_persona_prompt:`Sos una mujer de 48 años. Te salió positivo el tamizaje de sangre oculta en materia fecal y creés que tenés cáncer de colon. Estás muy asustada.
PERSONALIDAD: Angustiada, buscaste en internet, muy asustada. Si el médico explica bien, te vas calmando.
INFORMACIÓN: Participás de un programa municipal de tamizaje, sin síntomas. SOMF positivo. Tenés hemorroides que a veces sangran. Buscaste en internet y los resultados son todos aterradores.
REGLAS: Al principio muy angustiada. Si el médico explica con calma qué significa el resultado de tamizaje (que no equivale a diagnóstico), te tranquilizás. Máximo 3-4 oraciones. Español rioplatense.`
};

const TAM_002 = {
  id:"tam-002", topic_id:"generalidades", topic_label:"Generalidades de tamizaje",
  parcial:1, difficulty:"dificil",
  diagnosis_real:"prevencion_cuaternaria_sobrediagnostico",
  diagnosis_label:"Solicitud de tamizaje sin indicación  -  prevención cuaternaria",
  differentials:["Tamizaje indicado","Sobrediagnóstico potencial","Ansiedad por salud"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Quiero hacerme todos los estudios posibles, quiero un chequeo completo", context:"Consultorio de medicina general" },
  personality:{ trust_base:65, type:"hipocondriaco_informatizado" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de 38 años entra decidido. 'Vine para que me pidan todos los análisis que existen', dice antes de sentarse.",
      "Entra un hombre adulto joven. Trae una lista escrita en el celular con los estudios que quiere.",
    ],
    clinical_data:[
      { id:"motivo_real", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Su padre murió de un infarto a los 55 años hace 6 meses. Desde entonces tiene miedo de morirse sin saberlo.", reveal_threshold_trust:40, exam_required:false, keywords:["por qué","qué le pasó","desde cuándo","familia","padre","miedo"] },
      { id:"lista_estudios", category:"Enfermedad actual", importance:"important", revealed:false, value:"Quiere: PSA, colonoscopía, tomografía de tórax, resonancia de cerebro, marcadores tumorales (CEA, CA125, AFP), doppler de carótidas.", reveal_threshold_trust:0, exam_required:false, keywords:["qué estudios","lista","cuáles","pidió"] },
      { id:"edad_factores", category:"Antecedentes", importance:"critical", revealed:false, value:"38 años. Sin tabaquismo. Sin síntomas. Sin antecedentes de cáncer en familia directa (solo el infarto del padre). IMC 24. Activo físicamente.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","fuma","antecedentes","síntomas","actividad","peso"] },
      { id:"ansiedad", category:"Preocupación", importance:"important", revealed:false, value:"No duerme bien desde la muerte del padre. Consulta mucho a Dr. Google. Su pareja le dice que está obsesionado.", reveal_threshold_trust:50, exam_required:false, keywords:["duerme","ansioso","preocupado","pareja","dice","obsesionado"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre joven en excelente estado general. Sin hallazgos patológicos.",
      signos_vitales:"TA 122/76 · FC 72 · T° 36.5°C · IMC 24",
      palpacion_abdomen:"Blando, sin masas, sin dolor."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, FR, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, peso, aspecto",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación de abdomen",
        description:"Examen abdominal de rutina",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"Evaluación cardiovascular básica",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en control preventivo",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_piel",
        label:"Búsqueda de xantomas",
        description:"Sin factores de riesgo lípidico en este caso",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"laboratorio_basico", label:"Laboratorio básico (glucemia, lípidos, función renal, hemograma)", result:"Todos dentro de valores normales.", pertinence:"critical" },
      { id:"ecg", label:"ECG de 12 derivaciones", result:"Ritmo sinusal. Sin alteraciones.", pertinence:"important" },
    ], omitted_critical:[] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:40, examen_fisico:10, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["motivo_real","edad_factores"],
    important_data_ids:["lista_estudios","ansiedad"],
    secondary_data_ids:[],
    common_errors:["Pedir todos los estudios sin evaluar indicación real","No explorar el motivo emocional detrás de la consulta","No explicar el concepto de sobrediagnóstico y daños del tamizaje sin indicación","No abordar el duelo y la ansiedad subyacente"]
  },
  patient_persona_prompt:`Sos un hombre de 38 años. Tu padre murió de un infarto hace 6 meses y desde entonces querés hacerte todos los estudios posibles. Traés una lista en el celular.
PERSONALIDAD: Decidido, algo ansioso, muy informatizado. Si el médico solo dice que no sin explicar, te frustras. Si explica bien los riesgos del sobrediagnóstico, lo escuchás.
INFORMACIÓN: 38 años, sin síntomas, sin antecedentes de cáncer familiar. Querés PSA, colonoscopía, tomografía, marcadores tumorales, resonancia. No dormís bien desde la muerte de tu papá.
REGLAS: Si el médico no pregunta por tu papá, no lo mencionás de entrada. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── DDC ───────────────────────────────────────────────────────────────────────

const DDC_001 = {
  id:"ddc-001", topic_id:"ddc", topic_label:"DDC",
  parcial:1, difficulty:"normal",
  diagnosis_real:"ddc_sospecha_ecografia_indicada",
  diagnosis_label:"Sospecha de displasia del desarrollo de cadera  -  indicación de ecografía",
  differentials:["Asimetría de pliegues sin DDC","Cadera luxable","Luxación congénita de cadera"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"El pediatra me dijo que mi bebé tiene los pliegues asimétricos y que puede haber algo en la cadera", context:"Consultorio pediátrico" },
  personality:{ trust_base:65, type:"madre_preocupada_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre joven entra con un bebé de 6 semanas en el cochecito. Parece preocupada pero serena.",
      "Entra una mujer con su bebé. Se sienta y saca al bebé del moisés para mostrarlo.",
    ],
    clinical_data:[
      { id:"edad_bebe", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Bebé de 6 semanas. Sexo femenino. Nacida a término.", reveal_threshold_trust:0, exam_required:false, keywords:["cuánto tiene","edad","semanas","cuando nació","sexo"] },
      { id:"derivacion", category:"Enfermedad actual", importance:"important", revealed:false, value:"El pediatra notó asimetría de pliegues glúteos en el control de los 15 días y la derivó para estudio.", reveal_threshold_trust:0, exam_required:false, keywords:["qué le dijeron","por qué vino","pediatra","pliegues","derivó"] },
      { id:"factores_riesgo_ddc", category:"Antecedentes", importance:"critical", revealed:false, value:"Presentación de nalgas durante el embarazo (versión cefálica externa a las 36 semanas). Primera hija. Antecedente materno: la madre tuvo DDC de niña, tratada con arnés.", reveal_threshold_trust:0, exam_required:false, keywords:["embarazo","posición","nalgas","cabeza","primera","familia","madre","cadera","antecedentes"] },
      { id:"parto", category:"Antecedentes", importance:"secondary", revealed:false, value:"Parto vaginal luego de versión cefálica externa. Sin complicaciones.", reveal_threshold_trust:0, exam_required:false, keywords:["parto","cesárea","vaginal","cómo nació","complicaciones"] },
      { id:"examen_ddc", category:"Examen físico", importance:"critical", revealed:false, value:"Asimetría de pliegues glúteos (más pliegues en lado izquierdo). Maniobra de Ortolani negativa. Maniobra de Barlow: ligera sensación de inestabilidad en cadera izquierda. Abducción reducida a izquierda.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_caderas","examen_neonato"], keywords:[] },
    ],
    physical_exam:{ findings:{
      examen_caderas:"Asimetría de pliegues glúteos  -  mayor cantidad en lado izquierdo. Ortolani negativo bilateral. Barlow: ligera inestabilidad en cadera izquierda. Abducción limitada a izquierda (llega a 60°, normal >70°). Sin acortamiento de miembro.",
      examen_neonato:"Bebé femenina de buen aspecto. Tono normal. Fontanela normotensa. Resto sin hallazgos.",
      signos_vitales:"FC 140 · FR 40 · T° 36.8°C · Peso 4.200 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Maniobras de Ortolani y Barlow",
        description:"Evaluación de estabilidad de caderas",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neonato",
        label:"Examen neonatal general",
        description:"Tono, simetría de pliegues glúteos",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado en DDC sin sospecha neurológica",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"orofaringe",
        label:"Examen de orofaringe",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecografia_caderas", label:"Ecografía de caderas (indicada <4-6 meses)", result:"Cadera izquierda: ángulo alfa 52° (VN >60°)  -  displasia leve. Cadera derecha: ángulo alfa 64°  -  normal. Indicación de seguimiento con arnés.", pertinence:"critical" },
    ], omitted_critical:["ecografia_caderas"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:25, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["edad_bebe","factores_riesgo_ddc","examen_ddc"],
    important_data_ids:["derivacion"],
    secondary_data_ids:["parto"],
    common_errors:["No explorar factores de riesgo de DDC (presentación de nalgas, antecedente familiar, sexo femenino)","No realizar maniobras de Ortolani y Barlow","Solicitar radiografía en vez de ecografía (<4-6 meses la placa no es diagnóstica)","No saber que la ecografía es el método de elección antes de los 4-6 meses"]
  },
  patient_persona_prompt:`Sos una madre de 26 años con tu bebé de 6 semanas. El pediatra te dijo que tiene los pliegues asimétricos en la cola y te mandó a estudiar la cadera. Estás preocupada.
INFORMACIÓN: Bebé de 6 semanas, nena. El embarazo fue de nalgas al principio, la dieron vuelta a las 36 semanas. Primera hija. Vos tuviste DDC de chica, te pusieron un arnés.
REGLAS: Cooperativa. Si preguntan por el embarazo contás lo de las nalgas. Mencionás tu propia DDC si preguntan por antecedentes familiares. Máximo 3-4 oraciones. Español rioplatense.`
};

const DDC_002 = {
  id:"ddc-002", topic_id:"ddc", topic_label:"DDC",
  parcial:1, difficulty:"normal",
  diagnosis_real:"ddc_seguimiento_radiografia_indicada",
  diagnosis_label:"DDC en seguimiento  -  indicación de radiografía (>4-6 meses)",
  differentials:["DDC resuelta","Displasia residual","Luxación de cadera no corregida"],
  patient:{ sex:"F", visual_id:"paciente-hijo", chief_complaint:"Mi nena de 6 meses tuvo displasia de cadera y tenemos que hacer el control", context:"Consultorio pediátrico" },
  personality:{ trust_base:70, type:"madre_informada_seguimiento" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer entra con una nena de 6 meses. Trae una carpeta con las ecografías anteriores.",
      "Entra una madre con su bebé en los brazos. La nena lleva puesto un arnés de Pavlik.",
    ],
    clinical_data:[
      { id:"edad_diagnostico", category:"Antecedentes", importance:"critical", revealed:false, value:"DDC izquierda diagnosticada por ecografía a las 6 semanas. Ángulo alfa 52°. Inició arnés de Pavlik a las 8 semanas.", reveal_threshold_trust:0, exam_required:false, keywords:["cuándo se diagnosticó","cuándo empezó","ecografía","arnés","diagnóstico"] },
      { id:"tratamiento_arnes", category:"Antecedentes", importance:"important", revealed:false, value:"Usó arnés de Pavlik durante 3 meses. Lo sacaron hace 3 semanas por indicación del traumatólogo.", reveal_threshold_trust:0, exam_required:false, keywords:["arnés","cuánto tiempo","tratamiento","lo sacaron","cuándo"] },
      { id:"evolucion", category:"Enfermedad actual", importance:"important", revealed:false, value:"Controles ecográficos mostraron mejoría progresiva. Última ecografía: ángulo alfa 62° (normal).", reveal_threshold_trust:0, exam_required:false, keywords:["mejoró","ecografías","cómo fue","evolución","estudios anteriores"] },
      { id:"edad_actual", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Nena de 6 meses. En esta etapa corresponde radiografía de cadera (ya no ecografía  -  los núcleos de osificación se ven mejor en Rx).", reveal_threshold_trust:0, exam_required:false, keywords:["edad","cuánto tiene","meses","cuántos"] },
      { id:"examen_caderas_control", category:"Examen físico", importance:"critical", revealed:false, value:"Abducción completa bilateral (>80°). Sin chasquido. Sin asimetría de pliegues. Sin acortamiento de miembro. Signo de Galeazzi negativo.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_caderas","examen_neonato"], keywords:[] },
    ],
    physical_exam:{ findings:{
      examen_caderas:"Abducción completa bilateral. Sin chasquido ni sensación de inestabilidad. Sin asimetría de pliegues. Galeazzi negativo.",
      examen_neonato:"Lactante de 6 meses, buen estado general. Sostén cefálico presente. Comienza a sentarse con apoyo.",
      signos_vitales:"FC 130 · FR 36 · T° 36.7°C · Peso 7.200 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas (control DDC)",
        description:"Abducción, asimetría, Galeazzi",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neonato",
        label:"Examen de lactante",
        description:"Desarrollo motor, tono",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico extenso",
        description:"No indicado en control de DDC",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"rx_cadera", label:"Radiografía de caderas (control  -  >4-6 meses)", result:"Línea de Hilgenreiner y Perkins normales. Ángulo acetabular 26° bilateral (VN <30°). Núcleo de osificación femoral visible y bien posicionado. Caderas congruentes.", pertinence:"critical" },
    ], omitted_critical:["rx_cadera"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:25, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["edad_actual","examen_caderas_control"],
    important_data_ids:["edad_diagnostico","tratamiento_arnes","evolucion"],
    secondary_data_ids:[],
    common_errors:["Solicitar ecografía en vez de radiografía a los 6 meses (la ecografía ya no es el método de elección)","No examinar las caderas","No conocer los puntos de referencia de la radiografía de cadera (Hilgenreiner, Perkins, ángulo acetabular)"]
  },
  patient_persona_prompt:`Sos la madre de una nena de 6 meses. Tuvo displasia de cadera, la trataron con arnés de Pavlik durante 3 meses y ahora venís al control. Traés las ecografías anteriores.
INFORMACIÓN: DDC diagnosticada a las 6 semanas. Arnés durante 3 meses. Lo sacaron hace 3 semanas. Las ecografías mostraron mejoría. Hoy venís a saber si está bien.
REGLAS: Informada sobre el diagnóstico anterior. Cooperativa. Estás esperanzada en que todo salió bien. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── HIPOACUSIA ────────────────────────────────────────────────────────────────

const HIP_001 = {
  id:"hip-001", topic_id:"hipoacusia", topic_label:"Pesquisa de hipoacusia",
  parcial:1, difficulty:"normal",
  diagnosis_real:"hipoacusia_pesquisa_alterada_derivacion",
  diagnosis_label:"Pesquisa de hipoacusia alterada  -  derivación a audiología",
  differentials:["Falso positivo por tapón de vérnix","Hipoacusia neurosensorial congénita","Otitis media con efusión"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi bebé no pasó el test de audición en la maternidad y no sé qué significa", context:"Consultorio pediátrico" },
  personality:{ trust_base:60, type:"madre_asustada_sin_info" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre joven entra con un recién nacido. Tiene un papel de la maternidad en la mano. Se la ve confundida.",
      "Entra una mujer con su bebé de días. 'En el hospital me dieron esto y me dijeron que viniera', dice.",
    ],
    clinical_data:[
      { id:"resultado_pesquisa_oea", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Otoemisiones acústicas (OEA) fallidas en oído derecho en la maternidad. Oído izquierdo pasó. Le dieron turno para repetir el estudio.", reveal_threshold_trust:0, exam_required:false, keywords:["qué dice","resultado","test","audición","oído","pasó","no pasó"] },
      { id:"edad_rn_hip", category:"Enfermedad actual", importance:"important", revealed:false, value:"Bebé de 5 días. Nacida a término (39 semanas). Parto vaginal normal.", reveal_threshold_trust:0, exam_required:false, keywords:["cuánto tiene","días","edad","semanas","nació","parto"] },
      { id:"factores_riesgo_hipoacusia", category:"Antecedentes", importance:"critical", revealed:false, value:"Sin factores de riesgo para hipoacusia: sin antecedentes familiares, sin infecciones perinatales, sin hipoxia, sin medicación ototóxica, sin internación en UCIN.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","sordo","medicación","incubadora","UCIN","infección","riesgo"] },
      { id:"comportamiento_auditivo", category:"Síntomas asociados", importance:"important", revealed:false, value:"La madre refiere que el bebé se sobresalta con ruidos fuertes y parece tranquilizarse con la voz materna.", reveal_threshold_trust:0, exam_required:false, keywords:["reacciona","ruido","voz","asusta","responde","oye"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"RN de buen aspecto general. Activo, reactivo.",
      examen_otoscopico:"Conductos auditivos externos permeables. Tímpanos no bien visualizables por vérnix residual en oído derecho. Oído izquierdo normal.",
      signos_vitales:"FC 145 · FR 42 · T° 36.8°C · Peso 3.400 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neonato",
        label:"Examen neonatal",
        description:"Tono, reflejos, aspecto general",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Otoscopía y conductos auditivos",
        description:"Permeabilidad del conducto, vérnix residual",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico extenso",
        description:"No indicado en pesquisa auditiva",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"oea_repeticion", label:"Repetición de OEA (antes de los 30 días)", result:"Si persiste falla: derivar a potenciales evocados auditivos de tronco (PEAT) antes de los 3 meses.", pertinence:"critical" },
      { id:"peat", label:"Potenciales evocados auditivos de tronco (PEAT)", result:"Pendiente  -  derivar a audiología.", pertinence:"critical" },
    ], omitted_critical:["oea_repeticion"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:30, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["resultado_pesquisa_oea","factores_riesgo_hipoacusia"],
    important_data_ids:["edad_rn_hip","comportamiento_auditivo"],
    secondary_data_ids:[],
    common_errors:["No explicar que un resultado fallido en OEA no confirma sordera","No mencionar que el vérnix puede causar falsos positivos en las primeras horas/días","No derivar a repetición de OEA o PEAT","No explorar factores de riesgo para hipoacusia","No dar un plazo claro para el seguimiento"]
  },
  patient_persona_prompt:`Sos una madre de 24 años con tu bebé de 5 días. En la maternidad el bebé no pasó el test de audición en un oído y te asustaste mucho.
INFORMACIÓN: OEA fallidas en oído derecho. El bebé reacciona a ruidos fuertes y se tranquiliza con tu voz. Sin antecedentes familiares de sordera. Sin complicaciones en el embarazo o parto.
REGLAS: Asustada pero cooperativa. No entendés qué significa el resultado. Si el médico explica bien que puede ser un falso positivo, te tranquilizás pero querés saber qué sigue. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── SALUD VISUAL ──────────────────────────────────────────────────────────────

const VIS_001 = {
  id:"vis-001", topic_id:"salud_visual", topic_label:"Salud visual",
  parcial:1, difficulty:"dificil",
  diagnosis_real:"leucocoria_sospecha_retinoblastoma",
  diagnosis_label:"Leucocoria  -  sospecha de retinoblastoma (derivación urgente a oftalmología)",
  differentials:["Catarata congénita","Retinopatía del prematuro","Toxocara","Vítreo primario hiperplásico persistente"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi nena de 8 meses tiene algo blanco en el ojo en las fotos", context:"Consultorio pediátrico" },
  personality:{ trust_base:65, type:"madre_preocupada_observadora" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre entra con una nena de 8 meses. Le muestra el teléfono al médico antes de sentarse: 'Mire esto'.",
      "Entra una mujer con su bebé. Se sienta y abre el teléfono con una foto donde se ve algo blanco en el ojo de la nena.",
    ],
    clinical_data:[
      { id:"leucocoria_foto", category:"Enfermedad actual", importance:"critical", revealed:false, value:"La madre notó en fotos con flash que el ojo derecho de la nena refleja blanco en vez de rojo. Lo notó en varias fotos distintas.", reveal_threshold_trust:0, exam_required:false, keywords:["foto","flash","blanco","ojo","reflejo","rojo","notó"] },
      { id:"edad_inicio", category:"Enfermedad actual", importance:"important", revealed:false, value:"Lo notó por primera vez hace 3 semanas. En fotos de antes parece que también estaba pero no lo habían visto.", reveal_threshold_trust:0, exam_required:false, keywords:["cuándo","desde cuándo","hace cuánto","empezó"] },
      { id:"antecedentes_rn", category:"Antecedentes", importance:"important", revealed:false, value:"Nena a término, sin complicaciones perinatales. Sin antecedentes de retinoblastoma en familia.", reveal_threshold_trust:0, exam_required:false, keywords:["embarazo","nació","antecedentes","familia","ojo","cáncer"] },
      { id:"examen_reflejo_rojo", category:"Examen físico", importance:"critical", revealed:false, value:"Reflejo rojo: AUSENTE en ojo derecho (leucocoria confirmada). Presente y normal en ojo izquierdo. Urgencia oftalmológica.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_reflejo_rojo","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Lactante femenina de 8 meses, buen estado general, activa.",
      examen_reflejo_rojo:"Reflejo rojo AUSENTE en ojo derecho  -  leucocoria. Reflejo rojo presente y naranja-rojizo normal en ojo izquierdo. URGENCIA OFTALMOLÓGICA.",
      signos_vitales:"FC 128 · FR 32 · T° 36.6°C · Peso 8.100 g"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"FC, T°, FR, peso",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Examen de reflejo rojo (oftalmoscopio)",
        description:"Buscar leucocoria  -  urgencia oftalmológica",
        pertinence:"necessary",
        points:12,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general del lactante",
        description:"Estado general, reactividad",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No prioritario antes de confirmar leucocoria",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"derivacion_oftalmologia", label:"Derivación URGENTE a oftalmología pediátrica (el mismo día)", result:"Pendiente  -  URGENCIA. No demorar. El retinoblastoma tiene buen pronóstico si se trata precozmente.", pertinence:"critical" },
    ], omitted_critical:["derivacion_oftalmologia"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:20, examen_fisico:30, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["leucocoria_foto","examen_reflejo_rojo"],
    important_data_ids:["edad_inicio","antecedentes_rn"],
    secondary_data_ids:[],
    common_errors:["No realizar examen de reflejo rojo (es el estudio clave en esta consulta)","Tranquilizar a la madre sin derivar urgente","No conocer la leucocoria como signo de alarma de retinoblastoma","Demorar la derivación a oftalmología"]
  },
  patient_persona_prompt:`Sos una madre de 30 años. Notaste que en las fotos con flash tu nena de 8 meses tiene el ojo derecho blanco en vez de rojo. Viniste porque te parece raro.
INFORMACIÓN: Lo notaste hace 3 semanas en varias fotos. Tenés las fotos en el celular para mostrar. La nena nació bien, sin complicaciones. Sin antecedentes de problemas oculares en la familia.
REGLAS: Mostrás las fotos si te las piden. Preocupada pero sin entrar en pánico todavía. Si el médico parece urgente al derivarte, te asustás y preguntás qué puede ser. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── ITU SEGUNDA  -  CON ESTUDIOS COMPLEMENTARIOS ────────────────────────────────

const ITU_002 = {
  id:"itu-002", topic_id:"itu_pediatrica", topic_label:"ITU pediátrica",
  parcial:1, difficulty:"dificil",
  diagnosis_real:"itu_segunda_estudio_complementario",
  diagnosis_label:"Segunda ITU febril en varón  -  indicación de cistouretrografía y centellograma",
  differentials:["ITU recurrente sin malformación","Reflujo vesicoureteral","Válvulas de uretra posterior"],
  patient:{ sex:"F", visual_id:"paciente-hijo", chief_complaint:"Mi nene tuvo otra infección urinaria, es la segunda en 4 meses", context:"Guardia pediátrica" },
  personality:{ trust_base:65, type:"madre_preocupada_con_antecedentes" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre entra a la guardia con un nene de unos 18 meses. Parece cansada pero decidida.",
      "Entra una mujer con su hijo pequeño. 'Ya sé lo que tiene, pero quiero saber por qué le sigue pasando', dice.",
    ],
    clinical_data:[
      { id:"segunda_itu", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Segunda ITU febril. La primera fue a los 14 meses (E. coli sensible, tratada con amoxicilina-clavulánico). Ahora tiene 18 meses.", reveal_threshold_trust:0, exam_required:false, keywords:["cuántas veces","segunda","primera vez","antes","cuándo fue la primera"] },
      { id:"sexo_edad", category:"Antecedentes", importance:"critical", revealed:false, value:"Varón de 18 meses. Sin circuncisión.", reveal_threshold_trust:0, exam_required:false, keywords:["nene","nena","edad","meses","sexo","circuncisión"] },
      { id:"sintomas_actuales", category:"Enfermedad actual", importance:"important", revealed:false, value:"Fiebre de 38.8°C hace 2 días, decaído, sin foco aparente. Orina con olor fuerte.", reveal_threshold_trust:0, exam_required:false, keywords:["fiebre","síntomas","cuándo empezó","orina","olor"] },
      { id:"ecografia_previa", category:"Antecedentes", importance:"important", revealed:false, value:"Ecografía renal después de la primera ITU: normal. No se había indicado cistouretrografía porque era la primera ITU.", reveal_threshold_trust:0, exam_required:false, keywords:["ecografía","estudio","primera vez","hizo algo","cistouretrografía"] },
      { id:"examen_itu2", category:"Examen físico", importance:"important", revealed:false, value:"Fiebre 38.8°C. Genitales externos normales. Prepucio fimótico. Puño-percusión positiva bilateral.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen","examen_pediatrico"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Varón 18 meses, febril, decaído. Hidratado.",
      examen_pediatrico:"Genitales externos: prepucio fimótico grado II. Sin otras alteraciones.",
      palpacion_abdomen:"Puño-percusión lumbar positiva bilateral. Sin masas. Sin globo vesical.",
      signos_vitales:"T° 38.8°C · FC 138 · FR 30 · TA 90/58 · Peso 11 kg"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal y lumbar",
        description:"Puño-percusión, globo vesical",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_pediatrico",
        label:"Examen genitourinario",
        description:"Prepucio fimótico, genitales externos",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"sedimento_urocultivo", label:"Sedimento urinario y urocultivo (cateterismo)", result:"Leucocituria 120/campo · Bacteriuria ++ · Nitritos positivos. Urocultivo pendiente.", pertinence:"critical" },
      { id:"ecografia_renal_2", label:"Ecografía renal y vesical", result:"Dilatación leve de pelvis renal derecha (8 mm). Urotelio engrosado. Compatible con pielonefritis aguda derecha.", pertinence:"important" },
      { id:"cistouretrografia", label:"Cistouretrografía miccional (indicada: 2° ITU en varón)", result:"Reflujo vesicoureteral grado III derecho. Indicación de profilaxis antibiótica y seguimiento nefrourológico.", pertinence:"critical" },
      { id:"centellograma_dmsa", label:"Centellograma renal con DMSA (cicatrices renales)", result:"Pendiente  -  indicar luego de fase aguda (4-6 meses).", pertinence:"important" },
    ], omitted_critical:["cistouretrografia"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:15, examen_fisico:20, razonamiento:15, diagnostico:5, estudios:10 },
    critical_data_ids:["segunda_itu","sexo_edad"],
    important_data_ids:["sintomas_actuales","ecografia_previa","examen_itu2"],
    secondary_data_ids:[],
    common_errors:["No reconocer que la segunda ITU en varón indica cistouretrografía","No preguntar si es la primera o segunda ITU","No conocer el algoritmo de estudios por imagen en ITU pediátrica recurrente","No solicitar urocultivo por cateterismo en lactante varón","No mencionar centellograma DMSA para búsqueda de cicatrices"]
  },
  patient_persona_prompt:`Sos la madre de un varón de 18 meses. Está con fiebre y ya le diagnosticaron ITU antes  -  es la segunda en 4 meses. Ya sabés reconocer los síntomas.
INFORMACIÓN: Primera ITU a los 14 meses, tratada bien. Ecografía normal en ese momento. Ahora volvió: fiebre 2 días, orina con olor fuerte. Querés saber por qué le sigue pasando.
REGLAS: Informada sobre el diagnóstico. Querés saber la causa, no solo el tratamiento. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── IMÁGENES I  -  SELECCIÓN DE MÉTODO ─────────────────────────────────────────

const IMG_001 = {
  id:"img-001", topic_id:"imagenes", topic_label:"Diagnóstico por imágenes",
  parcial:1, difficulty:"normal",
  diagnosis_real:"seleccion_metodo_imagen_correcto",
  diagnosis_label:"Selección correcta del método de imagen  -  principios de radioprotección",
  differentials:["TC cuando debería ser ecografía","RM cuando debería ser Rx","Rx cuando debería ser TC"],
  patient:{ sex:"F", visual_id:"paciente-hijo", chief_complaint:"Mi hijo se cayó y le duele el brazo, el médico de guardia dijo que puede tener algo roto", context:"Consultorio pediátrico / guardia" },
  personality:{ trust_base:70, type:"madre_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una madre entra con un nene de 7 años que tiene el brazo derecho inmóvil y apoyado en el pecho. Llora.",
      "Entra una mujer con su hijo. El nene tiene el brazo en cabestrillo improvisado. Tiene cara de dolor.",
    ],
    clinical_data:[
      { id:"mecanismo_caida", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Caída desde la calesita del parque  -  aprox. 1 metro de altura. Cayó sobre la mano extendida.", reveal_threshold_trust:0, exam_required:false, keywords:["cómo","qué pasó","caída","desde dónde","mecanismo"] },
      { id:"dolor_brazo", category:"Síntomas asociados", importance:"important", revealed:false, value:"Dolor intenso en antebrazo distal derecho. Deformidad visible en 'dorso de tenedor'. No puede mover la muñeca.", reveal_threshold_trust:0, exam_required:false, keywords:["dónde duele","brazo","muñeca","movimiento","deformidad"] },
      { id:"estado_general", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Sin pérdida de conocimiento, sin traumatismo craneal. Sin otros dolores.", reveal_threshold_trust:0, exam_required:false, keywords:["cabeza","desmayo","otros dolores","estado general"] },
      { id:"examen_brazo", category:"Examen físico", importance:"critical", revealed:false, value:"Deformidad en cara dorsal de muñeca derecha. Dolor intenso a la palpación. Crepitación sutil. Pulso radial presente. Sensibilidad conservada. Sin compromiso vascular ni neurológico.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_pediatrico","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Nene de 7 años, álgico, con brazo derecho en posición antiálgica.",
      examen_pediatrico:"Deformidad visible en región distal de antebrazo derecho. Dolor intenso a la palpación. Crepitación. Pulso radial presente y simétrico. Sensibilidad en dedos conservada. No hay compromiso vascular ni neurológico.",
      signos_vitales:"FC 112 · FR 22 · T° 36.8°C · Peso 25 kg"
    }},
    studies:{ indicated:[
      { id:"rx_muneca", label:"Radiografía de muñeca (frente y perfil)  -  método de elección", result:"Fractura de Colles en radio distal derecho. Sin compromiso articular. Indicación de reducción cerrada e inmovilización.", pertinence:"critical" },
    ], omitted_critical:["rx_muneca"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:15, examen_fisico:25, razonamiento:20, diagnostico:5, estudios:10 },
    critical_data_ids:["mecanismo_caida","examen_brazo"],
    important_data_ids:["dolor_brazo"],
    secondary_data_ids:["estado_general"],
    common_errors:["Solicitar TC en vez de Rx para fractura ósea de extremidad (mayor radiación sin beneficio)","No evaluar pulso ni sensibilidad distal antes de inmovilizar","No conocer el principio ALARA en radioprotección","Solicitar Rx de todo el miembro en vez de focalizar en el sitio del dolor"]
  },
  patient_persona_prompt:`Sos la madre de un nene de 7 años que se cayó en el parque y se lastimó el brazo. El nene llora de dolor y tiene el brazo raro, doblado.
INFORMACIÓN: Se cayó de la calesita, como 1 metro. Cayó sobre la mano. El brazo derecho le duele mucho y tiene una deformidad en la muñeca.
REGLAS: Cooperativa y asustada. Querés que le den algo para el dolor urgente. Respondés todo. Máximo 3-4 oraciones. Español rioplatense.`
};

// ═══════════════════════════════════════════════════════════════════════════════
// CASOS NUEVOS  -  SEGUNDO PARCIAL
// ═══════════════════════════════════════════════════════════════════════════════

// ── ITS  -  CONSEJERÍA PRE-TEST VIH ────────────────────────────────────────────

const ITS_005 = {
  id:"its-005", topic_id:"its", topic_label:"ITS",
  parcial:2, difficulty:"normal",
  diagnosis_real:"consejeria_pre_test_vih",
  diagnosis_label:"Consejería pre-test VIH  -  exposición de riesgo reciente",
  differentials:["VIH agudo","Otra ITS","Sin infección"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Tuve una relación de riesgo hace una semana y quiero saber si tengo VIH", context:"Centro de salud" },
  personality:{ trust_base:55, type:"ansiosa_bien_informada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 28 años entra al consultorio. Se la ve nerviosa pero decidida.",
      "Entra una paciente joven. Se sienta y va directo al grano: 'Vine por una situación de riesgo'.",
    ],
    clinical_data:[
      { id:"exposicion_riesgo", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Relación sexual sin preservativo hace 7 días con un hombre cuyo estado serológico desconoce. Roto el preservativo durante la relación.", reveal_threshold_trust:0, exam_required:false, keywords:["qué pasó","cuándo","relación","preservativo","riesgo","exposición"] },
      { id:"tipo_exposicion", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Relación vaginal receptiva. Riesgo moderado de transmisión (~0.08% por exposición sin factores adicionales).", reveal_threshold_trust:0, exam_required:false, keywords:["tipo","vaginal","anal","oral","receptiva","insertiva"] },
      { id:"sintomas_actuales_vih", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin síntomas. Sin fiebre, sin rash, sin adenopatías. El período de ventana hace que un test hoy sea no concluyente.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","fiebre","ganglios","sarpullido","cómo se siente"] },
      { id:"pep_oportunidad", category:"Antecedentes", importance:"critical", revealed:false, value:"La exposición fue hace 7 días. La profilaxis post-exposición (PEP) ya no es efectiva (ventana máxima 72 horas). La paciente no lo sabía.", reveal_threshold_trust:0, exam_required:false, keywords:["pastilla","profilaxis","PEP","72 horas","tomó algo","medicación"] },
      { id:"its_actuales", category:"Antecedentes", importance:"important", revealed:false, value:"Sin antecedentes de ITS. Pareja estable anterior. Esta fue una relación ocasional.", reveal_threshold_trust:40, exam_required:false, keywords:["pareja","relaciones anteriores","ITS","antecedentes","otras infecciones"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general. Sin adenopatías palpables. Sin rash.",
      signos_vitales:"TA 116/72 · FC 82 · T° 36.6°C"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"T°, FC, FR, TA",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, adenopatías, rash",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación ganglionar",
        description:"Adenopatías generalizadas en VIH agudo",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado en consejería pre-test sin síntomas neurológicos",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital completa",
        description:"No indicada sin síntomas genitales en esta consulta",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"vih_test_basal", label:"Test VIH 4ª generación (basal  -  puede ser negativo en período de ventana)", result:"No reactivo  -  RESULTADO NO CONCLUYENTE a los 7 días. Repetir a los 45 días y a los 90 días.", pertinence:"critical" },
      { id:"otras_its", label:"VDRL, Hepatitis B y C, Gonorrea/Clamidia (oportunidad)", result:"VDRL no reactivo · HBsAg negativo · Anti-HCV negativo · NAAT negativo.", pertinence:"important" },
    ], omitted_critical:["vih_test_basal"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:45, examen_fisico:5, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["exposicion_riesgo","tipo_exposicion","pep_oportunidad"],
    important_data_ids:["sintomas_actuales_vih","its_actuales"],
    secondary_data_ids:[],
    common_errors:["No explicar el período de ventana del VIH","No mencionar que un test negativo hoy no descarta infección","No informar sobre la PEP aunque ya pasó la ventana (para educación futura)","No aprovechar para ofrecer testeo de otras ITS","No dar seguimiento claro (45 y 90 días)"]
  },
  patient_persona_prompt:`Sos una mujer de 28 años. Tuviste una relación sin preservativo hace una semana y querés saber si tenés VIH. Estás ansiosa y bien informada.
INFORMACIÓN: Relación vaginal, se rompió el preservativo hace 7 días. No sabés el estado serológico de la persona. Sin síntomas. No tomaste ninguna medicación preventiva porque no sabías que existía.
REGLAS: Ansiosa pero cooperativa. Hacés preguntas concretas: ¿puedo saber hoy?, ¿qué probabilidad tengo?, ¿puedo tomar algo ahora? Máximo 3-4 oraciones. Español rioplatense.`
};

// ── HEPATOPATÍA ALCOHÓLICA  -  CASOS FALTANTES ─────────────────────────────────

const ALC_002 = {
  id:"alc-002", topic_id:"alcoholismo", topic_label:"Hepatopatía alcohólica",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"cirrosis_descompensada",
  diagnosis_label:"Cirrosis hepática descompensada (ascitis + ictericia + encefalopatía leve)",
  differentials:["Hepatitis alcohólica aguda grave","Insuficiencia cardíaca derecha","Síndrome de Budd-Chiari"],
  patient:{ sex:"M", visual_id:"paciente-masculino-mayor", chief_complaint:"La panza se me infló en los últimos meses y ahora estoy medio confuso", context:"Guardia de hospital" },
  personality:{ trust_base:40, type:"minimizador_con_familiar" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 55 años entra a la guardia acompañado de su esposa. Tiene la panza muy distendida. La esposa habla más que él.",
      "Lo traen en silla de ruedas. Tiene el abdomen globoso y está algo desorientado. La mujer que lo acompaña está muy asustada.",
    ],
    clinical_data:[
      { id:"ascitis_evolucion", category:"Enfermedad actual", importance:"critical", revealed:false, value:"La panza fue creciendo en 3 meses. Antes tenía pantalones de 40, ahora no le cierran. Subió 8 kg en ese período.", reveal_threshold_trust:0, exam_required:false, keywords:["panza","abdomen","cuándo","creció","tiempo","meses","peso"] },
      { id:"ictericia_reciente", category:"Síntomas asociados", importance:"important", revealed:false, value:"Desde hace 2 semanas tiene los ojos amarillos. La esposa lo nota más oscuro de piel.", reveal_threshold_trust:0, exam_required:false, keywords:["amarillo","ojos","piel","ictericia","color"] },
      { id:"confusion", category:"Síntomas asociados", importance:"critical", revealed:false, value:"La esposa nota que a veces está confundido, no recuerda dónde dejó las cosas, a veces invierte el sueño (duerme de día).", reveal_threshold_trust:0, exam_required:false, keywords:["confundido","mente","memoria","duerme","noche","día","confusión"] },
      { id:"consumo_alcohol_alc2", category:"Antecedentes", importance:"critical", revealed:false, value:"Toma desde hace 20 años. En los últimos 5 años, 1 litro de vino por día. Dejó de tomar hace 3 semanas porque 'ya no le hacía efecto'.", reveal_threshold_trust:30, exam_required:false, keywords:["toma","alcohol","bebe","cuánto","vino","dejó"] },
      { id:"examen_cirrosis", category:"Examen físico", importance:"critical", revealed:false, value:"Ictericia escleral y cutánea. Ascitis masiva con matidez desplazable. Arañas vasculares en tórax (x6). Eritema palmar. Circulación colateral en abdomen. Hipertrofia parotídea. Asterixis leve (flapping).", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","palpacion_abdomen","signos_vitales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre con ictericia evidente. Arañas vasculares en tórax. Eritema palmar. Hipertrofia parotídea bilateral. Ginecomastia.",
      palpacion_abdomen:"Ascitis masiva  -  matidez desplazable, ola ascítica positiva. Hígado difícil de palpar. Bazo palpable 3 cm. Circulación colateral abdominal visible.",
      examen_neurologico:"Asterixis leve (flapping tremor). Orientado en persona pero desorientado en tiempo. Sin focalidad.",
      signos_vitales:"TA 100/60 · FC 98 · T° 37.2°C · Peso actual 94 kg (habitual 86 kg)"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general  -  estigmas hepáticos",
        description:"Ictericia, arañas vasculares, eritema palmar, ginecomastia",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/alc_ictericia_adulto.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ictericia en adulto",
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal  -  ascitis",
        description:"Ola ascítica, matidez desplazable, circulación colateral",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/alc_ascitis.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Ascitis",
      },
      {
        id:"examen_neurologico",
        label:"Búsqueda de asterixis",
        description:"Flapping tremor  -  encefalopatía hepática",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Examen ocular con oftalmoscopio",
        description:"No prioritario en esta presentación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"hepatograma_cirrosis", label:"Hepatograma completo", result:"BT 4.8 mg/dL · BD 3.2 mg/dL · TGO 88 · TGP 42 (TGO/TGP >2) · FA 310 · GGT 480 · Albúmina 2.1 g/dL · TP 42%  -  insuficiencia hepática severa.", pertinence:"critical" },
      { id:"ecografia_cirrosis", label:"Ecografía abdominal", result:"Hígado pequeño, nodular, ecoestructura heterogénea  -  patrón cirrótico. Ascitis masiva. Bazo 16 cm. Vena porta 14 mm (dilatada). Sin trombosis portal.", pertinence:"critical" },
      { id:"amoníaco", label:"Amonio sérico", result:"118 µmol/L (VN <50)  -  encefalopatía hepática grado I-II.", pertinence:"important" },
    ], omitted_critical:["hepatograma_cirrosis","ecografia_cirrosis"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:25, razonamiento:15, diagnostico:10, estudios:5 },
    critical_data_ids:["ascitis_evolucion","consumo_alcohol_alc2","examen_cirrosis","confusion"],
    important_data_ids:["ictericia_reciente"],
    secondary_data_ids:[],
    common_errors:["No buscar signos físicos de hipertensión portal (arañas vasculares, circulación colateral, ascitis)","No evaluar encefalopatía hepática (asterixis)","No cuantificar el consumo de alcohol","No solicitar ecografía abdominal con urgencia"]
  },
  patient_persona_prompt:`Sos un hombre de 55 años. Tu panza se infló mucho en los últimos meses y tu señora te trajo porque estás "medio ido". Tomabas mucho pero lo minimizás.
INFORMACIÓN: Panza que creció 3 meses. Subiste 8 kg. Ojos amarillos hace 2 semanas. Tu señora dice que estás confundido. Tomabas 1 litro de vino por día hace años, dejaste hace 3 semanas.
REGLAS: Minimizás el alcohol. Tu esposa (si el médico se dirige a ella) confirma todo y agrega más. Algo confundido  -  a veces no seguís bien la conversación. Máximo 3 oraciones. Español rioplatense.`
};

const ALC_003 = {
  id:"alc-003", topic_id:"alcoholismo", topic_label:"Alcoholismo",
  parcial:2, difficulty:"normal",
  diagnosis_real:"consumo_riesgo_mujer_audit_positivo",
  diagnosis_label:"Consumo de alcohol de riesgo en mujer  -  AUDIT positivo, abordaje motivacional",
  differentials:["Consumo social sin riesgo","Consumo perjudicial","Dependencia alcohólica"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Vine por el control anual, me siento bien", context:"Consultorio de medicina general" },
  personality:{ trust_base:65, type:"minimizadora_funcional" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 40 años entra al consultorio. Bien vestida, segura. Viene por el control de rutina.",
      "Entra una paciente adulta. Se sienta cómodamente. 'Vine por el chequeo anual, no tengo nada', dice.",
    ],
    clinical_data:[
      { id:"consumo_alcohol_alc3", category:"Antecedentes", importance:"critical", revealed:false, value:"Toma una copa de vino al mediodía y 2-3 copas a la noche, todos los días. Los fines de semana más. Dice que es 'parte de la vida social' y que 'no le hace nada'.", reveal_threshold_trust:35, exam_required:false, keywords:["toma","alcohol","vino","cerveza","copa","cuánto","bebe","consume"] },
      { id:"tolerancia", category:"Antecedentes", importance:"important", revealed:false, value:"Nota que necesita tomar más que antes para sentir el mismo efecto. Antes con 2 copas ya se sentía diferente, ahora no.", reveal_threshold_trust:50, exam_required:false, keywords:["necesita más","tolerancia","efecto","antes","ahora","diferente"] },
      { id:"intentos_dejar", category:"Antecedentes", importance:"important", revealed:false, value:"Intentó no tomar un lunes y se sentía ansiosa, irritable y con temblor en las manos hasta el mediodía.", reveal_threshold_trust:55, exam_required:false, keywords:["intentó","dejó","sin tomar","dejar","ansiosa","temblor","nervios"] },
      { id:"impacto_laboral", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Trabajo bien. A veces llega tarde los lunes. Su pareja le hace comentarios.", reveal_threshold_trust:60, exam_required:false, keywords:["trabajo","pareja","comentarios","problema","tarde","familia"] },
      { id:"examen_alc3", category:"Examen físico", importance:"important", revealed:false, value:"TA 138/88. IMC 27. Sin ictericia. Sin arañas vasculares. Sin hepatomegalia. Temblor fino de manos en reposo.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general","palpacion_abdomen"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general. Sin ictericia. Sin arañas vasculares. Sin eritema palmar.",
      palpacion_abdomen:"Hígado en límite superior normal (11 cm). Sin esplenomegalia. Sin ascitis.",
      examen_neurologico:"Temblor fino de manos visible en reposo. Sin asterixis.",
      signos_vitales:"TA 138/88 · FC 84 · T° 36.6°C · IMC 27"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  estigmas alcohólicos",
        description:"Ictericia, arañas vasculares, hipertrofia parotídea",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Hepatomegalia, esplenomegalia",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Temblor de manos",
        description:"Temblor fino en reposo  -  síntoma de abstinencia",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"audit_alc3", label:"Test AUDIT", result:"Score 18/40  -  consumo de riesgo/perjudicial. Supera el umbral de intervención.", pertinence:"critical" },
      { id:"hepatograma_alc3", label:"Hepatograma", result:"TGO 52 · TGP 38 · GGT 185 UI/L (elevada  -  marcador sensible de consumo crónico) · Resto normal.", pertinence:"important" },
    ], omitted_critical:["audit_alc3"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:40, examen_fisico:10, razonamiento:10, diagnostico:5, estudios:5 },
    critical_data_ids:["consumo_alcohol_alc3","tolerancia","intentos_dejar"],
    important_data_ids:["examen_alc3"],
    secondary_data_ids:["impacto_laboral"],
    common_errors:["No preguntar por consumo de alcohol en un control de rutina","No realizar el AUDIT","No reconocer tolerancia y síntomas de abstinencia como señales de dependencia","Juzgar o moralizar  -  genera resistencia","No conocer los umbrales de riesgo en mujeres (menores que en hombres)"]
  },
  patient_persona_prompt:`Sos una mujer de 40 años. Viniste al control anual, te sentís bien. Tomás vino todos los días pero lo ves como algo normal.
PERSONALIDAD: Minimizadora funcional. No considerás que tenés un problema. Si el médico pregunta sin juzgar, respondés con honestidad sobre el consumo. Si te juzgan, te cerrás.
INFORMACIÓN: 1 copa al mediodía, 2-3 a la noche, todos los días. Los fines de semana más. Intentaste no tomar un lunes y te sentiste muy ansiosa y con temblor. Tu pareja te hace comentarios pero no les das importancia.
REGLAS: Minimizás. Con trato respetuoso, abrís. Sin trato respetuoso, te cerrás. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── DISLIPEMIAS ───────────────────────────────────────────────────────────────

const DIS_001 = {
  id:"dis-001", topic_id:"dislipemias", topic_label:"Dislipemias",
  parcial:2, difficulty:"normal",
  diagnosis_real:"dislipemia_mixta",
  diagnosis_label:"Dislipemia mixta  -  interpretación y conducta",
  differentials:["Hiperlipidemia secundaria (hipotiroidismo, DM2)","Hipertrigliceridemia familiar","Hipercolesterolemia familiar"],
  patient:{ sex:"M", visual_id:"paciente-masculino-mayor", chief_complaint:"Me salió el colesterol y los triglicéridos altos en el control anual", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulto_cooperativo_sin_info" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 44 años entra al consultorio con los análisis. Los pone sobre el escritorio.",
      "Entra un hombre adulto. Trae los análisis y una lista de preguntas en el celular.",
    ],
    clinical_data:[
      { id:"resultado_lipidos", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Colesterol total 268 mg/dL · LDL 178 mg/dL · HDL 38 mg/dL · Triglicéridos 260 mg/dL. Glucemia 102 mg/dL.", reveal_threshold_trust:0, exam_required:false, keywords:["colesterol","triglicéridos","resultado","análisis","LDL","HDL","número"] },
      { id:"factores_riesgo_dis", category:"Antecedentes", importance:"critical", revealed:false, value:"Sin HTA conocida. No fuma. Sin diabetes. Sedentario. Dieta con muchas grasas saturadas y harinas refinadas. IMC 27.", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","presión","diabetes","actividad","dieta","come","peso"] },
      { id:"antecedentes_familiares_dis", category:"Antecedentes", importance:"important", revealed:false, value:"Hermano mayor con infarto a los 48 años. Padre con colesterol alto.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","hermano","infarto","colesterol","antecedentes"] },
      { id:"sintomas_dis", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Asintomático. Sin dolor de pecho, sin palpitaciones, sin xantomas visibles.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","dolor","pecho","cansancio","xantomas"] },
      { id:"hipotiroidismo_descartado", category:"Antecedentes", importance:"important", revealed:false, value:"Sin antecedentes de hipotiroidismo. Sin cansancio extremo, sin aumento de peso no explicado, sin estreñimiento crónico.", reveal_threshold_trust:0, exam_required:false, keywords:["tiroides","hipotiroidismo","cansancio","frío","constipación"] },
      { id:"examen_dis", category:"Examen físico", importance:"important", revealed:false, value:"IMC 27. TA 130/82. Sin xantomas ni xantelasmas. Sin arco corneal. Sin soplos carotídeos.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","signos_vitales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre adulto con leve sobrepeso. Sin xantomas. Sin xantelasmas. Sin arco corneal.",
      signos_vitales:"TA 130/82 · FC 78 · IMC 27 · Peso 82 kg"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC, peso",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  xantomas / xantelasmas",
        description:"Depósitos lipídicos en piel y tendones",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca y carotídea",
        description:"Soplos, arritmias, soplo carotídeo",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"No indicado en dislipemia sin ACV",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"riesgo_cv_dis", label:"Cálculo de riesgo cardiovascular global (Framingham / Score)", result:"Riesgo cardiovascular a 10 años: 14%  -  riesgo MODERADO-ALTO. Meta de LDL <100 mg/dL.", pertinence:"critical" },
      { id:"tsh_dis", label:"TSH (descartar hipotiroidismo como causa secundaria)", result:"TSH 1.8 mUI/L  -  normal. Descarta hipotiroidismo.", pertinence:"important" },
      { id:"glucemia_hba1c", label:"Glucemia y HbA1c (descartar DM2)", result:"Glucemia 102 mg/dL · HbA1c 5.6%  -  prediabetes leve.", pertinence:"important" },
    ], omitted_critical:["riesgo_cv_dis"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:20, examen_fisico:10, razonamiento:20, diagnostico:5, estudios:10 },
    critical_data_ids:["resultado_lipidos","factores_riesgo_dis","antecedentes_familiares_dis"],
    important_data_ids:["hipotiroidismo_descartado","examen_dis"],
    secondary_data_ids:["sintomas_dis"],
    common_errors:["No calcular el riesgo cardiovascular global (el colesterol no se trata aislado)","No descartar causas secundarias (hipotiroidismo, DM2)","No explorar antecedentes familiares cardiovasculares","No evaluar la dieta y el sedentarismo como causas modificables","Prescribir estatinas sin antes indicar cambios en el estilo de vida en riesgo moderado"]
  },
  patient_persona_prompt:`Sos un hombre de 44 años. Te salió el colesterol y los triglicéridos altos. Viniste a que te expliquen qué significa y qué tenés que hacer.
INFORMACIÓN: Col total 268 · LDL 178 · HDL 38 · TG 260. Tu hermano tuvo un infarto a los 48. Sos sedentario y comés mucha grasa. Sin enfermedades conocidas.
REGLAS: Cooperativo. Hacés preguntas concretas: ¿tengo que tomar pastillas? ¿es peligroso? ¿puedo arreglarlo con la dieta? Máximo 3 oraciones. Español rioplatense.`
};

const DIS_002 = {
  id:"dis-002", topic_id:"dislipemias", topic_label:"Dislipemias",
  parcial:2, difficulty:"normal",
  diagnosis_real:"hipercolesterolemia_ldl_elevado",
  diagnosis_label:"LDL elevado (210 mg/dL) sin otros factores de riesgo  -  interpretación y conducta",
  differentials:["Hipercolesterolemia familiar heterocigota","Hiperlipidemia mixta","Hiperlipidemia secundaria"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Me salió el colesterol muy alto y mi médico me quiere dar estatinas pero yo no quiero tomarlas", context:"Consultorio de medicina general" },
  personality:{ trust_base:55, type:"resistente_al_tratamiento" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 38 años entra al consultorio con cara de estar lista para debatir. 'No quiero tomar pastillas para el colesterol', dice antes de sentarse.",
      "Entra una paciente adulta. Se sienta y saca los análisis. 'Vengo a una segunda opinión'.",
    ],
    clinical_data:[
      { id:"resultado_ldl", category:"Enfermedad actual", importance:"critical", revealed:false, value:"LDL 210 mg/dL · HDL 62 mg/dL · TG 88 mg/dL · Col total 286 mg/dL. Patrón de hipercolesterolemia pura.", reveal_threshold_trust:0, exam_required:false, keywords:["colesterol","LDL","resultado","análisis","número"] },
      { id:"sin_factores_riesgo", category:"Antecedentes", importance:"critical", revealed:false, value:"No fuma. No tiene HTA. No tiene diabetes. No tiene enfermedad cardiovascular conocida. IMC 23. Activa físicamente. 38 años.", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","presión","diabetes","actividad","peso","edad","antecedentes"] },
      { id:"antecedentes_familiares_dis2", category:"Antecedentes", importance:"important", revealed:false, value:"Madre con colesterol alto, sin eventos cardiovasculares. Sin infarto ni ACV en familia.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","madre","padre","hermano","infarto","colesterol","antecedentes"] },
      { id:"resistencia_estatinas", category:"Preocupación", importance:"important", revealed:false, value:"Buscó en internet que las estatinas causan dolor muscular, daño hepático y pérdida de memoria. Tiene miedo a los efectos adversos.", reveal_threshold_trust:40, exam_required:false, keywords:["miedo","pastillas","efectos","secundarios","estatinas","internet","buscó"] },
      { id:"examen_dis2", category:"Examen físico", importance:"important", revealed:false, value:"IMC 23. TA 118/72. Sin xantomas ni xantelasmas. Sin arco corneal. Sin soplos.", reveal_threshold_trust:0, exam_required:true, exam_ids:["inspeccion_general","signos_vitales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer joven en buen estado general. Sin xantomas ni xantelasmas. Sin arco corneal.",
      signos_vitales:"TA 118/72 · FC 72 · IMC 23"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  xantomas / xantelasmas",
        description:"Depósitos lipídicos  -  hipercolesterolemia familiar",
        pertinence:"necessary",
        points:6,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación carotídea",
        description:"Soplos  -  aterosclerosis carotídea",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en dislipemia aislada",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"riesgo_cv_dis2", label:"Cálculo de riesgo cardiovascular global", result:"Riesgo CV a 10 años: 4%  -  riesgo BAJO. Con este riesgo, la meta es LDL <130 mg/dL. Primera línea: cambios en el estilo de vida.", pertinence:"critical" },
      { id:"tsh_dis2", label:"TSH (descartar hipotiroidismo)", result:"TSH 1.6 mUI/L  -  normal.", pertinence:"important" },
    ], omitted_critical:["riesgo_cv_dis2"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:40, examen_fisico:10, razonamiento:15, diagnostico:5, estudios:0 },
    critical_data_ids:["resultado_ldl","sin_factores_riesgo"],
    important_data_ids:["antecedentes_familiares_dis2","resistencia_estatinas","examen_dis2"],
    secondary_data_ids:[],
    common_errors:["Prescribir estatinas sin calcular el riesgo cardiovascular global primero","No explorar las preocupaciones de la paciente sobre los efectos adversos","No explicar que en riesgo bajo la primera línea son cambios en el estilo de vida","No descartar hipercolesterolemia familiar con xantomas ni antecedentes familiares de ECV precoz"]
  },
  patient_persona_prompt:`Sos una mujer de 38 años. Te salió el LDL en 210 y tu médico te quiere dar estatinas. Venís a una segunda opinión porque no querés tomar pastillas.
PERSONALIDAD: Resistente al tratamiento farmacológico. Si el médico calcula el riesgo y explica bien que tu riesgo es bajo, escuchás. Si te dan pastillas sin explicar, te negás.
INFORMACIÓN: LDL 210, sin otros factores de riesgo. Sin enfermedades. IMC 23, activa. Tu mamá tiene colesterol alto pero nunca tuvo un infarto. Buscaste en internet que las estatinas dañan el músculo y el hígado.
REGLAS: Cuestionás las decisiones sin fundamento. Receptiva si el médico explica con datos. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── RIESGO CARDIOVASCULAR GLOBAL ─────────────────────────────────────────────

const RCV_001 = {
  id:"rcv-001", topic_id:"riesgo_cardiovascular", topic_label:"Riesgo cardiovascular",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"riesgo_cardiovascular_alto",
  diagnosis_label:"Riesgo cardiovascular global alto  -  cálculo e intervención",
  differentials:["Riesgo moderado","Riesgo muy alto (ECV establecida)","Riesgo bajo"],
  patient:{ sex:"M", visual_id:"paciente-masculino-mayor", chief_complaint:"Me mandan de un médico a otro y nadie me dice si voy a tener un infarto", context:"Consultorio de medicina general" },
  personality:{ trust_base:60, type:"frustrado_multiderivado" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 55 años entra algo frustrado. 'Ya fui a tres médicos y nadie me junta todo'.",
      "Entra un hombre adulto mayor. Se sienta y saca una carpeta gruesa con análisis y derivaciones.",
    ],
    clinical_data:[
      { id:"factores_riesgo_rcv", category:"Antecedentes", importance:"critical", revealed:false, value:"HTA en tratamiento (enalapril 10mg/día). Fumador 20 cigarrillos/día hace 25 años. Colesterol total 248 mg/dL · LDL 162 · HDL 36 · TG 198. Sin diabetes conocida.", reveal_threshold_trust:0, exam_required:false, keywords:["presión","fuma","colesterol","diabetes","antecedentes","medicación","factores"] },
      { id:"edad_sexo_rcv", category:"Antecedentes", importance:"critical", revealed:false, value:"Hombre de 55 años.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","cuántos años","años","sexo"] },
      { id:"antecedentes_familiares_rcv", category:"Antecedentes", importance:"important", revealed:false, value:"Padre falleció de infarto a los 58 años. Hermano con angioplastia a los 52.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","padre","hermano","infarto","corazón","antecedentes"] },
      { id:"sin_evc_previo", category:"Antecedentes", importance:"important", revealed:false, value:"Sin infarto previo, sin ACV, sin angina conocida. Sin cirugía cardíaca.", reveal_threshold_trust:0, exam_required:false, keywords:["infarto","antes","ACV","angina","corazón","operación"] },
      { id:"examen_rcv", category:"Examen físico", importance:"important", revealed:false, value:"TA 148/92 mmHg (mal controlada). IMC 29. Sin soplos carotídeos. Sin galope. Sin signos de insuficiencia cardíaca.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre adulto con sobrepeso. Sin signos de insuficiencia cardíaca ni ECV establecida.",
      signos_vitales:"TA 148/92 (en tratamiento) · FC 82 · IMC 29 · Peso 90 kg",
      auscultacion_cardiaca:"Ruidos cardíacos rítmicos. Sin soplos. Sin galope."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA ambos brazos, FC, IMC",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección  -  xantomas, arco corneal",
        description:"Marcadores de dislipemia y riesgo CV",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca y carotídea",
        description:"Soplos, ritmo, soplo carotídeo",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Pulsos periféricos y edemas",
        description:"Enfermedad vascular periférica",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico extenso",
        description:"Solo buscar focalidad si hay ACV previo",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"calculo_riesgo_score", label:"Cálculo de riesgo cardiovascular a 10 años (Framingham / Score)", result:"Riesgo CV a 10 años: 28%  -  RIESGO ALTO. Meta LDL <70 mg/dL. Intensificación del tratamiento antihipertensivo. Cesación tabáquica como intervención más eficiente.", pertinence:"critical" },
      { id:"ecg_rcv", label:"ECG de 12 derivaciones", result:"Ritmo sinusal. Signos de hipertrofia ventricular izquierda leve (voltajes aumentados). Sin isquemia.", pertinence:"important" },
      { id:"microalbuminuria_rcv", label:"Microalbuminuria (daño de órgano blanco renal)", result:"Microalbuminuria 52 mg/g creatinina (VN <30)  -  daño renal incipiente.", pertinence:"important" },
    ], omitted_critical:["calculo_riesgo_score"] },
    rubric_weights:{ apertura:5, anamnesis:30, comunicacion:20, examen_fisico:15, razonamiento:20, diagnostico:5, estudios:5 },
    critical_data_ids:["factores_riesgo_rcv","edad_sexo_rcv"],
    important_data_ids:["antecedentes_familiares_rcv","sin_evc_previo","examen_rcv"],
    secondary_data_ids:[],
    common_errors:["Tratar cada factor de riesgo por separado sin calcular el riesgo global","No usar una tabla o calculadora de riesgo cardiovascular","No priorizar la cesación tabáquica como la intervención de mayor impacto","No buscar daño de órgano blanco (HVI, microalbuminuria)","No ajustar metas de LDL según el riesgo calculado"]
  },
  patient_persona_prompt:`Sos un hombre de 55 años. Te mandaron de médico en médico por la presión, el colesterol y el tabaquismo, y nadie te juntó todo ni te dijo cuál es tu riesgo real. Estás frustrado.
INFORMACIÓN: HTA con enalapril. Fumás 20 cigarrillos por día hace 25 años. Colesterol alto. Sin infarto previo. Papá falleció de infarto a los 58. Hermano con angioplastia.
REGLAS: Frustrado pero cooperativo. Querés una respuesta concreta sobre tu riesgo. Si el médico te lo explica en términos claros, te comprometés. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── DOLOR TORÁCICO  -  PERICARDITIS ─────────────────────────────────────────────

const DT_003 = {
  id:"dt-003", topic_id:"dolor_toracico", topic_label:"Dolor torácico",
  parcial:2, difficulty:"normal",
  diagnosis_real:"pericarditis_aguda",
  diagnosis_label:"Pericarditis aguda (dolor pleurítico + mejora al inclinarse + frote pericárdico)",
  differentials:["SCA","TEP","Pleuritis","Costocondritis"],
  patient:{ sex:"M", visual_id:"paciente-masculino", chief_complaint:"Dolor en el pecho que empeora cuando respiro y mejora cuando me inclino para adelante", context:"Guardia de hospital" },
  personality:{ trust_base:70, type:"adulto_cooperativo" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 45 años entra a la guardia. Se sienta inclinado hacia adelante, como apoyando los codos en las rodillas.",
      "Entra un hombre adulto. Camina bien pero con cuidado. Respira superficialmente.",
    ],
    clinical_data:[
      { id:"dolor_pericarditis", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Dolor retroesternal punzante que irradia al hombro izquierdo. Empeora al respirar profundo y al acostarse. Mejora al inclinarse hacia adelante. Desde hace 2 días.", reveal_threshold_trust:0, exam_required:false, keywords:["dolor","cómo es","tipo","respira","acuesta","inclina","hacia adelante","dónde","irradia"] },
      { id:"cuadro_viral_previo", category:"Antecedentes", importance:"critical", revealed:false, value:"Resfriado con fiebre hace 10 días, se recuperó. Ahora tiene febrícula 37.5°C.", reveal_threshold_trust:0, exam_required:false, keywords:["resfriado","gripe","viral","fiebre","antes","enfermedad previa","infección"] },
      { id:"sin_factores_coronarios", category:"Antecedentes", importance:"important", revealed:false, value:"Sin HTA, sin diabetes, sin tabaquismo, sin dislipemia. Sin antecedentes familiares de infarto. 45 años.", reveal_threshold_trust:0, exam_required:false, keywords:["presión","diabetes","fuma","colesterol","familia","infarto","antecedentes"] },
      { id:"frote_pericardico", category:"Examen físico", importance:"critical", revealed:false, value:"Frote pericárdico audible en borde esternal izquierdo, mesosistólico, como 'cuero frotando cuero'. Mejor con el paciente inclinado hacia adelante.", reveal_threshold_trust:0, exam_required:true, exam_ids:["auscultacion_cardiaca","signos_vitales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 124/78 · FC 94 · T° 37.6°C · FR 18 · SatO₂ 98%",
      inspeccion_general:"Hombre adulto, consciente, en posición antiálgica (inclinado hacia adelante).",
      auscultacion_cardiaca:"Frote pericárdico audible en borde esternal izquierdo  -  mesosistólico, independiente de la respiración. Mejora con paciente inclinado adelante.",
      inspeccion_toracica:"Sin dolor palpatorio costal. Sin ingurgitación yugular."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, FR, SatO₂",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca  -  frote pericárdico",
        description:"Frote mesosistólico en borde esternal izquierdo",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Posición antiálgica, disnea, fiebre",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con pericarditis",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Examen de MMII por TVP",
        description:"La pleuritis/pericarditis no es TEP sin otros datos",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecg_pericarditis", label:"ECG de 12 derivaciones", result:"Elevación difusa del ST en múltiples derivaciones (cóncava hacia arriba  -  'en silla de montar'). Depresión del PR. Sin imagen especular. Compatible con pericarditis aguda.", pertinence:"critical" },
      { id:"troponina_pericarditis", label:"Troponina I de alta sensibilidad", result:"Troponina I 0.08 ng/mL  -  leve elevación. Compatible con miopericarditis leve.", pertinence:"important" },
      { id:"eco_pericarditis", label:"Ecocardiograma (descartar derrame pericárdico)", result:"Derrame pericárdico pequeño (5 mm). Sin signos de taponamiento. Función sistólica conservada.", pertinence:"critical" },
    ], omitted_critical:["ecg_pericarditis","eco_pericarditis"] },
    rubric_weights:{ apertura:5, anamnesis:25, examen_fisico:25, razonamiento:20, diagnostico:15, estudios:10 },
    critical_data_ids:["dolor_pericarditis","cuadro_viral_previo","frote_pericardico"],
    important_data_ids:["sin_factores_coronarios"],
    secondary_data_ids:[],
    common_errors:["No preguntar si el dolor mejora al inclinarse hacia adelante","No buscar antecedente de infección viral reciente","No auscultar buscando frote pericárdico","Confundir el ECG de pericarditis con el de SCA (la elevación es cóncava y difusa, sin imagen especular)","No solicitar ecocardiograma para descartar derrame"]
  },
  patient_persona_prompt:`Sos un hombre de 45 años. Tenés dolor en el pecho hace 2 días que empeora al respirar hondo y al acostarte, pero mejora cuando te inclinás para adelante. Hace 10 días tuviste un resfrío.
INFORMACIÓN: Dolor retroesternal punzante, irradia al hombro izquierdo. Empeora acostado y al respirar fondo. Mejora inclinado. Febrícula 37.5°C. Hace 10 días tuviste fiebre y resfrío. Sin antecedentes cardiovasculares.
REGLAS: Cooperativo. Describís bien el dolor si te preguntan en detalle. Máximo 3 oraciones. Español rioplatense.`
};

// ── CÁNCER CERVICOUTERINO  -  CASOS FALTANTES ──────────────────────────────────

const CCU_002 = {
  id:"ccu-002", topic_id:"cancer_cervicouterino", topic_label:"Cáncer cervicouterino",
  parcial:2, difficulty:"facil",
  diagnosis_real:"primera_vez_pap_consejeria",
  diagnosis_label:"Primera vez que realiza PAP  -  consejería y tamizaje",
  differentials:["Paciente ya estudiada","Paciente con VPH conocido","Paciente sin necesidad de tamizaje"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Nunca me hice el PAP y quiero hacérmelo", context:"Consultorio ginecológico / centro de salud" },
  personality:{ trust_base:70, type:"joven_primera_vez" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 28 años entra al consultorio. Se la nota algo nerviosa  -  es la primera vez.",
      "Entra una paciente joven. 'Vine para hacerme el PAP por primera vez, siempre lo fui postergando', dice.",
    ],
    clinical_data:[
      { id:"edad_inicio_sexual", category:"Antecedentes", importance:"critical", revealed:false, value:"Inicio de vida sexual a los 19 años. Actualmente activa sexualmente con una pareja estable.", reveal_threshold_trust:0, exam_required:false, keywords:["relaciones","sexual","vida sexual","pareja","cuándo empezó"] },
      { id:"pap_previo", category:"Antecedentes", importance:"critical", revealed:false, value:"Nunca se hizo un PAP. Lo fue postergando por miedo al procedimiento y porque no le molestaba nada.", reveal_threshold_trust:0, exam_required:false, keywords:["PAP","antes","nunca","cuándo se hizo","postergó"] },
      { id:"vacuna_vph", category:"Antecedentes", importance:"important", revealed:false, value:"Se vacunó contra VPH a los 13 años (esquema completo en la escuela). No sabe exactamente qué vacunas recibió.", reveal_threshold_trust:0, exam_required:false, keywords:["vacuna","VPH","HPV","escuela","vacunó"] },
      { id:"sintomas_gineco_ccu2", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Sin sangrado intermenstrual, sin flujo anormal, sin dolor pélvico. Menstruación regular.", reveal_threshold_trust:0, exam_required:false, keywords:["sangrado","flujo","dolor","síntomas","molestias","regla"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general.",
      signos_vitales:"TA 114/70 · FC 76 · T° 36.5°C"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_ginecologico",
        label:"Examen ginecológico + PAP",
        description:"Primera toma de PAP  -  técnica correcta importa",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ccu_colposcopia_normal.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Cuello uterino",
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal completa",
        description:"No prioritaria en primera toma de PAP sin síntomas",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"pap_ccu2", label:"PAP (citología cervicovaginal)", result:"Pendiente de realización  -  indicado en consulta.", pertinence:"critical" },
      { id:"test_vph_ccu2", label:"Test de VPH de alto riesgo (combinado con PAP en mayores de 30)", result:"Aún no indicado  -  tiene 28 años. Indicar PAP solo. A partir de los 30, co-testeo.", pertinence:"important" },
    ], omitted_critical:["pap_ccu2"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:45, examen_fisico:5, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["pap_previo","edad_inicio_sexual"],
    important_data_ids:["vacuna_vph"],
    secondary_data_ids:["sintomas_gineco_ccu2"],
    common_errors:["No explicar el procedimiento antes de realizarlo (aumenta el miedo)","No preguntar sobre vacunación contra VPH","No explicar la frecuencia del tamizaje (cada 3 años si es normal)","No aclarar que la vacunación NO exime del PAP","Indicar co-testeo con VPH antes de los 30 años (no está indicado)"]
  },
  patient_persona_prompt:`Sos una mujer de 28 años. Nunca te hiciste un PAP y finalmente decidiste venir. Estás un poco nerviosa porque no sabés qué esperar.
INFORMACIÓN: Nunca te hiciste un PAP. Inicio sexual a los 19, pareja estable actualmente. Te vacunaste en la escuela pero no recordás exactamente qué vacunas. Sin síntomas.
REGLAS: Nerviosa por el procedimiento, no por síntomas. Si el médico explica bien qué es el PAP y cómo es el procedimiento, te tranquilizás. Hacés preguntas como ¿duele? ¿para qué sirve? Máximo 3-4 oraciones. Español rioplatense.`
};

const CCU_003 = {
  id:"ccu-003", topic_id:"cancer_cervicouterino", topic_label:"Cáncer cervicouterino",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"vph_positivo_pap_negativo_algoritmo",
  diagnosis_label:"Test VPH positivo + PAP negativo  -  algoritmo combinado de seguimiento",
  differentials:["LSIL no visible en citología","HSIL oculto","Infección VPH transitoria"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"El test del VPH me salió positivo pero el PAP normal, no entiendo qué significa", context:"Consultorio ginecológico" },
  personality:{ trust_base:65, type:"confundida_preocupada" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 50 años entra al consultorio con los resultados en la mano. 'Cómo puede ser positivo y normal al mismo tiempo?', pregunta.",
      "Entra una paciente adulta mayor. Tiene cara de confusión. Trae una hoja con dos resultados contradictorios.",
    ],
    clinical_data:[
      { id:"resultado_cotesting", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Co-testeo a los 50 años: Test VPH de alto riesgo positivo (VPH 31, no genotipo 16 ni 18). PAP citológico: negativo para lesión intraepitelial.", reveal_threshold_trust:0, exam_required:false, keywords:["VPH","PAP","resultado","positivo","negativo","qué dice","análisis"] },
      { id:"pap_previos", category:"Antecedentes", importance:"important", revealed:false, value:"PAPs previos siempre normales, cada 3 años desde los 25. Último hace 3 años: normal.", reveal_threshold_trust:0, exam_required:false, keywords:["PAP anterior","antes","previos","cuándo","normal","historia"] },
      { id:"sintomas_ccu3", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Sin sangrado, sin flujo anormal, sin dolor pélvico.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","sangrado","flujo","dolor","molestias"] },
      { id:"menopausia", category:"Antecedentes", importance:"secondary", revealed:false, value:"Postmenopáusica desde hace 2 años. Sin TRH.", reveal_threshold_trust:0, exam_required:false, keywords:["menopausia","regla","menstruación","postmenopáusica","tratamiento hormonal"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general.",
      signos_vitales:"TA 128/80 · FC 74 · T° 36.6°C"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_ginecologico",
        label:"Examen ginecológico",
        description:"Cuello uterino en contexto de VPH+/PAP-",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/ccu_lesion_hsil.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Lesión cervical",
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"colposcopia_ccu3", label:"Colposcopía (indicada: VPH AR positivo + PAP negativo)", result:"Zona de transformación tipo 2. Sin lesiones acetoblancas visibles. Biopsia no indicada en este momento. Control en 12 meses con co-testeo.", pertinence:"critical" },
    ], omitted_critical:["colposcopia_ccu3"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:45, examen_fisico:5, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["resultado_cotesting"],
    important_data_ids:["pap_previos"],
    secondary_data_ids:["sintomas_ccu3","menopausia"],
    common_errors:["No explicar por qué el VPH puede ser positivo con PAP negativo","Tranquilizar sin derivar a colposcopía (que sí está indicada)","No explicar el algoritmo: VPH AR positivo no 16/18 + PAP negativo = colposcopía","No dar seguimiento claro con plazos","Equiparar VPH positivo con cáncer"]
  },
  patient_persona_prompt:`Sos una mujer de 50 años. Te hiciste el co-testeo (VPH + PAP juntos) y el VPH salió positivo pero el PAP normal. No entendés cómo puede pasar eso y estás preocupada.
INFORMACIÓN: VPH positivo (genotipo 31). PAP negativo. Todos los PAPs anteriores siempre fueron normales. Sin síntomas. Postmenopáusica hace 2 años.
REGLAS: Confundida y algo preocupada. Preguntás: ¿tengo cáncer? ¿cómo puede ser que un sea positivo y el otro negativo? ¿qué hago ahora? Máximo 3-4 oraciones. Español rioplatense.`
};

// ── CÁNCER DE MAMA  -  CASOS FALTANTES ─────────────────────────────────────────

const MAMA_002 = {
  id:"mama-002", topic_id:"cancer_mama", topic_label:"Cáncer de mama",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"birads_4_manejo_derivacion",
  diagnosis_label:"Mamografía BI-RADS 4  -  manejo y derivación para biopsia",
  differentials:["Quiste complicado","Carcinoma invasivo","Fibroadenoma con atipia","Tumor phyllodes"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"La mamografía de control me salió BI-RADS 4 y no sé qué significa", context:"Consultorio de medicina general" },
  personality:{ trust_base:60, type:"asustada_quiere_entender" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 50 años entra con el resultado de la mamografía. Está visiblemente preocupada.",
      "Entra una paciente adulta. Sostiene el papel con el resultado. 'Dice BI-RADS 4, qué es eso?', pregunta antes de sentarse.",
    ],
    clinical_data:[
      { id:"resultado_birads", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Mamografía bilateral: hallazgo en CSE mama derecha  -  opacidad de bordes parcialmente definidos, 1.5 cm. BI-RADS 4B. Riesgo de malignidad 15-30%. Biopsia recomendada.", reveal_threshold_trust:0, exam_required:false, keywords:["resultado","mamografía","BI-RADS","qué dice","informe","hallazgo"] },
      { id:"mammograma_previo", category:"Antecedentes", importance:"important", revealed:false, value:"Mamografía anterior hace 2 años: BI-RADS 2 (normal). Hallazgo nuevo.", reveal_threshold_trust:0, exam_required:false, keywords:["anterior","antes","última","cuándo","previa","normal"] },
      { id:"sin_nódulo_palpable", category:"Síntomas asociados", importance:"important", revealed:false, value:"No palpa ningún bulto. Sin secreción por el pezón. Sin cambios en la piel.", reveal_threshold_trust:0, exam_required:false, keywords:["palpa","bulto","pezón","secreción","piel","siente algo"] },
      { id:"antecedentes_mama2", category:"Antecedentes", importance:"important", revealed:false, value:"Sin antecedentes personales de cáncer. Hermana con cáncer de mama a los 47 años.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","hermana","cáncer","antecedentes","madre","tía"] },
      { id:"examen_mama2", category:"Examen físico", importance:"critical", revealed:false, value:"No se palpa nódulo en mama derecha. Sin adenopatías axilares. Sin cambios en piel ni pezón.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_mamario","palpacion_ganglios"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general. Sin adenopatías supraclaviculares.",
      examen_mamario:"Sin nódulo palpable en mama derecha. Mama izquierda sin hallazgos. Sin retracción ni hoyuelo. Sin adenopatías axilares.",
      palpacion_ganglios:"Sin adenopatías axilares ni supraclaviculares."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario  -  BI-RADS 4",
        description:"Palpación del nódulo, características, adenopatías",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/mama_piel_naranja.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Examen mamario",
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación axilar bilateral",
        description:"Adenopatías axilares  -  estadificación",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación en BI-RADS 4",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecografia_birads4", label:"Ecografía mamaria (complemento a mamografía)", result:"Nódulo sólido hipoecoico 1.4 cm en CSE mama derecha, bordes irregulares. BI-RADS 4C  -  riesgo de malignidad 50-95%. Biopsia core urgente.", pertinence:"critical" },
      { id:"biopsia_core_mama2", label:"Biopsia core guiada por imagen (indicación ante BI-RADS 4)", result:"Pendiente  -  derivar a mastología con carácter urgente.", pertinence:"critical" },
    ], omitted_critical:["ecografia_birads4","biopsia_core_mama2"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:35, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["resultado_birads","examen_mama2"],
    important_data_ids:["mammograma_previo","sin_nódulo_palpable","antecedentes_mama2"],
    secondary_data_ids:[],
    common_errors:["No explicar qué significa BI-RADS 4 en términos de riesgo de malignidad","No derivar a mastología con urgencia","No solicitar ecografía complementaria","Tranquilizar sin derivar porque 'puede ser benigno'","No explorar antecedentes familiares de cáncer de mama"]
  },
  patient_persona_prompt:`Sos una mujer de 50 años. La mamografía de control te salió BI-RADS 4 y no sabés qué significa. Estás muy asustada.
INFORMACIÓN: BI-RADS 4B en mama derecha. La anterior hace 2 años era normal. No palpás nada. Tu hermana tuvo cáncer de mama a los 47.
REGLAS: Asustada. Hacés preguntas: ¿tengo cáncer? ¿qué es BI-RADS 4? ¿qué sigue? Si el médico explica bien y da pasos claros, te tranquilizás. Máximo 3-4 oraciones. Español rioplatense.`
};

const MAMA_003 = {
  id:"mama-003", topic_id:"cancer_mama", topic_label:"Cáncer de mama",
  parcial:2, difficulty:"normal",
  diagnosis_real:"riesgo_aumentado_tamizaje_intensificado",
  diagnosis_label:"Riesgo aumentado de cáncer de mama  -  tamizaje intensificado",
  differentials:["Riesgo promedio  -  tamizaje estándar","BRCA positivo  -  protocolo específico","Riesgo moderado  -  iniciar mamografía precoz"],
  patient:{ sex:"F", visual_id:"paciente-femenino", chief_complaint:"Mi mamá y mi tía tuvieron cáncer de mama, quiero saber cuándo tengo que empezar los estudios", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"proactiva_preventiva" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 38 años entra al consultorio. Parece tranquila y organizada. Viene con información.",
      "Entra una paciente adulta joven. 'Vine a planear el seguimiento por el antecedente familiar', dice.",
    ],
    clinical_data:[
      { id:"antecedentes_mama3", category:"Antecedentes", importance:"critical", revealed:false, value:"Madre con cáncer de mama a los 44 años. Tía materna con cáncer de mama a los 51 años. Sin cáncer de ovario en la familia.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","madre","tía","cáncer","mama","cuándo","edad","ovario"] },
      { id:"edad_paciente_mama3", category:"Antecedentes", importance:"critical", revealed:false, value:"38 años. Sin antecedentes personales de cáncer. Sin biopsias previas. Sin PAP alterados.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","cuántos años","antecedentes personales","cáncer","biopsia"] },
      { id:"brca_test", category:"Antecedentes", importance:"important", revealed:false, value:"No se hizo test de BRCA. No sabe si su madre lo tiene.", reveal_threshold_trust:0, exam_required:false, keywords:["BRCA","test genético","gen","mutación","hizo el test"] },
      { id:"tamizaje_previo", category:"Antecedentes", importance:"important", revealed:false, value:"Nunca se hizo una mamografía. Le dijeron que empezaba a los 40 pero quiere saber si eso aplica a ella.", reveal_threshold_trust:0, exam_required:false, keywords:["mamografía","antes","nunca","cuándo empezar","40 años"] },
      { id:"examen_mama3", category:"Examen físico", importance:"important", revealed:false, value:"Sin nódulos palpables. Sin adenopatías. Sin cambios en piel ni pezón.", reveal_threshold_trust:0, exam_required:true, exam_ids:["examen_mamario","palpacion_ganglios"], keywords:[] },
    ],
    physical_exam:{ findings:{
      examen_mamario:"Sin nódulos. Sin adenopatías. Sin cambios en piel ni pezones.",
      palpacion_ganglios:"Sin adenopatías axilares ni supraclaviculares.",
      signos_vitales:"TA 116/72 · FC 72 · T° 36.5°C"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario preventivo",
        description:"Línea base  -  riesgo aumentado por antecedentes",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_ganglios",
        label:"Palpación axilar y supraclavicular",
        description:"Ganglios linfáticos regionales",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación en control preventivo",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación en esta consulta",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"mamografia_precoz", label:"Mamografía bilateral (iniciar 10 años antes del familiar más joven afectado)", result:"Iniciar a los 34 años  -  es decir, ya. Dado que tiene 38, solicitar mamografía ya.", pertinence:"critical" },
      { id:"rm_mama3", label:"Resonancia magnética mamaria (riesgo aumentado >20%)", result:"Indicada anualmente en riesgo >20%. Complementa a la mamografía.", pertinence:"critical" },
      { id:"derivacion_genetica", label:"Derivación a consejería genética (test BRCA)", result:"Indicada: 2 familiares de primer/segundo grado con Ca de mama, con inicio temprano.", pertinence:"important" },
    ], omitted_critical:["mamografia_precoz","rm_mama3"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:30, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["antecedentes_mama3","edad_paciente_mama3"],
    important_data_ids:["brca_test","tamizaje_previo","examen_mama3"],
    secondary_data_ids:[],
    common_errors:["Decir que el tamizaje empieza a los 40 sin considerar el antecedente familiar","No saber que en riesgo aumentado se inicia 10 años antes del caso más joven","No indicar RM mamaria en riesgo >20%","No derivar a consejería genética para test BRCA","No explorar si hay cáncer de ovario en la familia (BRCA1/2)"]
  },
  patient_persona_prompt:`Sos una mujer de 38 años. Tu mamá y tu tía tuvieron cáncer de mama y querés saber cuándo tenés que empezar los estudios. Venís proactiva con información.
INFORMACIÓN: Madre con cáncer de mama a los 44. Tía materna a los 51. Vos tenés 38, sin cáncer. Nunca te hiciste una mamografía  -  te dijeron que empezaba a los 40 pero querés confirmar.
REGLAS: Proactiva y organizada. Querés un plan concreto. No estás asustada, estás siendo preventiva. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── CÁNCER COLORRECTAL  -  CASO FALTANTE ───────────────────────────────────────

const CCR_002 = {
  id:"ccr-002", topic_id:"cancer_colorrectal", topic_label:"Cáncer colorrectal",
  parcial:2, difficulty:"normal",
  diagnosis_real:"consejeria_tamizaje_ccr",
  diagnosis_label:"Consejería de tamizaje de CCR  -  primera indicación en mujer de 55 años sin síntomas",
  differentials:["Paciente con indicación de colonoscopía directa","Paciente sin indicación de tamizaje","Paciente con SOMF positivo"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Mi médico me dijo que tengo que hacerme un estudio para el cáncer de colon pero no sé cuál", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulta_quiere_entender" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 55 años entra al consultorio. Parece un poco confundida sobre qué estudio le corresponde.",
      "Entra una paciente adulta mayor. 'Me mandaron a hacerme algo para el colon pero hay varios y no sé cuál'.",
    ],
    clinical_data:[
      { id:"edad_indicacion", category:"Antecedentes", importance:"critical", revealed:false, value:"55 años. Sin síntomas. Sin antecedentes familiares de cáncer colorrectal ni pólipos.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","cuántos años","familia","cáncer","colon","antecedentes","síntomas"] },
      { id:"sin_sintomas_ccr2", category:"Síntomas asociados", importance:"important", revealed:false, value:"Sin cambios en el hábito intestinal, sin sangrado, sin dolor abdominal, sin pérdida de peso.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","sangre","cambios","dolor","peso","materia fecal"] },
      { id:"tamizaje_previo_ccr2", category:"Antecedentes", importance:"important", revealed:false, value:"Nunca se hizo tamizaje de CCR. Nunca se hizo una colonoscopía.", reveal_threshold_trust:0, exam_required:false, keywords:["colonoscopía","sangre oculta","antes","nunca","estudio","tamizaje"] },
      { id:"preferencia_paciente", category:"Preocupación", importance:"important", revealed:false, value:"Tiene miedo de la colonoscopía (le contaron que duele y que la preparación es horrible). Preferiría un análisis de sangre o algo más simple.", reveal_threshold_trust:40, exam_required:false, keywords:["miedo","colonoscopía","duele","preparación","otra opción","análisis de sangre"] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer en buen estado general.",
      signos_vitales:"TA 126/78 · FC 74 · T° 36.6°C",
      palpacion_abdomen:"Blando, sin masas, sin dolor, sin hepatoesplenomegalia.",
      tacto_rectal:"Normal. Sin masas. Sin sangre al guante."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Evaluación basal en tamizaje de CCR",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal",
        description:"Parte del tamizaje de CCR en >50 años",
        pertinence:"necessary",
        points:7,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en consejería de CCR",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario",
        description:"Fuera del motivo de consulta",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"somf_ccr2", label:"Sangre oculta en materia fecal inmunoquímica (SOMF-i)  -  primera opción por adherencia", result:"Pendiente de realización. Si positivo: colonoscopía. Si negativo: repetir cada 1-2 años.", pertinence:"critical" },
      { id:"colonoscopia_ccr2", label:"Colonoscopía (alternativa  -  cada 10 años si normal)", result:"Alternativa aceptable. Mayor sensibilidad pero menor adherencia. Ambas opciones son válidas.", pertinence:"important" },
    ], omitted_critical:["somf_ccr2"] },
    rubric_weights:{ apertura:5, anamnesis:20, comunicacion:45, examen_fisico:10, razonamiento:15, diagnostico:5, estudios:0 },
    critical_data_ids:["edad_indicacion","tamizaje_previo_ccr2"],
    important_data_ids:["sin_sintomas_ccr2","preferencia_paciente"],
    secondary_data_ids:[],
    common_errors:["No explorar el miedo a la colonoscopía (barrera frecuente para el tamizaje)","No explicar que la SOMF es una alternativa válida y menos invasiva","No explicar que un resultado negativo en SOMF requiere repetición periódica","No involucrar a la paciente en la decisión del método de tamizaje","No realizar tacto rectal"]
  },
  patient_persona_prompt:`Sos una mujer de 55 años. Tu médico te mandó a hacerte un estudio para el cáncer de colon pero no sabés cuál hacerte. Tenés miedo de la colonoscopía.
INFORMACIÓN: 55 años, sin síntomas, sin antecedentes familiares. Nunca te hiciste tamizaje de CCR. Tenés miedo de la colonoscopía porque te contaron que duele y la preparación es horrible. Preferirías algo más simple.
REGLAS: Querés entender las opciones. Si el médico explica la SOMF como alternativa menos invasiva, te interesás. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── CÁNCER DE PRÓSTATA  -  CASO FALTANTE ───────────────────────────────────────

const CPR_002 = {
  id:"cpr-002", topic_id:"cancer_prostata", topic_label:"Cáncer de próstata",
  parcial:2, difficulty:"normal",
  diagnosis_real:"consejeria_controversias_psa",
  diagnosis_label:"Consejería sobre controversias del tamizaje con PSA  -  toma de decisiones compartida",
  differentials:["PSA indicado","PSA no indicado","Necesita más información antes de decidir"],
  patient:{ sex:"M", visual_id:"paciente-masculino-mayor", chief_complaint:"Leí que el PSA no sirve para nada y que te operan de más, quiero que me expliquen", context:"Consultorio de medicina general" },
  personality:{ trust_base:60, type:"informado_escéptico" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 55 años entra al consultorio. 'Leí una nota en internet que dice que el PSA hace más mal que bien', dice antes de sentarse.",
      "Entra un hombre adulto. 'Vengo a que me expliquen esto del PSA, porque hay versiones para todos los lados'.",
    ],
    clinical_data:[
      { id:"edad_psa", category:"Antecedentes", importance:"critical", revealed:false, value:"55 años. Sin síntomas urinarios. Sin antecedentes familiares de cáncer de próstata.", reveal_threshold_trust:0, exam_required:false, keywords:["edad","cuántos","familia","próstata","cáncer","síntomas","orina"] },
      { id:"preocupacion_psa", category:"Preocupación", importance:"critical", revealed:false, value:"Leyó que el PSA tiene muchos falsos positivos, que lleva a biopsias innecesarias y que muchos cánceres detectados son indolentes y nunca hubieran dado síntomas.", reveal_threshold_trust:0, exam_required:false, keywords:["leyó","internet","falso positivo","biopsia","innecesario","sobrediagnóstico","sobretratamiento"] },
      { id:"sin_sintomas_psa", category:"Síntomas asociados", importance:"secondary", revealed:false, value:"Sin síntomas urinarios. Sin hematuria. Sin dolor.", reveal_threshold_trust:0, exam_required:false, keywords:["síntomas","orina","baño","dolor","sangre"] },
      { id:"tacto_rectal_cpr2", category:"Examen físico", importance:"important", revealed:false, value:"Próstata grado I/IV, consistencia elástica. Sin nódulos. Sin asimetría. Normal.", reveal_threshold_trust:0, exam_required:true, exam_ids:["tacto_rectal"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Hombre adulto en buen estado general.",
      signos_vitales:"TA 128/80 · FC 74 · T° 36.6°C",
      tacto_rectal:"Próstata grado I/IV. Consistencia elástica. Sin nódulos ni asimetría. Normal."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, IMC",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"tacto_rectal",
        label:"Tacto rectal  -  próstata",
        description:"Parte del tamizaje  -  complementa el PSA",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico completo",
        description:"Sin indicación en consejería PSA",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"psa_cpr2", label:"PSA total (si el paciente decide hacerse el test)", result:"Pendiente de decisión compartida. Si PSA <3 ng/mL a los 55 años → bajo riesgo, control en 2 años.", pertinence:"important" },
    ], omitted_critical:[] },
    rubric_weights:{ apertura:5, anamnesis:15, comunicacion:55, examen_fisico:10, razonamiento:10, diagnostico:5, estudios:0 },
    critical_data_ids:["preocupacion_psa"],
    important_data_ids:["edad_psa","tacto_rectal_cpr2"],
    secondary_data_ids:["sin_sintomas_psa"],
    common_errors:["No reconocer que las preocupaciones del paciente son válidas y basadas en evidencia real","No presentar ambos lados de la controversia con datos reales","Imponer el PSA sin involucrar al paciente en la decisión","No explicar las diferencias entre cáncer clínicamente significativo e indolente","No realizar tacto rectal como parte del tamizaje"]
  },
  patient_persona_prompt:`Sos un hombre de 55 años. Leíste que el PSA tiene muchos problemas  -  falsos positivos, biopsias innecesarias, sobrediagnóstico. Venís a que te expliquen si vale la pena hacértelo.
INFORMACIÓN: 55 años, sin síntomas. Sin antecedentes familiares de cáncer de próstata. Leíste sobre las controversias del PSA y tenés dudas bien fundamentadas.
REGLAS: Escéptico pero abierto. Hacés preguntas concretas basadas en lo que leíste. Si el médico presenta la evidencia con honestidad y te deja decidir, te comprometés. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── IMÁGENES II  -  SEGUNDO PARCIAL ────────────────────────────────────────────

const IMG_002 = {
  id:"img-002", topic_id:"imagenes", topic_label:"Diagnóstico por imágenes",
  parcial:2, difficulty:"normal",
  diagnosis_real:"seleccion_metodo_segundo_parcial",
  diagnosis_label:"Selección del método de imagen  -  adulto con dolor abdominal agudo",
  differentials:["Ecografía cuando debería ser TC","TC cuando debería ser RM","Rx cuando no aporta nada"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Dolor en la parte baja del abdomen hace 2 días, vine para saber qué estudio hacerme", context:"Guardia de hospital" },
  personality:{ trust_base:65, type:"adulta_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 35 años entra a la guardia con una mano en el abdomen bajo.",
      "Entra una paciente adulta. Se sienta con cuidado. 'Me duele la panza desde hace 2 días'.",
    ],
    clinical_data:[
      { id:"dolor_abd_img", category:"Enfermedad actual", importance:"critical", revealed:false, value:"Dolor en fosa ilíaca derecha, continuo, moderado (5/10), sin fiebre. Sin náuseas ni vómitos.", reveal_threshold_trust:0, exam_required:false, keywords:["dónde duele","cuándo empezó","tipo de dolor","fiebre","náuseas","cuánto"] },
      { id:"antecedentes_gineco", category:"Antecedentes", importance:"critical", revealed:false, value:"Mujer de 35 años. Última menstruación hace 3 semanas. Sin atraso. Sin relaciones sexuales recientes sin protección. DIU colocado.", reveal_threshold_trust:0, exam_required:false, keywords:["menstruación","regla","embarazo","DIU","anticonceptivo","sexual"] },
      { id:"apendicitis_vs_gineco", category:"Síntomas asociados", importance:"important", revealed:false, value:"Dolor que se inició periumbilical y migró a FID. Sin flujo vaginal. Sin fiebre.", reveal_threshold_trust:0, exam_required:false, keywords:["dónde empezó","migró","umbiligo","fiebre","flujo","vaginal"] },
      { id:"examen_abd_img", category:"Examen físico", importance:"critical", revealed:false, value:"Blumberg positivo en FID. Sin defensa muscular. McBurney doloroso. Psoas negativo. TA 116/74, febril 37.8°C.", reveal_threshold_trust:0, exam_required:true, exam_ids:["palpacion_abdomen","signos_vitales"], keywords:[] },
    ],
    physical_exam:{ findings:{
      inspeccion_general:"Mujer adulta, consciente, con facies de dolor leve-moderado.",
      palpacion_abdomen:"Blumberg positivo en FID. McBurney doloroso. Sin defensa muscular generalizada. Sin Murphy. Sin masas. Psoas negativo. Rovsing positivo.",
      signos_vitales:"TA 116/74 · FC 96 · T° 37.8°C · FR 18"
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, FR",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Blumberg, McBurney, Murphy, defensa muscular",
        pertinence:"necessary",
        points:10,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Facies de dolor, posición antiálgica",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Examen neurológico",
        description:"Sin indicación en dolor abdominal agudo",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con el cuadro",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecografia_abd", label:"Ecografía abdominal y pelviana (primera elección  -  sin radiación, disponible)", result:"Apéndice no visualizado (frecuente). Ovarios normales. Sin líquido libre. Sin otras lesiones.", pertinence:"critical" },
      { id:"tc_abd", label:"TC de abdomen y pelvis con contraste (si ecografía no concluyente)", result:"Apéndice con diámetro 10 mm, pared engrosada, grasa periapendicular con cambios inflamatorios. Compatible con apendicitis aguda.", pertinence:"critical" },
      { id:"hcg_test", label:"Test de embarazo (β-hCG)  -  SIEMPRE en mujer en edad fértil con dolor abdominal", result:"Negativo.", pertinence:"critical" },
    ], omitted_critical:["ecografia_abd","hcg_test"] },
    rubric_weights:{ apertura:5, anamnesis:25, examen_fisico:25, razonamiento:20, diagnostico:10, estudios:15 },
    critical_data_ids:["dolor_abd_img","examen_abd_img","antecedentes_gineco"],
    important_data_ids:["apendicitis_vs_gineco"],
    secondary_data_ids:[],
    common_errors:["No solicitar β-hCG en mujer en edad fértil con dolor abdominal","Solicitar TC directamente sin ecografía previa (primera elección por ausencia de radiación)","No explorar antecedentes ginecológicos en dolor abdominal bajo en mujeres","No examinar el abdomen antes de pedir estudios"]
  },
  patient_persona_prompt:`Sos una mujer de 35 años. Tenés dolor en la parte baja del abdomen derecho hace 2 días. Viniste a la guardia porque el dolor no cede.
INFORMACIÓN: Dolor en la fosa ilíaca derecha, continuo, 5/10. Empezó cerca del ombligo y se fue para la derecha. Sin fiebre importante. Última menstruación hace 3 semanas. Tenés DIU.
REGLAS: Cooperativa. Describís bien el dolor si te preguntan en detalle. Máximo 3 oraciones. Español rioplatense.`
};

// ── CONTROL PERIÓDICO  -  MUJER ─────────────────────────────────────────────────

const CP_002 = {
  id:"cp-002", topic_id:"control_periodico", topic_label:"Control periódico",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"control_periodico_mujer_multiples_factores",
  diagnosis_label:"Control periódico  -  mujer de 60 años con múltiples factores de riesgo",
  differentials:[],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Vine al control anual, tengo varias cosas para preguntarle", context:"Consultorio de medicina general" },
  personality:{ trust_base:70, type:"adulta_mayor_compleja" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 60 años entra al consultorio con una lista escrita en un cuaderno. Se sienta organizada.",
      "Entra una paciente mayor. Trae análisis, una lista de medicamentos y preguntas preparadas.",
    ],
    clinical_data:[
      { id:"antecedentes_cp2", category:"Antecedentes", importance:"critical", revealed:false, value:"HTA conocida (amlodipina 5mg/día). Prediabetes (glucemia 112 mg/dL hace 6 meses). Postmenopáusica desde los 52. Hipotiroidismo tratado (levotiroxina 75mcg). IMC 30.", reveal_threshold_trust:0, exam_required:false, keywords:["enfermedades","antecedentes","medicación","pastillas","tiroides","diabetes","presión","menopausia"] },
      { id:"tamizaje_pendiente", category:"Antecedentes", importance:"critical", revealed:false, value:"Último PAP hace 4 años  -  normal. Nunca se hizo mamografía. Nunca se hizo tamizaje de CCR. Densitometría ósea hace 3 años: osteopenia.", reveal_threshold_trust:0, exam_required:false, keywords:["mamografía","PAP","colon","densitometría","estudios","tamizaje","cuándo fue"] },
      { id:"habitos_cp2", category:"Antecedentes", importance:"important", revealed:false, value:"Ex fumadora (dejó hace 10 años, 15 paquetes-año). Sedentaria. Dieta irregular. Alcohol ocasional (1-2 copas los fines de semana).", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","fumó","actividad","ejercicio","alcohol","dieta","hábitos"] },
      { id:"antecedentes_familiares_cp2", category:"Antecedentes", importance:"important", revealed:false, value:"Madre con cáncer de colon a los 68. Padre con infarto a los 72.", reveal_threshold_trust:0, exam_required:false, keywords:["familia","madre","padre","cáncer","infarto","antecedentes"] },
      { id:"examen_cp2", category:"Examen físico", importance:"important", revealed:false, value:"TA 138/86 (leve descontrol). IMC 30. FC 76. Sin soplos. Sin edemas. Sin adenopatías.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general","palpacion_abdomen"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 138/86 · FC 76 · T° 36.6°C · IMC 30 · Peso 74 kg",
      inspeccion_general:"Mujer adulta mayor con sobrepeso. Sin hallazgos patológicos evidentes.",
      palpacion_abdomen:"Blando, sin masas, sin hepatoesplenomegalia.",
      examen_mamario:"Sin nódulos palpables. Sin adenopatías axilares."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_mamario",
        label:"Examen mamario",
        description:"Control periódico  -  mujer 60 años",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"palpacion_abdomen",
        label:"Palpación abdominal",
        description:"Masas, organomegalias",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_general",
        label:"Inspección general",
        description:"Estado general, xantomas, arco corneal",
        pertinence:"necessary",
        points:2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Fondo de ojo",
        description:"HTA + DM  -  daño de órgano blanco",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/hta_fondo_ojo.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Fondo de ojo",
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin indicación en adulta mayor sin síntomas",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación directa en este control",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"laboratorio_cp2", label:"Laboratorio completo (glucemia, HbA1c, lípidos, TSH, función renal, orina)", result:"Glucemia 116 · HbA1c 5.9% · LDL 142 · HDL 48 · TG 168 · TSH 1.8 (bien controlado) · Creatinina 0.8 · Microalbuminuria 28 mg/g.", pertinence:"critical" },
      { id:"mamografia_cp2", label:"Mamografía bilateral (indicada  -  60 años, nunca realizada)", result:"BI-RADS 2  -  calcificaciones benignas. Sin hallazgos sospechosos. Repetir en 2 años.", pertinence:"critical" },
      { id:"somf_cp2", label:"Sangre oculta en materia fecal (tamizaje CCR  -  con antecedente familiar)", result:"Pendiente de realización.", pertinence:"critical" },
      { id:"densitometria_cp2", label:"Densitometría ósea (control  -  osteopenia previa)", result:"Control: osteopenia leve persistente. T-score cadera -1.5. Sin progresión a osteoporosis.", pertinence:"important" },
    ], omitted_critical:["laboratorio_cp2","mamografia_cp2","somf_cp2"] },
    rubric_weights:{ apertura:5, anamnesis:35, comunicacion:15, examen_fisico:15, razonamiento:15, diagnostico:5, estudios:10 },
    critical_data_ids:["antecedentes_cp2","tamizaje_pendiente"],
    important_data_ids:["habitos_cp2","antecedentes_familiares_cp2","examen_cp2"],
    secondary_data_ids:[],
    common_errors:["No sistematizar la anamnesis preventiva en una paciente con múltiples condiciones","No preguntar por tamizajes pendientes (mamografía, CCR, PAP)","No revisar el esquema de vacunación (neumococo, influenza, herpes zóster en >60)","No calcular el riesgo cardiovascular global con todos los factores","No evaluar densitometría ósea en postmenopáusica con osteopenia previa"]
  },
  patient_persona_prompt:`Sos una mujer de 60 años. Venís al control anual con varios temas para tratar y una lista escrita.
INFORMACIÓN: HTA con amlodipina. Prediabetes. Hipotiroidismo con levotiroxina. Postmenopáusica. IMC 30. Ex fumadora. Osteopenia en la última densitometría. Nunca te hiciste una mamografía ni el estudio para el colon. Último PAP hace 4 años. Tu mamá tuvo cáncer de colon.
REGLAS: Organizada, traés lista de preguntas. Si el médico no pregunta por los tamizajes, los mencionás vos. Cooperativa. Máximo 4 oraciones. Español rioplatense.`
};

// ── DIABETES  -  SEGUIMIENTO ────────────────────────────────────────────────────

const DM_003 = {
  id:"dm-003", topic_id:"diabetes", topic_label:"Diabetes",
  parcial:2, difficulty:"normal",
  diagnosis_real:"dm2_mal_controlada_seguimiento",
  diagnosis_label:"DM2 conocida con HbA1c 9.5%  -  seguimiento y ajuste de tratamiento",
  differentials:["DM1 de inicio tardío (LADA)","DM2 bien controlada","Hiperglucemia por corticoides"],
  patient:{ sex:"M", visual_id:"paciente-masculino-mayor", chief_complaint:"Vengo por la diabetes, me dijeron que los análisis están mal", context:"Consultorio de medicina general" },
  personality:{ trust_base:55, type:"no_adherente_resignado" },
  hidden_state:{
    opening_scene_variants:[
      "Un hombre de unos 60 años entra al consultorio. Se sienta con cara de saber lo que viene.",
      "Entra un paciente mayor. 'Ya sé que está todo mal', dice antes de sentarse.",
    ],
    clinical_data:[
      { id:"dm2_antecedente", category:"Antecedentes", importance:"critical", revealed:false, value:"DM2 diagnosticada hace 8 años. Toma metformina 1g cada 12hs. HbA1c hace 6 meses: 7.8%. Ahora: 9.5%.", reveal_threshold_trust:0, exam_required:false, keywords:["diabetes","cuándo","desde cuándo","medicación","metformina","pastillas","análisis"] },
      { id:"no_adherencia", category:"Antecedentes", importance:"critical", revealed:false, value:"Reconoce que no hizo dieta. Come muchas harinas. Tomó la metformina irregular  -  'a veces me olvidaba'. No hace actividad física.", reveal_threshold_trust:40, exam_required:false, keywords:["dieta","come","actividad","pastilla","toma","olvidaba","adherencia"] },
      { id:"complicaciones_dm3", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Hormigueo en los pies desde hace 3 meses. A veces ve un poco borroso. Sin dolor de pecho. Sin heridas en los pies.", reveal_threshold_trust:0, exam_required:false, keywords:["pies","hormigueo","visión","borroso","complicaciones","síntomas","heridas"] },
      { id:"otros_factores_dm3", category:"Antecedentes", importance:"important", revealed:false, value:"HTA (enalapril 10mg/día). Colesterol 215 mg/dL. Sin infarto ni ACV previos. No fuma.", reveal_threshold_trust:0, exam_required:false, keywords:["presión","colesterol","corazón","ACV","fuma","antecedentes"] },
      { id:"examen_dm3", category:"Examen físico", importance:"critical", revealed:false, value:"TA 144/88 (descontrolada). IMC 31. Pie derecho: sensibilidad disminuida al monofilamento. Reflejos aquileos disminuidos bilaterales. Fondo de ojo: no realizado en el consultorio.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general","examen_neurologico"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA 144/88 · FC 82 · IMC 31 · Peso 88 kg",
      inspeccion_general:"Hombre con obesidad. Sin lesiones en pies al examen visual. Sin edemas.",
      examen_neurologico:"Sensibilidad al monofilamento disminuida en pie derecho. Reflejos aquileos disminuidos bilaterales. Compatible con neuropatía diabética periférica.",
      examen_fondo_ojo:"No realizado  -  derivar a oftalmología."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales",
        description:"TA, FC, T°, IMC",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"miembros_inferiores",
        label:"Examen de pies  -  neuropatía",
        description:"Monofilamento, reflejos aquileos, úlceras",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/dm_pie_diabetico.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Pie diabético",
      },
      {
        id:"examen_reflejo_rojo",
        label:"Fondo de ojo",
        description:"Retinopatía  -  control anual obligatorio",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/dm_retinopatia.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Retinopatía diabética",
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca",
        description:"Riesgo cardiovascular elevado en DM2",
        pertinence:"necessary",
        points:3,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación directa en este caso",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"hba1c_dm3", label:"HbA1c", result:"9.5%  -  muy mal control glucémico. Meta <7% (o <8% según edad y comorbilidades).", pertinence:"critical" },
      { id:"funcion_renal_dm3", label:"Creatinina y microalbuminuria", result:"Creatinina 1.1 mg/dL · TFG 68 mL/min (estadio G2) · Microalbuminuria 85 mg/g  -  nefropatía diabética incipiente.", pertinence:"critical" },
      { id:"derivacion_oftalmo", label:"Derivación a oftalmología (fondo de ojo  -  cada año en DM)", result:"Pendiente  -  no se realizó en más de 2 años.", pertinence:"important" },
    ], omitted_critical:["hba1c_dm3","funcion_renal_dm3"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:20, examen_fisico:25, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["dm2_antecedente","complicaciones_dm3","examen_dm3"],
    important_data_ids:["no_adherencia","otros_factores_dm3"],
    secondary_data_ids:[],
    common_errors:["No preguntar por síntomas de complicaciones (neuropatía, retinopatía, nefropatía)","No examinar los pies con monofilamento","No solicitar microalbuminuria","No derivar a oftalmología para fondo de ojo anual","No abordar la falta de adherencia sin juzgar"]
  },
  patient_persona_prompt:`Sos un hombre de 60 años. Tenés diabetes hace 8 años y los análisis están mal  -  HbA1c 9.5%. Ya sabés que es por la dieta y que a veces olvidabas las pastillas.
PERSONALIDAD: Resignado. Sabés que estás mal controlado. Si el médico no te juzga y te propone un plan concreto, te abrís.
INFORMACIÓN: Metformina irregular. No hiciste dieta. Hormigueo en los pies hace 3 meses. A veces ves borroso. HTA controlada. Sin heridas en los pies.
REGLAS: No negás los problemas, simplemente no los priorizaste. Si el médico pregunta por los pies o la visión, respondés con honestidad. Máximo 3-4 oraciones. Español rioplatense.`
};

// ── HTA  -  URGENCIA HIPERTENSIVA ───────────────────────────────────────────────

const HTA_002 = {
  id:"hta-002", topic_id:"hta", topic_label:"HTA",
  parcial:2, difficulty:"dificil",
  diagnosis_real:"urgencia_hipertensiva",
  diagnosis_label:"Urgencia hipertensiva (TA 190/115 + cefalea, sin daño de órgano blanco agudo)",
  differentials:["Emergencia hipertensiva (con daño de órgano blanco)","HTA crónica descontrolada sin urgencia","Crisis de ansiedad con TA reactiva"],
  patient:{ sex:"F", visual_id:"paciente-femenino-adulta", chief_complaint:"Cefalea muy intensa y la presión en 190, vine a la guardia", context:"Guardia de hospital" },
  personality:{ trust_base:65, type:"asustada_cooperativa" },
  hidden_state:{
    opening_scene_variants:[
      "Una mujer de unos 45 años entra a la guardia con cara de dolor. Se toca la cabeza.",
      "Entra una paciente adulta. Se sienta despacio. 'La presión me la midieron en la farmacia y estaba en 190', dice.",
    ],
    clinical_data:[
      { id:"ta_elevada", category:"Enfermedad actual", importance:"critical", revealed:false, value:"TA en farmacia: 192/116 mmHg hace 1 hora. Cefalea occipital intensa 8/10 desde hace 2 horas.", reveal_threshold_trust:0, exam_required:false, keywords:["presión","cuánto","farmacia","número","cefalea","dolor de cabeza","cuándo"] },
      { id:"sin_dob_agudo", category:"Síntomas asociados", importance:"critical", revealed:false, value:"Sin visión borrosa, sin déficit motor ni sensitivo, sin dolor de pecho, sin disnea, sin confusión. Sin epistaxis activa.", reveal_threshold_trust:0, exam_required:false, keywords:["visión","brazo","fuerza","pecho","respira","confundida","sangra","foco","neurológico"] },
      { id:"antecedente_hta2", category:"Antecedentes", importance:"critical", revealed:false, value:"HTA diagnosticada hace 3 años. Toma losartán 50mg/día. No tomó la medicación en 3 días porque 'se le terminó'.", reveal_threshold_trust:0, exam_required:false, keywords:["antecedentes","presión","medicación","pastilla","losartán","tomó","cuándo"] },
      { id:"factores_hta2", category:"Antecedentes", importance:"important", revealed:false, value:"Tabaquismo 10 cigarrillos/día. Sin diabetes. Sin dislipemia conocida.", reveal_threshold_trust:0, exam_required:false, keywords:["fuma","diabetes","colesterol","antecedentes","factores"] },
      { id:"examen_urgencia_hta", category:"Examen físico", importance:"critical", revealed:false, value:"TA 188/114 mmHg (brazo derecho). TA izquierdo 186/112. FC 96 lpm. Sin focalidad neurológica. Sin ingurgitación yugular. Sin crepitantes. Sin galope.", reveal_threshold_trust:0, exam_required:true, exam_ids:["signos_vitales","inspeccion_general","examen_neurologico"], keywords:[] },
    ],
    physical_exam:{ findings:{
      signos_vitales:"TA der: 188/114 · TA izq: 186/112 · FC 96 · FR 18 · SatO₂ 98% · T° 36.8°C",
      inspeccion_general:"Mujer adulta con facies de dolor. Consciente y orientada. Sin signos de fallo de órgano blanco.",
      examen_neurologico:"Consciente, orientada en tiempo y espacio. Sin déficit motor ni sensitivo. Sin asimetría facial. Lenguaje fluido.",
      auscultacion_cardiaca:"Ruidos rítmicos. Sin soplos. Sin galope.",
      auscultacion_pulmonar:"Sin crepitantes. Sin sibilancias."
    }},
  
    exam_panel:[
      {
        id:"signos_vitales",
        label:"Signos vitales  -  TA ambos brazos",
        description:"TA urgente, FC, T°, saturación",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_neurologico",
        label:"Focalidad neurológica",
        description:"Descartar emergencia hipertensiva con ACV",
        pertinence:"necessary",
        points:8,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"auscultacion_cardiaca",
        label:"Auscultación cardíaca y pulmonar",
        description:"Galope S3, crepitantes  -  emergencia hipertensiva",
        pertinence:"necessary",
        points:5,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"examen_reflejo_rojo",
        label:"Fondo de ojo",
        description:"Papiledema  -  emergencia hipertensiva",
        pertinence:"necessary",
        points:4,
        requires_data:null,
        requires_data_label:null,
        image_url:"images/examen_fisico/hta_fondo_ojo.jpg",
        image_credit:"CDC PHIL (dominio público)  -  Retinopatía hipertensiva",
      },
      {
        id:"examen_caderas",
        label:"Examen de caderas",
        description:"Sin relación con urgencia hipertensiva",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      },
      {
        id:"inspeccion_genital",
        label:"Inspección genital",
        description:"Sin indicación",
        pertinence:"unnecessary",
        points:-2,
        requires_data:null,
        requires_data_label:null,
        image_url:null,
        image_credit:null,
      }
    ],

    studies:{ indicated:[
      { id:"ecg_hta2", label:"ECG de 12 derivaciones (descartar isquemia como emergencia)", result:"Ritmo sinusal. Hipertrofia ventricular izquierda leve. Sin cambios isquémicos agudos.", pertinence:"critical" },
      { id:"laboratorio_hta2", label:"Laboratorio urgente (creatinina, ionograma, hemograma, orina)", result:"Creatinina 0.9 mg/dL (función renal normal) · Ionograma normal · Sin hematuria en orina.", pertinence:"critical" },
    ], omitted_critical:["ecg_hta2","laboratorio_hta2"] },
    rubric_weights:{ apertura:5, anamnesis:25, comunicacion:15, examen_fisico:30, razonamiento:15, diagnostico:5, estudios:5 },
    critical_data_ids:["ta_elevada","sin_dob_agudo","antecedente_hta2","examen_urgencia_hta"],
    important_data_ids:["factores_hta2"],
    secondary_data_ids:[],
    common_errors:["No diferenciar urgencia hipertensiva (sin daño de órgano blanco) de emergencia hipertensiva (con daño)","No evaluar síntomas de daño de órgano blanco (visión, focalidad neurológica, disnea, dolor torácico)","Bajar la TA demasiado rápido en urgencia (meta: 25% en 24hs, no inmediata)","No solicitar ECG y laboratorio básico","No abordar la causa: falta de adherencia al tratamiento"]
  },
  patient_persona_prompt:`Sos una mujer de 45 años. Te mediste la presión en la farmacia porque tenías un dolor de cabeza muy fuerte y salió 192. Viniste asustada a la guardia.
INFORMACIÓN: Cefalea occipital 8/10 hace 2 horas. TA 192/116 en farmacia. Tenés HTA hace 3 años con losartán  -  no tomaste las pastillas en 3 días porque se te terminaron. Sin visión borrosa, sin problemas para hablar o mover los brazos.
REGLAS: Asustada pero cooperativa. Si el médico te tranquiliza y explica la diferencia entre urgencia y emergencia, te aliviás. Máximo 3-4 oraciones. Español rioplatense.`
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRO DE CASOS  -  ÍNDICE COMPLETO
// ═══════════════════════════════════════════════════════════════════════════════
const CASES = {
  // PRIMER PARCIAL  -  Generalidades de tamizaje
  "tam-001": TAM_001,
  "tam-002": TAM_002,
  // PRIMER PARCIAL  -  Ictericia neonatal
  "ictneo-001": ICTNEO_001,
  "ictneo-002": ICTNEO_002,
  "ictneo-003": ICTNEO_003,
  // PRIMER PARCIAL  -  Pesquisa neonatal
  "pesqneo-001": PESQNEO_001,
  // PRIMER PARCIAL  -  DDC
  "ddc-001": DDC_001,
  "ddc-002": DDC_002,
  // PRIMER PARCIAL  -  Hipoacusia
  "hip-001": HIP_001,
  // PRIMER PARCIAL  -  Salud visual
  "vis-001": VIS_001,
  // PRIMER PARCIAL  -  Diagnóstico por imágenes I
  "img-001": IMG_001,
  // PRIMER PARCIAL  -  ITU pediátrica
  "itu-001": ITU_001,
  "itu-002": ITU_002,
  // PRIMER PARCIAL  -  Celiaquía
  "cel-001": CEL_001,
  // PRIMER PARCIAL  -  TEC
  "tec-001": TEC_001,
  "tec-002": TEC_002,
  // SEGUNDO PARCIAL  -  ITS
  "its-001": ITS_001,
  "its-002": ITS_002,
  "its-003": ITS_003,
  "its-004": ITS_004,
  "its-005": ITS_005,
  // SEGUNDO PARCIAL  -  Alcoholismo / Hepatograma
  "alc-001": ALC_001,
  "alc-002": ALC_002,
  "alc-003": ALC_003,
  // SEGUNDO PARCIAL  -  Dislipemias
  "dis-001": DIS_001,
  "dis-002": DIS_002,
  // SEGUNDO PARCIAL  -  Riesgo cardiovascular
  "rcv-001": RCV_001,
  // SEGUNDO PARCIAL  -  Diabetes
  "dm-001": DM_001,
  "dm-002": DM_002,
  "dm-003": DM_003,
  // SEGUNDO PARCIAL  -  HTA
  "hta-001": HTA_001,
  "hta-002": HTA_002,
  // SEGUNDO PARCIAL  -  Dolor torácico
  "dt-001": DT_001,
  "dt-002": DT_002,
  "dt-003": DT_003,
  // SEGUNDO PARCIAL  -  Cáncer cervicouterino
  "ccu-001": CCU_001,
  "ccu-002": CCU_002,
  "ccu-003": CCU_003,
  // SEGUNDO PARCIAL  -  Cáncer de mama
  "mama-001": MAMA_001,
  "mama-002": MAMA_002,
  "mama-003": MAMA_003,
  // SEGUNDO PARCIAL  -  Cáncer colorrectal
  "ccr-001": CCR_001,
  "ccr-002": CCR_002,
  // SEGUNDO PARCIAL  -  Cáncer de próstata
  "cpr-001": CPR_001,
  "cpr-002": CPR_002,
  // SEGUNDO PARCIAL  -  Diagnóstico por imágenes II
  "img-002": IMG_002,
  // SEGUNDO PARCIAL  -  Control periódico
  "cp-001": CP_001,
  "cp-002": CP_002,
};
