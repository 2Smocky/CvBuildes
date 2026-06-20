import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/admin_login.css";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { adminLogin } from "../services/authService";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await adminLogin(email, password);
            localStorage.setItem("adminAuth", "true");
            navigate("/admin/panel");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: error.message || "Credenciales incorrectas",
                confirmButtonText: "Intentar de nuevo"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-wrapper">
            <main className="admin-container">
                <div className="admin-image-side">
                    <div className="admin-overlay-text">
                        <img src={logo} alt="CVBuilders Logo" className="admin-logo" />
                        <h2 className="overlay-title">Acceso Restringido</h2>
                        <p className="overlay-text">Área exclusiva para personal administrativo.</p>
                    </div>
                </div>
                
                <div className="admin-form-side">
                    <div className="admin-form-wrapper">
                        <h1 className="admin-title">Admin Login</h1>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-input-group">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="admin-input-group">
                                <label>Clave de acceso</label>
                                <div className="admin-password-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="admin-toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title="Mostrar/Ocultar contraseñas"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {showPassword ? (
                                                <>
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="admin-btn-primary" disabled={loading}>
                                {loading ? "Verificando..." : "Ingresar al sistema"}
                            </button>
                        </form>
                        
                        <div style={{ textAlign: "center", marginTop: "30px" }}>
                            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }} style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none" }}>
                                Volver al portal de usuarios
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
