"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Briefcase, BarChart3, LogOut } from "lucide-react";
import { AuthService } from "../services/auth.service";
import { showToast } from "../utils/toast";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await AuthService.signOut();
    showToast.info("Signed out successfully.");
    router.push("/login");
  };

  const navItems = [
    {
      name: "Overview",
      path: "/overview",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Projects", path: "/dashboard", icon: <Briefcase size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <h2 className="gradient-text sidebar-title">Portfolio Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`sidebar-link ${pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
