import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Briefcase,
  Cpu,
  BarChart3,
  TrendingUp,
  User as UserIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import { dummyProjects } from "../lib/data";
import { ProjectService } from "../services/project.service";
import { showToast } from "../utils/toast";
import { Project } from "../types/project.type";

// -------- palette --------
const CHART_COLORS = [
  "hsl(260, 80%, 65%)",
  "hsl(280, 80%, 60%)",
  "hsl(200, 80%, 60%)",
  "hsl(150, 70%, 50%)",
  "hsl(40, 90%, 60%)",
  "hsl(0, 80%, 65%)",
];

// -------- pure data helpers --------
function buildProjectsByYear(projects: Project[]) {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    const yr = new Date(p.delivery_date).getFullYear();
    if (!isNaN(yr)) counts[yr] = (counts[yr] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year, count }));
}

function buildSkillCounts(projects: Project[], top = 8) {
  const counts: Record<string, number> = {};
  projects.forEach((p) =>
    p.skills.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    }),
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([name, value]) => ({ name, value }));
}

function buildRoleDistribution(projects: Project[]) {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    counts[p.role] = (counts[p.role] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// -------- custom tooltip --------
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "hsl(220, 20%, 10%)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-sm)",
          padding: "0.6rem 1rem",
          fontSize: "0.85rem",
        }}
      >
        {label && (
          <p style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
            {label}
          </p>
        )}
        <p style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
          {payload[0].value} project{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

// -------- component --------
const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const allProjects = [...projects, ...dummyProjects];
  const projectsByYear = buildProjectsByYear(allProjects);
  const skillCounts = buildSkillCounts(allProjects);
  const roleDistribution = buildRoleDistribution(allProjects);

  const uniqueSkills = new Set(allProjects.flatMap((p) => p.skills)).size;
  const liveCount = projects.length;
  const mostUsedSkill = skillCounts[0]?.name ?? "—";
  const topRole =
    roleDistribution.sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  const stats = [
    {
      label: "Total Projects",
      value: allProjects.length,
      icon: <Briefcase size={20} />,
      color: "var(--accent-primary)",
      bg: "hsla(260, 80%, 65%, 0.12)",
    },
    {
      label: "Unique Skills",
      value: uniqueSkills,
      icon: <Cpu size={20} />,
      color: "hsl(200, 80%, 60%)",
      bg: "hsla(200, 80%, 60%, 0.12)",
    },
    {
      label: "Most Used Skill",
      value: mostUsedSkill,
      icon: <TrendingUp size={20} />,
      color: "hsl(150, 70%, 50%)",
      bg: "hsla(150, 70%, 50%, 0.12)",
    },
    {
      label: "Live from API",
      value: liveCount,
      icon: <BarChart3 size={20} />,
      color: "hsl(40, 90%, 60%)",
      bg: "hsla(40, 90%, 60%, 0.12)",
    },
  ];

  useEffect(() => {
    handleRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async (notify = true) => {
    try {
      setIsLoading(true);
      await ProjectService.findAll();
      if (notify) showToast.success("Analytics refreshed.");
    } catch {
      if (notify) showToast.error("Failed to refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      {/* ---- nav ---- */}
      <nav className="dashboard-nav" style={{ padding: "0" }}>
        <h2 style={{ fontSize: "1.75rem" }} className="gradient-text">
          Analytics
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
          Portfolio Analytics
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Data-driven insights into your projects and skill usage.
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
                fontSize:
                  typeof s.value === "string" && s.value.length > 6
                    ? "1.2rem"
                    : "2rem",
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

      {/* ---- chart row 1: projects by year ---- */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="glass project-card"
        style={{ marginBottom: "1.5rem", borderRadius: "var(--radius-md)" }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
          Projects Delivered by Year
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Number of projects completed per year across your portfolio.
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={projectsByYear}
            margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="year"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--glass-border)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {projectsByYear.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                />
              ))}
            </Bar>
            <defs>
              {projectsByYear.map((_, index) => (
                <linearGradient
                  key={index}
                  id={`barGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(260,80%,65%)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(280,80%,60%)"
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ---- chart row 2: skills + roles ---- */}
      <div className="overview-two-col">
        {/* Top skills bar chart */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="glass project-card"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
            Top Skills
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Most frequently used technologies across all projects.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={skillCounts}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 40, bottom: 0 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {skillCounts.map((_, index) => (
                  <Cell
                    key={`skill-cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Role distribution pie chart */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="glass project-card"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
            Role Distribution
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Breakdown of the roles you've held across projects.
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Primary role:{" "}
            <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
              {topRole}
            </span>
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {roleDistribution.map((_, index) => (
                  <Cell
                    key={`role-cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  const n = Number(value);
                  return [`${n} project${n !== 1 ? "s" : ""}`, "Count"] as [
                    string,
                    string,
                  ];
                }}
                contentStyle={{
                  background: "hsl(220, 20%, 10%)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
