import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores/AuthStore';
import http from '../../api/http';
import notify from '../../utils/toast';
import UserNavbar from '../../components/user/UserNavbar';
import HeroSection from '../../components/user/HeroSection';
import MenuPreview from '../../components/user/MenuPreview';
import ReservationSection from '../../components/user/ReservationSection';
import OrderSection from '../../components/user/OrderSection';

const STATUS_BADGE = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  DELIVERED: 'info',
  PAID: 'success',
  CANCELLED: 'danger',
};

const HomePage = observer(() => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({ reservations: 0, activeOrders: 0 });

  const today = new Date().toISOString().split('T')[0];

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ── Load dashboard summary ── */
  useEffect(() => {
    Promise.all([http.get('/orders'), http.get('/reservations')])
      .then(([ordersRes, resRes]) => {
        const allOrders = ordersRes.data;
        setOrders(allOrders);
        const activeOrders = allOrders.filter(o => !['PAID', 'CANCELLED'].includes(o.status)).length;
        const myUpcomingRes = resRes.data.filter(
          r => r.customerName === authStore.username && r.reservationDate >= today
        ).length;
        setSummaryStats({ reservations: myUpcomingRes, activeOrders });
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  /* ── Cart helpers ── */
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    notify.success(`${item.name} added to cart`);
  };

  const updateQty = (item, qty) => {
    if (qty <= 0) { removeFromCart(item.id); return; }
    setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty } : c));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => sum + parseFloat(c.price) * c.qty, 0);

  /* ── Summary cards config ── */
  const summaryCards = [
    {
      label: 'Upcoming Reservations',
      value: summaryStats.reservations,
      icon: 'bi-calendar-check',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      action: () => scrollTo('reservations'),
      actionLabel: 'View all',
    },
    {
      label: 'Active Orders',
      value: summaryStats.activeOrders,
      icon: 'bi-bag-check',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      action: () => scrollTo('my-orders'),
      actionLabel: 'View all',
    },
    {
      label: 'Cart Items',
      value: cartCount,
      sub: cartCount > 0 ? `$${cartTotal.toFixed(2)}` : 'Empty',
      icon: 'bi-cart3',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      action: () => cartCount > 0 ? setShowCart(true) : scrollTo('menu'),
      actionLabel: cartCount > 0 ? 'Checkout' : 'Add items',
    },
    {
      label: 'Loyalty Points',
      value: '250',
      sub: 'Silver Member',
      icon: 'bi-award',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      action: null,
      badge: 'Coming Soon',
    },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <UserNavbar cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      <HeroSection
        onMenuClick={() => scrollTo('menu')}
        onReserveClick={() => scrollTo('reservations')}
      />

      {/* ── Summary Cards ── */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row g-3">
            {summaryCards.map(card => (
              <div key={card.label} className="col-sm-6 col-lg-3">
                <div
                  className="card border-0 h-100 rounded-4 overflow-hidden"
                  style={{ background: card.gradient, transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  <div className="card-body text-white p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="small mb-1" style={{ opacity: 0.8 }}>{card.label}</div>
                        <div className="display-6 fw-bold lh-1">{card.value}</div>
                        {card.sub && <div className="small mt-1" style={{ opacity: 0.75 }}>{card.sub}</div>}
                      </div>
                      <i className={`bi ${card.icon} fs-1`} style={{ opacity: 0.35 }}></i>
                    </div>
                    {card.action ? (
                      <button
                        className="btn btn-sm btn-light mt-2 rounded-pill px-3"
                        style={{ opacity: 0.9, fontSize: '0.78rem' }}
                        onClick={card.action}
                      >
                        {card.actionLabel} <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    ) : (
                      <span className="badge bg-white text-dark mt-2" style={{ opacity: 0.85, fontSize: '0.72rem' }}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Section ── */}
      <MenuPreview
        cart={cart}
        onAddToCart={addToCart}
        onUpdateQty={updateQty}
        onRemoveFromCart={removeFromCart}
      />

      {/* ── Reservation Section ── */}
      <ReservationSection />

      {/* ── My Orders Section ── */}
      <section id="my-orders" className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge px-3 py-2 mb-2"
              style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.3)' }}
            >
              <i className="bi bi-bag me-1"></i>Order History
            </span>
            <h2 className="display-5 fw-bold">My Orders</h2>
            <p className="text-muted">Track and review your recent orders</p>
          </div>

          {ordersLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bag-x display-2 mb-3 d-block opacity-25"></i>
              <h5>No orders yet</h5>
              <p>Browse the menu and place your first order!</p>
              <button className="btn btn-warning rounded-pill px-4 mt-2" onClick={() => scrollTo('menu')}>
                <i className="bi bi-card-list me-2"></i>Browse Menu
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {[...orders].reverse().slice(0, 12).map(order => (
                <div key={order.id} className="col-md-6 col-xl-4">
                  <div
                    className="card border-0 shadow-sm rounded-4 h-100"
                    style={{ transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-dark fs-6">
                          <i className="bi bi-hash text-muted"></i>{order.id}
                        </span>
                        <span className={`badge bg-${STATUS_BADGE[order.status] || 'secondary'} px-2 py-1`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="d-flex flex-column gap-1 text-muted small mb-3">
                        <div>
                          <i className="bi bi-calendar3 me-2" style={{ color: '#ff6600' }}></i>
                          {new Date(order.orderDate).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </div>
                        <div>
                          <i className={`bi ${order.orderType === 'TAKEOUT' ? 'bi-bag' : 'bi-building'} me-2`} style={{ color: '#ff6600' }}></i>
                          {order.orderType === 'TAKEOUT' ? 'Takeout' : 'Dine In'}
                        </div>
                        {order.table && (
                          <div>
                            <i className="bi bi-grid me-2" style={{ color: '#ff6600' }}></i>
                            Table #{order.table.tableNumber}
                          </div>
                        )}
                      </div>

                      <div
                        className="d-flex justify-content-between align-items-center pt-3"
                        style={{ borderTop: '1px solid #f0f0f0' }}
                      >
                        <span className="text-muted small">Total</span>
                        <span className="fw-bold fs-5" style={{ color: '#ff6600' }}>
                          ${parseFloat(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <h4 className="fw-bold">What Our Customers Say</h4>
            <p className="text-muted small">Real reviews from real guests</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: 'Sarah M.', text: 'Absolutely amazing food and service! The online ordering made everything so convenient.', stars: 5 },
              { name: 'James K.', text: 'Reserved a table online in seconds. The restaurant was exactly as described — beautiful ambiance!', stars: 5 },
              { name: 'Elena R.', text: 'The menu variety is fantastic. Loved being able to browse before arriving!', stars: 4 },
            ].map(review => (
              <div key={review.name} className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                  <div className="mb-3">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <i key={i} className="bi bi-star-fill me-1" style={{ color: '#ff6600' }}></i>
                    ))}
                    {Array.from({ length: 5 - review.stars }).map((_, i) => (
                      <i key={i} className="bi bi-star text-muted me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted fst-italic flex-grow-1">"{review.text}"</p>
                  <div className="fw-semibold small text-dark mt-2">— {review.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-5 text-white"
        style={{ background: '#111111', borderTop: '2px solid #ff6600' }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3" style={{ letterSpacing: 3 }}>
                <i className="bi bi-fire me-2" style={{ color: '#ff6600' }}></i>AURA
              </h5>
              <p className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Experience the finest dining. Reserve tables, explore our menu, and order your favorite meals online.
              </p>
            </div>
            <div className="col-md-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#ff6600' }}>Quick Links</h6>
              <div className="d-flex flex-column gap-1">
                {['menu', 'reservations', 'my-orders'].map(id => (
                  <button
                    key={id}
                    className="btn btn-link text-start p-0"
                    style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                    style={{ textDecoration: 'none' }}
                    onClick={() => scrollTo(id)}
                  >
                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem', color: '#ff6600' }}></i>
                    {id === 'my-orders' ? 'My Orders' : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#ff6600' }}>Hours</h6>
              <div className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <div>Mon–Fri: 11:00 AM – 10:00 PM</div>
                <div>Sat–Sun: 10:00 AM – 11:00 PM</div>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center small" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 AURA · All rights reserved
          </div>
        </div>
      </footer>

      {/* ── Cart Drawer ── */}
      <OrderSection
        cart={cart}
        onUpdateQty={updateQty}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        show={showCart}
        onHide={() => setShowCart(false)}
      />

      {/* ── Floating Cart Button ── */}
      {cartCount > 0 && !showCart && (
        <button
          className="btn btn-warning rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center"
          style={{
            bottom: 28, right: 28,
            width: 62, height: 62,
            zIndex: 1030,
            fontSize: '1.4rem',
            transition: 'transform 0.2s',
          }}
          onClick={() => setShowCart(true)}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          title={`View cart — ${cartCount} items`}
        >
          <i className="bi bi-cart3"></i>
          <span
            className="position-absolute badge rounded-pill bg-danger"
            style={{ top: -4, right: -4, fontSize: '0.7rem', minWidth: 20 }}
          >
            {cartCount}
          </span>
        </button>
      )}
    </div>
  );
});

export default HomePage;
