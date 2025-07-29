import { createContext } from 'react';

interface AuthState {
    accessToken: string;
    refreshToken: string;
    email: string;
    role: string;
    userId: number | string;
}

interface AuthContextType {
    auth: AuthState | null;
    setAuth: (auth: AuthState | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {}
});
export type { AuthState, AuthContextType };