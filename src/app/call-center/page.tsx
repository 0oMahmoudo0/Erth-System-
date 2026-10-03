import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreateEmployeeForm, DeleteButton } from "./forms";

export const dynamic = 'force-dynamic';

export default async function CallCenterPage() {
  const employees = await prisma.callCenterEmployee.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-12 md:py-24">
      <div className="mb-16">
        <Link href="/" className="font-mono text-sm tracking-widest hover:bg-white hover:text-black p-2 border border-transparent hover:border-white transition-colors uppercase">
          [ &larr; BACK TO SYSTEM ]
        </Link>
        <h1 className="text-6xl md:text-8xl font-black mt-8 tracking-tighter uppercase leading-[0.9]">
          CALL<br/>CENTER
        </h1>
        <p className="font-mono mt-6 opacity-70 tracking-widest uppercase">
          MANAGE AGENTS & COMMISSIONS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <CreateEmployeeForm />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black border-b-2 border-white pb-4 tracking-tighter uppercase">
            ACTIVE AGENTS
          </h2>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-mono tracking-widest text-xs opacity-70">AGENT NAME</th>
                  <th className="text-right font-mono tracking-widest text-xs opacity-70">COMMISSION %</th>
                  <th className="text-center font-mono tracking-widest text-xs opacity-70">STATUS</th>
                  <th className="text-right font-mono tracking-widest text-xs opacity-70">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-800">
                {employees.map(emp => (
                  <tr key={emp.id} className="group">
                    <td className="font-bold text-xl uppercase tracking-tighter p-4">{emp.name}</td>
                    <td className="text-right font-mono text-lg p-4">{emp.commissionPercent}%</td>
                    <td className="text-center p-4">
                      <span className="px-3 py-1 border border-white text-xs font-mono tracking-widest">
                        {emp.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="text-right p-4">
                      <DeleteButton id={emp.id} />
                    </td>
                  </tr>
                ))}
                
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-20 opacity-50 font-mono tracking-widest uppercase border-2 border-white border-dashed">
                      NO AGENTS FOUND.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
