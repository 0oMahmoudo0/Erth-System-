"use client";

import { useTransition } from "react";
import { resetAllManualBalances } from "@/app/accounts/actions";

export function ResetBalancesButton() {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    if (confirm("WARNING: This will reset ALL manual balance adjustments across ALL accounts to 0. It will NOT delete orders or deposits. Are you absolutely sure?")) {
      startTransition(async () => {
        await resetAllManualBalances();
      });
    }
  };

  return (
    <button 
      onClick={handleReset}
      disabled={isPending}
      className="mt-4 px-4 py-2 border-2 border-[var(--border-color)] text-xs font-mono font-black uppercase tracking-widest hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "RESETTING..." : "RESET MANUAL BALANCES"}
    </button>
  );
}
