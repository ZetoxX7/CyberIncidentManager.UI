import axios from 'axios';

const API_URL = 'http://localhost:7173/api/incidents';

export const getAllIncidents = async (token: string) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getIncidentById = async (id: number, token: string) => {
    const res = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createIncident = async (data: any, token: string) => {
    const res = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};