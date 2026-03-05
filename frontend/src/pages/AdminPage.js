import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import '../App.css';

function AdminPage() {
    const navigate = useNavigate();
    
    // ESTADOS DE SEGURIDAD Y VISTA
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passInput, setPassInput] = useState('');
    
    // ESTADOS DE FORMULARIO Y LISTADO
    const [faqs, setFaqs] = useState([]); 
    const [newFaq, setNewFaq] = useState({ pregunta: '', respuesta: '', palabras_clave: '' });
    const [editingId, setEditingId] = useState(null); 
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // NUEVO: ESTADO PARA EL MODAL DE BORRADO PERSONALIZADO
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    useEffect(() => {
        if (isAuthenticated) {
            fetchFaqs();
        }
    }, [isAuthenticated]);

    const fetchFaqs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/faqs');
            const data = await res.json();
            setFaqs(data);
        } catch (e) {
            showGesviNotice("Error al cargar botones", "error");
        }
    };

    const showGesviNotice = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passInput === "admin") {
            setIsAuthenticated(true);
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
                showGesviNotice(editingId ? "¡FAQ actualizada!" : "¡FAQ guardada con éxito!");
                setEditingId(null);
                setNewFaq({ pregunta: '', respuesta: '', palabras_clave: '' });
                fetchFaqs(); 
            }
        } catch (e) { 
            showGesviNotice("Error de conexión", "error"); 
        }
    };

    // FUNCION DE BORRADO ACTUALIZADA (Sin alert feo)
    const executeDelete = async () => {
        const id = deleteConfirm.id;
        try {
            const res = await fetch(`http://localhost:5000/api/faqs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showGesviNotice("Botón eliminado", "success");
                fetchFaqs();
            }
        } catch (e) { 
            showGesviNotice("Error al eliminar", "error"); 
        } finally {
            setDeleteConfirm({ show: false, id: null }); // Cerramos modal siempre
        }
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        setNewFaq({ 
            pregunta: faq.pregunta, 
            respuesta: faq.respuesta, 
            palabras_clave: faq.palabras_clave 
        });
        window.scrollTo(0, 0); 
    };

    return (
        <div className="main-wrapper">
            {/* 1. TOAST GESVI */}
            {toast.show && (
                <div className={`gesvi-toast ${toast.type}`}>
                    <img src="/logo.png" alt="Gesvi" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* 2. MODAL DE CONFIRMACIÓN PERSONALIZADO */}
            {deleteConfirm.show && (
                <div className="gesvi-modal-overlay">
                    <div className="gesvi-modal">
                        <img src="/logo.png" alt="Gesvi" className="modal-logo" />
                        <h3>¿Eliminar este botón?</h3>
                        <p>Esta acción no se puede deshacer.</p>
                        <div className="modal-actions">
                            <button className="btn-confirm-delete" onClick={executeDelete}>Eliminar</button>
                            <button className="btn-cancel-modal" onClick={() => setDeleteConfirm({ show: false, id: null })}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {!isAuthenticated ? (
                <div className="login-overlay">
                    <div className="login-card">
                        <img src="/logo.png" alt="Gesvi" className="login-logo" />
                        <h3>Acceso Administración</h3>
                        <form onSubmit={handleLogin}>
                            <input type="password" placeholder="Clave" value={passInput} onChange={(e) => setPassInput(e.target.value)} autoFocus />
                            <div className="login-actions">
                                <button type="submit" className="btn-confirm">Entrar</button>
                                <button type="button" className="btn-cancel-login" onClick={() => navigate('/')}>Cancelar</button>
                            </div>
                        </form>
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
                            <input 
                                placeholder="Dale un nombre corto a este botón (ej: Conectar Lector)" 
                                value={newFaq.pregunta} 
                                onChange={e => setNewFaq({...newFaq, pregunta: e.target.value})} 
                                required 
                            />

                            <label>Respuesta oficial</label>
                            <textarea 
                                rows="3" 
                                value={newFaq.respuesta} 
                                onChange={e => setNewFaq({...newFaq, respuesta: e.target.value})} 
                                required 
                                style={{ resize: 'none' }} 
                                placeholder="Escribe aquí la respuesta oficial..." 
                            />

                            <label>Palabras clave</label>
                            <input value={newFaq.palabras_clave} onChange={e => setNewFaq({...newFaq, palabras_clave: e.target.value})} placeholder="Ej: lector, conectar, falla" />

                            <div className="admin-form-actions">
                                <button type="submit" className="btn-gesvi-save">
                                    {editingId ? "Actualizar Cambios" : "Guardar Nueva FAQ"}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn-cancel-edit" onClick={() => {setEditingId(null); setNewFaq({pregunta:'', respuesta:'', palabras_clave:''})}}>
                                        Cancelar
                                    </button>
                                )}
                                <button type="button" className="btn-gesvi-back" onClick={() => navigate('/')}>Volver al Chat</button>
                            </div>
                        </form>

                        <div className="admin-divider"></div>
                        <div className="admin-list-section">
                            <h3>Gestión de botones actuales</h3>
                            <div className="admin-faq-list">
                                {faqs.map(faq => (
                                    <div key={faq.id} className="admin-faq-item">
                                        <div className="faq-info">
                                            <strong>{faq.pregunta}</strong>
                                        </div>
                                        <div className="item-actions">
                                            <button className="btn-edit" onClick={() => startEdit(faq)}>Editar</button>
                                            <button className="btn-delete" onClick={() => setDeleteConfirm({ show: true, id: faq.id })}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;