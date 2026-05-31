import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import { allowedPaths } from '../auth/permissions.js';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/roles', label: 'Roles' },
  { to: '/menu-categories', label: 'Menu Categories' },
  { to: '/menu-items', label: 'Menu Items' },
  { to: '/tables', label: 'Tables' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/orders', label: 'Orders' },
  { to: '/order-items', label: 'Order Items' },
  { to: '/staff', label: 'Staff' },
  { to: '/payments', label: 'Payments' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/ingredients', label: 'Ingredients' }
];

const Layout = observer(() => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  const visible = allowedPaths(authStore.roles);
  const navLinks = links.filter((l) => visible.includes(l.to));

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="text-white p-3" style={{ width: 230, background: '#111111' }}>
        <h5 className="mb-4 fw-bold" style={{ color: '#ff6600', letterSpacing: 2 }}>AURA</h5>
        <nav className="nav flex-column">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'nav-link text-white ' + (isActive ? 'fw-bold rounded' : '')
              }
              style={({ isActive }) => isActive ? { background: 'rgba(255,102,0,0.25)', color: '#ff6600' } : {}}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-grow-1 bg-light">
        <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
          <span>Welcome, <strong>{authStore.username}</strong></span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

export default Layout;
