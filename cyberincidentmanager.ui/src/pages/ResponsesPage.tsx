import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function ResponsesPage() {
    const { auth } = useContext(AuthContext);
    const [responses, setResponses] = useState([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchResponses = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const res = await axios.get('http://localhost:7173/api/responses', config);
            setResponses(res.data);
            setFiltered(res.data);
        };

        fetchResponses();
    }, [auth]);

    useEffect(() => {
        const term = search.toLowerCase();
        const result = responses.filter((r: any) =>
            r.action.toLowerCase().includes(term) ||
            r.user?.email.toLowerCase().includes(term) ||
            r.incident?.title.toLowerCase().includes(term)
        );
        setFiltered(result);
    }, [search, responses]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des réponses</h1>

            <input
                type="text"
                placeholder="Rechercher par action, utilisateur ou incident..."
                className="border p-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Action</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Utilisateur</th>
                        <th className="p-2">Incident lié</th>
                        <th className="p-2">Détails</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((r: any) => (
                        <tr key={r.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{r.action}</td>
                            <td className="p-2">{r.isSuccessful ? '✅ Succès' : '❌ Échec'}</td>
                            <td className="p-2">{r.user?.email}</td>
                            <td className="p-2">{r.incident?.title}</td>
                            <td className="p-2 text-sm text-gray-600">{r.details || '—'}</td>
                            <td className="p-2 text-sm">{new Date(r.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}