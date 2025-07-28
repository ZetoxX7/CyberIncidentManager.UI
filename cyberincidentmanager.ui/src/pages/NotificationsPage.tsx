import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function NotificationsPage() {
    const { auth } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!auth || !auth.accessToken || !auth.userId) return;

        const fetchNotifications = async () => {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const res = await axios.get(
                `http://localhost:7173/api/notifications/user/${auth.userId}`,
                config
            );
            setNotifications(res.data);
        };

        fetchNotifications();
    }, [auth]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mes notifications</h1>

            {notifications.length === 0 ? (
                <p>Aucune notification reçue.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((n: any) => (
                        <li
                            key={n.id}
                            className={`p-4 rounded shadow ${n.isRead ? 'bg-white' : 'bg-yellow-100'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{n.title}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{n.message}</p>
                            {n.incidentId && (
                                <p className="text-sm text-blue-600 mt-1">
                                    Incident #{n.incidentId}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}