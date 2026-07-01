import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus, Edit3, Trash2, Copy, Check } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

const CATEGORIES = ["ai-copilot", "sourcing-ai", "inspection-ai", "email-template", "sms-template", "custom"] as const;

export const PromptsTab: React.FC<Props> = ({ isAdmin, data }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", prompt: "", category: "ai-copilot" as typeof CATEGORIES[number], isDefault: false, variables: "" });
  const [copied, setCopied] = useState<string | null>(null);
  
  const create = useMutation(api.prompts.create);
  const update = useMutation(api.prompts.update);
  const remove = useMutation(api.prompts.remove);

  if (!data) return <div className="text-gray-500 text-xs p-8">Loading...</div>;

  const handleSubmit = async () => {
    try {
      const vars = form.variables.split(",").map(v => v.trim()).filter(Boolean);
      if (editId) { await update({ id: editId, name: form.name, prompt: form.prompt, category: form.category, isDefault: form.isDefault, variables: vars }); }
      else { await create({ name: form.name, slug: form.slug, prompt: form.prompt, category: form.category, isDefault: form.isDefault, variables: vars, createdBy: undefined }); }
      setShowForm(false); setEditId(null);
    } catch (e) { console.error(e); }
  };

  const startEdit = (item: any) => {
    setEditId(item._id); setForm({ name: item.name, slug: item.slug, prompt: item.prompt, category: item.category, isDefault: item.isDefault, variables: item.variables?.join(", ") || "" }); setShowForm(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-500">{data.length} prompts</span>
        {isAdmin && <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", slug: "", prompt: "", category: "ai-copilot", isDefault: false, variables: "" }); }}
          className="flex items-center gap-1.5 bg-brand-teal text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0]"><Plus className="h-3.5 w-3.5" />New Prompt</button>}
      </div>

      {showForm && (
        <div className="bg-brand-navy border border-brand-teal/20 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white font-display mb-4">{editId ? "Edit" : "New"} System Prompt</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" disabled={!!editId} /></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Variables (comma separated)</label>
              <input type="text" value={form.variables} onChange={(e) => setForm({ ...form, variables: e.target.value })} placeholder="name, email, product" className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white" /></div>
          </div>
          <div><label className="text-[9px] font-mono text-gray-400 uppercase block mb-0.5">Prompt</label>
            <textarea rows={8} value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="w-full bg-[#030d1a] border border-brand-teal/10 rounded-lg py-2 px-2.5 text-xs text-white font-mono leading-relaxed" /></div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="bg-brand-teal text-brand-navy px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00bda0]">{editId ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 px-4 py-1.5 rounded-lg text-xs border border-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.map((p: any) => (
          <div key={p._id} className="bg-brand-navy border border-brand-teal/10 rounded-xl p-4 hover:border-brand-teal/20 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white">{p.name}</span>
                <span className="text-[8px] font-mono text-gray-500 bg-[#030d1a] px-1.5 py-0.5 rounded">{p.category}</span>
                {p.isDefault && <span className="text-[8px] font-mono text-brand-teal bg-brand-teal/5 px-1.5 py-0.5 rounded border border-brand-teal/20">default</span>}
                <span className="text-[8px] font-mono text-gray-500">v{p.version}</span>
              </div>
              {isAdmin && <div className="flex gap-1">
                <button onClick={() => copyToClipboard(p.prompt, p._id)} className="text-gray-400 hover:text-brand-teal p-1">{copied === p._id ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}</button>
                <button onClick={() => startEdit(p)} className="text-brand-teal hover:text-brand-gold p-1"><Edit3 className="h-3 w-3" /></button>
                <button onClick={() => { if (confirm("Delete?")) remove({ id: p._id }); }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="h-3 w-3" /></button>
              </div>}
            </div>
            <pre className="text-[9px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap line-clamp-3 bg-[#030d1a] p-2 rounded-lg">{p.prompt}</pre>
            {p.variables?.length > 0 && <div className="flex gap-1 mt-2"><span className="text-[8px] text-gray-500">Variables:</span>{p.variables.map((v: string) => <span key={v} className="text-[8px] font-mono text-brand-teal bg-brand-teal/5 px-1.5 py-0.5 rounded">{`{{${v}}}`}</span>)}</div>}
          </div>
        ))}
        {data.length === 0 && <div className="text-center text-gray-500 text-xs py-8">No prompts yet</div>}
      </div>
    </div>
  );
};
