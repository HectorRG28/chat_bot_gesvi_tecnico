const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Tu conexión a MySQL

// Ruta para OBTENER las faqs (la que ya te funciona para los botones)
router.get('/faqs', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, pregunta FROM faqs');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});

// RUTA QUE FALTA: Para GUARDAR la nueva faq
router.post('/faqs', async (req, res) => {
    const { pregunta, respuesta, palabras_clave } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO faqs (pregunta, respuesta, palabras_clave) VALUES (?, ?, ?)',
            [pregunta, respuesta, palabras_clave]
        );
        res.status(201).json({ id: result.insertId, pregunta });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar");
    }
});

module.exports = router;