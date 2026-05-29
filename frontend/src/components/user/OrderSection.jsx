import { useState } from 'react';
import http from '../../api/http';
import notify from '../../utils/toast';

const OrderSection = ({ cart, onUpdateQty, onRemoveFromCart, onClearCart, show, onHide }) => {
  const [orderType, setOrderType] = useState('TAKEOUT');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      notify.warn('Your cart is empty');
      return;
    }
    setPlacing(true);
    try {
      await http.post('/orders', {
        orderType,
        status: 'PENDING',
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.qty,
          notes: null,
        })),
      });
      setSuccess(true);
      onClearCart();
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 2500);
      notify.success('Order placed successfully! We\'ll start preparing it shortly.');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to place order';
      notify.error(typeof msg === 'string' ? msg : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
        onClick={onHide}
      />

      {/* Offcanvas drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: 440,
          background: '#fff',
          zIndex: 1045,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4"
          style={{ background: 'linear-gradient(135deg, #111111, #1a1a1a)', flexShrink: 0 }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart3 fs-4 text-warning"></i>
            <h5 className="text-white mb-0 fw-bold">Your Cart</h5>
            {itemCount > 0 && (
              <span className="badge bg-warning text-dark rounded-pill">{itemCount} items</span>
            )}
          </div>
          <button className="btn-close btn-close-white" onClick={onHide}></button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="mb-3" style={{ fontSize: '4rem' }}>🎉</div>
            <h4 className="fw-bold text-success mb-2">Order Placed!</h4>
            <p className="text-muted">We're preparing your order. Estimated time: 20-30 min.</p>
            <div className="spinner-grow text-warning mt-2" role="status" style={{ width: '1rem', height: '1rem' }}></div>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-grow-1 overflow-auto p-3">
              {cart.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                  <i className="bi bi-cart-x display-2 mb-3 opacity-25"></i>
                  <h6>Your cart is empty</h6>
                  <p className="small text-center px-4">Browse the menu and add some items to get started!</p>
                  <button className="btn btn-warning btn-sm rounded-pill px-4 mt-2" onClick={onHide}>
                    <i className="bi bi-card-list me-1"></i>Browse Menu
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3"
                    style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}
                  >
                    <div
                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1a1a1a, #2a1500)' }}
                    >
                      <i className="bi bi-egg-fried" style={{ color: '#ff6600' }}></i>
                    </div>

                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold text-truncate">{item.name}</div>
                      <div className="small" style={{ color: '#ff6600' }}>${parseFloat(item.price).toFixed(2)} each</div>
                    </div>

                    <div className="d-flex align-items-center gap-1 flex-shrink-0">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        style={{ width: 28, height: 28, padding: 0, fontSize: '0.75rem' }}
                        onClick={() => onUpdateQty(item, item.qty - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="fw-bold px-2" style={{ minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                      <button
                        className="btn btn-sm btn-warning rounded-circle"
                        style={{ width: 28, height: 28, padding: 0, fontSize: '0.75rem' }}
                        onClick={() => onUpdateQty(item, item.qty + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <div className="text-end flex-shrink-0" style={{ minWidth: 56 }}>
                      <div className="fw-bold small">${(parseFloat(item.price) * item.qty).toFixed(2)}</div>
                      <button
                        className="btn btn-link text-danger p-0"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => onRemoveFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with order controls */}
            {cart.length > 0 && (
              <div className="p-4 border-top" style={{ flexShrink: 0, background: '#fafafa' }}>
                {/* Order type */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark mb-2">Order Type</label>
                  <div className="d-flex gap-2">
                    {[
                      { value: 'TAKEOUT', icon: 'bi-bag', label: 'Takeout' },
                      { value: 'DINE_IN', icon: 'bi-building', label: 'Dine In' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        className={`btn btn-sm flex-fill py-2 rounded-3 ${orderType === opt.value ? 'btn-dark text-white' : 'btn-outline-secondary'}`}
                        onClick={() => setOrderType(opt.value)}
                      >
                        <i className={`bi ${opt.icon} me-1`}></i>{opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
                  <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 fw-bold fs-5">
                  <span>Total</span>
                  <span style={{ color: '#ff6600' }}>${total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-warning w-100 fw-semibold py-3 rounded-3"
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Place Order · ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <button
                  className="btn btn-link text-muted w-100 mt-2 btn-sm"
                  onClick={onHide}
                >
                  Continue browsing
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrderSection;
