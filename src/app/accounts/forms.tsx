"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAccount } from "./actions";

export function CreateAccountForm() {
  const [state, formAction, isPending] = useActionState(createAccount, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="border border-neutral-200 p-6 rounded bg-white">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Add Payment Account</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Account Name *</span>
          <input required name="name" type="text" placeholder="e.g. Vodafone Cash - 010..." className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Account Code (Optional)</span>
          <input name="code" type="text" placeholder="e.g. VF_CASH_MAIN (Auto-generated if left blank)" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>

        <div className="pt-2">
          <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {isPending ? "Adding..." : "Add Account"}
          </button>
        </div>
      </form>
    </section>
  );
}
