require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatController = require('./controllers/chatController');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/faqs', chatController.getAllFaqs); // Ruta para los botones
app.post('/api/chat', chatController.getMessageResponse);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Gesvi corriendo en puerto ${PORT}`);
});