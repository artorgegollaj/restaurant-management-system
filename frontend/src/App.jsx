import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/AuthStore';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import CrudPage from './components/CrudPage.jsx';
import { configs } from './crudConfigs.jsx';
import HomePage from './pages/user/HomePage.jsx';
import { canAccess, isUserOnly, landingPath } from './auth/permissions.js';

// Customer portal — USER-only accounts; staff/admin get sent to their landing page
const UserPortal = observer(({ children }) => {
  if (!authStore.isAuthenticated) return <Navigate to="/login" replace />;
  if (!isUserOnly(authStore.roles)) return <Navigate to={landingPath(authStore.roles)} replace />;
  return children;
});

// Staff area — any logged-in non-customer; customers are sent to /home
const RequireStaff = observer(({ children }) => {
  if (!authStore.isAuthenticated) return <Navigate to="/login" replace />;
  if (isUserOnly(authStore.roles)) return <Navigate to="/home" replace />;
  return children;
});

// Per-page role check; bounce to the role's landing page if not allowed
const Guard = observer(({ path, children }) => {
  return canAccess(path, authStore.roles) ? children : <Navigate to={landingPath(authStore.roles)} replace />;
});

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer portal — USER role only */}
      <Route path="/home" element={<UserPortal><HomePage /></UserPortal>} />

      {/* Staff / admin dashboard */}
      <Route path="/" element={<RequireStaff><Layout /></RequireStaff>}>
        <Route index element={<Guard path="/"><Dashboard /></Guard>} />
        <Route path="users" element={<Guard path="/users"><Users /></Guard>} />
        <Route path="roles" element={<Guard path="/roles"><CrudPage config={configs.roles} /></Guard>} />
        <Route path="menu-categories" element={<Guard path="/menu-categories"><CrudPage config={configs.menuCategories} /></Guard>} />
        <Route path="menu-items" element={<Guard path="/menu-items"><CrudPage config={configs.menuItems} /></Guard>} />
        <Route path="tables" element={<Guard path="/tables"><CrudPage config={configs.tables} /></Guard>} />
        <Route path="reservations" element={<Guard path="/reservations"><CrudPage config={configs.reservations} /></Guard>} />
        <Route path="orders" element={<Guard path="/orders"><CrudPage config={configs.orders} /></Guard>} />
        <Route path="order-items" element={<Guard path="/order-items"><CrudPage config={configs.orderItems} /></Guard>} />
        <Route path="staff" element={<Guard path="/staff"><CrudPage config={configs.staff} /></Guard>} />
        <Route path="payments" element={<Guard path="/payments"><CrudPage config={configs.payments} /></Guard>} />
        <Route path="reviews" element={<Guard path="/reviews"><CrudPage config={configs.reviews} /></Guard>} />
        <Route path="ingredients" element={<Guard path="/ingredients"><CrudPage config={configs.ingredients} /></Guard>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
