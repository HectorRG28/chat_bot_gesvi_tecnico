require('dotenv').config(); // <-- Esta línea es vital
const express = require('express');
const cors = require('cors');
const chatController = require('./controllers/chatController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.post('/api/chat', chatController.getMessageResponse);

// Usamos el puerto del .env o el 5000 por defecto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor Gesvi corriendo en puerto ${PORT}`);
});