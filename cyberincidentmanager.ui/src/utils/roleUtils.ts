type Role = 'Admin' | 'Analyst' | 'Employé';

export const isAdmin = (role: Role) => role === 'Admin';

export const isAnalyst = (role: Role) => role === 'Analyst';

export const isEmployee = (role: Role) => role === 'Employé';

export const canCreateIncident = (role: Role) =>
    role === 'Admin' || role === 'Analyst';

export const canAddResponse = (role: Role) =>
    role === 'Admin' || role === 'Analyst';

export const canSeeAllIncidents = (role: Role) =>
    role === 'Admin';

export const canSeeAssignedIncidents = (role: Role) =>
    role === 'Analyst';

export const canSeeOwnIncidents = (role: Role) =>
    role === 'Employé';

export const canManageAssets = (role: Role) =>
    role === 'Admin' || role === 'Analyst';

export const canSeeDashboardStats = (role: Role) =>
    role === 'Admin' || role === 'Analyst' || role === 'Employé';