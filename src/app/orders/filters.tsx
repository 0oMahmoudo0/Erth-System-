"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function OrderListFilters({
  currentStatus,
  currentQuery
}: {
  currentStatus: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleStatusChange = (status: string) => {
    router.push(pathname + "?" + createQueryString("status", status));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(pathname + "?" + createQueryString("q", searchTerm));
  };

  const tabs = [
    { id: "current", label: "Current Orders" },
    { id: "pre-orders", label: "Pre-Orders" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex max-w-md">
        <input
          type="text"
          placeholder="Search by Order #, Customer, Phone..."
          className="flex-1 border border-neutral-300 rounded-l px-4 py-2 text-sm focus:outline-none focus:border-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-neutral-100 border border-l-0 border-neutral-300 rounded-r px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Lifecycle Stage Tabs */}
      <div className="flex flex-wrap border-b border-neutral-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleStatusChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              currentStatus === tab.id
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
