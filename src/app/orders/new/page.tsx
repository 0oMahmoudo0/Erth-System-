import Link from "next/link";
import OrderForm from "./order-form";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function NewOrderPage() {
  let products: any[] = [];
  let inventoryItems: any[] = [];
  let employees: any[] = [];

  try {
    products = await prisma.product.findMany({ 
      where: { active: true },
      select: { id: true, name: true }
    });
    inventoryItems = await prisma.inventoryItem.findMany({
      where: { active: true, quantity: { gt: 0 } },
      include: { location: true }
    });
    employees = await prisma.callCenterEmployee.findMany({ where: { active: true } });
  } catch (error) {
    console.error("Database connection failed. Ensure database is running and migrated.", error);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">New Order</h1>
      </div>
      
      {products.length === 0 ? (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded mb-8 text-sm">
          No products found. Please seed the database or add products first.
        </div>
      ) : null}

      <OrderForm 
        products={products} 
        inventoryItems={inventoryItems} 
        employees={employees} 
      />
    </main>
  );
}
