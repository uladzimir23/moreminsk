import { NavLink, Outlet } from "react-router-dom";
import { COLLECTIONS } from "../lib/collections";
import { useAuth } from "../lib/auth";

export function Layout() {
  const { email, logout } = useAuth();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          Море<b>Minsk</b>
        </div>
        <nav>
          {COLLECTIONS.map((c) => (
            <NavLink key={c.name} to={`/c/${c.name}`}>
              {c.label}
            </NavLink>
          ))}
          <NavLink to="/bookings" className="leads-link">
            Календарь
          </NavLink>
          <NavLink to="/leads">Заявки</NavLink>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="who">{email}</span>
          <button className="ghost" onClick={logout}>
            Выйти
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
