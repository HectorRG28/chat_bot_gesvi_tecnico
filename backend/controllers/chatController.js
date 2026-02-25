const chatModel = require('../models/chatModel');

exports.getMessageResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ reply: "No se recibió ningún mensaje." });
        }

        // Importante: usamos await porque findResponse es una promesa (async)
        const response = await chatModel.findResponse(message);
        
        // Enviamos la respuesta limpia al frontend
        res.json({ reply: response });

    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ 
            reply: "Hubo un error interno al consultar la base de datos de Gesvi." 
        });
    }
};