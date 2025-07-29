import axios from 'axios';

const API_URL = 'http://localhost:7173/api/responses';

export interface CreateResponseDto {
    incidentId: number;
    userId: number;
    action: string;
    details?: string;
    isSuccessful: boolean;
}

export const getAllResponses = async (token: string) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createResponse = async (data: CreateResponseDto, token: string) => {
    const res = await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};