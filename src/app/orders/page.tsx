import Link from "next/link";
import { prisma } from "@/lib/db";
import OrderListFilters from "./filters";

export const dynamic = 'force-dynamic';

export default async function OrdersDirectoryPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'current';

  // Build the dynamic where clause
  let where: any = {};

  if (query) {
    where.OR = [
      { orderNumber: { contains: query, mode: 'insensitive' } },
      { customer: { name: { contains: query, mode: 'insensitive' } } },
      { customer: { phone: { contains: query } } },
      { trackingCode: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Handle lifecycle stage filtering
  if (statusFilter === 'current') {
    where.status = { notIn: ['COLLECTED', 'CANCELLED'] };
  } else if (statusFilter === 'completed') {
    where.status = 'COLLECTED';
  } else if (statusFilter === 'cancelled') {
    where.status = 'CANCELLED';
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        product: true,
        inventoryItem: {
          include: { location: true }
        }
      }
    });
  } catch (e) {
    console.error("Database connection failed", e);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              &larr; Back
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Orders Directory</h1>
        </div>
        <Link 
          href="/orders/new" 
          className="px-6 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          + Create New Order
        </Link>
      </div>

      {/* Filters and Search Client Component */}
      <OrderListFilters currentStatus={statusFilter} currentQuery={query || ''} />

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-medium">Order Number</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                  No orders found matching the criteria.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{order.orderNumber}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{order.customer.name}</div>
                    <div className="text-xs text-neutral-500">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{order.product.name} ({order.quantity}x)</div>
                    <div className="text-xs text-neutral-500">Loc: {order.inventoryItem.location.name}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {order.codAmount} EGP
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${
                      order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      order.status === 'COLLECTED' ? 'bg-green-50 text-green-700 border-green-200' :
                      order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
