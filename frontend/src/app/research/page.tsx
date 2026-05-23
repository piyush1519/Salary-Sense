"use client";
import { motion } from "framer-motion";
import { Brain, Database, Cpu, BarChart3, Shield, Layers, ChevronRight, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const pipelineSteps = [
  { icon: Database, label: "Raw Dataset", sub: "Stack Overflow Survey 18k rows", color: "cyan", step: 1 },
  { icon: Layers, label: "Preprocessing", sub: "Cleaning, encoding, log-transform", color: "purple", step: 2 },
  { icon: Cpu, label: "Feature Engineering", sub: "Normalization, interactions, embeddings", color: "green", step: 3 },
  { icon: Brain, label: "Model Pool Training", sub: "11 regressors + stacking ensemble", color: "cyan", step: 4 },
  { icon: BarChart3, label: "Scoring Engine", sub: "Best model by RMSE on validation", color: "purple", step: 5 },
  { icon: Shield, label: "Explainability", sub: "SHAP, LIME, PDP, ICE", color: "green", step: 6 },
];

const models = [
  { name: "Linear Regression", type: "Linear", r2: "~0.72", note: "Baseline" },
  { name: "Ridge Regression", type: "Regularized", r2: "~0.74", note: "L2 penalty" },
  { name: "Lasso Regression", type: "Regularized", r2: "~0.73", note: "L1 sparsity" },
  { name: "ElasticNet", type: "Regularized", r2: "~0.73", note: "L1+L2" },
  { name: "Random Forest", type: "Ensemble", r2: "~0.95", note: "300 trees" },
  { name: "Extra Trees", type: "Ensemble", r2: "~0.92", note: "Randomized" },
  { name: "Gradient Boosting", type: "Boosting", r2: "~0.96", note: "Best model" },
  { name: "XGBoost", type: "Boosting", r2: "~0.94", note: "Depth=6" },
  { name: "LightGBM", type: "Boosting", r2: "~0.93", note: "Fast" },
  { name: "K-Nearest Neighbors", type: "Instance", r2: "~0.78", note: "k=7" },
  { name: "Stacking Ensemble", type: "Meta", r2: "~0.95", note: "RF+GB+XGB" },
];

const explainMethods = [
  { name: "SHAP", full: "SHapley Additive exPlanations", desc: "Decomposes each prediction into per-feature contributions. Provides both global and local explanations grounded in game theory.", color: "cyan" },
  { name: "LIME", full: "Local Interpretable Model-Agnostic Explanations", desc: "Approximates complex model behavior locally with a linear surrogate. Explains individual predictions.", color: "purple" },
  { name: "PDP", full: "Partial Dependence Plots", desc: "Shows the marginal effect of one or two features on the predicted outcome, averaged over the data distribution.", color: "green" },
  { name: "ICE", full: "Individual Conditional Expectation", desc: "Extends PDP to individual instances, revealing heterogeneous feature effects across different developer profiles.", color: "amber" },
];

const metrics = [
  { name: "RMSE", formula: "√(Σ(y - ŷ)² / n)", use: "Primary selection metric, sensitive to outliers" },
  { name: "MAE", formula: "Σ|y - ŷ| / n", use: "Absolute error in USD terms" },
  { name: "MAPE", formula: "100 × Σ|y - ŷ| / y / n", use: "Scale-independent percentage error" },
  { name: "SMAPE", formula: "100 × Σ 2|y - ŷ|/(|y|+|ŷ|) / n", use: "Symmetric version of MAPE" },
  { name: "R²", formula: "1 - SS_res / SS_tot", use: "Goodness of fit; prioritized in scoring" },
];

const references = [
  { id: 1, text: "Akay et al., 'Development of salary prediction models for the IT industry,' J. Data Science & Modern Techniques, 2025." },
  { id: 2, text: "Alsheyab et al., 'Job market cheat codes: Prototyping salary prediction,' arXiv:2506.15879, 2025." },
  { id: 3, text: "Rikala et al., 'Understanding and measuring skill gaps in Industry 4.0,' Tech. Forecasting & Social Change, 2024." },
  { id: 4, text: "Cimplifi, 'Transparency, explainability and interpretability of AI,' 2023." },
  { id: 5, text: "Bao Q., 'Enhancing salary prediction with advanced ML models,' Applied & Computational Eng., 2024." },
  { id: 8, text: "Chicco et al., 'The coefficient of determination R² is more informative than SMAPE, MAE, MAPE,' PeerJ CS, 2021." },
  { id: 11, text: "Stack Overflow Inc., 'Stack Overflow Developer Survey,' 2023." },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-purple inline-flex mb-4"><FileText size={12} /> IEEE I5CPS-2026</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
            Research <span className="gradient-text">Architecture</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Salary-Sense: A Model Pool Driven Developer Salary Prediction and Career Intelligence System.<br />
            Published at the International Conference on Computing, Communication, Control and Cyber-Physical Systems.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {["Piyush Nimbalkar","Prachi Patil","Atharva Jadhav","Sarthak Chaudhari","Divya Surve"].map(a => (
              <span key={a} className="badge-cyan text-xs px-3 py-1">{a}</span>
            ))}
          </div>
        </motion.div>

        {/* System Pipeline */}
        <motion.div className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h2 className="font-heading text-2xl font-bold text-white mb-8 text-center">End-to-End System Pipeline</h2>
          <div className="flex flex-wrap justify-center gap-2 items-center">
            {pipelineSteps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <motion.div
                  className={`glass-card p-4 rounded-2xl text-center w-36 border-2 ${
                    s.color === "cyan" ? "border-cyan-ai/30" : s.color === "purple" ? "border-purple-ai/30" : "border-green-500/30"
                  }`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                    s.color === "cyan" ? "bg-cyan-ai/10 text-cyan-ai" : s.color === "purple" ? "bg-purple-ai/10 text-purple-400" : "bg-green-500/10 text-green-400"
                  }`}>
                    <s.icon size={18} />
                  </div>
                  <div className="text-white text-xs font-semibold">{s.label}</div>
                  <div className="text-slate-500 text-xs mt-1 leading-tight">{s.sub}</div>
                </motion.div>
                {i < pipelineSteps.length - 1 && <ChevronRight size={20} className="text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Pool Table */}
          <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h3 className="font-heading text-lg font-semibold text-white">Model Pool — 11 Regressors</h3>
            </div>
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-700/50 bg-slate-800/30">
                  {["Model","Type","R²","Note"].map(h => <th key={h} className="text-left px-4 py-2 text-slate-400 text-xs uppercase tracking-wider">{h}</th>)}
                </tr></thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.name} className="border-b border-slate-700/20 hover:bg-white/2">
                      <td className="px-4 py-2.5 text-white text-xs font-mono">{m.name}</td>
                      <td className="px-4 py-2.5">
                        <span className={`badge text-xs px-2 ${m.type === "Boosting" ? "badge-cyan" : m.type === "Ensemble" ? "badge-purple" : m.type === "Meta" ? "badge-green" : "bg-slate-700/40 text-slate-400 border-slate-600/30"}`}>{m.type}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-cyan-ai text-xs">{m.r2}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Explainability Methods */}
          <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <h3 className="font-heading text-lg font-semibold text-white mb-5">Explainability Layer</h3>
            <div className="space-y-4">
              {explainMethods.map((e) => (
                <div key={e.name} className={`p-4 rounded-xl border ${
                  e.color === "cyan" ? "border-cyan-ai/20 bg-cyan-ai/5" :
                  e.color === "purple" ? "border-purple-ai/20 bg-purple-ai/5" :
                  e.color === "green" ? "border-green-500/20 bg-green-500/5" :
                  "border-amber-500/20 bg-amber-500/5"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-sm font-bold ${e.color === "cyan" ? "text-cyan-ai" : e.color === "purple" ? "text-purple-400" : e.color === "green" ? "text-green-400" : "text-amber-400"}`}>{e.name}</span>
                    <span className="text-slate-400 text-xs">— {e.full}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Evaluation Metrics */}
        <motion.div className="glass-card p-6 rounded-2xl mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="font-heading text-lg font-semibold text-white mb-5">Evaluation Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((m) => (
              <div key={m.name} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                <div className="font-mono text-cyan-ai font-bold text-sm mb-1">{m.name}</div>
                <div className="font-mono text-purple-400 text-xs mb-2 break-all">{m.formula}</div>
                <div className="text-slate-400 text-xs">{m.use}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Engineering */}
        <motion.div className="glass-card p-6 rounded-2xl mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <h3 className="font-heading text-lg font-semibold text-white mb-5">Feature Engineering Pipeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Log Transform", desc: "Salary skew correction: y' = log(1+y)", color: "cyan" },
              { name: "StandardScaler", desc: "Normalize numeric features", color: "purple" },
              { name: "One-Hot Encoding", desc: "Categorical → binary vectors", color: "green" },
              { name: "Target Encoding", desc: "TE(ci) = E[y | ci]", color: "cyan" },
              { name: "Interaction Features", desc: "Cross-feature products: x₁ · x₂", color: "purple" },
              { name: "Feature Selection", desc: "Regularization + recursive elimination", color: "green" },
            ].map((f) => (
              <div key={f.name} className={`p-3 rounded-xl text-center border ${
                f.color === "cyan" ? "border-cyan-ai/20 bg-cyan-ai/5" : f.color === "purple" ? "border-purple-ai/20 bg-purple-ai/5" : "border-green-500/20 bg-green-500/5"
              }`}>
                <div className={`text-xs font-bold mb-1 ${f.color === "cyan" ? "text-cyan-ai" : f.color === "purple" ? "text-purple-400" : "text-green-400"}`}>{f.name}</div>
                <div className="text-slate-400 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* References */}
        <motion.div className="glass-card p-6 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FileText size={18} className="text-cyan-ai" /> References
          </h3>
          <div className="space-y-2">
            {references.map((r) => (
              <div key={r.id} className="flex gap-3 text-sm">
                <span className="text-cyan-ai font-mono text-xs shrink-0 mt-0.5">[{r.id}]</span>
                <span className="text-slate-400 text-xs leading-relaxed">{r.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
