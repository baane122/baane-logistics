import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Ship, Plane, Calendar, MapPin, Thermometer, Droplets, Info, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { TrackingData } from "../types";

const CONVEX_SITE_URL = import.meta.env.VITE_CONVEX_SITE_URL || "https://tangible-husky-835.eu-west-1.convex.site";

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

  const trackT = {
    en: {
      radarTitle: "Unified Cargo Tracking Radar",
      radarDesc: "Enter your Bill of Lading, container serial, or air waybill code. Or try one of our live demo containers below.",
      placeholder: "e.g. BAANE-SEA-8821",
      buttonTrack: "Track Container",
      buttonTracking: "Radar Scanning...",
      activeAssets: "Active Container Assets:",
      errNotFound: "Cargo record not found on the radar network.",
      errFailed: "Failed to locate container. Verify ID code.",
      originTerminal: "Origin Terminal",
      departed: "Departed",
      destinationHub: "Destination Hub",
      expected: "Expected",
      consignmentCargo: "Consignment Cargo",
      grossWeight: "Gross Weight / Vol",
      transportVessel: "Transport Vessel / Flight",
      supplierShipper: "Supplier / Shipper",
      receiverConsignee: "Receiver / Consignee",
      logTimeline: "Electronic Log Timeline",
      activeLocation: "Active Location",
      iotSensors: "Telemetry IoT Sensors",
      internalTemp: "Internal Temp",
      containerCore: "Container Core",
      humidity: "Relative Humidity",
      antiCondensation: "Anti-Condensation",
      satUplink: "Sat-Uplink",
      operational: "● Operational",
      currentRegion: "Current Region",
      lastPing: "Last Ping",
      activeNow: "Active Now",
      doubleShield: "Baane Double Shield",
      shieldDesc: "This shipment has undergone Baane's premium Secure Sourcing and On-Site Factory Quality Inspection checks prior to terminal loading in China. Tamper-evident electronic seals are verified active.",
      auditedSecured: "AUDITED & SECURED",
    },
    so: {
      radarTitle: "Mashiinka Raadraaca Shixnadaha Baane",
      radarDesc: "Geli lambarkaaga raadraaca. Tijaabi lambarada hoos ku qoran si aad u aragto diiwaanka tooska ah.",
      placeholder: "tusaale. BAANE-SEA-8821",
      buttonTrack: "Raadraac Shixnada",
      buttonTracking: "Sawiridda Radar-ka...",
      activeAssets: "Konteynarada Tooska ah:",
      errNotFound: "Shixnada lagama helin diiwaanka radar-ka Baane.",
      errFailed: "Waa la waayay shixnadan. Fadlan hubi lambarka.",
      originTerminal: "Dekedda ay ka Baxday",
      departed: "Baxay",
      destinationHub: "Halka ay ku Socoto",
      expected: "La Filayo",
      consignmentCargo: "Nooca Shixnada",
      grossWeight: "Miisaanka guud",
      transportVessel: "Markabka / Diyaarada",
      supplierShipper: "Warshada / Soo Diraha",
      receiverConsignee: "Halka la gaadhsiinayo",
      logTimeline: "Diiwaanka Socdaalka",
      activeLocation: "Goobta Hadda",
      iotSensors: "Dareemayaasha IoT",
      internalTemp: "Heerkulka Gudaha",
      containerCore: "Heerkulka Konteynarka",
      humidity: "Qoyaanka",
      antiCondensation: "Kahortaga Qoyaanka",
      satUplink: "Khadka Dayax-gacmeedka",
      operational: "● Toos u shaqaynaya",
      currentRegion: "Aagga Hadda",
      lastPing: "Ugu Dambaysay",
      activeNow: "Hadda Toos ah",
      doubleShield: "Gaashaanka Labaad ee Baane",
      shieldDesc: "Shixnadan waxaa lagu sameeyay baadhitaanka tayada ee Sourcing Sugan iyo Kormeerka Warshada ee goobta.",
      auditedSecured: "LA HUBIYAY & WAA AMMAAN",
    }
  }[lang];

  const handleSearch = async (id: string) => {
    const targetId = id.trim();
    if (!targetId) return;

    setLoading(true);
    setError("");

    try {
      // Use Convex HTTP action URL (proxied in dev via Vite)
      const res = await fetch(`/api/tracking/${targetId}`);
      if (!res.ok) {
        throw new Error(trackT.errNotFound);
      }
      const data = await res.json();

      // Map to TrackingData interface
      const track: TrackingData = {
        id: data.id || data.trackingId || targetId,
        type: data.type || "Sea Cargo",
        carrier: data.carrier || "Baane Logistics",
        vessel: data.vessel || "BAANE VESSEL",
        origin: data.origin || "China",
        destination: data.destination || "Somaliland",
        status: data.status || "Processing",
        progress: data.progress || 0,
        metrics: data.metrics || { temperature: "21.5°C", humidity: "48%", status: "Nominal" },
        departureDate: data.departureDate || "2026-06-20",
        arrivalDate: data.arrivalDate || "2026-07-15",
        shipper: data.shipper || "Sourcing Partner",
        consignee: data.consignee || "Client",
        cargoDetails: data.cargoDetails || "Commercial Cargo",
        weight: data.weight || "0 kg",
        currentLocation: data.currentLocation || "In Transit",
        route: data.route || [],
      };

      onSelectTrack(track);
    } catch (err: any) {
      setError(err.message || trackT.errFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-brand-navy border border-brand-teal/20 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <h4 className="font-display text-sm font-extrabold text-white mb-1">{trackT.radarTitle}</h4>
        <p className="text-[11px] text-gray-400 mb-4">{trackT.radarDesc}</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId)}
              placeholder={trackT.placeholder}
              className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-teal transition-all"
              disabled={loading}
            />
          </div>
          <button
            onClick={() => handleSearch(searchId)}
            disabled={loading}
            className="bg-brand-teal text-brand-navy px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00bda0] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="h-3.5 w-3.5 rounded-full border-2 border-brand-navy border-t-transparent animate-spin" /> {trackT.buttonTracking}</>
            ) : (
              <><Ship className="h-4 w-4" /> {trackT.buttonTrack}</>
            )}
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3 text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-xl text-[11px] font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </motion.div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{trackT.activeAssets}</span>
          {presetTracks.map((id) => (
            <button key={id}
              onClick={() => { setSearchId(id); handleSearch(id); }}
              className="text-[10px] font-mono text-brand-teal bg-brand-teal/5 border border-brand-teal/20 hover:bg-brand-teal/10 px-2.5 py-1 rounded-lg transition-all"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Track Results */}
      {activeTrack && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Column 1: Cargo Details & Timeline (takes 3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Cargo Info Cards */}
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

            {/* Timeline */}
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
                      {point.status !== "Pending" && (
                        <span className={`text-[9px] font-mono ml-2 ${
                          point.status === "Completed" ? "text-green-400" : "text-brand-teal"
                        }`}>
                          {trackT.activeLocation}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-gray-200 block mt-0.5">
                        Date: {point.date} • {point.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: IoT Sensors & Security */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 bg-brand-teal/5 rounded-full blur-2xl pointer-events-none" />
              
              <h4 className="font-display text-xs font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-4">
                {trackT.iotSensors}
              </h4>

              <div className="space-y-4">
                <div className="bg-[#030d1a] border border-brand-teal/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 border border-orange-500/20">
                      <Thermometer className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-200 uppercase tracking-wider">{trackT.internalTemp}</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{trackT.containerCore}</span>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-white">
                    {activeTrack.metrics.temperature}
                  </span>
                </div>

                <div className="bg-[#030d1a] border border-brand-teal/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 border border-blue-500/20">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-200 uppercase tracking-wider">{trackT.humidity}</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{trackT.antiCondensation}</span>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-white">
                    {activeTrack.metrics.humidity}
                  </span>
                </div>

                <div className="bg-[#030d1a] border border-brand-teal/10 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-gray-300">
                    <span>{trackT.satUplink}:</span>
                    <span className="text-green-400 font-bold">{trackT.operational}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-300">
                    <span>{trackT.currentRegion}:</span>
                    <span className="text-white font-semibold truncate max-w-[120px]">{activeTrack.currentLocation}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-300">
                    <span>{trackT.lastPing}:</span>
                    <span className="text-white">{trackT.activeNow}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#031326] border border-brand-teal/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <h4 className="font-display text-xs font-extrabold text-brand-gold uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                {trackT.doubleShield}
              </h4>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {trackT.shieldDesc}
              </p>
              <div className="mt-3 inline-block bg-brand-gold/10 border border-brand-gold/30 rounded px-2 py-0.5 font-mono text-[9px] text-brand-gold font-bold">
                {trackT.auditedSecured}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(TrackingSection);
