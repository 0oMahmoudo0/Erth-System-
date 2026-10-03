"use client";

import { useActionState, useState } from "react";
import { loginOrRegister } from "./actions";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [state, formAction, isPending] = useActionState(loginOrRegister, null);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <h1 className="text-[20vw] font-black uppercase tracking-tighter text-white whitespace-nowrap opacity-10 blur-sm">
          KINGDOM
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-black border-2 border-white p-8 md:p-12 z-10 relative shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
      >
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            {isRegister ? "CLAIM YOUR THRONE" : "ENTER KINGDOM"}
          </h2>
          <p className="font-mono text-sm tracking-widest opacity-70">
            {isRegister ? "CREATE AN ACCOUNT TO ACCESS THE SYSTEM" : "AUTHENTICATE TO ACCESS THE SYSTEM"}
          </p>
        </div>

        {state?.error && (
          <div className="bg-white text-black border-2 border-white p-3 font-mono text-sm mb-6 font-bold uppercase text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="isRegister" value={isRegister ? "true" : "false"} />

          {isRegister && (
            <div>
              <label className="block text-xs font-mono tracking-widest mb-2 opacity-70 uppercase">Full Name</label>
              <input 
                name="name" 
                type="text" 
                placeholder="YOUR NAME"
                required={isRegister}
                className="w-full bg-transparent border-2 border-white p-4 font-bold text-lg outline-none focus:bg-white focus:text-black transition-colors placeholder:text-neutral-700" 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono tracking-widest mb-2 opacity-70 uppercase">Username</label>
            <input 
              name="username" 
              type="text" 
              placeholder="USERNAME"
              required 
              className="w-full bg-transparent border-2 border-white p-4 font-bold text-lg outline-none focus:bg-white focus:text-black transition-colors placeholder:text-neutral-700 uppercase" 
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest mb-2 opacity-70 uppercase">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              className="w-full bg-transparent border-2 border-white p-4 font-bold text-lg outline-none focus:bg-white focus:text-black transition-colors placeholder:text-neutral-700 tracking-widest" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-white text-black p-4 font-black uppercase tracking-widest text-lg hover:bg-neutral-300 transition-colors cursor-pointer mt-4"
          >
            {isPending ? "PROCESSING..." : (isRegister ? "SIGN UP" : "LOGIN")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)}
            className="font-mono text-xs tracking-widest hover:underline uppercase opacity-70 hover:opacity-100"
          >
            {isRegister ? "ALREADY HAVE AN ACCOUNT? LOGIN." : "NEED AN ACCOUNT? SIGN UP."}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
