import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Search, Edit3, Trash2, CheckCircle, Package } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

const STATUSES = ["Received", "Searching Suppliers", "Verifying Samples", "Quoted", "Completed", "Cancelled"] as const;

export const SourcingTab: React.FC<Props> = ({ isAdmin, data }) => {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const update = useMutation(api.sourcing.update);
  const remove = useMutation(api.sourcing.remove);

  if (!data) return <LoadingState />;
  const filtered = data.filter((c: any) => Object.values(c).some((v: any) => String(v).toLowerCase().includes(search.toLowerCase())));

  const handleEdit = (item: any) => { setEditing(item._id); setEditForm({ status: item.status, notes: item.notes || "", quotationAmount: item.quotationAmount || "", supplierFound: item.supplierFound || "" }); };
  const handleSave = async (id: string) => { try { await update({ id, ...editForm }); setEditing(null); } catch (e) { console.error(e); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sourcing..." className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-brand-teal" /></div>
        <span className="text-[10px] font-mono text-gray-500">{data.length} total</span>
      </div>

      {/* Kanban-style status columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATUSES.filter(s => s !== "Cancelled").map((status) => {
          const items = filtered.filter((r: any) => r.status === status);
          return (
            <div key={status} className="bg-brand-navy border border-brand-teal/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">{status}</h5>
                <span className="text-[9px] font-mono text-gray-500 bg-[#030d1a] px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {items.map((r: any) => (
                  <div key={r._id} className="bg-[#030d1a] border border-brand-teal/5 rounded-lg p-3 space-y-1.5 hover:border-brand-teal/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{r.productType}</span>
                        <span className="text-[9px] text-gray-400">{r.name} · {r.quantity}</span>
                      </div>
                      {editing === r._id ? (
                        <button onClick={() => handleSave(r._id)} className="text-green-400 hover:text-green-300"><CheckCircle className="h-3.5 w-3.5" /></button>
                      ) : (
                        isAdmin && <button onClick={() => handleEdit(r)} className="text-brand-teal hover:text-brand-gold"><Edit3 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                    {editing === r._id ? (
                      <div className="space-y-1">
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-[#020914] border border-brand-teal/10 rounded text-[10px] p-1 text-white">
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Notes..." rows={2} className="w-full bg-[#020914] border border-brand-teal/10 rounded text-[10px] p-1 text-white" />
                        <input type="text" value={editForm.quotationAmount} onChange={(e) => setEditForm({ ...editForm, quotationAmount: e.target.value })} placeholder="Quote amount" className="w-full bg-[#020914] border border-brand-teal/10 rounded text-[10px] p-1 text-white" />
                        <button onClick={() => setEditing(null)} className="text-gray-500 text-[9px]">Cancel</button>
                      </div>
                    ) : (
                      <>
                        {r.notes && <p className="text-[9px] text-gray-500 italic">"{r.notes}"</p>}
                        {r.quotationAmount && <p className="text-[10px] text-brand-teal font-bold">{r.quotationAmount}</p>}
                        <div className="flex items-center justify-between text-[8px] text-gray-500 font-mono pt-1 border-t border-brand-teal/5">
                          <span>{r.targetMarket}</span>
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                    {isAdmin && editing !== r._id && <button onClick={() => { if (confirm("Delete?")) remove({ id: r._id }); }} className="text-red-400/50 hover:text-red-400 text-[9px]"><Trash2 className="h-3 w-3 inline" /> Delete</button>}
                  </div>
                ))}
                {items.length === 0 && <p className="text-[10px] text-gray-600 text-center py-4">No requests</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function LoadingState() { return <div className="flex items-center justify-center h-64"><div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"0ms"}} /><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"150ms"}} /><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"300ms"}} /></div></div>; }
