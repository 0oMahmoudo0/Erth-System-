"use client";

import { useActionState } from "react";
import { updateProduct } from "../actions";
import Link from "next/link";

export default function EditProductForm({ product }: { product: any }) {
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateProductWithId, null);

  return (
    <form action={formAction} className="space-y-6 max-w-xl bg-white p-6 border border-neutral-200 rounded shadow-sm">
      {state?.error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">{state.error}</div>}
      
      <label className="block">
        <span className="block text-sm text-neutral-700 mb-1">Product Name *</span>
        <input required name="name" defaultValue={product.name} type="text" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
      </label>
      
      <label className="block">
        <span className="block text-sm text-neutral-700 mb-1">Category</span>
        <input name="category" defaultValue={product.category || ""} type="text" placeholder="e.g. T-Shirts" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Standard Cost (EGP)</span>
          <input name="cost" defaultValue={product.cost ?? ""} type="number" step="0.01" min="0" placeholder="0.00" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent" />
        </label>
        <label className="block">
          <span className="block text-sm text-neutral-700 mb-1">Upload New Photo (optional)</span>
          <input name="photo" type="file" accept="image/*" className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200" />
        </label>
      </div>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" name="active" defaultChecked={product.active} className="accent-accent" />
        <span className="text-sm text-neutral-700">Product is Active</span>
      </label>
      
      <div className="pt-4 flex gap-4">
        <button type="submit" disabled={isPending} className="flex-1 py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50">
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <Link href="/products" className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded text-sm hover:bg-neutral-50 transition-colors text-center flex items-center justify-center">
          Cancel
        </Link>
      </div>
    </form>
  );
}
