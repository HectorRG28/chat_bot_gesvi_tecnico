const db = require('../config/db');

exports.getAll = async () => {
    try {
        const [rows] = await db.execute('SELECT id, pregunta FROM faqs');
        return rows;
    } catch (error) {
        console.error("Error al obtener FAQs:", error);
        throw error;
    }
};

exports.findResponse = async (userMessage, history = [], knowledgeBase = "") => {
    const msg = userMessage.toLowerCase();
    try {
        // 1. BUSCAR EN LA BASE DE DATOS (Prioridad máxima)
        const [rows] = await db.execute('SELECT * FROM faqs');
        const match = rows.find(faq => {
            const inKeywords = faq.palabras_clave?.split(',').some(k => msg.includes(k.trim().toLowerCase()));
            const inQuestion = faq.pregunta.toLowerCase().includes(msg);
            return inKeywords || inQuestion;
        });

        if (match) return match.respuesta;

        // 2. CONFIGURACIÓN TÉCNICA PARA OLLAMA
        const systemPrompt = `Eres el Asistente Técnico Especializado de Tecnología Gesvi.
REGLAS CRÍTICAS:
- SOLO respondes sobre temas técnicos de Gesvi (lectores, configuración, software).
- Si la consulta NO es sobre Gesvi, di: "Como asistente técnico de Gesvi, solo puedo resolver dudas sobre nuestros dispositivos y servicios."
- Usa terminología técnica (dispositivo, unidad, interfaz, protocolo).
- Sé directo, profesional y breve.
- Si no sabes la respuesta técnica exacta, remite a: https://www.lectorgesvi.com/contacto/

CONOCIMIENTO BASE (FAQs actuales):
${knowledgeBase}`;

        const chatContext = history.slice(-2).map(m => 
            `${m.sender === 'user' ? 'Cliente' : 'Asistente Gesvi'}: ${m.text}`
        ).join('\n');

        const responseIA = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:1b",
                prompt: `${systemPrompt}\n\nCONTEXTO PREVIO:\n${chatContext}\n\nCLIENTE: ${userMessage}\nASISTENTE GESVI:`,
                stream: false,
                options: {
                    num_predict: 100,
                    temperature: 0.2, // Bajamos la temperatura para que sea más preciso y menos creativo
                    top_k: 15
                }
            })
        });

        if (!responseIA.ok) throw new Error("Ollama no responde");

        const dataIA = await responseIA.json();
        return dataIA.response;

    } catch (error) {
        console.error("Error técnico (DB/IA):", error);
        return "Error en el protocolo de respuesta. Por favor, consulte con soporte técnico en https://www.lectorgesvi.com/contacto/";
    }
};