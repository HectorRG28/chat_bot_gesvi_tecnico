import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './ChatInterface'; 
import AdminPage from './pages/AdminPage'; 
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Lo que ve el cliente final */}
                <Route path="/" element={<ChatInterface />} />

                {/* Tu panel secreto con el cajón no editable que ya te funciona */}
                <Route path="/panel-control-secreto" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;