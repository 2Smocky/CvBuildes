import { db, auth } from "../firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const getDraftsCollection = () => collection(db, "cv_drafts");

function checkAuth() {
    const user = auth.currentUser;
    if (!user) throw new Error("No estás autenticado");
    return user;
}

export async function getDrafts() {
    const user = checkAuth();
    const q = query(getDraftsCollection(), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveDraft(titulo, data) {
    try {
        const user = checkAuth();
        const docRef = await addDoc(getDraftsCollection(), {
            userId: user.uid,
            titulo: titulo || "Borrador sin título",
            data: data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return { id: docRef.id, titulo, data };
    } catch (error) {
        throw new Error(error.message || "Error al guardar el borrador");
    }
}

export async function updateDraft(id, data) {
    try {
        checkAuth();
        const draftRef = doc(db, "cv_drafts", id);
        await updateDoc(draftRef, {
            data: data,
            updatedAt: new Date().toISOString()
        });
        return { message: "Borrador actualizado" };
    } catch (error) {
        throw new Error(error.message || "Error al actualizar el borrador");
    }
}

export async function getDraft(id) {
    checkAuth();
    const draftRef = doc(db, "cv_drafts", id);
    const draftSnap = await getDoc(draftRef);
    if (!draftSnap.exists()) throw new Error("Borrador no encontrado");
    return { id: draftSnap.id, ...draftSnap.data() };
}

export async function deleteDraft(id) {
    try {
        checkAuth();
        const draftRef = doc(db, "cv_drafts", id);
        await deleteDoc(draftRef);
        return { message: "Borrador eliminado" };
    } catch (error) {
        throw new Error("Error al eliminar borrador");
    }
}

export async function renameDraft(id, newTitle) {
    try {
        checkAuth();
        const draftRef = doc(db, "cv_drafts", id);
        await updateDoc(draftRef, {
            titulo: newTitle,
            updatedAt: new Date().toISOString()
        });
        return { message: "Nombre de borrador actualizado" };
    } catch (error) {
        throw new Error("Error al renombrar el borrador");
    }
}
