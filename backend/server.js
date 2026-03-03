require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatController = require('./controllers/chatController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS ---

// 1. Obtener todas las FAQS (para pintar los botones al cargar)
app.get('/api/faqs', chatController.getAllFaqs); 

// 2. GUARDAR nueva FAQ (Esta es la que te faltaba y daba error 404)
app.post('/api/faqs', chatController.addFaq); 

// 3. Respuesta del Chat (IA + DB)
app.post('/api/chat', chatController.getMessageResponse);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Gesvi corriendo en puerto ${PORT}`);
});
// ... tus otras rutas ...
app.post('/api/faqs', chatController.addFaq); 

// Nueva ruta para borrar (usa :id como parámetro)
app.delete('/api/faqs/:id', chatController.deleteFaq);
// server.js o faqRoutes.js

// Obtener UNA sola FAQ para editar
app.get('/api/faqs/:id', chatController.getFaqById);

// Actualizar una FAQ
app.put('/api/faqs/:id', chatController.updateFaq);