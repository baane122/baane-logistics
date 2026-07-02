import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Search, HelpCircle, Package, Map, DollarSign, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SourcingSectionProps {
  lang?: "en" | "so";
}

export const SourcingSection: React.FC<SourcingSectionProps> = ({ lang = "en" }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    productType: "",
    quantity: "",
    budget: "",
    targetMarket: "Yiwu Commodities City",
    description: "",
  });
  const [tickets, setTickets] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const createSourcing = useMutation(api.sourcing.create);

  const srcT = {
    en: {
      radarTitle: "Baane Product Sourcing Engine",
      radarDesc: "Send a detailed sourcing request to our China-based procurement officers. We speak factory, trade law, and quality metrics fluently.",
      title: "Sourcing Request Wizard",
      subtitle: "China Market Procurement Order",
      reqFields: "Required Purchase Details",
      lblName: "Your Name / Company",
      placeholderName: "e.g. Ahmed Ismail Traders",
      lblPhone: "Phone (incl. country code)",
      placeholderPhone: "+252 63 370 6667",
      lblProduct: "Product / Commodity to Source",
      placeholderProduct: "e.g. Solar panels, phone accessories, furniture, tiles...",
      lblQty: "Target Volume / Quantity",
      placeholderQty: "e.g. 500 units, 2 x 20ft containers, 1000 sqm",
      optFields: "Optional Targeting & Budget",
      lblBudget: "Budget Range (USD)",
      placeholderBudget: "e.g. 5,000 - 50,000",
      lblMarket: "Target Market / City in China",
      lblDesc: "Product Specs & Special Notes",
      placeholderDesc: "Specify brands, materials, certifications (CE/ISO), or special packaging requirements...",
      btnSubmit: "Submit Sourcing Order",
      btnSubmitting: "Contacting China Hub...",
      radarTitle2: "Sourcing Radar Screen",
      officeTitle: "Live China Offices",
      officeDesc: "We maintain bonded warehouses and inspection hubs in Yiwu and Guangzhou city centers, enabling our team to negotiate factory-direct pricing, consolidate pallets, perform quality checks, and clear customs paperwork on-site.",
      markets: {
        yiwu: "Yiwu Commodities City (General Merchandise)",
        shenzhen: "Shenzhen Huaqiangbei (Electronics & Tech)",
        guangzhou: "Guangzhou Garment District (Apparel & Textiles)",
        foshan: "Foshan Lecong Hub (Ceramics & Homeware)",
        ningbo: "Ningbo Industrial Park (Machinery & Hardware)",
      },
      errName: "Please enter your name or company name.",
      errProduct: "Please describe the product or commodity.",
      errQty: "Please specify the target volume or quantity.",
      errSubmit: "Failed to submit sourcing request. Please try again.",
      successMsg: "Sourcing request submitted successfully! Our China team will review within 24 hours.",
      recentRequests: "Recent Sourcing Requests",
      statusReceived: "Received",
      statusSearching: "Searching Suppliers",
      statusVerifying: "Verifying Samples",
      statusQuoted: "Quoted",
      statusCompleted: "Completed",
      noRequests: "No requests yet. Submit one above.",
    },
    so: {
      radarTitle: "Mashiinka Sourcing-ka Baane",
      radarDesc: "Soo gudbi dalab sourcing ah oo faahfaahsan oo ay eegi howl-wadeennada iibka ee Shiinaha ku leenahay.",
      title: "Dalab Sourcing",
      subtitle: "Dalabka Iibka & Soo Dhoofinta",
      reqFields: "Faahfaahinta Dalabka (Lama Huraan)",
      lblName: "Magacaaga / Shirkadda",
      placeholderName: "tusaale. Ahmed Ismail Traders",
      lblPhone: "Telefoonka (oo ay ku jirto lambarka waddanka)",
      placeholderPhone: "+252 63 370 6667",
      lblProduct: "Alaabta / Badeecada",
      placeholderProduct: "tusaale. Sonkor, qalab elektaroonig ah, dharbaaxo...",
      lblQty: "Tirada / Qadarka",
      placeholderQty: "tusaale. 500 unit, 2 konteynar 20ft, 1000 sqm",
      optFields: "Macluumaad Dheeraad ah",
      lblBudget: "Qiyaasta Qiimaha (USD)",
      placeholderBudget: "tusaale. 5,000 - 50,000",
      lblMarket: "Suuqa / Magaalada Shiinaha",
      lblDesc: "Shuruudaha Alaabta & Dalabaadka Gaarka ah",
      placeholderDesc: "Sheeg magacyada sumadaha, agabka, shahaadooyinka (CE/ISO) ama sumadaha gaarka ah...",
      btnSubmit: "Dir Amarka Sourcing-ka",
      btnSubmitting: "La xidhiidhaya Shiinaha...",
      radarTitle2: "Mashiinka Sourcing-ka",
      officeTitle: "Xafiisyada Tooska ah ee Shiinaha",
      officeDesc: "Waxaan ku leenahay bakhaaro iyo xarumo baadhiseed magaalooyinka Yiwu iyo Guangzhou, taas oo la macno ah inaan si toos ah ula xaajoonayno warshadaha.",
      markets: {
        yiwu: "Yiwu Commodities City (Agabka Guud)",
        shenzhen: "Shenzhen Huaqiangbei (Teknolojiyadda)",
        guangzhou: "Guangzhou Garment District (Dharka)",
        foshan: "Foshan Lecong Hub (Marmarka & Alaabta)",
        ningbo: "Ningbo Industrial Park (Mashiinada)",
      },
      errName: "Fadlan geli magacaaga.",
      errProduct: "Fadlan sharax badeecada.",
      errQty: "Fadlan sheeg tirada.",
      errSubmit: "Dalabka wuu guuldareystay. Fadlan markale isku day.",
      successMsg: "Dalabka waa la diray! Kooxdeena Shiinaha ayaa eegi doonta 24 saac gudahood.",
      recentRequests: "Dalabaadkii Hore",
      statusReceived: "La Helay",
      statusSearching: "Baadhista",
      statusVerifying: "Tijaabinta",
      statusQuoted: "Qiimeyn",
      statusCompleted: "La Dhammaystiray",
      noRequests: "Weli dalab lama dirin.",
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) { setFormError(srcT.errName); return; }
    if (!form.productType.trim()) { setFormError(srcT.errProduct); return; }
    if (!form.quantity.trim()) { setFormError(srcT.errQty); return; }

    setIsSubmitting(true);
    try {
      const result = await createSourcing({
        name: form.name.trim(),
        phone: form.phone.trim(),
        productType: form.productType.trim(),
        quantity: form.quantity.trim(),
        budget: form.budget.trim() || undefined,
        targetMarket: form.targetMarket,
        description: form.description.trim() || undefined,
      });
      if (result) setTickets((prev) => [result, ...prev]);
      setSuccess(true);
      setForm({ name: "", phone: "", productType: "", quantity: "", budget: "", targetMarket: "Yiwu Commodities City", description: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setFormError(srcT.errSubmit);
      console.error("Sourcing submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/20 p-5 md:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-brand-teal" />
            <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-[0.12em]">{srcT.title}</h4>
            <span className="text-[8px] font-mono text-brand-teal/50 ml-auto">{srcT.subtitle}</span>
          </div>

          {success && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2 text-green-400 text-xs mb-4">
              <CheckCircle className="h-4 w-4 shrink-0" />{srcT.successMsg}
            </motion.div>
          )}

          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-xs mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />{formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h5 className="text-[10px] font-mono text-brand-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />{srcT.reqFields}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblName}</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={srcT.placeholderName}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblPhone}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={srcT.placeholderPhone}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblProduct}</label>
                  <input type="text" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} placeholder={srcT.placeholderProduct}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblQty}</label>
                  <input type="text" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder={srcT.placeholderQty}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-mono text-brand-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />{srcT.optFields}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblBudget}</label>
                  <input type="text" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder={srcT.placeholderBudget}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblMarket}</label>
                  <select value={form.targetMarket} onChange={(e) => setForm({ ...form, targetMarket: e.target.value })}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal">
                    {Object.values(srcT.markets).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">{srcT.lblDesc}</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder={srcT.placeholderDesc}
                    className="w-full bg-[#030d1a] border border-brand-teal/15 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-teal transition-all" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-brand-teal hover:bg-[#00bda0] disabled:bg-gray-700 text-brand-navy py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
              {isSubmitting ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-brand-navy border-t-transparent animate-spin" /> {srcT.btnSubmitting}</> : <><Send className="h-4 w-4" /> {srcT.btnSubmit}</>}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/20 p-5 rounded-2xl shadow-xl">
          <h4 className="font-display text-xs font-extrabold text-white mb-3 flex items-center gap-2">
            <Map className="h-4 w-4 text-brand-teal" /> {srcT.officeTitle}
          </h4>
          <p className="text-[11px] text-gray-300 leading-relaxed mb-4">{srcT.officeDesc}</p>
          <div className="space-y-2">
            {Object.entries(srcT.markets).map(([key, label]) => (
              <div key={key} className="bg-[#030d1a] p-3 rounded-xl text-[10px] text-gray-200 font-mono flex items-center gap-2 border border-brand-teal/5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />{label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-navy border border-brand-teal/15 p-5 rounded-2xl shadow-xl">
          <h4 className="font-display text-xs font-extrabold text-brand-teal mb-3">{srcT.recentRequests}</h4>
          {tickets.length === 0 ? (
            <p className="text-[10px] text-gray-500 text-center py-4">{srcT.noRequests}</p>
          ) : (
            tickets.map((t: any) => (
              <div key={t._id} className="bg-[#030d1a] p-3 rounded-xl mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.productType}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                    t.status === "Completed" ? "bg-green-500/10 text-green-400" :
                    t.status === "Quoted" ? "bg-brand-teal/10 text-brand-teal" :
                    "bg-brand-gold/10 text-brand-gold"
                  }`}>{t.status}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{t.name} · {t.quantity}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SourcingSection);
