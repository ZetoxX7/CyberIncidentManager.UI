type Role = 'Admin' | 'Analyst' | 'Employé';

interface Incident {
    id: number;
    title: string;
    status: string;
    severity: string;
    reportedBy: number;
    assignedToUser?: { id: number };
}

export const filterIncidentsByRole = (
    incidents: Incident[],
    role: Role,
    userId: number
): Incident[] => {
    switch (role) {
        case 'Admin':
            return incidents;
        case 'Analyst':
            return incidents.filter(i => i.assignedToUser?.id === userId);
        case 'Employé':
            return incidents.filter(i => i.reportedBy === userId);
        default:
            return [];
    }
};