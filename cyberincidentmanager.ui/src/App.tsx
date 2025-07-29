import { useContext } from 'react';
import { AuthContext } from './context/AuthProvider';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';

export default function App() {
    const { auth } = useContext(AuthContext);
    console.log('AUTH CONTEXT →', auth);

    return (
        <div className="min-h-screen bg-gray-100">
            {auth && <Navbar />}
            <AppRouter />
        </div>
    );
}