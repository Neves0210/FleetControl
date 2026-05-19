import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { BarChart3, Car, Fuel, LayoutDashboard, LogOut, Users, UserCog } from 'lucide-react';
import { getUser, logout } from '../utils/auth';

function NavItem({ to, icon, label }) {
  return <NavLink to={to} end>{icon}<span>{label}</span></NavLink>;
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">FleetControlRH</div>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/veiculos" icon={<Car size={18} />} label="Veículos" />
        <NavItem to="/motoristas" icon={<Users size={18} />} label="Motoristas" />
        <NavItem to="/abastecimentos" icon={<Fuel size={18} />} label="Abastecimentos" />
        <NavItem to="/relatorios" icon={<BarChart3 size={18} />} label="Relatórios" />
        {user?.perfil === 1 && <NavItem to="/usuarios" icon={<UserCog size={18} />} label="Usuários" />}
      </aside>

      <section className="content">
        <div className="topbar">
          <div>
            <strong>{user?.nome}</strong>
            <div className="text-muted small">{user?.email}</div>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={() => logout(navigate)}>
            <LogOut size={16} /> Sair
          </button>
        </div>
        {children}
      </section>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
