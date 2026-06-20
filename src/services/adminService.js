import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, increment, getCountFromServer, query, orderBy, addDoc, where } from "firebase/firestore";

// Helper para crear logs
export const createAdminLog = async (action, details) => {
    try {
        await addDoc(collection(db, "admin_logs"), {
            action,
            details,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("No se pudo crear el log", e);
    }
};

export const getStats = async () => {
    try {
        const usersSnap = await getCountFromServer(collection(db, "users"));
        const draftsSnap = await getCountFromServer(collection(db, "cv_drafts"));
        
        const consumeQuery = query(collection(db, "admin_logs"), where("action", "==", "CONSUME_CREDIT"));
        const consumeSnap = await getCountFromServer(consumeQuery);
        
        return {
            totalUsers: usersSnap.data().count,
            totalDrafts: draftsSnap.data().count,
            totalConsumedCredits: consumeSnap.data().count
        };
    } catch (error) {
        console.error("Error obteniendo estadísticas", error);
        return { totalUsers: 0, totalDrafts: 0, totalConsumedCredits: 0 };
    }
};

export const getUsers = async () => {
    try {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error obteniendo usuarios", error);
        return [];
    }
};

export const getWeeklyGrowth = async () => {
    try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => doc.data());
        
        // Inicializar los últimos 7 días
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const today = new Date();
        const growthData = [];

        // Pre-llenar el arreglo con los últimos 7 días en orden
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            growthData.push({
                name: days[d.getDay()],
                dateString: d.toISOString().split('T')[0], // yyyy-mm-dd para buscar coincidencias
                usuarios: 0
            });
        }

        // Contar usuarios agrupados por fecha
        users.forEach(user => {
            if (user.createdAt) {
                const userDate = user.createdAt.split('T')[0];
                const dayMatch = growthData.find(d => d.dateString === userDate);
                if (dayMatch) {
                    dayMatch.usuarios += 1;
                }
            }
        });

        return growthData;
    } catch (error) {
        console.error("Error obteniendo crecimiento", error);
        return [];
    }
};

export const updateCredits = async (userId, amount, action) => {
    try {
        const userRef = doc(db, "users", userId);
        let updateData = {};
        if (action === 'set') {
            updateData.credits = Number(amount);
        } else {
            const incrementValue = action === 'add' ? Number(amount) : -Number(amount);
            updateData.credits = increment(incrementValue);
        }
        
        await updateDoc(userRef, updateData);
        
        await createAdminLog("UPDATE_CREDITS", `Créditos modificados para el usuario ${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Error actualizando créditos", error);
        throw new Error("No se pudieron actualizar los créditos");
    }
};

export const toggleUserStatus = async (userId, status) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { status });
        
        await createAdminLog("TOGGLE_STATUS", `Estado cambiado a ${status} para el usuario ${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Error cambiando estado", error);
        throw new Error("No se pudo cambiar el estado del usuario");
    }
};

export const changeUserRole = async (userId, newRole) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
        
        await createAdminLog("CHANGE_ROLE", `Rol cambiado a ${newRole} para el usuario ${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Error cambiando rol", error);
        throw new Error("No se pudo cambiar el rol del usuario");
    }
};

export const getLogs = async () => {
    try {
        const q = query(collection(db, "admin_logs"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error obteniendo logs", error);
        return [];
    }
};
