import React from "react";
import { motion } from "motion/react";
import { Ship, Package, ClipboardCheck, DollarSign, Users, TrendingUp, ArrowUpRight, AlertTriangle } from "lucide-react";

export const OverviewTab: React.FC<{
  user: any; isAdmin: boolean;
  containerStats?: any; sourcingStats?: any; inspectionStats?: any; quoteStats?: any;
  containers?: any[]; sourcingRequests?: any[]; inspectionRequests?: any[]; cargoQuotes?: any[];
  users?: any[]; auditLogs?: any[]; settings?: any[]; aiModels?: any[]; prompts?: any[];
  apiKeys?: any[]; emailTemplates?: any[];
}> = ({ containerStats, sourcingStats, inspectionStats, quoteStats, containers, sourcingRequests, auditLogs, aiModels, users }) => {

  const statCards = [
    { label: "Containers", value: containerStats?.total || 0, icon: <Ship className="h-5 w-5" />, color: "text-brand-teal bg-brand-teal/10", sub: `${containerStats?.inTransit || 0} in transit`, change: "+12%" },
    { label: "Sourcing", value: sourcingStats?.total || 0, icon: <Package className="h-5 w-5" />, color: "text-brand-gold bg-brand-gold/10", sub: `${sourcingStats?.searching || 0} active`, change: "+8%" },
    { label: "Inspections", value: inspectionStats?.total || 0, icon: <ClipboardCheck className="h-5 w-5" />, color: "text-blue-400 bg-blue-400/10", sub: `${inspectionStats?.completed || 0} completed`, change: "+15%" },
    { label: "Quotes", value: quoteStats?.total || 0, icon: <DollarSign className="h-5 w-5" />, color: "text-green-400 bg-green-400/10", sub: `${quoteStats?.approved || 0} approved`, change: "+5%" },
    { label: "Users", value: users?.length || 0, icon: <Users className="h-5 w-5" />, color: "text-purple-400 bg-purple-400/10", sub: "active accounts", change: "—" },
    { label: "AI Models", value: aiModels?.filter((m: any) => m.isActive).length || 0, icon: <TrendingUp className="h-5 w-5" />, color: "text-cyan-400 bg-cyan-400/10", sub: `${aiModels?.length || 0} configured`, change: "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-brand-navy border border-brand-teal/10 rounded-xl p-4 hover:border-brand-teal/30 transition-all">
            <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>{card.icon}</div>
            <div className="text-2xl font-bold text-white font-display">{card.value}</div>
            <div className="text-[10px] text-gray-400 font-mono mt-1">{card.label}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-gray-500">{card.sub}</span>
              {card.change !== "—" && <span className="text-[9px] text-green-400 flex items-center"><ArrowUpRight className="h-2.5 w-2.5" />{card.change}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-navy border border-brand-teal/10 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4 flex items-center gap-2">
            <Ship className="h-4 w-4 text-brand-teal" /> Recent Containers
          </h4>
          <div className="space-y-2">
            {containers?.slice(0, 5).map((c: any) => (
              <div key={c._id} className="flex items-center justify-between bg-[#030d1a] p-3 rounded-lg hover:bg-[#030d1a]/80 transition-colors">
                <div>
                  <span className="text-xs font-bold text-white">{c.trackingId}</span>
                  <p className="text-[10px] text-gray-400">{c.origin} → {c.destination}</p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  c.status === "Delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  c.status === "In Transit" ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" :
                  c.status === "Origin Customs" ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" :
                  "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}>{c.status}</span>
              </div>
            ))}
            {(!containers || containers.length === 0) && <p className="text-xs text-gray-500 text-center py-4">No containers yet</p>}
          </div>
        </div>
        <div className="bg-brand-navy border border-brand-teal/10 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-brand-gold" /> Recent Activity
          </h4>
          <div className="space-y-2">
            {auditLogs?.slice(0, 8).map((log: any) => (
              <div key={log._id} className="flex items-center gap-3 bg-[#030d1a] p-2.5 rounded-lg">
                <span className={`text-[18px] ${log.action.includes("create") ? "text-green-400" : log.action.includes("delete") ? "text-red-400" : "text-brand-teal"}`}>•</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-white block truncate">{log.action}</span>
                  <span className="text-[9px] text-gray-500 font-mono">{log.entityType} · {new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {(!auditLogs || auditLogs.length === 0) && <p className="text-xs text-gray-500 text-center py-4">No activity yet</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-navy border border-brand-teal/10 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-brand-gold" /> Recent Sourcing Requests
          </h4>
          <div className="space-y-2">
            {sourcingRequests?.slice(0, 5).map((r: any) => (
              <div key={r._id} className="flex items-center justify-between bg-[#030d1a] p-3 rounded-lg">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{r.productType}</span>
                  <span className="text-[10px] text-gray-400">{r.name} · {r.quantity}</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                  r.status === "Completed" ? "bg-green-500/10 text-green-400" :
                  r.status === "Quoted" ? "bg-brand-teal/10 text-brand-teal" :
                  "bg-brand-gold/10 text-brand-gold"
                }`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-brand-navy border border-brand-teal/10 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" /> Recent Quotes
          </h4>
          <div className="space-y-2">
            {sourcingRequests?.slice(0, 5).map((q: any) => (
              <div key={q._id} className="flex items-center justify-between bg-[#030d1a] p-3 rounded-lg">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{q.name}</span>
                  <span className="text-[10px] text-gray-400">{q.serviceType || "N/A"} · {q.weight}kg</span>
                </div>
                <span className="text-[10px] font-mono text-brand-teal">{q.estimatedCost || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
