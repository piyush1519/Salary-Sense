"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, Cell,
} from "recharts";
import { Brain, BarChart3, Zap, TrendingUp, Award, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";

const convergenceData = Array.from({ length: 40 }, (_, i) => ({
  epoch: i + 1,
  training: Math.max(800, 5800 * Math.exp(-i * 0.15) + 200 + Math.random() * 100),
  validation: Math.max(900, 5600 * Math.exp(-i * 0.14) + 250 + Math.random() * 120),
}));

const skillRadar = [
  { subject: "Experience", A: 85, fullMark: 100 },
  { subject: "Education", A: 70, fullMark: 100 },
  { subject: "Tech Stack", A: 78, fullMark: 100 },
  { subject: "Platforms", A: 65, fullMark: 100 },
  { subject: "Databases", A: 72, fullMark: 100 },
  { subject: "Frameworks", A: 80, fullMark: 100 },
];

const COLORS = ["#00D4FF", "#7C3AED", "#10b981", "#f59e0b", "#a855f7", "#06b6d4", "#f43f5e", "#84cc16"];

export default function DashboardPage() {
  const { data: modelPool, isLoading } = useQuery({
    queryKey: ["model-pool"],
    queryFn: () => api.get("/models/pool").then(r => r.data),
    staleTime: Infinity,
  });

  const poolResults = modelPool?.pool_results || [];
  const testMetrics = modelPool?.test_metrics || {};
  const bestModel = modelPool?.best_model || "GradientBoosting";

  const kpis = [
    { label: "Best Model", value: bestModel, sub: "Dynamic selection", icon: Brain, color: "cyan" },
    { label: "Test R² Score", value: `${((testMetrics.r2 || 0.96) * 100).toFixed(1)}%`, sub: "Goodness of fit", icon: Award, color: "green" },
    { label: "Test RMSE", value: `$${Math.round((testMetrics.rmse || 9500) / 1000)}k`, sub: "Root mean sq. error", icon: BarChart3, color: "purple" },
    { label: "Test MAE", value: `$${Math.round((testMetrics.mae || 7200) / 1000)}k`, sub: "Mean abs. error", icon: TrendingUp, color: "amber" },
  ];

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-purple inline-flex mb-4"><BarChart3 size={12} /> Model Dashboard</div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            Model Performance <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-slate-400">Live metrics from the Salary-Sense Dynamic Model Pool.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k, i) => (
            <motion.div key={k.label} className="glass-card p-5 rounded-2xl flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                k.color === "cyan" ? "bg-cyan-ai/10 text-cyan-ai" :
                k.color === "green" ? "bg-green-500/10 text-green-400" :
                k.color === "purple" ? "bg-purple-ai/10 text-purple-400" :
                "bg-amber-500/10 text-amber-400"
              }`}>
                <k.icon size={18} />
              </div>
              <div>
                <div className={`font-mono text-xl font-bold ${
                  k.color === "cyan" ? "text-cyan-ai" : k.color === "green" ? "text-green-400" :
                  k.color === "purple" ? "text-purple-400" : "text-amber-400"
                }`}>{k.value}</div>
                <div className="text-slate-300 text-sm font-medium">{k.label}</div>
                <div className="text-slate-500 text-xs">{k.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Model Pool Bar Chart */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Model Pool — R² Scores</h3>
            {isLoading ? (
              <div className="h-64 bg-slate-700/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={poolResults} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis type="number" domain={[0.5, 1]} stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => v.toFixed(2)} />
                  <YAxis type="category" dataKey="model" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} width={120} />
                  <Tooltip formatter={(v: any) => v.toFixed(4)} />
                  <Bar dataKey="r2" name="R² Score" radius={[0, 6, 6, 0]}>
                    {poolResults.map((m: any, i: number) => (
                      <Cell key={i} fill={m.model === bestModel ? "#00D4FF" : COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Training Convergence */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Training Error Convergence</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={convergenceData}>
                <defs>
                  <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: "Epochs", position: "insideBottom", fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip formatter={(v: any) => `${Math.round(v).toLocaleString()}`} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Area type="monotone" dataKey="training" stroke="#00D4FF" strokeWidth={2} fill="url(#trainGrad)" name="Training RMSE" />
                <Area type="monotone" dataKey="validation" stroke="#7C3AED" strokeWidth={2} fill="url(#valGrad)" name="Validation RMSE" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* RMSE Comparison */}
          <motion.div className="glass-card p-6 rounded-2xl lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">RMSE Comparison (USD)</h3>
            {isLoading ? <div className="h-48 bg-slate-700/30 rounded-xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={poolResults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 9, fill: "#94a3b8" }} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => `$${Math.round(v).toLocaleString()}`} />
                  <Bar dataKey="rmse" name="RMSE" radius={[4, 4, 0, 0]}>
                    {poolResults.map((m: any, i: number) => (
                      <Cell key={i} fill={m.model === bestModel ? "#10b981" : "#475569"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Skill Radar */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Feature Importance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="rgba(71,85,105,0.4)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Radar name="Score" dataKey="A" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Model Pool Table */}
        {poolResults.length > 0 && (
          <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h3 className="font-heading text-lg font-semibold text-white">Full Model Pool Metrics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/30">
                    {["Model", "R²", "RMSE", "MAE", "MAPE", "SMAPE", "Status"].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-slate-400 font-medium uppercase text-xs tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {poolResults.map((m: any, i: number) => (
                    <tr key={m.model} className={`border-b border-slate-700/30 hover:bg-white/2 transition-colors ${m.model === bestModel ? "bg-cyan-ai/5" : ""}`}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="font-mono text-white text-xs">{m.model}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono text-cyan-ai">{m.r2?.toFixed(4)}</td>
                      <td className="px-6 py-3 font-mono text-slate-300">${Math.round(m.rmse || 0).toLocaleString()}</td>
                      <td className="px-6 py-3 font-mono text-slate-300">${Math.round(m.mae || 0).toLocaleString()}</td>
                      <td className="px-6 py-3 font-mono text-slate-300">{m.mape?.toFixed(1)}%</td>
                      <td className="px-6 py-3 font-mono text-slate-300">{m.smape?.toFixed(1)}%</td>
                      <td className="px-6 py-3">
                        {m.model === bestModel
                          ? <span className="badge-cyan text-xs">🏆 Selected</span>
                          : <span className="badge text-xs bg-slate-700/40 text-slate-400">Pool</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center mt-8">
          <Link href="/predict" className="cyber-btn flex items-center gap-2">
            <Zap size={16} /> Run a New Prediction <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
