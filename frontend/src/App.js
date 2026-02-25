import React, { useState } from 'react';
import { useChatViewModel } from './viewmodels/useChatViewModel';
import './App.css';

function App() {
    const { messages, sendMessage, loading } = useChatViewModel();
    const [input, setInput] = useState('');
    const faqs = ["Servicios", "Horarios", "Contacto"];

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                {/* Nota: src="/logo.png" asumiendo que está en public/logo.png */}
                <img src="/logo.png" alt="Gesvi Logo" className="logo-img" />
                <h2 className="chat-title">Gesvi Bot</h2>
            </header>
            
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message-bubble loading">Escribiendo...</div>
                    </div>
                )}
            </div>

            <div className="faq-section">
                <p className="faq-label">Preguntas rápidas:</p>
                <div className="faq-buttons">
                    {faqs.map(faq => (
                        <button key={faq} className="faq-btn" onClick={() => sendMessage(faq)}>
                            {faq}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-area">
                <input 
                    className="chat-input"
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu consulta aquí..."
                />
                <button className="send-btn" onClick={handleSend}>Enviar</button>
            </div>
        </div>
    );
}

export default App;