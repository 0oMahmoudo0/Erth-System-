"use client";

import { useActionState } from "react";
import { updatePlan } from "../actions";
import Link from "next/link";

export default function EditPlanForm({ plan }: { plan: any }) {
  const updatePlanWithId = updatePlan.bind(null, plan.id);
  const [state, formAction, isPending] = useActionState(updatePlanWithId, null);

  return (
    <form action={formAction} className="space-y-6 max-w-xl bg-white p-6 border border-neutral-200 rounded shadow-sm">
      {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
      
      <label className="block">
        <span className="block text-sm text-neutral-700 mb-1">Plan Name *</span>
        <input required name="name" defaultValue={plan.name} type="text" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
      </label>
      
      <label className="block">
        <span className="block text-sm text-neutral-700 mb-1">Description</span>
        <textarea name="description" defaultValue={plan.description || ""} rows={3} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
      </label>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" name="isActive" defaultChecked={plan.isActive} className="accent-accent" />
        <span className="text-sm text-neutral-700">Plan is Active</span>
      </label>
      
      <div className="pt-4 flex gap-4">
        <button type="submit" disabled={isPending} className="flex-1 py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <Link href="/partnerships" className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded text-sm hover:bg-neutral-50 transition-colors text-center flex items-center justify-center">
          Cancel
        </Link>
      </div>
    </form>
  );
}
