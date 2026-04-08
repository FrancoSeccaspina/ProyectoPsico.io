import { NavLink } from 'react-router-dom';
import '../../css/Sidebar.css';

export default function NavBar() {
  return (
    <nav className="admin-navbar">

      <div className="nav-logo">
        🧠 Admin
      </div>

      <div className="nav-links">
        <NavLink
          to="/admin"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/topicos"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Tópicos
        </NavLink>
      </div>

    </nav>
  );
}