// Client-side first-touch attribution. `captureAttribution()` runs once per browser session
// (see components/UtmCapture.tsx) and `getAttribution()` is read when a lead form is submitted.
// All storage access is wrapped in try/catch — it can throw in private windows / blocked storage.

const KEY = 'glofihub_attribution';

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** document.referrer at first touch */
  referrer?: string;
  /** path + query the visitor first landed on */
  landing_page?: string;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const clip = (v: string, n = 120) => v.trim().slice(0, n);

/** Store UTM params / referrer / landing page the first time we see the visitor this session. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = clip(v);
    }
    if (document.referrer) data.referrer = clip(document.referrer, 300);
    data.landing_page = clip(window.location.pathname + window.location.search, 300);
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — attribution is best-effort */
  }
}

/** Attribution captured earlier this session (empty object if none / storage unavailable). */
export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
