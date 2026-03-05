const db = require('../config/db');

// --- BASE DE CONOCIMIENTOS FIJA (Para que la IA no invente) ---
const INFO_GESVI = `
Tecnología Gesvi ofrece un lector de documentos avanzado para hoteles y empresas. 
Funciones reales: Escaneo de DNI, Pasaportes y carnets de conducir; integración directa con PMS hoteleros; carga automática de partes de entrada.
Soporte técnico: Se realiza mediante AnyDesk o el correo soporte@lectorgesvi.com.
Web de contacto: https://www.lectorgesvi.com/contacto/
`;

exports.getAll = async () => {
    try {
        const [rows] = await db.execute('SELECT id, pregunta FROM faqs');
        return rows;
    } catch (error) {
        console.error("Error al obtener FAQs:", error);
        throw error;
    }
};

exports.getById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM faqs WHERE id = ?', [id]);
    return rows[0];
};

exports.findResponse = async (userMessage, history = []) => {
    const msg = userMessage.toLowerCase().trim();
    
    try {
        // 1. BÚSQUEDA REFORZADA EN BASE DE DATOS (Prioridad 1)
        const [rows] = await db.execute('SELECT * FROM faqs');
        
        const match = rows.find(faq => {
            const pregunta = faq.pregunta.toLowerCase();
            const keywords = faq.palabras_clave?.split(',').map(k => k.trim().toLowerCase()) || [];
            
            if (msg.length > 3 && (pregunta.includes(msg) || msg.includes(pregunta))) return true;
            return keywords.some(k => k.length > 3 && msg.includes(k));
        });

        if (match) return match.respuesta;

        // 2. IA OLLAMA: RESTRINGIDA CON INFO_GESVI (Prioridad 2)
        const chatContext = history.slice(-3).map(m => 
            `${m.sender === 'user' ? 'Cliente' : 'Gesvi Bot'}: ${m.text}`
        ).join('\n');

        const systemPrompt = `Eres Gesvi Bot, asistente de Tecnología Gesvi. 
        USA EXCLUSIVAMENTE ESTA INFORMACIÓN: ${INFO_GESVI}. 
        Si el cliente pregunta algo que no está arriba, di: "No tengo esa información exacta. Contacta con soporte: https://www.lectorgesvi.com/contacto/".
        NO INVENTES funciones técnicas. Sé breve, amable y profesional.`;

        const responseIA = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:1b", 
                prompt: `SISTEMA: ${systemPrompt}\n\nCHAT ANTERIOR:\n${chatContext}\n\nCliente: ${userMessage}\nGesvi Bot:`,
                stream: false,
                options: {
                    num_predict: 80,   
                    temperature: 0.1,  // Mínima para evitar "cosas raras" y alucinaciones
                    top_p: 0.9,
                    num_thread: 4      
                }
            })
        });

        if (!responseIA.ok) throw new Error("Ollama off");
        const dataIA = await responseIA.json();
        let reply = dataIA.response.trim();

        // Filtro de seguridad por si la IA se queda en bucle o vacía
        if (reply.length < 2) return "¿Podrías darme más detalles sobre tu duda?";
        
        return reply;

    } catch (error) {
        console.error("Error en el Bot:", error);
        return "Tengo un problema técnico momentáneo. Escríbenos aquí: https://www.lectorgesvi.com/contacto/";
    }
};

// --- FUNCIONES CRUD ---
exports.create = async (data) => {
    const { pregunta, respuesta, palabras_clave } = data;
    const [result] = await db.execute(
        'INSERT INTO faqs (pregunta, respuesta, palabras_clave) VALUES (?, ?, ?)',
        [pregunta, respuesta, palabras_clave || '']
    );
    return result.insertId;
};

exports.update = async (id, data) => {
    const { pregunta, respuesta, palabras_clave } = data;
    await db.execute(
        'UPDATE faqs SET pregunta = ?, respuesta = ?, palabras_clave = ? WHERE id = ?',
        [pregunta, respuesta, palabras_clave, id]
    );
};

exports.delete = async (id) => {
    await db.execute('DELETE FROM faqs WHERE id = ?', [id]);
};