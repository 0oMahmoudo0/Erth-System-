import { prisma } from "@/lib/db";
import Link from "next/link";
import ProductCardActions from "./product-actions";

export const dynamic = 'force-dynamic';

export default async function ProductsCatalogPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }

  // Group products by category
  const groupedProducts = products.reduce((acc: any, product: any) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts).sort();

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Products Catalog</h1>
      </div>

      {categories.length === 0 ? (
        <div className="text-neutral-500 py-12 text-center border border-dashed border-neutral-300 rounded">
          No products found. Add products from the Inventory page first!
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="text-xl font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedProducts[category].map((product: any) => (
                  <div key={product.id} className="border border-neutral-200 rounded overflow-hidden hover:border-neutral-300 transition-colors bg-white shadow-sm flex flex-col">
                    <div className="aspect-square bg-neutral-100 relative">
                      {product.photo ? (
                        <img 
                          src={product.photo} 
                          alt={product.name} 
                          className="w-full h-full object-cover absolute inset-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm absolute inset-0">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col bg-white">
                      <h3 className="font-medium text-neutral-900 mb-1">{product.name}</h3>
                      {product.cost != null && (
                        <p className="text-sm text-neutral-500 mt-auto pt-2">Cost: {product.cost} EGP</p>
                      )}
                    </div>
                    <ProductCardActions productId={product.id} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
