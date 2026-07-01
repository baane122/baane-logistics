import React, { useState } from "react";
import { Search } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

export const AuditTab: React.FC<Props> = ({ isAdmin, data }) => {
  const [search, setSearch] = useState("");
  if (!data) return <div className="text-gray-500 text-xs p-8 text-center">Loading...</div>;
  const filtered = data.filter((c: any) => Object.values(c).some((v: any) => String(v).toLowerCase().includes(search.toLowerCase())));

  const columns = data.length > 0 ? Object.keys(data[0]).filter(k => !k.startsWith("_") && k !== "passwordHash" && k !== "key" && k !== "apiKey" && k !== "password") : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-brand-teal" /></div>
        <span className="text-[10px] font-mono text-gray-500">{data.length} records</span>
      </div>
      <div className="bg-brand-navy border border-brand-teal/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-brand-teal/10 text-gray-400 text-[9px] uppercase tracking-wider font-mono">
              {columns.slice(0, 8).map((col) => (<th key={col} className="text-left p-3 font-medium">{col.replace(/([A-Z])/g, ' $1').trim()}</th>))}
            </tr></thead>
            <tbody>
              {filtered.slice(0, 100).map((item: any) => (
                <tr key={item._id} className="border-b border-brand-teal/5 hover:bg-white/5 transition-colors">
                  {columns.slice(0, 8).map((col) => {
                    let val = item[col];
                    if (typeof val === "object") val = JSON.stringify(val).slice(0, 50) + (JSON.stringify(val).length > 50 ? "..." : "");
                    if (col === "createdAt" || col === "updatedAt" || col === "timestamp" || col === "lastLogin") { try { val = new Date(val).toLocaleString(); } catch {} }
                    if (col === "passwordHash" || col === "key" || col === "apiKey" || col === "password") val = "••••••••";
                    if (col === "body" || col === "prompt") val = String(val).slice(0, 60) + "...";
                    return (<td key={col} className="p-3 text-white truncate max-w-[150px] text-[10px]">{String(val || "—")}</td>);
                  })}
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-500 text-xs">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
