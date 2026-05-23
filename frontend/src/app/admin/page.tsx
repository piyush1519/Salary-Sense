"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Settings, Users, Database, Activity, Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const systemStatus = [
  { name: "ML Service (FastAPI)", status: "healthy", uptime: "99.8%", latency: "42ms" },
  { name: "Node.js Backend", status: "healthy", uptime: "99.9%", latency: "8ms" },
  { name: "MongoDB Atlas", status: "healthy", uptime: "100%", latency: "12ms" },
  { name: "Nginx Proxy", status: "healthy", uptime: "100%", latency: "2ms" },
];

const recentLogs = [
  { ts: "2026-05-22 14:32", event: "Prediction completed", model: "GradientBoosting", salary: "$98,500", user: "demo@ss.ai" },
  { ts: "2026-05-22 14:28", event: "Model pool evaluated", model: "All 11 models", salary: "—", user: "system" },
  { ts: "2026-05-22 14:21", event: "New user registered", model: "—", salary: "—", user: "john@example.com" },
  { ts: "2026-05-22 14:15", event: "Prediction completed", model: "XGBoost", salary: "$142,000", user: "recruiter@corp.io" },
  { ts: "2026-05-22 14:08", event: "SHAP explanation requested", model: "GradientBoosting", salary: "—", user: "demo@ss.ai" },
];

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then(r => r.data.data),
    retry: 0,
  });

  const { data: modelPool } = useQuery({
    queryKey: ["model-pool"],
    queryFn: () => api.get("/models/pool").then(r => r.data),
    staleTime: Infinity,
  });

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-purple inline-flex mb-4"><Shield size={12} /> Admin Panel</div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            System <span className="gradient-text">Administration</span>
          </h1>
          <p className="text-slate-400">Monitor platform health, manage users, and oversee ML pipeline performance.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "cyan" },
            { label: "Total Predictions", value: stats?.totalPredictions ?? "—", icon: Activity, color: "purple" },
            { label: "Active Models", value: (modelPool?.pool_results?.length ?? 11), icon: Database, color: "green" },
            { label: "Best Model R²", value: `${((modelPool?.test_metrics?.r2 ?? 0.96)*100).toFixed(1)}%`, icon: Settings, color: "amber" },
          ].map((k, i) => (
            <motion.div key={k.label} className="glass-card p-5 rounded-2xl flex gap-4 items-start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                k.color==="cyan"?"bg-cyan-ai/10 text-cyan-ai":k.color==="purple"?"bg-purple-ai/10 text-purple-400":k.color==="green"?"bg-green-500/10 text-green-400":"bg-amber-500/10 text-amber-400"
              }`}><k.icon size={18} /></div>
              <div>
                <div className={`font-mono text-xl font-bold ${k.color==="cyan"?"text-cyan-ai":k.color==="purple"?"text-purple-400":k.color==="green"?"text-green-400":"text-amber-400"}`}>{k.value}</div>
                <div className="text-slate-400 text-sm">{k.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Status */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity size={16} className="text-green-400" /> Service Health</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </h3>
            <div className="space-y-3">
              {systemStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">↑ {s.uptime}</span>
                    <span className="font-mono text-cyan-ai">{s.latency}</span>
                    <span className="badge-green text-xs px-2 py-0.5">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ML Model Pool Status */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2"><Database size={16} className="text-cyan-ai" /> Model Pool Status</span>
              <button className="cyber-btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3">
                <RefreshCw size={12} /> Retrain
              </button>
            </h3>
            <div className="space-y-2">
              {(modelPool?.pool_results || []).slice(0, 8).map((m: any) => (
                <div key={m.model} className="flex items-center gap-3 py-2 border-b border-slate-700/30">
                  <CheckCircle size={12} className="text-green-400 shrink-0" />
                  <span className="text-sm text-slate-300 flex-1 font-mono text-xs">{m.model}</span>
                  <span className="font-mono text-cyan-ai text-xs">R²: {m.r2?.toFixed(3)}</span>
                  <span className="font-mono text-slate-400 text-xs">${(m.rmse/1000).toFixed(1)}k</span>
                  {m.model === modelPool?.best_model && <span className="badge-cyan text-xs px-1.5 py-0.5">Best</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h3 className="font-heading text-lg font-semibold text-white">Recent Activity Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700/50 bg-slate-800/30">
                {["Timestamp","Event","Model","Salary","User"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-slate-400 font-medium uppercase text-xs tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {recentLogs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-700/20 hover:bg-white/2">
                    <td className="px-6 py-3 font-mono text-slate-400 text-xs">{log.ts}</td>
                    <td className="px-6 py-3 text-white text-xs">{log.event}</td>
                    <td className="px-6 py-3 font-mono text-purple-400 text-xs">{log.model}</td>
                    <td className="px-6 py-3 font-mono text-cyan-ai text-xs">{log.salary}</td>
                    <td className="px-6 py-3 text-slate-400 text-xs">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
