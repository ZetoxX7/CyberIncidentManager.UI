import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DashboardPage() {
    const { auth } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalIncidents: 0,
        assignedIncidents: 0,
        reportedIncidents: 0,
        totalResponses: 0
    });

    useEffect(() => {
        if (!auth || !auth.accessToken) return;

        const fetchStats = async () => {
            const token = auth.accessToken;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [incidentsRes, responsesRes] = await Promise.all([
                axios.get('http://localhost:7173/api/incidents', config),
                axios.get('http://localhost:7173/api/responses', config)
            ]);

            const userId = parseInt(String(auth.userId));

            const totalIncidents = incidentsRes.data.length;
            const assignedIncidents = incidentsRes.data.filter((i: any) => i.assignedTo?.id === userId).length;
            const reportedIncidents = incidentsRes.data.filter((i: any) => i.reportedBy === userId).length;

            setStats({
                totalIncidents,
                assignedIncidents,
                reportedIncidents,
                totalResponses: responsesRes.data.length
            });
        };

        fetchStats();
    }, [auth]);

    const role = auth?.role;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Bienvenue sur le Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(role === 'Admin' || role === 'Analyst') && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Incidents totaux</h2>
                        <p className="text-3xl">{stats.totalIncidents}</p>
                    </div>
                )}
                {(role === 'Analyst') && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Incidents assignés</h2>
                        <p className="text-3xl">{stats.assignedIncidents}</p>
                    </div>
                )}
                {role === 'Employé' && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Mes incidents signalés</h2>
                        <p className="text-3xl">{stats.reportedIncidents}</p>
                    </div>
                )}
                {(role === 'Admin' || role === 'Analyst') && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Réponses enregistrées</h2>
                        <p className="text-3xl">{stats.totalResponses}</p>
                    </div>
                )}
            </div>
        </div>
    );
}