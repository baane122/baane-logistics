import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Search, Plus, Edit3, Trash2, Ship, Plane, Loader } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

export const ContainersTab: React.FC<Props> = ({ user, isAdmin, data }) => {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showCreate, setShowCreate] = useState(false);
  const [newContainer, setNewContainer] = useState({
    trackingId: "", type: "Sea Cargo" as const, carrier: "", vessel: "",
    origin: "", destination: "", status: "Pending", progress: 0,
    shipper: "", consignee: "", cargoDetails: "", weight: "",
    currentLocation: "", departureDate: "", arrivalDate: "",
    metrics: { temperature: "21.0°C", humidity: "45%", status: "Nominal" },
    route: [],
  });

  const updateContainer = useMutation(api.containers.update);
  const createContainer = useMutation(api.containers.create);
  const removeContainer = useMutation(api.containers.remove);

  if (!data) return <LoadingState />;

  const filtered = data.filter((c: any) =>
    Object.values(c).some((v: any) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (item: any) => {
    setEditing(item._id);
    setEditForm({ status: item.status, progress: item.progress, currentLocation: item.currentLocation });
  };

  const handleSave = async (id: string) => {
    try { await updateContainer({ id, ...editForm }); setEditing(null); } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    try {
      await createContainer(newContainer as any);
      setShowCreate(false);
      setNewContainer({ trackingId: "", type: "Sea Cargo", carrier: "", vessel: "", origin: "", destination: "", status: "Pending", progress: 0, shipper: "", consignee: "", cargoDetails: "", weight: "", currentLocation: "", departureDate: "", arrivalDate: "", metrics: { temperature: "21.0°C", humidity: "45%", status: "Nominal" }, route: [] });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search containers..." className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-brand-teal" />
        </div>
        <span className="text-[10px] font-mono text-gray-500 bg-brand-navy px-2 py-1 rounded-full">{data.length} total</span>
        {isAdmin && <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1.5 bg-brand-teal text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0] transition-all"><Plus className="h-3.5 w-3.5" />New Container</button>}
      </div>

      {showCreate && (
        <div className="bg-brand-navy border border-brand-teal/20 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4">New Container</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(newContainer).filter(([k]) => k !== "metrics" && k !== "route").map(([key, val]) => (
              <div key={key}>
                <label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input type="text" value={val as string} onChange={(e) => setNewContainer({ ...newContainer, [key]: e.target.value })}
                  className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-teal" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="bg-brand-teal text-brand-navy px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0]">Create</button>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 px-4 py-1.5 rounded-lg text-xs border border-gray-700 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-brand-navy border border-brand-teal/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-brand-teal/10 text-gray-400 text-[9px] uppercase tracking-wider font-mono">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Origin</th>
                <th className="text-left p-3">Destination</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Progress</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item._id} className="border-b border-brand-teal/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-brand-teal font-mono font-bold">{item.trackingId}</td>
                  <td className="p-3 text-white">{item.type === "Sea Cargo" ? <Ship className="h-3.5 w-3.5 inline text-blue-400 mr-1" /> : <Plane className="h-3.5 w-3.5 inline text-brand-gold mr-1" />}{item.type}</td>
                  <td className="p-3 text-gray-300 text-[10px]">{item.origin}</td>
                  <td className="p-3 text-gray-300 text-[10px]">{item.destination}</td>
                  <td className="p-3">
                    {editing === item._id ? (
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="bg-[#030d1a] border border-brand-teal/20 rounded px-1.5 py-0.5 text-[10px] text-white">
                        <option>Pending</option><option>In Transit</option><option>Origin Customs</option><option>Delivered</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.status === "Delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        item.status === "In Transit" ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" :
                        "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                      }`}>{item.status}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {editing === item._id ? (
                      <input type="number" value={editForm.progress} onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) || 0 })}
                        className="w-16 bg-[#030d1a] border border-brand-teal/20 rounded px-1.5 py-0.5 text-[10px] text-white" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-teal rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">{item.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-gray-300 text-[10px] max-w-[120px] truncate">{item.currentLocation}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {isAdmin && (editing === item._id ? (
                        <button onClick={() => handleSave(item._id)} className="text-green-400 hover:text-green-300 p-1"><Loader className="h-3.5 w-3.5" /></button>
                      ) : (
                        <button onClick={() => handleEdit(item)} className="text-brand-teal hover:text-brand-gold p-1"><Edit3 className="h-3.5 w-3.5" /></button>
                      ))}
                      {isAdmin && editing === item._id && (
                        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white p-1">✕</button>
                      )}
                      {isAdmin && <button onClick={() => { if (confirm("Delete?")) removeContainer({ id: item._id }); }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="h-3.5 w-3.5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-500">No containers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function LoadingState() {
  return <div className="flex items-center justify-center h-64">
    <div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"0ms"}} /><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"150ms"}} /><span className="h-2 w-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay:"300ms"}} /></div>
  </div>;
}
