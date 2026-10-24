"use client";
import { useEffect } from "react";
import { recordVisit } from "../../lib/api";

export default function VisitTracker({ slug }) {
  useEffect(() => {
    try {
      const device = window.innerWidth < 768 ? "mobile" : "desktop";
      recordVisit(slug || window.location.pathname, device).catch(() => {});
    } catch (e) {}
  }, [slug]);

  return null;
}
