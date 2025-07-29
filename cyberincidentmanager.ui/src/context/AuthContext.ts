import { createContext } from 'react';

export interface AuthState {
    accessToken: string;
    refreshToken: string;
    email: string;
    role: string;
    userId: number;
}

export interface AuthContextType {
    auth: AuthState | null;
    setAuth: (auth: AuthState | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {
        throw new Error('setAuth must be used within an AuthProvider');
    },
});