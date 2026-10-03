"use client";

import { useTransition } from "react";
import { deletePlan } from "./actions";
import Link from "next/link";

export default function PlanActions({ planId }: { planId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete/archive this plan?")) {
      startTransition(async () => {
        const res = await deletePlan(planId);
        if (res?.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Link href={`/partnerships/${planId}`} className="text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded transition-colors bg-white">
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {isPending ? "Archiving..." : "Delete"}
      </button>
    </div>
  );
}
