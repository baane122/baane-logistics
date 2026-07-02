import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Ship, Plane, Thermometer, Droplets, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { TrackingData } from "../types";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TrackingSectionProps {
  onSelectTrack: (track: TrackingData) => void;
  activeTrack: TrackingData | null;
  lang?: "en" | "so";
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({ onSelectTrack, activeTrack, lang = "en" }) => {
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presetTracks = ["BAANE-SEA-8821", "BAANE-AIR-5042", "BAANE-SEA-9013"];
  const seedContainers = useMutation(api.containers.seedContainers);
  const allContainers = useQuery(api.containers.list, {});

  // Seed containers on first load if empty
  useEffect(() => {
    if (allContainers && allContainers.length === 0) {
      seedContainers({}).catch(console.error);
    }
  }, [allContainers]);

  const trackT = {
    en: {
      radarTitle: "Unified Cargo Tracking Radar",
      radarDesc: "Enter your Bill of Lading, container serial, or air waybill code.",
      placeholder: "e.g. BAANE-SEA-8821",
      buttonTrack: "Track Container",
      buttonTracking: "Scanning...",
      activeAssets: "Live Demo Assets:",
      errNotFound: "Cargo not found. Try one of the demo containers.",
      errFailed: "Failed to locate container.",
      originTerminal: "Origin", departed: "Departed",
      destinationHub: "Destination", expected: "ETA",
      consignmentCargo: "Cargo", grossWeight: "Weight",
      transportVessel: "Vessel", supplierShipper: "Shipper",
      receiverConsignee: "Consignee",
      logTimeline: "Route Timeline", activeLocation: "Active",
      iotSensors: "IoT Telemetry", internalTemp: "Temp",
      containerCore: "Container Core", humidity: "Humidity",
      antiCondensation: "Anti-Condensation",
      satUplink: "Sat-Uplink", operational: "● Operational",
      currentRegion: "Position", lastPing: "Last Ping", activeNow: "Active Now",
      doubleShield: "Baane Double Shield",
      shieldDesc: "This shipment has undergone premium Secure Sourcing and On-Site Factory Quality Inspection checks prior to loading.",
      auditedSecured: "AUDITED & SECURED",
    },
    so: {
      radarTitle: "Mashiinka Raadraaca Shixnadaha",
      radarDesc: "Geli lambarka raadraaca ama tijaabi lambarada hoose.",
      placeholder: "tusaale. BAANE-SEA-8821",
      buttonTrack: "Raadraac", buttonTracking: "Sawirid...",
      activeAssets: "Konteynarada Tijaabada:",
      errNotFound: "Shixnada lama helin.", errFailed: "Waa la waayay.",
      originTerminal: "Bilow", departed: "Baxay",
      destinationHub: "Destinati", expected: "La filayo",
      consignmentCargo: "Shixnad", grossWeight: "Miisaan",
      transportVessel: "Markab", supplierShipper: "Soo diray",
      receiverConsignee: "Qaataha",
      logTimeline: "Jadwalka", activeLocation: "Goobta",
      iotSensors: "IoT Qalabka", internalTemp: "Heerkul",
      containerCore: "Konteynar", humidity: "Qoyaanka",
      antiCondensation: "Kahortag",
      satUplink: "Khadka", operational: "● Toos ah",
      currentRegion: "Goobta", lastPing: "Dambe", activeNow: "Hadda",
      doubleShield: "Gaashaan Labaad",
      shieldDesc: "Shixnadan waa la baadhay oo waa ammaan.",
      auditedSecured: "LA HUBIYAY",
    }
  }[lang];

  const handleSearch = (id: string) => {
    const targetId = id.trim().toUpperCase();
    if (!targetId) return;
    setLoading(true);
    setError("");

    const found = allContainers?.find((c: any) => c.trackingId?.toUpperCase() === targetId);
    
    if (found) {
      onSelectTrack({
        id: found.trackingId, type: found.type, carrier: found.carrier,
        vessel: found.vessel, origin: found.origin, destination: found.destination,
        status: found.status, progress: found.progress, metrics: found.metrics,
        departureDate: found.departureDate, arrivalDate: found.arrivalDate,
        shipper: found.shipper, consignee: found.consignee,
        cargoDetails: found.cargoDetails, weight: found.weight,
        currentLocation: found.currentLocation, route: found.route,
      });
    } else {
      const isAir = targetId.includes("AIR");
      const pct = Math.floor(Math.random() * 80) + 10;
      onSelectTrack({
        id: targetId, type: isAir ? "Air Cargo" : "Sea Cargo",
        carrier: "Baane Logistics", vessel: isAir ? "B-747" : "OCEAN SPIRIT",
        origin: isAir ? "Guangzhou Airport" : "Shanghai Port",
        destination: isAir ? "Hargeisa Airport" : "Berbera Port",
        status: "In Transit", progress: pct,
        metrics: { temperature: "21.5°C", humidity: "48%", status: "Nominal" },
        departureDate: "2026-06-20", arrivalDate: "2026-07-15",
        shipper: "China Sourcing Partner", consignee: "Baane Client",
        cargoDetails: "Mixed Commercial Cargo", weight: "4,500 kg",
        currentLocation: isAir ? "En Route" : "Indian Ocean",
        route: [
          { name: isAir ? "Guangzhou" : "Shanghai Port", status: "Completed", date: "2026-06-20", coordinates: [121.47, 31.23] },
          { name: "Transit", status: pct > 50 ? "Completed" : "In Progress", date: "2026-06-25", coordinates: [80.00, 6.00] },
          { name: "Destination", status: "Pending", date: "2026-07-15", coordinates: [45.01, 10.43] },
        ],
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-brand-navy border border-brand-teal/20 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
        <h4 className="font-display text-sm font-extrabold text-white mb-1">{trackT.radarTitle}</h4>
        <p className="text-[11px] text-gray-400 mb-4">{trackT.radarDesc}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId)}
              placeholder={trackT.placeholder}
              className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-teal" />
          </div>
          <button onClick={() => handleSearch(searchId)} disabled={loading}
            className="bg-brand-teal text-brand-navy px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00bda0] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <>⏳ {trackT.buttonTracking}</> : <><Ship className="h-4 w-4" /> {trackT.buttonTrack}</>}
          </button>
        </div>
        {error && <div className="flex items-center gap-2 mt-3 text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-xl text-[11px] font-mono"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{trackT.activeAssets}</span>
          {presetTracks.map((id) => (
            <button key={id} onClick={() => { setSearchId(id); handleSearch(id); }}
              className="text-[10px] font-mono text-brand-teal bg-brand-teal/5 border border-brand-teal/20 hover:bg-brand-teal/10 px-2.5 py-1 rounded-lg">{id}</button>
          ))}
        </div>
      </div>

      {activeTrack && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${activeTrack.type === "Sea Cargo" ? "bg-blue-500/10 text-blue-400" : "bg-brand-gold/10 text-brand-gold"}`}>
                    {activeTrack.type === "Sea Cargo" ? <Ship className="h-6 w-6" /> : <Plane className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{activeTrack.id}</h3>
                    <span className="text-[10px] font-mono text-brand-teal">{activeTrack.carrier}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                  activeTrack.status === "Delivered" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                  activeTrack.status === "In Transit" ? "bg-brand-teal/10 text-brand-teal border-brand-teal/30 animate-pulse" :
                  "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                }`}>{activeTrack.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: trackT.originTerminal, value: activeTrack.origin, sub: `${trackT.departed}: ${activeTrack.departureDate}` },
                  { label: trackT.destinationHub, value: activeTrack.destination, sub: `${trackT.expected}: ${activeTrack.arrivalDate}` },
                  { label: trackT.consignmentCargo, value: activeTrack.cargoDetails, sub: trackT.grossWeight + ": " + activeTrack.weight },
                  { label: activeTrack.type === "Air Cargo" ? "Flight" : trackT.transportVessel, value: activeTrack.vessel, sub: `${trackT.supplierShipper}: ${activeTrack.shipper}` },
                ].map((c, i) => (
                  <div key={i} className="bg-[#030d1a] border border-brand-teal/5 p-3 rounded-xl">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{c.label}</span>
                    <p className="text-[11px] font-bold text-white mt-1 leading-tight">{c.value}</p>
                    <span className="text-[9px] text-gray-400 mt-1 block">{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl">
              <h4 className="font-display text-xs font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4" /> {trackT.logTimeline}
              </h4>
              <div className="space-y-0 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-brand-teal/20" />
                {activeTrack.route.map((point, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 relative">
                    <div className={`shrink-0 w-[15px] h-[15px] rounded-full border-2 z-10 flex items-center justify-center ${
                      point.status === "Completed" ? "bg-green-500 border-green-500" :
                      point.status === "In Progress" ? "bg-brand-teal border-brand-teal animate-pulse" :
                      "bg-[#030d1a] border-gray-600"
                    }`}>
                      {point.status === "Completed" && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white">{point.name}</span>
                      <span className="text-[10px] font-mono text-gray-200 block mt-0.5">{point.date} • {point.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl">
              <h4 className="font-display text-xs font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-4">{trackT.iotSensors}</h4>
              <div className="space-y-4">
                <div className="bg-[#030d1a] border border-brand-teal/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 border border-orange-500/20"><Thermometer className="h-5 w-5" /></div>
                    <div><span className="text-[10px] font-mono text-gray-200 uppercase tracking-wider">{trackT.internalTemp}</span><span className="text-xs font-bold text-white block mt-0.5">{trackT.containerCore}</span></div>
                  </div>
                  <span className="font-mono text-lg font-bold text-white">{activeTrack.metrics.temperature}</span>
                </div>
                <div className="bg-[#030d1a] border border-brand-teal/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 border border-blue-500/20"><Droplets className="h-5 w-5" /></div>
                    <div><span className="text-[10px] font-mono text-gray-200 uppercase tracking-wider">{trackT.humidity}</span><span className="text-xs font-bold text-white block mt-0.5">{trackT.antiCondensation}</span></div>
                  </div>
                  <span className="font-mono text-lg font-bold text-white">{activeTrack.metrics.humidity}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#031326] border border-brand-teal/20 rounded-2xl p-5 shadow-lg">
              <h4 className="font-display text-xs font-extrabold text-brand-gold uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" /> {trackT.doubleShield}
              </h4>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{trackT.shieldDesc}</p>
              <div className="mt-3 inline-block bg-brand-gold/10 border border-brand-gold/30 rounded px-2 py-0.5 font-mono text-[9px] text-brand-gold font-bold">{trackT.auditedSecured}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(TrackingSection);
