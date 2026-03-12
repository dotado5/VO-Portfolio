import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";
import { showToast } from "./utils/toast";

function App() {
  const { clearAuth, expiresAt, token } = useAuthStore();

  useEffect(() => {
    if (!token || !expiresAt) return;

    const checkExpiry = () => {
      if (Date.now() >= expiresAt) {
        clearAuth();
        showToast.warning("Your session has expired. Please log in again.");
      }
    };

    const interval = setInterval(checkExpiry, 1000 * 60); // Check every minute
    checkExpiry(); // Initial check

    return () => clearInterval(interval);
  }, [token, expiresAt, clearAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

export default App;
