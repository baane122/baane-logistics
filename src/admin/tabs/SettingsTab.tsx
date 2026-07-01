import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Save, RefreshCw } from "lucide-react";

interface Props { user: any; isAdmin: boolean; data?: any[] }

export const SettingsTab: React.FC<Props> = ({ isAdmin, data }) => {
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const saveSetting = useMutation(api.settings.set);

  if (!data) return <div className="text-gray-500 text-xs p-8">Loading settings...</div>;

  const byCategory = data.reduce((acc: any, s: any) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = ["general", "contact", "ai", "currency", "shipping"];

  const handleSave = async (key: string, value: string, category: string) => {
    setSaving(key);
    try {
      await saveSetting({ key, value, category });
      setMsg(`Saved: ${key}`);
      setTimeout(() => setMsg(""), 2000);
    } catch (e) { console.error(e); }
    setSaving(null);
  };

  const getVal = (key: string) => edits[key] ?? data.find((s: any) => s.key === key)?.value ?? "";

  return (
    <div className="space-y-6">
      {msg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg">{msg}</div>}

      {categories.map((cat) => {
        const items = byCategory[cat] || [];
        if (items.length === 0) return null;
        return (
          <div key={cat} className="bg-brand-navy border border-brand-teal/10 rounded-xl p-5">
            <h4 className="text-xs font-bold text-white font-display mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />{cat}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((s: any) => (
                <div key={s._id} className="bg-[#030d1a] p-3 rounded-lg">
                  <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">{s.key.replace(/_/g, ' ')}</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value={getVal(s.key)} onChange={(e) => setEdits({ ...edits, [s.key]: e.target.value })}
                      className="flex-1 bg-[#020914] border border-brand-teal/10 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-teal" disabled={!isAdmin} />
                    {isAdmin && <button onClick={() => handleSave(s.key, getVal(s.key), s.category)}
                      className="text-brand-teal hover:text-brand-gold p-1.5 disabled:opacity-50" disabled={saving === s.key}>
                      {saving === s.key ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    </button>}
                  </div>
                  {s.description && <p className="text-[8px] text-gray-500 mt-1">{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
