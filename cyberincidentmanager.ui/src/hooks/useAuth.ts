import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

export const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const isAuthenticated = !!auth?.accessToken;
    const role = auth?.role || '';
    const userId = typeof auth?.userId === 'number' ? auth.userId : 0;
    const email = auth?.email || '';

    const isAdmin = role === 'Admin';
    const isAnalyst = role === 'Analyst';
    const isEmployee = role === 'Employ�';

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