import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Cpu,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  User as UserIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import { dummyProjects } from "../lib/data";
import { ProjectService } from "../services/project.service";
import { showToast } from "../utils/toast";
import { NavLink } from "react-router-dom";

// ---------- helpers ----------
function getAllProjects() {
  return [...useProjectStore.getState().projects, ...dummyProjects];
}

function getUniqueSkills(projects: ReturnType<typeof getAllProjects>) {
  const set = new Set<string>();
  projects.forEach((p) => p.skills.forEach((s) => set.add(s)));
  return set.size;
}

function getTopSkills(projects: ReturnType<typeof getAllProjects>, top = 5) {
  const counts: Record<string, number> = {};
  projects.forEach((p) =>
    p.skills.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    }),
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top);
}

function getAvgDeliveryYear(projects: ReturnType<typeof getAllProjects>) {
  if (!projects.length) return "—";
  const years = projects
    .map((p) => new Date(p.delivery_date).getFullYear())
    .filter(Boolean);
  if (!years.length) return "—";
  const avg = Math.round(years.reduce((a, b) => a + b, 0) / years.length);
  return avg.toString();
}

function getRecentProjects(projects: ReturnType<typeof getAllProjects>, n = 3) {
  return [...projects]
    .sort(
      (a, b) =>
        new Date(b.delivery_date).getTime() -
        new Date(a.delivery_date).getTime(),
    )
    .slice(0, n);
}

// -------- component --------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

const Overview: React.FC = () => {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const allProjects = [...projects, ...dummyProjects];
  const uniqueSkills = getUniqueSkills(allProjects);
  const topSkills = getTopSkills(allProjects);
  const recentProjects = getRecentProjects(allProjects);
  const avgYear = getAvgDeliveryYear(allProjects);

  useEffect(() => {
    handleRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async (notify = true) => {
    try {
      setIsLoading(true);
      await ProjectService.findAll();
      if (notify) showToast.success("Data refreshed.");
    } catch {
      if (notify) showToast.error("Failed to refresh data.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Projects",
      value: allProjects.length,
      icon: <Briefcase size={22} />,
      color: "var(--accent-primary)",
      bg: "hsla(260, 80%, 65%, 0.12)",
    },
    {
      label: "Unique Skills",
      value: uniqueSkills,
      icon: <Cpu size={22} />,
      color: "hsl(200, 80%, 60%)",
      bg: "hsla(200, 80%, 60%, 0.12)",
    },
    {
      label: "Avg. Delivery Year",
      value: avgYear,
      icon: <CalendarCheck size={22} />,
      color: "hsl(150, 70%, 50%)",
      bg: "hsla(150, 70%, 50%, 0.12)",
    },
    {
      label: "Live from API",
      value: projects.length,
      icon: <TrendingUp size={22} />,
      color: "hsl(40, 90%, 60%)",
      bg: "hsla(40, 90%, 60%, 0.12)",
    },
  ];

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      {/* ---- nav ---- */}
      <nav className="dashboard-nav" style={{ padding: "0" }}>
        <h2 style={{ fontSize: "1.75rem" }} className="gradient-text">
          Overview
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => handleRefresh(true)}
            disabled={isLoading}
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </button>

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

      {/* ---- heading ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Welcome back!
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Here's a snapshot of your portfolio's current state.
        </p>
      </motion.div>

      {/* ---- stat cards ---- */}
      <div className="overview-stats-grid" style={{ marginBottom: "2.5rem" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="glass project-card overview-stat-card"
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
                marginBottom: "1rem",
              }}
            >
              {s.icon}
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.25rem",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: s.color,
                fontFamily: "var(--font-heading)",
              }}
            >
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ---- two-column ---- */}
      <div className="overview-two-col">
        {/* Recent Projects */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="glass project-card"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem" }}>Recent Projects</h3>
            <NavLink
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--accent-primary)",
                textDecoration: "none",
              }}
            >
              View all <ArrowRight size={14} />
            </NavLink>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {recentProjects.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                    {p.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--accent-primary)",
                    }}
                  >
                    {p.role}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(p.delivery_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Skills */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="glass project-card"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            Top Skills Used
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {topSkills.map(([skill, count]) => {
              const max = topSkills[0][1];
              const pct = Math.round((count / max) * 100);
              return (
                <div key={skill}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.35rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>{skill}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {count} project{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      style={{
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                        borderRadius: "var(--radius-full)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
