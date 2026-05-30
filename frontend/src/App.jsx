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
import Reviews from './pages/Reviews.jsx';
import HomePage from './pages/user/HomePage.jsx';

// Redirects to /login if not authenticated
const Protected = observer(({ children }) => {
  return authStore.isAuthenticated ? children : <Navigate to="/login" replace />;
});

// Accessible only to USER-only accounts; staff/admin get bounced to /
const UserPortal = observer(({ children }) => {
  if (!authStore.isAuthenticated) return <Navigate to="/login" replace />;
  const roles = authStore.roles;
  const isUserOnly = roles.length > 0 && roles.every(r => r === 'USER');
  if (!isUserOnly) return <Navigate to="/" replace />;
  return children;
});

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer portal — USER role only */}
      <Route
        path="/home"
        element={
          <UserPortal>
            <HomePage />
          </UserPortal>
        }
      />

      {/* Staff / admin dashboard */}
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<CrudPage config={configs.roles} />} />
        <Route path="menu-categories" element={<CrudPage config={configs.menuCategories} />} />
        <Route path="menu-items" element={<CrudPage config={configs.menuItems} />} />
        <Route path="tables" element={<CrudPage config={configs.tables} />} />
        <Route path="reservations" element={<CrudPage config={configs.reservations} />} />
        <Route path="orders" element={<CrudPage config={configs.orders} />} />
        <Route path="order-items" element={<CrudPage config={configs.orderItems} />} />
        <Route path="staff" element={<CrudPage config={configs.staff} />} />
        <Route path="payments" element={<CrudPage config={configs.payments} />} />
        <Route path="reviews" element={<CrudPage config={configs.reviews} />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="ingredients" element={<CrudPage config={configs.ingredients} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
