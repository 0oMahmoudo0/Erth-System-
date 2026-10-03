"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Read the auth_user cookie from the browser
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('auth_user='));
    if (authCookie) {
      setUserName(decodeURIComponent(authCookie.split('=')[1]));
    }
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const titleVariants: any = {
    hidden: { y: "100%" },
    show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-color)] text-[var(--fg-color)] font-sans uppercase overflow-x-hidden">
      
      {/* INFINITE MARQUEE TICKER (Top) */}
      <div className="w-full bg-white text-black py-3 overflow-hidden flex whitespace-nowrap border-b-4 border-black relative z-20">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          className="flex gap-10 font-black text-sm md:text-base tracking-widest"
        >
          {Array(20).fill("ERTH SYSTEM // NEXT-GEN INVENTORY //").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full border-b-4 border-white flex flex-col justify-between">
        
        {/* The Pictures - Main center and slanted sides */}
        <div className="absolute inset-0 z-0 flex items-center justify-center p-4 overflow-hidden">
          
          {/* Left Corner Slanted Image */}
          <motion.div 
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            animate={{ opacity: 0.5, x: 0, rotate: -15 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="absolute -left-12 md:left-4 top-4 md:top-12 w-[45%] md:w-[30%] h-[60%] md:h-[70%] bg-cover bg-center bg-no-repeat filter grayscale opacity-50 border border-white/10"
            style={{ backgroundImage: "url('/hero-bg-2.jpeg')" }}
          />

          {/* Right Corner Slanted Image */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            animate={{ opacity: 0.5, x: 0, rotate: 15 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            className="absolute -right-12 md:right-4 bottom-12 md:bottom-12 w-[45%] md:w-[30%] h-[60%] md:h-[70%] bg-cover bg-center bg-no-repeat filter grayscale opacity-50 border border-white/10"
            style={{ backgroundImage: "url('/hero-bg-2.jpeg')" }}
          />

          {/* Center Main Picture */}
          <motion.div 
            initial={{ scale: 1.05, filter: "grayscale(100%)" }}
            animate={{ scale: 1, filter: "grayscale(100%)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ filter: "grayscale(0%)", scale: 1.02, transition: { duration: 0.5 } }}
            className="w-full md:w-[45%] h-full bg-contain bg-center bg-no-repeat cursor-crosshair opacity-90 relative z-10"
            style={{ backgroundImage: "url('/hero-bg.jpeg')" }}
          />
        </div>
        
        {/* Top Fade overlay */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black to-transparent z-0" />
        {/* Bottom Fade overlay */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

        <div className="relative z-10 w-full p-6 md:p-12 flex flex-col h-full justify-end">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 w-full">
            <div className="overflow-hidden">
              <motion.h1 
                variants={titleVariants}
                initial="hidden"
                animate="show"
                className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[14rem] font-black leading-[0.8] tracking-tighter"
              >
                ERTH
              </motion.h1>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-left md:text-right pb-2 md:pb-6 flex flex-col items-start md:items-end"
            >
              {userName && (
                <div className="bg-[var(--fg-color)] text-[var(--bg-color)] px-4 py-2 mb-4 inline-block font-black tracking-widest text-sm md:text-lg border-2 border-[var(--border-color)]">
                  WELCOME, {userName}
                </div>
              )}
              <p className="text-2xl md:text-4xl font-bold tracking-widest">SYSTEM // 01</p>
              <p className="text-sm md:text-base font-mono opacity-60 mt-2">PRODUCTION & INVENTORY</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BRUTALIST LIST (Stacked one under another) */}
      <section className="max-w-[1600px] mx-auto p-4 md:p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 md:gap-6"
        >
          
          {/* Row 1: Sales */}
          <motion.div variants={itemVariants}>
            <Link href="/orders/new" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 01 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">NEW ORDER</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">PROCESS CHECKOUTS & DISPATCH</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 2: Logistics */}
          <motion.div variants={itemVariants}>
            <Link href="/orders" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 02 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">DIRECTORY</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">TRACK SHIPMENTS & STATUS</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 3: Warehouse */}
          <motion.div variants={itemVariants}>
            <Link href="/inventory" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 03 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">INVENTORY</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">STOCK & RAW MATERIALS</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 4: Catalog */}
          <motion.div variants={itemVariants}>
            <Link href="/products" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 04 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">PRODUCTS</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">CATALOG & VARIATIONS</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 5: Network */}
          <motion.div variants={itemVariants}>
            <Link href="/partnerships" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 05 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">NETWORK</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">PARTNERSHIPS & SHARES</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 6: Finance */}
          <motion.div variants={itemVariants}>
            <Link href="/accounts" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 06 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">ACCOUNTS</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">CASHFLOW & BALANCES</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 7: Call Center */}
          <motion.div variants={itemVariants}>
            <Link href="/call-center" className="group flex flex-col md:flex-row justify-between md:items-center bg-black border-2 border-white p-6 md:p-12 transition-colors duration-300 hover:bg-white hover:text-black relative overflow-hidden">
              <div className="flex flex-col relative z-10">
                <span className="text-sm font-mono tracking-widest mb-4 opacity-70">[ 07 ]</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight transform group-hover:translate-x-4 transition-transform duration-300">CALL CENTER</h2>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 md:text-right flex flex-col md:items-end">
                <motion.svg whileHover={{ rotate: 45 }} className="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 7l-10 10M17 7H7M17 7v10"></path></motion.svg>
                <p className="text-sm md:text-base font-mono opacity-60 group-hover:opacity-100 transform group-hover:-translate-x-4 transition-transform duration-300 delay-75">AGENTS & COMMISSIONS</p>
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </section>
    </main>
  );
}
