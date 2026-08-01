import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expenses from './pages/Expenses.jsx';
import Categories from './pages/Categories.jsx';
import Budgets from './pages/Budgets.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18243D',
            color: '#FBF8F2',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2C8A73', secondary: '#FBF8F2' } },
          error: { iconTheme: { primary: '#B24C3A', secondary: '#FBF8F2' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <Budgets />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
