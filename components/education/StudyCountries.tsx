import { MapPin, University } from 'lucide-react';

interface Country {
  name: string;
  flag: string;
  /** Which part of the flag stays visible inside the round crop. */
  position: string;
}

const COUNTRIES: Country[] = [
  { name: 'Russia', flag: '/flags/russia.png', position: 'object-center' },
  { name: 'Georgia', flag: '/flags/georgia.png', position: 'object-center' },
  // The crescent and stars sit at the hoist side of the flag.
  { name: 'Uzbekistan', flag: '/flags/uzbekistan.png', position: 'object-left' },
  { name: 'Kazakhstan', flag: '/flags/kazakhstan.png', position: 'object-center' },
  { name: 'Kyrgyzstan', flag: '/flags/kyrgyzstan.png', position: 'object-center' },
];

/** The five study destinations, in display order (also used for the enquiry form's country select). */
export const STUDY_COUNTRY_NAMES = COUNTRIES.map((c) => c.name);

/** Russian universities named by the existing GlofiHub chatbot. */
const RUSSIA_UNIVERSITIES = [
  'Kazan Federal University',
  'Crimea Federal University',
  'Bashkir State Medical University',
  'Volgograd State Medical University',
  'RUDN University (Moscow)',
];

/** Decorative round flag — the country name is always written next to it. */
function Flag({ country, large = false }: { country: Country; large?: boolean }) {
  return (
    <img
      src={country.flag}
      alt=""
      aria-hidden="true"
      width={large ? 64 : 48}
      height={large ? 64 : 48}
      loading="lazy"
      decoding="async"
      className={`shrink-0 rounded-full bg-muted object-cover shadow-md ring-2 ring-white dark:ring-white/25 ${country.position} ${
        large ? 'h-16 w-16' : 'h-12 w-12'
      }`}
    />
  );
}

function OnGroundNote({ name }: { name: string }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-foreground/65">
      <MapPin size={15} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
      <span>GlofiHub has on-ground support in {name}.</span>
    </p>
  );
}

/**
 * Study destinations: Russia as the large feature card (with the universities our counsellors guide
 * students towards) and the other four countries as compact cards. Server component.
 */
export function StudyCountries() {
  const [russia, ...others] = COUNTRIES;

  return (
    <ul role="list" aria-label="Study destinations" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      <li
        data-reveal
        className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 sm:col-span-2 sm:p-8 lg:row-span-2"
      >
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-4">
            <Flag country={russia} large />
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight">{russia.name}</h3>
              <OnGroundNote name={russia.name} />
            </div>
          </div>

          <p id="russia-universities" className="mt-7 text-sm font-semibold text-foreground/85">
            Universities our counsellors guide students towards
          </p>
          <ul role="list" aria-labelledby="russia-universities" className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {RUSSIA_UNIVERSITIES.map((uni) => (
              <li
                key={uni}
                className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm font-semibold leading-snug"
              >
                <University size={16} className="mt-0.5 shrink-0 text-primary dark:text-accent" aria-hidden />
                {uni}
              </li>
            ))}
          </ul>
        </div>
      </li>

      {others.map((country, i) => (
        <li
          key={country.name}
          data-reveal
          data-reveal-d={i + 1}
          className="flex items-center gap-4 rounded-3xl border border-foreground/10 bg-card p-5 shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:hover:translate-y-0 sm:flex-col sm:items-start sm:p-6"
        >
          <Flag country={country} />
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{country.name}</h3>
            <OnGroundNote name={country.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}
