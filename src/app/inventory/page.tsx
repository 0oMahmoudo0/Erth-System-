import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreateProductForm, AddStockForm } from "./forms";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  let products: any[] = [];
  let locations: any[] = [];
  let inventoryItems: any[] = [];
  let movements: any[] = [];

  try {
    products = await prisma.product.findMany({ 
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' } 
    });
    locations = await prisma.location.findMany({ 
      select: { id: true, name: true },
      orderBy: { name: 'asc' } 
    });
    inventoryItems = await prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      include: { product: true, location: true },
      orderBy: { product: { name: 'asc' } }
    });
    movements = await prisma.inventoryMovement.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { product: true }
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Inventory & Stock</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Management Forms */}
        <div className="space-y-8">
          <CreateProductForm />
          <AddStockForm products={products} locations={locations} />
        </div>

        {/* Right Column: Inventory Overview and Movements */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-3xl md:text-5xl font-black border-b-2 border-white pb-4 mb-6 tracking-tighter uppercase">
              CURRENT AVAILABLE STOCK
            </h2>
            <div className="space-y-8">
              {inventoryItems.length === 0 ? (
                <div className="text-neutral-500 py-12 text-center border-2 border-dashed border-white font-mono tracking-widest uppercase">
                  No active inventory available. Add stock to begin.
                </div>
              ) : (
                (() => {
                  // Group by product
                  const groupedInventory = inventoryItems.reduce((acc, item) => {
                    if (!acc[item.productId]) {
                      acc[item.productId] = {
                        product: item.product,
                        totalQuantity: 0,
                        variants: []
                      };
                    }
                    acc[item.productId].totalQuantity += item.quantity;
                    acc[item.productId].variants.push(item);
                    return acc;
                  }, {} as Record<string, any>);
                  
                  const groupedArray = Object.values(groupedInventory);

                  return groupedArray.map((group) => (
                    <div key={group.product.id} className="border-2 border-white bg-black flex flex-col">
                      <div className="p-4 md:p-6 border-b-2 border-white flex items-center gap-6 bg-white text-black">
                        {group.product.photo ? (
                          <img src={group.product.photo} alt={group.product.name} className="w-16 h-16 object-cover border-2 border-black" />
                        ) : (
                          <div className="w-16 h-16 border-2 border-black flex items-center justify-center font-mono text-xs font-black bg-neutral-200">NO IMG</div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{group.product.name}</h3>
                          <p className="font-mono text-sm tracking-widest font-black mt-1">TOTAL IN STOCK: {group.totalQuantity}</p>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                          <thead>
                            <tr className="opacity-70">
                              <th className="pb-4 font-normal tracking-widest border-none text-white !bg-transparent">SIZE</th>
                              <th className="pb-4 font-normal tracking-widest border-none text-white !bg-transparent">LOCATION</th>
                              <th className="pb-4 font-normal tracking-widest border-none text-white !bg-transparent text-right">QUANTITY</th>
                              <th className="pb-4 font-normal tracking-widest border-none text-white !bg-transparent text-right">UNIT COST</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-neutral-800">
                            {group.variants.map((item: any) => (
                              <tr key={item.id} className="hover:bg-white hover:text-black transition-colors group/row">
                                <td className="py-4 font-bold border-none !bg-transparent group-hover/row:!text-black group-hover/row:!bg-white">{item.size || "DEFAULT"}</td>
                                <td className="py-4 uppercase border-none !bg-transparent group-hover/row:!text-black group-hover/row:!bg-white">{item.location.name}</td>
                                <td className="py-4 text-right font-bold text-lg border-none !bg-transparent group-hover/row:!text-black group-hover/row:!bg-white">{item.quantity}</td>
                                <td className="py-4 text-right border-none !bg-transparent group-hover/row:!text-black group-hover/row:!bg-white">{item.unitCost} EGP</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
              Recent Movements Log
            </h2>
            <div className="bg-white border border-neutral-200 rounded overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Change</th>
                    <th className="px-6 py-4 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                        No recent inventory movements.
                      </td>
                    </tr>
                  ) : (
                    movements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">{new Date(mov.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-neutral-900">
                          {mov.product.name} {mov.size && `(${mov.size})`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${
                            mov.movementType === 'ADDITION' ? 'bg-green-50 text-green-700 border-green-200' :
                            mov.movementType === 'ORDER_DEDUCTION' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {mov.movementType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-neutral-900">
                          {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                        </td>
                        <td className="px-6 py-4 text-xs">{mov.reason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
