import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AssetsPage() {
    const { auth } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchAssets = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const res = await axios.get('http://localhost:7173/api/assets', config);
            setAssets(res.data);
            setFiltered(res.data);
        };

        fetchAssets();
    }, [auth]);

    useEffect(() => {
        const term = search.toLowerCase();
        const results = assets.filter((a: any) =>
            a.name.toLowerCase().includes(term) ||
            a.type.toLowerCase().includes(term) ||
            a.owner.toLowerCase().includes(term)
        );
        setFiltered(results);
    }, [search, assets]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des équipements</h1>

            <input
                type="text"
                placeholder="Rechercher un asset..."
                className="border p-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Nom</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">IP</th>
                        <th className="p-2">Propriétaire</th>
                        <th className="p-2">Emplacement</th>
                        <th className="p-2">Criticité</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((asset: any) => (
                        <tr key={asset.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{asset.name}</td>
                            <td className="p-2">{asset.type}</td>
                            <td className="p-2">{asset.ipAddress}</td>
                            <td className="p-2">{asset.owner}</td>
                            <td className="p-2">{asset.location || '—'}</td>
                            <td className="p-2">{asset.criticality}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}