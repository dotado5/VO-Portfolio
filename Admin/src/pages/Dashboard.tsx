import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  LogOut,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  LayoutGrid,
  List,
  Loader2,
  RefreshCw,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/project.service";
import { AuthService } from "../services/auth.service";
import { showToast } from "../utils/toast";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import { Project } from "../types/project.type";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { projects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (projects.length === 0) {
      loadProjects();
    }
  }, [isAuthenticated, navigate, projects.length]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      await ProjectService.findAll();
    } catch (error) {
      showToast.error("Failed to fetch projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await ProjectService.findAll();
      showToast.success("Projects updated from server.");
    } catch (error) {
      showToast.error("Failed to refresh projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.signOut();
    showToast.info("Signed out successfully.");
    navigate("/login");
  };

  const filteredProjects = projects.filter(
    (project: Project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.role.toLowerCase().includes(search.toLowerCase()) ||
      project.skills.some((s: string) =>
        s.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <nav className="dashboard-nav">
        <h2 style={{ fontSize: "1.75rem" }} className="gradient-text">
          Portfolio Admin
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

          <div className="search-bar">
            <Search size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search projects by title, role or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: "auto", padding: "0.6rem 1rem" }}
          >
            <LogOut size={18} />
          </button>
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
            Projects Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage and monitor your professional work history
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            className="glass"
            style={{
              display: "flex",
              borderRadius: "var(--radius-md)",
              padding: "0.25rem",
            }}
          >
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              title="Refresh Projects"
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <div
              style={{
                width: "1px",
                background: "var(--glass-border)",
                margin: "0.5rem 0.25rem",
              }}
            />
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                background:
                  viewMode === "grid" ? "var(--accent-muted)" : "transparent",
                color:
                  viewMode === "grid"
                    ? "var(--accent-primary)"
                    : "var(--text-muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                background:
                  viewMode === "list" ? "var(--accent-muted)" : "transparent",
                color:
                  viewMode === "list"
                    ? "var(--accent-primary)"
                    : "var(--text-muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <List size={20} />
            </button>
          </div>
          <button className="btn btn-primary" style={{ width: "auto" }}>
            <Plus size={20} />
            Add Project
          </button>
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            gap: "1rem",
            color: "var(--text-secondary)",
          }}
        >
          <Loader2 className="animate-spin" size={40} />
          <p>Loading projects...</p>
        </div>
      ) : (
        <motion.div
          layout
          className={viewMode === "grid" ? "project-grid" : ""}
          style={
            viewMode === "list"
              ? { display: "flex", flexDirection: "column", gap: "1rem" }
              : {}
          }
        >
          <AnimatePresence>
            {filteredProjects.map((project: Project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="project-card glass"
                style={
                  viewMode === "list"
                    ? {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }
                    : {}
                }
              >
                <div style={viewMode === "list" ? { flex: 1 } : {}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: viewMode === "grid" ? "1rem" : "0",
                    }}
                  >
                    <h3 style={{ fontSize: "1.25rem" }}>{project.title}</h3>
                    {viewMode === "grid" && (
                      <ExternalLink
                        size={18}
                        style={{ color: "var(--text-muted)" }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      color: "var(--accent-primary)",
                      fontSize: "0.9rem",
                      marginBottom: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    {project.role}
                  </p>

                  {viewMode === "grid" && (
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.problem}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: viewMode === "grid" ? "1.5rem" : "0",
                    }}
                  >
                    {project.skills.map((skill: string) => (
                      <span key={skill} className="badge badge-skill">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {viewMode === "grid" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        borderTop: "1px solid var(--glass-border)",
                        paddingTop: "1rem",
                      }}
                    >
                      <Calendar size={14} />
                      <span>
                        Delivered on{" "}
                        {new Date(project.delivery_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: viewMode === "grid" ? "1.5rem" : "0",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "0.5rem", width: "auto" }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{
                      padding: "0.5rem",
                      width: "auto",
                      color: "var(--error)",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filteredProjects.length === 0 && (
        <div
          style={{ textAlign: "center", marginTop: "5rem", padding: "3rem" }}
          className="glass"
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            No projects found matching your search.
          </p>
          <button
            className="btn btn-primary"
            style={{ width: "auto", marginTop: "1rem" }}
            onClick={() => setSearch("")}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
