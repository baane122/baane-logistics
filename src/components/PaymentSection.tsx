import React, { useState } from "react";
import { motion } from "motion/react";
import { DollarSign, ShieldAlert, ArrowLeftRight, CreditCard, Scale, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { CargoQuote } from "../types";

interface PaymentSectionProps {
  lang?: "en" | "so";
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ lang = "en" }) => {
  // Exchange rates state
  const [exchange, setExchange] = useState({
    usd: "100",
    cny: "725",
    slsh: "850000",
  });

  // Handle currency conversions
  const handleCurrencyChange = (val: string, from: "usd" | "cny" | "slsh") => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setExchange((prev) => ({ ...prev, [from]: val }));
      return;
    }

    if (from === "usd") {
      setExchange({
        usd: val,
        cny: (num * 7.25).toFixed(2),
        slsh: Math.round(num * 8500).toString(),
      });
    } else if (from === "cny") {
      setExchange({
        usd: (num / 7.25).toFixed(2),
        cny: val,
        slsh: Math.round((num / 7.25) * 8500).toString(),
      });
    } else if (from === "slsh") {
      setExchange({
        usd: (num / 8500).toFixed(2),
        cny: ((num / 8500) * 7.25).toFixed(2),
        slsh: val,
      });
    }
  };

  // Cargo Price Calculator state
  const [calc, setCalc] = useState({
    serviceType: "Sea Cargo" as "Sea Cargo" | "Air Cargo",
    cargoType: "Electronics",
    origin: "Shanghai",
    destination: "Berbera Port" as any,
    weight: "2500", // kgs
    volume: "12", // CBM
  });

  const [quoteOutput, setQuoteOutput] = useState<{
    cost: string;
    duration: string;
    insurance: string;
  } | null>(null);

  const calculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    const w = parseFloat(calc.weight) || 0;
    const v = parseFloat(calc.volume) || 0;
    
    // Validate inputs based on transport mode
    if (calc.serviceType === "Air Cargo" && w <= 0) {
      alert(lang === "so" ? "Fadlan geli miisaan sax ah." : "Please enter a valid weight for air cargo.");
      return;
    }
    if (calc.serviceType === "Sea Cargo" && v <= 0) {
      alert(lang === "so" ? "Fadlan geli cufnaan (CBM) sax ah." : "Please enter a valid volume (CBM) for sea cargo.");
      return;
    }
    
    let baseRate = calc.serviceType === "Air Cargo" ? 4.8 : 85; // Air: $4.8/kg, Sea: $85/CBM
    let cost = 0;
    let duration = "";

    if (calc.serviceType === "Air Cargo") {
      cost = w * baseRate;
      duration = lang === "so" ? "3 - 6 Maalmood (Express Air)" : "3 - 6 Days Express Air";
    } else {
      cost = v * baseRate;
      if (cost < 950) cost = 950; // Minimum FCL/LCL handling fee
      duration = lang === "so" ? "22 - 28 Maalmood (Badda/Konteynar)" : "22 - 28 Days Maritime Cargo";
    }

    // Add extra factor based on cargo type
    if (calc.cargoType === "Electronics") cost *= 1.1;
    
    setQuoteOutput({
      cost: `$${Math.round(cost).toLocaleString()}`,
      duration,
      insurance: `$${Math.round(cost * 0.015).toLocaleString()} (${lang === "so" ? "Guud ahaan dammaanad" : "Comprehensive"})`,
    });
  };

  const payT = {
    en: {
      exTitle: "China-Somaliland Exchange Swaps",
      exDesc: "Real-time trade exchange rates for our secure escrow agents. Convert directly across USD, RMB/CNY, and Somaliland Shilling.",
      lblUsd: "US Dollar (USD)",
      lblCny: "Chinese Yuan (CNY / RMB)",
      lblSlsh: "Somaliland Shilling (SLSH)",
      reserveInfo: "Rates updated via Baane Central Reserve. 1 USD ≈ 7.25 CNY | 1 USD ≈ 8,500 SLSH",
      freightTitle: "Freight Cost Estimator",
      lblMode: "Transportation Mode",
      btnSea: "Sea FCL/LCL",
      btnAir: "Air Express",
      lblCargo: "Cargo Material Category",
      optElectronics: "Electronics & Battery Banks",
      optApparel: "Apparel & Textiles",
      optConstruction: "Building & Construction Tiles",
      optGeneral: "General Merchandise / Plastics",
      lblOrigin: "Departure Chinese Port",
      lblDest: "Discharge Somaliland Hub",
      optShanghai: "Shanghai Port Terminal",
      optShenzhen: "Shenzhen Shekou Port",
      optNingbo: "Ningbo Zhoushan Terminal",
      optGuangzhou: "Guangzhou Nansha Port",
      optBerbera: "Port of Berbera (Terminal Delivery)",
      optHargeisa: "Hargeisa Warehouse (Cleared)",
      optBurao: "Burao Distribution Depot",
      lblWeight: "Gross Weight (KGs)",
      lblVolume: "Volume (CBM - for Sea freight)",
      btnCalc: "Analyze Cargo Specifications",
      resultTitle: "Calculated Logistics Assessment",
      resCost: "ESTIMATED FREIGHT COST",
      resEta: "TRANSIT TIME ETA",
      resIns: "MARINE INSURANCE",
      disclaimer: "*Quotes represent accurate sea & air tariff ranges. Real customs rates and port duties are processed based on packing lists via our automated Berbera clearing desk.",
      escrowTitle: "Secure Escrow Protocol",
      steps: [
        {
          step: "01",
          title: "Deposit USD in Hargeisa",
          desc: "Merchant delivers funds securely (cash deposit, check, or bank wire) to our physical Baane Hargeisa treasury bank accounts.",
        },
        {
          step: "02",
          title: "Baane Quality Inspection",
          desc: "While funds remain locked under local secure escrow custody, our native Chinese engineers perform audits and verify physical packing metrics on-site at the factory.",
        },
        {
          step: "03",
          title: "Release & Instant Bank CNY Transfer",
          desc: "Once product compliance reports are confirmed by the merchant, we pay the factory instantly in Chinese Yuan (CNY) via our internal, legal onshore trading portals.",
        },
      ],
      fraudTitle: "Eliminate Supplier Fraud Risks",
      fraudDesc: "Never worry about language barriers, foreign bank transfer errors, or factory scams again. Baane Logistics guarantees secure, legal cross-border escrow transactions, protecting over **$12M** in Somali merchant imports annually."
    },
    so: {
      exTitle: "Sarrifka Lacagaha ee Shiinaha & Somaliland",
      exDesc: "Heerka sarrifka ee xilligan dhabta ah ee ganacsatada. Si toos ah ugu kala beddel USD, RMB/CNY, iyo Shilingka Somaliland.",
      lblUsd: "Doolarka Maraykanka (USD)",
      lblCny: "Yuan-ka Shiinaha (CNY / RMB)",
      lblSlsh: "Shilingka Somaliland (SLSH)",
      reserveInfo: "Sarrifka waxaa cusboonaysiiyay Baane Central Reserve. 1 USD ≈ 7.25 CNY | 1 USD ≈ 8,500 SLSH",
      freightTitle: "Qiyaasta Qiimaha Rarka (Freight)",
      lblMode: "Nooca Gaadiidka",
      btnSea: "Badda (Konteynar)",
      btnAir: "Diyaarad (Express)",
      lblCargo: "Nooca Alaabta",
      optElectronics: "Teknolojiyada & Qalabka Korontada",
      optApparel: "Dharka & Haraga",
      optConstruction: "Agabka Dhismaha & Marmarka",
      optGeneral: "Alaabta Guud / Caagadaha",
      lblOrigin: "Dekedda Shiinaha ee laga rabo",
      lblDest: "Goobta laga dejinayo Somaliland",
      optShanghai: "Shanghai Port Terminal",
      optShenzhen: "Shenzhen Shekou Port",
      optNingbo: "Ningbo Zhoushan Terminal",
      optGuangzhou: "Guangzhou Nansha Port",
      optBerbera: "Dekedda Berbera (Gacan-ku-gayn)",
      optHargeisa: "Bakhaarka Hargeisa (La fasaxay)",
      optBurao: "Xarunta Qaybinta ee Burco",
      lblWeight: "Miisaanka Guud (KGs)",
      lblVolume: "Baaxadda CBM (Rarka Badda)",
      btnCalc: "Xisaabi Qiimaha Rarka alaabta",
      resultTitle: "Warbixinta Qiyaasta Logistics-ka",
      resCost: "QIIMAHA RAQDADA LA QIYAASEY",
      resEta: "MUDDADA TRANSIT-KA ETA",
      resIns: "KAYDINTA CAYMISKA BADDA",
      disclaimer: "*Qiimayaashani waa qiyaas sax ah oo ku salaysan tariifada badda & hawada. Qiimaha rasmiga ah ee kastamka waxaa lagu xisaabiyaa liiska alaabta (packing list) iyadoo loo marayo nidaamka Berbera.",
      escrowTitle: "Hab-maamuuska Escrow ee Ammaanka",
      steps: [
        {
          step: "01",
          title: "Dhigista Doolarka ee Hargeisa",
          desc: "Ganacsadu wuxuu lacagta USD u dhiibayaa si ammaan ah (lacag caddaan ah, jeeg, ama xawaalad bangi) xafiiskeena Hargeisa.",
        },
        {
          step: "02",
          title: "Baadhista Tayada ee Baane",
          desc: "Inta lacagtu ku xidhan tahay escrow-ga ammaanka ah ee deegaanka, injineeradayada Shiinaha ayaa si toos ah u baadhaya tayada warshadda.",
        },
        {
          step: "03",
          title: "Sidaynta Lacagta & Sarrifka CNY",
          desc: "Marka ganacsadu xaqiijiyo tayada alaabta, waxaan bixinaa lacagta Yuan-ka Shiinaha (CNY) si dhakhso ah oo sharci ah oo toos ah warshadda.",
        },
      ],
      fraudTitle: "Meesha ka Saar Halista Khiyaanada",
      fraudDesc: "Waligaa ha ka walwalin caqabadaha luuqadda, khaladaadka xawaaladaha bangiyada dibadda, ama khiyaanada warshadaha. Baane Logistics waxay dammaanad qaadaysaa ammaan iyo sharciyad buuxda, iyadoo ilaalisa in ka badan **$12M** oo badeecadaha ganacsatada Soomaaliyeed sanad walba."
    }
  }[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Exchange & Calculator Forms (Left, 3 columns) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Currency Converter */}
        <div className="bg-brand-navy border border-brand-teal/20 p-5 md:p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-display text-sm font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-1 flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            {payT.exTitle}
          </h3>
          <p className="text-xs text-gray-300 mb-4 font-sans leading-relaxed">
            {payT.exDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            {/* USD */}
            <div className="bg-[#030d1a] border border-brand-teal/15 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                {payT.lblUsd}
              </span>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-teal font-bold">$</span>
                <input
                  type="text"
                  value={exchange.usd}
                  onChange={(e) => handleCurrencyChange(e.target.value, "usd")}
                  className="w-full bg-transparent border-none outline-none text-white text-sm font-bold pl-3.5"
                />
              </div>
            </div>

            {/* CNY */}
            <div className="bg-[#030d1a] border border-brand-teal/15 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                {payT.lblCny}
              </span>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold font-bold">¥</span>
                <input
                  type="text"
                  value={exchange.cny}
                  onChange={(e) => handleCurrencyChange(e.target.value, "cny")}
                  className="w-full bg-transparent border-none outline-none text-white text-sm font-bold pl-3.5"
                />
              </div>
            </div>

            {/* SLSH */}
            <div className="bg-[#030d1a] border border-brand-teal/15 p-3.5 rounded-xl">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                {payT.lblSlsh}
              </span>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-teal font-bold">Sl</span>
                <input
                  type="text"
                  value={exchange.slsh}
                  onChange={(e) => handleCurrencyChange(e.target.value, "slsh")}
                  className="w-full bg-transparent border-none outline-none text-white text-sm font-bold pl-5.5"
                />
              </div>
            </div>
          </div>
          <div className="text-[9px] font-mono text-gray-500 mt-2 text-right">
            {payT.reserveInfo}
          </div>
        </div>

        {/* Freight Quote Cost Calculator */}
        <div className="bg-brand-navy border border-brand-teal/20 p-5 md:p-6 rounded-2xl shadow-xl relative">
          <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <Scale className="h-4 w-4 text-brand-teal" />
            {payT.freightTitle}
          </h3>

          <form onSubmit={calculateQuote} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblMode}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalc({ ...calc, serviceType: "Sea Cargo" })}
                    className={`py-2 rounded-xl font-bold uppercase border transition-all ${
                      calc.serviceType === "Sea Cargo"
                        ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                        : "bg-[#030d1a] border-brand-teal/10 text-gray-400 hover:border-brand-teal/30"
                    }`}
                  >
                    {payT.btnSea}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalc({ ...calc, serviceType: "Air Cargo" })}
                    className={`py-2 rounded-xl font-bold uppercase border transition-all ${
                      calc.serviceType === "Air Cargo"
                        ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                        : "bg-[#030d1a] border-brand-teal/10 text-gray-400 hover:border-brand-teal/30"
                    }`}
                  >
                    {payT.btnAir}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblCargo}
                </label>
                <select
                  value={calc.cargoType}
                  onChange={(e) => setCalc({ ...calc, cargoType: e.target.value })}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Electronics">{payT.optElectronics}</option>
                  <option value="Apparel">{payT.optApparel}</option>
                  <option value="Construction">{payT.optConstruction}</option>
                  <option value="General">{payT.optGeneral}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblOrigin}
                </label>
                <select
                  value={calc.origin}
                  onChange={(e) => setCalc({ ...calc, origin: e.target.value })}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Shanghai">{payT.optShanghai}</option>
                  <option value="Shenzhen">{payT.optShenzhen}</option>
                  <option value="Ningbo">{payT.optNingbo}</option>
                  <option value="Guangzhou">{payT.optGuangzhou}</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblDest}
                </label>
                <select
                  value={calc.destination}
                  onChange={(e) => setCalc({ ...calc, destination: e.target.value as any })}
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Berbera Port">{payT.optBerbera}</option>
                  <option value="Hargeisa Hub">{payT.optHargeisa}</option>
                  <option value="Burao Depot">{payT.optBurao}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblWeight}
                </label>
                <input
                  type="text"
                  value={calc.weight}
                  onChange={(e) => setCalc({ ...calc, weight: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  {payT.lblVolume}
                </label>
                <input
                  type="text"
                  value={calc.volume}
                  onChange={(e) => setCalc({ ...calc, volume: e.target.value })}
                  placeholder="e.g. 1.5"
                  className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-teal text-brand-navy hover:bg-[#00bda0] py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300"
            >
              {payT.btnCalc}
            </button>
          </form>

          {/* Calculator Output Readout */}
          {quoteOutput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#030d1a] border border-brand-teal/25 rounded-xl space-y-3"
            >
              <h4 className="font-display text-xs font-extrabold text-brand-gold uppercase tracking-[0.1em] border-b border-brand-teal/10 pb-1.5">
                {payT.resultTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                <div>
                  <span className="text-gray-400 block text-[9px] font-mono uppercase">{payT.resCost}</span>
                  <span className="text-base font-bold text-brand-teal mt-0.5 block">{quoteOutput.cost}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] font-mono uppercase">{payT.resEta}</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{quoteOutput.duration}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] font-mono uppercase">{payT.resIns}</span>
                  <span className="text-xs font-bold text-brand-gold mt-0.5 block">{quoteOutput.insurance}</span>
                </div>
              </div>
              <div className="text-[9px] font-mono text-gray-500 mt-2 leading-relaxed">
                {payT.disclaimer}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Escrow Visual Flow explanation (Right, 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-navy border border-brand-teal/15 p-5 md:p-6 rounded-2xl shadow-xl h-full flex flex-col justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand-teal" />
              {payT.escrowTitle}
            </h4>

            {/* Escrow Steps */}
            <div className="space-y-6 relative border-l border-brand-teal/10 ml-3 pl-6">
              {payT.steps.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Step Number Badge */}
                  <span className="absolute -left-[35px] top-0 h-5 w-5 rounded-full bg-[#030d1a] border border-brand-teal/20 text-brand-teal font-mono text-[9px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <div>
                    <h5 className="font-bold text-white font-sans">{item.title}</h5>
                    <p className="text-[10px] text-gray-300 font-sans leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Certification Seal */}
          <div className="bg-[#031326] border border-brand-gold/20 p-4 rounded-xl mt-6 space-y-2">
            <h5 className="font-display text-[10px] font-extrabold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-brand-gold" />
              {payT.fraudTitle}
            </h5>
            <p className="text-[10px] text-gray-300 font-sans leading-relaxed">
              {payT.fraudDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaymentSection);
