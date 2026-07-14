"use client";

import { useEffect } from "react";

/**
 * Records a view for a post exactly once per browser session.
 * Runs client-side so SSR, metadata generation, prefetches and bots
 * that don't execute JS never inflate the count.
 */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    const key = `blog-viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode etc.) — still count once.
    }

    fetch(`/api/blogs/${slug}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Non-critical: a failed view ping should never affect the reader.
    });
  }, [slug]);

  return null;
}
