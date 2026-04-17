import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';

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

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="bg-dark text-white p-3" style={{ width: 230 }}>
        <h5 className="mb-4">🍽 Restaurant</h5>
        <nav className="nav flex-column">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'nav-link text-white ' + (isActive ? 'fw-bold bg-secondary rounded' : '')
              }
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
