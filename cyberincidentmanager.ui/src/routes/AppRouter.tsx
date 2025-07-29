import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import LoginPage from '../pages/LoginPage';
import MFAForm from '../components/MFAForm';
import DashboardPage from '../pages/DashboardPage';
import IncidentsPage from '../pages/IncidentsPage';
import CreateIncidentPage from '../pages/CreateIncidentPage';
import IncidentDetailPage from '../pages/IncidentDetailPage';
import AssetsPage from '../pages/AssetsPage';
import ResponsesPage from '../pages/ResponsesPage';
import IncidentTypesPage from '../pages/IncidentTypesPage';
import NotificationsPage from '../pages/NotificationsPage';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mfa" element={<MFAForm />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Privé */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/incidents"
                element={
                    <PrivateRoute>
                        <IncidentsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/incidents/create"
                element={
                    <PrivateRoute>
                        <CreateIncidentPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/incidents/:id"
                element={
                    <PrivateRoute>
                        <IncidentDetailPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/assets"
                element={
                    <PrivateRoute>
                        <AssetsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/responses"
                element={
                    <PrivateRoute>
                        <ResponsesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/incident-types"
                element={
                    <PrivateRoute>
                        <IncidentTypesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <PrivateRoute>
                        <NotificationsPage />
                    </PrivateRoute>
                }
            />
            {/* 404 */}
            <Route path="*" element={<p>Page non trouvée</p>} />
        </Routes>

    );
}