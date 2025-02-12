import { LoginFormData, RegisterFormData, LoginResponse, GetMe } from "../types/authTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
    async login(data: LoginFormData): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to login");
        }

        const payload: LoginResponse = await response.json();
        return payload || null;
    },

    async register(data: RegisterFormData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register");
        }

        return;
    },

    async getMe(token: string): Promise<GetMe> {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to access");
        }

        return await response.json();
    },
};