import React, { useState, useEffect } from 'react';
import { useChatViewModel } from './viewmodels/useChatViewModel';
import './App.css';


function App() {
    const { messages, sendMessage, loading, faqs, setFaqs } = useChatViewModel();
    const [input, setInput] = useState('');
    
    // ESTADOS DE VISTA Y SEGURIDAD
    const [view, setView] = useState('chat'); 
    const [showLogin, setShowLogin] = useState(false);
    const [passInput, setPassInput] = useState('');
    
    // ESTADOS DE FORMULARIO Y EDICIÓN
    const [newFaq, setNewFaq] = useState({ pregunta: '', respuesta: '', palabras_clave: '' });
    const [editingId, setEditingId] = useState(null);
    
    // ESTADO PARA EL AVISO PERSONALIZADO (TOAST)
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const CONFIG_PASSWORD = "admin"; 

    // Función para mostrar avisos Gesvi
    const showGesviNotice = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passInput === CONFIG_PASSWORD) {
            setView('admin');
            setShowLogin(false);
            setPassInput('');
            showGesviNotice("Sesión iniciada correctamente");
        } else {
            showGesviNotice("Clave incorrecta", "error");
        }
    };

    const saveFaq = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `http://localhost:5000/api/faqs/${editingId}` : 'http://localhost:5000/api/faqs';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaq)
            });

            if (res.ok) {
                if (editingId) {
                    setFaqs(prev => prev.map(f => f.id === editingId ? { ...f, pregunta: newFaq.pregunta } : f));
                    showGesviNotice("¡FAQ actualizada con éxito!");
                } else {
                    const data = await res.json();
                    setFaqs(prev => [...prev, { id: data.id, pregunta: newFaq.pregunta }]);
                    showGesviNotice("¡Nueva FAQ guardada!");
                }
                cancelEdit();
            }
        } catch (e) { showGesviNotice("Error de conexión", "error"); }
    };

    const deleteFaq = async (id) => {
        if (!window.confirm("¿Deseas eliminar este botón?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/faqs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFaqs(prev => prev.filter(faq => faq.id !== id));
                showGesviNotice("Botón eliminado", "success");
            }
        } catch (e) { showGesviNotice("Error al eliminar", "error"); }
    };

    const startEdit = async (faq) => {
        // Opcional: Podrías hacer un fetch aquí para traer la respuesta y palabras_clave si no las tienes en el estado global
        // Por ahora, asumimos que cargamos los datos en el formulario
        setEditingId(faq.id);
        setNewFaq({ pregunta: faq.pregunta, respuesta: 'Cargando...', palabras_clave: '' });
        
        // Fetch para obtener la respuesta completa
        try {
            const res = await fetch(`http://localhost:5000/api/faqs/${faq.id}`);
            const data = await res.json();
            setNewFaq({ pregunta: data.pregunta, respuesta: data.respuesta, palabras_clave: data.palabras_clave });
        } catch (e) { showGesviNotice("Error al cargar datos", "error"); }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewFaq({ pregunta: '', respuesta: '', palabras_clave: '' });
    };

    const formatMessage = (text) => {
        if (!text) return "";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split('\n').map((line, key) => (
            <span key={key}>
                {line.split(urlRegex).map((part, i) => (
                    part.match(urlRegex) 
                    ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">{part}</a> 
                    : part
                ))}
                <br />
            </span>
        ));
    };

    return (
        <div className="main-wrapper">
            {/* ANUNCIO GESVI PERSONALIZADO (TOAST) */}
            {toast.show && (
                <div className={`gesvi-toast ${toast.type}`}>
                    <img src="/logo.png" alt="Gesvi" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* MODAL DE LOGIN */}
            {showLogin && (
                <div className="login-overlay">
                    <div className="login-card">
                        <img src="/logo.png" alt="Gesvi" className="login-logo" />
                        <h3>Acceso Administración</h3>
                        <form onSubmit={handleLogin}>
                            <input type="password" placeholder="Clave" value={passInput} onChange={(e) => setPassInput(e.target.value)} autoFocus />
                            <div className="login-actions">
                                <button type="submit" className="btn-confirm">Entrar</button>
                                <button type="button" className="btn-cancel-login" onClick={() => setShowLogin(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {view === 'chat' ? (
                <div className="chat-container">
                    <header className="chat-header">
                        <img src="/logo.png" alt="Logo" className="logo-img" />
                        <h2 className="chat-title">Gesvi Bot</h2>
                    </header>
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-container">
                                    <div className="message-bubble">{formatMessage(msg.text)}</div>
                                    {msg.sender === 'bot' && msg.time && <span className="response-time">{msg.time}s</span>}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="message-bubble loading">Escribiendo...</div>}
                    </div>
                    <div className="faq-section">
                        <div className="faq-buttons">
                            {faqs.map(faq => (
                                <button key={faq.id} className="faq-btn" onClick={() => sendMessage(faq.pregunta)}>{faq.pregunta}</button>
                            ))}
                        </div>
                    </div>
                    <div className="input-area">
                        <input className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (sendMessage(input), setInput(''))} placeholder="Escribe..." />
                        <button className="send-btn" onClick={() => { sendMessage(input); setInput(''); }}>Enviar</button>
                    </div>
                </div>
            ) : (
                <div className="admin-page-container">
                    <div className="admin-form-card">
                        <header className="admin-form-header">
                            <img src="/logo.png" alt="Gesvi" className="admin-form-logo" />
                            <h1>{editingId ? "Editando Pregunta" : "Nueva Pregunta"}</h1>
                        </header>

                        <form onSubmit={saveFaq} className="gesvi-form">
                            <label>Nombre del botón</label>
                            <input value={newFaq.pregunta} onChange={e => setNewFaq({...newFaq, pregunta: e.target.value})} required />

                            <label>Respuesta oficial</label>
                            <textarea rows="3" value={newFaq.respuesta} onChange={e => setNewFaq({...newFaq, respuesta: e.target.value})} required />

                            <label>Palabras clave</label>
                            <input value={newFaq.palabras_clave} onChange={e => setNewFaq({...newFaq, palabras_clave: e.target.value})} />

                            <div className="admin-form-actions">
                                <button type="submit" className="btn-gesvi-save">
                                    {editingId ? "Actualizar Cambios" : "Guardar Nueva FAQ"}
                                </button>
                                {editingId && <button type="button" className="btn-cancel-edit" onClick={cancelEdit}>Cancelar Edición</button>}
                            </div>
                        </form>

                        <div className="admin-divider"></div>
                        <div className="admin-list-section">
                            <h3>Gestión de botones</h3>
                            <div className="admin-faq-list">
                                {faqs.map(faq => (
                                    <div key={faq.id} className="admin-faq-item">
                                        <span>{faq.pregunta}</span>
                                        <div className="item-actions">
                                            <button className="btn-edit" onClick={() => startEdit(faq)}>✏️</button>
                                            <button className="btn-delete" onClick={() => deleteFaq(faq.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="button" className="btn-gesvi-back" onClick={() => {setView('chat'); cancelEdit();}}>Volver al Chat</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;