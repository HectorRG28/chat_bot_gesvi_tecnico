const db = require('../config/db');

exports.findResponse = async (userMessage) => {
    const msg = userMessage.toLowerCase();

    try {
        // Usamos el pool directamente para consultar
        const [rows] = await db.execute('SELECT * FROM faqs');

        // Buscamos coincidencia en las palabras clave
        const match = rows.find(faq => {
            if (!faq.palabras_clave) return false;
            const keywords = faq.palabras_clave.split(',');
            return keywords.some(k => msg.includes(k.trim().toLowerCase()));
        });

        if (match) return match.respuesta;

        return "Lo siento, no tengo esa información detallada. Puedes preguntar por 'soporte', 'instalación' o 'comprar'.";

    } catch (error) {
        console.error("Error en el modelo (DB):", error);
        throw error;
    }
};