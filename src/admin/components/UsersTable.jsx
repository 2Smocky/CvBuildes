import React, { useEffect, useState } from "react";
import { getUsers, toggleUserStatus, changeUserRole } from "../../services/adminService";
import Swal from "sweetalert2";
import "../style/users_table.css";

export default function UsersTable() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = user.status === "active" ? "blocked" : "active";
            const actionText = newStatus === "blocked" ? "bloquear" : "activar";
            
            const confirm = await Swal.fire({
                title: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} usuario?`,
                text: `¿Estás seguro que deseas ${actionText} a ${user.name}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: newStatus === "blocked" ? '#ef4444' : '#4dc0b5',
                cancelButtonColor: '#374151',
                confirmButtonText: `Sí, ${actionText}`
            });

            if (confirm.isConfirmed) {
                await toggleUserStatus(user.id, newStatus);
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === user.id ? { ...u, status: newStatus } : u
                    )
                );
                Swal.fire('¡Hecho!', `Usuario ha sido ${newStatus === "blocked" ? "bloqueado" : "activado"}.`, 'success');
            }
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
        }
    };

    const handleRoleChange = async (user) => {
        try {
            const currentRole = user.role || "user";
            const newRole = currentRole === "admin" ? "user" : "admin";
            const roleName = newRole === "admin" ? "Administrador" : "Usuario estándar";
            
            const confirm = await Swal.fire({
                title: '¿Cambiar Rol?',
                text: `¿Deseas cambiar el rol de ${user.name} a ${roleName}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#374151',
                confirmButtonText: 'Sí, cambiar rol'
            });

            if (confirm.isConfirmed) {
                await changeUserRole(user.id, newRole);
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === user.id ? { ...u, role: newRole } : u
                    )
                );
                Swal.fire('¡Actualizado!', `El rol ahora es ${roleName}.`, 'success');
            }
        } catch (err) {
            console.error("Error al cambiar rol:", err);
            Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
        }
    };

    return (
        <div>
            <h2 className="title-seccion-admin">Gestión de Usuarios</h2>

            <div className="users-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Créditos</th>
                            <th>Borradores</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => {
                            const isBlocked = u.status === "blocked";
                            const isAdmin = u.role === "admin";

                            return (
                                <tr key={u.id} className={isBlocked ? "row-blocked" : ""}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className="user-info-text">
                                                <span className="user-name">{u.name || "Sin Nombre"}</span>
                                                <span className="user-email">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="center-col">
                                        <div className="credit-badge">{u.credits}</div>
                                    </td>
                                    <td className="center-col text-gray">{u.drafts_count || 0}</td>
                                    <td>
                                        <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                                            {isAdmin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${isBlocked ? 'badge-blocked' : 'badge-active'}`}>
                                            {isBlocked ? 'Bloqueado' : 'Activo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className={`action-btn ${isBlocked ? 'btn-activate' : 'btn-block'}`}
                                                onClick={() => handleToggleStatus(u)}
                                                title={isBlocked ? "Activar Usuario" : "Bloquear Usuario"}
                                            >
                                                {isBlocked ? 'Activar' : 'Bloquear'}
                                            </button>
                                            
                                            <button 
                                                className="action-btn btn-role"
                                                onClick={() => handleRoleChange(u)}
                                                title="Cambiar Rol"
                                            >
                                                {isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">Cargando usuarios...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
