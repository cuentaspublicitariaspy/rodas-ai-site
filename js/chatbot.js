(function () {
  const STORAGE_KEY = 'rp_chat_history';
  const LAST_VISIT_KEY = 'rp_last_visit';

  // ─── OpenAI config (lee js/config.local.js si existe) ───
  let AI_ENABLED = false;
  if (typeof RAI_OPENAI_KEY !== 'undefined' && RAI_OPENAI_KEY && RAI_OPENAI_KEY.startsWith('sk-')) {
    AI_ENABLED = true;
  }

  // ─── System prompt con toda la identidad de Rodas AI ───
  const SYSTEM_PROMPT = `Eres el asistente virtual oficial de Rodas AI, una firma de arquitectura de marcas digitales e inteligencia artificial high-ticket.

IDENTIDAD DE MARCA:
- Nombre: Rodas AI (NO "Rodas Producciones")
- CEO: Rolando Rodas
- Filosofía: "No vendemos inteligencia artificial. Diseñamos sistemas inteligentes de comunicación para empresas. La IA es la herramienta. La comunicación es el producto."
- Anti-gurú: No prometes fórmulas mágicas. Vendes transformación digital real, modernización y reducción de costos operativos.
- Regla de oro: Nunca menciones nombres de softwares (como ChatGPT, ElevenLabs, HeyGen, Suno). Siempre di "Nuestra tecnología de Inteligencia Artificial".
- Regla de precios: Nunca des precios exactos en el chat. Responde que cada proyecto es único y requiere una cotización personalizada. Deriva a WhatsApp.

SERVICIOS - Pilar A (Tecnología y Automatización):
1. Desarrollo Web Institucional: Sitios web premium con hosting, dominio y redacción con IA.
2. Agente de Ventas Híbrido + Mini-CRM para WhatsApp: Chatbot con IA que entiende audios y texto, entrenable en 5 min, con intervención humana.
3. Avatar Digital Corporativo: Embajador digital hiperrealista, multiformato, 30 outfits, 24/7.

SERVICIOS - Pilar B (Producción Audiovisual e Identidad Sonora):
4. Voice Design Premium: Clonación de voz hiperrealista con masterización de estudio.
5. Locución Profesional y Doblaje: 70+ idiomas, incluyendo guaraní.
6. Jingle Publicitario: Música 100% original con músicos sesionistas.
7. Videocomerciales con IA: Grabación in situ + postproducción con IA.
8. Servicios Musicales y de Estudio: Arreglos orquestales, partituras, asesoría legal (APA, AIE, SGP).

CONTACTO:
- WhatsApp: +595986467299
- Email: info@rodasproducciones.com
- Dirección: De las cordilleras 131 c/ Independencia Nacional
- Redes: @rodasproduccionespy (Facebook, Instagram, TikTok, YouTube)

PERSONALIDAD DE LA MARCA:
- Inteligente, clara, confiable, precisa, elegante, profesional
- Exclusiva, serena, con autoridad
- Inspirada en: arquitectura contemporánea, oficinas premium, Apple, McKinsey, Porsche
- NUNCA uses lenguaje de startup, gamer, ciencia ficción o cyberpunk
- NUNCA hables de robots, cerebros, circuitos u hologramas
- El sitio se siente como una consultora internacional de primer nivel

IMPORTANTE:
- Responde SIEMPRE en español (a menos que el usuario hable otro idioma)
- Mantén un tono profesional pero cálido
- Usa el historial de la conversación para dar respuestas contextuales
- Si no sabes algo, deriva amablemente al WhatsApp del CEO
- Recuerda TODO lo que se ha hablado en la conversación`;

  // Knowledge base
  const KB = {
    greeting: [
      'Bienvenido a Rodas AI. Soy su asistente virtual. Puedo brindarle información sobre nuestros sistemas inteligentes de comunicación, servicios o agendar una reunión con nuestro equipo. ¿En qué puedo ayudarle?',
    ],
    fallback: [
      'Gracias por tu consulta. Para darte una respuesta más precisa, ¿podrías contarme un poco más sobre tu proyecto o negocio?',
      'Entiendo. Permíteme consultar con nuestro equipo para darte la mejor solución. Mientras tanto, ¿hay algo más que quieras saber?',
      'Excelente pregunta. En Rodas Producciones ofrecemos soluciones personalizadas. ¿Te gustaría que te explique más sobre algún servicio en específico?',
    ],
    keywords: {
      'desarrollo web': [
        'Nuestro servicio de **Desarrollo Web Institucional** crea sucursales virtuales de alta calidad. Incluye diseño premium, redacción publicitaria con IA, hosting veloz y dominio gratis. El setup es de **1.500.000 Gs** y el mantenimiento anual de **700.000 Gs**. ¿Te gustaría cotizar tu proyecto?',
      ],
      'pagina web': [
        'Nuestro servicio de **Desarrollo Web Institucional** crea sucursales virtuales de alta calidad. Incluye diseño premium, redacción publicitaria con IA, hosting veloz y dominio gratis. El setup es de **1.500.000 Gs** y el mantenimiento anual de **700.000 Gs**. ¿Te gustaría cotizar tu proyecto?',
      ],
      'sitio web': [
        'Nuestro servicio de **Desarrollo Web Institucional** crea sucursales virtuales de alta calidad. Incluye diseño premium, redacción publicitaria con IA, hosting veloz y dominio gratis. El setup es de **1.500.000 Gs** y el mantenimiento anual de **700.000 Gs**. ¿Te gustaría cotizar tu proyecto?',
      ],
      whatsapp: [
        'El **Agente de Ventas Híbrido** es un asistente conversacional con IA integrado a la API de Meta. Atiende en lenguaje natural, entiende audios y texto, y tiene modo híbrido (IA + Humano). Se entrena en solo 5 minutos con la información de tu negocio. ¿Quieres una demostración?',
      ],
      'agente de ventas': [
        'El **Agente de Ventas Híbrido** es un asistente conversacional con IA + Mini-CRM para WhatsApp. Atiende 24/7 en lenguaje natural, entiende audios y texto complejo, y permite intervención humana cuando sea necesario. ¿Te gustaría ver cómo funciona?',
      ],
      'mini-crm': [
        'El **Mini-CRM** incluido en nuestro Agente de Ventas te permite gestionar leads, hacer seguimiento y mantener un historial completo de conversaciones con tus clientes. Todo integrado directamente en WhatsApp. ¿Quieres conocer más detalles?',
      ],
      avatar: [
        'El **Avatar Digital Corporativo** es tu embajador de marca hiperrealista. Ofrece: 30 outfits iniciales, video en formato vertical y horizontal, interacción con productos físicos, y disponibilidad 24/7. Setup inicial desde **1.500.000 Gs** y planes desde **750.000 Gs/mes**. ¿Te interesa?',
      ],
      'influencer': [
        'El **Avatar Digital Corporativo** es tu embajador de marca hiperrealista. Ofrece: 30 outfits iniciales, video en formato vertical y horizontal, interacción con productos físicos, y disponibilidad 24/7. Setup inicial desde **1.500.000 Gs** y planes desde **750.000 Gs/mes**. ¿Te interesa?',
      ],
      voz: [
        'El **Voice Design Premium** es la clonación hiperrealista de la voz de tu marca. Incluye el modelo TTS listo para integrar y preparación multilingüe. Aplicamos mezcla y masterización de estudio para que suene natural y con emoción. ¿Quieres escuchar una muestra?',
      ],
      'voice design': [
        'El **Voice Design Premium** es la clonación hiperrealista de la voz de tu marca. Incluye el modelo TTS listo para integrar y preparación multilingüe. Aplicamos mezcla y masterización de estudio para que suene natural y con emoción. ¿Quieres escuchar una muestra?',
      ],
      doblaje: [
        'Nuestro servicio de **Locución Profesional y Doblaje** cuenta con locutores profesionales para más de 70 idiomas, incluyendo guaraní. También incluimos redacción de guion. Ideal para expandir tu marca internacionalmente.',
      ],
      'locución': [
        'Nuestro servicio de **Locución Profesional y Doblaje** cuenta con locutores profesionales para más de 70 idiomas, incluyendo guaraní. También incluimos redacción de guion. Ideal para expandir tu marca internacionalmente.',
      ],
      jingle: [
        'La **Creación de Jingle Publicitario** incluye copywriting musical, composición original, intérpretes vocales y producción con mezcla y masterización de estudio profesional. Precio desde **1.000.000 Gs**. Música 100%% original para tu marca.',
      ],
      'video comercial': [
        'La **Producción de Videocomerciales con IA** transforma tus fotos en anuncios dinámicos de alta gama. Incluye grabación in situ con dirección de arte, escenografía animada, fondos hiperrealistas, locución y música original. Resultados premium.',
      ],
      'video': [
        'La **Producción de Videocomerciales con IA** transforma tus fotos en anuncios dinámicos de alta gama. Incluye grabación in situ con dirección de arte, escenografía animada, fondos hiperrealistas, locución y música original. Resultados premium.',
      ],
      musica: [
        'Nuestros **Servicios Musicales y de Estudio** incluyen: arreglos orquestales, músicos sesionistas, transcripción de partituras y asesoría legal para registro de obras (APA, AIE, SGP). Todo con calidad de estudio profesional.',
      ],
      musical: [
        'Nuestros **Servicios Musicales y de Estudio** incluyen: arreglos orquestales, músicos sesionistas, transcripción de partituras y asesoría legal para registro de obras (APA, AIE, SGP). Todo con calidad de estudio profesional.',
      ],
      estudio: [
        'Nuestros **Servicios Musicales y de Estudio** incluyen: arreglos orquestales, músicos sesionistas, transcripción de partituras y asesoría legal para registro de obras (APA, AIE, SGP). Todo con calidad de estudio profesional.',
      ],
      precio: [
        'En Rodas AI no publicamos precios fijos porque cada proyecto es único y requiere un análisis personalizado. Trabajamos con presupuestos adaptados al tamaño y necesidades de cada organización. ¿Le gustaría solicitar una consultoría personalizada?',
      ],
      costos: [
        'En Rodas AI no publicamos precios fijos porque cada proyecto es único y requiere un análisis personalizado. Trabajamos con presupuestos adaptados al tamaño y necesidades de cada organización. ¿Le gustaría solicitar una consultoría personalizada?',
      ],
      cotizacion: [
        'Con gusto. Para ofrecerle una solución a medida, necesitamos conocer más sobre su proyecto. Mientras tanto, puede contactar a nuestro CEO al **+595 986 467 299** o compartirme más detalles para agendar una consultoría.',
      ],
      cotizar: [
        'Con gusto. Para ofrecerle una solución a medida, necesitamos conocer más sobre su proyecto. Mientras tanto, puede contactar a nuestro CEO al **+595 986 467 299** o compartirme más detalles para agendar una consultoría.',
      ],
      'rolando': [
        '**Rolando Rodas** es el CEO y Fundador de Rodas AI. Es la fusión entre la sensibilidad del productor discográfico y el rigor del arquitecto tecnológico. Puede contactarlo directamente al **+595 986 467 299**.',
      ],
      'ceo': [
        '**Rolando Rodas** es el CEO y Fundador de Rodas AI. Es la fusión entre la sensibilidad del productor discográfico y el rigor del arquitecto tecnológico. Puede contactarlo directamente al **+595 986 467 299**.',
      ],
      contacto: [
        'Puedes contactarnos por:\n- WhatsApp: **+595 986 467 299**\n- Email: **info@rodasproducciones.com**\n- Dirección: De las cordilleras 131 c/ Independencia Nacional\n- Redes: @rodasproduccionespy (FB, IG, TT, YT)',
      ],
      direccion: [
        'Estamos ubicados en **De las cordilleras 131 c/ Independencia Nacional**. Todos los servicios incluyen la opción de reunirnos en tu local para proyectos de videocomerciales.',
      ],
      'identidad sonora': [
        'La **Identidad Sonora** es nuestra especialidad. Creamos la personalidad auditiva de tu marca con jingles originales, voice design premium y locución profesional. Todo con mezcla y masterización de estudio para un sonido inconfundible.',
      ],
      'que hace': [
        '**Rodas AI** diseña sistemas inteligentes de comunicación para empresas. Ofrecemos dos pilares:\n\n**Pilar A - Tecnología y Automatización:** Desarrollo web, agente de ventas con IA para WhatsApp, avatares digitales corporativos.\n\n**Pilar B - Producción Audiovisual:** Voice design, doblaje, jingles, videocomerciales con IA, servicios musicales.\n\n¿Sobre cuál le gustaría saber más?',
      ],
      servicio: [
        '**Rodas AI** ofrece dos pilares estratégicos:\n\n**Pilar A - Tecnología y Automatización:** Desarrollo web, agente de ventas con IA para WhatsApp, avatares digitales corporativos.\n\n**Pilar B - Producción Audiovisual:** Voice design, doblaje, jingles, videocomerciales con IA, servicios musicales.\n\n¿Sobre cuál le gustaría recibir información?',
      ],
      hola: null,
      buenas: null,
      'buen dia': null,
      'buenos dias': null,
      gracias: null,
      adios: null,
      chau: null,
    },
    social: {
      greeting: null,
      gratitude: ['¡De nada! Si tienes más preguntas, aquí estoy para ayudarte. 😊', 'Para eso estamos. ¿Hay algo más en lo que pueda ayudarte?', '¡Con gusto! Recuerda que también puedes seguirnos en redes como @rodasproduccionespy.'],
      farewell: ['¡Gracias por contactarnos! Si necesitas algo más, aquí estoy. Que tengas un excelente día. 😊', 'Ha sido un placer ayudarte. No dudes en volver cuando quieras. ¡Hasta pronto!'],
    }
  };

  let messages = [];
  let isOpen = false;

  function loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        messages = JSON.parse(stored);
      }
    } catch (e) {
      messages = [];
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function getLastVisit() {
    return localStorage.getItem(LAST_VISIT_KEY);
  }

  function setLastVisit() {
    localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
  }

  function formatTimestamp(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  function findBestResponse(input) {
    const lower = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const [keyword, responses] of Object.entries(KB.keywords)) {
      if (lower.includes(keyword)) {
        if (responses === null) return null;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    return KB.fallback[Math.floor(Math.random() * KB.fallback.length)];
  }

  function addMessage(role, text) {
    messages.push({ role, text, timestamp: new Date().toISOString() });
    saveHistory();
    renderMessages();
  }

  // ─── Llamada a OpenAI API ───
  async function askOpenAI(conversation) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const body = {
      model: typeof RAI_OPENAI_MODEL !== 'undefined' ? RAI_OPENAI_MODEL : 'gpt-4o-mini',
      temperature: typeof RAI_OPENAI_TEMP !== 'undefined' ? RAI_OPENAI_TEMP : 0.7,
      max_tokens: typeof RAI_OPENAI_MAX_TOKENS !== 'undefined' ? RAI_OPENAI_MAX_TOKENS : 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversation.slice(-40)  // últimas 40 interacciones para no exceder tokens
      ]
    };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RAI_OPENAI_KEY}`
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        const err = await resp.text();
        console.error('OpenAI error:', resp.status, err);
        return null;
      }
      const data = await resp.json();
      return data.choices[0].message.content.trim();
    } catch (e) {
      console.error('OpenAI fetch error:', e);
      return null;
    }
  }

  function handleSend() {
    const input = document.getElementById('rp-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);

    if (AI_ENABLED) {
      // ─── MODO IA: OpenAI responde con todo el contexto ───
      const conversation = messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));
      askOpenAI(conversation).then(reply => {
        if (reply) {
          addMessage('bot', reply);
        } else {
          const fallback = KB.fallback[Math.floor(Math.random() * KB.fallback.length)];
          addMessage('bot', fallback);
        }
        setLastVisit();
      });
    } else {
      // ─── MODO OFFLINE: keyword matching ───
      setTimeout(() => {
        const response = findBestResponse(text);
        if (response) {
          addMessage('bot', response);
        } else if (text.match(/^(hola|buenas|buen[asod]|que tal|hey)/i)) {
          const greeting = KB.greeting[0];
          const lastVisit = getLastVisit();
          if (lastVisit) {
            const extra = `\n\nVi que ya has estado por aquí. ¡Bienvenido de nuevo! Tu última visita fue ${formatTimestamp(lastVisit)}.`;
            addMessage('bot', greeting + extra);
          } else {
            addMessage('bot', greeting);
          }
        } else if (text.match(/(gracias|grax|thanks|thank|graci)/i)) {
          const grats = KB.social.gratitude;
          addMessage('bot', grats[Math.floor(Math.random() * grats.length)]);
        } else if (text.match(/(adios|chau|bye|nos vemos|hasta luego)/i)) {
          const fw = KB.social.farewell;
          addMessage('bot', fw[Math.floor(Math.random() * fw.length)]);
        } else {
          addMessage('bot', KB.fallback[Math.floor(Math.random() * KB.fallback.length)]);
        }
        setLastVisit();
      }, 600);
    }
  }

  function renderMessages() {
    const container = document.getElementById('rp-chat-messages');
    if (!container) return;
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (const msg of messages) {
      const div = document.createElement('div');
      div.className = `rp-msg rp-msg-${msg.role}`;
      div.innerHTML = `<div class="rp-msg-text">${msg.text.replace(/\n/g, '<br>')}</div><div class="rp-msg-time">${formatTimestamp(msg.timestamp)}</div>`;
      fragment.appendChild(div);
    }
    container.appendChild(fragment);
    container.scrollTop = container.scrollHeight;
  }

  function toggleChat() {
    isOpen = !isOpen;
    const panel = document.getElementById('rp-chat-panel');
    const btn = document.querySelector('.rp-chat-btn');
    if (isOpen) {
      panel.classList.add('rp-open');
      btn.classList.add('rp-hidden');
      renderMessages();
      if (messages.length === 0) {
        addMessage('bot', KB.greeting[0]);
        setLastVisit();
      } else {
        const lastVisit = getLastVisit();
        if (lastVisit) {
          const diff = Date.now() - new Date(lastVisit).getTime();
          if (diff > 300000) {
            addMessage('bot', `Bienvenido de nuevo. Pasaron ${Math.floor(diff / 60000)} minutos desde tu último mensaje. ¿En qué puedo ayudarte?`);
            setLastVisit();
          }
        }
      }
    } else {
      panel.classList.remove('rp-open');
      btn.classList.remove('rp-hidden');
    }
  }

  function init() {
    loadHistory();

    const styles = document.createElement('style');
    styles.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
      .rp-chat-btn {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1050;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--rai-gold, #D4A54A);
        color: #0E0E10;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 30px rgba(212,165,74,0.25);
        transition: all 250ms ease-out;
        pointer-events: auto;
      }
      .rp-chat-btn:hover {
        transform: scale(1.04);
        background: var(--rai-gold-dark, #B8842E);
      }
      .rp-chat-btn.rp-hidden {
        opacity: 0;
        transform: scale(0);
        pointer-events: none;
      }
      .rp-chat-btn svg {
        width: 26px;
        height: 26px;
        fill: #0E0E10;
      }
      .rp-chat-panel {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1050;
        width: 380px;
        height: 560px;
        max-height: calc(100vh - 6rem);
        background: #202327;
        border-radius: 16px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        transform: scale(0);
        transform-origin: bottom right;
        opacity: 0;
        pointer-events: none;
        transition: all 400ms ease-out;
        overflow: hidden;
        border: 1px solid #31353B;
      }
      .rp-chat-panel.rp-open {
        transform: scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      .rp-chat-header {
        background: #181A1D;
        padding: 1rem 1.25rem;
        color: #F6F4EF;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
        border-bottom: 1px solid #31353B;
      }
      .rp-chat-header .rp-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(212,165,74,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }
      .rp-chat-header .rp-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .rp-chat-header .rp-info {
        flex: 1;
        min-width: 0;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
      }
      .rp-chat-header .rp-info strong {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
      }
      .rp-chat-header .rp-info small {
        display: block;
        font-size: 0.7rem;
        opacity: 0.5;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .rp-chat-header .rp-close {
        background: none;
        border: none;
        color: rgba(246,244,239,0.5);
        cursor: pointer;
        padding: 4px;
        border-radius: 8px;
        transition: all 250ms ease-out;
        line-height: 1;
      }
      .rp-chat-header .rp-close:hover {
        background: rgba(255,255,255,0.06);
        color: #F6F4EF;
      }
      .rp-chat-header .rp-close svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
      .rp-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: #0E0E10;
      }
      .rp-msg {
        max-width: 85%;
        animation: rpFadeIn 400ms ease-out;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
      }
      @keyframes rpFadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .rp-msg-user {
        align-self: flex-end;
      }
      .rp-msg-bot {
        align-self: flex-start;
      }
      .rp-msg-text {
        padding: 0.75rem 1rem;
        border-radius: 14px;
        font-size: 0.9rem;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .rp-msg-bot .rp-msg-text {
        background: #202327;
        border: 1px solid #31353B;
        border-bottom-left-radius: 4px;
        color: #C8CDD2;
      }
      .rp-msg-user .rp-msg-text {
        background: #D4A54A;
        border-bottom-right-radius: 4px;
        color: #0E0E10;
      }
      .rp-msg-bot .rp-msg-text strong {
        color: #D4A54A;
      }
      .rp-msg-time {
        font-size: 0.65rem;
        color: rgba(200,205,210,0.3);
        margin-top: 2px;
        padding: 0 0.5rem;
      }
      .rp-msg-user .rp-msg-time {
        text-align: right;
      }
      .rp-chat-input-area {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-top: 1px solid #31353B;
        background: #181A1D;
        flex-shrink: 0;
      }
      .rp-chat-input-area textarea {
        flex: 1;
        border: 1px solid #31353B;
        border-radius: 12px;
        padding: 0.6rem 0.75rem;
        font-size: 0.9rem;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        resize: none;
        outline: none;
        transition: border-color 250ms ease-out;
        min-height: 20px;
        max-height: 80px;
        line-height: 1.4;
        background: #0E0E10;
        color: #F6F4EF;
      }
      .rp-chat-input-area textarea::placeholder {
        color: #70757D;
      }
      .rp-chat-input-area textarea:focus {
        border-color: #D4A54A;
      }
      .rp-chat-input-area .rp-send-btn {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: #D4A54A;
        color: #0E0E10;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 250ms ease-out;
      }
      .rp-chat-input-area .rp-send-btn:hover {
        background: #B8842E;
      }
      .rp-chat-input-area .rp-send-btn svg {
        width: 18px;
        height: 18px;
        fill: #0E0E10;
      }
      @media (max-width: 480px) {
        .rp-chat-panel {
          width: calc(100vw - 2rem);
          height: calc(100vh - 6rem);
          right: 1rem;
          bottom: 1rem;
          border-radius: 12px;
        }
        .rp-chat-btn {
          bottom: 1rem;
          right: 1rem;
        }
      }
    `;
    document.head.appendChild(styles);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'rp-chat-btn';
    toggleBtn.setAttribute('aria-label', 'Abrir chat');
    toggleBtn.innerHTML = `<svg viewBox="0 0 512 512"><path d="M256.064 0h-.128C114.784 0 0 114.816 0 256c0 56 18.048 107.904 48.736 150.048l-31.904 95.104 98.4-31.456C155.712 496.512 204 512 256.064 512 397.216 512 512 397.152 512 256S397.216 0 256.064 0z"/></svg>`;
    toggleBtn.addEventListener('click', toggleChat);
    document.body.appendChild(toggleBtn);

    const panel = document.createElement('div');
    panel.className = 'rp-chat-panel';
    panel.id = 'rp-chat-panel';
    panel.innerHTML = `
      <div class="rp-chat-header">
        <div class="rp-avatar" style="overflow:hidden;">
          <img src="multimedia/LogoSoloRodasAI.svg" alt="" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="rp-info">
          <strong>Rodas AI</strong>
          <small>Asistente Virtual · Online</small>
        </div>
        <button class="rp-close" onclick="document.querySelector('.rp-chat-btn').click()" aria-label="Cerrar chat">
          <svg viewBox="0 0 512 512"><path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"/></svg>
        </button>
      </div>
      <div class="rp-chat-messages" id="rp-chat-messages"></div>
      <div class="rp-chat-input-area">
        <textarea id="rp-chat-input" placeholder="Escribe tu mensaje..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();document.querySelector('.rp-send-btn').click()}"></textarea>
        <button class="rp-send-btn" onclick="handleSend()" aria-label="Enviar">
          <svg viewBox="0 0 512 512"><path d="M480 32 16 240h192v192l160-80 112 128z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    window.handleSend = handleSend;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
