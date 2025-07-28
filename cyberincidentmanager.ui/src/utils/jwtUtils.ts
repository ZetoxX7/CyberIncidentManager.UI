interface DecodedToken {
    email: string;
    role: string;
    nameid: string;
    exp: number;
    [key: string]: any;
}

export const decodeJwt = (token: string): DecodedToken | null => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
};

export const extractUserInfo = (token: string) => {
    const decoded = decodeJwt(token);

    if (!decoded) return null;

    return {
        email: decoded.email,
        role: decoded.role,
        userId: parseInt(decoded.nameid),
        expiresAt: new Date(decoded.exp * 1000)
    };
};