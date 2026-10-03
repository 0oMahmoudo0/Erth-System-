"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPartner(prevState: any, data: FormData) {
  const name = data.get("name") as string;
  if (!name) return { error: "Partner name is required" };

  try {
    await prisma.partner.create({ data: { name } });
    revalidatePath("/partnerships");
    return { success: "Partner created successfully!" };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Partner with this name already exists." };
    return { error: "Failed to create partner." };
  }
}

export async function createPartnershipPlan(prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  if (!name) return { error: "Plan name is required" };

  try {
    await prisma.partnershipPlan.create({
      data: { name, description }
    });
    revalidatePath("/partnerships");
    return { success: "Plan created successfully!" };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Plan with this name already exists." };
    return { error: "Failed to create plan." };
  }
}

export async function addPlanMember(prevState: any, data: FormData) {
  const planId = data.get("planId") as string;
  const partnerId = data.get("partnerId") as string;
  const profitPercentage = parseFloat(data.get("profitPercentage") as string);
  const contributionAmount = parseFloat(data.get("contributionAmount") as string);

  if (!planId || !partnerId || isNaN(profitPercentage) || isNaN(contributionAmount)) {
    return { error: "All fields are required and must be valid numbers." };
  }

  try {
    await prisma.planMember.create({
      data: {
        planId,
        partnerId,
        profitPercentage,
        contributionAmount
      }
    });
    revalidatePath("/partnerships");
    return { success: "Partner added to plan successfully!" };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "This partner is already in this plan." };
    return { error: "Failed to add partner to plan." };
  }
}

import { redirect } from "next/navigation";

export async function updatePlan(planId: string, prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const isActive = data.get("isActive") === "on";

  if (!name) return { error: "Plan name is required" };

  try {
    await prisma.partnershipPlan.update({
      where: { id: planId },
      data: { name, description, isActive }
    });
  } catch (error: any) {
    return { error: "Failed to update plan." };
  }

  revalidatePath("/partnerships");
  redirect("/partnerships");
}

export async function deletePlan(planId: string) {
  try {
    // Check if there are orders linked to this plan to prevent breaking history
    const ordersCount = await prisma.order.count({ where: { partnershipPlanId: planId } });
    if (ordersCount > 0) {
      return { error: "Cannot completely delete this plan because it has existing orders tied to it. You must remove the orders first." };
    }

    // 1. Delete all members associated with the plan to satisfy database constraints
    await prisma.planMember.deleteMany({
      where: { planId }
    });

    // 2. Hard delete the plan itself
    await prisma.partnershipPlan.delete({
      where: { id: planId }
    });
    
    revalidatePath("/partnerships");
    return { success: true };
  } catch (error: any) {
    console.error("Delete plan error:", error);
    return { error: "Failed to delete plan." };
  }
}

export async function updatePlanMember(memberId: string, data: { profitPercentage: number, contributionAmount: number }) {
  try {
    await prisma.planMember.update({
      where: { id: memberId },
      data: {
        profitPercentage: data.profitPercentage,
        contributionAmount: data.contributionAmount
      }
    });
    revalidatePath("/partnerships");
    revalidatePath(`/partnerships`);
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update member." };
  }
}

export async function removePlanMember(memberId: string) {
  try {
    await prisma.planMember.delete({
      where: { id: memberId }
    });
    revalidatePath("/partnerships");
    revalidatePath(`/partnerships`);
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to remove member." };
  }
}
