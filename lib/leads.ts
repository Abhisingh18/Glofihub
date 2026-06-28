// Public "quick enquiry" store (no account). Saved per-browser in localStorage.
// The full CRM (students/counsellors) lives in PostgreSQL — this is only the
// lightweight top-of-funnel lead form on the marketing site.

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

export async function getLeads(): Promise<Lead[]> {
  return localGet();
}

export async function saveLead(data: NewLead): Promise<void> {
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(localGet().filter((l) => l.id !== id)));
}

export async function clearLeads(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
