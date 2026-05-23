"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Brain, BarChart3, Zap, Users, Settings, LogOut, Menu, X, TrendingUp, Search, Shield, Info } from "lucide-react";

const navLinks = [
  { href: "/predict", label: "Predict", icon: Zap },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/skill-gap", label: "Skill Gap", icon: Search },
  { href: "/career", label: "Career AI", icon: Brain },
  { href: "/explainability", label: "Explain", icon: Shield },
  { href: "/recruiter", label: "Recruiter", icon: Users },
  { href: "/research", label: "Research", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-navy/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center shadow-glow-cyan">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-heading text-xl font-bold gradient-text">Salary-Sense</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? "text-cyan-ai bg-cyan-ai/10 border border-cyan-ai/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center text-white text-sm font-bold">
                  {user.name[0]}
                </div>
                <button onClick={logout} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="cyber-btn-outline text-sm py-2 px-4">Sign In</Link>
                <Link href="/login?tab=register" className="cyber-btn text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy/98 backdrop-blur-xl border-b border-slate-700/50 px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === href ? "text-cyan-ai bg-cyan-ai/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                <Link href="/login" className="flex-1 cyber-btn-outline text-center py-2.5 text-sm">Sign In</Link>
                <Link href="/login?tab=register" className="flex-1 cyber-btn text-center py-2.5 text-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
