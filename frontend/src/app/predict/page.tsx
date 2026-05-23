"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Award, Target, ChevronRight, RotateCcw, Brain, BarChart3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import Link from "next/link";

const ORG_SIZES = ["1-9", "10-19", "20-99", "100-499", "500-999", "1000-4999", "5000-9999", "10000+"];

const STEPS = [
  { id: 1, title: "Experience & Role", fields: ["experience", "role", "orgSize"] },
  { id: 2, title: "Education & Skills", fields: ["education", "skills"] },
  { id: 3, title: "Location & Work Mode", fields: ["region", "workMode"] },
];

const defaultForm = {
  YearsCodePro: 5, WorkExp: 5,
  NumberOfDatabasesKnown: 3, NumberOfPlatformsKnown: 3, NumberOfWebFrameworksKnown: 3,
  OrgSize: "100-499",
  // Work mode
  Remote: 0, Hybrid: 0, In_person: 1,
  // Employment
  Full_time: 1, Freelancer: 0, Part_time: 0,
  // Education
  Bachelors: 1, Masters: 0, Doctorate: 0, Associate: 0, College: 0,
  // Role
  Developer: 1, DataTech: 0, Database: 0, Designer: 0,
  Education_role: 0, Management: 0, Research: 0, Security: 0, SysAdmin: 0,
  // Region
  North_America: 1, Europe: 0, Asia: 0, South_America: 0, Africa: 0, Oceania: 0,
  // Industry
  IT_Software: 1, Finance: 0, Healthcare: 0, Manufacturing: 0,
};

function ResultCard({ label, value, sub, color = "cyan" }: any) {
  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-mono text-2xl font-bold ${color === "cyan" ? "text-cyan-ai" : color === "green" ? "text-green-400" : "text-purple-400"}`}>{value}</div>
      {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "#00D4FF" }: any) {
  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

export default function PredictPage() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [allModels, setAllModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0=form, 1=result

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
  const setExcl = (group: string[], key: string) => {
    const updates: any = {};
    group.forEach(k => updates[k] = 0);
    updates[key] = 1;
    setForm(f => ({ ...f, ...updates }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const [predRes, allRes] = await Promise.allSettled([
        api.post("/predict", form),
        api.post("/predict/all-models", form),
      ]);
      if (predRes.status === "fulfilled") setResult(predRes.value.data);
      if (allRes.status === "fulfilled") setAllModels(allRes.value.data.predictions || []);
      setStep(1);
    } catch (err) {
      alert("Prediction failed. Check that the ML service is running.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setAllModels([]); setStep(0); };

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-cyan inline-flex mb-4"><Zap size={12} /> AI Salary Predictor</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            Know Your <span className="gradient-text">Market Value</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our Dynamic Model Pool evaluates 11 ML algorithms on your profile and selects the best prediction.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Experience & Role ── */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-ai/20 text-cyan-ai text-xs flex items-center justify-center font-bold">1</div>
                    Experience & Role
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Years of Professional Coding</label>
                      <input type="range" min="0" max="30" value={form.YearsCodePro}
                        onChange={e => set("YearsCodePro", +e.target.value)}
                        className="w-full accent-cyan-ai" />
                      <div className="text-cyan-ai font-mono text-sm mt-1">{form.YearsCodePro} years</div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Total Work Experience</label>
                      <input type="range" min="0" max="35" value={form.WorkExp}
                        onChange={e => set("WorkExp", +e.target.value)}
                        className="w-full accent-cyan-ai" />
                      <div className="text-cyan-ai font-mono text-sm mt-1">{form.WorkExp} years</div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Organization Size</label>
                      <select className="select-field" value={form.OrgSize} onChange={e => set("OrgSize", e.target.value)}>
                        {ORG_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Primary Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[["Developer", "Developer"], ["DataTech", "Data/AI"], ["Management", "Management"], ["Security", "Security"], ["Designer", "Designer"], ["Research", "Research"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["Developer","DataTech","Database","Designer","Education_role","Management","Research","Security","SysAdmin"], key)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${(form as any)[key] ? "border-cyan-ai bg-cyan-ai/10 text-cyan-ai" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Employment Type</label>
                      <div className="flex gap-2">
                        {[["Full_time","Full-time"],["Freelancer","Freelance"],["Part_time","Part-time"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["Full_time","Freelancer","Part_time"], key)}
                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-all ${(form as any)[key] ? "border-cyan-ai bg-cyan-ai/10 text-cyan-ai" : "border-slate-700 text-slate-400"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Education & Skills ── */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-ai/20 text-purple-400 text-xs flex items-center justify-center font-bold">2</div>
                    Education & Skills
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Highest Education</label>
                      <div className="space-y-2">
                        {[["Bachelors","Bachelor's Degree"],["Masters","Master's Degree"],["Doctorate","Doctorate / PhD"],["Associate","Associate Degree"],["College","Some College"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["Bachelors","Masters","Doctorate","Associate","College"], key)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border text-left transition-all ${(form as any)[key] ? "border-purple-ai bg-purple-ai/10 text-purple-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Databases Known</label>
                      <input type="range" min="0" max="15" value={form.NumberOfDatabasesKnown}
                        onChange={e => set("NumberOfDatabasesKnown", +e.target.value)} className="w-full accent-purple-ai" />
                      <div className="text-purple-400 font-mono text-sm mt-1">{form.NumberOfDatabasesKnown}</div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Platforms Known</label>
                      <input type="range" min="0" max="15" value={form.NumberOfPlatformsKnown}
                        onChange={e => set("NumberOfPlatformsKnown", +e.target.value)} className="w-full accent-purple-ai" />
                      <div className="text-purple-400 font-mono text-sm mt-1">{form.NumberOfPlatformsKnown}</div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block">Web Frameworks Known</label>
                      <input type="range" min="0" max="12" value={form.NumberOfWebFrameworksKnown}
                        onChange={e => set("NumberOfWebFrameworksKnown", +e.target.value)} className="w-full accent-purple-ai" />
                      <div className="text-purple-400 font-mono text-sm mt-1">{form.NumberOfWebFrameworksKnown}</div>
                    </div>
                  </div>
                </div>

                {/* ── Location & Work Mode ── */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center font-bold">3</div>
                    Location & Work Mode
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Region</label>
                      <div className="space-y-2">
                        {[["North_America","North America 🇺🇸"],["Europe","Europe 🇪🇺"],["Asia","Asia 🌏"],["South_America","South America 🌎"],["Oceania","Oceania 🦘"],["Africa","Africa 🌍"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["North_America","Europe","Asia","South_America","Oceania","Africa"], key)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm border text-left transition-all ${(form as any)[key] ? "border-green-500 bg-green-500/10 text-green-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Work Mode</label>
                      <div className="flex gap-2">
                        {[["Remote","🏠 Remote"],["Hybrid","⚡ Hybrid"],["In_person","🏢 On-site"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["Remote","Hybrid","In_person"], key)}
                            className={`flex-1 px-2 py-2.5 rounded-lg text-xs font-medium border transition-all text-center ${(form as any)[key] ? "border-green-500 bg-green-500/10 text-green-300" : "border-slate-700 text-slate-400"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Industry</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[["IT_Software","IT & Software"],["Finance","Finance"],["Healthcare","Healthcare"],["Manufacturing","Manufacturing"]].map(([key, label]) => (
                          <button key={key} onClick={() => setExcl(["IT_Software","Finance","Healthcare","Manufacturing"], key)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${(form as any)[key] ? "border-green-500 bg-green-500/10 text-green-300" : "border-slate-700 text-slate-400"}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <motion.button
                  onClick={handlePredict}
                  disabled={loading}
                  className="cyber-btn flex items-center gap-3 mx-auto text-lg py-5 px-12 disabled:opacity-60"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Profile...</>
                  ) : (
                    <><Brain size={22} /> Predict My Salary <ChevronRight size={18} /></>
                  )}
                </motion.button>
                <p className="text-slate-500 text-sm mt-3">11 models will compete to predict your optimal salary</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {result && (
                <div className="space-y-8">
                  {/* Hero Result */}
                  <div className="glass-card glow-border p-8 rounded-3xl text-center">
                    <div className="badge-green inline-flex mb-4">
                      <Award size={12} /> Model Used: {result.modelUsed}
                    </div>
                    <div className="font-mono text-6xl lg:text-7xl font-bold gradient-text mb-3">
                      ${Math.round(result.predictedSalary).toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-lg mb-2">Predicted Annual Salary (USD)</div>
                    <div className="text-slate-500 text-sm">
                      Range: ${Math.round(result.salaryRange?.low).toLocaleString()} – ${Math.round(result.salaryRange?.high).toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                      <ResultCard label="Market Percentile" value={`${result.marketPercentile?.toFixed(1)}%`} sub="vs all developers" color="cyan" />
                      <ResultCard label="Career Score" value={result.careerScore} sub="out of 100" color="purple" />
                      <ResultCard label="Model R² Score" value={`${((result.r2Score || 0) * 100).toFixed(1)}%`} sub="prediction accuracy" color="green" />
                      <ResultCard label="Salary Range" value={`±$${Math.round((result.salaryRange?.high - result.salaryRange?.low) / 2 / 1000)}k`} sub="confidence interval" color="cyan" />
                    </div>
                  </div>

                  {/* Model Pool Comparison */}
                  {allModels.length > 0 && (
                    <div className="glass-card p-6 rounded-2xl">
                      <h3 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <BarChart3 size={20} className="text-cyan-ai" /> Model Pool Comparison
                      </h3>
                      <div className="space-y-3">
                        {allModels.slice(0, 8).map((m: any) => (
                          <div key={m.model} className="flex items-center gap-4">
                            <div className="w-36 text-sm text-slate-400 shrink-0 font-mono">{m.model}</div>
                            <div className="flex-1">
                              <ProgressBar value={m.prediction} max={Math.max(...allModels.map((x: any) => x.prediction)) * 1.1} color={m.model === result.modelUsed ? "#00D4FF" : "#475569"} />
                            </div>
                            <div className={`font-mono text-sm shrink-0 w-28 text-right ${m.model === result.modelUsed ? "text-cyan-ai font-bold" : "text-slate-400"}`}>
                              ${Math.round(m.prediction).toLocaleString()}
                            </div>
                            {m.model === result.modelUsed && <div className="badge-cyan text-xs shrink-0">SELECTED</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={reset} className="cyber-btn-outline flex items-center gap-2">
                      <RotateCcw size={16} /> New Prediction
                    </button>
                    <Link href="/analytics" className="cyber-btn-outline flex items-center gap-2">
                      <BarChart3 size={16} /> View Analytics
                    </Link>
                    <Link href="/skill-gap" className="cyber-btn flex items-center gap-2">
                      <TrendingUp size={16} /> Analyze Skill Gaps
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
