"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { TrendingUp, Globe, GraduationCap, Monitor, Building2, BarChart3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const CYAN = "#00D4FF";
const PURPLE = "#7C3AED";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const COLORS = [CYAN, PURPLE, GREEN, AMBER, "#a855f7", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 rounded-xl border border-cyan-ai/20 text-sm">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">${Math.round(p.value).toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

function ChartCard({ title, icon: Icon, children, className = "" }: any) {
  return (
    <motion.div
      className={`glass-card p-6 rounded-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-cyan-ai/10 text-cyan-ai flex items-center justify-center">
          <Icon size={16} />
        </div>
        <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Skeleton() {
  return <div className="h-64 bg-slate-700/30 rounded-xl animate-pulse" />;
}

export default function AnalyticsPage() {
  const useT = (key: string) => useQuery({
    queryKey: ["trends", key],
    queryFn: () => api.get(`/trends/${key}`).then(r => r.data.data || []),
    staleTime: 10 * 60 * 1000,
  });

  const { data: byExp, isLoading: expLoading } = useT("salary-by-experience");
  const { data: byRegion, isLoading: regLoading } = useT("salary-by-region");
  const { data: byEdu, isLoading: eduLoading } = useT("salary-by-education");
  const { data: byWork, isLoading: workLoading } = useT("salary-by-workmode");
  const { data: byOrg, isLoading: orgLoading } = useT("salary-by-orgsize");
  const { data: dist, isLoading: distLoading } = useT("distribution");

  const { data: modelPool } = useQuery({
    queryKey: ["model-pool"],
    queryFn: () => api.get("/models/pool").then(r => r.data),
    staleTime: Infinity,
  });

  const kpis = [
    { label: "Avg Developer Salary", value: "$78,400", sub: "USD annually", color: "cyan" },
    { label: "Top Region", value: "N. America", sub: "$108k average", color: "purple" },
    { label: "Best Model R²", value: `${((modelPool?.test_metrics?.r2 || 0.96) * 100).toFixed(1)}%`, sub: "prediction accuracy", color: "green" },
    { label: "Dataset Size", value: "18,000+", sub: "developer profiles", color: "cyan" },
  ];

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge-cyan inline-flex mb-4"><TrendingUp size={12} /> Salary Analytics</div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            Market Intelligence <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Real-time salary analytics powered by Stack Overflow Developer Survey data and our ML pipeline.
          </p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((k, i) => (
            <motion.div key={k.label} className="glass-card p-5 rounded-2xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`font-mono text-2xl font-bold mb-1 ${k.color === "cyan" ? "text-cyan-ai" : k.color === "purple" ? "text-purple-400" : "text-green-400"}`}>
                {k.value}
              </div>
              <div className="text-slate-300 text-sm font-medium">{k.label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Salary by Experience */}
          <ChartCard title="Salary by Experience" icon={TrendingUp}>
            {expLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={byExp}>
                  <defs>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CYAN} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CYAN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="avgSalary" stroke={CYAN} strokeWidth={2} fill="url(#expGrad)" name="Avg Salary" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Salary by Region */}
          <ChartCard title="Salary by Region" icon={Globe}>
            {regLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byRegion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="label" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgSalary" name="Avg Salary" radius={[0, 6, 6, 0]}>
                    {(byRegion || []).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Salary by Education */}
          <ChartCard title="Salary by Education Level" icon={GraduationCap}>
            {eduLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byEdu}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgSalary" fill={PURPLE} radius={[6, 6, 0, 0]} name="Avg Salary" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Salary by Work Mode */}
          <ChartCard title="Salary by Work Mode" icon={Monitor}>
            {workLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={byWork} dataKey="avgSalary" nameKey="label" cx="50%" cy="50%"
                    outerRadius={90} label={({ label, avgSalary }) => `${label}: $${Math.round(avgSalary / 1000)}k`}
                    labelLine={{ stroke: "#64748b" }}>
                    {(byWork || []).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `$${Math.round(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Full-width charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Salary Distribution */}
          <ChartCard title="Salary Distribution" icon={BarChart3}>
            {distLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="bin" stroke="#64748b" tick={{ fontSize: 9, fill: "#94a3b8" }} angle={-30} textAnchor="end" height={50} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={GREEN} radius={[4, 4, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Salary by Org Size */}
          <ChartCard title="Salary by Organization Size" icon={Building2}>
            {orgLoading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={byOrg}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="avgSalary" stroke={AMBER} strokeWidth={2.5} dot={{ fill: AMBER, r: 4 }} name="Avg Salary" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Model Pool Performance */}
        {modelPool?.pool_results && (
          <ChartCard title="Model Pool — R² Score Comparison" icon={BarChart3} className="mb-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={modelPool.pool_results}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[0.7, 1]} />
                <Tooltip formatter={(v: any) => v.toFixed(4)} />
                <Bar dataKey="r2" name="R² Score" radius={[6, 6, 0, 0]}>
                  {modelPool.pool_results.map((_: any, i: number) => (
                    <Cell key={i} fill={i === 0 ? CYAN : COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
      <Footer />
    </div>
  );
}
