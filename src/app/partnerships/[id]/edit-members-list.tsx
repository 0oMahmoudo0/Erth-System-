"use client";

import { useState, useTransition } from "react";
import { updatePlanMember, removePlanMember } from "../actions";
import { useRouter } from "next/navigation";

export default function EditPlanMembersList({ members }: { members: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (memberId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profitPercentage = parseFloat(formData.get("profitPercentage") as string);
    const contributionAmount = parseFloat(formData.get("contributionAmount") as string);

    startTransition(async () => {
      const res = await updatePlanMember(memberId, { profitPercentage, contributionAmount });
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleRemove = (memberId: string) => {
    if (confirm("Are you sure you want to remove this partner from the plan?")) {
      startTransition(async () => {
        const res = await removePlanMember(memberId);
        if (res?.error) {
          alert(res.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-neutral-500 py-12 text-center border border-dashed border-neutral-300 rounded bg-neutral-50">
        No partners are assigned to this plan. Add them from the main Partnerships page.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map(member => (
        <form 
          key={member.id} 
          onSubmit={(e) => handleUpdate(member.id, e)} 
          className="bg-white border border-neutral-200 rounded p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm"
        >
          <div className="flex-1 w-full md:w-auto font-medium text-neutral-900">
            {member.partner.name}
          </div>
          
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs text-neutral-500 mb-1">Profit Share (%)</label>
            <input required name="profitPercentage" type="number" step="0.1" defaultValue={member.profitPercentage} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent" />
          </div>

          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs text-neutral-500 mb-1">Contribution (EGP)</label>
            <input required name="contributionAmount" type="number" step="0.01" defaultValue={member.contributionAmount} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent" />
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-5">
            <button type="submit" disabled={isPending} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
              Update
            </button>
            <button type="button" onClick={() => handleRemove(member.id)} disabled={isPending} className="px-3 py-1.5 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
              Remove
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
