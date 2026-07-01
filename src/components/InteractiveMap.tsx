import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ship, Plane, Compass, MapPin, Activity, Anchor, Globe } from "lucide-react";

interface InteractiveMapProps {
  activeTrackingId?: string;
  activeRouteProgress?: number; // 0 to 100
  routeType?: "Sea Cargo" | "Air Cargo" | null;
  lang?: "en" | "so";
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activeTrackingId,
  activeRouteProgress = null,
  routeType = null,
  lang = "en",
}) => {
  const [selectedRoute, setSelectedRoute] = useState<"sea" | "air">("sea");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Local translations for the interactive map
  const mapT = {
    en: {
      navSystem: "Baane Navigation Radar v4.2",
      routeIntel: "Global Cargo Route Intelligence",
      seaRoute: "Sea Cargo Route",
      airRoute: "Air Express Route",
      departure: "Departure Point",
      discharge: "Discharge Terminal",
      transitDur: "Transit Duration",
      trackingStatus: "Tracking Status",
      radarUplink: "Active Radar Uplink",
      progress: "PROGRESS",
      shanghai: "Shanghai Port",
      shanghaiInfo: "Key East-China Marine Hub",
      yiwu: "Yiwu Cargo Airport / Warehouse",
      yiwuInfo: "The World's Commodity Capital",
      shenzhen: "Shenzhen Shekou Port",
      shenzhenInfo: "South China Logistics Gate",
      malacca: "Strait of Malacca Checkpoint",
      malaccaInfo: "Critical Maritime Chokepoint",
      colombo: "Indian Ocean Gateway (Colombo)",
      colomboInfo: "Transshipment Hub",
      indianOcean: "Central Indian Ocean Transit",
      indianOceanInfo: "Open Ocean Maritime Route",
      gulfOfAden: "Gulf of Aden Safety Corridor",
      gulfOfAdenInfo: "Highly Secured Transit Lane",
      berbera: "Port of Berbera",
      berberaInfo: "Somaliland Premium Container Terminal",
      hargeisa: "Hargeisa Hub & Customs",
      hargeisaInfo: "Baane Logistics Head Office",
      daysSea: "20 - 28 Days",
      daysAir: "3 - 6 Days Express",
    },
    so: {
      navSystem: "Radar-ka Sahaminta Baane v4.2",
      routeIntel: "Xogta Marinnada Shixnadaha Caalamiga",
      seaRoute: "Khadka Badda (Markab)",
      airRoute: "Khadka Cirka (Diyaarad)",
      departure: "Goobta Shixnad-ka Baxayso",
      discharge: "Halka la Dhigayo",
      transitDur: "Muddada Safarka",
      trackingStatus: "Heerka Raadraaca",
      radarUplink: "Raadraaca Tooska ah oo Furan",
      progress: "HORUMARKA",
      shanghai: "Dekedda Shanghai",
      shanghaiInfo: "Xarunta weyn ee Marinnada Bariga Shiinaha",
      yiwu: "Madaarka & Bakhaarka Yiwu",
      yiwuInfo: "Xarunta Ganacsiga Caalamiga ah ee Yiwu",
      shenzhen: "Dekedda Shenzhen Shekou",
      shenzhenInfo: "Albaabka Logistics ee Koonfurta Shiinaha",
      malacca: "Gudubka Marinka Malacca",
      malaccaInfo: "Marin muhiim u ah marinnada badda adduunka",
      colombo: "Xarunta Badweynta Hindiya (Colombo)",
      colomboInfo: "Xarunta weyn ee Isku-Xidhka Shixnadaha",
      indianOcean: "Gudubka Badweynta Hindiya",
      indianOceanInfo: "Waddada Marinka Badda ee furan",
      gulfOfAden: "Marinka Amniga ee Gacanka Cadmeed",
      gulfOfAdenInfo: "Waddada amnigeeda aadka loo adkeeyay",
      berbera: "Dekedda Caalamiga ee Berbera",
      berberaInfo: "Konteynarada Casriga ah ee Somaliland",
      hargeisa: "Xafiiska Kastamka Hargeysa",
      hargeisaInfo: "Xafiiska Guud ee Baane Logistics",
      daysSea: "20 - 28 Maalmood",
      daysAir: "3 - 6 Maalmood Express",
    },
  }[lang];

  // Sync route selection with external active container tracking
  useEffect(() => {
    if (routeType === "Air Cargo") {
      setSelectedRoute("air");
    } else if (routeType === "Sea Cargo") {
      setSelectedRoute("sea");
    }
  }, [routeType]);

  // Coordinate mapping for our schematic map (SVG dimensions: 800 x 400)
  const locations = {
    // China Ports
    Shanghai: { x: 720, y: 130, name: mapT.shanghai, info: mapT.shanghaiInfo },
    Yiwu: { x: 700, y: 155, name: mapT.yiwu, info: mapT.yiwuInfo },
    Shenzhen: { x: 670, y: 180, name: mapT.shenzhen, info: mapT.shenzhenInfo },
    
    // Checkpoints en route
    Malacca: { x: 580, y: 290, name: mapT.malacca, info: mapT.malaccaInfo },
    Colombo: { x: 440, y: 270, name: mapT.colombo, info: mapT.colomboInfo },
    IndianOcean: { x: 330, y: 250, name: mapT.indianOcean, info: mapT.indianOceanInfo },
    GulfOfAden: { x: 200, y: 210, name: mapT.gulfOfAden, info: mapT.gulfOfAdenInfo },
    
    // Somaliland Targets
    Berbera: { x: 135, y: 220, name: mapT.berbera, info: mapT.berberaInfo },
    Hargeisa: { x: 95, y: 245, name: mapT.hargeisa, info: mapT.hargeisaInfo },
  };

  // SVG Paths
  const seaRoutePath = `M ${locations.Shanghai.x} ${locations.Shanghai.y} 
                       Q 690 200, ${locations.Shenzhen.x} ${locations.Shenzhen.y} 
                       Q 640 250, ${locations.Malacca.x} ${locations.Malacca.y} 
                       Q 500 300, ${locations.Colombo.x} ${locations.Colombo.y}
                       Q 380 270, ${locations.IndianOcean.x} ${locations.IndianOcean.y}
                       Q 260 215, ${locations.GulfOfAden.x} ${locations.GulfOfAden.y}
                       Q 160 210, ${locations.Berbera.x} ${locations.Berbera.y}
                       L ${locations.Hargeisa.x} ${locations.Hargeisa.y}`;

  const airRoutePath = `M ${locations.Yiwu.x} ${locations.Yiwu.y} 
                       Q 520 120, ${locations.Colombo.x} ${locations.Colombo.y - 120} 
                       Q 300 130, ${locations.Hargeisa.x} ${locations.Hargeisa.y}`;

  // Calculate current ship/plane coordinates based on active cargo tracking progress
  const getCoordinatesAlongPath = (progress: number, route: "sea" | "air") => {
    // Approximate coordinate calculation along bezier curve
    const t = progress / 100;
    if (route === "sea") {
      // Linear segments interpolation for visualization
      const x = locations.Shanghai.x + (locations.Hargeisa.x - locations.Shanghai.x) * t;
      // Curve simulation
      let y = locations.Shanghai.y + (locations.Hargeisa.y - locations.Shanghai.y) * t;
      if (t > 0.1 && t < 0.8) {
        y += Math.sin(t * Math.PI) * 110; // Bow downward for maritime path
      }
      return { x, y };
    } else {
      const x = locations.Yiwu.x + (locations.Hargeisa.x - locations.Yiwu.x) * t;
      const y = locations.Yiwu.y + (locations.Hargeisa.y - locations.Yiwu.y) * t - Math.sin(t * Math.PI) * 100; // Arced flight path
      return { x, y };
    }
  };

  const currentTrackerPos = activeRouteProgress !== null ? getCoordinatesAlongPath(activeRouteProgress, selectedRoute) : null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#030d1a] border border-[#00d4aa]/20 p-4 md:p-6 shadow-2xl">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d4aa_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,170,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,170,0.05)_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* Futuristic Tactical Overlay */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 border-b border-[#00d4aa]/15 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-teal animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-teal font-bold">
              {mapT.navSystem}
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white mt-1">
            {mapT.routeIntel}
          </h3>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-brand-navy/60 p-1 border border-brand-teal/20 rounded-lg">
          <button
            onClick={() => setSelectedRoute("sea")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedRoute === "sea"
                ? "bg-brand-teal text-brand-navy shadow-lg shadow-brand-teal/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Ship className="h-3.5 w-3.5" />
            {mapT.seaRoute}
          </button>
          <button
            onClick={() => setSelectedRoute("air")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedRoute === "air"
                ? "bg-brand-teal text-brand-navy shadow-lg shadow-brand-teal/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            {mapT.airRoute}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full aspect-[2/1] min-h-[300px] overflow-x-auto md:overflow-x-visible">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full min-w-[700px] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tactical Circular Radar Grid */}
          <circle cx="115" cy="235" r="120" stroke="#00d4aa" strokeWidth="1" strokeDasharray="4 8" className="opacity-15" />
          <circle cx="115" cy="235" r="60" stroke="#00d4aa" strokeWidth="1" strokeDasharray="2 4" className="opacity-10" />
          <circle cx="710" cy="140" r="100" stroke="#00d4aa" strokeWidth="1" strokeDasharray="4 8" className="opacity-15" />

          {/* Sweeping Radar Line */}
          <g transform="translate(115, 235)">
            <line x1="0" y1="0" x2="85" y2="85" stroke="#00d4aa" strokeWidth="1.5" className="origin-center animate-[spin_8s_linear_infinite] opacity-40" />
          </g>
          <g transform="translate(710, 140)">
            <line x1="0" y1="0" x2="70" y2="-70" stroke="#00d4aa" strokeWidth="1.5" className="origin-center animate-[spin_12s_linear_infinite] opacity-30" />
          </g>

          {/* Dotted Lines representing latitude coordinates */}
          <line x1="0" y1="100" x2="800" y2="100" stroke="#00d4aa" strokeWidth="1" strokeDasharray="10 20" className="opacity-5" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#00d4aa" strokeWidth="1" strokeDasharray="10 20" className="opacity-5" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#00d4aa" strokeWidth="1" strokeDasharray="10 20" className="opacity-5" />

          {/* Abstract continent shapes (highly stylized neon grids for sci-fi look) */}
          {/* Somaliland / Horn of Africa */}
          <path
            d="M 10 180 Q 50 160, 90 190 Q 130 195, 140 210 Q 150 230, 130 250 Q 110 260, 80 270 Q 50 290, 40 330 Q 30 360, 10 380 Z"
            fill="rgba(0, 212, 170, 0.02)"
            stroke="rgba(0, 212, 170, 0.1)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* South Asia & India */}
          <path
            d="M 330 150 Q 370 180, 410 200 Q 425 240, 435 260 Q 440 270, 445 260 Q 455 240, 465 210 Q 490 190, 520 180 Z"
            fill="rgba(0, 212, 170, 0.02)"
            stroke="rgba(0, 212, 170, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* East China Coastline */}
          <path
            d="M 620 110 Q 660 120, 680 130 Q 720 120, 750 110 Q 780 130, 790 180 Q 760 210, 740 250 Q 700 280, 660 310"
            fill="rgba(0, 212, 170, 0.02)"
            stroke="rgba(0, 212, 170, 0.1)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Render Route Paths */}
          {/* Base inactive shadow route */}
          <path
            d={selectedRoute === "sea" ? seaRoutePath : airRoutePath}
            fill="none"
            stroke="#0A2540"
            strokeWidth="5"
            className="opacity-60"
          />
          {/* Active Glowing Route Path */}
          <motion.path
            d={selectedRoute === "sea" ? seaRoutePath : airRoutePath}
            fill="none"
            stroke={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"}
            strokeWidth="2.5"
            initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="opacity-40"
          />

          {/* Active Flowing Cargo Pulse Line - Creates the real-time telemetry flow animation */}
          <motion.path
            d={selectedRoute === "sea" ? seaRoutePath : airRoutePath}
            fill="none"
            stroke={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"}
            strokeWidth="3.5"
            strokeDasharray="20 40"
            animate={{ strokeDashoffset: [0, -180] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 5,
            }}
            className="opacity-90 filter drop-shadow-[0_0_5px_rgba(0,212,170,0.5)]"
          />

          {/* RENDER CHECKPOINT CHECKPOINTS */}
          {selectedRoute === "sea" && (
            <>
              {/* Sea route checkpoints */}
              {[
                { key: "Shanghai", data: locations.Shanghai, icon: Anchor },
                { key: "Shenzhen", data: locations.Shenzhen, icon: Anchor },
                { key: "Malacca", data: locations.Malacca },
                { key: "Colombo", data: locations.Colombo },
                { key: "IndianOcean", data: locations.IndianOcean },
                { key: "GulfOfAden", data: locations.GulfOfAden },
                { key: "Berbera", data: locations.Berbera, icon: Anchor, isTarget: true },
                { key: "Hargeisa", data: locations.Hargeisa, isTarget: true },
              ].map((node) => {
                const Icon = node.icon;
                const isHovered = hoveredNode === node.key;
                const strokeColor = node.isTarget ? "#D4AF37" : "#00D4AA";
                
                return (
                  <g
                    key={node.key}
                    transform={`translate(${node.data.x}, ${node.data.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.key)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Ring Pulse */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered ? "14" : "8"}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      className="opacity-60 animate-ping"
                    />
                    {/* Solid outer ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered ? "10" : "6"}
                      fill="#030d1a"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    {/* Inner core */}
                    <circle
                      cx="0"
                      cy="0"
                      r="3"
                      fill={strokeColor}
                    />
                    {/* Hover text label */}
                    <text
                      y="-16"
                      textAnchor="middle"
                      fill={isHovered ? "#00D4AA" : "rgba(255, 255, 255, 0.88)"}
                      fontFamily="Inter, sans-serif"
                      fontWeight={isHovered ? "bold" : "600"}
                      fontSize={isHovered ? "10" : "8"}
                      className="tracking-wider select-none font-mono"
                    >
                      {node.data.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {selectedRoute === "air" && (
            <>
              {/* Air route checkpoints */}
              {[
                { key: "Yiwu", data: locations.Yiwu },
                { key: "Hargeisa", data: locations.Hargeisa, isTarget: true },
              ].map((node) => {
                const isHovered = hoveredNode === node.key;
                const strokeColor = node.isTarget ? "#D4AF37" : "#00D4AA";
                
                return (
                  <g
                    key={node.key}
                    transform={`translate(${node.data.x}, ${node.data.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.key)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered ? "16" : "10"}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      className="opacity-40 animate-ping"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered ? "12" : "7"}
                      fill="#030d1a"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="4"
                      fill={strokeColor}
                    />
                    <text
                      y="-18"
                      textAnchor="middle"
                      fill={isHovered ? "#D4AF37" : "rgba(255, 255, 255, 0.9)"}
                      fontFamily="Inter, sans-serif"
                      fontWeight="bold"
                      fontSize="9"
                      className="tracking-wider select-none font-mono"
                    >
                      {node.data.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* ACTIVE CONTAINER SHIP / PLANE ICON ANIMATION */}
          {currentTrackerPos && (
            <g transform={`translate(${currentTrackerPos.x}, ${currentTrackerPos.y})`}>
              {/* Glowing sonar pulse */}
              <circle
                cx="0"
                cy="0"
                r="24"
                fill="none"
                stroke={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"}
                strokeWidth="1"
                className="opacity-45 animate-ping"
              />
              <circle
                cx="0"
                cy="0"
                r="14"
                fill={selectedRoute === "sea" ? "rgba(0, 212, 170, 0.25)" : "rgba(212, 175, 55, 0.25)"}
              />
              {/* Tactical Marker Card */}
              <g transform="translate(-16, -16)">
                <rect
                  width="32"
                  height="32"
                  rx="6"
                  fill="#0A2540"
                  stroke={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"}
                  strokeWidth="2"
                  className="shadow-lg shadow-black"
                />
                <g transform="translate(8, 8)">
                  {selectedRoute === "sea" ? (
                    <Ship className="h-4 w-4 text-brand-teal animate-pulse" />
                  ) : (
                    <Plane className="h-4 w-4 text-brand-gold animate-bounce" />
                  )}
                </g>
              </g>

              {/* Core Active coordinates and text */}
              <g transform="translate(24, 0)">
                <rect
                  x="0"
                  y="-18"
                  width="130"
                  height="34"
                  rx="4"
                  fill="rgba(3, 13, 26, 0.95)"
                  stroke={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"}
                  strokeWidth="1"
                />
                <text x="8" y="-4" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontWeight="bold" fontSize="9">
                  {activeTrackingId}
                </text>
                <text x="8" y="10" fill={selectedRoute === "sea" ? "#00D4AA" : "#D4AF37"} fontFamily="JetBrains Mono, sans-serif" fontSize="8">
                  {mapT.progress}: {activeRouteProgress}%
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Hover tooltips */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-4 bg-brand-navy/95 border border-brand-teal/40 p-3 rounded-lg max-w-[280px] shadow-2xl backdrop-blur-md z-30"
            >
              <div className="flex items-center gap-2 mb-1.5 border-b border-[#00d4aa]/15 pb-1">
                <MapPin className="h-3.5 w-3.5 text-brand-teal" />
                <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  {(locations as any)[hoveredNode].name}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {(locations as any)[hoveredNode].info}
              </p>
              <div className="flex items-center gap-4 mt-2 pt-1.5 border-t border-[#00d4aa]/10 font-mono text-[9px] text-brand-gold">
                <span>LAT: {hoveredNode === "Berbera" ? "10.43° N" : "29.85° N"}</span>
                <span>LON: {hoveredNode === "Berbera" ? "45.01° E" : "121.85° E"}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Map Status Panel */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-navy/50 p-3 border border-brand-teal/15 rounded-xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {mapT.departure}
          </span>
          <span className="text-xs font-semibold text-white mt-0.5">
            {selectedRoute === "sea" ? "Shanghai/Shenzhen, CN" : "Yiwu Cargo, CN"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {mapT.discharge}
          </span>
          <span className="text-xs font-semibold text-brand-gold mt-0.5">
            {selectedRoute === "sea" ? "Berbera Port, SL" : "Hargeisa Intl (HGA), SL"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {mapT.transitDur}
          </span>
          <span className="text-xs font-semibold text-white mt-0.5">
            {selectedRoute === "sea" ? mapT.daysSea : mapT.daysAir}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {mapT.trackingStatus}
          </span>
          <span className="text-xs font-bold text-brand-teal mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
            {mapT.radarUplink}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InteractiveMap);
