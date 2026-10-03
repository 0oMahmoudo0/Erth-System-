"use server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginOrRegister(prevState: any, formData: FormData) {
  const isRegister = formData.get("isRegister") === "true";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  if (isRegister) {
    if (!name) return { error: "Name is required for registration." };
    try {
      const user = await prisma.user.create({
        data: { name, username, password } // Plain text password for demonstration in this internal app
      });
      (await cookies()).set("auth_user", user.name, { path: "/" });
      (await cookies()).set("show_splash", user.name, { path: "/" });
    } catch (e: any) {
      if (e.code === 'P2002') return { error: "Username already taken." };
      console.error(e);
      return { error: `Registration failed: ${e.message || String(e)}` };
    }
  } else {
    // Login
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      return { error: "Invalid username or password." };
    }
    (await cookies()).set("auth_user", user.name, { path: "/" });
    (await cookies()).set("show_splash", user.name, { path: "/" });
  }

  redirect("/");
}

export async function clearSplashCookie() {
  (await cookies()).delete("show_splash");
}

export async function logout() {
  (await cookies()).delete("auth_user");
  (await cookies()).delete("show_splash");
  redirect("/login");
}
