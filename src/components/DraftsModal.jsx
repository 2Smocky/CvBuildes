import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './DraftsModal.css';

export default function DraftsModal({
    isOpen,
    onClose,
    drafts,
    onLoadDraft,
    onDeleteDraft,
    onRenameDraft,
    setActiveDraft
}) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    if (!isOpen) return null;

    const handleEditClick = (draft) => {
        setEditingId(draft.id);
        setEditName(draft.titulo || `Borrador #${draft.id}`);
    };

    const handleSaveName = async (id) => {
        if (!editName.trim()) return;
        await onRenameDraft(id, editName);
        setEditingId(null);
    };

    const handleLoad = async (draft) => {
        Swal.fire({
            title: "Cargando borrador...",
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        try {
            setActiveDraft(draft.titulo || `Borrador #${draft.id}`);
            await onLoadDraft(draft.id);
            Swal.close();
            onClose();
        } catch {
            Swal.fire("Error", "No se pudo cargar el borrador.", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar borrador?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await onDeleteDraft(id);
            }
        });
    };

    return (
        <div className="drafts-modal-overlay">
            <div className="drafts-modal-content">
                <div className="drafts-modal-header">
                    <h2>Gestor de Borradores</h2>
                    <span className="drafts-count">{drafts.length} / 10 permitidos</span>
                    <button className="drafts-close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="drafts-list">
                    {drafts.length === 0 ? (
                        <div className="drafts-empty">No tienes borradores guardados aún.</div>
                    ) : (
                        drafts.map(draft => (
                            <div key={draft.id} className="draft-item">
                                {editingId === draft.id ? (
                                    <div className="draft-edit-mode">
                                        <input 
                                            type="text" 
                                            value={editName} 
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName(draft.id)}
                                        />
                                        <button onClick={() => handleSaveName(draft.id)} className="btn-save-name">Guardar</button>
                                        <button onClick={() => setEditingId(null)} className="btn-cancel-name">X</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="draft-info" onClick={() => handleLoad(draft)}>
                                            <span className="draft-title">{draft.titulo || `Borrador #${draft.id}`}</span>
                                            <span className="draft-date">{new Date(draft.createdAt || new Date()).toLocaleDateString()}</span>
                                        </div>
                                        <div className="draft-actions">
                                            <button className="btn-draft-action btn-load" onClick={() => handleLoad(draft)} title="Cargar">Cargar</button>
                                            <button className="btn-draft-action btn-edit" onClick={() => handleEditClick(draft)} title="Renombrar">&#9998;</button>
                                            <button className="btn-draft-action btn-delete" onClick={() => handleDelete(draft.id)} title="Eliminar">&#128465;</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
