'use client';

import { useState } from 'react';
import { Users, GraduationCap, Sparkles, Pause, Play } from 'lucide-react';
import { TEAM_DEPARTMENTS } from '@/components/about/team-data';

interface Supporter {
  name: string;
  role: string;
  image: string;
  /** Intrinsic pixel size of `image` (prevents layout shift). */
  width: number;
  height: number;
}

const supporters: Supporter[] = [
  { name: 'Sahil Sujeet Singh', role: 'Mumbai, Maharashtra', image: '/supporters/Sahil_Sujeet_Singh_Mumbai_Maharashtra.webp', width: 640, height: 623 },
  { name: 'Khusboo Bharti', role: 'Darbhanga, Bihar', image: '/supporters/Khusboo_Bharti_Darbhanga_Bihar.webp', width: 640, height: 1138 },
  { name: 'Rocky Kumar Singh', role: 'Palamu, Jharkhand', image: '/supporters/Rocky_kumar_singh_Palamu_Jharkhand.webp', width: 640, height: 854 },
  { name: 'Ujjawal Kumar', role: 'Bihar', image: '/supporters/Ujjawal_Kumar_Bihar.webp', width: 640, height: 841 },
  { name: 'Jankar Sahil', role: 'Sangli, Maharashtra', image: '/supporters/Jankar_Sahil_city_Vita_Sangli_Maharashtra.webp', width: 640, height: 960 },
  { name: 'Prateek Bhardwaj', role: 'Agra, Uttar Pradesh', image: '/supporters/Prateek_Bhardwaj_Agra_Uttar_Pradesh.webp', width: 640, height: 1138 },
  { name: 'Chavan Kartik', role: 'Sangli, Maharashtra', image: '/supporters/Chavan_Kartik_City_vita_SangliMaharashtra.webp', width: 640, height: 776 },
  { name: 'K. Bhupesh Kumaran', role: 'Erode, Tamil Nadu', image: '/supporters/K.BHUPESH_KUMARAN_ERODE_TAMILNADU.webp', width: 640, height: 786 },
  { name: 'Anurag Mishra', role: 'Lucknow, Uttar Pradesh', image: '/supporters/Anurag_Mishra_Lucknow_UTTAR_PRADESH.webp', width: 640, height: 853 },
  { name: 'Varun Sampatrao Solankar', role: 'Sangli, Maharashtra', image: '/supporters/Varun_Sampatrao_Solankar_city_Sangli_Maharashtra.webp', width: 640, height: 966 },
  { name: 'Harsh Raj', role: 'Varanasi, Uttar Pradesh', image: '/supporters/Harsh_Raj_Varanasi_Uttar_Pradesh.webp', width: 640, height: 853 },
  { name: 'Dipanshu Maurya', role: 'Gopalganj, Bihar', image: '/supporters/Dipanshu_maurya_Gopalganj_Bihar.webp', width: 640, height: 853 },
  { name: 'Patil Shruti', role: 'Sangli, Maharashtra', image: '/supporters/Patil_Shruti_City_Sangli_Maharashtra.webp', width: 640, height: 853 },
  { name: 'Pawan Kumar', role: 'Aurangabad, Bihar', image: '/supporters/Pawan_kumar_Aurangabad_bihar.webp', width: 640, height: 1422 },
];

export function Team() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="team" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-[45%] h-[50%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Users size={14} className="text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-primary">Our Team</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            The People Behind{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              GlofiHub
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
            Dedicated professionals working across India, Russia, and Central Asia to secure your educational future.
          </p>
        </div>

        {/* Departments */}
        <div className="space-y-16">
          {TEAM_DEPARTMENTS.map((dept) => (
            <div key={dept.id} aria-labelledby={`dept-${dept.id}`}>
              <div data-reveal className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                  <dept.icon size={18} aria-hidden="true" />
                </span>
                <h3 id={`dept-${dept.id}`} className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {dept.name}
                </h3>
                <span aria-hidden="true" className="flex-1 h-px bg-foreground/10" />
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start list-none">
                {dept.members.map((member, index) => (
                  <li
                    key={member.id}
                    data-reveal
                    data-reveal-d={`${(index % 3) + 1}`}
                    className="group relative bg-card border border-foreground/10 hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex flex-col h-full"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                      {member.photo ? (
                        <img
                          src={member.photo.src}
                          alt={`Portrait of ${member.name}, ${member.role}`}
                          width={member.photo.width}
                          height={member.photo.height}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      ) : (
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-950 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-[3px] shadow-2xl">
                            <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center font-display font-extrabold text-3xl text-white tracking-tight">
                              {member.initials}
                            </div>
                          </div>
                        </div>
                      )}
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-md border border-foreground/10 py-2.5 px-3.5 rounded-2xl shadow-lg flex flex-col">
                        <span className="text-xs font-bold text-primary tracking-wide leading-tight">{member.role}</span>
                        {member.qualification && (
                          <span className="text-[11px] font-semibold text-foreground/55 mt-1 leading-none flex items-center gap-1">
                            <GraduationCap size={12} aria-hidden="true" /> {member.qualification}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex-grow">
                      <h4 className="font-display text-lg font-bold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-foreground/65 leading-relaxed font-medium">{member.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Marquee styles */}
        <style>{`
          @keyframes team-marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .team-marquee-track { animation: team-marquee-scroll 55s linear infinite; }
          .team-marquee:hover .team-marquee-track,
          .team-marquee:focus-within .team-marquee-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            /* No auto-scroll: show one set and let the row scroll by hand. */
            .team-marquee-track { animation: none; }
            .team-marquee-viewport { overflow-x: auto; overscroll-behavior-x: contain; }
            .team-marquee-dup { display: none; }
            .team-marquee-pause { display: none; }
          }
        `}</style>

        {/* Extended Support & Russian Team */}
        <div className="mt-24 pt-12 border-t border-foreground/10 relative">
          <div className="text-center mb-10">
            <h3 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4">
              <Sparkles size={13} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-primary">Extended Support &amp; Russian Team</span>
            </h3>
            <p className="text-sm text-foreground/60 font-medium max-w-xl mx-auto">
              A global support network ensuring seamless on-ground student assistance.
            </p>
          </div>

          <div className="team-marquee relative w-full">
            <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-muted/30 via-muted/20 to-transparent z-10 pointer-events-none" />
            <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-muted/30 via-muted/20 to-transparent z-10 pointer-events-none" />

            <div
              role="region"
              aria-label="Extended support and Russian team members"
              tabIndex={0}
              className="team-marquee-viewport w-full overflow-hidden rounded-3xl py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ul
                className="team-marquee-track flex w-max list-none whitespace-nowrap"
                style={paused ? { animationPlayState: 'paused' } : undefined}
              >
                {[...supporters, ...supporters].map((item, idx) => {
                  const isCopy = idx >= supporters.length;
                  return (
                    <li
                      key={`${item.name}-${idx}`}
                      // The second set only exists to make the loop seamless.
                      aria-hidden={isCopy || undefined}
                      className={`${isCopy ? 'team-marquee-dup ' : ''}relative overflow-hidden rounded-3xl shrink-0 group select-none w-48 h-64 md:w-52 md:h-68 mr-6 border border-foreground/10 shadow-lg hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex items-end p-5`}
                    >
                      <img
                        src={item.image}
                        alt={isCopy ? '' : `Portrait of ${item.name}`}
                        width={item.width}
                        height={item.height}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex flex-col w-full text-left">
                        <span className="font-display text-base md:text-lg font-bold text-white tracking-tight leading-tight drop-shadow-md whitespace-normal">
                          {item.name}
                        </span>
                        <span className="text-xs font-semibold text-white/75 tracking-wide mt-1.5 leading-snug drop-shadow-sm whitespace-normal">
                          {item.role}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Pause control (WCAG 2.2.2) — hidden for reduced-motion users */}
          <div className="team-marquee-pause mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-foreground/15 text-xs font-semibold text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
              {paused ? 'Play scrolling' : 'Pause scrolling'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
