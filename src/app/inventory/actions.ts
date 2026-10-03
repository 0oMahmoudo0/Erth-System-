"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProduct(prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const category = data.get("category") as string;
  const costRaw = data.get("cost");
  const cost = costRaw ? parseFloat(costRaw as string) : null;
  const photoFile = data.get("photo") as File | null;

  if (!name) return { error: "Product name is required" };
  
  let photoUri = null;
  if (photoFile && photoFile.size > 0) {
    if (photoFile.size > 5 * 1024 * 1024) {
      return { error: "Image must be less than 5MB" };
    }
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    photoUri = `data:${photoFile.type};base64,${base64}`;
  }

  try {
    await prisma.product.create({ 
      data: { 
        name,
        category: category || null,
        photo: photoUri,
        cost
      } 
    });
    revalidatePath("/inventory");
    revalidatePath("/orders/new");
    return { success: "Product added successfully!" };
  } catch (error: any) {
    console.error("Create product error:", error);
    if (error.code === 'P2002') return { error: "A product with this name already exists." };
    return { error: error.message || "Failed to connect to the database. Is the Prisma Dev server running?" };
  }
}

export async function addStock(prevState: any, data: FormData) {
  const productId = data.get("productId") as string;
  let locationId = data.get("locationId") as string;
  const size = (data.get("size") as string) || "";
  const quantity = parseInt(data.get("quantity") as string);
  const unitCostRaw = data.get("unitCost");
  const unitCost = unitCostRaw ? parseFloat(unitCostRaw as string) : 0;
  const rawMaterialName = data.get("rawMaterialName") as string;
  const reason = data.get("reason") as string;

  if (!locationId) {
    let defaultLocation = await prisma.location.findFirst({ where: { name: "Main Warehouse" } });
    if (!defaultLocation) {
      defaultLocation = await prisma.location.create({ data: { name: "Main Warehouse" } });
    }
    locationId = defaultLocation.id;
  }

  if (!productId || !quantity || quantity <= 0) {
    return { error: "Product and valid Quantity are required." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      let inventoryItem = await tx.inventoryItem.findFirst({
        where: { productId, locationId, size }
      });

      let previousQuantity = 0;
      if (!inventoryItem) {
        inventoryItem = await tx.inventoryItem.create({
          data: {
            productId,
            locationId,
            size,
            quantity: 0,
            unitCost,
            rawMaterialName
          }
        });
      } else {
        previousQuantity = inventoryItem.quantity;
      }

      const newQuantity = previousQuantity + quantity;
      
      inventoryItem = await tx.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: { 
          quantity: newQuantity,
          unitCost: unitCost > 0 ? unitCost : inventoryItem.unitCost,
          rawMaterialName: rawMaterialName || inventoryItem.rawMaterialName,
        }
      });

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: inventoryItem.id,
          productId,
          size,
          movementType: "ADDITION",
          quantityChange: quantity,
          previousQuantity,
          newQuantity,
          reason: reason || "Manual Restock",
          performedBy: "System"
        }
      });
    });

    revalidatePath("/inventory");
    revalidatePath("/orders/new");
    return { success: "Stock added successfully!" };
  } catch (error: any) {
    console.error("Add stock error:", error);
    return { error: error.message || "Failed to add stock due to database error." };
  }
}
