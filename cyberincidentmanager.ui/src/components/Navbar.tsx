import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

export default function Navbar() {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth) return null; // Pas connecté = pas de navbar

    const { role } = auth;

    const handleLogout = () => {
        localStorage.clear();
        setAuth(null);
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
            <div className="flex gap-6">
                <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>
                <NavLink to="/incidents" className="hover:underline">Incidents</NavLink>
                <NavLink to="/incident-types" className="hover:underline">Types</NavLink>
                <NavLink to="/assets" className="hover:underline">Assets</NavLink>
                <NavLink to="/responses" className="hover:underline">Réponses</NavLink>
                <NavLink to="/notifications" className="hover:underline">Notifications</NavLink>
                {(role === 'Admin' || role === 'Analyst') && (
                    <NavLink to="/incidents/create" className="hover:underline">➕ Créer incident</NavLink>
                )}
            </div>
            <div>
                <span className="mr-4">{auth.email}</span>
                <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Déconnexion</button>
            </div>
        </nav>
    );
}