import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus, Edit3, Trash2, Power, Check, X, Cpu } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

export const AiModelsTab: React.FC<Props> = ({ isAdmin, data }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", provider: "google" as const, modelId: "", apiKey: "", baseUrl: "", isActive: true, capabilities: [""], maxTokens: 2048, temperature: 0.7 });

  const createModel = useMutation(api.aiModels.create);
  const updateModel = useMutation(api.aiModels.update);
  const removeModel = useMutation(api.aiModels.remove);
  const toggleActive = useMutation(api.aiModels.toggleActive);

  if (!data) return <div className="text-gray-500 text-xs p-8">Loading...</div>;

  const providers: { value: string; label: string; color: string }[] = [
    { value: "google", label: "Google Gemini", color: "text-blue-400" },
    { value: "openai", label: "OpenAI", color: "text-green-400" },
    { value: "anthropic", label: "Anthropic", color: "text-purple-400" },
    { value: "custom", label: "Custom", color: "text-gray-400" },
  ];

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateModel({ id: editId, ...form, capabilities: form.capabilities.filter(Boolean) });
      } else {
        await createModel({ ...form, capabilities: form.capabilities.filter(Boolean), createdBy: undefined });
      }
      setShowForm(false); setEditId(null);
      setForm({ name: "", provider: "google", modelId: "", apiKey: "", baseUrl: "", isActive: true, capabilities: [""], maxTokens: 2048, temperature: 0.7 });
    } catch (e) { console.error(e); }
  };

  const startEdit = (item: any) => {
    setEditId(item._id);
    setForm({ name: item.name, provider: item.provider, modelId: item.modelId, apiKey: item.apiKey, baseUrl: item.baseUrl || "", isActive: item.isActive, capabilities: item.capabilities.length ? item.capabilities : [""], maxTokens: item.maxTokens || 2048, temperature: item.temperature || 0.7 });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-500">{data.filter((m: any) => m.isActive).length} active · {data.length} total</span>
        {isAdmin && <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", provider: "google", modelId: "", apiKey: "", baseUrl: "", isActive: true, capabilities: [""], maxTokens: 2048, temperature: 0.7 }); }}
          className="flex items-center gap-1.5 bg-brand-teal text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0]"><Plus className="h-3.5 w-3.5" />Add Model</button>}
      </div>

      {showForm && (
        <div className="bg-brand-navy border border-brand-teal/20 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4">{editId ? "Edit" : "Add"} AI Model</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-1"><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gemini 2.0 Flash" className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Provider</label>
              <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value as any })}
                className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white">
                {providers.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Model ID</label>
              <input type="text" value={form.modelId} onChange={(e) => setForm({ ...form, modelId: e.target.value })} placeholder="gemini-2.0-flash" className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
            <div className="col-span-2 md:col-span-1"><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">API Key</label>
              <input type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} placeholder="sk-..." className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono" /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Base URL</label>
              <input type="text" value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} placeholder="https://api.openai.com/v1" className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Max Tokens</label>
              <input type="number" value={form.maxTokens} onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) || 2048 })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Temperature</label>
              <input type="number" step="0.1" min="0" max="2" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) || 0.7 })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="bg-brand-teal text-brand-navy px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0]">{editId ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 px-4 py-1.5 rounded-lg text-xs border border-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((model: any) => (
          <div key={model._id} className={`bg-brand-navy border rounded-xl p-4 transition-all ${model.isActive ? "border-brand-teal/30" : "border-gray-700/30 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className={`h-4 w-4 ${model.provider === "google" ? "text-blue-400" : model.provider === "openai" ? "text-green-400" : model.provider === "anthropic" ? "text-purple-400" : "text-gray-400"}`} />
                <div><h5 className="text-xs font-bold text-white">{model.name}</h5>
                  <span className="text-[9px] font-mono text-gray-400">{model.provider} · {model.modelId}</span></div>
              </div>
              {isAdmin && <button onClick={() => toggleActive({ id: model._id })} className={`p-1 rounded ${model.isActive ? "text-green-400 hover:text-green-300" : "text-gray-600 hover:text-gray-400"}`}>
                <Power className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between text-gray-400"><span>Capabilities</span><span className="text-white">{model.capabilities?.join(", ") || "—"}</span></div>
              <div className="flex justify-between text-gray-400"><span>Max Tokens</span><span className="text-white">{model.maxTokens || "—"}</span></div>
              <div className="flex justify-between text-gray-400"><span>Temperature</span><span className="text-white">{model.temperature || "—"}</span></div>
            </div>
            {isAdmin && <div className="flex gap-2 mt-3 pt-3 border-t border-brand-teal/5">
              <button onClick={() => startEdit(model)} className="text-brand-teal hover:text-brand-gold text-[10px] flex items-center gap-1"><Edit3 className="h-3 w-3" />Edit</button>
              <button onClick={() => { if (confirm("Delete this model?")) removeModel({ id: model._id }); }} className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1"><Trash2 className="h-3 w-3" />Delete</button>
            </div>}
          </div>
        ))}
        {data.length === 0 && <div className="col-span-full text-center text-gray-500 text-xs py-8">No AI models configured. Add your first model.</div>}
      </div>
    </div>
  );
};
