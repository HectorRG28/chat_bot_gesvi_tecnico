const db = require('../config/db');

// Obtiene todas las preguntas para generar botones en el Frontend
exports.getAll = async () => {
    try {
        const [rows] = await db.execute('SELECT id, pregunta FROM faqs');
        return rows;
    } catch (error) {
        console.error("Error al obtener FAQs:", error);
        throw error;
    }
};

exports.findResponse = async (userMessage) => {
    const msg = userMessage.toLowerCase();
    try {
        const [rows] = await db.execute('SELECT * FROM faqs');

        // Buscamos coincidencia en palabras clave O en el título de la pregunta
        const match = rows.find(faq => {
            const inKeywords = faq.palabras_clave?.split(',').some(k => msg.includes(k.trim().toLowerCase()));
            const inQuestion = faq.pregunta.toLowerCase().includes(msg);
            return inKeywords || inQuestion;
        });

        if (match) return match.respuesta;

        return "Lo siento, no tengo esa información detallada. Prueba con palabras como 'instalación', 'garantía' o 'soporte'.";
    } catch (error) {
        console.error("Error en el modelo (DB):", error);
        throw error;
    }
};