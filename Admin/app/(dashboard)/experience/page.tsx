"use client";

import React, { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toast";
import {
  Loader2,
  Plus,
  Edit2,
  Trash,
  X,
  GripVertical,
  Check,
} from "lucide-react";

type Experience = {
  id: string;
  type: string;
  date: string;
  role: string;
  company: string;
  description: string;
  position: number;
  created_at: string;
};

const supabase = createClient();

// ---- Draggable row (needs its own drag controls, hence a subcomponent) ----
function ExperienceRow({
  exp,
  onEdit,
  onDelete,
  onCommit,
}: {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (id: string) => void;
  onCommit: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={exp}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      className="glass"
      style={{
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--glass-border)",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.35))",
        cursor: "grabbing",
      }}
    >
      {/* drag handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        title="Drag to reorder"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          cursor: "grab",
          touchAction: "none",
          padding: "0.25rem",
        }}
      >
        <GripVertical size={20} />
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 700 }}>{exp.role}</span>
          <span style={{ color: "var(--text-muted)" }}>·</span>
          <span style={{ color: "var(--text-secondary)" }}>{exp.company}</span>
          <span
            style={{
              padding: "0.15rem 0.6rem",
              background: "var(--glass-border)",
              borderRadius: "999px",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
            }}
          >
            {exp.type}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
          }}
        >
          {exp.date}
        </p>
      </div>

      {/* actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          className="btn btn-secondary"
          style={{ padding: "0.5rem", width: "auto" }}
          onClick={() => onEdit(exp)}
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="btn btn-secondary"
          style={{ padding: "0.5rem", width: "auto", color: "var(--error)" }}
          onClick={() => onDelete(exp.id)}
          title="Delete"
        >
          <Trash size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Always-current view of the list order, so drag-end can persist without
  // waiting on a state flush.
  const orderRef = useRef<Experience[]>([]);

  const [formData, setFormData] = useState({
    type: "",
    date: "",
    role: "",
    company: "",
    description: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("WorkExperience")
        .select("*")
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      const list = (data || []) as Experience[];
      setExperiences(list);
      orderRef.current = list;
    } catch (error) {
      console.error("Failed to load experiences", error);
      showToast.error("Failed to load work experiences.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = (newOrder: Experience[]) => {
    orderRef.current = newOrder;
    setExperiences(newOrder);
  };

  const persistOrder = async () => {
    const current = orderRef.current;
    const changed = current.some((exp, index) => exp.position !== index);
    if (!changed) return;

    try {
      setIsSavingOrder(true);
      await Promise.all(
        current
          .map((exp, index) =>
            exp.position === index
              ? null
              : supabase
                  .from("WorkExperience")
                  .update({ position: index })
                  .eq("id", exp.id),
          )
          .filter(Boolean),
      );

      const renumbered = current.map((exp, index) => ({
        ...exp,
        position: index,
      }));
      orderRef.current = renumbered;
      setExperiences(renumbered);
      showToast.success("Order saved.");
    } catch (error) {
      console.error("Failed to save order", error);
      showToast.error("Failed to save the new order.");
      fetchExperiences(); // revert to server truth
    } finally {
      setIsSavingOrder(false);
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
      setFormData({ type: "", date: "", role: "", company: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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
        // New entries land at the bottom of the current order.
        const { error } = await supabase
          .from("WorkExperience")
          .insert([{ ...formData, position: experiences.length }]);
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
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;

    try {
      const { error } = await supabase
        .from("WorkExperience")
        .delete()
        .eq("id", id);
      if (error) throw error;

      const remaining = experiences.filter((exp) => exp.id !== id);
      setExperiences(remaining);
      orderRef.current = remaining;
      showToast.success("Experience deleted.");
    } catch (error) {
      console.error("Error deleting experience", error);
      showToast.error("Failed to delete.");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
      >
        <Loader2 className="animate-spin text-muted" size={48} />
      </div>
    );
  }

  return (
    <div
      style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
          Work Experience
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => openModal()}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={20} /> Add Experience
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          minHeight: "1.25rem",
        }}
      >
        {isSavingOrder ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Saving order…</span>
          </>
        ) : (
          <>
            <GripVertical size={14} />
            <span>
              Drag the handle to reorder — this is the order shown on your site.
            </span>
          </>
        )}
      </div>

      {experiences.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            color: "var(--text-secondary)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          No work experiences added yet.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={experiences}
          onReorder={handleReorder}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {experiences.map((exp) => (
            <ExperienceRow
              key={exp.id}
              exp={exp}
              onEdit={openModal}
              onDelete={handleDelete}
              onCommit={persistOrder}
            />
          ))}
        </Reorder.Group>
      )}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <X size={24} />
            </button>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              {editingId ? "Edit Experience" : "Add Experience"}
            </h2>

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  Role / Title
                </label>
                <input
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--glass-border)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  Company
                </label>
                <input
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--glass-border)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    Date (e.g. 2020-2021)
                  </label>
                  <input
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    Type (e.g. Remote)
                  </label>
                  <input
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--glass-border)",
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--glass-border)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                {isSaving ? "Saving..." : "Save Experience"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
