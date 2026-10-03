"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearSplashCookie } from "@/app/login/actions";

export function SplashScreen({ userName }: { userName: string | undefined }) {
  const [show, setShow] = useState(!!userName);

  useEffect(() => {
    if (userName) {
      const timer = setTimeout(() => {
        setShow(false);
        // Fire server action to remove cookie so it doesn't show again on refresh
        clearSplashCookie();
      }, 4000); // 4 seconds total
      return () => clearTimeout(timer);
    }
  }, [userName]);

  return (
    <AnimatePresence>
      {show && userName && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white pointer-events-none"
        >
          {/* Background noise/style */}
          <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center overflow-hidden">
            <h1 className="text-[30vw] font-black uppercase tracking-tighter text-white whitespace-nowrap blur-md">
              KINGDOM
            </h1>
          </div>
          
          <div className="z-10 text-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-mono text-sm md:text-xl tracking-[0.5em] uppercase mb-4 opacity-70"
            >
              ACCESS GRANTED
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "backOut" }}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
            >
              WELCOME <br/>
              <span className="text-transparent bg-clip-text bg-white" style={{ WebkitTextStroke: "2px white" }}>
                {userName}
              </span>
              <br/>
              TO YOUR KINGDOM
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
