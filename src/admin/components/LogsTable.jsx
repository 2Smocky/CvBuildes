import React, { useEffect, useState, useCallback } from "react";
import { getLogs, getUsers } from "../../services/adminService";
import "../style/logs.css";

export default function LogsTable() {
    const [logs, setLogs] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);

    // --- FILTROS ---
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [date, setDate] = useState("");

    // --- PAGINACIÓN ---
    const [page, setPage] = useState(1);

    const loadData = useCallback(async (applyFilters = false) => {
        setLoading(true);

        const filters = { page };
        if (applyFilters) {
            if (search) filters.search = search;
            if (action) filters.action = action;
            if (date) filters.date = date;
        }

        try {
            // Load both users and logs in parallel
            const [logsData, usersData] = await Promise.all([
                getLogs(filters),
                getUsers()
            ]);

            // Create a lookup dictionary for users
            const uMap = {};
            usersData.forEach(u => {
                uMap[u.id] = { name: u.name, email: u.email };
            });
            setUsersMap(uMap);
            setLogs(logsData);
        } catch (err) {
            console.error("Error al cargar datos:", err);
        } finally {
            setLoading(false);
        }
    }, [page, search, action, date]);

    useEffect(() => {
        loadData(false);
    }, [loadData]);

    const handleFilter = () => {
        setPage(1);
        loadData(true);
    };

    // Helper function to extract user ID from details and format the text
    const formatLogDetails = (details) => {
        if (!details) return { user: "Sistema", text: "Acción del sistema", email: "" };
        
        // Search for user ID pattern
        const match = details.match(/usuario ([a-zA-Z0-9]+)$/);
        if (match) {
            const userId = match[1];
            const textWithoutId = details.replace(` el usuario ${userId}`, "");
            
            if (usersMap[userId]) {
                return { 
                    user: usersMap[userId].name || "Sin Nombre", 
                    email: usersMap[userId].email,
                    text: textWithoutId 
                };
            }
            return { user: "Usuario Desconocido", text: textWithoutId, email: userId };
        }
        
        return { user: "Sistema", text: details, email: "" };
    };

    // Helper for badge colors
    const getActionBadge = (actionName) => {
        switch (actionName) {
            case 'UPDATE_CREDITS': return 'badge-cyan';
            case 'TOGGLE_STATUS': return 'badge-red';
            case 'CHANGE_ROLE': return 'badge-purple';
            default: return 'badge-gray';
        }
    };

    if (loading && logs.length === 0) return <div className="loading-state">Cargando registros...</div>;

    return (
        <div>
            <h2 className="title-seccion-admin">Registros del sistema</h2>

            <div className="logs-container">
                {/* ---------------- FILTROS ---------------- */}
                <div className="logs-filters">
                    <div className="filter-group">
                        <input
                            type="text"
                            placeholder="Buscar registros..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select value={action} onChange={(e) => setAction(e.target.value)}>
                            <option value="">Todas las acciones</option>
                            <option value="UPDATE_CREDITS">Créditos</option>
                            <option value="TOGGLE_STATUS">Estado</option>
                            <option value="CHANGE_ROLE">Roles</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button className="filter-btn" onClick={handleFilter}>Filtrar</button>
                </div>

                {/* ---------------- TABLA ---------------- */}
                <div className="logs-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Log ID</th>
                                <th>Usuario Afectado</th>
                                <th>Acción</th>
                                <th>Detalle</th>
                                <th>Fecha y Hora</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-data">Sin resultados</td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const { user, email, text } = formatLogDetails(log.details);
                                    
                                    return (
                                        <tr key={log.id}>
                                            <td className="log-id">
                                                <span className="id-badge">#{log.id.substring(0, 6)}</span>
                                            </td>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-small">
                                                        {user !== "Sistema" ? user.charAt(0).toUpperCase() : "S"}
                                                    </div>
                                                    <div className="user-info-text">
                                                        <span className="user-name">{user}</span>
                                                        {email && <span className="user-email">{email}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`log-badge ${getActionBadge(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="log-details-text">{text}</td>
                                            <td className="log-date">
                                                {new Date(log.timestamp).toLocaleString([], { 
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
