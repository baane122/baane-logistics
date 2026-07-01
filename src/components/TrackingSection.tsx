import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Ship, Plane, Calendar, MapPin, Thermometer, Droplets, Info, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { TrackingData } from "../types";

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
      radarDesc: "Input your custom Bill of Lading, container serial, or air waybill code. Try our live demo container assets below.",
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
      radarDesc: "Geli lambarkaaga raadraaca (Bill of Lading, Konteynar ama Air Waybill). Tijaabi lambarada hoos ku qoran si aad u aragto diiwaanka tooska ah.",
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
      grossWeight: "Miisaanka guud / Mugga",
      transportVessel: "Markabka / Diyaarada",
      supplierShipper: "Warshada / Soo Diraha",
      receiverConsignee: "Halka la gaadhsiinayo",
      logTimeline: "Diiwaanka Socdaalka Tooska ah",
      activeLocation: "Goobta Hadda",
      iotSensors: "Dareemayaasha IoT Telemetry",
      internalTemp: "Heerkulka Gudaha",
      containerCore: "Heerkulka Konteynarka",
      humidity: "Heerka Qoyaanka",
      antiCondensation: "Kahortaga Qoyaanka",
      satUplink: "Khadka Dayax-gacmeedka",
      operational: "● Toos u shaqaynaya",
      currentRegion: "Aagga Hadda",
      lastPing: "Ugu Dambaysay",
      activeNow: "Hadda Toos ah",
      doubleShield: "Gaashaanka Labaad ee Baane",
      shieldDesc: "Shixnadan waxaa lagu sameeyay baadhitaanka tayada ee Sourcing Sugan iyo Kormeerka Warshada ee goobta ka hor intaan laga soo ririn Shiinaha. Shamiitada elektaroonigga ah waa mid ammaan ah.",
      auditedSecured: "LA HUBIYAY & WAA AMMAAN",
    }
  }[lang];

  const handleSearch = async (id: string) => {
    const targetId = id.trim();
    if (!targetId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tracking/${targetId}`);
      if (!res.ok) {
        throw new Error(trackT.errNotFound);
      }
      const data = await res.json();
      onSelectTrack(data);
    } catch (err: any) {
      setError(err.message || trackT.errFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar / Radar Control Console */}
      <div className="bg-brand-navy border border-brand-teal/20 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <h4 className="font-display text-sm font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-1">
          {trackT.radarTitle}
        </h4>
        <p className="text-xs text-gray-300 mb-4 font-sans leading-relaxed">
          {trackT.radarDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-teal opacity-60" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={trackT.placeholder}
              className="w-full bg-[#030d1a] border border-brand-teal/25 rounded-xl py-3 pl-10 pr-4 text-white text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId)}
            />
          </div>
          <button
            onClick={() => handleSearch(searchId)}
            disabled={loading}
            className="bg-brand-teal text-brand-navy hover:bg-[#00bda0] disabled:bg-gray-700 font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all duration-300"
          >
            {loading ? trackT.buttonTracking : trackT.buttonTrack}
          </button>
        </div>

        {/* Quick presets buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-brand-teal/10">
          <span className="font-mono text-[10px] text-gray-200 uppercase tracking-wider mr-2">
            {trackT.activeAssets}
          </span>
          {presetTracks.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setSearchId(preset);
                handleSearch(preset);
              }}
              className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeTrack?.id === preset
                  ? "bg-brand-teal/10 border-brand-teal text-brand-teal font-semibold"
                  : "bg-brand-navy/60 border-brand-teal/15 text-gray-300 hover:border-brand-teal/40 hover:text-white"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Error readout */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-900/40 p-3 rounded-lg text-xs font-mono"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </div>

      {/* Cargo Details Readout Panel */}
      {activeTrack && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Column 1: Core Shipment Manifest */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-brand-teal/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-teal/10 p-2.5 rounded-xl border border-brand-teal/20">
                    {activeTrack.type === "Air Cargo" ? (
                      <Plane className="h-5 w-5 text-brand-teal" />
                    ) : (
                      <Ship className="h-5 w-5 text-brand-teal" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white leading-tight">
                      {activeTrack.id}
                    </h3>
                    <p className="text-[10px] font-mono text-brand-teal uppercase tracking-widest mt-0.5">
                      {activeTrack.type} • {activeTrack.carrier}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  activeTrack.status === "Delivered"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-brand-gold/10 border-brand-gold/30 text-brand-gold animate-pulse"
                }`}>
                  {activeTrack.status}
                </span>
              </div>

              {/* Grid data elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5 bg-[#030d1a] p-3 rounded-xl border border-brand-teal/10">
                  <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono text-gray-200 uppercase tracking-wider block">{trackT.originTerminal}</span>
                    <span className="text-xs font-bold text-white">{activeTrack.origin}</span>
                    <span className="text-[10px] text-gray-300 block font-mono mt-0.5">{trackT.departed}: {activeTrack.departureDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#030d1a] p-3 rounded-xl border border-brand-teal/10">
                  <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono text-gray-200 uppercase tracking-wider block">{trackT.destinationHub}</span>
                    <span className="text-xs font-bold text-brand-gold">{activeTrack.destination}</span>
                    <span className="text-[10px] text-gray-300 block font-mono mt-0.5">{trackT.expected}: {activeTrack.arrivalDate}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Spec Lists */}
              <div className="border-t border-brand-teal/10 pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 flex items-center gap-1.5 font-sans">
                    <Layers className="h-3.5 w-3.5 text-brand-teal" />
                    {trackT.consignmentCargo}
                  </span>
                  <span className="text-white font-medium text-right font-sans max-w-[200px] truncate">
                    {activeTrack.cargoDetails}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 font-sans">{trackT.grossWeight}</span>
                  <span className="text-white font-mono font-medium">{activeTrack.weight}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 font-sans">{trackT.transportVessel}</span>
                  <span className="text-brand-teal font-medium font-sans">{activeTrack.vessel}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 font-sans">{trackT.supplierShipper}</span>
                  <span className="text-white font-sans truncate max-w-[180px]">{activeTrack.shipper}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 font-sans">{trackT.receiverConsignee}</span>
                  <span className="text-white font-sans truncate max-w-[180px]">{activeTrack.consignee}</span>
                </div>
              </div>
            </div>

            {/* Checkpoints timeline list */}
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl">
              <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-brand-teal" />
                {trackT.logTimeline}
              </h4>

              <div className="relative border-l border-brand-teal/15 ml-3 pl-6 space-y-6">
                {activeTrack.route.map((point, index) => {
                  const isCompleted = point.status === "Completed";
                  const isCurrent = point.status === "In Progress";
                  
                  return (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
                          ? "bg-brand-teal border-brand-teal text-brand-navy"
                          : isCurrent
                          ? "bg-brand-navy border-brand-teal text-brand-teal animate-pulse"
                          : "bg-brand-navy border-gray-600 text-gray-600"
                      }`}>
                        {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            isCompleted ? "text-white" : isCurrent ? "text-brand-teal" : "text-gray-500"
                          }`}>
                            {point.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[8px] font-mono bg-brand-teal/10 text-brand-teal px-1.5 py-0.5 rounded-md uppercase tracking-wider font-bold animate-pulse">
                              {trackT.activeLocation}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-gray-200 block mt-0.5">
                          Date: {point.date} • {point.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: IoT Live Environment Metrics */}
          <div className="space-y-6">
            <div className="bg-brand-navy border border-brand-teal/15 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 bg-brand-teal/5 rounded-full blur-2xl pointer-events-none" />
              
              <h4 className="font-display text-xs font-extrabold text-brand-teal uppercase tracking-[0.15em] mb-4">
                {trackT.iotSensors}
              </h4>

              <div className="space-y-4">
                {/* Temperature Sensor */}
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

                {/* Humidity Sensor */}
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

                {/* Logistics Radar Ping info */}
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

            {/* Security Seal Verification Card */}
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
