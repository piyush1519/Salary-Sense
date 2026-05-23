"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Shield, Brain, ChevronRight, Zap, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import Link from "next/link";

// Static demo SHAP data shown before a real prediction is run
const demoShap = [
  { feature: "YearsCodePro", shap_value: 0.38, impact: "positive" },
  { feature: "North America", shap_value: 0.29, impact: "positive" },
  { feature: "Masters", shap_value: 0.18, impact: "positive" },
  { feature: "NumberOfDatabasesKnown", shap_value: 0.14, impact: "positive" },
  { feature: "Remote", shap_value: 0.11, impact: "positive" },
  { feature: "GradientBoosting (model)", shap_value: 0.09, impact: "positive" },
  { feature: "NumberOfPlatformsKnown", shap_value: 0.07, impact: "positive" },
  { feature: "Full-time", shap_value: 0.05, impact: "positive" },
  { feature: "Africa", shap_value: -0.21, impact: "negative" },
  { feature: "College (no degree)", shap_value: -0.15, impact: "negative" },
  { feature: "Part-time", shap_value: -0.13, impact: "negative" },
  { feature: "KNN", shap_value: -0.08, impact: "negative" },
  { feature: "SysAdmin", shap_value: -0.06, impact: "negative" },
  { feature: "1-9 employees", shap_value: -0.04, impact: "negative" },
];

const explainMethods = [
  {
    name: "SHAP",
    full: "SHapley Additive exPlanations",
    formula: "ŷ = φ₀ + Σ φᵢ",
    desc: "Decomposes each prediction into per-feature contributions grounded in cooperative game theory. The sum of all SHAP values equals the difference between the predicted value and the model's base (expected) value.",
    color: "cyan",
    global: true,
    local: true,
  },
  {
    name: "LIME",
    full: "Local Interpretable Model-Agnostic Explanations",
    formula: "g(z) = w₀ + w₁z₁ + … + wₐzₐ",
    desc: "Fits a simple linear surrogate model in the local neighborhood of each prediction instance. Provides instance-level interpretability without requiring access to model internals.",
    color: "purple",
    global: false,
    local: true,
  },
  {
    name: "PDP",
    full: "Partial Dependence Plots",
    formula: "PDP(xⱼ) = E_{x¬ⱼ}[f(xⱼ, x¬ⱼ)]",
    desc: "Shows the marginal effect of one or two features on the predicted salary, averaged over the full data distribution. Useful for understanding global feature-outcome relationships.",
    color: "green",
    global: true,
    local: false,
  },
  {
    name: "ICE",
    full: "Individual Conditional Expectation",
    formula: "ICEᵢ(xⱼ) = f(xⱼ, x⁽ⁱ⁾₋ⱼ)",
    desc: "Extends PDP to individual instances, revealing heterogeneous effects that a global PDP would average out. Critical for detecting interaction effects across different developer profiles.",
    color: "amber",
    global: false,
    local: true,
  },
];

// Simple waterfall component
function WaterfallChart({ data, baseValue = 0 }: { data: typeof demoShap; baseValue?: number }) {
  const sorted = [...data].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));
  const maxAbs = Math.max(...sorted.map((d) => Math.abs(d.shap_value)));

  return (
    <div className="space-y-2.5">
      {sorted.map((item, i) => {
        const pct = (Math.abs(item.shap_value) / maxAbs) * 100;
        const isPos = item.impact === "positive";
        return (
          <motion.div
            key={item.feature}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="text-xs text-slate-400 w-48 shrink-0 text-right truncate font-mono">
              {item.feature.replace("num__", "").replace("bool__", "").replace("cat__OrgSize_", "")}
            </div>
            <div className="flex-1 relative h-6 flex items-center">
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-600" />
              <div
                className={`h-4 rounded-sm absolute ${isPos ? "left-1/2" : "right-1/2"}`}
                style={{
                  width: `${pct / 2}%`,
                  background: isPos
                    ? "linear-gradient(90deg,#00D4FF,#06b6d4)"
                    : "linear-gradient(90deg,#7C3AED,#a855f7)",
                }}
              />
            </div>
            <div
              className={`font-mono text-xs w-16 text-right shrink-0 font-bold ${
                isPos ? "text-cyan-ai" : "text-purple-400"
              }`}
            >
              {isPos ? "+" : ""}
              {item.shap_value.toFixed(3)}
            </div>
          </motion.div>
        );
      })}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 w-48 text-right shrink-0 font-semibold">Base value</div>
        <div className="flex-1" />
        <div className="font-mono text-xs text-slate-400 w-16 text-right">
          {baseValue.toFixed(3)}
        </div>
      </div>
    </div>
  );
}

export default function ExplainabilityPage() {
  const [shapData, setShapData] = useState(demoShap);
  const [baseValue, setBaseValue] = useState(10.85);
  const [modelName, setModelName] = useState("GradientBoosting (demo)");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Fetch real SHAP for a default profile
  const fetchShap = async () => {
    setLoading(true);
    try {
      const defaultProfile = {
        YearsCodePro: 7, WorkExp: 7,
        NumberOfDatabasesKnown: 4, NumberOfPlatformsKnown: 3, NumberOfWebFrameworksKnown: 3,
        OrgSize: "100-499",
        Remote: 1, Hybrid: 0, In_person: 0,
        Full_time: 1, Freelancer: 0, Part_time: 0,
        Bachelors: 0, Masters: 1, Doctorate: 0, Associate: 0, College: 0,
        Developer: 1, DataTech: 0, Database: 0, Designer: 0,
        Education_role: 0, Management: 0, Research: 0, Security: 0, SysAdmin: 0,
        North_America: 1, Europe: 0, Asia: 0, South_America: 0, Africa: 0, Oceania: 0,
        IT_Software: 1, Finance: 0, Healthcare: 0, Manufacturing: 0,
      };
      const { data } = await api.post("/explain/shap", defaultProfile);
      if (data.success && data.contributions?.length) {
        setShapData(data.contributions);
        setBaseValue(data.base_value ?? 10.85);
        setModelName(data.model ?? "GradientBoosting");
        setFetched(true);
      }
    } catch {
      // keep demo data
    } finally {
      setLoading(false);
    }
  };

  // Bar chart data for Recharts view
  const barData = [...shapData]
    .sort((a, b) => b.shap_value - a.shap_value)
    .map((d) => ({
      ...d,
      label: d.feature
        .replace("num__", "")
        .replace("bool__", "")
        .replace("cat__OrgSize_", "OrgSize:")
        .slice(0, 22),
    }));

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-cyan inline-flex mb-4">
            <Shield size={12} /> Explainability Layer
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            AI <span className="gradient-text">Explainability</span> Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Every salary prediction is transparent. Understand exactly which features drive your
            compensation estimate — powered by SHAP, LIME, PDP and ICE.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={fetchShap}
              disabled={loading}
              className="cyber-btn flex items-center gap-2 text-sm py-2.5 px-5 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap size={14} />
              )}
              {fetched ? "Refresh Live SHAP" : "Load Live SHAP Data"}
            </button>
            <Link href="/predict" className="cyber-btn-outline flex items-center gap-2 text-sm py-2.5 px-5">
              <Brain size={14} /> Predict with Explanation <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {explainMethods.map((m, i) => (
            <motion.div
              key={m.name}
              className={`glass-card p-5 rounded-2xl border-2 ${
                m.color === "cyan" ? "border-cyan-ai/30" :
                m.color === "purple" ? "border-purple-ai/30" :
                m.color === "green" ? "border-green-500/30" :
                "border-amber-500/30"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`font-mono text-xl font-bold mb-1 ${
                m.color==="cyan"?"text-cyan-ai":m.color==="purple"?"text-purple-400":m.color==="green"?"text-green-400":"text-amber-400"
              }`}>{m.name}</div>
              <div className="text-slate-400 text-xs mb-2">{m.full}</div>
              <div className={`font-mono text-xs p-2 rounded-lg mb-3 ${
                m.color==="cyan"?"bg-cyan-ai/5":m.color==="purple"?"bg-purple-ai/5":m.color==="green"?"bg-green-500/5":"bg-amber-500/5"
              }`}>{m.formula}</div>
              <p className="text-slate-500 text-xs leading-relaxed">{m.desc}</p>
              <div className="flex gap-2 mt-3">
                {m.global && <span className="badge text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 border-slate-600/30">Global</span>}
                {m.local && <span className="badge text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 border-slate-600/30">Local</span>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* SHAP Waterfall */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-white flex items-center gap-2">
                <Shield size={18} className="text-cyan-ai" /> SHAP Waterfall Chart
              </h3>
              <span className="badge-cyan text-xs">{modelName.split(" ")[0]}</span>
            </div>
            {!fetched && (
              <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2 mb-4">
                <Info size={14} className="text-amber-400 shrink-0" />
                <span className="text-amber-400 text-xs">Showing demo data — click "Load Live SHAP Data" for real values.</span>
              </div>
            )}
            <WaterfallChart data={shapData} baseValue={baseValue} />
            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700/50">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-2 rounded-sm inline-block bg-gradient-to-r from-cyan-ai to-cyan-glow" />
                Positive contribution
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-2 rounded-sm inline-block bg-gradient-to-r from-purple-ai to-purple-400" />
                Negative contribution
              </span>
            </div>
          </motion.div>

          {/* SHAP Bar Chart */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          >
            <h3 className="font-heading text-lg font-semibold text-white mb-6">
              Feature Impact — Signed SHAP Values
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#64748b"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  width={130}
                />
                <Tooltip
                  formatter={(v: any) => v.toFixed(4)}
                  contentStyle={{ background: "#1E293B", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }}
                />
                <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
                <Bar dataKey="shap_value" name="SHAP value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.impact === "positive" ? "#00D4FF" : "#7C3AED"}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Global Feature Importance */}
        <motion.div
          className="glass-card p-6 rounded-2xl mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          <h3 className="font-heading text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Brain size={18} className="text-purple-400" /> Global Feature Importance (Aggregated SHAP)
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Mean absolute SHAP values across all predictions — shows which features matter most globally.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { feature: "Years of Experience", importance: 0.38, rank: 1 },
              { feature: "Region (North America)", importance: 0.29, rank: 2 },
              { feature: "Education Level", importance: 0.21, rank: 3 },
              { feature: "Skills Count (DB/Platform/FW)", importance: 0.17, rank: 4 },
              { feature: "Work Mode (Remote)", importance: 0.12, rank: 5 },
              { feature: "Organization Size", importance: 0.09, rank: 6 },
            ].map((f, i) => (
              <motion.div
                key={f.feature}
                className="flex items-center gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
              >
                <span className="font-mono text-lg font-bold text-slate-600 w-6 shrink-0">
                  #{f.rank}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-slate-300 mb-1">{f.feature}</div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-ai to-purple-ai rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${f.importance * 250}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.05 }}
                    />
                  </div>
                </div>
                <span className="font-mono text-sm text-cyan-ai font-bold w-12 text-right">
                  {f.importance.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Explainability Equations Reference */}
        <motion.div
          className="glass-card p-6 rounded-2xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Info size={18} className="text-cyan-ai" /> Mathematical Foundations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "SHAP Decomposition",
                eq: "ŷ = φ₀ + Σᵢ φᵢ",
                note: "φ₀ = base value, φᵢ = feature i contribution",
              },
              {
                title: "LIME Surrogate",
                eq: "g(z) = w₀ + w₁z₁ + ⋯ + wₐzₐ",
                note: "Locally weighted linear model around the instance",
              },
              {
                title: "Partial Dependence",
                eq: "PDP(xⱼ) = E_{x¬ⱼ}[f(xⱼ, x¬ⱼ)]",
                note: "Marginal effect of feature j, averaged over all others",
              },
              {
                title: "Individual Conditional Expectation",
                eq: "ICEᵢ(xⱼ) = f(xⱼ, x⁽ⁱ⁾₋ⱼ)",
                note: "PDP per-instance — reveals heterogeneous effects",
              },
            ].map((eq) => (
              <div
                key={eq.title}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30"
              >
                <div className="text-cyan-ai text-sm font-semibold mb-2">{eq.title}</div>
                <div className="font-mono text-purple-300 text-sm bg-navy/60 px-3 py-2 rounded-lg mb-2">
                  {eq.eq}
                </div>
                <div className="text-slate-500 text-xs">{eq.note}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
