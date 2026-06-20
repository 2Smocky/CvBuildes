import "../style/sidebar_admin.css";
import logo from "../../assets/logo.png";

export default function SidebarAdmin({ section, setSection, menuOpen, setMenuOpen }) {
    return (
        <div className="admin-sidebar">
            <div className="logo">
                <img src={logo} alt="CVBuilders Logo" className="sidebar-logo-img" />
                <span>Admin Panel</span>
            </div>

            <div className={`menu-items ${menuOpen ? "open" : ""}`}>
                <button className={section === "dashboard" ? "active" : ""} onClick={() => { setSection("dashboard"); setMenuOpen(false); }}>Dashboard</button>
                <button className={section === "users" ? "active" : ""} onClick={() => { setSection("users"); setMenuOpen(false); }}>Usuarios</button>
                <button className={section === "credits" ? "active" : ""} onClick={() => { setSection("credits"); setMenuOpen(false); }}>Créditos</button>
                <button className={section === "logs" ? "active" : ""} onClick={() => { setSection("logs"); setMenuOpen(false); }}>Ver Logs</button>

                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("adminAuth");
                        window.location.href = "/admin";
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

