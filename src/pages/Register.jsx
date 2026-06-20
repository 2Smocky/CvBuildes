import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser, loginWithGoogle } from "../services/authService";
import Swal from "sweetalert2";
import "./styles/Register.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const errors = [];
        if (password.length <= 6) {
            errors.push("La contraseña debe tener más de 6 caracteres.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("La contraseña debe contener al menos una letra mayúscula.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("La contraseña debe contener al menos un número.");
        }
        return errors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden.",
                icon: "error",
            });
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            Swal.fire({
                title: "Error en la contraseña",
                html: passwordErrors.join("<br>"),
                icon: "error",
            });
            return;
        }

        setLoading(true);

        try {
            await registerUser({ name, email, password });

            await Swal.fire({
                title: "¡Registro exitoso!",
                text: "Tu cuenta ha sido creada correctamente con 1 crédito gratis.",
                icon: "success",
                confirmButtonText: "Continuar",
            });

            navigate("/cv");
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error",
                text: err.message || "Error durante el registro",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    async function handleGoogleRegister() {
        try {
            await loginWithGoogle();
            navigate("/cv");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message || "No se pudo registrar con Google",
                icon: "error",
            });
        }
    }

    return (
        <div className="auth-form-wrapper register-form-wrapper">
            <h1 className="title1">Regístrate</h1>

            <form onSubmit={handleRegister} className="form">
                <div className="input-group">
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <div className="input-group">
                    <label>Confirmar Contraseña</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear cuenta"}
                </button>
            </form>

            <div className="divider">
                <span>o regístrate con</span>
            </div>

            <div className="social-login">
                <button onClick={handleGoogleRegister} className="btn-google" title="Google" type="button">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    <span>Continuar con Google</span>
                </button>
            </div>

            <div className="footer-link">
                <p style={{ color: '#9ca3af', margin: 0, marginBottom: '6px', fontSize: '13px' }}>¿Ya tienes cuenta?</p>
                <a onClick={(e) => {
                    e.preventDefault();
                    if (window.switchToLogin) window.switchToLogin();
                }}>
                    Inicia sesión aquí
                </a>
            </div>
        </div>
    );
}
