import axios from 'axios';

const API_URL = 'http://localhost:7173/api/auth';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiration: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: { id: number; name: string };
}

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};

export const verifyMfa = async (userId: number, code: string) => {
    const res = await axios.post(`${API_URL}/verify-mfa`, { userId, code });
    return res.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
    const res = await axios.post<AuthResponse>(`${API_URL}/refresh`, token, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};

export const logout = async (accessToken: string) => {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    const res = await axios.post(`${API_URL}/logout`, {}, config);
    return res.data;
};

// Bonus : récupérer un utilisateur via son email (utile pour MFA)
export const getUserByEmail = async (accessToken: string, email: string): Promise<User | undefined> => {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    const res = await axios.get<User[]>(`http://localhost:5000/api/users`, config);
    return res.data.find((u: User) => u.email === email);
};