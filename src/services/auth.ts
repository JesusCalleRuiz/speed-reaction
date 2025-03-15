import api from "./api";
import axios from "axios";
import { toastController } from "@ionic/vue";
interface AuthResponse {
    token: string;
}

export async function register(name: string, email: string, password: string, password2: string) {
    if(password !== password2){
        showToast("Las contraseñas no coinciden");
        return;
    }
    try {
        const response = await api.post("/register", {
            name,
            email,
            password
        });

        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error: any) {
        console.error("Error en el registro:", error.response?.data || error.message);
        if (error.response?.data?.errors) {
            for (const key in error.response.data.errors) {
                showToast(error.response.data.errors[key]);
            }
        } else {
            showToast("Error inesperado, intenta de nuevo.");
        }
        throw error;
    }
}
async function showToast(message: string) {
    const toast = await toastController.create({
        message,
        duration: 5000,
        position: "top",
        color: "danger",
    });
    await toast.present();
}

export async function login(login: string, password: string): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>("/login", { login, password });
        localStorage.setItem("token", response.data.token);
        return response.data;
    }catch (error: any) {
        console.error("Error en el login:", error.response?.data || error.message);
        if (error.response?.data?.errors) {
            for (const key in error.response.data.errors) {
                showToast(error.response.data.errors[key]);
            }
        } else {
            showToast("Error inesperado, intenta de nuevo.");
        }
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
        await axios.post("https://speedreaction.dev-alicenter.es/api/logout");
    } catch (error) {
        console.error("Error al cerrar sesión:",error);
    }
    localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
}
