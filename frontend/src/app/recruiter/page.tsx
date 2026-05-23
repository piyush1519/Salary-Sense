"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, LineChart, Line, PieChart, Pie,
} from "recharts";
import { Users, TrendingUp, Globe, Download, Filter, FileText, Table, X, CheckCircle, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const COLORS = ["#00D4FF","#7C3AED","#10b981","#f59e0b","#a855f7","#06b6d4"];

const roleComparison = [
  { role: "Backend Eng",     p25: 72000, median: 95000,  p75: 125000, openings: "38k+", growth: "+18%" },
  { role: "Frontend Eng",    p25: 68000, median: 88000,  p75: 115000, openings: "31k+", growth: "+15%" },
  { role: "Full Stack",      p25: 70000, median: 92000,  p75: 120000, openings: "44k+", growth: "+16%" },
  { role: "ML Engineer",     p25: 95000, median: 130000, p75: 170000, openings: "22k+", growth: "+28%" },
  { role: "DevOps/SRE",      p25: 85000, median: 115000, p75: 150000, openings: "26k+", growth: "+20%" },
  { role: "Data Engineer",   p25: 88000, median: 120000, p75: 155000, openings: "28k+", growth: "+24%" },
  { role: "Security Eng",    p25: 80000, median: 110000, p75: 145000, openings: "19k+", growth: "+19%" },
];

const hiringTrend = [
  { month: "Jan", demand: 82 }, { month: "Feb", demand: 85 }, { month: "Mar", demand: 90 },
  { month: "Apr", demand: 87 }, { month: "May", demand: 93 }, { month: "Jun", demand: 98 },
  { month: "Jul", demand: 95 }, { month: "Aug", demand: 102 }, { month: "Sep", demand: 108 },
  { month: "Oct", demand: 112 }, { month: "Nov", demand: 106 }, { month: "Dec", demand: 115 },
];

const sampleCandidates = [
  { name: "Alex Chen",       role: "ML Engineer",     exp: 6, salary: 128000, skills: ["Python","TensorFlow","MLOps","AWS"],   rec: "Strong Hire",   score: 92 },
  { name: "Sarah Johnson",   role: "Backend Engineer", exp: 4, salary: 94000,  skills: ["Node.js","PostgreSQL","Docker","AWS"], rec: "Hire",          score: 81 },
  { name: "Raj Patel",       role: "Data Engineer",   exp: 5, salary: 112000, skills: ["Spark","Kafka","Python","dbt"],        rec: "Hire",          score: 84 },
  { name: "Maria Silva",     role: "DevOps/SRE",      exp: 7, salary: 118000, skills: ["K8s","Terraform","CI/CD","AWS"],       rec: "Strong Hire",   score: 90 },
  { name: "James Kim",       role: "Full Stack",       exp: 3, salary: 88000,  skills: ["React","Node.js","SQL","Docker"],      rec: "Consider",      score: 74 },
  { name: "Priya Sharma",    role: "Data Scientist",  exp: 5, salary: 122000, skills: ["Python","ML","Statistics","Tableau"],  rec: "Strong Hire",   score: 88 },
];

/* ── Custom tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 rounded-xl border border-cyan-ai/20 text-xs">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">${Math.round(p.value).toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Export Modal ────────────────────────────────────────────── */
function ExportModal({ onClose }: { onClose: () => void }) {
  const [fmt, setFmt] = useState<"pdf" | "csv">("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAll, setIncludeAll] = useState(true);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const ts = new Date().toISOString().split("T")[0];

    if (fmt === "csv") {
      const rows = [
        ["Salary-Sense Recruiter Report", ts],
        [""],
        ["MARKET OVERVIEW"],
        ["Metric", "Value"],
        ["Average Developer Salary", "$96,400"],
        ["YoY Salary Growth", "+8.4%"],
        ["Remote Premium", "+12%"],
        ["Hiring Demand YoY", "+23%"],
        [""],
        ["COMPENSATION BENCHMARKS BY ROLE"],
        ["Role", "25th Percentile", "Median", "75th Percentile", "YoY Growth", "Openings"],
        ...roleComparison.map(r => [r.role, `$${(r.p25/1000).toFixed(0)}k`, `$${(r.median/1000).toFixed(0)}k`, `$${(r.p75/1000).toFixed(0)}k`, r.growth, r.openings]),
        [""],
        ["CANDIDATE PIPELINE"],
        ["Name", "Role", "Experience (yrs)", "Predicted Salary", "Top Skills", "Recommendation", "Score"],
        ...sampleCandidates.map(c => [c.name, c.role, c.exp, `$${c.salary.toLocaleString()}`, c.skills.join("; "), c.rec, c.score]),
      ];
      const csv = rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `recruiter-report-${ts}.csv`; a.click();

    } else {
      // PDF — generate a clean printable HTML document and trigger print
      const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:40px;color:#1e293b;background:#fff}
  h1{font-size:28px;color:#0f172a;border-bottom:3px solid #00D4FF;padding-bottom:10px;margin-bottom:6px}
  h2{font-size:18px;color:#1e40af;margin:28px 0 10px;border-left:4px solid #00D4FF;padding-left:10px}
  h3{font-size:14px;color:#475569;margin:0 0 4px}
  .meta{color:#64748b;font-size:13px;margin-bottom:30px}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px}
  th{background:#f1f5f9;padding:8px 12px;text-align:left;font-weight:600;color:#475569;border:1px solid #e2e8f0}
  td{padding:8px 12px;border:1px solid #e2e8f0;color:#334155}
  tr:nth-child(even) td{background:#f8fafc}
  .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}
  .strong-hire{background:#d1fae5;color:#065f46}
  .hire{background:#dbeafe;color:#1e40af}
  .consider{background:#fef3c7;color:#92400e}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
  .kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center}
  .kpi-val{font-size:24px;font-weight:700;color:#0f172a}
  .kpi-lbl{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px;text-align:center}
</style>
</head><body>
<h1>Salary-Sense — Recruiter Intelligence Report</h1>
<p class="meta">Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Platform: Salary-Sense v2.0 &nbsp;|&nbsp; IEEE I5CPS-2026 Research</p>

<h2>Market Overview</h2>
<div class="kpi-grid">
  <div class="kpi"><div class="kpi-val">$96.4k</div><div class="kpi-lbl">Avg Dev Salary</div></div>
  <div class="kpi"><div class="kpi-val">+8.4%</div><div class="kpi-lbl">YoY Growth</div></div>
  <div class="kpi"><div class="kpi-val">+12%</div><div class="kpi-lbl">Remote Premium</div></div>
  <div class="kpi"><div class="kpi-val">+23%</div><div class="kpi-lbl">Hiring Demand</div></div>
</div>

<h2>Compensation Benchmarks by Role</h2>
<table><thead><tr><th>Role</th><th>25th Percentile</th><th>Median</th><th>75th Percentile</th><th>YoY Growth</th><th>Open Positions</th></tr></thead>
<tbody>${roleComparison.map(r => `<tr><td>${r.role}</td><td>$${(r.p25/1000).toFixed(0)}k</td><td><strong>$${(r.median/1000).toFixed(0)}k</strong></td><td>$${(r.p75/1000).toFixed(0)}k</td><td style="color:#16a34a">${r.growth}</td><td>${r.openings}</td></tr>`).join("")}</tbody>
</table>

<h2>Candidate Pipeline Analysis</h2>
<table><thead><tr><th>Candidate</th><th>Role</th><th>Experience</th><th>Predicted Salary</th><th>Key Skills</th><th>Hiring Score</th><th>Recommendation</th></tr></thead>
<tbody>${sampleCandidates.map(c => `<tr><td>${c.name}</td><td>${c.role}</td><td>${c.exp} yrs</td><td>$${c.salary.toLocaleString()}</td><td>${c.skills.slice(0,3).join(", ")}</td><td>${c.score}/100</td><td><span class="badge ${c.rec === "Strong Hire" ? "strong-hire" : c.rec === "Hire" ? "hire" : "consider"}">${c.rec}</span></td></tr>`).join("")}</tbody>
</table>

<h2>Experience-Based Salary Analysis</h2>
<p style="color:#64748b;font-size:13px">Based on Stack Overflow Developer Survey data (18,000+ developers). Salary predictions generated by Salary-Sense Dynamic Model Pool with R² = 0.84.</p>

<div class="footer">Salary-Sense © 2026 · Research: Vidyalankar Institute of Technology, Mumbai · IEEE I5CPS-2026 · Transparent AI · Data-Driven Compensation</div>
</body></html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, "_blank");
      if (w) setTimeout(() => w.print(), 600);
    }
    setExported(true);
    setTimeout(onClose, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-navy border border-slate-700 rounded-2xl w-full max-w-md p-6"
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-semibold text-white">Export Report</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Format select */}
        <div className="mb-5">
          <label className="text-slate-400 text-sm mb-3 block">Export Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFmt("pdf")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${fmt === "pdf" ? "border-cyan-ai bg-cyan-ai/10" : "border-slate-700 hover:border-slate-500"}`}
            >
              <FileText size={22} className={fmt === "pdf" ? "text-cyan-ai" : "text-slate-400"} />
              <span className={`text-sm font-medium ${fmt === "pdf" ? "text-cyan-ai" : "text-slate-400"}`}>PDF Report</span>
              <span className="text-xs text-slate-500">Full analytics + tables</span>
            </button>
            <button
              onClick={() => setFmt("csv")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${fmt === "csv" ? "border-purple-ai bg-purple-ai/10" : "border-slate-700 hover:border-slate-500"}`}
            >
              <Table size={22} className={fmt === "csv" ? "text-purple-400" : "text-slate-400"} />
              <span className={`text-sm font-medium ${fmt === "csv" ? "text-purple-400" : "text-slate-400"}`}>CSV Data</span>
              <span className="text-xs text-slate-500">Raw data for Excel</span>
            </button>
          </div>
        </div>

        {/* Include options */}
        <div className="mb-6 space-y-3">
          <label className="text-slate-400 text-sm block">Include in Report</label>
          {[
            ["All benchmark data", includeAll, setIncludeAll],
            ["Charts & visualizations (PDF)", includeCharts, setIncludeCharts],
          ].map(([label, val, setter]: any) => (
            <label key={label as string} className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${val ? "bg-cyan-ai border-cyan-ai" : "border-slate-600"}`}
                onClick={() => setter(!val)}
              >
                {val && <CheckCircle size={12} className="text-navy" />}
              </div>
              <span className="text-slate-300 text-sm">{label as string}</span>
            </label>
          ))}
        </div>

        {exported ? (
          <div className="flex items-center justify-center gap-2 py-3 text-green-400 font-medium">
            <CheckCircle size={18} /> Report exported successfully!
          </div>
        ) : (
          <button onClick={handleExport} className="cyber-btn w-full flex items-center justify-center gap-2">
            <Download size={16} /> Export {fmt.toUpperCase()} Report
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function RecruiterPage() {
  const [showExport, setShowExport] = useState(false);
  const [filterRole, setFilterRole] = useState("All");

  const { data: byRegion } = useQuery({ queryKey: ["trends","salary-by-region"], queryFn: () => api.get("/trends/salary-by-region").then(r => r.data.data || []) });
  const { data: byEdu } = useQuery({ queryKey: ["trends","salary-by-education"], queryFn: () => api.get("/trends/salary-by-education").then(r => r.data.data || []) });

  const filteredCandidates = filterRole === "All" ? sampleCandidates : sampleCandidates.filter(c => c.role.includes(filterRole));

  const recColor = (rec: string) =>
    rec === "Strong Hire" ? "badge-green" : rec === "Hire" ? "badge-cyan" : "badge text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <motion.div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="badge-purple inline-flex mb-4"><Users size={12} /> Recruiter Intelligence</div>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">
              Recruiter <span className="gradient-text">Analytics Hub</span>
            </h1>
            <p className="text-slate-400">Benchmark compensation, track demand, manage candidates, and export professional reports.</p>
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="cyber-btn flex items-center gap-2 self-start sm:self-auto"
          >
            <Download size={16} /> Export Report
          </button>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg Dev Salary", value: "$96,400", sub: "2026 benchmark", color: "cyan" },
            { label: "YoY Salary Growth", value: "+8.4%", sub: "Tech sector", color: "green" },
            { label: "Remote Premium", value: "+12%", sub: "vs on-site avg", color: "purple" },
            { label: "Hiring Demand", value: "+23%", sub: "vs last year", color: "amber" },
          ].map((k, i) => (
            <motion.div key={k.label} className="glass-card p-5 rounded-2xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={`font-mono text-2xl font-bold mb-1 ${k.color==="cyan"?"text-cyan-ai":k.color==="green"?"text-green-400":k.color==="purple"?"text-purple-400":"text-amber-400"}`}>{k.value}</div>
              <div className="text-slate-300 text-sm font-medium">{k.label}</div>
              <div className="text-slate-500 text-xs">{k.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Salary bands */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Salary Bands by Role (USD)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roleComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => `$${v/1000}k`} />
                <YAxis type="category" dataKey="role" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="p25" name="P25" fill="#334155" stackId="s" />
                <Bar dataKey="median" name="Median" fill="#00D4FF" stackId="m" />
                <Bar dataKey="p75" name="P75" fill="#7C3AED" radius={[0, 4, 4, 0]} stackId="t" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {[["#334155","P25"],["#00D4FF","Median"],["#7C3AED","P75"]].map(([c,l]) => (
                <span key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-3 h-2 rounded inline-block" style={{ background: c }} />{l}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hiring trend */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Developer Hiring Demand 2026</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} name="Demand Index" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Regional */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Globe size={16} className="text-cyan-ai" /> Average Salary by Region
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byRegion || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgSalary" name="Avg Salary" radius={[6,6,0,0]}>
                  {(byRegion||[]).map((_: any, i: number) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Education */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-5">Education Premium Analysis</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byEdu || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgSalary" fill="#a855f7" radius={[6,6,0,0]} name="Avg Salary" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Candidate Pipeline */}
        <motion.div className="glass-card rounded-2xl overflow-hidden mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="px-6 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-semibold text-white">Candidate Pipeline</h3>
              <p className="text-slate-400 text-xs mt-0.5">AI-predicted salaries with hiring recommendations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="select-field text-sm py-2 pr-8 pl-3"
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  {Array.from(new Set(sampleCandidates.map(c => c.role))).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
              <button className="cyber-btn-outline flex items-center gap-1.5 text-xs py-2 px-3"><Filter size={12} /> Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                  {["Candidate","Role","Experience","Predicted Salary","Skills","Score","Recommendation"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-slate-400 font-medium uppercase text-xs tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c, i) => (
                  <motion.tr
                    key={c.name}
                    className="border-b border-slate-700/20 hover:bg-white/2 transition-colors"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 + i * 0.05 }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-ai/30 to-purple-ai/30 flex items-center justify-center text-white text-xs font-bold">
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-white font-medium text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs">{c.role}</td>
                    <td className="px-5 py-3 font-mono text-slate-400 text-xs">{c.exp} yrs</td>
                    <td className="px-5 py-3 font-mono text-cyan-ai font-bold">${c.salary.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map(s => (
                          <span key={s} className="text-xs bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-ai to-green-400" style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="font-mono text-xs text-cyan-ai">{c.score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge text-xs px-2 py-0.5 ${recColor(c.rec)}`}>{c.rec}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Benchmark table */}
        <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-white">Full Compensation Benchmark</h3>
            <button onClick={() => setShowExport(true)} className="cyber-btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3">
              <Download size={12} /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700/50 bg-slate-800/30">
                {["Role","P25","Median","P75","YoY Growth","Openings"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-slate-400 font-medium uppercase text-xs tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {roleComparison.map((r, i) => (
                  <tr key={r.role} className="border-b border-slate-700/30 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-3"><span className="text-white font-medium text-sm">{r.role}</span></td>
                    <td className="px-6 py-3 font-mono text-slate-400 text-xs">${(r.p25/1000).toFixed(0)}k</td>
                    <td className="px-6 py-3 font-mono text-cyan-ai font-bold text-sm">${(r.median/1000).toFixed(0)}k</td>
                    <td className="px-6 py-3 font-mono text-slate-400 text-xs">${(r.p75/1000).toFixed(0)}k</td>
                    <td className="px-6 py-3"><span className="text-green-400 text-xs font-mono">{r.growth}</span></td>
                    <td className="px-6 py-3 text-slate-300 text-xs">{r.openings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
