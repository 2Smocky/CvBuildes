import React, { useEffect, useState } from "react";
import { getUsers, updateCredits } from "../../services/adminService";
import Swal from "sweetalert2";
import "../style/credits.css";

export default function ManageCredits() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [credits, setCredits] = useState("");
    const [action, setAction] = useState("add");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
            }
        };
        fetchUsers();
    }, []);

    const handleCredits = async () => {
        if (!selectedUser || !credits) {
            Swal.fire("Error", "Selecciona un usuario y una cantidad válida", "warning");
            return;
        }

        try {
            await updateCredits(selectedUser.id, Number(credits), action);
            Swal.fire("Éxito", `Créditos actualizados correctamente`, "success");
            setCredits("");
            // Refresh user list to show updated credits
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setSelectedUser(updatedUsers.find(u => u.id === selectedUser.id));
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron actualizar los créditos", "error");
        }
    };

    const filteredUsers = users.filter(
        u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2 className="title-seccion-admin">Administrar Créditos</h2>

            <div className="credits-layout">
                {/* Left Column: Search & List */}
                <div className="credits-panel">
                    <h3>Seleccionar Usuario</h3>
                    <input
                        type="text"
                        className="credits-input"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <ul className="user-list">
                        {filteredUsers.length > 0 ? filteredUsers.map(u => (
                            <li
                                key={u.id}
                                className={selectedUser?.id === u.id ? "selected" : ""}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className="user-info">
                                    <span className="user-name">{u.name}</span>
                                    <span className="user-email">{u.email}</span>
                                </div>
                                <div className="user-credits-badge">
                                    {u.credits} cr
                                </div>
                            </li>
                        )) : (
                            <li className="no-results">No se encontraron usuarios</li>
                        )}
                    </ul>
                </div>

                {/* Right Column: Actions */}
                <div className="credits-panel">
                    <h3>Acciones</h3>
                    {selectedUser ? (
                        <div className="action-container">
                            <div className="selected-user-card">
                                <div className="avatar-placeholder">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="details">
                                    <h4>{selectedUser.name}</h4>
                                    <p>{selectedUser.email}</p>
                                    <div className="current-credits">
                                        Créditos actuales: <strong>{selectedUser.credits}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="action-form">
                                <label>Cantidad de Créditos</label>
                                <input
                                    type="number"
                                    className="credits-input large-number"
                                    placeholder="0"
                                    value={credits}
                                    onChange={e => setCredits(e.target.value)}
                                    min="1"
                                />

                                <label>Tipo de Operación</label>
                                <div className="segmented-control">
                                    <button 
                                        className={action === "add" ? "active" : ""} 
                                        onClick={() => setAction("add")}
                                    >
                                        Sumar
                                    </button>
                                    <button 
                                        className={action === "subtract" ? "active" : ""} 
                                        onClick={() => setAction("subtract")}
                                    >
                                        Restar
                                    </button>
                                    <button 
                                        className={action === "set" ? "active" : ""} 
                                        onClick={() => setAction("set")}
                                    >
                                        Fijar
                                    </button>
                                </div>

                                <button className="submit-credits-btn" onClick={handleCredits}>
                                    Aplicar Cambios
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">👤</div>
                            <p>Selecciona un usuario de la lista para administrar sus créditos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
