"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [tab, setTab] = useState<"login" | "register">(
    params?.get("tab") === "register" ? "register" : "login"
  );

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  const set = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint =
        tab === "login" ? "/auth/login" : "/auth/register";

      const { data } = await api.post(endpoint, form);

      if (data.success) {
        setAuth(data.token, data.user);
        router.push("/predict");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role = "developer") => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/demo", { role });

      setAuth(data.token, data.user);
      router.push("/predict");
    } catch {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy bg-grid flex items-center justify-center px-4 py-20">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-ai/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-ai/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center shadow-glow-cyan">
              <Brain size={20} className="text-white" />
            </div>

            <span className="font-heading text-2xl font-bold gradient-text">
              Salary-Sense
            </span>
          </Link>

          <p className="text-slate-400 text-sm mt-2">
            AI-Powered Developer Salary Intelligence
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl glow-border">
          <div className="flex bg-slate-800/60 rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-gradient-to-r from-cyan-ai/20 to-purple-ai/20 text-white border border-cyan-ai/20"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    className="input-field pl-10"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubmit()
                  }
                />

                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">
                  I am a...
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["developer", "👨‍💻 Developer"],
                    ["recruiter", "🎯 Recruiter"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => set("role", val)}
                      className={`px-4 py-3 rounded-xl text-sm border transition-all ${
                        form.role === val
                          ? "border-cyan-ai bg-cyan-ai/10 text-cyan-ai"
                          : "border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="cyber-btn w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "login"
                    ? "Sign In"
                    : "Create Account"}

                  <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-3 text-slate-500 text-xs">
                or try a demo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemo("developer")}
              className="cyber-btn-outline flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              <Zap size={14} />
              Developer Demo
            </button>

            <button
              onClick={() => handleDemo("recruiter")}
              className="cyber-btn-outline flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              <User size={14} />
              Recruiter Demo
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          By continuing, you agree to our transparent AI usage policy.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}