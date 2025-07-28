import axios from 'axios';

const API_URL = 'http://localhost:7173/api/notifications';

export const getNotificationsByUser = async (userId: number, token: string) => {
    const res = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};