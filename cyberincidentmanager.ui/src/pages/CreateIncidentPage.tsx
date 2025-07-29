import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface IncidentType {
    id: number;
    name: string;
}

interface Asset {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
    role: { name: string };
}

export default function CreateIncidentPage() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('Low');
    const [status, setStatus] = useState('Open');
    const [typeId, setTypeId] = useState('');
    const [assetId, setAssetId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    const [types, setTypes] = useState<IncidentType[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };

            const [typesRes, assetsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:7173/api/incidenttypes', config),
                axios.get('http://localhost:7173/api/assets', config),
                axios.get('http://localhost:7173/api/users', config)
            ]);

            setTypes(typesRes.data);
            setAssets(assetsRes.data);
            setUsers(usersRes.data.filter((u: User) => u.role.name !== 'Admin')); // éviter assignation Admin
        };

        fetchData();
    }, [auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        if (!auth || !auth.accessToken) return;

        e.preventDefault();

        const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };

        const newIncident = {
            title,
            description,
            severity,
            status,
            typeId: parseInt(typeId),
            assetId: assetId ? parseInt(assetId) : null,
            assignedTo: assignedTo ? parseInt(assignedTo) : null,
            reportedBy: parseInt(String(auth.userId))
        };

        await axios.post('http://localhost:7173/api/incidents', newIncident, config);
        navigate('/incidents');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Créer un incident</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
                <input
                    type="text"
                    placeholder="Titre"
                    required
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    required
                    className="w-full border p-2 rounded"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full border p-2 rounded">
                    <option value="Low">Faible</option>
                    <option value="Medium">Moyenne</option>
                    <option value="High">Élevée</option>
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 rounded">
                    <option value="Open">Ouvert</option>
                    <option value="Resolved">Résolu</option>
                </select>

                <select value={typeId} onChange={(e) => setTypeId(e.target.value)} required className="w-full border p-2 rounded">
                    <option value="">Type d’incident</option>
                    {types.map((t: IncidentType) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>

                <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">(optionnel) Asset lié</option>
                    {assets.map((a: Asset) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>

                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">(optionnel) Assigné à</option>
                    {users.map((u: User) => (
                        <option key={u.id} value={u.id}>{u.email}</option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Créer
                </button>
            </form>
        </div>
    );
}