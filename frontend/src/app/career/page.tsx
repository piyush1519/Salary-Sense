"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import {
  Brain, TrendingUp, Rocket, Star, Target, X, ChevronRight,
  Clock, AlertTriangle, CheckCircle, BookOpen, DollarSign,
  BarChart3, Lightbulb, ArrowRight, Zap, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const COLORS = ["#00D4FF","#7C3AED","#10b981","#f59e0b","#a855f7","#06b6d4","#f43f5e"];

const trajectoryData = [
  { year: "2024", conservative: 65000, moderate: 72000, aggressive: 82000 },
  { year: "2025", conservative: 70000, moderate: 80000, aggressive: 96000 },
  { year: "2026", conservative: 74000, moderate: 89000, aggressive: 113000 },
  { year: "2027", conservative: 77000, moderate: 99000, aggressive: 132000 },
  { year: "2028", conservative: 80000, moderate: 110000, aggressive: 155000 },
  { year: "2029", conservative: 83000, moderate: 122000, aggressive: 180000 },
];

const hiringTrends: Record<string, number> = {
  "ML Engineer": 95, "LLM / GenAI Engineer": 98, "Cloud Architect": 88,
  "Data Scientist": 85, "DevOps / SRE Engineer": 82, "Staff / Principal Engineer": 78,
  "Data Engineer": 80, "Engineering Manager": 72, "Backend Engineer": 75,
  "Full Stack Engineer": 73, "Security Engineer": 70, "Frontend Engineer": 68, "Mobile Developer": 62,
};

const sampleProjects: Record<string, string[]> = {
  "ML Engineer": ["End-to-end ML pipeline with Airflow + MLflow", "Model serving API with FastAPI + Docker", "Real-time prediction system on AWS"],
  "Data Scientist": ["Customer churn prediction with SHAP explanations", "Time-series forecasting dashboard", "A/B test analysis framework"],
  "LLM / GenAI Engineer": ["RAG chatbot with LangChain + Pinecone", "LLM fine-tuning pipeline", "Multi-agent workflow system"],
  "DevOps / SRE Engineer": ["Multi-cloud IaC with Terraform", "GitOps pipeline with ArgoCD + K8s", "Observability stack: Prometheus + Grafana"],
  "Cloud Architect": ["Serverless microservices on AWS", "Multi-region DR architecture", "FinOps cost optimization dashboard"],
  "Backend Engineer": ["High-throughput REST API with Go/Node", "Event-driven system with Kafka", "Database sharding implementation"],
  "Frontend Engineer": ["Component library with Storybook", "Real-time dashboard with WebSockets", "PWA with offline-first architecture"],
  "Data Engineer": ["Streaming ETL with Kafka + Spark", "Data lakehouse on Snowflake + dbt", "Automated data quality framework"],
  "Security Engineer": ["Automated threat detection system", "Zero-trust network implementation", "SIEM dashboard and alerting"],
  "Engineering Manager": ["Team OKR tracking system", "Tech roadmap planning tool", "Engineering metrics dashboard"],
  "Full Stack Engineer": ["SaaS platform with Next.js + Node", "Real-time collaborative editor", "E-commerce with payment integration"],
  "Mobile Developer": ["Cross-platform app with React Native", "Offline-capable mobile app", "Push notification system"],
  "Staff / Principal Engineer": ["Architecture decision record (ADR) system", "Developer productivity metrics platform", "Cross-team migration framework"],
};

/* ── Difficulty badge ──────────────────────────────────────────── */
function DiffBadge({ d }: { d: number }) {
  const cls = d <= 3 ? "badge-green" : d <= 5 ? "badge-cyan" : d <= 7 ? "badge text-amber-400 bg-amber-500/10 border-amber-500/20" : "badge text-red-400 bg-red-500/10 border-red-500/20";
  const label = d <= 3 ? "Easy" : d <= 5 ? "Moderate" : d <= 7 ? "Challenging" : "Hard";
  return <span className={`badge text-xs px-2.5 py-1 ${cls}`}>{label}</span>;
}

/* ── Career path card ──────────────────────────────────────────── */
function PathCard({ path, onClick }: { path: any; onClick: () => void }) {
  return (
    <motion.div
      className="glass-card-hover p-5 rounded-2xl cursor-pointer group"
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-ai/20 to-purple-ai/20 flex items-center justify-center text-cyan-ai">
          <Brain size={18} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`badge text-xs px-2 ${
            path.demand === "Extremely High" ? "badge-cyan" : path.demand === "Very High" ? "badge-green" : "badge-purple"
          }`}>{path.demand}</span>
          <ChevronRight size={14} className="text-slate-500 group-hover:text-cyan-ai transition-colors" />
        </div>
      </div>
      <h3 className="font-heading text-lg font-semibold text-white mb-1 group-hover:text-cyan-ai transition-colors">{path.role}</h3>
      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">{path.description}</p>
      <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
        <div className="font-mono text-sm text-green-400 font-bold">
          ${Math.round(path.salary_range?.[0] / 1000)}k–${Math.round(path.salary_range?.[1] / 1000)}k
        </div>
        <div className="text-xs text-cyan-ai font-semibold">{path.growth} YoY</div>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {path.top_skills?.slice(0, 4).map((s: string) => (
          <span key={s} className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-md">{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Detail Modal ──────────────────────────────────────────────── */
function CareerModal({ path, transition, onClose }: { path: any; transition: any; onClose: () => void }) {
  if (!path) return null;

  const projects = sampleProjects[path.role] ?? ["Build a portfolio project using core skills", "Contribute to open source in this domain", "Write technical blog posts to demonstrate expertise"];
  const hiringScore = hiringTrends[path.role] ?? 70;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-navy border border-slate-700/70 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-navy/95 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">{path.role}</h2>
              <p className="text-slate-400 text-xs">{path.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Salary Range", value: `$${Math.round(path.salary_range?.[0]/1000)}k–$${Math.round(path.salary_range?.[1]/1000)}k`, color: "text-green-400", icon: DollarSign },
              { label: "YoY Growth", value: path.growth, color: "text-cyan-ai", icon: TrendingUp },
              { label: "Market Demand", value: path.demand, color: "text-purple-400", icon: Target },
              { label: "Hiring Trend", value: `${hiringScore}/100`, color: "text-amber-400", icon: BarChart3 },
            ].map(k => (
              <div key={k.label} className="glass-card p-3 rounded-xl text-center">
                <k.icon size={14} className={`${k.color} mx-auto mb-1`} />
                <div className={`font-mono text-sm font-bold ${k.color}`}>{k.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Transition info (shown only when transition data exists) */}
          {transition && (
            <div className="glass-card p-5 rounded-2xl border border-cyan-ai/20">
              <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
                <ArrowRight size={16} className="text-cyan-ai" /> Transition Analysis
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold"><DiffBadge d={transition.difficulty} /></div>
                  <div className="text-slate-500 text-xs mt-1">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-amber-400">{transition.timeline}</div>
                  <div className="text-slate-500 text-xs mt-1">Timeline</div>
                </div>
                <div className="text-center">
                  <div className={`font-mono text-sm font-bold ${transition.salary_gain >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {transition.salary_gain >= 0 ? "+" : ""}${Math.round(transition.salary_gain / 1000)}k/yr
                  </div>
                  <div className="text-slate-500 text-xs mt-1">Salary Impact</div>
                </div>
              </div>
              {transition.missing_skills?.length > 0 && (
                <div>
                  <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Missing Skills to Acquire</div>
                  <div className="flex flex-wrap gap-1.5">
                    {transition.missing_skills.slice(0, 8).map((s: string) => (
                      <span key={s} className="badge text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border-red-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Required skills */}
          <div>
            <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {path.top_skills?.map((s: string, i: number) => (
                <span key={s} className="badge-cyan text-xs px-3 py-1">{s}</span>
              ))}
            </div>
          </div>

          {/* Learning roadmap from transition or generic */}
          {transition?.roadmap?.length > 0 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-purple-400" /> Suggested Learning Path
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
                <div className="space-y-4">
                  {transition.roadmap.map((phase: any, i: number) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center text-white text-xs font-bold shrink-0 z-10">
                        {i + 1}
                      </div>
                      <div className="glass-card p-4 rounded-xl flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">{phase.phase}</h4>
                          <span className="badge-cyan text-xs px-2 py-0.5 flex items-center gap-1">
                            <Clock size={10} /> {phase.duration}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">{phase.action}</p>
                        {phase.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {phase.skills.map((s: string) => (
                              <span key={s} className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended projects */}
          <div>
            <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Rocket size={16} className="text-amber-400" /> Recommended Projects
            </h3>
            <div className="space-y-2">
              {projects.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <span className="text-slate-300 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary insights */}
          <div>
            <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-green-400" /> Salary Insights
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Entry Level", val: path.salary_range?.[0] ?? 80000, color: "text-slate-300" },
                { label: "Mid Level", val: Math.round(((path.salary_range?.[0] ?? 80000) + (path.salary_range?.[1] ?? 150000)) / 2), color: "text-cyan-ai" },
                { label: "Senior Level", val: path.salary_range?.[1] ?? 150000, color: "text-green-400" },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 rounded-xl text-center">
                  <div className={`font-mono text-lg font-bold ${s.color}`}>${Math.round(s.val / 1000)}k</div>
                  <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring trend bar */}
          <div>
            <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={16} className="text-cyan-ai" /> Hiring Trend Score
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-ai to-green-400"
                  initial={{ width: 0 }} animate={{ width: `${hiringScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-cyan-ai font-bold w-12 text-right">{hiringScore}/100</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              {hiringScore >= 90 ? "Extremely hot market — companies are urgently hiring." : hiringScore >= 75 ? "Strong demand — many open positions and competitive offers." : "Steady demand — good opportunities available with right skills."}
            </p>
          </div>

          {/* Growth opportunities */}
          <div className="glass-card p-4 rounded-2xl border border-green-500/20">
            <h3 className="font-heading text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Star size={16} className="text-amber-400" /> Growth Opportunities
            </h3>
            <ul className="space-y-2">
              {[
                `Advance to Staff ${path.role} or Principal Engineer level`,
                "Transition into Engineering Manager or Director of Engineering",
                `Specialize in a sub-domain (e.g., ${path.top_skills?.[0] ?? "core technology"} expertise)`,
                "Build open-source tools — significantly boosts visibility",
                "Speak at conferences and publish technical content",
              ].map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <Lightbulb size={12} className="text-amber-400 mt-1 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CareerPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [modalPath, setModalPath] = useState<any>(null);
  const [modalTransition, setModalTransition] = useState<any>(null);

  const { data: rolesData } = useQuery({ queryKey: ["sg-roles"], queryFn: () => api.get("/skill-gap/roles").then(r => r.data) });
  const { data: pathsData } = useQuery({ queryKey: ["career-paths"], queryFn: () => api.get("/career/all-paths").then(r => r.data) });
  const roles: string[] = rolesData?.roles ?? [];
  const allPaths: any[] = pathsData?.paths ?? [];

  const transitionMut = useMutation({
    mutationFn: (payload: { current_role: string; target_role: string }) =>
      api.post("/career/transition", payload).then(r => r.data),
  });

  const handleTransition = useCallback(async () => {
    if (!currentRole || !targetRole || currentRole === targetRole) return;
    const data = await transitionMut.mutateAsync({ current_role: currentRole, target_role: targetRole });
    const path = allPaths.find(p => p.role === targetRole);
    setModalPath(path ?? { role: targetRole, description: "", top_skills: [] });
    setModalTransition(data);
  }, [currentRole, targetRole, allPaths, transitionMut]);

  const openPath = useCallback((path: any) => {
    setModalPath(path);
    setModalTransition(null);
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-purple inline-flex mb-4"><Brain size={12} /> Career Intelligence</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            AI-Powered <span className="gradient-text">Career Intelligence</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Explore career paths, plan role transitions, and forecast your salary trajectory with AI-powered recommendations.
          </p>
        </motion.div>

        {/* Transition Planner */}
        <motion.div className="glass-card p-6 rounded-2xl mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <ArrowRight size={20} className="text-cyan-ai" /> Role Transition Planner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="text-slate-400 text-sm mb-1.5 block">Current Role</label>
              <div className="relative">
                <select className="select-field pr-10" value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
                  <option value="">— Select current role —</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight size={24} className="text-slate-600" />
            </div>
            <div className="lg:col-span-2">
              <label className="text-slate-400 text-sm mb-1.5 block">Target Role</label>
              <div className="relative">
                <select className="select-field pr-10" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                  <option value="">— Select target role —</option>
                  {roles.filter(r => r !== currentRole).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
          <button
            onClick={handleTransition}
            disabled={!currentRole || !targetRole || currentRole === targetRole || transitionMut.isPending}
            className="cyber-btn flex items-center gap-2 mt-4 disabled:opacity-50"
          >
            {transitionMut.isPending
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing transition…</>
              : <><Zap size={16} /> Analyze Transition</>
            }
          </button>

          {/* Inline transition summary */}
          <AnimatePresence>
            {transitionMut.data && !transitionMut.isPending && (
              <motion.div
                className="mt-6 p-5 rounded-2xl bg-slate-800/50 border border-cyan-ai/20"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }}
              >
                <div className="flex flex-wrap gap-4 items-center mb-4">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    {currentRole} <ArrowRight size={16} className="text-cyan-ai" /> {targetRole}
                  </div>
                  <DiffBadge d={transitionMut.data.difficulty} />
                  <span className="badge-cyan text-xs flex items-center gap-1"><Clock size={10} />{transitionMut.data.timeline}</span>
                  <span className={`font-mono text-sm font-bold ${transitionMut.data.salary_gain >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {transitionMut.data.salary_gain >= 0 ? "+" : ""}${Math.round(transitionMut.data.salary_gain / 1000)}k potential
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Transferable Skills ✓</div>
                    <div className="flex flex-wrap gap-1.5">
                      {transitionMut.data.transferable_skills?.slice(0, 6).map((s: string) => (
                        <span key={s} className="badge-green text-xs px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Skills to Acquire</div>
                    <div className="flex flex-wrap gap-1.5">
                      {transitionMut.data.missing_skills?.slice(0, 6).map((s: string) => (
                        <span key={s} className="badge text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border-red-500/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const path = allPaths.find(p => p.role === targetRole);
                    setModalPath(path ?? { role: targetRole, description: "", top_skills: [] });
                    setModalTransition(transitionMut.data);
                  }}
                  className="cyber-btn flex items-center gap-2 mt-4 text-sm"
                >
                  <BookOpen size={14} /> View Full Roadmap & Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Salary trajectory */}
        <motion.div className="glass-card p-6 rounded-2xl mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h3 className="font-heading text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-ai" /> 5-Year Salary Trajectory Forecast
          </h3>
          <p className="text-slate-400 text-sm mb-5">Three growth scenarios based on skill investment level.</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trajectoryData}>
              <defs>
                {[["aggGrad","#00D4FF"],["modGrad","#7C3AED"],["conGrad","#10b981"]].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => `$${Math.round(v).toLocaleString()}`} contentStyle={{ background: "#1E293B", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="aggressive" stroke="#00D4FF" fill="url(#aggGrad)" strokeWidth={2.5} name="High Growth" />
              <Area type="monotone" dataKey="moderate" stroke="#7C3AED" fill="url(#modGrad)" strokeWidth={2} name="Moderate Growth" />
              <Area type="monotone" dataKey="conservative" stroke="#10b981" fill="url(#conGrad)" strokeWidth={2} name="Conservative" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-3 justify-center flex-wrap">
            {[["#00D4FF","High Growth (+25%/yr)"],["#7C3AED","Moderate (+15%/yr)"],["#10b981","Conservative (+5%/yr)"]].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-0.5 inline-block rounded" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </motion.div>

        {/* All career path cards */}
        <div className="mb-4">
          <h2 className="font-heading text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Star size={22} className="text-amber-400" /> Explore Career Paths
          </h2>
          <p className="text-slate-400 text-sm mb-6">Click any card to see required skills, learning roadmap, salary insights, and growth opportunities.</p>
        </div>

        {allPaths.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allPaths.map((path, i) => (
              <motion.div
                key={path.role}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PathCard path={path} onClick={() => openPath(path)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalPath && (
          <CareerModal
            path={modalPath}
            transition={modalTransition}
            onClose={() => { setModalPath(null); setModalTransition(null); }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
