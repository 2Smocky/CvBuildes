import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Auth from "./pages/Auth";
import CVBuilder from "./pages/CVBuilder";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import AdminLogin from "./admin/AdminLogin";
import AdminPanel from "./admin/AdminPanel";
import AdminRoute from "./admin/routes/AdminRoute";

function App() {
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
            setIsMobileDevice(isMobile);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Bloquear menú contextual (click derecho)
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Bloquear atajos de teclado de desarrollador e impresión
        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            const key = e.key.toLowerCase();

            if (
                e.key === 'F12' ||
                (isCtrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
                (isCtrlOrCmd && (key === 'u' || key === 's' || key === 'p'))
            ) {
                e.preventDefault();
                
                let msg = "No está permitido inspeccionar el código.";
                if (key === 'p') msg = 'Por favor, usa el botón "Exportar PDF" de la aplicación para descargar tu currículum.';

                Swal.fire({
                    title: 'Acción Restringida',
                    text: msg,
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6'
                });
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (isMobileDevice) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0f172a',
                color: '#fff',
                padding: '2rem',
                textAlign: 'center',
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
            }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px', marginBottom: '1.5rem', color: '#3b82f6' }}>
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>Solo disponible en PC</h1>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', maxWidth: '400px' }}>
                    Para ofrecerte las mejores herramientas de diseño, esta plataforma está optimizada exclusivamente para computadores y portátiles.
                    <br /><br />
                    Por favor, ingresa desde tu ordenador para crear y editar tu currículum.
                </p>
            </div>
        );
    }

    return (
        <AuthProvider>
            <Routes>

                {/* Unified Auth Page (Login & Register with slider animation) */}
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />

                {/* Panel normal protegido */}
                <Route
                    path="/cv"
                    element={
                        <PrivateRoute>
                            <CVBuilder />
                        </PrivateRoute>
                    }
                />

                {/* 🟦 ADMIN LOGIN */}
                <Route path="/admin" element={<AdminLogin />} />

                {/* 🟩 ADMIN PANEL (Protegido) */}
                <Route
                    path="/admin/panel"
                    element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    }
                />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
