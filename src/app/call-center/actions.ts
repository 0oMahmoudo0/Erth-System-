"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createEmployee(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const commissionPercent = parseFloat(formData.get('commissionPercent') as string) || 0;

  if (!name) return { error: "AGENT NAME IS REQUIRED" };

  try {
    await prisma.callCenterEmployee.create({
      data: { name, commissionPercent }
    });
    revalidatePath("/call-center");
    return { success: true };
  } catch (error) {
    return { error: "FAILED TO CREATE AGENT" };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const employee = await prisma.callCenterEmployee.findUnique({ 
      where: { id }, 
      include: { _count: { select: { orders: true } } } 
    });
    
    if (!employee) return { error: "AGENT NOT FOUND" };

    if (employee._count.orders > 0) {
      // Soft delete because they have linked orders
      await prisma.callCenterEmployee.update({
        where: { id },
        data: { active: false }
      });
    } else {
      // Hard delete
      await prisma.callCenterEmployee.delete({ where: { id } });
    }
    
    revalidatePath("/call-center");
    return { success: true };
  } catch (error) {
    return { error: "FAILED TO DELETE AGENT" };
  }
}
