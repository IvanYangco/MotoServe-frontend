	"use client";

import React, { useState, useEffect } from "react";
import { Download, RotateCcw, Palette, Layers, ChevronRight, Check } from "lucide-react";

// --- Types ---
type Model = "sniper" | "raider";
type ViewMode = "simple" | "detailed";
type PartKey =
  | "fairing"
  | "frame"
  | "seat"
  | "wheels"
  | "mirror"
  | "handlebar"
  | "exhaust"
  | "forks"
  | "engine"
  | "details";

const defaultColors: Record<PartKey, string> = {
  fairing: "#2563EB", // Yamaha Blue-ish
  frame: "#374151",
  seat: "#111827",
  wheels: "#111827",
  mirror: "#1F2937",
  handlebar: "#374151",
  exhaust: "#4B5563",
  forks: "#9CA3AF",
  engine: "#374151",
  details: "#FBBF24", // Gold accents/calipers
};

// --- Main Application Component ---
export default function MotorCustomizer() {
  const [model, setModel] = useState<Model>("sniper");
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [selectedPart, setSelectedPart] = useState<PartKey>("fairing");
  const [colors, setColors] = useState<Record<PartKey, string>>({ ...defaultColors });
  const [variants, setVariants] = useState({ wheels: 0, seat: 0 });

  // Reset on model change (optional, but good for cleanliness)
  useEffect(() => {
    // keeping colors persistent for fun, but could reset here
  }, [model]);

  function updateColor(part: PartKey, hex: string) {
    setColors((c) => ({ ...c, [part]: hex }));
  }

  function cycleVariant(part: "wheels" | "seat", dir: 1 | -1) {
    setVariants((v) => {
      const max = 1; // 2 variants (0 and 1)
      let next = v[part] + dir;
      if (next > max) next = 0;
      if (next < 0) next = max;
      return { ...v, [part]: next };
    });
  }

  function resetAll() {
    setColors({ ...defaultColors });
    setVariants({ wheels: 0, seat: 0 });
    setModel("sniper");
    setViewMode("detailed");
    setSelectedPart("fairing");
  }

  function exportConfig() {
    const config = { model, viewMode, colors, variants };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `motoserve-config-${model}.json`;
    a.click();
  }

  // --- SVG Components ---

  // Helper for hover effects on SVG parts
  const InteractiveGroup = ({
    id,
    partKey,
    children,
    className = "",
  }: {
    id?: string;
    partKey: PartKey;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isSelected = selectedPart === partKey;
    return (
      <g
        id={id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPart(partKey);
        }}
        className={`cursor-pointer transition-all duration-300 ${className}`}
        style={{
          filter: isSelected ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))" : "none",
          opacity: isSelected ? 1 : 0.95,
        }}
      >
        {children}
      </g>
    );
  };

  /**
   * YAMAHA SNIPER 155 REPLICA SVG (Original Code)
   * Designed with custom paths to mimic the sharp underbone silhouette.
   */
  const SniperSVG = ({ detailed }: { detailed: boolean }) => {
    const c = colors;

    // Variant 0: Stock 5-spoke style
    // Variant 1: Aftermarket Multi-spoke
    const WheelSpokes = () => {
      if (variants.wheels === 0) {
        return (
          <g stroke={c.wheels} strokeWidth="8" strokeLinecap="round">
            {/* 5 Spoke Star Design */}
            {[0, 72, 144, 216, 288].map((angle) => (
              <line
                key={angle}
                x1="0"
                y1="0"
                x2={Math.cos((angle * Math.PI) / 180) * 55}
                y2={Math.sin((angle * Math.PI) / 180) * 55}
              />
            ))}
          </g>
        );
      } else {
        return (
          <g stroke={c.details} strokeWidth="2">
            {/* Multi-spoke racing rim */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={Math.cos((i * 30 * Math.PI) / 180) * 58}
                y2={Math.sin((i * 30 * Math.PI) / 180) * 58}
                stroke={c.wheels === "#111827" ? "#555" : c.wheels} // Contrast if black
                strokeWidth="3"
              />
            ))}
            <circle r="40" fill="none" stroke={c.wheels} strokeWidth="15" />
          </g>
        );
      }
    };

    return (
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="metalGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="400" cy="420" rx="300" ry="20" fill="#000000" opacity="0.2" />

        {/* --- REAR WHEEL ASSEMBLY --- */}
        <InteractiveGroup partKey="wheels">
          <g transform="translate(600, 320)">
            {/* Tire */}
            <circle r="85" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
            {/* Rim Color Ring */}
            <circle r="65" fill="none" stroke={c.wheels} strokeWidth="4" />
            {/* Rim Body */}
            <circle r="60" fill="#222" />
            <WheelSpokes />
            {/* Disc Brake */}
            {detailed && <circle r="35" fill="none" stroke="#d1d5db" strokeWidth="4" strokeDasharray="5,2" opacity="0.8" />}
          </g>
        </InteractiveGroup>

        {/* --- SWINGARM & CHAIN --- */}
        <InteractiveGroup partKey="frame">
          {/* Swingarm */}
          <path d="M430,320 L600,320 L580,300 L440,300 Z" fill="#2a2a2a" stroke={c.frame} strokeWidth="2" />
          {/* Chain */}
          {detailed && (
            <path
              d="M430,320 L600,320"
              stroke="#555"
              strokeWidth="4"
              strokeDasharray="2,2"
            />
          )}
        </InteractiveGroup>

        {/* --- EXHAUST --- */}
        <InteractiveGroup partKey="exhaust">
          {/* Pipe */}
          <path d="M450,280 Q500,320 520,330 L650,280" stroke="#444" strokeWidth="15" fill="none" />
          {/* Canister */}
          <path
            d="M550,330 L720,290 L710,250 L560,300 Z"
            fill={c.exhaust}
            stroke="#1f2937"
            strokeWidth="2"
          />
          {/* Heat Shield/Tip */}
          <path d="M680,260 L720,250 L725,285 Z" fill="#111" />
          <path d="M580,310 L680,280" stroke="#000" strokeWidth="3" opacity="0.3" />
        </InteractiveGroup>

        {/* --- ENGINE BLOCK --- */}
        <InteractiveGroup partKey="engine">
          <path d="M350,220 L450,220 L460,320 L380,330 L350,300 Z" fill={c.engine} stroke="#111" strokeWidth="1" />
          {/* Details */}
          {detailed && (
            <g opacity="0.4" fill={c.details}>
              <circle cx="410" cy="270" r="15" />
              <rect x="370" y="240" width="40" height="10" rx="2" />
            </g>
          )}
        </InteractiveGroup>

        {/* --- FRAME (Main Spar) --- */}
        <InteractiveGroup partKey="frame">
          {/* Visual center spar frame */}
          <path d="M320,150 L450,220 L430,300" fill="none" stroke={c.frame} strokeWidth="12" strokeLinecap="round" />
        </InteractiveGroup>

        {/* --- SEAT --- */}
        <InteractiveGroup partKey="seat">
          {variants.seat === 0 ? (
            // Standard Stock Seat
            <path
              d="M380,150 Q450,155 500,140 L620,120 Q630,130 620,140 L500,180 L380,180 Z"
              fill={c.seat}
              stroke="#000"
              strokeWidth="1"
            />
          ) : (
            // Cafe/Custom Seat (Flatter, ribbed)
            <g>
              <path
                d="M380,150 Q450,150 500,145 L600,140 L600,160 L500,180 L380,180 Z"
                fill={c.seat}
                stroke="#000"
                strokeWidth="1"
              />
              {/* Ribs */}
              <path d="M420,150 L420,180 M460,148 L460,180 M500,145 L500,180" stroke="#000" strokeOpacity="0.3" strokeWidth="2"/>
            </g>
          )}
        </InteractiveGroup>

        {/* --- FRONT FORKS & WHEEL --- */}
        <InteractiveGroup partKey="forks">
          <g transform="translate(200, 320)">
            {/* Front Tire */}
            <circle r="80" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
            {/* Rim Color Ring */}
            <circle r="60" fill="none" stroke={c.wheels} strokeWidth="4" />
            <circle r="55" fill="#222" />
            <g transform="rotate(25)"> <WheelSpokes /> </g>
            {/* Front Disc */}
            <circle r="40" fill="none" stroke="#ccc" strokeWidth="2" />
            {/* Caliper */}
            <path d="M-20,-40 L20,-50 L20,-20 L-20,-10 Z" fill={c.details} />
          </g>
          {/* Forks */}
          <path d="M200,320 L240,140" stroke={c.forks} strokeWidth="10" strokeLinecap="round" />
          <path d="M200,320 L240,140" stroke="rgba(0,0,0,0.3)" strokeWidth="4" />
        </InteractiveGroup>

        {/* --- FAIRING (The Main Body) --- */}
        <InteractiveGroup partKey="fairing">
          {/* Lower Cowl / Underbelly */}
          <path
            d="M350,320 L450,320 L480,250 L350,250 Z"
            fill={c.fairing}
            filter="brightness(0.8)" // Slightly darker for depth
          />

          {/* Main Side Fairing - Sharp "Sniper" Shape */}
          <path
            d="M260,150
                   L400,140
                   L520,180
                   L550,170
                   L650,100  /* Tail point */
                   L630,160
                   L500,210
                   L450,280
                   L350,280
                   L250,230
                   Z"
            fill={c.fairing}
            stroke="#ffffff20"
            strokeWidth="1"
          />

          {/* Inner Plastic Details (Center Tunnel) */}
          <path d="M380,180 L480,180 L460,240 L380,240 Z" fill="#1f2937" />

          {/* Front Nose Cowl */}
          <path
            d="M260,150
                    L320,110
                    L250,130
                    L220,180
                    L250,230 Z"
            fill={c.fairing}
          />

          {/* Headlight Assembly */}
          {detailed && (
            <g>
              {/* Main Eye */}
              <path d="M240,160 L280,160 L270,180 L230,175 Z" fill="#e0f2fe" filter="url(#glow)" />
              {/* Brow */}
              <path d="M235,155 L285,155" stroke="#000" strokeWidth="2" />
            </g>
          )}

          {/* Decals / Vents */}
          {detailed && (
            <path d="M300,200 L340,190 L330,210 Z" fill="#000" opacity="0.3" />
          )}
        </InteractiveGroup>

        {/* --- HANDLEBARS & MIRRORS --- */}
        <InteractiveGroup partKey="handlebar">
          {/* Riser */}
          <path d="M240,140 L230,100" stroke="#333" strokeWidth="8" />
          {/* Bar */}
          <path d="M210,100 L280,110" stroke={c.handlebar} strokeWidth="6" strokeLinecap="round" />
          {/* Grip */}
          <circle cx="210" cy="100" r="5" fill="#111" />
        </InteractiveGroup>

        <InteractiveGroup partKey="mirror">
          <line x1="250" y1="105" x2="260" y2="70" stroke="#333" strokeWidth="2" />
          <path d="M260,70 L290,60 L295,80 L265,85 Z" fill={c.mirror} stroke="#000" strokeWidth="1" />
        </InteractiveGroup>

      </svg>
    );
  };

  /**
   * SUZUKI RAIDER 150 REPLICA SVG (Detailed Implementation)
   * Designed to reflect the sporty, exposed-frame underbone style.
   */
  const RaiderSVG = ({ detailed }: { detailed: boolean }) => {
    const c = colors;

    // Raider Wheel Spokes - typically 3 or 6 large spokes
    const WheelSpokes = () => {
      if (variants.wheels === 0) {
        return (
          <g stroke={c.wheels} strokeWidth="10" strokeLinecap="round">
            {/* 3 Spoke Design for Stock look */}
            {[0, 120, 240].map((angle) => (
              <line
                key={angle}
                x1="0"
                y1="0"
                x2={Math.cos((angle * Math.PI) / 180) * 50}
                y2={Math.sin((angle * Math.PI) / 180) * 50}
              />
            ))}
          </g>
        );
      } else {
        return (
          <g stroke={c.wheels} strokeWidth="3">
            {/* Multi-spoke racing rim */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={Math.cos((i * 45 * Math.PI) / 180) * 58}
                y2={Math.sin((i * 45 * Math.PI) / 180) * 58}
                stroke={c.wheels === "#111827" ? "#555" : c.wheels}
                strokeWidth="3"
              />
            ))}
            <circle r="40" fill="none" stroke={c.wheels} strokeWidth="15" />
          </g>
        );
      }
    };

    return (
      <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Definitions kept for consistency */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="400" cy="420" rx="300" ry="20" fill="#000000" opacity="0.2" />

        {/* --- REAR WHEEL ASSEMBLY --- */}
        <InteractiveGroup partKey="wheels">
          <g transform="translate(600, 320)">
            <circle r="80" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
            <circle r="60" fill="none" stroke={c.wheels} strokeWidth="4" />
            <circle r="55" fill="#222" />
            <WheelSpokes />
            {detailed && <circle r="35" fill="none" stroke="#d1d5db" strokeWidth="4" strokeDasharray="5,2" opacity="0.8" />}
          </g>
        </InteractiveGroup>

        {/* --- SWINGARM & FRAME (Exposed Underbone Style) --- */}
        <InteractiveGroup partKey="frame">
          {/* Main Frame Spine (Prominent Feature) */}
          <path d="M350,150 L450,200 L430,280 L580,300 L600,320" fill="none" stroke={c.frame} strokeWidth="15" strokeLinecap="round" />
          {/* Front Spar */}
          <line x1="350" y1="150" x2="300" y2="280" stroke={c.frame} strokeWidth="10" strokeLinecap="round" />
          {/* Swingarm */}
          <path d="M430,280 L600,320 L580,300 L440,300 Z" fill={c.frame} stroke={c.frame} strokeWidth="2" />
          {/* Rear Suspension (Monoshock style link) */}
          {detailed && <path d="M450,200 L550,280" stroke={c.details} strokeWidth="8" strokeLinecap="round" opacity="0.7"/>}
        </InteractiveGroup>

        {/* --- EXHAUST --- */}
        <InteractiveGroup partKey="exhaust">
          {/* Pipe */}
          <path d="M400,280 Q450,310 500,320 L650,280" stroke="#444" strokeWidth="12" fill="none" />
          {/* Canister - Sleeker and longer than Sniper's */}
          <path
            d="M500,320 L700,290 L690,260 L490,290 Z"
            fill={c.exhaust}
            stroke="#1f2937"
            strokeWidth="2"
          />
        </InteractiveGroup>

        {/* --- ENGINE BLOCK (Visible) --- */}
        <InteractiveGroup partKey="engine">
          <path d="M300,280 L430,280 L440,330 L320,330 L300,300 Z" fill={c.engine} stroke="#111" strokeWidth="1" />
          {/* Cylinder Head/Cover */}
          <rect x="300" y="250" width="100" height="30" fill={c.engine} stroke="#111" strokeWidth="1"/>
          {/* Details (Spark Plug/Hose) */}
          {detailed && (
            <g opacity="0.5" fill={c.details}>
               <rect x="320" y="255" width="5" height="20" fill={c.details} />
            </g>
          )}
        </InteractiveGroup>

        {/* --- SEAT (Flat, Racing Style) --- */}
        <InteractiveGroup partKey="seat">
          {variants.seat === 0 ? (
            // Standard Flat Seat
            <path
              d="M350,150 L550,140 L650,150 L630,190 L350,190 Z"
              fill={c.seat}
              stroke="#000"
              strokeWidth="1"
            />
          ) : (
            // Flat with ribs
            <g>
              <path
                d="M350,150 L550,140 L650,150 L630,190 L350,190 Z"
                fill={c.seat}
                stroke="#000"
                strokeWidth="1"
              />
              {/* Ribs */}
              <path d="M380,155 L380,190 M420,150 L420,185 M460,145 L460,180 M500,143 L500,178 M540,145 L540,180" stroke="#000" strokeOpacity="0.3" strokeWidth="2"/>
            </g>
          )}
        </InteractiveGroup>

        {/* --- FRONT FORKS & WHEEL --- */}
        <InteractiveGroup partKey="forks">
          <g transform="translate(200, 320)">
            <circle r="75" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
            <circle r="55" fill="none" stroke={c.wheels} strokeWidth="4" />
            <circle r="50" fill="#222" />
            <g transform="rotate(0)"> <WheelSpokes /> </g>
            {detailed && <circle r="40" fill="none" stroke="#ccc" strokeWidth="2" />}
            {detailed && <path d="M-20,-40 L20,-50 L20,-20 L-20,-10 Z" fill={c.details} />}
          </g>
          {/* Forks */}
          <path d="M200,320 L240,120" stroke={c.forks} strokeWidth="12" strokeLinecap="round" />
        </InteractiveGroup>

        {/* --- FAIRING (Minimalist) --- */}
        <InteractiveGroup partKey="fairing">
          {/* Front Nose Cowl - distinct 'beak' shape */}
          <path
            d="M240,120 L300,100 L350,120 L300,150 L250,170 Z"
            fill={c.fairing}
            filter="brightness(0.9)"
          />
          {/* Side Fairing */}
          <path
            d="M300,150 L350,170 L300,280 L250,250 Z"
            fill={c.fairing}
            stroke="#ffffff20"
            strokeWidth="1"
          />

          {/* Headlight Assembly (V-shaped) */}
          {detailed && (
            <g transform="translate(0, 5)" fill="#e0f2fe">
              <path d="M280,105 L300,115 L280,125 Z" filter="url(#glow)" />
              <path d="M300,115 L320,105 L320,125 Z" filter="url(#glow)" />
            </g>
          )}
        </InteractiveGroup>

        {/* --- HANDLEBARS & MIRRORS --- */}
        <InteractiveGroup partKey="handlebar">
          {/* Riser */}
          <path d="M240,120 L250,90" stroke="#333" strokeWidth="6" />
          {/* Bar - Clip-on style */}
          <path d="M220,90 L300,95" stroke={c.handlebar} strokeWidth="4" strokeLinecap="round" />
          {/* Grips */}
          <circle cx="220" cy="90" r="4" fill="#111" />
        </InteractiveGroup>

        <InteractiveGroup partKey="mirror">
          <line x1="250" y1="90" x2="260" y2="55" stroke="#333" strokeWidth="2" />
          <path d="M260,55 L290,45 L295,65 L265,70 Z" fill={c.mirror} stroke="#000" strokeWidth="1" />
        </InteractiveGroup>

        {/* --- Logos/Details --- */}
        {detailed && (
            <text x="600" y="160" fontSize="20" fontWeight="bold" fill={c.details} textAnchor="middle" transform="rotate(-5 600 160)">
                R
            </text>
        )}
      </svg>
    );
  };

  // --- UI Layout (Unchanged) ---
  
  const PartButton = ({ pKey, label }: { pKey: PartKey; label: string }) => (
    <button
      onClick={() => setSelectedPart(pKey)}
      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
        selectedPart === pKey
          ? "bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <span>{label}</span>
      {selectedPart === pKey && <ChevronRight size={16} />}
    </button>
  );

  const ColorButton = ({ color }: { color: string }) => (
    <button
      className="w-10 h-10 rounded-lg shadow-sm hover:scale-110 transition-transform ring-2 ring-offset-2 ring-offset-slate-900 ring-transparent hover:ring-white"
      style={{ backgroundColor: color }}
      onClick={() => updateColor(selectedPart, color)}
      title={color}
    />
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT SIDEBAR: Navigation & Parts */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">MotoServe <span className="text-amber-500">Customizer</span></h1>
          <p className="text-xs text-slate-500 mt-1">v2.4.0 • Sniper Edition</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* Model Selector */}
          <section>
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider">Model Selection</h3>
            <div className="space-y-2">
              <button
                onClick={() => setModel("sniper")}
                className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  model === "sniper" ? "border-blue-600 bg-blue-600/10 text-blue-400" : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                Yamaha Sniper 155
              </button>
              <button
                onClick={() => setModel("raider")}
                className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  model === "raider" ? "border-red-600 bg-red-600/10 text-red-400" : "border-slate-700 text-slate-400 hover:border-slate-600" // Changed color for Raider
                }`}
              >
                Suzuki Raider 150
              </button>
            </div>
          </section>

          {/* Parts List */}
          <section>
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider flex items-center gap-2">
                <Layers size={12} /> Select Part
            </h3>
            <div className="space-y-1.5">
              {[
                { k: "fairing", l: "Fairing Body" },
                { k: "frame", l: "Frame & Swingarm" },
                { k: "seat", l: "Seat" },
                { k: "wheels", l: "Wheels" },
                { k: "forks", l: "Suspension" },
                { k: "exhaust", l: "Exhaust System" },
                { k: "mirror", l: "Mirrors" },
                { k: "handlebar", l: "Handlebars" },
                { k: "details", l: "Accents" },
              ].map((p) => (
                <PartButton key={p.k} pKey={p.k as PartKey} label={p.l} />
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => cycleVariant("wheels", 1)} className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-xs font-semibold">
                Swap Wheels
            </button>
            <button onClick={() => cycleVariant("seat", 1)} className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded text-xs font-semibold">
                Swap Seat
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={resetAll} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors">
                <RotateCcw size={16} /> Reset
            </button>
            <button onClick={exportConfig} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/20">
                <Download size={16} /> Export
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER: Canvas/Preview */}
      <main className="flex-1 bg-slate-950 relative flex flex-col">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur z-10">
            <div className="flex items-center gap-4">
               <h2 className="font-bold text-white">Preview</h2>
               <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">{model === "sniper" ? "YAMAHA SNIPER 155" : "SUZUKI RAIDER 150"}</span>
            </div>

            <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setViewMode("simple")} className={`px-3 py-1 text-xs rounded transition-all ${viewMode === "simple" ? "bg-slate-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>Simple</button>
                <button onClick={() => setViewMode("detailed")} className={`px-3 py-1 text-xs rounded transition-all ${viewMode === "detailed" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>Detailed</button>
            </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            <div className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden group">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 hover:scale-105">
                    {model === "sniper" ? <SniperSVG detailed={viewMode === "detailed"} /> : <RaiderSVG detailed={viewMode === "detailed"}/>}
                </div>

                {/* Floating Label */}
                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10 text-sm">
                    <span className="text-slate-400 mr-2">Editing:</span>
                    <span className="text-amber-500 font-bold capitalize">{selectedPart}</span>
                </div>
            </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR: Colors */}
      <aside className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6">
        <div>
            <h3 className="text-sm uppercase font-bold text-slate-400 mb-1">Selected Part</h3>
            <div className="text-2xl font-black text-white capitalize flex items-center gap-2">
                {selectedPart}
                <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: colors[selectedPart] }}/>
            </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">CUSTOM HEX</label>
            <div className="flex gap-2">
                <div className="relative flex-1 h-10 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <input
                        type="color"
                        value={colors[selectedPart]}
                        onChange={(e) => updateColor(selectedPart, e.target.value)}
                        className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer p-0 border-0"
                    />
                </div>
                <input
                    type="text"
                    value={colors[selectedPart]}
                    onChange={(e) => updateColor(selectedPart, e.target.value)}
                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 text-sm text-slate-300 font-mono uppercase focus:outline-none focus:border-amber-500"
                />
            </div>
        </div>

        {/* Quick Palette */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Palette size={14} className="text-slate-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase">Preset Palette</h3>
            </div>
            <div className="grid grid-cols-5 gap-3">
                {[
                  "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#1E40AF", // Blues
                  "#DC2626", "#EF4444", "#F87171", "#B91C1C", "#991B1B", // Reds
                  "#059669", "#10B981", "#34D399", "#065F46", "#064E3B", // Greens
                  "#D97706", "#F59E0B", "#FBBF24", "#B45309", "#78350F", // Ambers/Golds
                  "#111827", "#1F2937", "#374151", "#4B5563", "#9CA3AF", // Greys/Blacks
                  "#DB2777", "#7C3AED", "#8B5CF6", "#6366F1", "#EC4899"  // Exotics
                ].map((c) => (
                    <ColorButton key={c} color={c} />
                ))}
            </div>
        </div>

        {/* Status / Color List */}
        <div className="mt-auto pt-6 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Current Configuration</h3>
            <div className="space-y-2 h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {(Object.keys(colors) as PartKey[]).map(k => (
                    <div
                        key={k}
                        onClick={() => setSelectedPart(k)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer border ${selectedPart === k ? "border-amber-500 bg-amber-500/10" : "border-slate-800 hover:bg-slate-800"}`}
                    >
                        <span className="text-sm capitalize text-slate-300">{k}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">{colors[k]}</span>
                            <div className="w-4 h-4 rounded shadow-sm" style={{ background: colors[k] }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </aside>

    </div>
  );
}
