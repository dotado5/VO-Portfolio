"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toast";
import { Loader2, Plus, Edit2, Trash, X } from "lucide-react";

type Experience = {
  id: string;
  type: string;
  date: string;
  role: string;
  company: string;
  description: string;
  created_at: string;
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    role: "",
    company: "",
    description: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("WorkExperience")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Failed to load experiences", error);
      showToast.error("Failed to load work experiences.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingId(exp.id);
      setFormData({
        type: exp.type,
        date: exp.date,
        role: exp.role,
        company: exp.company,
        description: exp.description,
      });
    } else {
      setEditingId(null);
      setFormData({
        type: "",
        date: "",
        role: "",
        company: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      if (editingId) {
        const { error } = await supabase
          .from("WorkExperience")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        showToast.success("Experience updated!");
      } else {
        const { error } = await supabase
          .from("WorkExperience")
          .insert([formData]);
        if (error) throw error;
        showToast.success("Experience added!");
      }

      await fetchExperiences();
      closeModal();
    } catch (error) {
      console.error("Error saving experience", error);
      showToast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const { error } = await supabase.from("WorkExperience").delete().eq("id", id);
      if (error) throw error;
      
      setExperiences(experiences.filter(exp => exp.id !== id));
      showToast.success("Experience deleted.");
    } catch (error) {
      console.error("Error deleting experience", error);
      showToast.error("Failed to delete.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px" }}>
        <Loader2 className="animate-spin text-muted" size={48} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Work Experience</h1>
        <button className="btn btn-primary" onClick={() => openModal()} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={20} /> Add Experience
        </button>
      </div>
      
      <div className="glass" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", backgroundColor: "rgba(0,0,0,0.02)" }}>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Company</th>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Type</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  No work experiences added yet.
                </td>
              </tr>
            ) : (
              experiences.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>{exp.role}</td>
                  <td style={{ padding: "1rem" }}>{exp.company}</td>
                  <td style={{ padding: "1rem" }}>{exp.date}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "1rem", fontSize: "0.75rem" }}>
                      {exp.type}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <button onClick={() => openModal(exp)} style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--border)", backgroundColor: "white", cursor: "pointer" }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid var(--border)", backgroundColor: "white", color: "red", cursor: "pointer" }}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div className="glass" style={{ width: "100%", maxWidth: "500px", borderRadius: "var(--radius-lg)", padding: "2rem", position: "relative" }}>
            <button onClick={closeModal} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>{editingId ? "Edit Experience" : "Add Experience"}</h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>Role / Title</label>
                <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>Company</label>
                <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>Date (e.g. 2020-2021)</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>Type (e.g. Remote)</label>
                  <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: "100%", minHeight: "100px", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : null}
                {isSaving ? "Saving..." : "Save Experience"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
