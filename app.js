/* ══════════════════════════════════════════════════════════════
   DANILO HURWITZ · APP LOGIC
   i18n · Calculator · Theme · Animations · Payment Modal
   ══════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// i18n DICTIONARIES
// ──────────────────────────────────────────────
const DICT = {
  es: {
    'nav-services': 'Servicios',
    'nav-portfolio': 'Portfolio',
    'nav-book': 'Libro',
    'nav-mentoria': 'Mentorías',
    'nav-calc': 'Cotizar',
    'nav-cta-text': 'Contratarme',
    'banner-strong': 'Top Rated Upwork',
    'banner-text': '95% Job Success Score · +$6K generados · Trilingüe HE/EN/ES',
    'nav-logo-role': 'Content Specialist',
    'hero-eyebrow': 'Disponible para proyectos · HE / EN / ES',
    'hero-h1-raw': 'Contenido que no parece barato.',
    'hero-sub': 'Reels, ads comerciales y subtitulación de precisión. Trabajo con clientes Fortune 500 vía ICUC, con ElevenLabs y directo en Upwork desde Mar del Plata.',
    'hero-video-badge': 'Presentación',
    'hero-cta-1': 'Empezar un proyecto',
    'hero-cta-2': 'Ver trabajos',
    'hero-fine': 'Respuesta en < 4 horas · Mar del Plata, Argentina',
    'stat-projects': 'Proyectos completados',
    'stat-jss': 'Job Success Score',
    'stat-hours': 'Horas facturadas',
    'stat-rating': 'Rating promedio',
    'proof-label': 'Clientes y plataformas',
    'proof-projects': 'proyectos',
    'services-label': '01 · Servicios',
    'services-title': 'Un sistema completo de contenido, no una pieza suelta.',
    'services-sub': 'De la edición al copy, del subtítulo a la traducción médica. Todo ejecutado con criterio de agencia y velocidad de freelance top rated.',
    'srv1-label': 'Commercial Ads',
    'srv1-title': 'Ads comerciales que venden, no que decoran.',
    'srv1-p1': 'Edición publicitaria pensada para performance: hook en los primeros 3 segundos, ritmo de corte calibrado a la plataforma y CTAs que empujan al click sin sonar a venta barata.',
    'srv1-p2': 'Formato 16:9 para YouTube y Meta, adaptaciones verticales para Reels/TikTok, y versionados multilingües para campañas globales.',
    'srv2-label': 'Short-Form Social',
    'srv2-title': 'Reels y TikToks optimizados para retención.',
    'srv2-p1': '+30 Reels por mes editados para creadores de +200K seguidores. Hooks visuales, subtítulos dinámicos, pacing calibrado con analytics reales y turnaround de 24-48 horas.',
    'srv2-p2': 'No edito para que se vea lindo: edito para que la gente no scrollee. El algoritmo recompensa retención, y eso empieza en el primer cuadro.',
    'srv3-label': 'Subtitling & Localization',
    'srv3-title': 'Subtitulación y localización trilingüe.',
    'srv3-p1': 'Subtítulos .srt sincronizados con precisión al frame, adaptación cultural real (no traducción literal) y control de registro para audiencias hispanas, inglesas y hebreas.',
    'srv3-p2': 'Especialización extra: traducción médica. Estudiante de medicina activo en UNMdP · terminología clínica con precisión académica.',
    'srv4-label': 'Brand & Ecommerce',
    'srv4-title': 'Contenido para ecommerce y branding.',
    'srv4-p1': 'Videos de producto, storytelling de marca, piezas promocionales para tiendas online y campañas de performance. Experiencia directa con clientes como ICUC · líder global en moderación y gestión de contenido para empresas Fortune 500.',
    'srv4-p2': 'Si tu marca necesita volumen sin perder cadencia estética, este es el flujo que vengo resolviendo hace años.',
    'port-label': '02 · Portfolio',
    'port-title': 'Trabajos reales. Resultados verificables.',
    'port-sub': '17 proyectos completados en Upwork con 5 estrellas recurrentes. Una muestra acotada.',
    'port1-title': 'Highlight Video Project',
    'port2-title': 'Fitness Reel · Social Ad',
    'port3-title': 'Moto Ecommerce',
    'port4-title': 'Brand Presentation',
    'port5-title': 'Hebrew Tutorial Adaptation',
    'port6-title': 'Medical Records Translation',
    'res-label': '03 · Recursos para freelancers',
    'res-title': 'Dos caminos para dejar de regalar tu trabajo.',
    'res-sub': 'Un libro para ordenar tu cabeza y un sistema completo para ejecutarlo. Elegí por dónde arrancar.',
    'res-book-tag': 'LIBRO · USD 19',
    'res-course-tag': 'SISTEMA COMPLETO · PREMIUM',
    'res-course-visual-label': 'Sistema Completo',
    'res-course-title': 'El sistema completo para cobrar en USD desde tu cuarto.',
    'res-course-kicker': 'No es otro curso genérico. Es el método exacto que me llevó a Top Rated en Upwork, con templates, scripts de llamadas, propuestas reales ganadas y soporte directo.',
    'res-c1-raw': '<strong>Módulos en video:</strong> del perfil hasta la primera llamada con cliente enterprise.',
    'res-c2-raw': '<strong>Templates vivos:</strong> propuestas, contratos, facturas y seguimiento que uso hoy.',
    'res-c3-raw': '<strong>Acompañamiento directo:</strong> WhatsApp conmigo para dudas reales durante el recorrido.',
    'res-c4-raw': '<strong>Comunidad:</strong> freelancers hispanos que ya están cobrando afuera.',
    'res-course-price-label': 'Inversión completa',
    'res-course-price-val': 'Ver detalles del sistema',
    'res-course-cta': 'Conocer el sistema',
    'res-course-note': 'Página completa con todos los detalles',
    'book-label': '03 · Libro',
    'book-title': 'De 0 a 1000 USD freelanceando mientras estudiaba medicina.',
    'book-kicker': 'El sistema exacto que usé para pasar de cero experiencia a Top Rated en Upwork, sin renunciar a mi carrera. No es motivación vacía: es el mapa operacional que me hubiera ahorrado 2 años si lo hubiera tenido.',
    'book-b1-raw': '<strong>Posicionamiento real:</strong> cómo elegir un nicho que vende en USD sin ser el más barato.',
    'book-b2-raw': '<strong>Primeras propuestas:</strong> plantillas que usé y que siguen funcionando hoy.',
    'book-b3-raw': '<strong>Retención y escalado:</strong> cómo pasar de proyectos sueltos a contratos recurrentes.',
    'book-b4-raw': '<strong>Todo en paralelo:</strong> sin abandonar la facultad ni funcionar a base de café.',
    'book-price-note': 'PDF · Entrega inmediata · 180 páginas',
    'book-buy': 'Comprar ahora',
    'book-pay': 'MercadoPago · PayPal · Entrega automática al email',
    'bq1': 'El freelance no es sobre trabajar menos. Es sobre trabajar donde tu tiempo vale 20 veces más.',
    'bq1-cap': '· Capítulo 2',
    'bq2': 'Cobrar poco no es humildad. Es la forma más rápida de atraer clientes que te van a hacer perder los fines de semana.',
    'bq2-cap': '· Capítulo 5',
    'bq3': 'Tu primer propuesta no es un texto: es una demostración de que entendiste el problema mejor que el cliente.',
    'bq3-cap': '· Capítulo 4',
    'ment-label': '04 · Mentoría 1:1',
    'ment-title': 'Si el libro te queda corto, trabajamos juntos.',
    'ment-sub': 'Consultoría directa para freelancers en video editing, traducción o crecimiento en Upwork. Sin promesas infladas: revisamos tu perfil, tu estrategia y te doy el mapa exacto que seguiría yo.',
    'mb1-title': 'Freelance desde cero',
    'mb1-desc': 'Posicionamiento, perfil y primeras 10 propuestas con retroalimentación real.',
    'mb2-title': 'Video editing pro',
    'mb2-desc': 'Workflow, entregables, precio y cómo escalar sin quemarte.',
    'mb3-title': 'Traducción HE/EN/ES',
    'mb3-desc': 'Cómo posicionarte en nichos trilingües con tarifas premium.',
    'mb4-title': 'Upwork growth',
    'mb4-desc': 'Del primer contrato al status Top Rated con sistema repetible.',
    'mform-title': 'Pedí tu sesión por WhatsApp',
    'ph-name': 'Nombre',
    'ph-msg': 'Contame dónde estás hoy (1-2 líneas)...',
    'mopt1': 'Freelance desde cero',
    'mopt2': 'Video editing pro',
    'mopt3': 'Traducción HE/EN/ES',
    'mopt4': 'Upwork growth',
    'mform-send': 'Enviar a WhatsApp',
    'test-label': '05 · Testimonios',
    'test-title': 'Lo que dicen los clientes.',
    'testim1-text': '"Fue un verdadero placer trabajar con Danilo. Gran comunicación, entendimiento rápido de los requerimientos y resultados de alta calidad. Totalmente recomendado."',
    'testim1-name': 'Hebrew Tutorial Video Adaptation',
    'testim2-text': '"Otra gran experiencia trabajando con Danilo. Muy profesional, comunicativo y entrega excelentes resultados. ¡Altamente recomendado!"',
    'testim2-name': 'Video Adaptation Project',
    'testim3-text': '"Danilo hizo un gran trabajo. Muy receptivo, creó un video profesional y se aseguró de que todo lo que necesitaba se hiciera perfectamente. Lo recomiendo totalmente."',
    'testim3-name': 'Family Video Editing',
    'calc-label': '06 · Cotización inteligente',
    'calc-title': 'Estimá tu proyecto en 30 segundos.',
    'calc-sub': 'Seleccioná las variables de tu proyecto y obtené un estimado realista en USD.',
    'calc-q1': 'Tipo de proyecto',
    'calc-reel': 'Reel / Short',
    'calc-ad': 'Ad comercial',
    'calc-long': 'Video largo',
    'calc-subs': 'Subtitulado',
    'calc-translation': 'Traducción',
    'calc-copy': 'Copywriting',
    'calc-qty-video': 'Duración',
    'calc-qty-words': 'Cantidad de palabras',
    'calc-qty-hint-video': 'Elegí un preset o ingresá tu duración',
    'calc-qty-hint-words': 'Elegí un preset o ingresá cantidad exacta de palabras',
    'calc-unit-min': 'min',
    'calc-unit-words': 'palabras',
    'calc-per-video': 'estimado total',
    'calc-per-trans': 'estimado total',
    'calc-per-copy': 'estimado total',
    'calc-per-subs': 'estimado total',
    'calc-custom': 'Personalizado',
    'calc-q2': 'Urgencia',
    'calc-normal': 'Normal (5 a 7d)',
    'calc-urgente': 'Urgente (48 a 72h)',
    'calc-express': 'Express (24h)',
    'calc-q3': 'Idiomas del proyecto',
    'calc-lang-es': 'Español',
    'calc-lang-en': 'Inglés',
    'calc-lang-he': 'Hebreo',
    'calc-lang-hint': 'Seleccioná los idiomas que necesita el proyecto',
    'calc-estimate': 'Estimado aproximado',
    'calc-tier-title': 'Rango estándar',
    'calc-tier-desc': 'Para proyectos simples con entrega normal y un solo idioma. Ajustá las variables para afinar el presupuesto.',
    'calc-cta': 'Pedir propuesta formal',
    'final-title': '¿Listo para tu próximo proyecto?',
    'final-desc': 'Respondo en menos de 4 horas. Sin formularios eternos, sin ida y vuelta. Mandame un WhatsApp y arrancamos.',
    'final-cta-1': 'Contratarme ahora',
    'final-cta-2': 'Descargar CV',
    'footer-tagline': 'Trilingual Content Specialist. Video editing, traducción y consultoría desde Mar del Plata, Argentina. Disponible para proyectos internacionales.',
    'footer-h-work': 'Trabajo',
    'footer-h-products': 'Productos',
    'footer-h-connect': 'Contacto',
    'footer-cv': 'CV (PDF) ↗',
    'footer-built': 'BUILT WITH PRECISION · HE/EN/ES',
    'modal-title': 'Elegí cómo pagar',
    'modal-sub': 'De 0 a 1000 USD Freelanceando · entrega automática al email tras confirmar el pago.',
    'pay-mp-desc': 'Tarjeta, efectivo o débito (ARS/USD)',
    'pay-pp-desc': 'Pago internacional en USD',
    'pay-wa': 'Pagar por WhatsApp',
    'pay-wa-desc': 'Coordiná con Danilo directamente',
    'modal-fine': 'Acceso inmediato al PDF tras la confirmación del pago. Soporte directo por WhatsApp.',
    'calc-tier-low': { t: 'Rango inicial', d: 'Proyectos de entrada con necesidades básicas. Ideal para tests y primeras colaboraciones.' },
    'calc-tier-mid': { t: 'Rango estándar', d: 'El sweet spot para la mayoría de proyectos comerciales con calidad profesional garantizada.' },
    'calc-tier-high': { t: 'Rango premium', d: 'Proyectos complejos, multi-idioma o con deadline agresivo. Incluye revisiones ilimitadas y comunicación prioritaria.' },
    'calc-tier-enterprise': { t: 'Rango enterprise', d: 'Producciones corporativas de alto volumen con SLA, NDA y workflow dedicado.' }
  },

  en: {
    'nav-services': 'Services',
    'nav-portfolio': 'Portfolio',
    'nav-book': 'Book',
    'nav-mentoria': 'Mentoring',
    'nav-calc': 'Get Quote',
    'nav-cta-text': 'Hire me',
    'nav-logo-role': 'Content Specialist',
    'banner-strong': 'Top Rated on Upwork',
    'banner-text': '95% Job Success Score · $6K+ earned · Trilingual HE/EN/ES',
    'hero-eyebrow': 'Available for projects · HE / EN / ES',
    'hero-h1-raw': 'Content that does not look cheap.',
    'hero-sub': 'Reels, commercial ads and precision subtitling. I work with Fortune 500 clients via ICUC, with ElevenLabs and directly on Upwork from Mar del Plata.',
    'hero-video-badge': 'Intro',
    'hero-cta-1': 'Start a project',
    'hero-cta-2': 'View work',
    'hero-fine': 'Reply in < 4 hours · Mar del Plata, Argentina',
    'stat-projects': 'Projects completed',
    'stat-jss': 'Job Success Score',
    'stat-hours': 'Billed hours',
    'stat-rating': 'Average rating',
    'proof-label': 'Clients and platforms',
    'proof-projects': 'projects',
    'services-label': '01 · Services',
    'services-title': 'A full content system, not a scattered piece.',
    'services-sub': 'From editing to copy, from subtitles to medical translation. All executed with agency-grade craft and top-rated freelance speed.',
    'srv1-label': 'Commercial Ads',
    'srv1-title': 'Ads that sell, not ones that just look pretty.',
    'srv1-p1': 'Ad editing built for performance: hook in the first 3 seconds, pacing calibrated to the platform, and CTAs that drive clicks without feeling cheap.',
    'srv1-p2': '16:9 format for YouTube and Meta, vertical adaptations for Reels/TikTok, and multilingual versions for global campaigns.',
    'srv2-label': 'Short-Form Social',
    'srv2-title': 'Reels and TikToks optimized for retention.',
    'srv2-p1': '30+ Reels per month edited for creators with 200K+ followers. Visual hooks, dynamic captions, pacing tuned against real analytics, and 24-48 hour turnaround.',
    'srv2-p2': "I don't edit to make it pretty: I edit so people don't scroll. The algorithm rewards retention, and that starts at frame one.",
    'srv3-label': 'Subtitling & Localization',
    'srv3-title': 'Trilingual subtitling and localization.',
    'srv3-p1': 'Frame-accurate .srt subtitles, real cultural adaptation (not literal translation), and register control for Spanish, English, and Hebrew audiences.',
    'srv3-p2': "Extra specialty: medical translation. Active medical student at UNMdP · clinical terminology with academic precision.",
    'srv4-label': 'Brand & Ecommerce',
    'srv4-title': 'Content for ecommerce and branding.',
    'srv4-p1': 'Product videos, brand storytelling, promo pieces for online stores, and performance campaigns. Direct experience with clients like ICUC · global leader in content moderation and management for Fortune 500 companies.',
    'srv4-p2': "If your brand needs volume without losing aesthetic cadence, this is the workflow I've been solving for years.",
    'port-label': '02 · Portfolio',
    'port-title': 'Real work. Verifiable results.',
    'port-sub': '17 projects completed on Upwork with recurring 5-star reviews. A curated sample.',
    'port1-title': 'Highlight Video Project',
    'port2-title': 'Fitness Reel · Social Ad',
    'port3-title': 'Moto Ecommerce',
    'port4-title': 'Brand Presentation',
    'port5-title': 'Hebrew Tutorial Adaptation',
    'port6-title': 'Medical Records Translation',
    'res-label': '03 · Freelancer resources',
    'res-title': 'Two paths to stop giving your work away.',
    'res-sub': 'A book to organize your thinking and a complete system to execute it. Choose where to start.',
    'res-book-tag': 'BOOK · USD 19',
    'res-course-tag': 'FULL SYSTEM · PREMIUM',
    'res-course-visual-label': 'Full System',
    'res-course-title': 'The full system to get paid in USD from your room.',
    'res-course-kicker': 'Not another generic course. The exact method that took me to Top Rated on Upwork, with templates, call scripts, real winning proposals and direct support.',
    'res-c1-raw': '<strong>Video modules:</strong> from profile setup to your first enterprise call.',
    'res-c2-raw': '<strong>Living templates:</strong> proposals, contracts, invoices and follow-up I use today.',
    'res-c3-raw': '<strong>Direct support:</strong> WhatsApp access for real questions along the journey.',
    'res-c4-raw': '<strong>Community:</strong> Spanish-speaking freelancers already earning abroad.',
    'res-course-price-label': 'Full investment',
    'res-course-price-val': 'See system details',
    'res-course-cta': 'Discover the system',
    'res-course-note': 'Full page with all the details',
    'book-label': '03 · Book',
    'book-title': 'From 0 to 1000 USD freelancing while studying medicine.',
    'book-kicker': "The exact system I used to go from zero experience to Top Rated on Upwork without quitting my career. It's not empty motivation: it's the operational map that would have saved me 2 years if I'd had it.",
    'book-b1-raw': '<strong>Real positioning:</strong> how to pick a niche that sells in USD without being the cheapest.',
    'book-b2-raw': '<strong>First proposals:</strong> the templates I used that still work today.',
    'book-b3-raw': '<strong>Retention & scaling:</strong> how to move from one-off gigs to recurring contracts.',
    'book-b4-raw': '<strong>All in parallel:</strong> without dropping out of university or running on coffee.',
    'book-price-note': 'PDF · Instant delivery · 180 pages',
    'book-buy': 'Buy now',
    'book-pay': 'MercadoPago · PayPal · Auto-delivery to your email',
    'bq1': "Freelancing isn't about working less. It's about working where your time is worth 20 times more.",
    'bq1-cap': '· Chapter 2',
    'bq2': 'Charging low isn\'t humility. It\'s the fastest way to attract clients who will make you lose your weekends.',
    'bq2-cap': '· Chapter 5',
    'bq3': 'Your first proposal is not a text: it\'s proof that you understood the problem better than the client did.',
    'bq3-cap': '· Chapter 4',
    'ment-label': '04 · 1:1 Mentoring',
    'ment-title': 'If the book isn\'t enough, we work together.',
    'ment-sub': "Direct consulting for freelancers in video editing, translation, or Upwork growth. No inflated promises: we review your profile, your strategy, and I give you the exact roadmap I would follow.",
    'mb1-title': 'Freelance from scratch',
    'mb1-desc': 'Positioning, profile, and first 10 proposals with real feedback.',
    'mb2-title': 'Pro video editing',
    'mb2-desc': 'Workflow, deliverables, pricing, and how to scale without burning out.',
    'mb3-title': 'HE/EN/ES translation',
    'mb3-desc': 'How to position yourself in trilingual niches with premium rates.',
    'mb4-title': 'Upwork growth',
    'mb4-desc': 'From first contract to Top Rated status with a repeatable system.',
    'mform-title': 'Request your session via WhatsApp',
    'ph-name': 'Name',
    'ph-msg': 'Tell me where you are today (1-2 lines)...',
    'mopt1': 'Freelance from scratch',
    'mopt2': 'Pro video editing',
    'mopt3': 'HE/EN/ES translation',
    'mopt4': 'Upwork growth',
    'mform-send': 'Send to WhatsApp',
    'test-label': '05 · Testimonials',
    'test-title': 'What clients say.',
    'testim1-text': '"It was a real pleasure working with Danilo. Great communication, quick understanding of requirements, and high-quality results. Totally recommended."',
    'testim1-name': 'Hebrew Tutorial Video Adaptation',
    'testim2-text': '"Another great experience working with Danilo. Very professional, communicative, and delivers great results. Highly recommended!"',
    'testim2-name': 'Video Adaptation Project',
    'testim3-text': '"Danilo did great work. Very responsive, created a professional video, and made sure everything I needed was done perfectly. Fully recommend."',
    'testim3-name': 'Family Video Editing',
    'calc-label': '06 · Smart quote',
    'calc-title': 'Estimate your project in 30 seconds.',
    'calc-sub': 'Select your project variables and get a realistic USD estimate.',
    'calc-q1': 'Project type',
    'calc-reel': 'Reel / Short',
    'calc-ad': 'Commercial ad',
    'calc-long': 'Long video',
    'calc-subs': 'Subtitling',
    'calc-translation': 'Translation',
    'calc-copy': 'Copywriting',
    'calc-qty-video': 'Duration',
    'calc-qty-words': 'Word count',
    'calc-qty-hint-video': 'Pick a preset or enter your own duration',
    'calc-qty-hint-words': 'Pick a preset or enter the exact word count',
    'calc-unit-min': 'min',
    'calc-unit-words': 'words',
    'calc-per-video': 'total estimate',
    'calc-per-trans': 'total estimate',
    'calc-per-copy': 'total estimate',
    'calc-per-subs': 'total estimate',
    'calc-custom': 'Custom',
    'calc-q2': 'Urgency',
    'calc-normal': 'Normal (5 to 7d)',
    'calc-urgente': 'Urgent (48 to 72h)',
    'calc-express': 'Express (24h)',
    'calc-q3': 'Project languages',
    'calc-lang-es': 'Spanish',
    'calc-lang-en': 'English',
    'calc-lang-he': 'Hebrew',
    'calc-lang-hint': 'Select the languages your project needs',
    'calc-estimate': 'Approximate estimate',
    'calc-tier-title': 'Standard range',
    'calc-tier-desc': 'For simple projects with normal delivery and a single language. Adjust variables to refine the estimate.',
    'calc-cta': 'Request formal proposal',
    'final-title': 'Ready for your next project?',
    'final-desc': 'I reply in under 4 hours. No endless forms, no back-and-forth. Drop me a WhatsApp and we start.',
    'final-cta-1': 'Hire me now',
    'final-cta-2': 'Download CV',
    'footer-tagline': 'Trilingual Content Specialist. Video editing, translation, and consulting from Mar del Plata, Argentina. Available for international projects.',
    'footer-h-work': 'Work',
    'footer-h-products': 'Products',
    'footer-h-connect': 'Contact',
    'footer-cv': 'CV (PDF) ↗',
    'footer-built': 'BUILT WITH PRECISION · HE/EN/ES',
    'modal-title': 'Choose how to pay',
    'modal-sub': 'From 0 to 1000 USD Freelancing · auto-delivery to your email after payment.',
    'pay-mp-desc': 'Card, cash, or debit (ARS/USD)',
    'pay-pp-desc': 'International payment in USD',
    'pay-wa': 'Pay via WhatsApp',
    'pay-wa-desc': 'Coordinate directly with Danilo',
    'modal-fine': 'Instant PDF access after payment confirmation. Direct WhatsApp support.',
    'calc-tier-low': { t: 'Entry range', d: 'Starter projects with basic needs. Ideal for tests and first collaborations.' },
    'calc-tier-mid': { t: 'Standard range', d: 'The sweet spot for most commercial projects with guaranteed professional quality.' },
    'calc-tier-high': { t: 'Premium range', d: 'Complex projects, multi-language or aggressive deadline. Includes unlimited revisions and priority communication.' },
    'calc-tier-enterprise': { t: 'Enterprise range', d: 'High-volume corporate productions with SLA, NDA, and dedicated workflow.' }
  },

  he: {
    'nav-services': 'שירותים',
    'nav-portfolio': 'תיק עבודות',
    'nav-book': 'ספר',
    'nav-mentoria': 'הדרכה',
    'nav-calc': 'הצעת מחיר',
    'nav-cta-text': 'לשכור אותי',
    'nav-logo-role': 'מומחה תוכן',
    'banner-strong': 'Top Rated ב-Upwork',
    'banner-text': '95% ציון הצלחה · 6K+ דולר · תלת־לשוני HE/EN/ES',
    'hero-eyebrow': 'זמין לפרויקטים · HE / EN / ES',
    'hero-h1-raw': 'תוכן שלא נראה זול.',
    'hero-sub': 'Reels, פרסומות ותרגום מדויק. עובד עם לקוחות Fortune 500 דרך ICUC, עם ElevenLabs וישירות ב-Upwork ממר דל פלטה.',
    'hero-video-badge': 'הצגה',
    'hero-cta-1': 'להתחיל פרויקט',
    'hero-cta-2': 'לצפות בעבודות',
    'hero-fine': 'מענה תוך פחות מ-4 שעות · מר דל פלטה, ארגנטינה',
    'stat-projects': 'פרויקטים שהושלמו',
    'stat-jss': 'ציון הצלחה',
    'stat-hours': 'שעות חיוב',
    'stat-rating': 'דירוג ממוצע',
    'proof-label': 'לקוחות גלובליים סומכים ·',
    'proof-projects': 'פרויקטים',
    'proof-upwork-label': 'מאומת',
    'proof-lang-label': 'שפת אם/שוטף',
    'services-label': '01 · שירותים',
    'services-title': 'מערכת תוכן מלאה, לא חתיכה בודדת.',
    'services-sub': 'מעריכה לקופירייטינג, מכתוביות לתרגום רפואי. הכל מבוצע ברמת סוכנות ובמהירות של פרילנסר Top Rated.',
    'srv1-label': 'פרסומות מסחריות',
    'srv1-title': 'פרסומות שמוכרות, לא שמתפארות.',
    'srv1-p1': 'עריכת פרסומות לביצועים: hook ב-3 שניות ראשונות, קצב חיתוך מכויל לפלטפורמה, ו-CTAs שדוחפים לקליק בלי להישמע זולים.',
    'srv1-p2': 'פורמט 16:9 ל-YouTube ו-Meta, התאמות אנכיות ל-Reels/TikTok, וגרסאות רב־לשוניות לקמפיינים גלובליים.',
    'srv2-label': 'תוכן קצר לרשתות',
    'srv2-title': 'Reels ו-TikToks מותאמים לשמירת קשב.',
    'srv2-p1': '30+ Reels בחודש ליוצרי תוכן עם 200K+ עוקבים. Hooks ויזואליים, כתוביות דינמיות, קצב מכוויל על בסיס אנליטיקה אמיתית, אספקה ב-24-48 שעות.',
    'srv2-p2': 'אני לא עורך שיהיה יפה: אני עורך שלא יעשו scroll. האלגוריתם מתגמל שמירת קשב, וזה מתחיל בפריים הראשון.',
    'srv3-label': 'כתוביות ולוקליזציה',
    'srv3-title': 'כתוביות ולוקליזציה תלת־לשונית.',
    'srv3-p1': 'כתוביות .srt מסונכרנות ברמת פריים, התאמה תרבותית אמיתית (לא תרגום מילולי), ושליטה ברגיסטר לקהל ספרדי, אנגלי ועברי.',
    'srv3-p2': 'התמחות נוספת: תרגום רפואי. סטודנט פעיל לרפואה ב-UNMdP · טרמינולוגיה קלינית בדיוק אקדמי.',
    'srv4-label': 'מותג ומסחר אלקטרוני',
    'srv4-title': 'תוכן למסחר אלקטרוני ולמיתוג.',
    'srv4-p1': 'סרטוני מוצר, סטוריטלינג של מותג, חומרי קידום לחנויות מקוונות וקמפייני ביצועים. ניסיון ישיר עם לקוחות כמו ICUC · מובילה עולמית בניהול תוכן לחברות Fortune 500.',
    'srv4-p2': 'אם המותג שלך צריך ווליום בלי לאבד איכות אסתטית, זה ה-workflow שאני פותר כבר שנים.',
    'port-label': '02 · תיק עבודות',
    'port-title': 'עבודות אמיתיות. תוצאות מאומתות.',
    'port-sub': '17 פרויקטים שהושלמו ב-Upwork עם 5 כוכבים חוזרים. מדגם מצומצם.',
    'port1-title': 'פרויקט Highlight Video',
    'port2-title': 'Reel כושר · פרסומת',
    'port3-title': 'מסחר אלקטרוני אופנועים',
    'port4-title': 'הצגת מותג',
    'port5-title': 'התאמת מדריך בעברית',
    'port6-title': 'תרגום רשומות רפואיות',
    'res-label': '03 · משאבים לפרילנסרים',
    'res-title': 'שני מסלולים להפסיק למכור את הזמן שלך בזול.',
    'res-sub': 'ספר כדי לסדר את הראש ומערכת שלמה כדי לבצע. תבחרו מאיפה להתחיל.',
    'res-book-tag': 'ספר · 19 דולר',
    'res-course-tag': 'מערכת מלאה · פרמיום',
    'res-course-visual-label': 'מערכת מלאה',
    'res-course-title': 'המערכת המלאה לקבל תשלום בדולרים מהחדר שלך.',
    'res-course-kicker': 'לא עוד קורס גנרי. השיטה המדויקת שהביאה אותי ל-Top Rated ב-Upwork, עם תבניות, סקריפטים לשיחות, הצעות זוכות אמיתיות ותמיכה ישירה.',
    'res-c1-raw': '<strong>מודולי וידאו:</strong> מבניית הפרופיל עד השיחה הראשונה עם לקוח ארגוני.',
    'res-c2-raw': '<strong>תבניות חיות:</strong> הצעות, חוזים, חשבוניות ומעקב שאני משתמש בהם היום.',
    'res-c3-raw': '<strong>ליווי ישיר:</strong> גישה ל-WhatsApp לשאלות אמיתיות לאורך הדרך.',
    'res-c4-raw': '<strong>קהילה:</strong> פרילנסרים דוברי ספרדית שכבר מרוויחים בחו"ל.',
    'res-course-price-label': 'השקעה מלאה',
    'res-course-price-val': 'לראות פרטי המערכת',
    'res-course-cta': 'לגלות את המערכת',
    'res-course-note': 'עמוד מלא עם כל הפרטים',
    'book-label': '03 · ספר',
    'book-title': 'מ-0 ל-1000 דולר בפרילנס בזמן לימודי רפואה.',
    'book-kicker': 'המערכת המדויקת שהשתמשתי בה כדי לעבור מאפס ניסיון ל-Top Rated ב-Upwork בלי לוותר על הקריירה שלי. זו לא מוטיבציה ריקה: זו מפה מבצעית שהייתה חוסכת לי שנתיים אם הייתה לי.',
    'book-b1-raw': '<strong>מיצוב אמיתי:</strong> איך לבחור נישה שמוכרת בדולרים בלי להיות הכי זול.',
    'book-b2-raw': '<strong>הצעות ראשונות:</strong> תבניות שהשתמשתי בהן ושעובדות גם היום.',
    'book-b3-raw': '<strong>שימור והתרחבות:</strong> איך לעבור מעבודות נקודתיות לחוזים חוזרים.',
    'book-b4-raw': '<strong>הכל במקביל:</strong> בלי לעזוב את האוניברסיטה ובלי לחיות על קפה.',
    'book-price-note': 'PDF · אספקה מיידית · 180 עמודים',
    'book-buy': 'לקנות עכשיו',
    'book-pay': 'MercadoPago · PayPal · אספקה אוטומטית למייל',
    'bq1': 'פרילנס זה לא לעבוד פחות. זה לעבוד איפה שהזמן שלך שווה פי 20.',
    'bq1-cap': '· פרק 2',
    'bq2': 'לגבות מעט זה לא צניעות. זו הדרך הכי מהירה למשוך לקוחות שיגרמו לך לאבד את סופי השבוע.',
    'bq2-cap': '· פרק 5',
    'bq3': 'ההצעה הראשונה שלך היא לא טקסט: היא הוכחה שהבנת את הבעיה יותר טוב מהלקוח.',
    'bq3-cap': '· פרק 4',
    'ment-label': '04 · הדרכה אישית',
    'ment-title': 'אם הספר לא מספיק, עובדים יחד.',
    'ment-sub': 'ייעוץ ישיר לפרילנסרים בעריכת וידאו, תרגום או צמיחה ב-Upwork. בלי הבטחות מנופחות: בודקים את הפרופיל שלך, את האסטרטגיה שלך, ונותן לך את המפה המדויקת שהייתי הולך בה.',
    'mb1-title': 'פרילנס מאפס',
    'mb1-desc': 'מיצוב, פרופיל, ו-10 הצעות ראשונות עם פידבק אמיתי.',
    'mb2-title': 'עריכת וידאו מקצועית',
    'mb2-desc': 'Workflow, תוצרים, תמחור, ואיך לגדול בלי להישרף.',
    'mb3-title': 'תרגום HE/EN/ES',
    'mb3-desc': 'איך למצב את עצמך בנישות תלת־לשוניות במחירים פרימיום.',
    'mb4-title': 'צמיחה ב-Upwork',
    'mb4-desc': 'מהחוזה הראשון לסטטוס Top Rated עם מערכת חוזרת.',
    'mform-title': 'לבקש את הסשן שלך בוואטסאפ',
    'ph-name': 'שם',
    'ph-msg': 'ספר לי איפה אתה היום (1-2 שורות)...',
    'mopt1': 'פרילנס מאפס',
    'mopt2': 'עריכת וידאו מקצועית',
    'mopt3': 'תרגום HE/EN/ES',
    'mopt4': 'צמיחה ב-Upwork',
    'mform-send': 'לשלוח לוואטסאפ',
    'test-label': '05 · המלצות',
    'test-title': 'מה אומרים הלקוחות.',
    'testim1-text': '"היה תענוג אמיתי לעבוד עם דנילו. תקשורת מעולה, הבנה מהירה של דרישות, ותוצאות באיכות גבוהה. ממליץ בחום."',
    'testim1-name': 'התאמת סרטון הדרכה בעברית',
    'testim2-text': '"עוד חוויה נהדרת בעבודה עם דנילו. מאוד מקצועי, תקשורתי, ומספק תוצאות מעולות. ממליץ מאוד!"',
    'testim2-name': 'פרויקט התאמת וידאו',
    'testim3-text': '"דנילו עשה עבודה מצוינת. מגיב מהר, יצר סרטון מקצועי, ודאג שכל מה שהייתי צריך ייעשה בצורה מושלמת. ממליץ בהחלט."',
    'testim3-name': 'עריכת וידאו משפחתי',
    'calc-label': '06 · הצעת מחיר חכמה',
    'calc-title': 'אומדן הפרויקט שלך ב-30 שניות.',
    'calc-sub': 'בחר את המשתנים של הפרויקט וקבל אומדן ריאלי בדולרים.',
    'calc-q1': 'סוג הפרויקט',
    'calc-reel': 'Reel / Short',
    'calc-ad': 'פרסומת',
    'calc-long': 'וידאו ארוך',
    'calc-subs': 'כתוביות',
    'calc-translation': 'תרגום',
    'calc-copy': 'קופירייטינג',
    'calc-qty-video': 'משך',
    'calc-qty-words': 'כמות מילים',
    'calc-qty-hint-video': 'בחר preset או הכנס משך מותאם',
    'calc-qty-hint-words': 'בחר preset או הכנס כמות מילים מדויקת',
    'calc-unit-min': 'דקות',
    'calc-unit-words': 'מילים',
    'calc-per-video': 'אומדן כולל',
    'calc-per-trans': 'אומדן כולל',
    'calc-per-copy': 'אומדן כולל',
    'calc-per-subs': 'אומדן כולל',
    'calc-custom': 'מותאם אישית',
    'calc-q2': 'דחיפות',
    'calc-normal': 'רגיל (5 עד 7 ימים)',
    'calc-urgente': 'דחוף (48 עד 72 שעות)',
    'calc-express': 'אקספרס (24 שעות)',
    'calc-q3': 'שפות הפרויקט',
    'calc-lang-es': 'ספרדית',
    'calc-lang-en': 'אנגלית',
    'calc-lang-he': 'עברית',
    'calc-lang-hint': 'בחר את השפות שהפרויקט דורש',
    'calc-estimate': 'אומדן משוער',
    'calc-tier-title': 'טווח סטנדרטי',
    'calc-tier-desc': 'לפרויקטים פשוטים עם אספקה רגילה ושפה אחת. התאם את המשתנים לשיפור האומדן.',
    'calc-cta': 'לבקש הצעה רשמית',
    'final-title': 'מוכן לפרויקט הבא שלך?',
    'final-desc': 'עונה בפחות מ-4 שעות. בלי טפסים אינסופיים, בלי הלוך ושוב. שלח לי וואטסאפ ומתחילים.',
    'final-cta-1': 'לשכור אותי עכשיו',
    'final-cta-2': 'הורד קורות חיים',
    'footer-tagline': 'מומחה תוכן תלת־לשוני. עריכת וידאו, תרגום וייעוץ ממר דל פלטה, ארגנטינה. זמין לפרויקטים בינלאומיים.',
    'footer-h-work': 'עבודה',
    'footer-h-products': 'מוצרים',
    'footer-h-connect': 'צור קשר',
    'footer-cv': 'קורות חיים (PDF) ↗',
    'footer-built': 'BUILT WITH PRECISION · HE/EN/ES',
    'modal-title': 'בחר איך לשלם',
    'modal-sub': 'מ-0 ל-1000 דולר בפרילנס · אספקה אוטומטית למייל לאחר אישור התשלום.',
    'pay-mp-desc': 'אשראי, מזומן או דביט (ARS/USD)',
    'pay-pp-desc': 'תשלום בינלאומי בדולרים',
    'pay-wa': 'לשלם בוואטסאפ',
    'pay-wa-desc': 'לתאם ישירות עם דנילו',
    'modal-fine': 'גישה מיידית ל-PDF לאחר אישור התשלום. תמיכה ישירה בוואטסאפ.',
    'calc-tier-low': { t: 'טווח התחלה', d: 'פרויקטים מתחילים עם צרכים בסיסיים. אידיאלי לבדיקות ושיתופי פעולה ראשונים.' },
    'calc-tier-mid': { t: 'טווח סטנדרטי', d: 'נקודת המתיקות לרוב הפרויקטים המסחריים עם איכות מקצועית מובטחת.' },
    'calc-tier-high': { t: 'טווח פרימיום', d: 'פרויקטים מורכבים, רב־לשוניים או עם דדליין אגרסיבי. כולל תיקונים ללא הגבלה ותקשורת מועדפת.' },
    'calc-tier-enterprise': { t: 'טווח Enterprise', d: 'הפקות תאגידיות בנפח גבוה עם SLA, NDA ו-workflow ייעודי.' }
  }
};

// ──────────────────────────────────────────────
// i18n APPLY
// ──────────────────────────────────────────────
let currentLang = 'es';

function applyLang(lang) {
  currentLang = lang;
  const d = DICT[lang];
  if (!d) return;

  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  document.body.classList.toggle('rtl', lang === 'he');

  // Set body font family for Hebrew
  if (lang === 'he') {
    document.body.style.fontFamily = "'Heebo', 'DM Sans', sans-serif";
  } else {
    document.body.style.fontFamily = "'DM Sans', sans-serif";
  }

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (d[key] !== undefined) {
      el.textContent = d[key];
    }
  });

  // Raw HTML-supporting fields (bullets con <strong>)
  const bookBullets = document.querySelectorAll('.res-book .res-bullets li');
  const courseBullets = document.querySelectorAll('.res-course .res-bullets li');
  const rawMap = {
    'hero-h1-raw': document.querySelector('.hero h1'),
  };
  // Book bullets (b1..b4)
  ['book-b1', 'book-b2', 'book-b3', 'book-b4'].forEach((k, i) => {
    if (bookBullets[i]) {
      const rawKey = k + '-raw';
      if (d[rawKey]) bookBullets[i].innerHTML = d[rawKey];
      else if (d[k]) bookBullets[i].innerHTML = d[k];
    }
  });
  // Course bullets (c1..c4)
  ['res-c1', 'res-c2', 'res-c3', 'res-c4'].forEach((k, i) => {
    if (courseBullets[i]) {
      const rawKey = k + '-raw';
      if (d[rawKey]) courseBullets[i].innerHTML = d[rawKey];
      else if (d[k]) courseBullets[i].innerHTML = d[k];
    }
  });
  Object.entries(rawMap).forEach(([key, el]) => {
    if (el && d[key]) el.innerHTML = d[key];
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (d[key]) el.placeholder = d[key];
  });

  // Active lang button
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Save preference
  try { localStorage.setItem('dh-lang', lang); } catch(e) {}

  // Recompute calculator (refresh labels of unit/hint)
  if (typeof updateCalcQtyUI === 'function') updateCalcQtyUI();
  computeCalc();
}

// Auto-detect language
function detectLang() {
  try {
    const saved = localStorage.getItem('dh-lang');
    if (saved && DICT[saved]) return saved;
  } catch(e) {}
  const nav = (navigator.language || 'es').toLowerCase();
  if (nav.startsWith('he') || nav.startsWith('iw')) return 'he';
  if (nav.startsWith('en')) return 'en';
  return 'es';
}

// ──────────────────────────────────────────────
// THEME TOGGLE
// ──────────────────────────────────────────────
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  try { localStorage.setItem('dh-theme', theme); } catch(e) {}
  const icon = document.querySelector('#themeToggle svg');
  if (theme === 'dark') {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  } else {
    icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
  }
}

function detectTheme() {
  try {
    const saved = localStorage.getItem('dh-theme');
    if (saved) return saved;
  } catch(e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// CALCULATOR LOGIC (v4 · presets + input libre + idiomas multi, sin cliente)
// ──────────────────────────────────────────────
// Calibración con precios reales del usuario:
//   · Reel 1min normal = ~20 USD  →  base 20/min
//   · Reel 1min urgente = ~25 USD →  multiplicador urgente 1.25
//   · Subtítulos 1min sin apuro = 4 USD/min
const calcState = {
  tipo: 'reel',
  qty: 1,
  urg: 'normal',
  langs: ['es']  // multi-select: ['es', 'en', 'he']
};

// Configuración por tipo de proyecto
// basePerUnit: USD por unidad · unit: 'min' | 'words' (words = cada 100 palabras)
// presets: valores rápidos del usuario · defaultQty: valor inicial
const TIPO_CONFIG = {
  reel:        { basePerUnit: 20, minProject: 18, unit: 'min',   defaultQty: 1,  presets: [1, 2, 3, 5] },
  ad:          { basePerUnit: 60, minProject: 60, unit: 'min',   defaultQty: 1,  presets: [1, 2, 3, 5] },
  long:        { basePerUnit: 30, minProject: 80, unit: 'min',   defaultQty: 10, presets: [5, 10, 20, 30] },
  subs:        { basePerUnit: 4,  minProject: 8,  unit: 'min',   defaultQty: 5,  presets: [2, 5, 10, 20] },
  translation: { basePerUnit: 10, minProject: 12, unit: 'words', defaultQty: 5,  presets: [2, 5, 10, 20] },
  copy:        { basePerUnit: 15, minProject: 20, unit: 'words', defaultQty: 3,  presets: [1, 3, 5, 10] }
};

// Multiplicador por urgencia
const URG = { normal: 1, urgente: 1.25, express: 1.6 };

// Multiplicador por cantidad de idiomas (cada idioma extra suma 40%)
// 1 idioma = 1, 2 idiomas = 1.4, 3 idiomas = 1.8
function langsMultiplier(langs) {
  const n = langs.length || 1;
  return 1 + (n - 1) * 0.4;
}

function formatUSD(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatQty(qty, unit) {
  if (unit === 'words') return Math.round(qty * 100);
  return Number.isInteger(qty) ? qty.toString() : qty.toString();
}

function updateCalcQtyUI() {
  const cfg = TIPO_CONFIG[calcState.tipo];
  const qtyNum = document.getElementById('calcQtyNum');
  const qtyUnit = document.getElementById('calcQtyUnit');
  const qtyInputUnit = document.getElementById('calcQtyInputUnit');
  const qtyLabel = document.getElementById('calcQtyLabel');
  const qtyHint = document.getElementById('calcQtyHint');
  const perUnit = document.getElementById('calcPerUnit');
  const qtyInput = document.getElementById('calcQtyInput');
  const presetsWrap = document.getElementById('calcPresets');

  if (calcState.qty < 1) calcState.qty = cfg.defaultQty;

  // Update presets buttons según tipo
  if (presetsWrap) {
    const presetBtns = presetsWrap.querySelectorAll('.calc-preset:not(#calcPresetCustom)');
    cfg.presets.forEach((val, i) => {
      if (presetBtns[i]) {
        presetBtns[i].dataset.preset = val;
        const unitLabel = cfg.unit === 'words' ? 'x100' : '';
        presetBtns[i].textContent = cfg.unit === 'words' ? `${val * 100}` : `${val}`;
      }
    });
    // Activar el preset que matchee con qty actual, o "Personalizado"
    presetBtns.forEach(b => b.classList.remove('active'));
    const customBtn = document.getElementById('calcPresetCustom');
    if (customBtn) customBtn.classList.remove('active');
    const matched = Array.from(presetBtns).find(b => parseFloat(b.dataset.preset) === calcState.qty);
    if (matched) matched.classList.add('active');
    else if (customBtn) customBtn.classList.add('active');
  }

  // Update textos
  if (qtyNum) qtyNum.textContent = formatQty(calcState.qty, cfg.unit);

  const unitKey = cfg.unit === 'words' ? 'calc-unit-words' : 'calc-unit-min';
  const unitText = DICT[currentLang][unitKey] || (cfg.unit === 'words' ? 'palabras' : 'min');
  if (qtyUnit) qtyUnit.textContent = unitText;
  if (qtyInputUnit) qtyInputUnit.textContent = unitText;

  const labelKey = cfg.unit === 'words' ? 'calc-qty-words' : 'calc-qty-video';
  const hintKey = cfg.unit === 'words' ? 'calc-qty-hint-words' : 'calc-qty-hint-video';
  if (qtyLabel) qtyLabel.textContent = DICT[currentLang][labelKey] || qtyLabel.textContent;
  if (qtyHint) qtyHint.textContent = DICT[currentLang][hintKey] || qtyHint.textContent;

  const perKey = cfg.unit === 'words'
    ? (calcState.tipo === 'translation' ? 'calc-per-trans' : 'calc-per-copy')
    : (calcState.tipo === 'subs' ? 'calc-per-subs' : 'calc-per-video');
  if (perUnit) perUnit.textContent = DICT[currentLang][perKey] || 'estimado total';

  // Input numérico valor
  if (qtyInput) {
    qtyInput.value = cfg.unit === 'words' ? (calcState.qty * 100) : calcState.qty;
    qtyInput.min = cfg.unit === 'words' ? 100 : 1;
    qtyInput.max = cfg.unit === 'words' ? 50000 : 180;
    qtyInput.step = cfg.unit === 'words' ? 50 : 1;
  }
}

function computeCalc() {
  const cfg = TIPO_CONFIG[calcState.tipo];

  // Precio base × cantidad
  let price = cfg.basePerUnit * calcState.qty;

  // Multiplicadores
  price *= URG[calcState.urg];
  price *= langsMultiplier(calcState.langs);

  // Piso mínimo
  price = Math.max(price, cfg.minProject);

  // Redondeo comercial
  let rounded;
  if (price < 100) rounded = Math.round(price / 5) * 5;
  else if (price < 500) rounded = Math.round(price / 10) * 10;
  else rounded = Math.round(price / 25) * 25;

  const rangeEl = document.getElementById('calcRange');
  if (rangeEl) rangeEl.textContent = formatUSD(rounded);

  // Tier
  let tierKey = 'calc-tier-mid';
  if (rounded >= 400) tierKey = 'calc-tier-high';
  else if (rounded <= 30) tierKey = 'calc-tier-low';

  const info = DICT[currentLang][tierKey];
  if (info) {
    const infoEl = document.getElementById('calcInfo');
    if (infoEl) infoEl.innerHTML = `<strong>${info.t}</strong><span>${info.d}</span>`;
  }

  // WhatsApp context
  const tipoLabel = DICT[currentLang][`calc-${calcState.tipo}`] || calcState.tipo;
  const urgLabel = DICT[currentLang][`calc-${calcState.urg}`] || calcState.urg;
  const qtyStr = cfg.unit === 'words' ? `${Math.round(calcState.qty * 100)} palabras` : `${calcState.qty} min`;
  const langNames = { es: 'Español', en: 'Inglés', he: 'Hebreo' };
  const langsStr = calcState.langs.map(l => langNames[l]).join(', ');
  const msg = encodeURIComponent(
    `Hola Danilo, quiero cotizar un proyecto:\n· Tipo: ${tipoLabel}\n· Tamaño: ${qtyStr}\n· Urgencia: ${urgLabel}\n· Idiomas: ${langsStr}\n· Estimado: ${formatUSD(rounded)} USD`
  );
  const cta = document.getElementById('calcCtaBtn');
  if (cta) cta.href = `https://wa.me/5492302219422?text=${msg}`;
}

// ──────────────────────────────────────────────
// MENTORÍA FORM → WHATSAPP
// ──────────────────────────────────────────────
function sendMentoriaMsg() {
  const nombre = (document.getElementById('mentNombre').value || '').trim();
  const tema = document.getElementById('mentTema').value;
  const msg = (document.getElementById('mentMsg').value || '').trim();

  if (!nombre) {
    showToast('err', 'Falta tu nombre');
    return;
  }

  const text = encodeURIComponent(
    `Hola Danilo! Soy ${nombre}.\n\nMe interesa una mentoría sobre: ${tema}\n\n${msg || 'Quisiera coordinar una sesión.'}`
  );
  window.open(`https://wa.me/5492302219422?text=${text}`, '_blank');
}

// ──────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────
function showToast(type, msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ──────────────────────────────────────────────
// PAYMENT MODAL
// ──────────────────────────────────────────────
function openPayModal() {
  document.getElementById('payModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePayModal() {
  document.getElementById('payModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ──────────────────────────────────────────────
// CUSTOM CURSOR
// ──────────────────────────────────────────────
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) {
    document.getElementById('cursorDot')?.remove();
    document.getElementById('cursorRing')?.remove();
    return;
  }

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  function animate() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, .p-item, .service-media, .book-mockup-stage').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ──────────────────────────────────────────────
// REVEAL ON SCROLL
// ──────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('shown');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ──────────────────────────────────────────────
// BOOK 3D PARALLAX
// ──────────────────────────────────────────────
function initBookParallax() {
  const stage = document.querySelector('.book-mockup-stage');
  const book = document.getElementById('book3d');
  if (!stage || !book) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const ry = -14 - x * 14;
    const rx = 4 - y * 6;
    book.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
    book.style.animation = 'none';
  });
  stage.addEventListener('mouseleave', () => {
    book.style.transform = '';
    book.style.animation = '';
  });
}

// ──────────────────────────────────────────────
// MOBILE MENU
// ──────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('mobile-open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('mobile-open');
    });
  });
}

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Language
  applyLang(detectLang());

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  // Theme
  applyTheme(detectTheme());
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const newT = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newT);
  });

  // Calculator: tipo/urgencia options
  document.querySelectorAll('.calc-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const val = btn.dataset.val;
      calcState[field] = val;
      // Update UI
      document.querySelectorAll(`.calc-opt[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (field === 'tipo') {
        const cfg = TIPO_CONFIG[val];
        calcState.qty = cfg.defaultQty;
        updateCalcQtyUI();
      }
      computeCalc();
    });
  });

  // Calculator: presets
  document.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'calcPresetCustom') {
        // Focus on custom input
        const customInput = document.getElementById('calcQtyInput');
        if (customInput) {
          customInput.focus();
          customInput.select();
        }
        document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        return;
      }
      calcState.qty = parseFloat(btn.dataset.preset);
      document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCalcQtyUI();
      computeCalc();
    });
  });

  // Calculator: custom input numérico
  const calcQtyInput = document.getElementById('calcQtyInput');
  if (calcQtyInput) {
    calcQtyInput.addEventListener('input', (e) => {
      const cfg = TIPO_CONFIG[calcState.tipo];
      let val = parseFloat(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      // Si es words, el input muestra palabras enteras · internamente /100
      calcState.qty = cfg.unit === 'words' ? (val / 100) : val;
      // Activar "Personalizado"
      document.querySelectorAll('.calc-preset').forEach(b => b.classList.remove('active'));
      document.getElementById('calcPresetCustom')?.classList.add('active');
      // Update qty display pero no re-set input
      const qtyNum = document.getElementById('calcQtyNum');
      if (qtyNum) qtyNum.textContent = formatQty(calcState.qty, cfg.unit);
      computeCalc();
    });
  }

  // Calculator: idiomas multi-select
  document.querySelectorAll('.calc-lang').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      const idx = calcState.langs.indexOf(lang);
      if (idx >= 0) {
        // Deseleccionar · pero nunca dejar vacío
        if (calcState.langs.length > 1) {
          calcState.langs.splice(idx, 1);
          btn.classList.remove('active');
        }
      } else {
        calcState.langs.push(lang);
        btn.classList.add('active');
      }
      computeCalc();
    });
  });

  updateCalcQtyUI();
  computeCalc();

  // Re-run UI refresh when language changes (already triggered by applyLang hook below)
  // Mentoría form removed in v2 · nothing to wire up
  document.getElementById('mentSend')?.addEventListener('click', sendMentoriaMsg);

  // Book buy
  document.getElementById('buyBookBtn')?.addEventListener('click', openPayModal);
  document.getElementById('modalClose')?.addEventListener('click', closePayModal);
  document.getElementById('payModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'payModal') closePayModal();
  });

  // Payment methods (placeholders · replace with real URLs when MP/PP accounts ready)
  document.getElementById('payMP')?.addEventListener('click', () => {
    // Replace with actual MercadoPago checkout URL:
    const mpURL = 'https://link.mercadopago.com.ar/danilohurwitz'; // placeholder
    window.open(mpURL, '_blank');
    showToast('ok', 'Abriendo MercadoPago...');
  });
  document.getElementById('payPP')?.addEventListener('click', () => {
    // Replace with actual PayPal.me URL:
    const ppURL = 'https://paypal.me/danilohurwitz/19'; // placeholder
    window.open(ppURL, '_blank');
    showToast('ok', 'Abriendo PayPal...');
  });
  document.getElementById('payWA')?.addEventListener('click', () => {
    const msg = encodeURIComponent('Hola Danilo, quiero comprar el libro "De 0 a 1000 USD Freelanceando". ¿Cómo coordinamos el pago?');
    window.open(`https://wa.me/5492302219422?text=${msg}`, '_blank');
    closePayModal();
  });

  // Animations
  initReveal();
  initCursor();
  initBookParallax();
  initMobileMenu();
});
