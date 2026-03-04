import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './ChatInterface'; // Este está en la raíz de src
import AdminPage from './pages/AdminPage';   // IMPORTANTE: Está dentro de la carpeta 'pages'
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Lo que ven los clientes */}
                <Route path="/" element={<ChatInterface />} />

                {/* TU LINK EXTERNO: Entra aquí para configurar */}
                <Route path="/panel-control-secreto" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;