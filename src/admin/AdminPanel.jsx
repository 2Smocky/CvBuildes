import React, { useState } from "react";
import SidebarAdmin from "./components/SidebarAdmin";
import DashboardStats from "./components/DashboardStats";
import UsersTable from "./components/UsersTable";
import AddCredits from "./components/Credits";
import LogsTable from "./components/LogsTable";

export default function AdminPanel() {
    const [section, setSection] = useState("dashboard");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="admin-page-wrapper admin-panel-layout">
            {/* Botón hamburguesa (solo móvil) */}
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <SidebarAdmin
                section={section}
                setSection={setSection}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            {/* Overlay oscuro cuando el menú está abierto */}
            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

            <div className="admin-content">
                {section === "dashboard" && <DashboardStats />}
                {section === "users" && <UsersTable />}
                {section === "credits" && <AddCredits />}
                {section === "logs" && <LogsTable />}
            </div>
        </div>
    );
}
