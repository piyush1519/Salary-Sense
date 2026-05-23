"use client";
import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell,
} from "recharts";
import {
  Search, TrendingUp, Award, CheckCircle, XCircle, Lightbulb,
  Download, BookOpen, ChevronDown, X, Zap, Target, BarChart3,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const COLORS = ["#00D4FF","#7C3AED","#10b981","#f59e0b","#a855f7","#06b6d4","#f43f5e","#84cc16"];

/* ── Multi-select searchable dropdown ─────────────────────────── */
function SkillSelect({
  skills, selected, onChange,
}: { skills: string[]; selected: string[]; onChange: (s: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => skills.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s)).slice(0, 40),
    [skills, query, selected]
  );

  const toggle = (skill: string) =>
    onChange(selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill]);

  return (
    <div ref={ref} className="relative">
      {/* Selected chips */}
      <div
        className="min-h-[46px] w-full bg-navy/70 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:border-cyan-ai/60 focus-within:ring-1 focus-within:ring-cyan-ai/30 transition-all"
        onClick={() => setOpen(true)}
      >
        {selected.map(s => (
          <span key={s} className="inline-flex items-center gap-1 bg-cyan-ai/10 border border-cyan-ai/25 text-cyan-ai text-xs px-2 py-1 rounded-lg">
            {s}
            <button onClick={e => { e.stopPropagation(); toggle(s); }} className="hover:text-white">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] bg-transparent text-white text-sm outline-none placeholder-slate-500"
          placeholder={selected.length === 0 ? "Search and select your skills…" : "Add more…"}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            className="absolute z-50 left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          >
            <div className="max-h-56 overflow-y-auto p-1">
              {filtered.map(s => (
                <button
                  key={s}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-cyan-ai/10 hover:text-cyan-ai rounded-lg transition-colors"
                  onMouseDown={() => { toggle(s); setQuery(""); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Animated progress bar ────────────────────────────────────── */
function AnimatedBar({ value, color = "#00D4FF", height = "h-3" }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`w-full bg-slate-700/50 rounded-full overflow-hidden ${height}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

/* ── Score ring ───────────────────────────────────────────────── */
function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 42, cx = 52, cy = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={104} height={104}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E293B" strokeWidth={10} />
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={18} fontWeight="700" fontFamily="JetBrains Mono,monospace">{value}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize={10}>{label}</text>
      </svg>
    </div>
  );
}

export default function SkillGapPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  /* data fetches */
  const { data: rolesData } = useQuery({ queryKey: ["sg-roles"], queryFn: () => api.get("/skill-gap/roles").then(r => r.data) });
  const { data: skillsData } = useQuery({ queryKey: ["all-skills"], queryFn: () => api.get("/skill-gap/all-skills").then(r => r.data) });

  const roles: string[] = rolesData?.roles ?? [];
  const allSkills: string[] = skillsData?.skills ?? [];

  const analyzeMut = useMutation({
    mutationFn: (payload: { role: string; user_skills: string[] }) =>
      api.post("/skill-gap/analyze", payload).then(r => r.data),
    onSuccess: data => setResult(data),
  });

  const handleAnalyze = () => {
    if (!selectedRole || selectedSkills.length === 0) return;
    analyzeMut.mutate({ role: selectedRole, user_skills: selectedSkills });
  };

  /* download report */
  const handleDownload = (fmt: "csv" | "txt") => {
    if (!result) return;
    if (fmt === "csv") {
      const rows = [
        ["Field", "Value"],
        ["Role", result.role],
        ["Match %", result.match_percentage],
        ["Readiness Score", result.readiness_score],
        ["Matched Skills", result.matched_skills?.join("; ")],
        ["Missing Skills", result.missing_skills?.join("; ")],
        ["Suggested Skills", result.suggested_skills?.join("; ")],
        ["AI Insight", result.ai_message],
      ];
      const csv = rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `skill-gap-${result.role.replace(/ /g,"-")}.csv`; a.click();
    } else {
      const txt = `SALARY-SENSE — SKILL GAP ANALYSIS REPORT\n${"=".repeat(50)}\nRole: ${result.role}\nMatch: ${result.match_percentage}%\nReadiness Score: ${result.readiness_score}%\n\nMatched Skills:\n${result.matched_skills?.map((s: string) => `  ✓ ${s}`).join("\n")}\n\nMissing Skills:\n${result.missing_skills?.map((s: string) => `  ✗ ${s}`).join("\n")}\n\nSuggested to Learn:\n${result.suggested_skills?.map((s: string) => `  → ${s}`).join("\n")}\n\nAI Insight: ${result.ai_message}`;
      const blob = new Blob([txt], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `skill-gap-${result.role.replace(/ /g,"-")}.txt`; a.click();
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-cyan inline-flex mb-4"><Search size={12} /> Skill Gap Analyzer</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            Analyze Your <span className="gradient-text">Skill Gaps</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Select your target role and current skills. Our AI engine compares you against industry benchmarks and generates a personalized upskilling roadmap.
          </p>
        </motion.div>

        {/* Input Panel */}
        <motion.div className="glass-card p-6 rounded-2xl mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading text-xl font-semibold text-white mb-5">Configure Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role selector */}
            <div>
              <label className="text-slate-400 text-sm mb-2 block font-medium">Target Role</label>
              <div className="relative">
                <select
                  className="select-field appearance-none pr-10"
                  value={selectedRole}
                  onChange={e => { setSelectedRole(e.target.value); setResult(null); }}
                >
                  <option value="">— Select a role —</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Skill multi-select */}
            <div>
              <label className="text-slate-400 text-sm mb-2 block font-medium">
                Your Current Skills
                <span className="ml-2 badge-cyan text-xs">{selectedSkills.length} selected</span>
              </label>
              <SkillSelect skills={allSkills} selected={selectedSkills} onChange={setSelectedSkills} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <button
              onClick={handleAnalyze}
              disabled={!selectedRole || selectedSkills.length === 0 || analyzeMut.isPending}
              className="cyber-btn flex items-center gap-2 disabled:opacity-50"
            >
              {analyzeMut.isPending
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
                : <><Zap size={16} /> Analyze Skill Gap</>
              }
            </button>
            {selectedSkills.length > 0 && (
              <button onClick={() => setSelectedSkills([])} className="cyber-btn-outline flex items-center gap-2 text-sm">
                <X size={14} /> Clear Skills
              </button>
            )}
            {result && (
              <div className="flex gap-2 ml-auto">
                <button onClick={() => handleDownload("csv")} className="cyber-btn-outline flex items-center gap-2 text-sm">
                  <Download size={14} /> CSV
                </button>
                <button onClick={() => handleDownload("txt")} className="cyber-btn-outline flex items-center gap-2 text-sm">
                  <Download size={14} /> TXT Report
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {analyzeMut.isError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            Analysis failed — ensure the ML service is running and try again.
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* AI Message */}
              <div className="glass-card glow-border p-5 rounded-2xl mb-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-ai/10 text-cyan-ai flex items-center justify-center shrink-0">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">AI Insight</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.ai_message}</p>
                  {result.salary_range?.length === 2 && (
                    <p className="text-cyan-ai text-sm font-mono mt-1">
                      Target salary range: ${result.salary_range[0].toLocaleString()} – ${result.salary_range[1].toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Score rings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center">
                  <ScoreRing value={result.match_percentage} label="Match" color="#00D4FF" />
                </div>
                <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center">
                  <ScoreRing value={result.readiness_score} label="Readiness" color="#10b981" />
                </div>
                <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="font-mono text-3xl font-bold text-purple-400">{result.matched_skills?.length ?? 0}</div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider">Skills Matched</div>
                  <div className="badge-purple text-xs">{result.demand}</div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="font-mono text-3xl font-bold text-amber-400">{result.missing_skills?.length ?? 0}</div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider">Skills Missing</div>
                  <div className="badge text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {result.missing_skills?.length > 5 ? "High Gap" : result.missing_skills?.length > 2 ? "Moderate Gap" : "Low Gap"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar chart */}
                <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <Target size={18} className="text-cyan-ai" /> You vs. Industry Benchmark
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={result.radar_data ?? []}>
                      <PolarGrid stroke="rgba(71,85,105,0.4)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Required" dataKey="required" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={2} />
                      <Radar name="You" dataKey="yours" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.18} strokeWidth={2} />
                      <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-5 justify-center mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-0.5 bg-cyan-ai inline-block" />Industry Required</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-0.5 bg-purple-400 inline-block" />Your Skills</span>
                  </div>
                </motion.div>

                {/* Skills matched / missing */}
                <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <BarChart3 size={18} className="text-purple-400" /> Skill Breakdown
                  </h3>

                  {/* Matched */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={14} className="text-green-400" />
                      <span className="text-sm font-medium text-white">Matched Skills ({result.matched_skills?.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched_skills?.map((s: string) => (
                        <span key={s} className="badge-green text-xs px-2.5 py-1">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-sm font-medium text-white">Missing Skills ({result.missing_skills?.length})</span>
                    </div>
                    <div className="space-y-2">
                      {result.missing_skills?.slice(0, 8).map((s: string, i: number) => (
                        <div key={s}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{s}</span>
                            <span className="text-red-400">{i < 3 ? "Critical" : i < 6 ? "Important" : "Helpful"}</span>
                          </div>
                          <AnimatedBar
                            value={i < 3 ? 85 : i < 6 ? 65 : 40}
                            color={i < 3 ? "#f43f5e" : i < 6 ? "#f59e0b" : "#64748b"}
                            height="h-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={14} className="text-amber-400" />
                      <span className="text-sm font-medium text-white">Suggested to Learn</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.suggested_skills?.map((s: string) => (
                        <span key={s} className="badge text-xs px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Match score breakdown bar chart */}
              {result.radar_data?.length > 0 && (
                <motion.div className="glass-card p-6 rounded-2xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-400" /> Skill-by-Skill Gap Visualization
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={result.radar_data} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis type="category" dataKey="skill" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} width={150} />
                      <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }} />
                      <Bar dataKey="required" name="Industry Required" fill="#00D4FF" fillOpacity={0.35} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="yours" name="Your Level" fill="#7C3AED" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Suggested learning cards */}
              {result.suggested_skills?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="font-heading text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-cyan-ai" /> Personalized Learning Roadmap
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.suggested_skills.map((skill: string, i: number) => (
                      <motion.div
                        key={skill}
                        className="glass-card-hover p-5 rounded-2xl"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-ai/10 text-cyan-ai flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </div>
                          <span className={`badge text-xs px-2 py-0.5 ${i < 3 ? "badge-cyan" : "badge-purple"}`}>
                            {i < 3 ? "Priority" : "Recommended"}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold mb-2">{skill}</h4>
                        <div className="text-slate-400 text-xs leading-relaxed">
                          {i < 2 ? "Critical gap — focus here first for maximum salary impact." : "Broadens your market appeal and boosts readiness score."}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <div className="text-xs text-green-400 font-mono">
                            Est. time: {i < 2 ? "6–12 weeks" : "3–6 weeks"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
