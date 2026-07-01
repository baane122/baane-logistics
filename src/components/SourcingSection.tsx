import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Search, HelpCircle, Package, Map, DollarSign, Send, CheckCircle, AlertCircle } from "lucide-react";
import { SourcingRequest } from "../types";

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

  const [tickets, setTickets] = useState<SourcingRequest[]>([
    {
      id: "SRC-7801",
      name: "Abdirahman Baane",
      phone: "+252 63 4441234",
      productType: "Monocrystalline Solar Panels & Inverters",
      quantity: "500 Units",
      budget: "$45,000",
      targetMarket: "Shenzhen Electronics",
      description: "Looking for top-tier Tier-1 solar modules with 25-year warranties and matching pure sine wave hybrid solar inverters.",
      status: "Searching Suppliers",
      createdAt: "2026-06-28T14:20:00Z",
    },
    {
      id: "SRC-4209",
      name: "Somali Building Co",
      phone: "+252 63 9998888",
      productType: "Vitrified Porcelain Tiles (Foshan)",
      quantity: "2x 40ft Containers",
      budget: "$28,000",
      targetMarket: "Foshan Ceramics Market",
      description: "600x600mm luxury polished glazed porcelain flooring tiles. Sourcing directly from reputable Foshan factory plants.",
      status: "Verifying Samples",
      createdAt: "2026-06-25T11:15:00Z",
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const sourcT = {
    en: {
      title: "Initiate Sourcing Command",
      desc: "Specify your desired commodity. Our on-the-ground sourcing agents in China (Ningbo, Shenzhen, Yiwu, Guangzhou) will locate direct factory partners, inspect sample models, and secure wholesale bidding rates.",
      successTitle: "Sourcing Command Broadcasted",
      successDesc: "Your request has been filed under secure protocols. Our Yiwu / Guangzhou office is assigning a specialist agent. Verify progress on the right tracker panel.",
      lblMerchant: "Merchant Name / Contact",
      placeholderMerchant: "e.g. Mustafe Omer",
      lblPhone: "WhatsApp / Mobile",
      placeholderPhone: "e.g. +252 63 4001122",
      lblProduct: "Product Description/Category",
      placeholderProduct: "e.g. Solar panels, Garments, Tiles",
      lblQty: "Target Volume / Quantity",
      placeholderQty: "e.g. 5,000 Units / 1x 20ft container",
      lblBudget: "Estimated Sourcing Budget (USD)",
      placeholderBudget: "e.g. 15,000",
      lblMarket: "Primary Sourcing Market Hub",
      lblSpec: "Product Specifications & Special Requests",
      placeholderSpec: "Detail brand names, materials, certificates (CE/ISO) or customization logos required...",
      btnSubmit: "Broadcast Sourcing Command",
      btnSubmitting: "Initiating Uplink...",
      radarTitle: "Sourcing Radar Console",
      officeTitle: "On-Ground China Offices",
      officeDesc: "We operate physical warehouses and audit hubs in Yiwu and Guangzhou, meaning we handle factory negotiations directly, cut out intermediate broker margins, and manage export customs autonomously.",
      markets: {
        yiwu: "Yiwu Commodities City (General Merchandise)",
        shenzhen: "Shenzhen Huaqiangbei (Tech & Electronics)",
        guangzhou: "Guangzhou Garment District (Apparel & Fabric)",
        foshan: "Foshan Lecong Hub (Ceramics & Furniture)",
        ningbo: "Ningbo Industrial Park (Machinery & Hardware)",
      }
    },
    so: {
      title: "Bilow Dalabka Sourcing-ka",
      desc: "Sheeg badeecada aad rabto. Kooxdayada ku sugan Shiinaha (Ningbo, Shenzhen, Yiwu, Guangzhou) waxay toos u helayaan warshado, iyagoo hubinaya tayada muunada, soona helaya qiimaha ugu jaban ee jumladda ah.",
      successTitle: "Amarka Sourcing-ka Waa la Diray",
      successDesc: "Dalabkaaga si ammaan ah ayaa loo xereeyay. Xafiiskayaga Yiwu ama Guangzhou ayaa loo xilsaaray wakiil khabiir ah. Kala soco horumarka dhanka midig.",
      lblMerchant: "Magaca Ganacsadaha",
      placeholderMerchant: "tusaale. Mustafe Cumar",
      lblPhone: "WhatsApp / Taleefan",
      placeholderPhone: "tusaale. +252 63 4001122",
      lblProduct: "Faahfaahinta / Nooca Badeecada",
      placeholderProduct: "tusaale. Solar-ada, Dharka, Marmarka",
      lblQty: "Tirada aad u Baahan Tahay",
      placeholderQty: "tusaale. 5,000 oo xabbo ama Konteynar 20ft ah",
      lblBudget: "Miisaaniyada qiyaasta ah (USD)",
      placeholderBudget: "tusaale. 15,000",
      lblMarket: "Suuqa Sourcing-ka Shiinaha",
      lblSpec: "Shuruudaha Alaabta & Dalabaadka Gaarka ah",
      placeholderSpec: "Sheeg magacyada sumadaha, agabka, shahaadooyinka (CE/ISO) ama sumadaha gaarka ah ee aad u baahan tahay...",
      btnSubmit: "Dir Amarka Sourcing-ka",
      btnSubmitting: "La xidhiidhaya Shiinaha...",
      radarTitle: "Mashiinka Sourcing-ka",
      officeTitle: "Xafiisyada Tooska ah ee Shiinaha",
      officeDesc: "Waxaan ku leenahay bakhaaro iyo xarumo baadhiseed magaalooyinka Yiwu iyo Guangzhou, taas oo la macno ah inaan si toos ah ula xaajoonayno warshadaha, meeshana ka saarayno dadka dhex-dhexaadka ah, soona marinayno kastamka si xirfad leh.",
      markets: {
        yiwu: "Yiwu Commodities City (Agabka Guud)",
        shenzhen: "Shenzhen Huaqiangbei (Teknolojiyadda & Qalabka)",
        guangzhou: "Guangzhou Garment District (Dharka & Dharka)",
        foshan: "Foshan Lecong Hub (Marmarka & Alaabta Guriga)",
        ningbo: "Ningbo Industrial Park (Mashiinada & Hardware)",
      }
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Client-side validation
    if (!form.name.trim()) {
      setFormError("Please enter your name or company name.");
      return;
    }
    if (!form.productType.trim()) {
      setFormError("Please describe the product or commodity.");
      return;
    }
    if (!form.quantity.trim()) {
      setFormError("Please specify the target volume or quantity.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Server returned " + res.status);
      }

      const data = await res.json();
      setTickets((prev) => [data.request, ...prev]);
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        productType: "",
        quantity: "",
        budget: "",
        targetMarket: "Yiwu Commodities City",
        description: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit sourcing request. Please try again.");
      console.error("Sourcing submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Sourcing Form Wizard (Left, 3 columns) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/20 p-5 md:p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-brand-teal" />
            {sourcT.title}
          </h3>
          <p className="text-xs text-gray-300 mb-6 font-sans leading-relaxed">
            {sourcT.desc}
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-teal/10 border border-brand-teal/30 p-6 rounded-xl text-center space-y-3"
            >
              <CheckCircle className="h-10 w-10 text-brand-teal mx-auto animate-bounce" />
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                {sourcT.successTitle}
              </h4>
              <p className="text-xs text-gray-300 max-w-sm mx-auto font-sans leading-relaxed">
                {sourcT.successDesc}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblMerchant}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={sourcT.placeholderMerchant}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblPhone}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={sourcT.placeholderPhone}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Type */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblProduct}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.productType}
                    onChange={(e) => setForm({ ...form, productType: e.target.value })}
                    placeholder={sourcT.placeholderProduct}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblQty}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder={sourcT.placeholderQty}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Budget */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblBudget}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-teal opacity-60" />
                    <input
                      type="text"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder={sourcT.placeholderBudget}
                      className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 pl-8 pr-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                {/* Target Sourcing Market */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {sourcT.lblMarket}
                  </label>
                  <select
                    value={form.targetMarket}
                    onChange={(e) => setForm({ ...form, targetMarket: e.target.value })}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option value="Yiwu Commodities City">{sourcT.markets.yiwu}</option>
                    <option value="Shenzhen Electronics">{sourcT.markets.shenzhen}</option>
                    <option value="Guangzhou Clothes">{sourcT.markets.guangzhou}</option>
                    <option value="Foshan Construction">{sourcT.markets.foshan}</option>
                    <option value="Ningbo Hardware">{sourcT.markets.ningbo}</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {sourcT.lblSpec}
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={sourcT.placeholderSpec}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-teal text-brand-navy hover:bg-[#00bda0] disabled:bg-gray-700 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmitting ? sourcT.btnSubmitting : sourcT.btnSubmit}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sourcing Tracker Tickets List (Right, 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/15 p-5 md:p-6 rounded-2xl shadow-xl h-full flex flex-col justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-teal" />
              {sourcT.radarTitle}
            </h4>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#030d1a]/80 border border-brand-teal/10 p-3.5 rounded-xl space-y-2.5 hover:border-brand-teal/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brand-teal font-bold tracking-wider bg-brand-teal/5 px-2 py-0.5 rounded border border-brand-teal/15">
                      {t.id}
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      t.status === "Quoted"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-brand-gold/10 border-brand-gold/20 text-brand-gold animate-pulse"
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white font-sans line-clamp-1">
                      {t.productType}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                      Vol: {t.quantity} • Budget: {t.budget || "TBD"}
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-300 font-sans leading-relaxed line-clamp-2 italic">
                    "{t.description}"
                  </p>

                  <div className="flex justify-between items-center border-t border-brand-teal/5 pt-2 font-mono text-[8px] text-gray-500">
                    <span>Market: {t.targetMarket}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#031326] border border-brand-teal/15 p-4 rounded-xl mt-6">
            <h5 className="font-display text-[11px] font-extrabold text-brand-gold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5 text-brand-gold" />
              {sourcT.officeTitle}
            </h5>
            <p className="text-[10px] text-gray-300 font-sans leading-relaxed">
              {sourcT.officeDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SourcingSection);
