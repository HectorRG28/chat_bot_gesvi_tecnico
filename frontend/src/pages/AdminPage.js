import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newFaq, setNewFaq] = useState({ pregunta: '', respuesta: '', palabras_clave: '' });

    // Protección por contraseña al cargar
    useEffect(() => {
        const pass = prompt("Acceso Restringido. Introduce la clave:");
        if (pass === "admin") {
            setIsAuthenticated(true);
        } else {
            alert("Clave incorrecta");
            navigate('/');
        }
    }, [navigate]);

    const saveFaq = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaq)
            });
            if (res.ok) {
                alert("✅ Pregunta añadida correctamente");
                setNewFaq({ pregunta: '', respuesta: '', palabras_clave: '' });
            }
        } catch (error) {
            alert("❌ Error al conectar con el servidor");
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="admin-container">
            <div className="admin-card">
                <header className="admin-header">
                    <img src="/logo.png" alt="Gesvi" className="admin-logo" />
                    <h1>Panel de Control Gesvi Bot</h1>
                </header>
                
                <form onSubmit={saveFaq} className="admin-form">
                    <label>Título del Botón (Pregunta corta)</label>
                    <input 
                        type="text" 
                        value={newFaq.pregunta} 
                        onChange={e => setNewFaq({...newFaq, pregunta: e.target.value})} 
                        placeholder="Ej: ¿Cómo instalar el lector?" 
                        required 
                    />

                    <label>Respuesta Automática del Bot</label>
                    <textarea 
                        rows="5"
                        value={newFaq.respuesta} 
                        onChange={e => setNewFaq({...newFaq, respuesta: e.target.value})} 
                        placeholder="Escribe aquí la respuesta oficial..." 
                        required 
                    />

                    <label>Palabras Clave (Separadas por comas)</label>
                    <input 
                        type="text" 
                        value={newFaq.palabras_clave} 
                        onChange={e => setNewFaq({...newFaq, palabras_clave: e.target.value})} 
                        placeholder="Ej: instalacion, driver, configurar" 
                    />

                    <div className="admin-buttons">
                        <button type="submit" className="btn-save">Guardar Nueva FAQ</button>
                        <button type="button" className="btn-back" onClick={() => navigate('/')}>Volver al Chat</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminPage;