"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProduct, addStock } from "./actions";

export function CreateProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="border border-neutral-200 p-6 rounded">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Create New Product</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Product Name</span>
          <input required name="name" type="text" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Category</span>
          <input name="category" type="text" placeholder="e.g. T-Shirts" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Standard Cost (EGP)</span>
            <input name="cost" type="number" step="0.01" min="0" placeholder="0.00" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Upload Photo</span>
            <input name="photo" type="file" accept="image/*" className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200" />
          </label>
        </div>
        
        <div className="pt-2">
          <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function AddStockForm({ products, locations }: { products: any[], locations: any[] }) {
  const [state, formAction, isPending] = useActionState(addStock, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="border border-neutral-200 p-6 rounded bg-neutral-50">
      <h2 className="text-base font-medium text-neutral-900 mb-4">Add / Restock Inventory</h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded">{state.success}</div>}

        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Select Product</span>
          <select name="productId" required className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="">Choose product...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        
        {locations.length > 0 && (
          <input type="hidden" name="locationId" value={locations[0].id} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Size (Optional)</span>
            <input name="size" type="text" className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Quantity</span>
            <input name="quantity" type="number" min="1" required className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Unit Cost (EGP)</span>
            <input name="unitCost" type="number" step="0.01" min="0" required className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-700 mb-1">Raw Material</span>
            <input name="rawMaterialName" type="text" className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Reason (Optional)</span>
          <input name="reason" type="text" placeholder="e.g. Initial Stock" className="w-full border border-neutral-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>

        <div className="pt-2">
          <button type="submit" disabled={isPending} className="w-full py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {isPending ? "Recording..." : "Record Stock Addition"}
          </button>
        </div>
      </form>
    </section>
  );
}
