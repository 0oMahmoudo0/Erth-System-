import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreatePartnerForm, CreatePlanForm, AddPlanMemberForm } from "./forms";
import PlanActions from "./plan-actions";

export const dynamic = 'force-dynamic';

export default async function PartnershipsPage() {
  let partners: any[] = [];
  let plans: any[] = [];

  try {
    partners = await prisma.partner.findMany({ 
      orderBy: { name: 'asc' } 
    });
    plans = await prisma.partnershipPlan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: {
          include: { partner: true }
        }
      }
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
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Partnerships</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Management Forms */}
        <div className="space-y-8">
          <CreatePartnerForm />
          <CreatePlanForm />
          <AddPlanMemberForm plans={plans} partners={partners} />
        </div>

        {/* Right Column: Plans and Members Overview */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
              Active Partnership Plans
            </h2>
            
            {plans.length === 0 ? (
              <div className="text-neutral-500 py-12 text-center border border-dashed border-neutral-300 rounded">
                No partnership plans found. Create one to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-neutral-900">{plan.name}</h3>
                        {plan.description && <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded border font-medium ${plan.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <PlanActions planId={plan.id} />
                      </div>
                    </div>
                    
                    <div className="p-0">
                      <table className="w-full text-left text-sm text-neutral-600">
                        <thead className="bg-white text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                          <tr>
                            <th className="px-6 py-3 font-medium">Partner</th>
                            <th className="px-6 py-3 font-medium">Profit Share</th>
                            <th className="px-6 py-3 font-medium text-right">Contribution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {plan.members.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-6 py-6 text-center text-neutral-400">
                                No partners assigned to this plan yet.
                              </td>
                            </tr>
                          ) : (
                            plan.members.map((member: any) => (
                              <tr key={member.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-neutral-900">{member.partner.name}</td>
                                <td className="px-6 py-3">{member.profitPercentage}%</td>
                                <td className="px-6 py-3 text-right">{member.contributionAmount.toLocaleString()} EGP</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
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
