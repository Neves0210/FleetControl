import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import Layout from '../layouts/Layout';

export default function PrivateRoute({ children }) {
  return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}
