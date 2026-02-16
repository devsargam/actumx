"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "x402-theme-mode";

function applyTheme(mode: ThemeMode): void {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function ThemeToggle({ showIndicator = true }: { showIndicator?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const system: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme: ThemeMode = saved === "dark" || saved === "light" ? saved : system;

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  const currentTheme = mounted ? theme : "light";

  return (
    <div className="flex items-center gap-2">
      {showIndicator ? (
        <Badge variant="outline" className="capitalize">
          {currentTheme}
        </Badge>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
        {currentTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        <span>{currentTheme === "dark" ? "Light" : "Dark"} Mode</span>
      </Button>
    </div>
  );
}
