import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { SplashScreen } from "@/components/splash-screen";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erth System",
  description: "Production Management Interface",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const splashUser = cookieStore.get("show_splash")?.value;
  const authUser = cookieStore.get("auth_user")?.value;

  return (
    <html lang="en" className="bg-[var(--bg-color)] text-[var(--fg-color)]" data-theme="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeSwitcher />
        {authUser && <LogoutButton />}
        <SplashScreen userName={splashUser} />
        {children}
      </body>
    </html>
  );
}
