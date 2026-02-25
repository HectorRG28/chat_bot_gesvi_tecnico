import React, { useState } from 'react';
import { useChatViewModel } from './viewmodels/useChatViewModel';
import './App.css';

function App() {
    const { messages, sendMessage, loading, faqs } = useChatViewModel();
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <img src="/logo.png" alt="Gesvi Logo" className="logo-img" />
                <h2 className="chat-title">Gesvi Bot</h2>
            </header>
            
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.sender}`}>
                        <div className="message-bubble">{msg.text}</div>
                    </div>
                ))}
                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message-bubble loading">Escribiendo...</div>
                    </div>
                )}
            </div>

            <div className="faq-section">
                <p className="faq-label">Preguntas frecuentes:</p>
                <div className="faq-buttons">
                    {/* Botones dinámicos desde la Base de Datos */}
                    {faqs.map(faq => (
                        <button key={faq.id} className="faq-btn" onClick={() => sendMessage(faq.pregunta)}>
                            {faq.pregunta}
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