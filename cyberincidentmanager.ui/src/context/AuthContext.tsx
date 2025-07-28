import { createContext, useState } from 'react';

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
    setAuth: () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<AuthState | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
