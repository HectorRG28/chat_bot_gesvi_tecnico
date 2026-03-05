require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatController = require('./controllers/chatController');
const faqRoutes = require('./routes/faqRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// --- RUTAS ---
app.use('/api/faqs', faqRoutes); // Centraliza todas las rutas de FAQs
app.post('/api/chat', chatController.getMessageResponse);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Gesvi volando en puerto ${PORT}`);
});