'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, LogOut, Search, Trash2, Download, Mail, Phone, MapPin,
  GraduationCap, Calendar, RefreshCw, Inbox, ShieldCheck,
} from 'lucide-react';
import { adminIsAuthed, adminSignOut } from '@/lib/adminAuth';
import { getLeads, deleteLead, clearLeads, type Lead } from '@/lib/leads';

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');

  const refresh = async () => {
    try {
      setLeads(await getLeads());
    } catch {
      setLeads([]);
    }
  };

  // Auth gate
  useEffect(() => {
    (async () => {
      if (!(await adminIsAuthed())) {
        router.replace('/admin');
        return;
      }
      setAuthed(true);
      await refresh();
    })();
  }, [router]);

  const logout = async () => {
    await adminSignOut();
    router.replace('/admin');
  };

  const removeOne = async (id: string) => {
    await deleteLead(id);
    await refresh();
  };

  const wipeAll = async () => {
    if (confirm('Delete ALL student records? This cannot be undone.')) {
      await clearLeads();
      await refresh();
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.city, l.service, l.preference, l.message]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [leads, query]);

  const stats = useMemo(() => {
    const total = leads.length;
    const services = leads.reduce<Record<string, number>>((acc, l) => {
      const k = l.service || 'Unspecified';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = leads.filter((l) => l.createdAt >= weekAgo).length;
    const topServices = Object.entries(services).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { total, recent, topServices };
  }, [leads]);

  const exportCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Age', 'Service', 'Preference', 'Message', 'Date'];
    const rows = leads.map((l) => [
      l.name, l.email, l.phone, l.city, l.age, l.service, l.preference,
      (l.message || '').replace(/\n/g, ' '),
      new Date(l.createdAt).toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `glofihub-students-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!authed) return null;

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-primary via-primary to-accent text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/15 ring-2 ring-white/25 flex items-center justify-center">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">Admin Dashboard</h1>
              <p className="text-[11px] font-medium text-white/75">GlofiHub · Student Enquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer" title="Refresh">
              <RefreshCw size={17} />
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition cursor-pointer">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md shadow-primary/25">
                <Users size={20} />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold text-foreground leading-none">{stats.total}</p>
                <p className="text-xs font-medium text-foreground/55 mt-1">Total Students</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <Calendar size={20} />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold text-foreground leading-none">{stats.recent}</p>
                <p className="text-xs font-medium text-foreground/55 mt-1">This Week</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm">
            <p className="text-xs font-semibold text-foreground/50 tracking-wide mb-3">Top Interests</p>
            {stats.topServices.length === 0 ? (
              <p className="text-sm text-foreground/40 font-medium">No data yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stats.topServices.map(([name, count]) => (
                  <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold text-primary">
                    {name} <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px]">{count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, city, interest…"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-foreground/10 focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} disabled={!leads.length} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-foreground/10 text-sm font-semibold text-foreground hover:border-primary/40 transition disabled:opacity-40 cursor-pointer">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={wipeAll} disabled={!leads.length} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm font-semibold text-rose-600 hover:bg-rose-500/20 transition disabled:opacity-40 cursor-pointer">
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Inbox size={30} className="text-foreground/30" />
            </span>
            <p className="font-display text-lg font-bold text-foreground">No student records yet</p>
            <p className="text-sm text-foreground/55 font-medium mt-1">
              {leads.length === 0
                ? 'Submissions from the Student form will appear here.'
                : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((l) => (
              <div key={l.id} className="group relative p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                      {l.name?.[0]?.toUpperCase() || '?'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-foreground leading-tight truncate">{l.name}</p>
                      <p className="text-[11px] text-foreground/45 font-medium">{fmtDate(l.createdAt)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeOne(l.id)} className="p-2 rounded-lg text-foreground/40 hover:text-rose-600 hover:bg-rose-500/10 transition cursor-pointer" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>

                {l.service && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/15 text-[11px] font-semibold text-primary mb-3">
                    <GraduationCap size={12} /> {l.service}
                  </span>
                )}

                <div className="space-y-2 text-sm">
                  <a href={`mailto:${l.email}`} className="flex items-center gap-2 text-foreground/75 hover:text-primary transition-colors">
                    <Mail size={14} className="text-foreground/40 shrink-0" /> <span className="truncate">{l.email}</span>
                  </a>
                  <a href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/75 hover:text-primary transition-colors">
                    <Phone size={14} className="text-foreground/40 shrink-0" /> {l.phone}
                  </a>
                  <p className="flex items-center gap-2 text-foreground/75">
                    <MapPin size={14} className="text-foreground/40 shrink-0" /> {l.city}{l.age ? ` · Age ${l.age}` : ''}
                  </p>
                  {l.preference && (
                    <p className="text-foreground/70"><span className="text-foreground/45 font-medium">Preference:</span> {l.preference}</p>
                  )}
                  {l.message && (
                    <p className="text-foreground/70 bg-muted/40 rounded-lg p-2.5 text-[13px] leading-relaxed">{l.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
