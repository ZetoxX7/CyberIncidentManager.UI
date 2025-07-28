import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const isAuthenticated = !!auth?.accessToken;
    const role = auth?.role || '';
    const userId = parseInt(String(auth?.userId || '0'));
    const email = auth?.email || '';

    const isAdmin = role === 'Admin';
    const isAnalyst = role === 'Analyst';
    const isEmployee = role === 'Employé';

    return {
        auth,
        setAuth,
        isAuthenticated,
        role,
        userId,
        email,
        isAdmin,
        isAnalyst,
        isEmployee
    };
};