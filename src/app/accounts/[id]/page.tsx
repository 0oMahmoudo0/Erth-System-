import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditAccountForm from "./edit-form";
import { ManualAdjustForm } from "../manual-adjust-form";

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const account = await prisma.paymentAccount.findUnique({
    where: { id: resolvedParams.id },
    include: {
      deposits: {
        include: { order: true },
        orderBy: { transactionDate: 'desc' }
      },
      orders: {
        include: { customer: true, product: true },
        orderBy: { transactionDate: 'desc' }
      }
    }
  });

  if (!account) {
    notFound();
  }

  // Calculate Balance
  const depositsTotal = account.deposits.reduce((acc, dep) => acc + dep.amount, 0);
  const collectedOrdersTotal = account.orders
    .filter(o => o.status === 'COLLECTED')
    .reduce((acc, o) => acc + o.codAmount, 0);

  const totalBalance = depositsTotal + collectedOrdersTotal + account.manualBalance;

  // Merge history
  const history: any[] = [
    ...account.deposits.map(d => ({
      id: `dep_${d.id}`,
      type: 'DEPOSIT',
      amount: d.amount,
      date: d.transactionDate,
      orderNumber: d.order?.orderNumber,
      description: `Advance Deposit for Order #${d.order?.orderNumber}`
    })),
    ...account.orders.filter(o => o.status === 'COLLECTED').map(o => ({
      id: `ord_${o.id}`,
      type: 'COLLECTION',
      amount: o.codAmount,
      date: o.transactionDate,
      orderNumber: o.orderNumber,
      description: `COD Collected for Order #${o.orderNumber}`
    }))
  ];

  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/accounts" className="text-xs font-mono font-black tracking-widest hover:underline uppercase opacity-70">
          &larr; BACK TO ACCOUNTS
        </Link>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">{account.name} DASHBOARD</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Stats & Edit */}
        <div className="space-y-8">
          <div className="bg-[var(--fg-color)] text-[var(--bg-color)] p-6 shadow-[8px_8px_0px_0px_var(--border-color)] border-2 border-[var(--border-color)]">
            <h2 className="text-xs font-mono font-black mb-2 uppercase tracking-widest opacity-80">TOTAL BALANCE</h2>
            <div className="text-5xl font-black tracking-tighter leading-none mb-4">{totalBalance.toLocaleString()} <span className="text-xl">EGP</span></div>
            <div className="border-t-2 border-[var(--bg-color)] border-dashed pt-4">
               <h3 className="text-[10px] font-mono tracking-widest uppercase opacity-70 mb-2">MANUAL ADJUSTMENT</h3>
               <ManualAdjustForm accountId={account.id} currentBalance={totalBalance} />
            </div>
          </div>

          <div className="border-2 border-[var(--border-color)] bg-[var(--bg-color)] p-6">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest border-b-2 border-[var(--border-color)] pb-2">ACCOUNT SETTINGS</h2>
            <EditAccountForm account={account} />
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase border-b-4 border-[var(--border-color)] pb-2 mb-6">
            TRANSACTION HISTORY
          </h2>
          
          {history.length === 0 ? (
            <div className="font-mono text-sm opacity-70 p-12 text-center border-2 border-[var(--border-color)] border-dashed uppercase tracking-widest">
              NO TRANSACTIONS RECORDED YET.
            </div>
          ) : (
            <div className="border-2 border-[var(--border-color)] overflow-hidden">
              <table className="w-full text-left text-sm font-mono uppercase tracking-widest">
                <thead className="bg-[var(--fg-color)] text-[var(--bg-color)] text-[10px]">
                  <tr>
                    <th className="px-6 py-4 font-black">DATE</th>
                    <th className="px-6 py-4 font-black">TYPE</th>
                    <th className="px-6 py-4 font-black">DESCRIPTION</th>
                    <th className="px-6 py-4 font-black text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[var(--border-color)]">
                  {history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(tx.date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-1 font-black ${tx.type === 'DEPOSIT' ? 'bg-[var(--fg-color)] text-[var(--bg-color)]' : 'bg-transparent border-2 border-current'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{tx.description}</div>
                        <div className="text-[10px] opacity-70 mt-1">ORDER: {tx.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-black whitespace-nowrap text-lg">
                        + {tx.amount.toLocaleString()} EGP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
