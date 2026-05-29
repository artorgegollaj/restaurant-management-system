import { useState, useEffect } from 'react';
import http from '../../api/http';
import notify from '../../utils/toast';

const MenuPreview = ({ cart, onAddToCart, onUpdateQty, onRemoveFromCart }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([http.get('/menu-items'), http.get('/menu-categories')])
      .then(([itemsRes, catsRes]) => {
        setItems(itemsRes.data);
        setCategories(catsRes.data);
      })
      .catch(() => notify.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || item.category?.id === activeCategory;
    return matchSearch && matchCat;
  });

  const getCartQty = (id) => cart.find(c => c.id === id)?.qty || 0;

  return (
    <section id="menu" className="py-5" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge px-3 py-2 mb-2" style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.3)' }}>
            <i className="bi bi-card-list me-1"></i>Our Menu
          </span>
          <h2 className="display-5 fw-bold">Discover Our Dishes</h2>
          <p className="text-muted">Carefully crafted with the finest ingredients</p>
        </div>

        {/* Search bar */}
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary border-start-0" onClick={() => setSearch('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="d-flex gap-2 flex-wrap justify-content-center mb-5">
          <button
            className={`btn btn-sm rounded-pill px-3 ${activeCategory === 'all' ? 'btn-dark text-white' : 'btn-outline-dark'}`}
            onClick={() => setActiveCategory('all')}
          >
            <i className="bi bi-grid-3x3-gap me-1"></i>All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-dark text-white' : 'btn-outline-dark'}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3">Loading menu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-search display-3 mb-3 d-block opacity-25"></i>
            <h5>No items found</h5>
            <p>Try a different search or category</p>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { setSearch(''); setActiveCategory('all'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(item => {
              const qty = getCartQty(item.id);
              return (
                <div key={item.id} className="col-sm-6 col-lg-4 col-xl-3">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    {/* Image / Placeholder */}
                    <div
                      className="d-flex align-items-center justify-content-center overflow-hidden"
                      style={{ height: 160, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1500 100%)' }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="bi bi-egg-fried" style={{ fontSize: '3.5rem', color: '#ff6600', opacity: 0.6 }}></i>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column p-3">
                      <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
                        <h6 className="card-title mb-0 fw-semibold flex-grow-1">{item.name}</h6>
                        <span className={`badge flex-shrink-0 ${item.available ? 'bg-success' : 'bg-secondary'}`}>
                          {item.available ? 'Available' : 'N/A'}
                        </span>
                      </div>

                      {item.category && (
                        <span className="badge bg-light text-secondary border mb-2 align-self-start" style={{ fontSize: '0.7rem' }}>
                          {item.category.name}
                        </span>
                      )}

                      {item.description && (
                        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.5 }}>
                          {item.description.length > 75 ? item.description.slice(0, 75) + '…' : item.description}
                        </p>
                      )}

                      <div className="mt-auto">
                        <div className="fw-bold fs-5 mb-2" style={{ color: '#ff6600' }}>
                          ${parseFloat(item.price).toFixed(2)}
                        </div>

                        {item.available ? (
                          qty > 0 ? (
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{ width: 32, height: 32, padding: 0 }}
                                onClick={() => onUpdateQty(item, qty - 1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="fw-bold fs-6 px-1">{qty}</span>
                              <button
                                className="btn btn-sm btn-warning rounded-circle"
                                style={{ width: 32, height: 32, padding: 0 }}
                                onClick={() => onUpdateQty(item, qty + 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger ms-auto rounded-circle"
                                style={{ width: 32, height: 32, padding: 0 }}
                                onClick={() => onRemoveFromCart(item.id)}
                                title="Remove from cart"
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm w-100 rounded-pill fw-semibold"
                              onClick={() => onAddToCart(item)}
                            >
                              <i className="bi bi-cart-plus me-1"></i>Add to Cart
                            </button>
                          )
                        ) : (
                          <button className="btn btn-secondary btn-sm w-100 rounded-pill" disabled>
                            <i className="bi bi-slash-circle me-1"></i>Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPreview;
