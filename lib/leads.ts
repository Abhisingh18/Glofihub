// Student enquiries store.
// Uses Supabase (cloud, cross-device) when configured; otherwise falls back
// to localStorage (per-browser) so the app keeps working without setup.

import { supabase, isSupabaseConfigured } from './supabase';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: string;
  service: string;
  preference: string;
  message: string;
  createdAt: number;
}

export type NewLead = Omit<Lead, 'id' | 'createdAt'>;

const KEY = 'glofihub_leads';

/* ----------------------------- localStorage ----------------------------- */
function localGet(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list: Lead[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

/* ------------------------------- public API ----------------------------- */
export async function getLeads(): Promise<Lead[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r): Lead => ({
      id: String(r.id),
      name: r.name ?? '',
      email: r.email ?? '',
      phone: r.phone ?? '',
      city: r.city ?? '',
      age: r.age ?? '',
      service: r.service ?? '',
      preference: r.preference ?? '',
      message: r.message ?? '',
      createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    }));
  }
  return localGet();
}

export async function saveLead(data: NewLead): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('leads').insert([data]);
    if (error) throw error;
    return;
  }
  if (typeof window === 'undefined') return;
  const lead: Lead = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  const list = localGet();
  list.unshift(lead);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export async function deleteLead(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(localGet().filter((l) => l.id !== id)));
}

export async function clearLeads(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('leads').delete().neq('id', '');
    if (error) throw error;
    return;
  }
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
