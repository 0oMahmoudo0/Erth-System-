"use client";

import { useActionState } from "react";
import { createEmployee, deleteEmployee } from "./actions";

export function CreateEmployeeForm() {
  const [state, formAction, isPending] = useActionState(createEmployee, null);

  return (
    <form action={formAction} className="border-2 border-white p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-black mb-4 tracking-tighter">NEW AGENT</h2>
      
      {state?.error && (
        <div className="bg-white text-black p-3 font-bold text-sm tracking-widest uppercase">
          {state.error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">AGENT NAME</label>
          <input name="name" required placeholder="JOHN DOE" className="w-full" />
        </div>

        <div>
          <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">COMMISSION %</label>
          <input name="commissionPercent" type="number" step="0.1" required placeholder="0.0" className="w-full" />
        </div>
      </div>
      
      <button type="submit" disabled={isPending} className="w-full mt-4 p-4 text-center cursor-pointer">
        {isPending ? "ADDING..." : "ADD AGENT"}
      </button>
    </form>
  );
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <button 
      type="button"
      onClick={async () => {
        if(confirm("ARE YOU SURE YOU WANT TO REMOVE THIS AGENT?")) {
          await deleteEmployee(id);
        }
      }}
      className="px-4 py-2 text-xs border border-white hover:bg-white hover:text-black !bg-transparent !text-white cursor-pointer"
    >
      REMOVE
    </button>
  );
}
