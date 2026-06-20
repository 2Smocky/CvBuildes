import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { createAdminLog } from "./adminService";

export async function downloadCV() {
    const user = auth.currentUser;
    if (!user) throw new Error("No estás autenticado");

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            throw new Error("Usuario no encontrado.");
        }

        const credits = userSnap.data().credits || 0;

        if (credits <= 0) {
            throw new Error("No tienes créditos suficientes para descargar el CV.");
        }

        // Descontamos un crédito usando la operación atómica increment de Firestore
        await updateDoc(userRef, {
            credits: increment(-1)
        });

        // Registrar el consumo del crédito en los logs del administrador
        await createAdminLog("CONSUME_CREDIT", `Descarga de CV (crédito consumido) para el usuario ${user.uid}`);

        return { message: "Crédito descontado exitosamente." };
    } catch (error) {
        throw new Error(error.message || "No se pudo descargar el CV o descontar créditos.");
    }
}
