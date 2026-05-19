import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Veiculos from '../pages/Veiculos';
import Motoristas from '../pages/Motoristas';
import Abastecimentos from '../pages/Abastecimentos';
import Usuarios from '../pages/Usuarios';
import Relatorios from '../pages/Relatorios';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/veiculos" element={<PrivateRoute><Veiculos /></PrivateRoute>} />
        <Route path="/motoristas" element={<PrivateRoute><Motoristas /></PrivateRoute>} />
        <Route path="/abastecimentos" element={<PrivateRoute><Abastecimentos /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
