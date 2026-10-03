"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(productId: string, prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const category = data.get("category") as string;
  const costRaw = data.get("cost");
  const cost = costRaw ? parseFloat(costRaw as string) : null;
  const photoFile = data.get("photo") as File | null;
  const active = data.get("active") === "on";

  if (!name) return { error: "Product name is required" };
  
  let photoUri = undefined;
  if (photoFile && photoFile.size > 0) {
    if (photoFile.size > 10 * 1024 * 1024) {
      return { error: "Image must be less than 10MB" };
    }
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    photoUri = `data:${photoFile.type};base64,${base64}`;
  }

  try {
    await prisma.product.update({ 
      where: { id: productId },
      data: { 
        name,
        category: category || null,
        ...(photoUri !== undefined && { photo: photoUri }),
        cost,
        active
      } 
    });
  } catch (error: any) {
    console.error("Update product error:", error);
    if (error.code === 'P2002') return { error: "A product with this name already exists." };
    return { error: error.message || "Failed to update the product." };
  }

  revalidatePath("/products");
  revalidatePath("/inventory");
  revalidatePath("/orders/new");
  redirect("/products");
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { active: false }
    });
    revalidatePath("/products");
    revalidatePath("/inventory");
    revalidatePath("/orders/new");
    return { success: true };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { error: "Failed to archive product." };
  }
}
