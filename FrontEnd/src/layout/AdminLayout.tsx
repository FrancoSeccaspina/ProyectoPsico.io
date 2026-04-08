import { Outlet, NavLink } from 'react-router-dom';
import '../css/adminNavbar.css';

export default function AdminLayout() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="admin-navbar">

        <div className="nav-logo">🧠 Dashboard</div>

        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            Turnos
          </NavLink>

          <NavLink to="/topicos" className="nav-link">
            Tópicos
          </NavLink>
        </div>

      </nav>

      {/* CONTENIDO */}
      <main className="admin-content">
        <Outlet />
      </main>
    </>
  );
}