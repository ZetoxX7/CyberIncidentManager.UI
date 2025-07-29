import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Définition des types
interface User {
    id: number;
    email: string;
    role: { name: string };
}

interface Asset {
    id: number;
    name: string;
}

interface IncidentType {
    id: number;
    name: string;
}

interface Incident {
    id: number;
    title: string;
    description: string;
    status: string;
    severity: string;
    type?: IncidentType;
    asset?: Asset | null;
    reportedByUser?: User;
    assignedToUser?: User | null;
}

interface ResponseItem {
    id: number;
    action: string;
    details: string;
    isSuccessful: boolean;
    user: User;
    incident: { id: number };
}

export default function IncidentDetailPage() {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [responses, setResponses] = useState<ResponseItem[]>([]);
    const [showForm, setShowForm] = useState(false);

    const [action, setAction] = useState('');
    const [details, setDetails] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(true);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };

            const [incidentRes, responseRes] = await Promise.all([
                axios.get(`http://localhost:7173/api/incidents/${id}`, config),
                axios.get(`http://localhost:7173/api/responses`, config)
            ]);

            setIncident(incidentRes.data);
            setResponses(responseRes.data.filter((r: ResponseItem) => r.incident.id === parseInt(id!)));
        };

        fetchData();
    }, [id, auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        if (!auth || !auth.accessToken) return;

        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };

        await axios.post('http://localhost:7173/api/responses', {
            incidentId: parseInt(id!),
            userId: parseInt(String(auth.userId)),
            action,
            details,
            isSuccessful
        }, config);

        setShowForm(false);
        setAction('');
        setDetails('');
        setIsSuccessful(true);

        // Recharger les réponses
        const res = await axios.get('http://localhost:7173/api/responses', config);
        setResponses(res.data.filter((r: ResponseItem) => r.incident.id === parseInt(id!)));
    };

    if (!incident) return <p className="p-6">Chargement...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Détail de l'incident</h1>

            <div className="bg-white p-4 rounded shadow mb-6">
                <p><strong>Titre :</strong> {incident.title}</p>
                <p><strong>Description :</strong> {incident.description}</p>
                <p><strong>Statut :</strong> {incident.status}</p>
                <p><strong>Sévérité :</strong> {incident.severity}</p>
                <p><strong>Type :</strong> {incident.type?.name}</p>
                <p><strong>Asset :</strong> {incident.asset?.name || '—'}</p>
                <p><strong>Signalé par :</strong> {incident.reportedByUser?.email}</p>
                <p><strong>Assigné à :</strong> {incident.assignedToUser?.email || '—'}</p>
            </div>

            <h2 className="text-xl font-semibold mb-2">Réponses associées</h2>
            {responses.length === 0 ? (
                <p>Aucune réponse pour cet incident.</p>
            ) : (
                <ul className="mb-6">
                    {responses.map((r) => (
                        <li key={r.id} className="border-t py-2">
                            ✅ {r.isSuccessful ? 'Succès' : 'Échec'} – <strong>{r.action}</strong> ({r.user.email})
                            <br />
                            <span className="text-sm text-gray-500">{r.details}</span>
                        </li>
                    ))}
                </ul>
            )}

            {auth && (auth.role === 'Admin' || auth.role === 'Analyst') && (
                <>
                    {!showForm ? (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => setShowForm(true)}
                        >
                            ➕ Ajouter une réponse
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-4 mt-4 rounded shadow space-y-4">
                            <input
                                type="text"
                                required
                                placeholder="Action réalisée"
                                className="w-full border p-2 rounded"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            />
                            <textarea
                                placeholder="Détails supplémentaires"
                                className="w-full border p-2 rounded"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                            <div>
                                <label className="mr-2">Statut :</label>
                                <select
                                    value={isSuccessful.toString()}
                                    onChange={(e) => setIsSuccessful(e.target.value === 'true')}
                                    className="border p-2 rounded"
                                >
                                    <option value="true">Succès</option>
                                    <option value="false">Échec</option>
                                </select>
                            </div>
                            <button className="bg-green-600 text-white px-4 py-2 rounded">Valider</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}