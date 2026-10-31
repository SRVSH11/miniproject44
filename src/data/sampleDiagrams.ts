// Pre-encoded SVG data URIs for crystal-clear educational diagrams

export const DIJKSTRA_GRAPH_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="#f8fafc" rx="12" />
  <rect x="15" y="15" width="570" height="310" fill="#ffffff" rx="8" stroke="#e2e8f0" stroke-width="2" />
  <text x="30" y="45" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#1e293b">Dijkstra Counterexample: Negative Edge Weight</text>
  <text x="30" y="68" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">Greedy choice finalizes Node B distance at 2, missing path via C: 5 + (-4) = 1</text>
  
  <!-- Nodes -->
  <!-- Node A (Source) -->
  <circle cx="100" cy="180" r="28" fill="#4f46e5" stroke="#3730a3" stroke-width="3" />
  <text x="100" y="186" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">A (0)</text>
  <text x="100" y="225" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#4f46e5" text-anchor="middle">Source</text>

  <!-- Node B -->
  <circle cx="340" cy="110" r="28" fill="#f59e0b" stroke="#d97706" stroke-width="3" />
  <text x="340" y="116" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">B (2)</text>
  <text x="340" y="70" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">Finalized too early!</text>

  <!-- Node C -->
  <circle cx="340" cy="250" r="28" fill="#0ea5e9" stroke="#0284c7" stroke-width="3" />
  <text x="340" y="256" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">C (5)</text>

  <!-- Edges & Arrows -->
  <!-- A -> B: weight 2 -->
  <line x1="125" y1="168" x2="312" y2="118" stroke="#4f46e5" stroke-width="3" marker-end="url(#arrow)" />
  <rect x="200" y="125" width="40" height="22" rx="4" fill="#ede9fe" stroke="#c4b5fd" />
  <text x="220" y="140" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#4338ca" text-anchor="middle">+2</text>

  <!-- A -> C: weight 5 -->
  <line x1="125" y1="192" x2="312" y2="242" stroke="#64748b" stroke-width="3" />
  <rect x="200" y="220" width="40" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
  <text x="220" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">+5</text>

  <!-- C -> B: weight -4 -->
  <line x1="340" y1="222" x2="340" y2="138" stroke="#e11d48" stroke-width="3" stroke-dasharray="6,4" />
  <rect x="350" y="170" width="80" height="24" rx="4" fill="#ffe4e6" stroke="#fda4af" />
  <text x="390" y="186" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#be123c" text-anchor="middle">-4 (Negative!)</text>

  <!-- Callout note -->
  <rect x="445" y="105" width="130" height="150" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
  <text x="510" y="128" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">Algorithm Fault:</text>
  <text x="455" y="152" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">1. dist[B] = 2</text>
  <text x="455" y="172" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">2. Mark B visited</text>
  <text x="455" y="195" font-family="system-ui, sans-serif" font-size="10" fill="#be123c">3. Later A->C->B</text>
  <text x="455" y="212" font-family="system-ui, sans-serif" font-size="10" fill="#be123c">   dist = 1 &lt; 2!</text>
  <text x="455" y="235" font-family="system-ui, sans-serif" font-size="9" font-style="italic" fill="#0f172a">B never revisited!</text>
</svg>
`)}`;

export const SUBDUCTION_DIAGRAM_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="#0f172a" rx="12" />
  <text x="30" y="40" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">Physical Geography: Oceanic-Continental Subduction Zone</text>
  <text x="30" y="60" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">Dense basaltic oceanic lithosphere descends beneath buoyant continental crust</text>

  <!-- Ocean Water -->
  <path d="M 20 120 L 250 120 L 250 150 L 20 150 Z" fill="#0284c7" opacity="0.6" />
  <text x="100" y="140" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Ocean Water</text>

  <!-- Continental Crust -->
  <path d="M 280 120 L 580 120 L 580 200 L 320 200 Z" fill="#b45309" />
  <!-- Mountain Volcanic Arc -->
  <polygon points="360,120 400,80 440,120" fill="#d97706" />
  <polygon points="430,120 470,70 510,120" fill="#d97706" />
  <!-- Volcano Eruption smoke -->
  <circle cx="470" cy="60" r="10" fill="#ef4444" opacity="0.7" />
  <text x="470" y="150" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Continental Plate</text>
  <text x="470" y="50" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#fca5a5" text-anchor="middle">Volcanic Arc</text>

  <!-- Trench -->
  <polygon points="240,120 270,165 290,120" fill="#0369a1" />
  <text x="270" y="110" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle">Oceanic Trench</text>

  <!-- Subducting Oceanic Crust -->
  <path d="M 20 150 L 260 150 L 400 300 L 340 310 L 220 180 L 20 180 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
  <text x="120" y="170" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#e2e8f0">Dense Oceanic Crust</text>

  <!-- Asthenosphere / Mantle -->
  <path d="M 20 200 L 220 200 L 340 310 L 580 310 L 580 200 Z" fill="#7f1d1d" opacity="0.8" />
  <text x="480" y="270" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fecaca">Mantle / Asthenosphere</text>
  <text x="480" y="290" font-family="system-ui, sans-serif" font-size="10" fill="#fca5a5">Magma generation via flux melting</text>
</svg>
`)}`;

export const FRENCH_REV_FLOWCHART_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%">
  <rect width="600" height="320" fill="#f8fafc" rx="12" />
  <text x="30" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">French Revolution Study Notes Flowchart (1789-1799)</text>
  <text x="30" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Key sequence of political phases for modern world history exam</text>

  <!-- Phase 1 -->
  <rect x="30" y="80" width="115" height="180" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
  <text x="87" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">1. 1789-1791</text>
  <text x="87" y="130" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">National</text>
  <text x="87" y="146" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Assembly</text>
  <text x="87" y="180" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Bastille Fall</text>
  <text x="87" y="200" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Tennis Court</text>
  <text x="87" y="220" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Rights of Man</text>

  <!-- Arrow -->
  <text x="160" y="175" font-size="18" fill="#94a3b8">→</text>

  <!-- Phase 2 -->
  <rect x="175" y="80" width="115" height="180" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
  <text x="232" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">2. 1791-1792</text>
  <text x="232" y="130" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Legislative</text>
  <text x="232" y="146" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Assembly</text>
  <text x="232" y="180" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Const. Monarchy</text>
  <text x="232" y="200" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• War with Austria</text>
  <text x="232" y="220" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Food Riots</text>

  <!-- Arrow -->
  <text x="305" y="175" font-size="18" fill="#94a3b8">→</text>

  <!-- Phase 3 -->
  <rect x="320" y="80" width="115" height="180" rx="8" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2" />
  <text x="377" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#be123c" text-anchor="middle">3. 1792-1794</text>
  <text x="377" y="130" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">National</text>
  <text x="377" y="146" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Convention</text>
  <text x="377" y="180" font-family="system-ui, sans-serif" font-size="9" fill="#be123c" text-anchor="middle">• Reign of Terror</text>
  <text x="377" y="200" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Louis XVI Executed</text>
  <text x="377" y="220" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Robespierre</text>

  <!-- Arrow -->
  <text x="450" y="175" font-size="18" fill="#94a3b8">→</text>

  <!-- Phase 4 -->
  <rect x="465" y="80" width="105" height="180" rx="8" fill="#f0fdf4" stroke="#10b981" stroke-width="2" />
  <text x="517" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">4. 1795-1799</text>
  <text x="517" y="130" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">The</text>
  <text x="517" y="146" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Directory</text>
  <text x="517" y="180" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• 5 Directors</text>
  <text x="517" y="200" font-family="system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">• Corruption</text>
  <text x="517" y="220" font-family="system-ui, sans-serif" font-size="9" fill="#047857" text-anchor="middle">• Napoleon 1799</text>
</svg>
`)}`;

export const MATH_NORMAL_DISTRIBUTION_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="#f8fafc" rx="12" />
  <text x="30" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Mathematics & Statistics: Normal Distribution (68-95-99.7 Rule)</text>
  <text x="30" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Empirical rule breakdown across standard deviations (σ) from mean (μ)</text>

  <!-- Curve shaded areas -->
  <!-- 99.7% region -->
  <path d="M 60 260 C 120 258 140 250 180 230 C 220 200 260 100 300 90 C 340 100 380 200 420 230 C 460 250 480 258 540 260 Z" fill="#e0e7ff" opacity="0.4" />
  <!-- 95% region -->
  <path d="M 140 260 C 160 248 180 230 220 200 C 260 100 300 90 C 340 100 380 200 420 230 C 440 248 460 260 Z" fill="#c7d2fe" opacity="0.5" />
  <!-- 68% region -->
  <path d="M 220 260 C 240 230 270 120 300 90 C 330 120 360 230 380 260 Z" fill="#818cf8" opacity="0.6" />

  <!-- Outlined Bell Curve -->
  <path d="M 50 260 C 120 258 140 250 180 230 C 220 200 260 100 300 90 C 340 100 380 200 420 230 C 460 250 480 258 550 260" fill="none" stroke="#4f46e5" stroke-width="3" />

  <!-- Axis -->
  <line x1="40" y1="260" x2="560" y2="260" stroke="#334155" stroke-width="2" />
  
  <!-- Vertical Stems -->
  <line x1="300" y1="90" x2="300" y2="260" stroke="#4f46e5" stroke-width="2" stroke-dasharray="4,4" />
  <line x1="220" y1="200" x2="220" y2="260" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="380" y1="200" x2="380" y2="260" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="140" y1="248" x2="140" y2="260" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="460" y1="248" x2="460" y2="260" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />

  <!-- Labels -->
  <text x="300" y="280" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1e1b4b" text-anchor="middle">μ (Mean)</text>
  <text x="220" y="280" font-family="system-ui, sans-serif" font-size="11" fill="#4338ca" text-anchor="middle">μ - 1σ</text>
  <text x="380" y="280" font-family="system-ui, sans-serif" font-size="11" fill="#4338ca" text-anchor="middle">μ + 1σ</text>
  <text x="140" y="280" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" text-anchor="middle">μ - 2σ</text>
  <text x="460" y="280" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" text-anchor="middle">μ + 2σ</text>

  <!-- Percentages -->
  <text x="300" y="160" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">68.2%</text>
  <text x="300" y="315" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#4338ca" text-anchor="middle">68.2% within ±1σ | 95.4% within ±2σ | 99.7% within ±3σ</text>
</svg>
`)}`;

export const PHYSICS_CARNOT_CYCLE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="#0f172a" rx="12" />
  <text x="30" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">Physics Thermodynamics: Carnot Heat Engine Cycle (P-V Diagram)</text>
  <text x="30" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">Ideal thermodynamic cycle achieving maximum theoretical thermal efficiency η = 1 - (Tc / Th)</text>

  <!-- Axes -->
  <line x1="80" y1="80" x2="80" y2="280" stroke="#cbd5e1" stroke-width="2" />
  <line x1="80" y1="280" x2="520" y2="280" stroke="#cbd5e1" stroke-width="2" />
  <text x="50" y="90" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">P</text>
  <text x="525" y="285" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">V</text>

  <!-- Carnot Cycle Path -->
  <!-- 1 -> 2: Isothermal expansion (Th) -->
  <path d="M 160 110 Q 240 140 280 160" fill="none" stroke="#ef4444" stroke-width="3" />
  <!-- 2 -> 3: Adiabatic expansion -->
  <path d="M 280 160 Q 340 220 400 240" fill="none" stroke="#f59e0b" stroke-width="3" />
  <!-- 3 -> 4: Isothermal compression (Tc) -->
  <path d="M 400 240 Q 300 210 240 190" fill="none" stroke="#3b82f6" stroke-width="3" />
  <!-- 4 -> 1: Adiabatic compression -->
  <path d="M 240 190 Q 190 140 160 110" fill="none" stroke="#10b981" stroke-width="3" />

  <!-- Node points -->
  <circle cx="160" cy="110" r="5" fill="#ffffff" />
  <text x="145" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">1</text>
  
  <circle cx="280" cy="160" r="5" fill="#ffffff" />
  <text x="290" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">2</text>

  <circle cx="400" cy="240" r="5" fill="#ffffff" />
  <text x="415" y="245" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">3</text>

  <circle cx="240" cy="190" r="5" fill="#ffffff" />
  <text x="225" y="205" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">4</text>

  <!-- Labels -->
  <text x="240" y="125" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#fca5a5">1→2 Isothermal Exp (Q_in at T_H)</text>
  <text x="365" y="195" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#fcd34d">2→3 Adiabatic Exp</text>
  <text x="300" y="255" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#93c5fd">3→4 Isothermal Comp (Q_out at T_C)</text>
  <text x="140" y="160" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#6ee7b7">4→1 Adiabatic Comp</text>
</svg>
`)}`;

export const ECON_SUPPLY_DEMAND_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <rect width="600" height="340" fill="#f8fafc" rx="12" />
  <text x="30" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Economics: Market Equilibrium & Price Elasticity</text>
  <text x="30" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Intersection of Supply (Marginal Cost) and Demand (Marginal Benefit)</text>

  <!-- Axes -->
  <line x1="80" y1="80" x2="80" y2="280" stroke="#334155" stroke-width="2" />
  <line x1="80" y1="280" x2="520" y2="280" stroke="#334155" stroke-width="2" />
  <text x="50" y="90" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Price (P)</text>
  <text x="490" y="305" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Quantity (Q)</text>

  <!-- Supply curve (Upward sloping) -->
  <line x1="120" y1="250" x2="460" y2="100" stroke="#059669" stroke-width="3" />
  <text x="470" y="105" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#059669">Supply (S)</text>

  <!-- Demand curve (Downward sloping) -->
  <line x1="120" y1="100" x2="460" y2="250" stroke="#2563eb" stroke-width="3" />
  <text x="470" y="255" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#2563eb">Demand (D)</text>

  <!-- Equilibrium point E (290, 175) -->
  <circle cx="290" cy="175" r="6" fill="#dc2626" />
  <line x1="80" y1="175" x2="290" y2="175" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
  <line x1="290" y1="175" x2="290" y2="280" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />

  <text x="50" y="180" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#dc2626">P*</text>
  <text x="290" y="300" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">Q*</text>
  <text x="305" y="165" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#dc2626">Equilibrium (E)</text>

  <!-- Surplus areas -->
  <text x="180" y="145" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">Consumer Surplus</text>
  <text x="180" y="210" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#047857">Producer Surplus</text>
</svg>
`)}`;

export const ORGANIC_CHEM_REACTION_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%">
  <rect width="600" height="320" fill="#f8fafc" rx="12" />
  <text x="30" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Organic Chemistry: Bimolecular Nucleophilic Substitution (SN2)</text>
  <text x="30" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Concerted backside attack leading to 100% Walden Inversion of stereochemistry</text>

  <!-- Substrate -->
  <circle cx="160" cy="170" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
  <text x="160" y="176" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">C</text>

  <!-- Leaving group Br -->
  <circle cx="230" cy="170" r="16" fill="#fee2e2" stroke="#ef4444" stroke-width="2" />
  <text x="230" y="175" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">Br</text>
  <line x1="178" y1="170" x2="214" y2="170" stroke="#0f172a" stroke-width="2" />

  <!-- Nucleophile OH- -->
  <circle cx="60" cy="170" r="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="60" y="175" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">OH⁻</text>
  
  <!-- Backside attack curved arrow -->
  <path d="M 76 170 Q 110 140 142 165" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,3" />
  <text x="105" y="135" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#2563eb">Backside Attack</text>

  <!-- Reaction Arrow -->
  <line x1="280" y1="170" x2="350" y2="170" stroke="#64748b" stroke-width="3" />
  <polygon points="350,165 365,170 350,175" fill="#64748b" />
  <text x="315" y="155" font-family="system-ui, sans-serif" font-size="10" font-style="italic" fill="#64748b">Single Step</text>

  <!-- Product (Inverted) -->
  <circle cx="440" cy="170" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
  <text x="440" y="176" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">C</text>

  <circle cx="390" cy="170" r="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="390" y="175" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">HO</text>
  <line x1="406" y1="170" x2="422" y2="170" stroke="#0f172a" stroke-width="2" />

  <text x="490" y="175" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#64748b">+ Br⁻</text>
  <text x="420" y="230" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">Inverted Configuration (Umbrella Effect)</text>
</svg>
`)}`;
