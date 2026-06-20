import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import logo from "../assets/logo.png";
import "./styles/Auth.css";

export default function Auth() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(location.pathname === "/register");
    const clickCountRef = useRef(0);

    const handleLogoClick = () => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 5) {
            navigate("/admin");
            clickCountRef.current = 0; // Reset after triggering
        }

        // Auto reset if they stop clicking (optional but good for easter eggs)
        clearTimeout(window.logoClickTimeout);
        window.logoClickTimeout = setTimeout(() => {
            clickCountRef.current = 0;
        }, 2000);
    };

    useEffect(() => {
        setIsSignUp(location.pathname === "/register");
    }, [location.pathname]);

    useEffect(() => {
        window.switchToRegister = () => setIsSignUp(true);
        window.switchToLogin = () => setIsSignUp(false);

        return () => {
            delete window.switchToRegister;
            delete window.switchToLogin;
        };
    }, []);

    return (
        <div className="auth-page-wrapper">
            <main className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
                {/* Register Form Panel */}
                <div className="form-container sign-up-container">
                    <Register />
                </div>

                {/* Login Form Panel */}
                <div className="form-container sign-in-container">
                    <Login />
                </div>

                {/* Sliding Image Overlay */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <img src={logo} alt="CVBuilders Logo" className="auth-logo" onClick={handleLogoClick} />
                            <h2 className="overlay-title">CVBuilders</h2>
                            <p className="overlay-text">La mejor herramienta para tu carrera profesional.</p>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <img src={logo} alt="CVBuilders Logo" className="auth-logo" onClick={handleLogoClick} />
                            <h2 className="overlay-title">CVBuilders</h2>
                            <p className="overlay-text">Diseña tu currículum perfecto en minutos.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
