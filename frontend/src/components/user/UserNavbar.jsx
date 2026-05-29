import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../stores/AuthStore';

const UserNavbar = observer(({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{ background: '#111111', borderBottom: '2px solid #ff6600', zIndex: 1000 }}
    >
      <div className="container">
        <span className="navbar-brand fw-bold fs-4 text-white" style={{ cursor: 'default', letterSpacing: 3 }}>
          <i className="bi bi-fire me-2" style={{ color: '#ff6600' }}></i>AURA
        </span>

        <button
          className="navbar-toggler border-secondary"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} text-white fs-5`}></i>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn border-0 px-3" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => scrollTo('hero')}>
                <i className="bi bi-house-door me-1"></i>Home
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn border-0 px-3" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => scrollTo('menu')}>
                <i className="bi bi-menu-button-wide me-1"></i>Menu
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn border-0 px-3" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => scrollTo('reservations')}>
                <i className="bi bi-calendar-check me-1"></i>Reserve Table
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn border-0 px-3" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => scrollTo('my-orders')}>
                <i className="bi bi-bag-check me-1"></i>My Orders
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-white-50 small">
              <i className="bi bi-person-circle me-1" style={{ color: '#ff6600' }}></i>
              {authStore.username}
            </span>

            <button
              className="btn btn-outline-warning btn-sm position-relative"
              onClick={onCartClick}
            >
              <i className="bi bi-cart3 me-1"></i>Cart
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
});

export default UserNavbar;
