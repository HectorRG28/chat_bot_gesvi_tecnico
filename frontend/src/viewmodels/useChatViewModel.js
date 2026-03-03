import { useState, useEffect } from 'react';

export const useChatViewModel = () => {
    const [messages, setMessages] = useState([
        { text: "¡Hola! Bienvenido a Tecnología Gesvi. ¿En qué puedo ayudarle?", sender: "bot" }
    ]);
    const [loading, setLoading] = useState(false);
    const [faqs, setFaqs] = useState([]); // Botones dinámicos

    // Cargar preguntas de la BD al iniciar la App
    useEffect(() => {
        fetch('http://localhost:5000/api/faqs')
            .then(res => res.json())
            .then(data => setFaqs(data))
            .catch(err => console.error("Error cargando botones:", err));
    }, []);

    const sendMessage = async (text) => {
        const startTime = Date.now(); // ⏱️ Inicia el cronómetro
        
        const newMessages = [...messages, { text, sender: "user" }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Enviamos el mensaje Y el historial para que la IA tenga memoria
                body: JSON.stringify({ 
                    message: text,
                    history: messages 
                }),
            });

            const data = await response.json();
            
            const endTime = Date.now(); // 🏁 Fin del cronómetro
            const duration = ((endTime - startTime) / 1000).toFixed(1); // Cálculo en segundos

            setMessages([
                ...newMessages, 
                { 
                    text: data.reply, 
                    sender: "bot", 
                    time: duration // Guardamos el tiempo para mostrarlo en el App.js
                }
            ]);
        } catch (error) {
            setMessages([
                ...newMessages, 
                { text: "No hay conexión con el servidor", sender: "bot" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Exportamos setFaqs por si quieres que la Intranet actualice los botones al guardar
    return { messages, sendMessage, loading, faqs, setFaqs };
};