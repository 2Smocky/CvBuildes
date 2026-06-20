import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle, resetPassword } from "../services/authService";
import Swal from "sweetalert2";
import "./styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            navigate("/cv");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message || "Correo o contraseña incorrectos",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            await loginWithGoogle();
            navigate("/cv");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message || "No se pudo iniciar sesión con Google",
                icon: "error",
            });
        }
    }

    return (
        <div className="auth-form-wrapper">
            <h1 className="title1">Bienvenido</h1>

            <form onSubmit={handleSubmit} className="form">
                <div className="input-group">
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            title="Mostrar/Ocultar contraseña"
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

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Cargando..." : "Entrar"}
                </button>
            </form>

            <div className="divider">
                <span>o inicia sesión con</span>
            </div>

            <div className="social-login">
                <button onClick={handleGoogleLogin} className="btn-google" title="Google" type="button">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    <span>Continuar con Google</span>
                </button>
            </div>

            <div className="footer-link">
                <a onClick={async (e) => { 
                    e.preventDefault();
                    const { value: formEmail } = await Swal.fire({
                        title: 'Recuperar Contraseña',
                        input: 'email',
                        inputLabel: 'Ingresa tu correo electrónico',
                        inputPlaceholder: 'correo@ejemplo.com',
                        showCancelButton: true,
                        confirmButtonText: 'Enviar enlace',
                        cancelButtonText: 'Cancelar'
                    });

                    if (formEmail) {
                        try {
                            Swal.fire({ title: 'Enviando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                            await resetPassword(formEmail);
                            Swal.fire('¡Enviado!', 'Revisa tu bandeja de entrada o la carpeta de spam para restablecer tu contraseña.', 'success');
                        } catch (err) {
                            Swal.fire('Error', 'No pudimos enviar el correo. Verifica que la dirección sea correcta o inténtalo más tarde.', 'error');
                        }
                    }
                }} style={{ cursor: 'pointer' }}>
                    ¿Olvidaste tu contraseña?
                </a>
                <br /><br />
                <a onClick={(e) => {
                    e.preventDefault();
                    if (window.switchToRegister) window.switchToRegister();
                }} style={{ color: '#9ca3af', textDecoration: 'underline' }}>
                    Crear cuenta nueva
                </a>
            </div>
        </div>
    );
}
