import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newFaq, setNewFaq] = useState({ pregunta: '', respuesta: '', palabras_clave: '' });
    
    // Referencia para evitar que el prompt salga 2 veces en desarrollo
    const hasPrompted = useRef(false);

    useEffect(() => {
        if (hasPrompted.current) return;
        hasPrompted.current = true;

        const pass = prompt("Acceso Restringido - Tecnología Gesvi\nIntroduce la clave de administrador:");
        
        if (pass === "admin") {
            setIsAuthenticated(true);
        } else {
            alert("❌ Clave incorrecta. Redirigiendo...");
            navigate('/');
        }
    }, [navigate]);

    const saveFaq = async (e) => {
        e.preventDefault();
        
        // Validación simple antes de enviar
        if (!newFaq.pregunta || !newFaq.respuesta) {
            alert("Por favor, rellena los campos obligatorios.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaq)
            });

            if (res.ok) {
                alert("✅ ¡Éxito! El bot ya tiene la nueva información.");
                setNewFaq({ pregunta: '', respuesta: '', palabras_clave: '' });
            } else {
                alert("⚠️ El servidor respondió con un error.");
            }
        } catch (error) {
            alert("❌ Error de conexión: Asegúrate de que el Backend esté encendido.");
        }
    };

    // Si no está autenticado, no renderizamos nada para evitar "flashes" de contenido
    if (!isAuthenticated) return null;

    return (
        <div className="admin-container">
            <div className="admin-card">
                <header className="admin-header">
                    <img src="/logo.png" alt="Gesvi" className="admin-logo" />
                    <h1>Panel de Control Gesvi</h1>
                    <p>Configuración externa en tiempo real</p>
                </header>
                
                <form onSubmit={saveFaq} className="admin-form">
                    <div className="input-group">
                        <label htmlFor="pregunta">Título del Botón (Pregunta)</label>
                        <input 
                            id="pregunta"
                            type="text" 
                            value={newFaq.pregunta} 
                            onChange={e => setNewFaq({...newFaq, pregunta: e.target.value})} 
                            placeholder="Ej: ¿Dónde comprar?" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="respuesta">Respuesta oficial del Bot</label>
                        <textarea 
                            id="respuesta"
                            rows="5"
                            value={newFaq.respuesta} 
                            onChange={e => setNewFaq({...newFaq, respuesta: e.target.value})} 
                            placeholder="Escribe la respuesta que dará el bot..." 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="keywords">Palabras Clave (Opcional)</label>
                        <input 
                            id="keywords"
                            type="text" 
                            value={newFaq.palabras_clave} 
                            onChange={e => setNewFaq({...newFaq, palabras_clave: e.target.value})} 
                            placeholder="Ej: comprar, tienda, precio" 
                        />
                    </div>

                    <div className="admin-actions">
                        <button type="submit" className="btn-save">Publicar en el Bot</button>
                        <button type="button" className="btn-back" onClick={() => navigate('/')}>
                            Salir del Panel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminPage;