"use client";

import React, { useState } from "react";

/**
 * MotorCustomizer.tsx
 * Place in your components folder and import into a page.
 *
 * No external libs required. Uses Tailwind for styles.
 */

type Model = "sniper" | "raider";
type ViewMode = "simple" | "detailed";
type PartKey = "fairing" | "seat" | "wheels" | "mirror" | "handlebar";

const defaultColors: Record<PartKey, string> = {
  fairing: "#6b7280", // gray
  seat: "#111827", // dark
  wheels: "#111827",
  mirror: "#9ca3af",
  handlebar: "#374151",
};

export default function MotorCustomizer(): React.JSX.Element {
  const [model, setModel] = useState<Model>("sniper");
  const [viewMode, setViewMode] = useState<ViewMode>("simple");
  const [selectedPart, setSelectedPart] = useState<PartKey | null>("fairing");
  const [colors, setColors] = useState<Record<PartKey, string>>({
    ...defaultColors,
  });
  const [variants, setVariants] = useState({
    wheels: 0, // 0 or 1
    seat: 0, // 0 or 1
  });

  // helper to change color
  function updateColor(part: PartKey, hex: string) {
    setColors((c) => ({ ...c, [part]: hex }));
  }

  function cycleVariant(part: "wheels" | "seat", dir: 1 | -1) {
    setVariants((v) => {
      const max = 1; // 2 variants: 0 and 1
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
    setViewMode("simple");
    setSelectedPart("fairing");
  }

  function exportConfig() {
    const config = {
      model,
      viewMode,
      colors,
      variants,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(config, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `motor-config-${model}.json`;
    a.click();
  }

  // Minimal stylized SVGs for demonstration.
  // Each function returns an SVG group for the particular bike + view mode.
  // Colors are applied by fill/stroke referencing the colors state.

  
  function SimpleSniperSVG() {
    return (
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Body / fairing */}
        <g transform="translate(0,0)">
          <rect
            x="150"
            y="120"
            rx="40"
            ry="40"
            width="500"
            height="100"
            fill={colors.fairing}
            stroke="#111827"
            strokeWidth={3}
          />
          {/* seat */}
          {variants.seat === 0 ? (
            <rect
              x="300"
              y="90"
              width="200"
              height="40"
              rx="12"
              fill={colors.seat}
              stroke="#000"
            />
          ) : (
            <path
              d="M300 105 q50 -20 100 0 q50 20 100 0 v25 h-200 z"
              fill={colors.seat}
              stroke="#000"
            />
          )}

          {/* handlebar */}
          <rect
            x="120"
            y="100"
            width="40"
            height="8"
            rx="4"
            fill={colors.handlebar}
          />
          <rect
            x="120"
            y="108"
            width="10"
            height="40"
            fill={colors.handlebar}
          />

          {/* mirror */}
          <circle cx="125" cy="95" r="8" fill={colors.mirror} stroke="#000" />

          {/* wheels */}
          <g transform="translate(190,210)">
            {variants.wheels === 0 ? (
              <>
                <circle cx="0" cy="0" r="50" fill={colors.wheels} />
                <circle cx="400" cy="0" r="50" fill={colors.wheels} transform="translate(210,0)"/>
                <circle cx="0" cy="0" r="44" fill="transparent" stroke="#fff" strokeWidth={4}/>
                <circle cx="210" cy="0" r="44" fill="transparent" stroke="#fff" strokeWidth={4}/>
              </>
            ) : (
              <>
                <circle cx="0" cy="0" r="50" fill="transparent" stroke={colors.wheels} strokeWidth={10}/>
                <circle cx="210" cy="0" r="50" fill="transparent" stroke={colors.wheels} strokeWidth={10}/>
              </>
            )}
          </g>

          {/* small accent line */}
          <rect x="350" y="170" width="100" height="6" rx="3" fill="#111827" />
        </g>
      </svg>
    );
  }

  function SimpleRaiderSVG() {
    return (
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <g>
          <rect
            x="140"
            y="115"
            rx="30"
            ry="30"
            width="520"
            height="90"
            fill={colors.fairing}
            stroke="#111827"
            strokeWidth={3}
          />
          {/* seat variant */}
          {variants.seat === 0 ? (
            <rect x="320" y="85" width="150" height="30" rx="10" fill={colors.seat} />
          ) : (
            <path d="M320 100 q75 -30 150 0 v20 h-150 z" fill={colors.seat} />
          )}

          {/* handlebar */}
          <rect x="110" y="95" width="45" height="7" rx="3" fill={colors.handlebar} />
          <circle cx="115" cy="90" r="7" fill={colors.mirror} />
          {/* wheels */}
          <g transform="translate(180,220)">
            {variants.wheels === 0 ? (
              <>
                <circle cx="0" cy="0" r="55" fill={colors.wheels} />
                <circle cx="420" cy="0" r="55" fill={colors.wheels} transform="translate(210,0)"/>
                <circle cx="0" cy="0" r="46" fill="transparent" stroke="#fff" strokeWidth={4}/>
                <circle cx="210" cy="0" r="46" fill="transparent" stroke="#fff" strokeWidth={4}/>
              </>
            ) : (
              <>
                <circle cx="0" cy="0" r="55" fill="transparent" stroke={colors.wheels} strokeWidth={12}/>
                <circle cx="210" cy="0" r="55" fill="transparent" stroke={colors.wheels} strokeWidth={12}/>
              </>
            )}
          </g>

          <rect x="360" y="165" width="140" height="6" rx="3" fill="#111827" />
        </g>
      </svg>
    );
  }

  // Slightly more detailed shapes for "detailed" view.
  function DetailedSniperSVG() {
    return (
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <g>
          {/* fairing with gradient-like effect using two shapes */}
          <path
            d="M160 150 q80 -40 200 -30 q80 8 280 30 v70 h-680 z"
            fill={colors.fairing}
            stroke="#0f172a"
            strokeWidth={2}
          />
          <path
            d="M200 170 q140 -30 240 -18"
            fill="none"
            stroke="#ffffff22"
            strokeWidth={6}
            opacity={0.2}
          />
          {/* seat */}
          {variants.seat === 0 ? (
            <path d="M320 110 q80 -40 140 0 v28 q-60 10 -140 0 z" fill={colors.seat} />
          ) : (
            <path d="M300 110 q120 -60 180 0 v28 q-60 10 -180 0 z" fill={colors.seat} />
          )}

          {/* handlebar */}
          <rect x="110" y="92" width="18" height="60" rx="7" fill={colors.handlebar} />
          <rect x="100" y="86" width="60" height="12" rx="6" fill={colors.handlebar} />

          {/* mirror */}
          <rect x="86" y="86" width="16" height="10" rx="4" fill={colors.mirror} transform="rotate(-12 94 90)"/>

          {/* wheels with spokes */}
          <g transform="translate(200,230)">
            <circle cx="0" cy="0" r="54" fill="#000" />
            <circle cx="0" cy="0" r="44" fill={colors.wheels} />
            <g stroke="#ffffff66" strokeWidth={2}>
              <line x1="-40" y1="0" x2="40" y2="0" />
              <line x1="0" y1="-40" x2="0" y2="40" />
              <line x1="-28" y1="-28" x2="28" y2="28" />
              <line x1="-28" y1="28" x2="28" y2="-28" />
            </g>
            <g transform="translate(210,0)">
              <circle cx="0" cy="0" r="54" fill="#000" />
              <circle cx="0" cy="0" r="44" fill={colors.wheels} />
              <g stroke="#ffffff66" strokeWidth={2}>
                <line x1="-40" y1="0" x2="40" y2="0" />
                <line x1="0" y1="-40" x2="0" y2="40" />
              </g>
            </g>
          </g>

          {/* accents */}
          <rect x="360" y="168" width="160" height="6" rx="3" fill="#0b1220" />
        </g>
      </svg>
    );
  }

  function DetailedRaiderSVG() {
    return (
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <g>
          <path
            d="M140 140 q120 -60 240 -40 q120 20 240 40 v70 h-640 z"
            fill={colors.fairing}
            stroke="#0b1220"
            strokeWidth={2}
          />
          <path d="M200 160 q150 -30 320 -6" stroke="#ffffff22" strokeWidth={5} fill="none" opacity={0.2} />
          {variants.seat === 0 ? (
            <path d="M320 100 q60 -30 140 0 v30 q-60 10 -140 0 z" fill={colors.seat} />
          ) : (
            <path d="M300 95 q100 -45 180 8 v30 q-70 12 -180 -8 z" fill={colors.seat} />
          )}

          <rect x="110" y="90" width="22" height="60" rx="8" fill={colors.handlebar} />
          <circle cx="125" cy="86" r="9" fill={colors.mirror} />

          {/* wheels */}
          <g transform="translate(190,240)">
            <circle cx="0" cy="0" r="58" fill="#000"/>
            <circle cx="0" cy="0" r="46" fill={colors.wheels}/>
            <g transform="translate(210,0)"><circle r="58" fill="#000"/><circle r="46" fill={colors.wheels}/></g>
            <g stroke="#fff9" strokeWidth={2}><line x1="-40" y1="0" x2="40" y2="0"/><line x1="0" y1="-40" x2="0" y2="40"/></g>
          </g>

          <rect x="360" y="166" width="180" height="8" rx="4" fill="#07101a" />
        </g>
      </svg>
    );
  }

  // Main display area chooses model + viewMode
  function MotorCanvas() {
    if (model === "sniper") {
      return viewMode === "simple" ? <SimpleSniperSVG /> : <DetailedSniperSVG />;
    } else {
      return viewMode === "simple" ? <SimpleRaiderSVG /> : <DetailedRaiderSVG />;
    }
  }

  const partButtons: { key: PartKey; label: string }[] = [
    { key: "fairing", label: "Fairing" },
    { key: "seat", label: "Seat" },
    { key: "wheels", label: "Wheels" },
    { key: "mirror", label: "Side Mirror" },
    { key: "handlebar", label: "Handlebar" },
  ];

  return (
    <div className="min-h-screen flex gap-6 p-6 bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-56 bg-slate-900 text-white rounded-lg p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">MotoServe Customizer</h2>

        <div className="space-y-2">
          <div className="text-sm text-slate-300">Model</div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setModel("sniper")}
              className={`text-left px-3 py-2 rounded ${model === "sniper" ? "bg-blue-600" : "bg-slate-700"}`}
            >
              Yamaha Sniper
            </button>
            <button
              onClick={() => setModel("raider")}
              className={`text-left px-3 py-2 rounded ${model === "raider" ? "bg-blue-600" : "bg-slate-700"}`}
            >
              Suzuki Raider
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-300 mb-1">View Mode</div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("simple")}
              className={`px-2 py-1 rounded ${viewMode === "simple" ? "bg-indigo-500" : "bg-slate-700"}`}
            >
              Simple
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-2 py-1 rounded ${viewMode === "detailed" ? "bg-indigo-500" : "bg-slate-700"}`}
            >
              Detailed
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-300 mb-1">Parts</div>
          <div className="flex flex-col gap-2">
            {partButtons.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPart(p.key)}
                className={`text-left px-3 py-2 rounded ${selectedPart === p.key ? "bg-amber-500 text-black" : "bg-slate-700"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={() => cycleVariant("wheels", 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
          >
            Swap Wheel Variant
          </button>
          <button
            onClick={() => cycleVariant("seat", 1)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
          >
            Swap Seat Variant
          </button>

          <div className="flex gap-2">
            <button onClick={resetAll} className="flex-1 py-2 bg-slate-500 rounded">Reset</button>
            <button onClick={exportConfig} className="flex-1 py-2 bg-yellow-500 rounded">Export</button>
          </div>
        </div>
      </aside>

      {/* Center Canvas */}
      <main className="flex-1 bg-white rounded-lg p-4 shadow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Preview</h3>
          <div className="text-sm text-slate-600">Model: <span className="font-medium">{model}</span> • View: <span className="font-medium">{viewMode}</span></div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-700 rounded-lg p-2 flex items-center justify-center">
          <div className="w-full h-96 max-w-4xl">
            <MotorCanvas />
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Tip: select a part on the left, then pick a color on the right to change it.
        </div>
      </main>

      {/* Right Panel - Colors */}
      <aside className="w-64 bg-slate-900 rounded-lg p-4 text-white flex flex-col gap-4">
        <div className="mb-1 text-slate-300">Selected part</div>
        <div className="font-semibold text-lg">{selectedPart ?? "—"}</div>

        <div>
          <div className="text-sm text-slate-300 mb-2">Choose color</div>
          <input
            type="color"
            value={selectedPart ? colors[selectedPart] : "#ffffff"}
            onChange={(e) => selectedPart && updateColor(selectedPart, e.target.value)}
            className="w-full h-12 rounded border-0"
          />
        </div>

        <div>
          <div className="text-sm text-slate-300 mb-2">Quick palette</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              "#ef4444", "#f97316", "#f59e0b", "#eab308",
              "#10b981", "#06b6d4", "#3b82f6", "#6366f1",
              "#a78bfa", "#ec4899", "#111827", "#9ca3af",
            ].map((c) => (
              <button
                key={c}
                className="w-10 h-10 rounded shadow"
                style={{ background: c }}
                onClick={() => selectedPart && updateColor(selectedPart, c)}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-sm text-slate-300 mb-2">Parts colors preview</div>
          <div className="space-y-2">
            {(["fairing", "seat", "wheels", "mirror", "handlebar"] as PartKey[]).map((k) => (
              <div key={k} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded">
                <div className="capitalize">{k}</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border" style={{ background: colors[k] }} />
                  <button
                    onClick={() => setSelectedPart(k)}
                    className="text-xs bg-slate-700 px-2 py-1 rounded"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
