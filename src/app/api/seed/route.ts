import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Create a Call Center Employee
    const employee = await prisma.callCenterEmployee.upsert({
      where: { id: "emp-1" },
      update: {},
      create: {
        id: "emp-1",
        name: "Sarah (5% Commission)",
        commissionPercent: 5.0,
      }
    });

    // 2. Create Location
    const location = await prisma.location.upsert({
      where: { name: "Main Warehouse" },
      update: {},
      create: {
        name: "Main Warehouse",
      }
    });

    // 3. Create Product
    const product = await prisma.product.upsert({
      where: { name: "Premium T-Shirt" },
      update: {},
      create: {
        name: "Premium T-Shirt",
      }
    });

    // 4. Create Inventory Item
    const inventory = await prisma.inventoryItem.upsert({
      where: { 
        productId_size_locationId: {
          productId: product.id,
          size: "L",
          locationId: location.id,
        }
      },
      update: {},
      create: {
        productId: product.id,
        size: "L",
        locationId: location.id,
        quantity: 100,
        unitCost: 150.0,
        rawMaterialName: "Cotton",
      }
    });

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
