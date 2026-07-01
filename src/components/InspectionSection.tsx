import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, PlusCircle, FileText, ClipboardList, AlertTriangle, Send, CheckCircle, AlertCircle } from "lucide-react";
import { InspectionRequest } from "../types";

interface InspectionSectionProps {
  lang?: "en" | "so";
}

export const InspectionSection: React.FC<InspectionSectionProps> = ({ lang = "en" }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    factoryName: "",
    factoryAddress: "",
    city: "Yiwu" as any,
    inspectionDate: "",
    scope: "Pre-Shipment Inspection (PSI)" as any,
    productType: "",
  });

  const [bookings, setBookings] = useState<InspectionRequest[]>([
    {
      id: "INSP-8092",
      name: "Ahmed Guleed",
      phone: "+252 63 3332211",
      factoryName: "Guangzhou Sheng Solar Tech Ltd",
      factoryAddress: "Block B, Industrial Park, Huadu District",
      city: "Guangzhou",
      inspectionDate: "2026-07-04",
      scope: "Pre-Shipment Inspection (PSI)",
      productType: "Lithium LiFePO4 Battery Banks",
      status: "Inspector Assigned",
      createdAt: "2026-06-29T08:30:00Z",
    },
    {
      id: "INSP-3301",
      name: "Hargeisa Electronics",
      phone: "+252 63 5557766",
      factoryName: "Yiwu Smart Garments Co",
      factoryAddress: "No. 45 Chouzhou Road",
      city: "Yiwu",
      inspectionDate: "2026-06-26",
      scope: "Container Loading Supervision",
      productType: "Commercial Fabrics & Denim",
      status: "Report Completed",
      createdAt: "2026-06-22T09:10:00Z",
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const inspT = {
    en: {
      auditsTitle: "China Factory Quality Audits",
      auditsDesc: "Somaliland's most professional quality assurance network. We dispatch certified native Chinese quality engineers to audit manufacturing facilities, verify raw material standards, and prevent substandard product shipments.",
      benefit1: "AQL 2.5 Standard: Statistical sampling audits according to international ISO standard protocols.",
      benefit2: "On-site Lab testing: Verifying battery cycles, solar wattage, fabric density, and material strength.",
      benefit3: "HD Photo & Video report: Receive 80+ high-resolution check photos, videos of test-runs and container seals.",
      whyTitle: "Why Auditing Matters",
      whyDesc: "Paying Chinese suppliers 100% of the funds before quality validation risks receiving defect items or generic models. Our on-site inspections verify compliance before cargo containers are sealed and loaded.",
      scheduleTitle: "Schedule Quality Inspection",
      scheduleDesc: "Submit your supplier's factory address details. We require at least 48 hours notice to dispatch inspectors.",
      successTitle: "QC Mission Filed Successfully",
      successDesc: "Your on-site quality inspection command is assigned to our local China regional manager. An inspector assignment schedule will appear in your console.",
      lblYourName: "Your Name",
      placeholderYourName: "e.g. Cabdiraxmaan Baane",
      lblContact: "WhatsApp / Contact",
      placeholderContact: "e.g. +252 63 1111111",
      lblFactoryName: "Chinese Supplier / Factory Name",
      placeholderFactoryName: "e.g. Foshan Golden Tile Co., Ltd.",
      lblCategory: "Commodity / Product Category",
      placeholderCategory: "e.g. Solar Storage Batteries, Electric Fans",
      lblCity: "Factory City Region",
      lblScope: "Inspection / Audit Scope Type",
      lblAddress: "Full Factory Road Address (Chinese / English)",
      placeholderAddress: "e.g. Building 4, Xintang Industrial Area, Guangzhou",
      lblDate: "Target QC Inspection Date",
      btnBook: "Book On-Site Factory Inspector",
      btnBooking: "Dispatching Command...",
      activeBookings: "Active Inspection Bookings console",
      options: {
        psi: "Pre-Shipment Inspection (PSI) - Recommended",
        audit: "Complete Factory Capability Audit",
        dupro: "During Production Check (DUPRO)",
        loading: "Container Loading & Seal Supervision",
      }
    },
    so: {
      auditsTitle: "Baadhista Tayada Warshada ee Shiinaha",
      auditsDesc: "Shabakadda ugu xirfadda badan ee xaqiijinta tayada ee Somaliland. Waxaan u dirnaa injineero u dhashay Shiinaha si ay u baadhaan tas-hiilaadka wax-soo-saarka, u xaqiijiyaan agabka saxda ah, uguna hortagaan alaabta tayada liidata.",
      benefit1: "Halbeegga AQL 2.5: Baadhitaano muunad tusaale ah oo waafaqsan hab-maamuuska caalamiga ah ee ISO.",
      benefit2: "Baadhista Shaybaarka ee goobta: Hubinta baytariyada, awoodda cadceedda, iyo adkaysiga alaabta.",
      benefit3: "Warbixin Sawiro & Fiidiyowyo HD ah: Hel 80+ sawiro tayadoodu sarreyso, fiidiyowyo muujinaya tijaabooyinka iyo shamiitada konteynarka.",
      whyTitle: "Maxay Muhiim u Tahay Baadhistu?",
      whyDesc: "Inaad siiso warshada Shiinaha boqolkiiba boqol (100%) lacagta ka hor intaan tayada alaabta la hubin waxay halis u tahay inaad hesho alaab kharriban. Baadhitaanadayadu waxay xaqiijiyaan tayada alaabta ka hor intaan konteynarka la xidhin.",
      scheduleTitle: "Ballanso Baadhitaan Tayo",
      scheduleDesc: "Geli faahfaahinta ciwaanka warshadda alaabta kuu soo saaraysa. Waxaan u baahanahay ugu yaraan 48 saacadood si aan u dirno khabiirka baadhista tayada.",
      successTitle: "Amarka Baadhista Tayada Waa la Diyaariyay",
      successDesc: "Dalabkaaga baadhista tayada waxaa loo xilsaaray maareeyahayaga deegaanka Shiinaha. Ballanta baadhaha waxay ka soo muuqan doontaa shaashadda hoose.",
      lblYourName: "Magacaaga",
      placeholderYourName: "tusaale. Cabdiraxmaan Baane",
      lblContact: "WhatsApp / Taleefan",
      placeholderContact: "tusaale. +252 63 1111111",
      lblFactoryName: "Magaca Soo-saaraha / Warshada Shiinaha",
      placeholderFactoryName: "tusaale. Foshan Golden Tile Co., Ltd.",
      lblCategory: "Nooca Alaabta / Category",
      placeholderCategory: "tusaale. Baytariyada Cadceedda, Marawaxadaha",
      lblCity: "Gobolka/Magaalada Warshadu ku taal",
      lblScope: "Nooca Baadhitaanka Tayada",
      lblAddress: "Ciwaanka saxda ah ee Warshada (Shiine / Ingiriis)",
      placeholderAddress: "tusaale. Building 4, Xintang Industrial Area, Guangzhou",
      lblDate: "Maalinta la Baadhayo Tayada",
      btnBook: "Ballanso Injineerka Baadhista",
      btnBooking: "La xidhiidhaya Baadhaha...",
      activeBookings: "Diiwaanka Ballamaha Baadhista Tayada",
      options: {
        psi: "PSI - Baadhista Ka Hor Rarka (Aad loo lagula taliyo)",
        audit: "Xisaabinta iyo Baadhista Guud ee Warshadda",
        dupro: "Baadhista Inta Wax-soo-saarku Socdo (DUPRO)",
        loading: "Kormeerka Rarka Konteynarka & Shamiitaynta",
      }
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.factoryName || !form.inspectionDate) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setBookings((prev) => [data.request, ...prev]);
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          factoryName: "",
          factoryAddress: "",
          city: "Yiwu",
          inspectionDate: "",
          scope: "Pre-Shipment Inspection (PSI)",
          productType: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* QC Explanation (Left, 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/20 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="bg-brand-teal/10 p-3 rounded-xl border border-brand-teal/25 inline-block text-brand-teal">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white leading-snug">
            {inspT.auditsTitle}
          </h3>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {inspT.auditsDesc}
          </p>

          {/* Key Checklist Benefits */}
          <div className="space-y-3 pt-3 border-t border-brand-teal/10 text-xs text-gray-300">
            <div className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0" />
              <span>{inspT.benefit1}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0" />
              <span>{inspT.benefit2}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0" />
              <span>{inspT.benefit3}</span>
            </div>
          </div>
        </div>

        {/* Dynamic QC Warning card */}
        <div className="bg-[#031326] border border-brand-gold/30 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {inspT.whyTitle}
            </h5>
            <p className="text-[10px] text-gray-300 font-sans mt-1 leading-relaxed">
              {inspT.whyDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Wizard (Right, 3 columns) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/20 p-5 md:p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-brand-teal" />
            {inspT.scheduleTitle}
          </h3>
          <p className="text-xs text-gray-300 mb-6 font-sans leading-relaxed">
            {inspT.scheduleDesc}
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-teal/10 border border-brand-teal/30 p-6 rounded-xl text-center space-y-3"
            >
              <CheckCircle className="h-10 w-10 text-brand-teal mx-auto animate-bounce" />
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                {inspT.successTitle}
              </h4>
              <p className="text-xs text-gray-300 max-w-sm mx-auto font-sans leading-relaxed">
                {inspT.successDesc}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblYourName}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={inspT.placeholderYourName}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblContact}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={inspT.placeholderContact}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Factory Name */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblFactoryName}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.factoryName}
                    onChange={(e) => setForm({ ...form, factoryName: e.target.value })}
                    placeholder={inspT.placeholderFactoryName}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                {/* Product category */}
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblCategory}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.productType}
                    onChange={(e) => setForm({ ...form, productType: e.target.value })}
                    placeholder={inspT.placeholderCategory}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* City */}
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblCity}
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value as any })}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option value="Yiwu">Yiwu (Zhejiang)</option>
                    <option value="Guangzhou">Guangzhou (Guangdong)</option>
                    <option value="Shenzhen">Shenzhen (Guangdong)</option>
                    <option value="Ningbo">Ningbo (Zhejiang)</option>
                    <option value="Foshan">Foshan (Guangdong)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Inspection Scope */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    {inspT.lblScope}
                  </label>
                  <select
                    value={form.scope}
                    onChange={(e) => setForm({ ...form, scope: e.target.value as any })}
                    className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option value="Pre-Shipment Inspection (PSI)">{inspT.options.psi}</option>
                    <option value="Factory Audit">{inspT.options.audit}</option>
                    <option value="During Production (DUPRO)">{inspT.options.dupro}</option>
                    <option value="Container Loading Supervision">{inspT.options.loading}</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {inspT.lblAddress}
                </label>
                <input
                  type="text"
                  required
                  value={form.factoryAddress}
                  onChange={(e) => setForm({ ...form, factoryAddress: e.target.value })}
                  placeholder={inspT.placeholderAddress}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {inspT.lblDate}
                </label>
                <input
                  type="date"
                  required
                  value={form.inspectionDate}
                  onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-teal text-brand-navy hover:bg-[#00bda0] disabled:bg-gray-700 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmitting ? inspT.btnBooking : inspT.btnBook}
              </button>
            </form>
          )}

          {/* Render List of Active Scheduled QC Bookings */}
          <div className="mt-8 border-t border-brand-teal/15 pt-6">
            <h4 className="font-display text-xs font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {inspT.activeBookings}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#030d1a] border border-brand-teal/10 p-3 rounded-xl space-y-2 hover:border-brand-teal/25 transition-all duration-300 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-brand-teal bg-brand-teal/5 px-1.5 py-0.5 rounded border border-brand-teal/10 font-bold">
                      {b.id}
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      b.status === "Report Completed"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-brand-gold/10 border-brand-gold/20 text-brand-gold animate-pulse"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white truncate">{b.factoryName}</h5>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">{b.productType}</p>
                  </div>

                  <div className="border-t border-brand-teal/5 pt-1.5 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                    <span>Type: {b.scope.split(" (")[0]}</span>
                    <span>Date: {b.inspectionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InspectionSection);
