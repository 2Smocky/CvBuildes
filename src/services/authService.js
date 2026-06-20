import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw { message: error.message || "Error al iniciar sesión" };
    }
}

export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user doc exists, if not, create it with 1 credit
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName || "Usuario Google",
                email: user.email,
                credits: 0,
                status: "active",
                role: "user",
                createdAt: new Date().toISOString()
            });
        }
        return user;
    } catch (error) {
        throw { message: error.message || "Error con Google Sign-In" };
    }
}

export async function register(data) {
    try {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore with 1 initial credit
        await setDoc(doc(db, "users", user.uid), {
            name: name || "Nuevo Usuario",
            email: user.email,
            credits: 0,
            status: "active",
            role: "user",
            createdAt: new Date().toISOString()
        });

        // Asegurar que el tutorial se reproduzca para la nueva cuenta
        localStorage.removeItem("hasSeenTour");

        return user;
    } catch (error) {
        throw { message: error.message || "Error al registrarse" };
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw { message: error.message || "Error al enviar el correo de recuperación" };
    }
}

export function saveToken(token) {
    // Firebase manages session automatically
    localStorage.setItem("token", token);
}

export function getToken() {
    // Legacy support, Firebase handles tokens internally
    return localStorage.getItem("token");
}

export async function logout() {
    await signOut(auth);
    localStorage.removeItem("token");
}

export async function adminLogin(email, password) {
    try {
        // 1. Iniciar sesión en Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Verificar el rol en Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await signOut(auth);
            throw new Error("Usuario no encontrado en la base de datos.");
        }

        const userData = userSnap.data();

        // 3. Validar si es admin
        if (userData.role !== "admin") {
            await signOut(auth);
            throw new Error("Acceso denegado. No tienes permisos de administrador.");
        }

        return user;
    } catch (error) {
        throw { message: error.message || "Credenciales incorrectas o error de acceso." };
    }
}

