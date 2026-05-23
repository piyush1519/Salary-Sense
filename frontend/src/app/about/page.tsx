"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Brain, Star, Code, BookOpen, Mail, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const team = [
  {
    name: "Piyush Nimbalkar",
    role: "Lead Researcher & Full Stack AI Engineer",
    email: "piyush.nimbalkar@vit.edu.in",
    linkedin: "https://www.linkedin.com/in/piyushnimbalkar19",
    github: "https://github.com",
    bio: "Architected the Dynamic Model Pool system, end-to-end ML pipeline, and full-stack platform. Research focus: adaptive model selection and explainable AI for career intelligence.",
    skills: ["Model Pool Architecture", "FastAPI", "Next.js 15", "SHAP/LIME", "System Design", "Docker"],
    color: "cyan",
    lead: true,
    contributions: ["Dynamic Model Pool core", "FastAPI ML service", "Next.js frontend", "Docker deployment", "IEEE paper lead author"],
  },
  {
    name: "Prachi Patil",
    role: "ML Engineer & Researcher",
    email: "prachi.patil23@vit.edu.in",
    linkedin: "https://www.linkedin.com/in/prachimarutipatil/",
    github: "https://github.com",
    bio: "Contributed to the feature engineering pipeline, model evaluation framework, and skill-gap analytics module design.",
    skills: ["Scikit-learn", "Feature Engineering", "Data Analysis", "Python", "Statistics"],
    color: "purple",
    lead: false,
    contributions: ["Feature engineering pipeline", "Model evaluation metrics", "Skill-gap analytics", "Dataset preprocessing"],
  },
  {
    name: "Atharva Jadhav",
    role: "ML Engineer & Researcher",
    email: "atharva.jadhav23@vit.edu.in",
    linkedin: "https://www.linkedin.com/in/atharva-jadhav4/",
    github: "https://github.com",
    bio: "Developed the SHAP/LIME explainability layer, PDP/ICE curve visualizations, and contributed to model benchmarking methodology.",
    skills: ["Explainable AI", "SHAP", "LIME", "Data Visualization", "XGBoost", "Python"],
    color: "green",
    lead: false,
    contributions: ["SHAP explainability module", "LIME surrogate models", "PDP/ICE visualization", "Model benchmarking"],
  },
  {
    name: "Sarthak Chaudhari",
    role: "ML Researcher & Data Engineer",
    email: "sarthak.chaudhari23@vit.edu.in",
    linkedin: "https://www.linkedin.com/in/sarthak-chaudhari/",
    github: "https://github.com",
    bio: "Handled data preprocessing, Stack Overflow survey ETL pipeline, outlier detection, salary distribution analysis, and dataset curation.",
    skills: ["Data Engineering", "ETL Pipelines", "Pandas", "NumPy", "Statistics", "Data Cleaning"],
    color: "amber",
    lead: false,
    contributions: ["Stack Overflow ETL pipeline", "Outlier detection", "Dataset curation", "Distribution analysis"],
  },
];

const advisor = {
  name: "Divya Surve",
  role: "Research Advisor & Faculty Guide",
  email: "divya.nimbalkar@vit.edu.in",
  department: "Department of Computer Engineering",
  institution: "Vidyalankar Institute of Technology, Mumbai",
  bio: "Faculty advisor and research supervisor. Guided the research direction, methodology, and IEEE I5CPS-2026 publication process.",
};

const highlights = [
  { icon: Brain, label: "IEEE Publication", desc: "I5CPS-2026 International Conference" },
  { icon: Code, label: "Open Source", desc: "Full-stack AI platform" },
  { icon: Star, label: "11 ML Models", desc: "Dynamic model pool" },
  { icon: BookOpen, label: "Research-Grade", desc: "Peer-reviewed methods" },
];

const colorMap: Record<string, { badge: string; border: string; text: string; bg: string }> = {
  cyan:   { badge: "badge-cyan",   border: "border-cyan-ai/30",   text: "text-cyan-ai",    bg: "bg-cyan-ai/10" },
  purple: { badge: "badge-purple", border: "border-purple-ai/30", text: "text-purple-400", bg: "bg-purple-ai/10" },
  green:  { badge: "badge-green",  border: "border-green-500/30", text: "text-green-400",  bg: "bg-green-500/10" },
  amber:  { badge: "badge text-amber-400 bg-amber-500/10 border-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10" },
};

function SocialButton({ href, icon: Icon, label, color = "text-slate-400" }: { href: string; icon: any; label: string; color?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 cyber-btn-outline text-xs py-1.5 px-3 hover:border-cyan-ai/50 transition-all group`}
    >
      <Icon size={12} className="group-hover:text-cyan-ai transition-colors" />
      {label}
      <ExternalLink size={9} className="opacity-50" />
    </a>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-cyan inline-flex mb-4"><Star size={12} /> Research Team</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
            Meet the <span className="gradient-text">Research Team</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Salary-Sense was built by a dedicated research team at <span className="text-white font-medium">Vidyalankar Institute of Technology, Mumbai</span> —
            published at the IEEE International Conference on Computing, Communication, Control and Cyber-Physical Systems 2026.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {highlights.map((h, i) => (
            <motion.div key={h.label} className="glass-card p-5 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="w-10 h-10 rounded-xl bg-cyan-ai/10 text-cyan-ai flex items-center justify-center mx-auto mb-3">
                <h.icon size={18} />
              </div>
              <div className="text-white font-semibold text-sm">{h.label}</div>
              <div className="text-slate-400 text-xs mt-1">{h.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Lead researcher — full-width card */}
        {team.filter(m => m.lead).map((member) => {
          const c = colorMap[member.color];
          return (
            <motion.div
              key={member.name}
              className={`glass-card glow-border p-8 rounded-3xl mb-10`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="shrink-0">
                  <motion.div
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center text-white text-4xl font-bold shadow-glow-cyan"
                    whileHover={{ scale: 1.05 }}
                  >
                    {member.name[0]}
                  </motion.div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-heading text-2xl font-bold text-white">{member.name}</h3>
                    <span className="badge-cyan text-xs px-3">Lead Researcher</span>
                    <span className="badge-green text-xs px-3">First Author</span>
                  </div>
                  <div className="text-cyan-ai text-sm font-medium mb-3">{member.role}</div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map(s => <span key={s} className="badge-cyan text-xs px-2.5 py-1">{s}</span>)}
                  </div>

                  {/* Contributions */}
                  <div className="mb-4">
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Key Contributions</div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.contributions.map(c => (
                        <span key={c} className="text-xs bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="flex flex-wrap items-center gap-2">
                    <SocialButton href={member.linkedin} icon={Linkedin} label="LinkedIn" />
                    <SocialButton href={member.github} icon={Github} label="GitHub" />
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-ai text-xs transition-colors"
                    >
                      <Mail size={12} /> {member.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Contributors grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {team.filter(m => !m.lead).map((member, i) => {
            const c = colorMap[member.color];
            return (
              <motion.div
                key={member.name}
                className={`glass-card p-6 rounded-2xl border-2 ${c.border} hover:shadow-lg transition-all duration-300 group`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Avatar & name */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-xl font-bold shrink-0`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    {member.name[0]}
                  </motion.div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-white group-hover:text-white">{member.name}</h3>
                    <div className={`text-xs font-medium mt-0.5 ${c.text}`}>{member.role}</div>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-4">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.slice(0, 4).map(s => (
                    <span key={s} className={`badge text-xs px-2 py-0.5 ${c.badge}`}>{s}</span>
                  ))}
                </div>

                {/* Contributions */}
                <div className="mb-4">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1.5">Contributions</div>
                  <ul className="space-y-1">
                    {member.contributions.slice(0, 3).map(con => (
                      <li key={con} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.bg} border ${c.border}`} />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social links */}
                <div className="border-t border-slate-700/50 pt-4 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${c.border} ${c.text} ${c.bg} hover:opacity-90`}
                    >
                      <Linkedin size={12} /> LinkedIn
                      <ExternalLink size={9} className="opacity-60" />
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-all"
                    >
                      <Github size={12} /> GitHub
                    </a>
                  </div>
                  <a href={`mailto:${member.email}`} className="text-slate-500 hover:text-cyan-ai text-xs transition-colors flex items-center gap-1.5">
                    <Mail size={10} /> {member.email}
                  </a>
                </div>
              </motion.div>
            );
          })}

          {/* Advisor card */}
          <motion.div
            className="glass-card p-6 rounded-2xl border-2 border-amber-500/25 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl font-bold shrink-0"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                D
              </motion.div>
              <div>
                <div className="badge text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border-amber-500/20 mb-1.5 inline-flex">Faculty Advisor</div>
                <h3 className="font-heading text-base font-semibold text-white">{advisor.name}</h3>
                <div className="text-amber-400 text-xs font-medium mt-0.5">{advisor.role}</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{advisor.bio}</p>
            <div className="border-t border-slate-700/50 pt-4 space-y-1">
              <div className="text-slate-500 text-xs">{advisor.department}</div>
              <div className="text-slate-500 text-xs">{advisor.institution}</div>
              <a href={`mailto:${advisor.email}`} className="text-amber-400/70 hover:text-amber-400 text-xs transition-colors flex items-center gap-1.5 mt-2">
                <Mail size={10} /> {advisor.email}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Institution banner */}
        <motion.div
          className="glass-card p-8 rounded-3xl text-center glow-border"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Vidyalankar Institute of Technology</h3>
          <p className="text-slate-400 text-sm mb-1">Department of Computer Engineering · Mumbai, India</p>
          <p className="text-cyan-ai text-sm font-semibold mt-2">Published at IEEE I5CPS-2026</p>
          <p className="text-slate-500 text-xs mt-1">979-8-3315-6154-3/26/$31.00 ©2026 IEEE</p>

          {/* Team LinkedIn quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-slate-700/50">
            {[
              { name: "Piyush Nimbalkar", url: "https://www.linkedin.com/in/piyushnimbalkar19" },
              { name: "Prachi Patil", url: "https://www.linkedin.com/in/prachimarutipatil/" },
              { name: "Atharva Jadhav", url: "https://www.linkedin.com/in/atharva-jadhav4/" },
              { name: "Sarthak Chaudhari", url: "https://www.linkedin.com/in/sarthak-chaudhari/" },
            ].map(m => (
              <a
                key={m.name}
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/20 transition-all text-xs font-medium group"
              >
                <Linkedin size={13} className="group-hover:scale-110 transition-transform" />
                {m.name}
                <ExternalLink size={9} className="opacity-50" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
