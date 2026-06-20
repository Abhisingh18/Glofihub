'use client';

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from 'recharts';

interface Props {
  leadsData: { month: string; leads: number }[];
  revenueData: { month: string; revenue: number }[];
  perfData: { name: string; students: number }[];
}

const card = 'rounded-2xl bg-card border border-foreground/10 shadow-sm p-5';

export function AdminCharts({ leadsData, revenueData, perfData }: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className={card}>
        <h3 className="font-display font-bold text-foreground mb-4">Monthly Leads</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={leadsData} margin={{ left: -20, right: 8, top: 4 }}>
            <defs>
              <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(120,120,120,0.2)' }} />
            <Area type="monotone" dataKey="leads" stroke="#2563EB" strokeWidth={2.5} fill="url(#gLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={card}>
        <h3 className="font-display font-bold text-foreground mb-4">Monthly Revenue (₹)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ left: -10, right: 8, top: 4 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(120,120,120,0.2)' }} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`${card} lg:col-span-2`}>
        <h3 className="font-display font-bold text-foreground mb-4">Counsellor Performance (students)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={perfData} margin={{ left: -20, right: 8, top: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="rgba(120,120,120,0.5)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(120,120,120,0.2)' }} cursor={{ fill: 'rgba(120,120,120,0.08)' }} />
            <Bar dataKey="students" fill="#0A2F6B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
