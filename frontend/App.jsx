import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/AuthStore';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import CrudPage from './components/CrudPage.jsx';
import { configs } from './crudConfigs.js';

const Protected = observer(({ children }) => {
  return authStore.isAuthenticated ? children : <Navigate to="/login" replace />;
});

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
        <Route path="ingredients" element={<CrudPage config={configs.ingredients} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
