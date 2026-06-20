import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getCredits() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            throw new Error("Usuario no encontrado en la base de datos.");
        }

        return { credits: userSnap.data().credits || 0 };
    } catch (error) {
        throw new Error(error.message || "No se pudo obtener tu balance de créditos.");
    }
}
