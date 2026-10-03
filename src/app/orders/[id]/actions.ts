"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string, trackingCode?: string, shippingCompany?: string, collectionAccountId?: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        ...(trackingCode !== undefined ? { trackingCode } : {}),
        ...(shippingCompany !== undefined ? { shippingCompany } : {}),
        ...(collectionAccountId !== undefined ? { collectionAccountId } : {})
      }
    });
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/orders`);
    return { success: true };
  } catch (error) {
    return { error: "FAILED TO UPDATE ORDER STATUS." };
  }
}
