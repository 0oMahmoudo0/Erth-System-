"use client";

import { useTransition, useState } from "react";
import { adjustBalance } from "./actions";

export function ManualAdjustForm({ accountId, currentBalance }: { accountId: string, currentBalance: number }) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<number | "">("");

  const handleAdjust = (operation: 'add' | 'subtract') => {
    if (!amount || Number(amount) <= 0) return;
    
    startTransition(async () => {
      await adjustBalance(accountId, Number(amount), operation);
      setAmount("");
    });
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input 
        type="number" 
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdjust('add');
          }
        }}
        placeholder="AMOUNT"
        className="w-24 text-xs !p-2 !border-[var(--border-color)] !bg-[var(--bg-color)] text-[var(--fg-color)] placeholder-[var(--placeholder-color)]"
      />
      <button 
        type="button"
        disabled={isPending || !amount}
        onClick={() => handleAdjust('subtract')}
        className="px-3 py-2 border !border-[var(--border-color)] !text-[var(--fg-color)] hover:!bg-[var(--fg-color)] hover:!text-[var(--bg-color)] transition-colors disabled:opacity-50 text-xs font-black cursor-pointer bg-transparent"
      >
        -
      </button>
      <button 
        type="button"
        disabled={isPending || !amount}
        onClick={() => handleAdjust('add')}
        className="px-3 py-2 border !border-[var(--border-color)] !text-[var(--fg-color)] hover:!bg-[var(--fg-color)] hover:!text-[var(--bg-color)] transition-colors disabled:opacity-50 text-xs font-black cursor-pointer bg-transparent"
      >
        +
      </button>
    </div>
  );
}
