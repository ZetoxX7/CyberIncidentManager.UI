import axios from 'axios';

const API_URL = 'http://localhost:7173/api/responses';

export const getAllResponses = async (token: string) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createResponse = async (data: any, token: string) => {
    const res = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};