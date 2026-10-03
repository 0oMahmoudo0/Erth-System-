import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditProductForm from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Edit Product: {product.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <EditProductForm product={product} />
        
        {product.photo && (
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-4">Current Photo</h3>
            <img src={product.photo} alt={product.name} className="w-64 h-64 object-cover rounded border border-neutral-200 shadow-sm" />
          </div>
        )}
      </div>
    </main>
  );
}
