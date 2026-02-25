import { useState } from 'react';

export const useChatViewModel = () => {
    const [messages, setMessages] = useState([
        { text: "¡Hola! Bienvenido a Tecnología Gesvi. ¿En qué puedo ayudarte?", sender: "bot" }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text) => {
        const newMessages = [...messages, { text, sender: "user" }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });
            const data = await response.json();
            setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Error de conexión con el servidor.", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading };
};