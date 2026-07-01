import React from "react";

interface LogoProps {
  className?: string;
  variant?: "icon" | "seal";
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto", variant = "icon", light = false }) => {
  const primaryColor = light ? "#0A2540" : "#FFFFFF";
  const secondaryColor = "#00D4AA"; // Brand Teal/Cyan
  const accentColor = "#D4AF37"; // Amber Gold

  if (variant === "seal") {
    return (
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer Circular Ring with Dashed Tech Grid */}
        <circle cx="250" cy="250" r="230" stroke={primaryColor} strokeWidth="4" strokeDasharray="8 6" className="opacity-40 animate-[spin_120s_linear_infinite]" />
        <circle cx="250" cy="250" r="215" stroke={accentColor} strokeWidth="1.5" className="opacity-80" />
        <circle cx="250" cy="250" r="200" stroke={primaryColor} strokeWidth="3" />

        {/* Global Dotted Grid Lines */}
        <g className="opacity-30">
          <path d="M 250 50 L 250 450" stroke={secondaryColor} strokeWidth="1" />
          <path d="M 50 250 L 450 250" stroke={secondaryColor} strokeWidth="1" />
          <ellipse cx="250" cy="250" rx="100" ry="200" stroke={secondaryColor} strokeWidth="1" />
          <ellipse cx="250" cy="250" rx="180" ry="120" stroke={secondaryColor} strokeWidth="1" />
          <ellipse cx="250" cy="250" rx="200" ry="70" stroke={secondaryColor} strokeWidth="1" />
          <circle cx="250" cy="250" r="140" stroke={secondaryColor} strokeWidth="1" strokeDasharray="4 4" />
        </g>

        {/* Tech Nodes (Glowing Dots on Globe) */}
        <g fill={secondaryColor}>
          <circle cx="150" cy="180" r="4" className="animate-ping" />
          <circle cx="150" cy="180" r="3" />
          <circle cx="350" cy="180" r="4" className="animate-ping" />
          <circle cx="350" cy="180" r="3" />
          <circle cx="200" cy="300" r="3.5" />
          <circle cx="300" cy="280" r="3.5" />
          <circle cx="250" cy="110" r="4" />
        </g>

        {/* Connection Routes */}
        <path d="M 150 180 Q 250 100 350 180" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 150 180 Q 200 240 250 110" stroke={secondaryColor} strokeWidth="1" />
        <path d="M 350 180 Q 300 250 250 110" stroke={secondaryColor} strokeWidth="1" />

        {/* Airplane Silhouette Flying Upwards-Forward */}
        <g transform="translate(250, 75) scale(0.95)" fill={primaryColor}>
          <path d="M 0 -35 L 5 -15 L 5 25 L 1 32 L -1 32 L -5 25 L -5 -15 Z" />
          <path d="M 0 -10 L 45 5 L 45 12 L 5 5 L 0 5 Z" />
          <path d="M 0 -10 L -45 5 L -45 12 L -5 5 L 0 5 Z" />
          <path d="M 0 20 L 15 28 L 15 32 L 2 28 L 0 28 Z" />
          <path d="M 0 20 L -15 28 L -15 32 L -2 28 L 0 28 Z" />
          <rect x="12" y="4" width="4" height="10" rx="1" />
          <rect x="-16" y="4" width="4" height="10" rx="1" />
        </g>

        {/* Cargo Container Ship at the Bottom */}
        <g transform="translate(250, 320) scale(1.1)">
          <path d="M -70 10 L 70 10 L 60 40 L -60 40 Z" fill={primaryColor} />
          <path d="M -70 10 L 70 10 L 65 20 L -65 20 Z" fill={secondaryColor} />
          <rect x="-40" y="25" width="80" height="4" fill="#FFFFFF" rx="1" opacity="0.8" />
          <circle cx="-50" cy="30" r="2.5" fill="#FFFFFF" />
          <circle cx="50" cy="30" r="2.5" fill="#FFFFFF" />
          <rect x="-20" y="-15" width="40" height="25" fill={primaryColor} />
          <rect x="-25" y="-5" width="50" height="6" fill={secondaryColor} />
          <circle cx="-10" cy="-6" r="2" fill="#FFFFFF" />
          <circle cx="0" cy="-6" r="2" fill="#FFFFFF" />
          <circle cx="10" cy="-6" r="2" fill="#FFFFFF" />
          <path d="M 0 -15 L 0 -45 L 20 -35 L 0 -25 Z" fill={secondaryColor} stroke={accentColor} strokeWidth="1" />
          <text x="3" y="-31" fill={primaryColor} fontFamily="Montserrat, sans-serif" fontWeight="bold" fontSize="11">B</text>
        </g>

        {/* Label: BAANE LOGISTICS */}
        <text
          x="250"
          y="410"
          textAnchor="middle"
          fill={primaryColor}
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
          fontSize="28"
          letterSpacing="4"
        >
          BAANE
        </text>
        <text
          x="250"
          y="435"
          textAnchor="middle"
          fill={secondaryColor}
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          fontSize="14"
          letterSpacing="6"
        >
          LOGISTICS
        </text>

        {/* Route Text */}
        <path id="curve" d="M 80 460 Q 250 490 420 460" fill="none" />
        <text className="text-[10px] font-semibold tracking-[0.15em] fill-brand-gold">
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            CHINA • SOMALILAND • GLOBAL
          </textPath>
        </text>
      </svg>
    );
  }

  // Variant "icon" - Pixel-perfect reproduction of your official brand logo
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto select-none overflow-visible shrink-0"
      >
        <defs>
          {/* Transparent Mask to create perfect D-holes and the beautiful diagonal separator slice */}
          <mask id="brand-logo-mask">
            {/* Base white fill (fully visible) */}
            <rect x="0" y="0" width="400" height="360" fill="#FFFFFF" />
            
            {/* Top Loop Cutout (D-Shape) */}
            <path
              d="M 175 118 H 230 C 242 118 252 126 252 143 C 252 160 242 168 230 168 H 175 Z"
              fill="#000000"
            />
            
            {/* Bottom Loop Cutout (D-Shape) */}
            <path
              d="M 175 208 H 235 C 248 208 258 216 258 233 C 258 250 248 258 235 258 H 175 Z"
              fill="#000000"
            />

            {/* Diagonal slice for the swoosh shaft to pass through with elegant breathing room */}
            <path
              d="M 110 195 L 340 100 L 340 120 L 110 215 Z"
              fill="#000000"
            />
          </mask>

          {/* Gradients */}
          <linearGradient id="brand-teal-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B6B9" />
            <stop offset="50%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          <linearGradient id="swoosh-grad-brand" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B6B9" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        {/* 1. Main 'B' Shape (Bold Navy Blue, using precise geometric vectors) */}
        <path
          d="M 130 85 H 245 C 285 85 312 105 312 143 C 312 173 292 188 272 193 C 295 198 318 213 318 253 C 318 293 285 315 245 315 H 130 Z"
          fill={primaryColor}
          mask="url(#brand-logo-mask)"
        />

        {/* 2. 3D Faceted Teal Accents inside the bottom right of the 'B' bowl (Perfect brand match) */}
        <g mask="url(#brand-logo-mask)">
          {/* Facet 1 (Light Cyan highlight band) */}
          <path
            d="M 170 315 L 255 193 H 285 L 200 315 Z"
            fill="#00E5FF"
          />
          {/* Facet 2 (Medium Teal transition band) */}
          <path
            d="M 200 315 L 285 193 H 320 L 235 315 Z"
            fill="#00D4AA"
          />
        </g>

        {/* 3. The Orbiting Swoosh Loop (Teal gradient, sweeping from the left over the front) */}
        <path
          d="M 120 162 C 45 170 45 245 150 232 C 215 210 270 160 315 95"
          stroke="url(#swoosh-grad-brand)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* 4. Elegant Amber Gold Inner Detail Line on the outer-left loop curve */}
        <path
          d="M 120 162 C 48 168 48 241 146 230"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 5. Sharp Navy Blue/Teal Arrow Head (Pointing Top-Right at 45 degrees) */}
        {/* Navy arrowhead body */}
        <path
          d="M 302 110 L 332 75 L 322 125 Z"
          fill={primaryColor}
        />
        {/* Teal accent line matching the swoosh connection */}
        <path
          d="M 302 110 L 332 75"
          stroke="#00D4AA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Brand Typography perfectly paired and styled to look premium and sharp */}
      <div className="flex flex-col justify-center select-none shrink-0">
        <span
          style={{ color: primaryColor }}
          className="font-sans text-2xl sm:text-3xl font-extrabold tracking-[0.05em] leading-none text-left"
        >
          BAANE
        </span>
        <span
          className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.46em] leading-none mt-2 text-[#00D4AA] text-left"
        >
          LOGISTICS
        </span>
      </div>
    </div>
  );
};

export default React.memo(Logo);
