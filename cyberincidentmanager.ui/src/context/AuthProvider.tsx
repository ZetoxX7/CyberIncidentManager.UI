import React, { useState, type ReactNode } from 'react';
import { AuthContext, AuthState } from './AuthContext';

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [auth, setAuth] = useState<AuthState | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};