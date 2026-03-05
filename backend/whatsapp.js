const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chatModel = require('./models/chatModel');

const client = new Client({
    authStrategy: new LocalAuth(), // Guardará la sesión del 627450577
    puppeteer: {
        headless: true, // Una vez vinculado, puedes ponerlo en true para que no moleste
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Evento para mostrar el QR en la terminal
client.on('qr', (qr) => {
    console.log('--- ESCANEA ESTE QR CON EL MÓVIL 627450577 ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Gesvi Bot activo para 627450577');
    console.log('Ya puedes recibir consultas de clientes.');
});

client.on('message', async (msg) => {
    try {
        // SEGURIDAD: No responderse a sí mismo ni a estados
        if (msg.fromMe || msg.from === 'status@broadcast') return;

        // Solo responder en chats privados
        const chat = await msg.getChat();
        if (chat.isGroup) return;

        // Evitar responder a mensajes muy antiguos (más de 1 minuto)
        const now = Math.floor(Date.now() / 1000);
        if (now - msg.timestamp > 60) return;

        console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);
        
        // Consultar la base de datos y la IA Ollama
        const response = await chatModel.findResponse(msg.body, []);
        
        // Enviar la respuesta oficial del bot
        await client.sendMessage(msg.from, response);

    } catch (error) {
        console.error('Error procesando mensaje:', error);
    }
});

client.initialize();