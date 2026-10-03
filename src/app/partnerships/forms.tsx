"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPartner, createPartnershipPlan, addPlanMember } from "./actions";

export function CreatePartnerForm() {
  const [state, formAction, isPending] = useActionState(createPartner, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <section className="border border-neutral-200 p-6 rounded bg-white">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Add New Partner</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Partner Name</span>
          <input required name="name" type="text" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        
        <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
          {isPending ? "Adding..." : "Add Partner"}
        </button>
      </form>
    </section>
  );
}

export function CreatePlanForm() {
  const [state, formAction, isPending] = useActionState(createPartnershipPlan, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <section className="border border-neutral-200 p-6 rounded bg-white">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Create Partnership Plan</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Plan Name</span>
          <input required name="name" type="text" placeholder="e.g., Q4 Mega Plan" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>

        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Description (Optional)</span>
          <textarea name="description" rows={2} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        
        <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
          {isPending ? "Creating..." : "Create Plan"}
        </button>
      </form>
    </section>
  );
}

export function AddPlanMemberForm({ plans, partners }: { plans: any[], partners: any[] }) {
  const [state, formAction, isPending] = useActionState(addPlanMember, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  if (plans.length === 0 || partners.length === 0) return null;

  return (
    <section className="border border-neutral-200 p-6 rounded bg-neutral-50">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Add Partner to Plan</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Select Plan</span>
          <select name="planId" required className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="">Choose plan...</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Select Partner</span>
          <select name="partnerId" required className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="">Choose partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Profit Percentage (%)</span>
            <input required name="profitPercentage" type="number" step="0.1" min="0" max="100" placeholder="e.g. 50" className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Contribution (EGP)</span>
            <input required name="contributionAmount" type="number" step="0.01" min="0" placeholder="0.00" className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {isPending ? "Assigning..." : "Assign to Plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
