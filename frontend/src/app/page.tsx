"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, BarChart3, Zap, TrendingUp, Shield, Star, ChevronRight, Search, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// ── Animated Counter ──────────────────────────────────
function Counter({ to, prefix = "", suffix = "", duration = 2 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = to / (duration * 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, to);
          setCount(Math.round(start));
          if (start >= to) clearInterval(timer);
        }, 1000 / 60);
        observer.disconnect();
        return () => clearInterval(timer);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── Neural Network Background ─────────────────────────
function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800">
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <circle cx={100 + i * 95} cy={200 + Math.sin(i * 0.8) * 120} r="4" fill="#00D4FF">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            {i < 11 && (
              <line
                x1={100 + i * 95} y1={200 + Math.sin(i * 0.8) * 120}
                x2={100 + (i + 1) * 95} y2={200 + Math.sin((i + 1) * 0.8) * 120}
                stroke="#00D4FF" strokeWidth="1" strokeDasharray="4 4"
              >
                <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
              </line>
            )}
          </g>
        ))}
        {/* Second layer */}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={`b${i}`}>
            <circle cx={200 + i * 110} cy={500 + Math.cos(i * 0.9) * 100} r="3" fill="#7C3AED">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${5 + (i * 19 % 90)}%`,
            top: `${10 + (i * 13 % 80)}%`,
            background: i % 2 === 0 ? "#00D4FF" : "#7C3AED",
            opacity: 0.3,
            animation: `float ${4 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const features = [
  { icon: Brain, title: "Dynamic Model Pool", desc: "11 ML algorithms compete on every prediction. The best model wins — automatically.", color: "cyan" },
  { icon: Zap, title: "Explainable AI", desc: "SHAP, LIME, PDP & ICE explanations reveal exactly why each salary is predicted.", color: "purple" },
  { icon: Search, title: "Skill Gap Analyzer", desc: "Identify missing skills, estimate salary uplift, and get AI-curated learning paths.", color: "green" },
  { icon: TrendingUp, title: "Career Intelligence", desc: "Forecast your salary trajectory with AI-powered growth modeling.", color: "cyan" },
  { icon: Users, title: "Recruiter Analytics", desc: "Benchmark compensation, visualize market demand, export intelligence reports.", color: "purple" },
  { icon: Shield, title: "Research-Grade", desc: "Built on peer-reviewed research published at IEEE I5CPS-2026.", color: "green" },
];

const models = [
  { name: "GradientBoosting", r2: 0.96, color: "#00D4FF" },
  { name: "RandomForest", r2: 0.95, color: "#7C3AED" },
  { name: "XGBoost", r2: 0.94, color: "#10b981" },
  { name: "LightGBM", r2: 0.93, color: "#f59e0b" },
  { name: "Stacking", r2: 0.95, color: "#a855f7" },
  { name: "ExtraTrees", r2: 0.92, color: "#06b6d4" },
];

export default function LandingPage() {
  const { data: modelData } = useQuery({
    queryKey: ["model-pool"],
    queryFn: () => api.get("/models/pool").then(r => r.data),
    staleTime: Infinity,
  });

  const poolResults = modelData?.pool_results || models;
  const bestModel = modelData?.best_model || "GradientBoosting";

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-grid">
        <NeuralBackground />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-ai/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-ai/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 badge-cyan mb-8 py-2 px-4 text-sm">
              <Star size={12} />
              <span>IEEE I5CPS-2026 Research Publication</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          >
            Predict Developer Salaries<br />
            <span className="gradient-text">with Explainable AI</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          >
            Dynamic Model Pool Powered Career Intelligence Platform — 11 ML models compete in real-time,
            SHAP explains every prediction, and AI maps your career trajectory.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/predict" className="cyber-btn flex items-center justify-center gap-2 text-base py-4 px-8">
              <Zap size={18} /> Start Prediction
              <ArrowRight size={16} />
            </Link>
            <Link href="/analytics" className="cyber-btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
              <BarChart3 size={18} /> Explore Analytics
            </Link>
            <Link href="/research" className="cyber-btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
              <Brain size={18} /> View Research
            </Link>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { label: "ML Models", value: 11, suffix: "", prefix: "" },
              { label: "Training Samples", value: 18000, suffix: "+", prefix: "" },
              { label: "Best R² Score", value: 96, suffix: "%", prefix: "" },
              { label: "Features Used", value: 37, suffix: "", prefix: "" },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-card p-4 rounded-2xl text-center">
                <div className="font-mono text-2xl font-bold gradient-text">
                  <Counter to={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="text-slate-400 text-xs mt-1 uppercase tracking-wider">{kpi.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-cyan-ai rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Model Pool Section ───────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-purple inline-flex mb-4">Dynamic Model Pool</div>
            <h2 className="section-title mb-4">11 Models Compete on Every Prediction</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              The scoring engine selects the best-performing model for each unique developer profile in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(poolResults.length > 0 ? poolResults : models).slice(0, 6).map((m: any, i: number) => (
              <motion.div
                key={m.model || m.name}
                className={`glass-card p-4 rounded-2xl text-center border-2 ${(m.model || m.name) === bestModel ? "border-cyan-ai/60 shadow-glow-cyan" : "border-transparent"}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              >
                {(m.model || m.name) === bestModel && (
                  <div className="badge-cyan text-xs mb-2 inline-flex">🏆 Best</div>
                )}
                <div className="font-mono text-xl font-bold text-cyan-ai">{((m.r2 || 0) * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-400 mt-1">R²</div>
                <div className="text-xs text-white font-medium mt-2 truncate">{m.model || m.name}</div>
                {m.rmse && <div className="text-xs text-slate-500 mt-1">${(m.rmse / 1000).toFixed(1)}k RMSE</div>}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard" className="cyber-btn-outline inline-flex items-center gap-2 text-sm">
              View Full Model Comparison <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-slate-panel/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Enterprise AI Intelligence Platform</h2>
            <p className="section-subtitle max-w-2xl mx-auto">Every feature designed to power smarter career and compensation decisions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card-hover p-6 rounded-2xl"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  f.color === "cyan" ? "bg-cyan-ai/10 text-cyan-ai" :
                  f.color === "purple" ? "bg-purple-ai/10 text-purple-400" :
                  "bg-green-500/10 text-green-400"
                }`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card p-12 rounded-3xl glow-border"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="badge-cyan inline-flex mb-6">Ready to get started?</div>
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Know Your Market Value.<br />
              <span className="gradient-text">Predict. Explain. Grow.</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join developers and recruiters using Salary-Sense to make data-driven compensation decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/predict" className="cyber-btn flex items-center justify-center gap-2 text-base py-4 px-8">
                Start Free Prediction <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="cyber-btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
                Meet the Research Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
