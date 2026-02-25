const chatModel = require('../models/chatModel');

exports.getMessageResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "Mensaje vacío." });

        const response = await chatModel.findResponse(message);
        res.json({ reply: response });
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ reply: "Error interno en el servidor." });
    }
};

// Nueva función para los botones dinámicos
exports.getAllFaqs = async (req, res) => {
    try {
        const faqs = await chatModel.getAll();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron cargar las preguntas." });
    }
};