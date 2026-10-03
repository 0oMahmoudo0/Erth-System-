import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreateAccountForm } from "./forms";
import AccountActions from "./account-actions";
import { ManualAdjustForm } from "./manual-adjust-form";
import { ResetBalancesButton } from "./reset-balances-button";

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  let accounts: any[] = [];
  let totalSystemBalance = 0;

  try {
    const count = await prisma.paymentAccount.count();
    if (count === 0) {
      const defaults = ["Vodafone Cash", "Instapay", "Yalla Pay", "We Cash", "Arab Bank", "Cash"];
      for (const name of defaults) {
        await prisma.paymentAccount.create({
          data: { name, code: name.toUpperCase().replace(/\s+/g, '_') }
        });
      }
    }

    // Fetch accounts with relations to calculate balance
    accounts = await prisma.paymentAccount.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        deposits: true,
        orders: { where: { status: 'COLLECTED' } }
      }
    });

    // Calculate balances
    accounts = accounts.map(account => {
      const depositsTotal = account.deposits.reduce((acc: number, dep: any) => acc + dep.amount, 0);
      const collectedTotal = account.orders.reduce((acc: number, o: any) => acc + o.codAmount, 0);
      const computedBalance = depositsTotal + collectedTotal + (account.manualBalance || 0);
      
      totalSystemBalance += computedBalance;
      
      return { ...account, computedBalance };
    });

  } catch (error) {
    console.error("Database connection failed", error);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <Link href="/" className="font-mono text-sm tracking-widest hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] p-2 border border-transparent hover:border-[var(--border-color)] transition-colors uppercase">
            [ &larr; BACK TO SYSTEM ]
          </Link>
          <h1 className="text-6xl md:text-8xl font-black mt-8 tracking-tighter uppercase leading-[0.9]">
            PAYMENT<br/>ACCOUNTS
          </h1>
        </div>
        
        {/* TOTAL SYSTEM BALANCE */}
        <div className="border-2 border-[var(--border-color)] p-6 bg-[var(--fg-color)] text-[var(--bg-color)] min-w-[300px]">
          <p className="font-mono text-sm font-black tracking-widest opacity-80 mb-2">TOTAL SYSTEM BALANCE</p>
          <p className="text-5xl font-black tracking-tighter">{totalSystemBalance.toLocaleString()} <span className="text-xl">EGP</span></p>
          <div className="mt-4 border-t-2 border-current border-dashed pt-4">
            <ResetBalancesButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <CreateAccountForm />
        </div>

        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl md:text-5xl font-black border-b-2 border-[var(--border-color)] pb-4 mb-6 tracking-tighter">
              ACTIVE ACCOUNTS
            </h2>
            
            {accounts.length === 0 ? (
              <div className="text-[var(--muted-text)] py-12 text-center border-2 border-dashed border-[var(--border-color)] font-mono tracking-widest">
                NO PAYMENT ACCOUNTS FOUND.
              </div>
            ) : (
              <div className="space-y-6">
                {accounts.map((account) => (
                  <div key={account.id} className="border-2 border-[var(--border-color)] flex flex-col md:flex-row p-6 md:items-center justify-between gap-6 hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] transition-colors group">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-black tracking-tighter uppercase">{account.name}</h3>
                        <span className="text-xs px-2 py-1 border border-current font-mono font-black uppercase tracking-widest">
                          {account.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className="font-mono text-sm opacity-70 mb-4">{account.code}</p>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-black">{account.computedBalance.toLocaleString()} EGP</span>
                      </div>
                      
                      {/* +/- Control Buttons */}
                      <ManualAdjustForm accountId={account.id} currentBalance={account.computedBalance} />
                    </div>

                    <div className="border-t-2 md:border-t-0 md:border-l-2 border-current pt-4 md:pt-0 md:pl-6 flex flex-col items-start gap-4">
                      <Link href={`/accounts/${account.id}`} className="font-mono text-sm tracking-widest border border-current p-2 hover:bg-[var(--bg-color)] hover:text-[var(--fg-color)] transition-colors group-hover:bg-[var(--bg-color)] group-hover:text-[var(--fg-color)]">
                        [ VIEW DASHBOARD ]
                      </Link>
                      <AccountActions accountId={account.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
