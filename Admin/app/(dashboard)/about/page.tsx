"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toast";
import { Loader2 } from "lucide-react";

export default function AboutPage() {
  const [leadText, setLeadText] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("AboutMe")
        .select("*")
        .limit(1)
        .single();
      
      if (data) {
        setLeadText(data.lead_text || "");
        setDescription(data.description || "");
      }
    } catch (error) {
      console.error("Failed to load About Me data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { data: existingData } = await supabase
        .from("AboutMe")
        .select("id")
        .limit(1)
        .single();
      
      if (existingData?.id) {
        const { error } = await supabase
          .from("AboutMe")
          .update({ lead_text: leadText, description: description })
          .eq("id", existingData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("AboutMe")
          .insert([{ lead_text: leadText, description: description }]);
        if (error) throw error;
      }

      showToast.success("About Me updated successfully!");
    } catch (error) {
      console.error("Error saving About Me", error);
      showToast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px" }}>
        <Loader2 className="animate-spin text-muted" size={48} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Edit About Me</h1>
      
      <div className="glass" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Lead Text (Intro Paragraph)
          </label>
          <textarea
            value={leadText}
            onChange={(e) => setLeadText(e.target.value)}
            style={{ 
              width: "100%", 
              minHeight: "100px", 
              padding: "1rem", 
              borderRadius: "0.5rem",
              border: "1px solid var(--glass-border)",
              backgroundColor: "rgba(255, 255, 255, 0.5)"
            }}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Description (Main Body)
          </label>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            Use newlines to separate paragraphs.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ 
              width: "100%", 
              minHeight: "300px", 
              padding: "1rem", 
              borderRadius: "0.5rem",
              border: "1px solid var(--glass-border)",
              backgroundColor: "rgba(255, 255, 255, 0.5)"
            }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "center" }}
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : null}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
