import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function IncidentsPage() {
    const { auth } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchIncidents = async () => {
            const token = auth.accessToken;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get('http://localhost:7173/api/incidents', config);
            const userId = parseInt(String(auth.userId));

            const filteredByRole = res.data.filter((incident: any) => {
                if (auth.role === 'Admin') return true;
                if (auth.role === 'Analyst') return incident.assignedTo?.id === userId;
                if (auth.role === 'Employé') return incident.reportedBy === userId;
                return false;
            });

            setIncidents(filteredByRole);
            setFiltered(filteredByRole);
        };

        fetchIncidents();
    }, [auth]);

    useEffect(() => {
        const term = search.toLowerCase();
        const filteredList = incidents.filter((i: any) =>
            i.title.toLowerCase().includes(term) || i.status.toLowerCase().includes(term)
        );
        setFiltered(filteredList);
    }, [search, incidents]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des incidents</h1>

            <input
                type="text"
                placeholder="Rechercher par titre ou statut..."
                className="border p-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Titre</th>
                        <th className="p-2">Sévérité</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Assigné à</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((incident: any) => (
                        <tr key={incident.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{incident.title}</td>
                            <td className="p-2">{incident.severity}</td>
                            <td className="p-2">{incident.status}</td>
                            <td className="p-2">{incident.type?.name || '—'}</td>
                            <td className="p-2">{incident.assignedToUser?.email || '—'}</td>
                            <td className="p-2">
                                <Link
                                    to={`/incidents/${incident.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Voir
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}