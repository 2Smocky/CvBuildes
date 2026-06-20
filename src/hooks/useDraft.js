import { useState } from "react";
import { getDrafts, getDraft, saveDraft, updateDraft, deleteDraft, renameDraft } from "../services/draftService";
import Swal from "sweetalert2";

export function useDraft(cvData, setCvData, theme, setTheme, customTheme, setCustomTheme, setHasUnsavedChanges) {
    const [draftList, setDraftList] = useState([]);
    const [currentDraftId, setCurrentDraftId] = useState(null); // ⬅️ NUEVO

    const loadDrafts = async () => {
        try {
            const drafts = await getDrafts();
            setDraftList(drafts);
            return drafts; // ✅ Retornar la lista
        } catch {
            Swal.fire("Error", "No se pudieron cargar los borradores.", "error");
            return [];
        }
    };

    const handleSave = async () => {
        if (currentDraftId) {
            try {
                await updateDraft(currentDraftId, { content: cvData, theme, customTheme });
                setHasUnsavedChanges(false);
                Swal.fire("Actualizado", "El borrador se actualizó exitosamente.", "success");
                loadDrafts();
                return;
            } catch (error) {
                Swal.fire("Error", error.message || "No se pudo actualizar el borrador.", "error");
                return;
            }
        }

        if (draftList.length >= 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Límite alcanzado',
                text: 'Solo puedes tener un máximo de 10 borradores. Por favor, elimina uno antes de guardar otro nuevo.'
            });
            return;
        }

        const { value: titulo, isConfirmed } = await Swal.fire({
            title: "Guardar borrador",
            input: "text",
            inputLabel: "Nombre del borrador",
            inputPlaceholder: "Ej: Hoja de vida versión 1",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
        });

        if (isConfirmed && titulo) {
            Swal.fire({
                title: "Guardando borrador...",
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            try {
                const res = await saveDraft(titulo, { content: cvData, theme, customTheme });

                if (res?.id) {
                    setCurrentDraftId(res.id);
                    setHasUnsavedChanges(false);
                    Swal.fire("Guardado", "El borrador se guardó exitosamente.", "success");
                    loadDrafts();
                } else {
                    Swal.fire("Error", res.message || "No se pudo guardar el borrador.", "error");
                }
            } catch (error) {
                Swal.fire("Error", error.message || "No se pudo guardar el borrador.", "error");
            }
        }
    };

    const handleLoad = async (id) => {
        try {
            const draft = await getDraft(id);

            setCvData(draft.data.content);
            setTheme(draft.data.theme);
            if (draft.data.customTheme) setCustomTheme(draft.data.customTheme);

            setCurrentDraftId(id); // ⬅️ Guardar ID del borrador cargado
            setHasUnsavedChanges(false);

            Swal.fire("Restaurado", "El borrador ha sido cargado.", "success");
        } catch {
            Swal.fire("Error", "No se pudo cargar el borrador.", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDraft(id);

            // Si borró el que estaba usando → resetear estado
            if (id === currentDraftId) {
                setCurrentDraftId(null);
            }

            Swal.fire("Eliminado", "Borrador eliminado.", "success");
            loadDrafts();
        } catch {
            Swal.fire("Error", "No se pudo eliminar el borrador.", "error");
        }
    };

    const resetDraftId = () => {
        setCurrentDraftId(null);
    };

    const handleRename = async (id, newTitle) => {
        try {
            await renameDraft(id, newTitle);
            loadDrafts(); // Refrescar la lista silenciosamente
        } catch (error) {
            Swal.fire("Error", "No se pudo renombrar el borrador.", "error");
        }
    };

    return {
        draftList,
        currentDraftId,
        loadDrafts,
        saveDraft: handleSave,
        loadDraft: handleLoad,
        deleteDraft: handleDelete,
        renameDraft: handleRename,
        setCurrentDraftId,
        resetDraftId,
    };
}
