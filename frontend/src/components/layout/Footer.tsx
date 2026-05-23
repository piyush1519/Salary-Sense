import Link from "next/link";
import { Brain, Github, Linkedin, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-navy/80 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-heading text-xl font-bold gradient-text">Salary-Sense</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A Dynamic Model Pool driven developer salary prediction and career intelligence platform.
              Built on research published at I5CPS-2026.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Github size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h4>
            <div className="flex flex-col gap-2">
              {[["Salary Predictor", "/predict"], ["Analytics", "/analytics"], ["Skill Gap", "/skill-gap"], ["Career Intelligence", "/career"], ["Explainability", "/explainability"], ["Research", "/research"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-slate-400 hover:text-cyan-ai text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Research</h4>
            <div className="flex flex-col gap-2">
              {[["Model Pool Architecture", "/research"], ["Explainability (SHAP)", "/explainability"], ["Skill Gap Analysis", "/skill-gap"], ["Recruiter Hub", "/recruiter"], ["About Team", "/about"], ["IEEE Publication", "/research"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-slate-400 hover:text-cyan-ai text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">© 2026 Salary-Sense. Research at Vidyalankar Institute of Technology, Mumbai.</p>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Shield size={12} />
            <span>Transparent AI · Explainable Predictions · Privacy-First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
