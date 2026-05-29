const HeroSection = ({ onMenuClick, onReserveClick }) => {
  return (
    <section
      id="hero"
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.97) 0%, rgba(20,10,0,0.95) 60%, rgba(30,15,0,0.93) 100%)`,
        backgroundColor: '#0d0d0d',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blobs */}
      <div
        style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,102,0,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: '-5%', left: '-5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,102,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container text-center text-white py-5 position-relative">
        <div className="mb-3">
          <span className="badge px-3 py-2 fs-6" style={{ background: 'rgba(255,102,0,0.2)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.4)' }}>
            <i className="bi bi-star-fill me-1"></i>Award Winning Restaurant
          </span>
        </div>

        <h1
          className="display-1 fw-bold mb-3"
          style={{
            textShadow: '2px 4px 12px rgba(0,0,0,0.5)',
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}
        >
          Welcome to<br />
          <span style={{ color: '#ff6600', letterSpacing: 4 }}>AURA</span>
        </h1>

        <p
          className="lead mb-5 fs-5"
          style={{
            maxWidth: 580,
            margin: '0 auto 2.5rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
          }}
        >
          Reserve tables, explore our menu, and order your favorite meals online.
          Experience the finest dining from the comfort of your home.
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button
            className="btn btn-lg px-5 py-3 fw-semibold rounded-pill shadow"
            onClick={onMenuClick}
            style={{
              background: '#ff6600', color: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,102,0,0.45)'; e.currentTarget.style.background = '#e55a00'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = '#ff6600'; }}
          >
            <i className="bi bi-card-list me-2"></i>View Menu
          </button>
          <button
            className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold rounded-pill"
            onClick={onReserveClick}
            style={{ transition: 'transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <i className="bi bi-calendar-plus me-2"></i>Reserve Table
          </button>
        </div>

        <div className="mt-5 pt-3 d-flex gap-5 justify-content-center">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '50+', label: 'Menu Items' },
            { value: '15+', label: 'Years Experience' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="fs-2 fw-bold" style={{ color: '#ff6600' }}>{stat.value}</div>
              <div className="small" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-5" style={{ color: 'rgba(255,255,255,0.35)', animation: 'bounce 2s infinite' }}>
          <i className="bi bi-chevron-double-down fs-4"></i>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
