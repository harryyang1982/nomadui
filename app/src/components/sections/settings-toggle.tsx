"use client";

import { useState } from "react";

export function SettingsToggle() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [temp, setTemp] = useState<"C" | "F">("C");
  const [costBasis, setCostBasis] = useState<"nomad" | "local">("nomad");

  return (
    <div className="fixed bottom-16 left-4 z-50">
      {open && (
        <div className="mb-2 rounded-lg border bg-white p-3 shadow-lg">
          <div className="flex items-center gap-3 text-xs">
            {/* Currency */}
            <button
              onClick={() => setCurrency(currency === "KRW" ? "USD" : "KRW")}
              className="rounded-md border px-2 py-1 hover:bg-gray-50"
            >
              {currency === "KRW" ? "₩ KRW" : "$ USD"}
            </button>
            <span className="text-gray-300">│</span>
            {/* Temperature */}
            <button
              onClick={() => setTemp(temp === "C" ? "F" : "C")}
              className="rounded-md border px-2 py-1 hover:bg-gray-50"
            >
              °{temp}
            </button>
            <span className="text-gray-300">│</span>
            {/* Cost Basis */}
            <button
              onClick={() =>
                setCostBasis(costBasis === "nomad" ? "local" : "nomad")
              }
              className="rounded-md border px-2 py-1 hover:bg-gray-50"
            >
              {costBasis === "nomad" ? "노마드" : "현지인"} 생활비
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-gray-50"
        aria-label="설정"
      >
        ⚙️
      </button>
    </div>
  );
}
