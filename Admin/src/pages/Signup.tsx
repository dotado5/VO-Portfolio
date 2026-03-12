import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";
import { AuthService } from "../services/auth.service";
import { showToast } from "../utils/toast";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AuthService.signUp({ email, password });
      showToast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get Started"
      subtitle="Create your administrative account"
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <div style={{ position: "relative" }}>
            <User
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
              type="text"
              className="input-field"
              placeholder="John Doe"
              style={{ paddingLeft: "3rem" }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

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
            <UserPlus size={20} />
          )}
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent-primary)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
