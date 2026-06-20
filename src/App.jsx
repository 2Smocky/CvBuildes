import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Auth from "./pages/Auth";
import CVBuilder from "./pages/CVBuilder";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import AdminLogin from "./admin/AdminLogin";
import AdminPanel from "./admin/AdminPanel";
import AdminRoute from "./admin/routes/AdminRoute";

function App() {
    useEffect(() => {
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
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
