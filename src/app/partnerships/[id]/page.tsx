import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditPlanForm from "./edit-form";
import EditPlanMembersList from "./edit-members-list";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await prisma.partnershipPlan.findUnique({
    where: { id: resolvedParams.id },
    include: {
      members: {
        include: { partner: true }
      }
    }
  });

  if (!plan) {
    notFound();
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/partnerships" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Back to Partnerships
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900">Edit Plan: {plan.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <EditPlanForm plan={plan} />
        
        <div>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            Manage Plan Members
          </h2>
          <EditPlanMembersList members={plan.members} />
        </div>
      </div>
    </main>
  );
}
