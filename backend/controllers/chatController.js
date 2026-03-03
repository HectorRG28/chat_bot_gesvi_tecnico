const chatModel = require('../models/chatModel');
const db = require('../config/db'); // Necesario para las operaciones directas

exports.getMessageResponse = async (req, res) => {
    try {
        const { message, history } = req.body; 
        if (!message) return res.status(400).json({ reply: "Mensaje vacío." });

        // Obtenemos todas las FAQs para que la IA sepa qué responder basándose en tus botones
        const allFaqs = await db.execute('SELECT pregunta, respuesta FROM faqs');
        const knowledgeBase = allFaqs[0].map(f => `Botón: ${f.pregunta} -> Respuesta: ${f.respuesta}`).join('\n');

        const response = await chatModel.findResponse(message, history || [], knowledgeBase);
        res.json({ reply: response });
    } catch (error) {
        res.status(500).json({ reply: "Fallo en el servidor técnico de Gesvi." });
    }
};

exports.getAllFaqs = async (req, res) => {
    try {
        const faqs = await chatModel.getAll();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: "Error de carga de base de datos." });
    }
};

exports.getFaqById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM faqs WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(404).json({ error: "FAQ no encontrada." });
    }
};

exports.addFaq = async (req, res) => {
    try {
        const { pregunta, respuesta, palabras_clave } = req.body;
        const [result] = await db.execute(
            'INSERT INTO faqs (pregunta, respuesta, palabras_clave) VALUES (?, ?, ?)',
            [pregunta, respuesta, palabras_clave || '']
        );
        res.status(201).json({ id: result.insertId, pregunta });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar." });
    }
};

exports.updateFaq = async (req, res) => {
    try {
        const { pregunta, respuesta, palabras_clave } = req.body;
        await db.execute(
            'UPDATE faqs SET pregunta = ?, respuesta = ?, palabras_clave = ? WHERE id = ?',
            [pregunta, respuesta, palabras_clave, req.params.id]
        );
        res.json({ message: "Actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar." });
    }
};

exports.deleteFaq = async (req, res) => {
    try {
        await db.execute('DELETE FROM faqs WHERE id = ?', [req.params.id]);
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar." });
    }
};