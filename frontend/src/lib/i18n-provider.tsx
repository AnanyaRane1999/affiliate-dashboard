"use client";

import { useEffect } from "react";
import i18n from "@/lib/i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const saved = localStorage.getItem("lang") as "de" | "en" | null;
    if (saved) {
      i18n.changeLanguage(saved);
    }
  }, []);

  return <>{children}</>;
}