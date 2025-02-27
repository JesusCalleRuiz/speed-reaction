import api from "./api";

interface AuthResponse {
    token: string;
}

export async function register(name: string, email: string, password: string) {
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
        throw error;
    }
}


export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
}

export async function logout(): Promise<void> {
    try {
        await api.post("/logout");
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
    localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
}
