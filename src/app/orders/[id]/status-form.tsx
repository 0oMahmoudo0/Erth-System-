"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";

export function StatusForm({ order, accounts }: { order: any, accounts: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingCode || "");
  const [company, setCompany] = useState(order.shippingCompany || "");
  const [collectionAccountId, setCollectionAccountId] = useState(order.collectionAccountId || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    startTransition(async () => {
      const res = await updateOrderStatus(
        order.id, 
        status, 
        tracking, 
        company, 
        status === 'COLLECTED' ? collectionAccountId : undefined
      );
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[var(--border-color)] bg-[var(--bg-color)] p-6 space-y-6 relative">
      <h3 className="font-black text-2xl tracking-tighter uppercase">UPDATE STATUS</h3>
      
      {error && <div className="text-[var(--bg-color)] bg-[var(--fg-color)] border border-[var(--border-color)] p-2 text-xs font-mono">{error}</div>}
      {success && <div className="text-[var(--bg-color)] bg-[var(--fg-color)] p-2 text-xs font-mono font-bold">STATUS UPDATED!</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">CURRENT STATUS</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)} 
            className="w-full bg-[var(--bg-color)] text-[var(--fg-color)] border-2 border-[var(--border-color)] p-3 font-bold uppercase tracking-widest cursor-pointer"
          >
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PRINTING">PRINTING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="COLLECTED">COLLECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        
        {status === 'COLLECTED' && (
          <div className="space-y-4 pt-4 border-t border-[var(--border-color)] border-dashed">
            <div>
              <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">DEPOSIT INTO ACCOUNT</label>
              <select 
                value={collectionAccountId} 
                onChange={e => setCollectionAccountId(e.target.value)} 
                className="w-full bg-[var(--bg-color)] text-[var(--fg-color)] border-2 border-[var(--border-color)] p-3 font-bold uppercase tracking-widest cursor-pointer"
                required
              >
                <option value="">-- SELECT PAYMENT ACCOUNT --</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(status === 'SHIPPED' || status === 'DELIVERED' || status === 'COLLECTED' || order.trackingCode) && (
          <div className="space-y-4 pt-4 border-t border-[var(--border-color)] border-dashed">
            <div>
              <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">SHIPPING COMPANY</label>
              <input 
                placeholder="E.G. ARAMEX" 
                value={company} 
                onChange={e => setCompany(e.target.value)} 
                className="w-full" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-widest mb-2 opacity-70">TRACKING CODE</label>
              <input 
                placeholder="AWB NUMBER" 
                value={tracking} 
                onChange={e => setTracking(e.target.value)} 
                className="w-full" 
              />
            </div>
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isPending} 
        className="w-full p-4 mt-4 font-black uppercase tracking-widest"
      >
        {isPending ? "UPDATING..." : "CONFIRM UPDATE"}
      </button>
    </form>
  );
}
