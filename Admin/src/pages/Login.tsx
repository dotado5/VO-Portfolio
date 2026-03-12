import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { AuthService } from "../services/auth.service";
import { showToast } from "../utils/toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await AuthService.signIn({ email, password });
      showToast.success(`Welcome back!!! ${user.user.email}`);
      navigate("/dashboard");
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message ||
          "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your details to sign in"
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <div style={{ position: "relative" }}>
            <Mail
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="email"
              className="input-field"
              placeholder="name@example.com"
              style={{ paddingLeft: "3rem" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <div style={{ position: "relative" }}>
            <Lock
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              style={{ paddingLeft: "3rem" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <LogIn size={20} />
          )}
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--accent-primary)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
