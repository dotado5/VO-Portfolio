import React from "react";
import { useAuthStore } from "../store/authStore";
import { User as UserIcon } from "lucide-react";

const Analytics: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <nav className="dashboard-nav" style={{ padding: "0" }}>
        <h2 style={{ fontSize: "1.75rem" }} className="gradient-text">
          Analytics
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            <UserIcon size={16} />
            <span>{user?.email}</span>
          </div>
        </div>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Website Traffic & Insights
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Monitor how your website is performing over time.
          </p>
        </div>
      </div>

      <div
        className="glass project-card"
        style={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Detailed analytics will be integrated here soon...
        </p>
      </div>
    </div>
  );
};

export default Analytics;
