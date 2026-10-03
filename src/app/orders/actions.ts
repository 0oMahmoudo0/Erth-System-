"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  if (!data.customer.name || !data.customer.governorate || !data.customer.primaryPhone) {
    return { error: "Customer details (name, governorate, phone) are required." };
  }
  if (!data.order.productId || !data.order.quantity) {
    return { error: "Product and quantity are required." };
  }
  if (data.order.quantity <= 0) {
    return { error: "Quantity must be greater than zero." };
  }
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Auto-resolve or create inventory
      let inventory = await tx.inventoryItem.findFirst({
        where: { 
          productId: data.order.productId,
          size: data.order.size || "",
        },
      });

      // If no inventory exists for this product, auto-create one so we never block orders
      if (!inventory) {
        let defaultLocation = await tx.location.findFirst();
        if (!defaultLocation) {
          defaultLocation = await tx.location.create({ data: { name: "Main Warehouse" } });
        }
        inventory = await tx.inventoryItem.create({
          data: {
            productId: data.order.productId,
            size: data.order.size || "",
            locationId: defaultLocation.id,
            quantity: 0,
            unitCost: 0,
          }
        });
      }

      // 2. Retrieve inventory-dependent values
      const rawMaterialCost = inventory.unitCost;
      const remainingAmount = data.payment.codAmount - data.payment.depositAmount;
      const totalAdditionalExpenses = 
        data.expenses.printingCost +
        data.shipping.cost +
        data.expenses.transportationCost +
        data.expenses.deliveryCost +
        data.expenses.advertisingShare;

      // 3. Upsert Customer
      let customer = await tx.customer.findUnique({
        where: { phone: data.customer.primaryPhone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: data.customer.name,
            governorate: data.customer.governorate,
            address: data.customer.address,
            phone: data.customer.primaryPhone,
            phone2: data.customer.secondaryPhone || null,
            dateOfBirth: data.customer.dateOfBirth || null,
          }
        });
      } else {
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: data.customer.name,
            governorate: data.customer.governorate,
            address: data.customer.address,
            phone2: data.customer.secondaryPhone || customer.phone2,
          }
        });
      }

      // 4. Generate Order Number
      const dateString = new Date().toISOString().slice(0,10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${dateString}-${randomSuffix}`;

      // 5. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          shipGovernorate: data.customer.governorate,
          shipAddress: data.customer.address,
          productId: inventory.productId,
          size: data.order.size,
          quantity: data.order.quantity,
          inventoryItemId: inventory.id,
          rawMaterialUnitCost: rawMaterialCost,
          codAmount: data.payment.codAmount,
          printingCost: data.expenses.printingCost,
          shippingMode: data.shipping.mode,
          shippingCost: data.shipping.cost,
          transportationCost: data.expenses.transportationCost,
          deliveryCost: data.expenses.deliveryCost,
          advertisingShare: data.expenses.advertisingShare,
          callCenterEmployeeId: data.callCenter.employeeId || null,
          totalAdditionalExpenses,
          remainingAmount,
          status: "CONFIRMED",
          stockState: "DEDUCTED",
          createdBy: "System",
        }
      });

      // 6. Deduct inventory
      const updatedInventory = await tx.inventoryItem.update({
        where: { id: inventory.id },
        data: {
          quantity: {
            decrement: data.order.quantity,
          }
        }
      });

      // 7. Record inventory movement
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: inventory.id,
          productId: inventory.productId,
          size: data.order.size,
          movementType: "ORDER_DEDUCTION",
          quantityChange: -data.order.quantity,
          previousQuantity: inventory.quantity,
          newQuantity: updatedInventory.quantity,
          reason: "Order Placed",
          orderId: order.id,
          performedBy: "System",
        }
      });

      return order;
    });

    revalidatePath("/orders");
    return { success: true, order: result };

  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { error: error.message || "Failed to create order." };
  }
}
