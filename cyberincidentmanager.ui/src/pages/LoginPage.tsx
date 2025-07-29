import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios, { type AxiosError } from 'axios';

export default function LoginPage() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:7173/api/auth/login', {
                email,
                password
            });

            if (res.data === 'MFA_REQUIRED') {
                localStorage.setItem('mfaUserEmail', email); // pour retrouver l’ID ensuite si besoin
                navigate('/mfa');
                return;
            }

            const { accessToken, refreshToken, expiration } = res.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('expiration', expiration);

            const decoded = JSON.parse(atob(accessToken.split('.')[1]));
            const { email: userEmail, role, nameid } = decoded;

            setAuth({
                accessToken,
                refreshToken,
                email: userEmail,
                role,
                userId: nameid
            });

            navigate('/dashboard');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setError(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4 text-center font-semibold">Connexion</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1">Mot de passe</label>
                    <input
                        type="password"
                        required
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Se connecter
                </button>
            </form>
        </div>
    );
}