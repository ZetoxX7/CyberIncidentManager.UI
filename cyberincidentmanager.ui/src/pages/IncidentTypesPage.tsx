import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

interface IncidentType {
    id: number;
    name: string;
    description?: string;
    defaultSeverity: string;
    color: string;
}

export default function IncidentTypesPage() {
    const { auth } = useContext(AuthContext);
    const [types, setTypes] = useState<IncidentType[]>([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<IncidentType[]>([]);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchTypes = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const res = await axios.get('http://localhost:7173/api/incidenttypes', config);
            setTypes(res.data);
            setFiltered(res.data);
        };

        fetchTypes();
    }, [auth]);

    useEffect(() => {
        const term = search.toLowerCase();
        const result = types.filter((t: IncidentType) =>
            t.name.toLowerCase().includes(term) ||
            t.description?.toLowerCase().includes(term)
        );
        setFiltered(result);
    }, [search, types]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Types d’incidents</h1>

            <input
                type="text"
                placeholder="Rechercher un type..."
                className="border p-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Nom</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Gravité par défaut</th>
                        <th className="p-2">Couleur</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((type: IncidentType) => (
                        <tr key={type.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{type.name}</td>
                            <td className="p-2 text-sm text-gray-700">{type.description || '—'}</td>
                            <td className="p-2">{type.defaultSeverity}</td>
                            <td className="p-2">
                                <span
                                    className="inline-block w-5 h-5 rounded-full border"
                                    style={{ backgroundColor: type.color }}
                                    title={type.color}
                                ></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}