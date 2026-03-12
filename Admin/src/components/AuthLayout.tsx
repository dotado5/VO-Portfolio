import React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card glass"
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}
            className="gradient-text"
          >
            {title}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
