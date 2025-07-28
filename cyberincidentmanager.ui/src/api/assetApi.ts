import axios from 'axios';

const API_URL = 'http://localhost:7173/api/assets';

export const getAllAssets = async (token: string) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};