import { AuthContext } from '../context/AuthContext';
import { getNotificationsByUser } from '../api/notificationApi';
import { useContext, useEffect, useState } from 'react';

// Types alignés sur vos modèles backend
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

interface Notification {
    id: number;
    userId: number;
    user?: User;
    incidentId: number;
    incident?: Incident;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { auth } = useContext(AuthContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!auth || !auth.accessToken || !auth.userId) return;

        getNotificationsByUser(auth.userId, auth.accessToken).then((data: Notification[]) => {
            setNotifications(data);
        });
    }, [auth]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mes notifications</h1>
            <table className="w-full table-auto border-collapse bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Titre</th>
                        <th className="p-2">Message</th>
                        <th className="p-2">Incident</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((n) => (
                        <tr key={n.id} className="border-t hover:bg-gray-100">
                            <td className="p-2">{n.title}</td>
                            <td className="p-2">{n.message}</td>
                            <td className="p-2">{n.incident?.title || '—'}</td>
                            <td className="p-2">{new Date(n.createdAt).toLocaleString('fr-FR')}</td>
                            <td className="p-2">{n.isRead ? 'Lue' : 'Non lue'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}