import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusForm } from "./status-form";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      customer: true,
      product: true,
      callCenterEmployee: true,
      collectionAccount: true,
      inventoryItem: {
        include: { location: true }
      }
    }
  });

  const accounts = await prisma.paymentAccount.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-24">
      <div className="mb-16">
        <Link href="/orders" className="font-mono text-sm tracking-widest hover:bg-white hover:text-black p-2 border border-transparent hover:border-white transition-colors uppercase">
          [ &larr; BACK TO DIRECTORY ]
        </Link>
        <h1 className="text-4xl md:text-6xl font-black mt-8 tracking-tighter uppercase">
          ORDER: {order.orderNumber}
        </h1>
        <p className="font-mono mt-4 opacity-70 tracking-widest uppercase">
          CREATED: {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="border-2 border-white p-6">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-white pb-2 uppercase tracking-tighter">CUSTOMER DATA</h2>
            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
              <div><span className="opacity-50 block mb-1">NAME</span><span className="font-bold text-lg">{order.customer.name}</span></div>
              <div><span className="opacity-50 block mb-1">PHONE</span><span className="font-bold">{order.customer.phone}</span></div>
              <div className="col-span-2"><span className="opacity-50 block mb-1">ADDRESS</span><span>{order.customer.address}, {order.customer.governorate}</span></div>
            </div>
          </div>

          <div className="border-2 border-white p-6">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-white pb-2 uppercase tracking-tighter">PRODUCT DATA</h2>
            <div className="flex items-center gap-6">
              {order.product.photo && (
                <img src={order.product.photo} alt={order.product.name} className="w-24 h-24 object-cover border-2 border-white" />
              )}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm flex-1">
                <div><span className="opacity-50 block mb-1">PRODUCT</span><span className="font-bold uppercase">{order.product.name}</span></div>
                <div><span className="opacity-50 block mb-1">SIZE</span><span className="font-bold uppercase">{order.size || "DEFAULT"}</span></div>
                <div><span className="opacity-50 block mb-1">QUANTITY</span><span className="font-bold text-xl">{order.quantity}</span></div>
                <div><span className="opacity-50 block mb-1">SOURCE</span><span className="uppercase">{order.inventoryItem?.location?.name || "AUTO GENERATED"}</span></div>
              </div>
            </div>
          </div>

          <div className="border-2 border-white p-6">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-white pb-2 uppercase tracking-tighter">FINANCIALS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
              <div><span className="opacity-50 block mb-1">RAW COST</span><span>{order.rawMaterialUnitCost} EGP</span></div>
              <div><span className="opacity-50 block mb-1">SHIPPING</span><span>{order.shippingCost} EGP</span></div>
              <div><span className="opacity-50 block mb-1">ADDITIONAL EXP.</span><span>{order.totalAdditionalExpenses} EGP</span></div>
              <div><span className="opacity-50 block mb-1">COD AMOUNT</span><span className="font-bold text-lg">{order.codAmount} EGP</span></div>
              <div className="col-span-2 md:col-span-4 border-t-2 border-white border-dashed pt-4 mt-2">
                <span className="opacity-50 block mb-1">REMAINING TO COLLECT</span>
                <span className="font-bold text-2xl">{order.remainingAmount} EGP</span>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-8">
          <StatusForm order={order} accounts={accounts} />
          
          <div className="border-2 border-[var(--border-color)] p-6 font-mono text-sm">
            <h3 className="font-black text-xl mb-4 border-b-2 border-white pb-2 tracking-tighter">METADATA</h3>
            <div className="space-y-3 opacity-80">
              <p>AGENT: {order.callCenterEmployee?.name || "NONE"}</p>
              <p>STOCK STATE: {order.stockState}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
