"use client";

import { logout } from "@/app/login/actions";

export function LogoutButton() {
  return (
    <button 
      onClick={() => logout()}
      className="fixed bottom-6 left-6 z-50 px-3 py-1 font-mono text-xs font-black tracking-widest uppercase border-2 border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--fg-color)] hover:opacity-70 transition-all cursor-pointer"
    >
      LOGOUT
    </button>
  );
}
