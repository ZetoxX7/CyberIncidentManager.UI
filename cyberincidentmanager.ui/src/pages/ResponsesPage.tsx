import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Types stricts pour Response, User, Incident
interface Role {
    id: number;
    name: string;
    description?: string;
    permissions: string;
}

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

interface Incident {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    typeId: number;
    type?: { id: number; name: string };
    reportedBy: number;
    reportedByUser?: User;
    assignedTo?: number | null;
    assignedToUser?: User | null;
    createdAt: string;
    resolvedAt?: string | null;
    assetId?: number | null;
    asset?: { id: number; name: string } | null;
}

interface ResponseItem {
    id: number;
    incidentId: number;
    incident: Incident;
    userId: number;
    user: User;
    action: string;
    details?: string;
    timestamp: string;
    isSuccessful: boolean;
}

export default function ResponsesPage() {
    const { auth } = useContext(AuthContext);
    const [responses, setResponses] = useState<ResponseItem[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchResponses = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const res = await axios.get('http://localhost:7173/api/responses', config);
            setResponses(res.data);
        };

        fetchResponses();
    }, [auth]);

    const filtered = responses.filter((r) =>
        r.action.toLowerCase().includes(search.toLowerCase()) ||
        r.incident.title.toLowerCase().includes(search.toLowerCase()) ||
        r.user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Réponses aux incidents</h1>

            <input
                type="text"
                placeholder="Rechercher une réponse..."
                className="border p-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Incident</th>
                        <th className="p-2">Action</th>
                        <th className="p-2">Détails</th>
                        <th className="p-2">Utilisateur</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((r) => (
                        <tr key={r.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{r.incident.title}</td>
                            <td className="p-2">{r.action}</td>
                            <td className="p-2">{r.details || '—'}</td>
                            <td className="p-2">{r.user.email}</td>
                            <td className="p-2">{r.isSuccessful ? '✅ Succès' : '❌ Échec'}</td>
                            <td className="p-2">{new Date(r.timestamp).toLocaleString('fr-FR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}