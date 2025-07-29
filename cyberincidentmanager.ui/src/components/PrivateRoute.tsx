import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import type { ReactElement } from 'react';

interface Props {
    children: ReactElement;
}

const PrivateRoute = ({ children }: Props): ReactElement => {
    const { auth } = useContext(AuthContext);

    return auth?.accessToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;