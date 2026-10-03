"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";
import Link from "next/link";

export default function ProductCardActions({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        const res = await deleteProduct(productId);
        if (res?.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <div className="flex border-t border-neutral-100 bg-neutral-50 divide-x divide-neutral-200 mt-auto">
      <Link href={`/products/${productId}`} className="flex-1 text-center py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="flex-1 text-center py-2.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
