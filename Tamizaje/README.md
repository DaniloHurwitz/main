# Simulador de Consulta Clínica
**Tamizaje y Ciencias del Diagnóstico — UNMdP**

## Cómo usar

1. Abrí `index.html` directamente en el navegador (Chrome o Edge recomendados para voz)
2. No requiere Node.js, npm ni ningún build

**Requiere acceso a internet** para:
- Fuente IBM Plex (Google Fonts)
- API de Anthropic (paciente virtual, evaluación, debriefing)

## Estructura de archivos

```
simulador-v2/
├── index.html          ← Punto de entrada. Abrir directamente.
├── styles.css          ← Sistema de diseño completo (variables CSS, paleta)
├── README.md
│
├── data/
│   └── cases.js        ← Todos los casos clínicos. Editar aquí para agregar casos.
│
└── js/
    ├── simulation.js   ← Motor: revelación de datos, trust, keywords
    ├── speech.js       ← Reconocimiento y síntesis de voz (Web Speech API)
    ├── api.js          ← Llamadas a Claude: paciente, evaluador, debriefing
    ├── ui.js           ← Renderizado: transcript, ficha, evaluación
    └── app.js          ← Orquestador: estados, eventos, flujo
```

## Cómo agregar un caso nuevo

1. Abrí `data/cases.js`
2. Copiá la estructura de cualquier caso existente (ej: `ITS_001`)
3. Completá todos los campos (ver formato abajo)
4. Agregalo al objeto `CASES` al final del archivo:

```js
const CASOS = {
  "its-001": ITS_001,
  "its-002": ITS_002,
  "tec-001": TEC_001,
  "mi-caso": MI_CASO,   // ← agregar acá
};
```

## Formato de un caso

```js
const MI_CASO = {
  id: "mi-caso-001",
  topic_id: "diabetes",           // id del tema
  topic_label: "Diabetes",        // etiqueta visible
  parcial: 2,                     // 1 o 2
  difficulty: "normal",           // "facil", "normal", "dificil"
  diagnosis_real: "dm2",
  diagnosis_label: "Diabetes mellitus tipo 2",
  differentials: ["Diabetes tipo 1", "Diabetes MODY"],

  patient: {
    sex: "F",                     // "M" o "F"
    chief_complaint: "Mucho cansancio y sed",
    context: "Consultorio de medicina general"
  },

  personality: {
    trust_base: 60,               // 0-100, qué tan fácil confía
    type: "cooperativa_adulta"
  },

  hidden_state: {
    opening_scene_variants: [
      "Una mujer de mediana edad entra al consultorio...",
      // Agregar 2-3 variantes aleatorias
    ],

    clinical_data: [
      {
        id: "poliuria",
        category: "Enfermedad actual",    // Categoría para la ficha lateral
        importance: "critical",           // "critical", "important", "secondary"
        revealed: false,
        value: "Orina frecuentemente, incluso de noche. Desde hace 3 meses.",
        reveal_threshold_trust: 0,        // 0 = siempre revelable, >0 = requiere confianza
        exam_required: false,
        keywords: ["orina", "baño", "micción", "frecuencia", "poliuria"]
        // Si exam_required: true, agregar:
        // exam_ids: ["signos_vitales"]   // id del examen que lo revela
      },
      // ... más datos
    ],

    physical_exam: {
      findings: {
        signos_vitales: "TA 135/85 mmHg · FC 80 lpm · T° 36.7°C · IMC 29",
        // Agregar un finding por cada examen posible
      }
    },

    studies: {
      indicated: [
        { id: "glucemia", label: "Glucemia en ayunas", result: "126 mg/dL", pertinence: "critical" },
      ],
      omitted_critical: ["glucemia"]
    },

    rubric_weights: {
      apertura: 5, anamnesis: 25, comunicacion: 15,
      examen_fisico: 15, razonamiento: 20, diagnostico: 10, estudios: 10
    },

    critical_data_ids: ["poliuria"],    // IDs de datos críticos
    important_data_ids: [],
    secondary_data_ids: [],
    common_errors: ["No preguntar por poliuria"]
  },

  patient_persona_prompt: `Sos una mujer de 52 años. Consultás por cansancio y mucha sed.
  
PERSONALIDAD: Cooperativa, directa, un poco ansiosa.

INFORMACIÓN: ...

REGLAS: Respondé solo lo que te preguntan. Máximo 3-4 oraciones. Español rioplatense.`
};
```

## Exámenes físicos disponibles

Para revelar datos con `exam_required: true`, usá estos `exam_ids`:

| ID | Se activa cuando el estudiante dice |
|---|---|
| `inspeccion_genital` | "examinar la lesión", "inspeccion genital" |
| `palpacion_ganglios` | "palpar ganglios", "examinar ganglios" |
| `signos_vitales` | "signos vitales", "tomar la presion" |
| `palpacion_abdomen` | "palpar el abdomen", "palpacion abdominal" |
| `evaluacion_glasgow` | "escala de glasgow", "evaluo el glasgow" |
| `examen_pupilas` | "examinar las pupilas", "reflejo fotomotor" |
| `examen_neurologico` | "examen neurologico", "evaluo reflejos" |
| `inspeccion_cabeza` | "examinar la cabeza", "inspecciono la cabeza" |
| `inspeccion_piel` | "examinar el sarpullido", "inspeccion de piel" |
| `orofaringe` | "examinar la garganta", "ver la orofaringe" |

Para agregar un examen nuevo: editá `EXAM_KEYWORDS` en `js/simulation.js`.

## Variables de configuración

En `js/api.js`:
- `MODEL`: modelo de Claude a usar
- `MAX_TOKENS`: longitud máxima de respuesta del paciente

En `js/app.js`:
- `timeLeft = 600`: duración de la consulta en segundos (600 = 10 minutos)
