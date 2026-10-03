"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAccount(prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const code = (data.get("code") as string) || name.toUpperCase().replace(/\s+/g, '_');
  
  if (!name) return { error: "Account name is required" };

  try {
    await prisma.paymentAccount.create({ 
      data: { name, code } 
    });
    revalidatePath("/accounts");
    return { success: "Account created successfully!" };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "An account with this code already exists." };
    return { error: "Failed to create account." };
  }
}

export async function updateAccount(accountId: string, prevState: any, data: FormData) {
  const name = data.get("name") as string;
  const code = data.get("code") as string;
  const active = data.get("active") === "on";

  if (!name || !code) return { error: "Account name and code are required" };

  try {
    await prisma.paymentAccount.update({
      where: { id: accountId },
      data: { name, code, active }
    });
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "An account with this code already exists." };
    return { error: "Failed to update account." };
  }

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function deleteAccount(accountId: string) {
  try {
    const orderCount = await prisma.order.count({ where: { collectionAccountId: accountId } });
    const depositCount = await prisma.orderDeposit.count({ where: { paymentAccountId: accountId } });
    
    if (orderCount > 0 || depositCount > 0) {
      return { error: "Cannot delete this account because it has recorded financial transactions. Archive it instead." };
    }

    await prisma.paymentAccount.delete({
      where: { id: accountId }
    });
    
    revalidatePath("/accounts");
    return { success: true };
  } catch (error: any) {
    console.error("Delete account error:", error);
    return { error: "Failed to delete account." };
  }
}

export async function adjustBalance(accountId: string, amount: number, operation: 'add' | 'subtract') {
  try {
    const account = await prisma.paymentAccount.findUnique({ where: { id: accountId } });
    if (!account) return { error: "Account not found" };

    const newBalance = operation === 'add' 
      ? account.manualBalance + amount 
      : account.manualBalance - amount;

    await prisma.paymentAccount.update({
      where: { id: accountId },
      data: { manualBalance: newBalance }
    });

    revalidatePath("/accounts");
    revalidatePath(`/accounts/${accountId}`);
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to adjust balance." };
  }
}

export async function resetAllManualBalances() {
  try {
    await prisma.paymentAccount.updateMany({
      data: { manualBalance: 0 }
    });
    revalidatePath("/accounts");
    return { success: true };
  } catch (e) {
    return { error: "Failed to reset balances." };
  }
}
