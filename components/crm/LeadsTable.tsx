'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Inbox, Phone, MessageCircle, Mail, MapPin, ChevronDown, Loader2, type LucideIcon } from 'lucide-react';
import { EmptyState } from '@/components/crm/widgets';
import { Card, Input, Select } from '@/components/crm/ui';
import { setLeadStatus } from '@/lib/actions/leads';
import { LEAD_REQUIREMENTS, LEAD_STATUSES, type LeadStatus } from '@/lib/validations';
import { cn } from '@/lib/utils';

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string | null;
  requirement: string;
  contact_method: string;
  message: string | null;
  source: string | null;
  page: string | null;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  status: string;
  /** ISO timestamp */
  created_at: string;
}

const STATUS_META: Record<LeadStatus, { label: string; select: string }> = {
  new:       { label: 'New',       select: 'bg-sky-500/10 border-sky-500/25 text-sky-700 dark:text-sky-300' },
  contacted: { label: 'Contacted', select: 'bg-violet-500/10 border-violet-500/25 text-violet-700 dark:text-violet-300' },
  qualified: { label: 'Qualified', select: 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-300' },
  converted: { label: 'Converted', select: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300' },
  closed:    { label: 'Closed',    select: 'bg-foreground/5 border-foreground/15 text-foreground/60' },
};

const METHOD_META: Record<string, { label: string; icon: LucideIcon }> = {
  phone:    { label: 'Phone call', icon: Phone },
  whatsapp: { label: 'WhatsApp',   icon: MessageCircle },
  email:    { label: 'Email',      icon: Mail },
};

const asStatus = (s: string): LeadStatus => ((LEAD_STATUSES as readonly string[]).includes(s) ? (s as LeadStatus) : 'new');

// Fixed time zone so server-rendered and browser-rendered text always match (no hydration drift).
const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata',
});
function formatReceived(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d);
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
const utmLine = (l: LeadRow) => [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(' / ');
// Table and card layouts are both in the DOM (one hidden by CSS), so element ids must differ per view.
type View = 'table' | 'card';
const detailsId = (l: LeadRow, view: View) => `lead-${l.id}-${view}-details`;
const hasDetails = (l: LeadRow) =>
  Boolean(l.message || l.landing_page || l.page || l.referrer || l.utm_term || l.utm_content);

/* ───────────── small building blocks ───────────── */

function LeadStatusSelect({ id, name, current, className }: { id: string; name: string; current: LeadStatus; className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState<LeadStatus>(current);
  const [seen, setSeen] = useState<LeadStatus>(current);
  const [pending, start] = useTransition();
  const [err, setErr] = useState('');

  // Follow the server value after a refresh (e.g. another admin changed it).
  if (seen !== current) {
    setSeen(current);
    setValue(current);
  }

  const onChange = (next: LeadStatus) => {
    const previous = value;
    setValue(next); // optimistic
    setErr('');
    start(async () => {
      try {
        const res = await setLeadStatus({ id, status: next });
        if (!res.ok) {
          setErr(res.error || 'Failed');
          setValue(previous);
        } else {
          router.refresh();
        }
      } catch {
        setErr('Network error');
        setValue(previous);
      }
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Select
          aria-label={`Status for ${name}`}
          value={value}
          disabled={pending}
          onChange={(e) => onChange(e.target.value as LeadStatus)}
          className={cn('py-2 font-semibold', STATUS_META[value].select)}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-background text-foreground">{STATUS_META[s].label}</option>
          ))}
        </Select>
        {pending && <Loader2 size={15} className="animate-spin text-foreground/50 shrink-0" aria-hidden />}
      </div>
      {err && <p role="alert" className="text-[11px] text-rose-600 mt-1">{err}</p>}
    </div>
  );
}

function LeadIdentity({ lead }: { lead: LeadRow }) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-foreground truncate">{lead.name}</p>
      <a href={`mailto:${lead.email}`} className="block text-[11px] text-foreground/55 hover:text-primary hover:underline truncate">
        {lead.email}
      </a>
      <a href={telHref(lead.phone)} className="block text-[11px] text-foreground/55 hover:text-primary hover:underline truncate">
        {lead.phone}
      </a>
    </div>
  );
}

function RequirementBadge({ lead }: { lead: LeadRow }) {
  return (
    <div className="min-w-0">
      <span className="inline-flex max-w-full items-center px-2.5 py-1 rounded-full border border-primary/15 bg-primary/8 text-[11px] font-semibold text-primary dark:text-blue-300">
        <span className="truncate">{lead.requirement}</span>
      </span>
      {lead.location && (
        <span className="mt-1 flex items-center gap-1 text-[11px] text-foreground/50">
          <MapPin size={11} className="shrink-0" aria-hidden />
          <span className="truncate">{lead.location}</span>
        </span>
      )}
    </div>
  );
}

function MethodPill({ method }: { method: string }) {
  const m = METHOD_META[method] ?? { label: method, icon: Inbox };
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70">
      <Icon size={13} className="text-foreground/45 shrink-0" aria-hidden />
      {m.label}
    </span>
  );
}

function SourceCell({ lead }: { lead: LeadRow }) {
  const utm = utmLine(lead);
  if (!lead.source && !utm) return <span className="text-foreground/35 text-xs">—</span>;
  return (
    <div className="min-w-0 text-xs">
      {lead.source && <p className="font-medium text-foreground/75 break-words">{lead.source}</p>}
      {utm && <p className="text-[11px] text-foreground/50 break-words">{utm}</p>}
    </div>
  );
}

function DetailsToggle({ lead, view, open, onToggle }: { lead: LeadRow; view: View; open: boolean; onToggle: () => void }) {
  if (!hasDetails(lead)) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={detailsId(lead, view)}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary dark:text-blue-300 hover:underline cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {lead.message ? 'Message & details' : 'Details'}
      <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} aria-hidden />
    </button>
  );
}

function LeadDetails({ lead, view }: { lead: LeadRow; view: View }) {
  const rows: [string, string | null][] = [
    ['Landing page', lead.landing_page],
    ['Submitted from', lead.page],
    ['Referrer', lead.referrer],
    ['UTM term', lead.utm_term],
    ['UTM content', lead.utm_content],
  ];
  const shown = rows.filter(([, v]) => v);
  return (
    <div id={detailsId(lead, view)} className="space-y-3 text-sm">
      {lead.message && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1">Message</p>
          <p className="whitespace-pre-wrap break-words text-foreground/80">{lead.message}</p>
        </div>
      )}
      {shown.length > 0 && (
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {shown.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">{k}</dt>
              <dd className="text-xs text-foreground/70 break-all">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ───────────── main table ───────────── */

export function LeadsTable({ leads, total }: { leads: LeadRow[]; total?: number }) {
  const [q, setQ] = useState('');
  const [requirement, setRequirement] = useState<'all' | string>('all');
  const [status, setStatus] = useState<'all' | LeadStatus>('all');
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    return leads.filter((l) => {
      if (requirement !== 'all' && l.requirement !== requirement) return false;
      if (status !== 'all' && asStatus(l.status) !== status) return false;
      if (!query) return true;
      if (l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query)) return true;
      if (l.phone.toLowerCase().includes(query)) return true;
      return digits.length > 0 && l.phone.replace(/\D/g, '').includes(digits);
    });
  }, [leads, q, requirement, status]);

  const truncated = typeof total === 'number' && total > leads.length;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" aria-hidden />
          <Input
            className="pl-9"
            type="search"
            placeholder="Search name, email, phone…"
            aria-label="Search leads"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-56"
          aria-label="Filter by requirement"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        >
          <option value="all">All requirements</option>
          {LEAD_REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
        <Select
          className="sm:w-44"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'all' | LeadStatus)}
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </Select>
      </div>

      {leads.length === 0 ? (
        <Card>
          <EmptyState
            icon={Inbox}
            title="No leads yet"
            hint="Website enquiries will show up here as soon as someone submits the contact form."
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Search} title="No leads match your filters" hint="Try a different search or clear the filters." />
        </Card>
      ) : (
        <>
          <p className="text-[11px] font-medium text-foreground/45 mb-2" aria-live="polite">
            Showing {filtered.length} of {leads.length}
            {truncated ? ` (latest ${leads.length} of ${total} total)` : ''}
          </p>

          {/* Wide screens: table */}
          <Card className="hidden xl:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-foreground/45 border-b border-foreground/10">
                    <th scope="col" className="px-4 py-3 font-semibold">Lead</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Requirement</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Contact via</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Source / UTM</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Received (IST)</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {filtered.map((l) => {
                    const open = openIds.has(l.id);
                    return (
                      <TableRows key={l.id} lead={l} open={open} onToggle={() => toggle(l.id)} />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Narrower screens: cards */}
          <ul className="grid gap-3 md:grid-cols-2 xl:hidden">
            {filtered.map((l) => {
              const open = openIds.has(l.id);
              return (
                <li key={l.id}>
                  <Card className="p-4 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <LeadIdentity lead={l} />
                      <LeadStatusSelect id={l.id} name={l.name} current={asStatus(l.status)} className="w-36 shrink-0" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <RequirementBadge lead={l} />
                      <MethodPill method={l.contact_method} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <SourceCell lead={l} />
                      <time dateTime={l.created_at} suppressHydrationWarning className="text-[11px] text-foreground/50 whitespace-nowrap">
                        {formatReceived(l.created_at)}
                      </time>
                    </div>
                    {hasDetails(l) && (
                      <div className="mt-3 pt-3 border-t border-foreground/5">
                        <DetailsToggle lead={l} view="card" open={open} onToggle={() => toggle(l.id)} />
                        {open && <div className="mt-3"><LeadDetails lead={l} view="card" /></div>}
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function TableRows({ lead, open, onToggle }: { lead: LeadRow; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="align-top hover:bg-muted/40 transition-colors">
        <td className="px-4 py-3 max-w-[16rem]">
          <LeadIdentity lead={lead} />
          {hasDetails(lead) && (
            <div className="mt-1.5">
              <DetailsToggle lead={lead} view="table" open={open} onToggle={onToggle} />
            </div>
          )}
        </td>
        <td className="px-4 py-3 max-w-[12rem]"><RequirementBadge lead={lead} /></td>
        <td className="px-4 py-3"><MethodPill method={lead.contact_method} /></td>
        <td className="px-4 py-3 max-w-[14rem]"><SourceCell lead={lead} /></td>
        <td className="px-4 py-3 text-xs text-foreground/60 whitespace-nowrap">
          <time dateTime={lead.created_at} suppressHydrationWarning>{formatReceived(lead.created_at)}</time>
        </td>
        <td className="px-4 py-3">
          <LeadStatusSelect id={lead.id} name={lead.name} current={asStatus(lead.status)} className="w-36" />
        </td>
      </tr>
      {open && hasDetails(lead) && (
        <tr className="bg-muted/30">
          <td colSpan={6} className="px-4 py-4">
            <LeadDetails lead={lead} view="table" />
          </td>
        </tr>
      )}
    </>
  );
}
