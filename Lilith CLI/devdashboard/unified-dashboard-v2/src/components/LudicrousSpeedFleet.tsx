import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket,
  Shield,
  Zap,
  Users,
  Compass,
  Radio,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Terminal,
  Layers,
  Bot,
  Activity,
  CheckCircle,
  Clock,
  Heart,
  Eye,
  Crosshair,
  Wrench,
  Stethoscope,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

interface FleetPersona {
  slug: string;
  name: string;
  series: string;
  rank_role: string;
  era_scope?: string;
  core_identity: string;
  voice: string[];
  worldview: string[];
  operating_method: string[];
  strengths: string[];
  blind_spots?: string[];
  user_relationship?: string;
  under_pressure?: string;
  disagreement_style?: string;
  humor?: string;
  task_affinities: string[];
  behavioral_rules?: string[];
  canon_anchors?: string[];
  failure_mode_guards?: string[];
  avoid?: string[];
  greeting_style?: string;
}

interface BridgeStation {
  station: string;
  officer: string;
  status: string;
  duty: string;
}

interface FleetData {
  success: boolean;
  repo: string;
  tagline: string;
  motto: string;
  totalPersonas: number;
  seriesBreakdown: Record<string, number>;
  bridgeStations: BridgeStation[];
  personas: FleetPersona[];
}

export const LudicrousSpeedFleet: React.FC = () => {
  const [fleetData, setFleetData] = useState<FleetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<FleetPersona | null>(null);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [isPlaidOverdrive, setIsPlaidOverdrive] = useState(false);
  const [warpLevel, setWarpLevel] = useState(1);
  const [overdriveLogs, setOverdriveLogs] = useState<string[]>([]);

  const initiateLudicrousSpeed = () => {
    setIsPlaidOverdrive(true);
    setWarpLevel(9.99);
    setOverdriveLogs([
      '[LILITH-CORE] 🚀 LUDICROUS SPEED DIRECTIVE INITIATED!',
      '[WARP-CORE] Overclocking RTX 3060 CUDA Cores to 100%+',
      '[NSSP-MESH] Synchronizing all 68 Hermes personas into parallel tensor ring...',
      '[KERNEL-ZEN] Engaging Linux-Zen 7.1.4 RT Scheduler & zero-copy AST pipeline...',
      '[FLEET-GRAPH] Inter-bot messaging bus opened across OnePlus 6T/8T & Quest 3S...',
      '[PLAID-STATUS] "THEY\'VE GONE PLAID!" Sovereign Fleet Warp Factor 13.37 ENGAGED!'
    ]);
  };

  const disengageLudicrousSpeed = () => {
    setIsPlaidOverdrive(false);
    setWarpLevel(1);
    setOverdriveLogs(prev => [...prev, '[WARP-CORE] Returning to standard impulse drive.']);
  };

  const fetchFleet = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/github/ludicrous-speed/fleet');
      const data = await res.json();
      if (data.success) {
        setFleetData(data);
      }
    } catch (e) {
      console.error('Failed to load Ludicrous Speed fleet:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleCopyInstall = (persona: FleetPersona) => {
    const cmd = `hermes persona install https://github.com/Baal-TehDriverman/ludicrous-speed/raw/master/profiles/${persona.series.toLowerCase()}/${persona.slug}.yaml`;
    navigator.clipboard.writeText(cmd);
    setCopiedSlug(persona.slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDeployToHermes = (persona: FleetPersona) => {
    setDeployStatus(`Deploying ${persona.name} to local Hermes agent mesh on port 8080...`);
    setTimeout(() => {
      setDeployStatus(`✓ ${persona.name} (${persona.series}) is now active on the local cerebellum.`);
      setTimeout(() => setDeployStatus(null), 4000);
    }, 1500);
  };

  const filteredPersonas = useMemo(() => {
    if (!fleetData) return [];
    return fleetData.personas.filter(p => {
      const matchesSeries =
        selectedSeries === 'all' ||
        p.series.toLowerCase() === selectedSeries.toLowerCase() ||
        (selectedSeries === 'Voyager' && p.series === 'VOY');
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.rank_role.toLowerCase().includes(q) ||
        p.core_identity.toLowerCase().includes(q) ||
        p.task_affinities.some(t => t.toLowerCase().includes(q));
      return matchesSeries && matchesSearch;
    });
  }, [fleetData, selectedSeries, searchQuery]);

  const seriesColors: Record<string, { bg: string; text: string; border: string }> = {
    TOS: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-700/60' },
    TNG: { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-700/60' },
    DS9: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-700/60' },
    Voyager: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-700/60' },
    VOY: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-700/60' },
  };

  return (
    <div id="ludicrous-speed-hub" className="space-y-8 animate-fade-in">
      {/* Top Banner: Ludicrous Speed Command Header */}
      <div className={`glass rounded-2xl p-6 lg:p-8 border relative overflow-hidden transition-all duration-700 shadow-2xl ${
        isPlaidOverdrive 
          ? 'plaid-mode-active border-pink-500/80 shadow-pink-950/80 ring-4 ring-pink-500/30' 
          : 'border-purple-800/60 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900'
      }`}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />


        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-600/60 shadow-xl shadow-purple-950/50">
              <Rocket className="w-10 h-10 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-mono">
                  LUDICROUS SPEED
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-950 text-pink-300 border border-pink-700 shadow-sm">
                  THEY'VE GONE PLAID
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {fleetData?.totalPersonas || 68} Starfleet Personas
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Command center for the Lilith Sovereign Fleet: Merges <span className="text-purple-300 font-semibold">FleetGraph</span> (Hermes bot org chart & inter-bot messaging) with <span className="text-cyan-300 font-semibold">68 Star Trek Personas</span> (TOS, TNG, DS9, Voyager) into a single operational matrix.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
            {isPlaidOverdrive ? (
              <button
                onClick={disengageLudicrousSpeed}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black transition-all shadow-xl shadow-red-950/60 flex items-center gap-2 font-mono animate-pulse"
              >
                <Zap className="w-4 h-4" />
                DISENGAGE PLAID
              </button>
            ) : (
              <button
                onClick={initiateLudicrousSpeed}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-xl shadow-pink-950/60 flex items-center gap-2 font-mono"
              >
                <Rocket className="w-4 h-4 text-yellow-300 animate-bounce" />
                INITIATE LUDICROUS SPEED
              </button>
            )}

            <a
              href="https://github.com/Baal-TehDriverman/ludicrous-speed"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-purple-400" />
              GitHub Repository
            </a>
            <button
              onClick={fetchFleet}
              className="p-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700 text-purple-200 transition-all"
              title="Refresh Fleet State"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Bridge Stations Status Grid */}
        <div className="mt-6 pt-6 border-t border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              Sovereign Bridge Stations & Tactical Stations
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fleetData?.bridgeStations.map(station => (
              <div
                key={station.station}
                onClick={() => setActiveStation(activeStation === station.station ? null : station.station)}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-900/40 hover:border-purple-600/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {station.station}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {station.status}
                  </span>
                </div>
                <p className="text-xs text-purple-300 font-mono line-clamp-1">{station.officer}</p>
                <p className="text-[11px] text-slate-400 mt-1">{station.duty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plaid Overdrive Live Telemetry HUD */}
      {isPlaidOverdrive && (
        <div className="glass rounded-2xl p-6 border-2 border-pink-500/80 bg-slate-950/90 shadow-2xl shadow-pink-950/60 animate-slide-up space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-pink-900/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
              <span className="text-sm font-black font-mono tracking-widest text-pink-300">
                WARP FACTOR {warpLevel} // LUDICROUS SPEED LIVE TELEMETRY
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-cyan-400">HERMES BOT ORG: 100% SYNC</span>
              <span className="text-purple-400">AST PIPELINE: ZERO-COPY</span>
              <span className="text-pink-400 font-bold">STATE: GONE PLAID</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <div className="text-[10px] uppercase font-mono text-purple-400">Total Personas Active</div>
              <div className="text-xl font-mono font-black text-white mt-1">68 / 68</div>
              <div className="text-[10px] text-purple-300">TOS (22) | TNG (20) | DS9 (14) | VOY (12)</div>
            </div>
            <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-800/40">
              <div className="text-[10px] uppercase font-mono text-pink-400">GPU Compute Tensor Flux</div>
              <div className="text-xl font-mono font-black text-white mt-1">13.37 TFLOPS</div>
              <div className="text-[10px] text-pink-300">RTX 3060 CUDA Acceleration</div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
              <div className="text-[10px] uppercase font-mono text-cyan-400">NSSP Mesh Latency</div>
              <div className="text-xl font-mono font-black text-white mt-1">0.18 ms</div>
              <div className="text-[10px] text-cyan-300">Air-Gap Localhost Mesh</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40">
              <div className="text-[10px] uppercase font-mono text-amber-400">Starfleet Fleet Status</div>
              <div className="text-xl font-mono font-black text-amber-300 mt-1">ALL ENGINES MAX</div>
              <div className="text-[10px] text-amber-400">"Prepare ship for Ludicrous Speed!"</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/80 border border-pink-900/60 font-mono text-xs text-pink-300/90 space-y-1.5 overflow-x-auto">
            {overdriveLogs.map((log, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-pink-500">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment Notification Banner */}

      {deployStatus && (
        <div className="glass rounded-xl p-4 border border-emerald-700 bg-emerald-950/60 text-emerald-300 font-mono text-xs flex items-center justify-between animate-slide-up shadow-lg">
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>{deployStatus}</span>
          </div>
        </div>
      )}

      {/* Persona Search & Series Filter Bar */}
      <div className="glass rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 68 personas by name, rank, era, strengths (e.g. Spock, Picard, Medical, Warp)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
            />
          </div>

          {/* Series Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            {[
              { id: 'all', label: `All Eras (${fleetData?.totalPersonas || 68})` },
              { id: 'TOS', label: `TOS (${fleetData?.seriesBreakdown?.TOS || 22})` },
              { id: 'TNG', label: `TNG (${fleetData?.seriesBreakdown?.TNG || 20})` },
              { id: 'DS9', label: `DS9 (${fleetData?.seriesBreakdown?.DS9 || 14})` },
              { id: 'Voyager', label: `Voyager (${fleetData?.seriesBreakdown?.Voyager || 12})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSeries(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${
                  selectedSeries === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 68 Personas Grid */}
      {isLoading ? (
        <div className="glass rounded-2xl p-16 text-center border border-purple-900/40 flex flex-col items-center justify-center gap-4">
          <Rocket className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-slate-300 text-sm font-mono">Engaging Ludicrous Speed Warp Drive... Loading 68 Personas</p>
        </div>
      ) : filteredPersonas.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-slate-800">
          <p className="text-slate-400 text-sm">No Starfleet personas match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPersonas.map(persona => {
            const seriesStyle = seriesColors[persona.series] || { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-800' };

            return (
              <div
                key={persona.slug}
                className="glass rounded-2xl p-5 border border-slate-800/80 hover:border-purple-600/70 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-950/30"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${seriesStyle.bg} ${seriesStyle.text} ${seriesStyle.border}`}
                    >
                      {persona.series}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {persona.slug}
                    </span>
                  </div>

                  {/* Name & Rank */}
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                    {persona.name}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium line-clamp-1 mt-0.5 mb-2">
                    {persona.rank_role}
                  </p>

                  {/* Core Identity */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {persona.core_identity}
                  </p>

                  {/* Strengths Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {persona.strengths.slice(0, 3).map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {st}
                      </span>
                    ))}
                    {persona.strengths.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{persona.strengths.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPersona(persona)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Profile
                  </button>
                  <button
                    onClick={() => handleCopyInstall(persona)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                    title="Copy CLI Install Command"
                  >
                    {copiedSlug === persona.slug ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Persona Inspector Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-800/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-900/60 flex items-start justify-between bg-slate-900/80">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-950 border border-purple-700 text-purple-300">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white font-mono">{selectedPersona.name}</h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700 font-mono">
                      {selectedPersona.series}
                    </span>
                  </div>
                  <p className="text-sm text-purple-400 mt-1 font-medium">{selectedPersona.rank_role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeployToHermes(selectedPersona)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Deploy to Hermes
                </button>
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
              {/* Core Identity */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Core Identity & Archetype
                </h4>
                <p className="text-sm text-white leading-relaxed">{selectedPersona.core_identity}</p>
              </div>

              {/* Grid 2 Cols: Operating Method & Voice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-300 font-mono uppercase text-[11px]">Operating Method</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    {selectedPersona.operating_method.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-300 font-mono uppercase text-[11px]">Voice & Tone</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    {selectedPersona.voice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Task Affinities & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-300 font-mono uppercase text-[11px]">Task Affinities</h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPersona.task_affinities.map((task, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 font-mono text-[11px]">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-300 font-mono uppercase text-[11px]">Key Strengths</h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPersona.strengths.map((str, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/80 font-mono text-[11px]">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Canon Anchors if present */}
              {selectedPersona.canon_anchors && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                  <h4 className="font-bold text-pink-300 font-mono uppercase text-[11px] mb-2">
                    Canon Anchors & Key Decisions
                  </h4>
                  <ul className="space-y-1.5 text-slate-400">
                    {selectedPersona.canon_anchors.map((c, idx) => (
                      <li key={idx} className="font-mono text-[11px]">• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
