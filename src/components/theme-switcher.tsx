"use client";

import { useEffect, useState } from "react";

function generateCalmColors() {
  const isLight = Math.random() > 0.5;
  const hue1 = Math.floor(Math.random() * 360);
  // Generate a distinctly different hue for the foreground/accents (offset by 90-180 degrees)
  const hue2 = (hue1 + Math.floor(Math.random() * 90) + 90) % 360;
  
  const saturation = Math.floor(Math.random() * 20) + 15; 
  
  if (isLight) {
    const lightness1 = Math.floor(Math.random() * 10) + 85; 
    const lightness2 = Math.floor(Math.random() * 10) + 15; 
    return {
      bg: `hsl(${hue1}, ${saturation + 10}%, ${lightness1}%)`,
      fg: `hsl(${hue2}, ${saturation + 40}%, ${lightness2}%)`,
      border: `hsl(${hue2}, ${saturation + 40}%, ${lightness2}%)`,
      placeholder: `hsl(${hue2}, ${saturation}%, 60%)`,
      muted: `hsl(${hue2}, ${saturation}%, 40%)`
    };
  } else {
    const lightness1 = Math.floor(Math.random() * 10) + 10; 
    const lightness2 = Math.floor(Math.random() * 10) + 85; 
    return {
      bg: `hsl(${hue1}, ${saturation + 10}%, ${lightness1}%)`,
      fg: `hsl(${hue2}, ${saturation + 30}%, ${lightness2}%)`,
      border: `hsl(${hue2}, ${saturation + 30}%, ${lightness2}%)`,
      placeholder: `hsl(${hue2}, ${saturation}%, 40%)`,
      muted: `hsl(${hue2}, ${saturation}%, 60%)`
    };
  }
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");

  const applyColors = (colors: any) => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--fg-color', colors.fg);
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--placeholder-color', colors.placeholder);
    root.style.setProperty('--muted-text', colors.muted);
  };

  const clearColors = () => {
    const root = document.documentElement;
    root.style.removeProperty('--bg-color');
    root.style.removeProperty('--fg-color');
    root.style.removeProperty('--border-color');
    root.style.removeProperty('--placeholder-color');
    root.style.removeProperty('--muted-text');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("kingdom-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (savedTheme === "random") {
      const savedColors = localStorage.getItem("kingdom-random-colors");
      if (savedColors) {
        applyColors(JSON.parse(savedColors));
      } else {
        const colors = generateCalmColors();
        applyColors(colors);
        localStorage.setItem("kingdom-random-colors", JSON.stringify(colors));
      }
    }
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("kingdom-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    if (newTheme === 'random') {
      const colors = generateCalmColors();
      applyColors(colors);
      localStorage.setItem("kingdom-random-colors", JSON.stringify(colors));
    } else {
      clearColors();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col md:flex-row gap-2 border-2 border-[var(--border-color)] bg-[var(--bg-color)] p-2">
      <div className="font-mono text-[10px] tracking-widest uppercase opacity-70 p-2 hidden md:block">
        SYSTEM THEME
      </div>
      <button 
        onClick={() => changeTheme('dark')}
        className={`px-3 py-1 font-mono text-xs font-black tracking-widest uppercase transition-all ${theme === 'dark' ? 'bg-[var(--fg-color)] text-[var(--bg-color)]' : 'bg-transparent text-[var(--fg-color)] hover:opacity-70'}`}
      >
        DARK
      </button>
      <button 
        onClick={() => changeTheme('light')}
        className={`px-3 py-1 font-mono text-xs font-black tracking-widest uppercase transition-all ${theme === 'light' ? 'bg-[var(--fg-color)] text-[var(--bg-color)]' : 'bg-transparent text-[var(--fg-color)] hover:opacity-70'}`}
      >
        LIGHT
      </button>
      <button 
        onClick={() => changeTheme('random')}
        className={`px-3 py-1 font-mono text-xs font-black tracking-widest uppercase transition-all ${theme === 'random' ? 'bg-[var(--fg-color)] text-[var(--bg-color)]' : 'bg-transparent text-[var(--fg-color)] hover:opacity-70'}`}
      >
        RANDOM
      </button>
    </div>
  );
}
