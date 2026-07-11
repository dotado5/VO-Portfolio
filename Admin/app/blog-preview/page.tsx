"use client";

import { useEffect, useState } from "react";
import { Outfit, Inter } from "next/font/google";
import { Eye, FileText } from "lucide-react";
import "./preview.css";

const heading = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--prev-heading",
});
const body = Inter({ subsets: ["latin"], variable: "--prev-body" });

interface PreviewData {
  title: string;
  excerpt: string;
  tags: string[];
  read_time: number;
  content: string;
  cover: string;
  published_at: string | null;
}

const PREVIEW_KEY = "blog-preview";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

export default function BlogPreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(PREVIEW_KEY);
        setData(raw ? (JSON.parse(raw) as PreviewData) : null);
      } catch {
        setData(null);
      }
      setLoaded(true);
    };
    read();
    // Refresh if the editor pushes a new preview while this tab is open.
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className={`preview-root ${heading.variable} ${body.variable}`}>
      <div className="preview-banner">
        <Eye size={15} />
        <span>Preview — this is how your post will appear. Not saved yet.</span>
      </div>

      {!loaded ? null : !data ? (
        <div className="preview-empty">
          <FileText size={44} />
          <p>Nothing to preview. Open the preview from the blog editor.</p>
        </div>
      ) : (
        <article className="preview-article">
          <header className="preview-header">
            {data.tags?.length > 0 && (
              <div className="preview-tags">
                {data.tags.map((tag) => (
                  <span key={tag} className="preview-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="preview-title">{data.title || "Untitled post"}</h1>

            <div className="preview-meta">
              <span>{formatDate(data.published_at)}</span>
              <span className="preview-dot">·</span>
              <span>{data.read_time || 1} min read</span>
            </div>
          </header>

          {data.cover && (
            <div className="preview-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.cover} alt={data.title} />
            </div>
          )}

          {data.content ? (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : (
            <p className="preview-placeholder-text">
              Start writing to see your content here…
            </p>
          )}
        </article>
      )}
    </div>
  );
}
