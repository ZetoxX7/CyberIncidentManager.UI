import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface User {
    id: number;
    email: string;
}

export default function MFAForm() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        // Récupère l'utilisateur par email depuis l'API
        const fetchUserId = async () => {
            const email = localStorage.getItem('mfaUserEmail');
            if (!email) return setError("Email MFA manquant.");

            try {
                const res = await axios.get(`http://localhost:7173/api/users`);
                const user = res.data.find((u: User) => u.email === email);
                if (!user) return setError("Utilisateur non trouvé.");
                setUserId(user.id);
            } catch {
                setError("Erreur lors de la récupération de l'utilisateur.");
            }
        };

        fetchUserId();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!userId) return;

        try {
            const res = await axios.post('http://localhost:7173/api/auth/verify-mfa', {
                userId,
                code
            });

            const { accessToken, refreshToken, expiration } = res.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('expiration', expiration); // <-- Ajouté

            const decoded = JSON.parse(atob(accessToken.split('.')[1]));
            const { email, role, nameid } = decoded;

            setAuth({
                accessToken,
                refreshToken,
                email,
                role,
                userId: nameid
            });

            localStorage.removeItem('mfaUserEmail');
            navigate('/dashboard');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "Code incorrect.");
            } else {
                setError("Code incorrect.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-4 text-center font-semibold">Validation MFA</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Entrez votre code MFA"
                    className="w-full border p-2 rounded mb-4 text-center"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Valider
                </button>
            </form>
        </div>
    );
}