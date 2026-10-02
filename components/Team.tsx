'use client';

import { useState } from 'react';
import { Users, GraduationCap, Award, Quote, Sparkles, Pause, Play } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  qualification?: string;
  image: string;
  /** Intrinsic pixel size of `image` (prevents layout shift). */
  width: number;
  height: number;
  description: string;
}

interface Supporter {
  name: string;
  role: string;
  image: string;
  /** Intrinsic pixel size of `image` (prevents layout shift). */
  width: number;
  height: number;
}

const team: TeamMember[] = [
  {
    name: 'Dr. Vishnu D. Rajput',
    role: 'Chief International Research Advisor',
    qualification: 'Principal Scientist & Head',
    image: '/team/dr_vishnu_d_rajput.webp',
    width: 800,
    height: 797,
    description: 'International Laboratory on Nanobiotechnology & Rhizosphere Bioengineering. Southern Federal University, Rostov-on-Don, Russia.'
  },
  {
    name: 'Abhishek Kumar',
    role: 'Co-Founder',
    image: '/team/abhishek_co_founder.webp',
    width: 800,
    height: 1067,
    description: 'Co-architect of our integrated global career pathways, driving international university alliances, student success programs, and platform strategy.'
  },
  {
    name: 'Dr. Muqallid Irfan',
    role: 'Russian Operations Head',
    qualification: 'MBBS, MD',
    image: '/team/dr_muqallid_irfan_mbbs_md_russian_operations_head.webp',
    width: 800,
    height: 1067,
    description: 'Oversees our direct university relations and student on-ground welfare services across key Russian state & medical universities.'
  },
  {
    name: 'Avnish Kumar Yadav',
    role: 'Business Expansion Head',
    image: '/team/avnish_kr_yadav_bussiness_expanssion_head.webp',
    width: 800,
    height: 800,
    description: 'Leading strategic growth, institutional partnerships, and market expansion across India — building strong collaborations and seamless opportunities for students through innovation, networking, and impactful outreach.'
  },
  {
    name: 'Nitish Kumar',
    role: 'Patna Operations Head',
    image: '/team/nitish_kumar_Patna_operation_head.webp',
    width: 800,
    height: 1000,
    description: 'Manages regional student guidance, parent counseling, and pre-departure document verification processes at our Patna hub.'
  },
  {
    name: 'Sudheer Kumar Saxena',
    role: 'Uzbekistan Operations Head',
    image: '/team/sudheer_kr_sexena_Uzbekistan_operations_head.webp',
    width: 800,
    height: 1067,
    description: 'Directs on-ground coordination, student accommodation, and university compliance protocols for our Central Asian pathways.'
  }
];

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
    <section id="team" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[45%] h-[50%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Users size={14} className="text-primary" aria-hidden />
            <span className="text-xs font-semibold tracking-wide text-primary">Meet Our Mentors</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Our Executive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Team
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
            The people behind GlofiHub — dedicated professionals working round-the-clock across India, Russia, and Central Asia to secure your educational future.
          </p>
        </div>

        {/* Founder's Message */}
        <div data-reveal className="max-w-5xl mx-auto mb-20 relative">
          <div aria-hidden className="absolute -inset-1 bg-gradient-to-r from-primary/25 via-emerald-400/20 to-primary/25 rounded-[2.25rem] blur-lg opacity-60" />
          <div className="relative bg-card border border-foreground/10 rounded-[2rem] shadow-lg shadow-black/5 overflow-hidden transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 duration-500">
            <div className="grid lg:grid-cols-[300px_1fr]">
              {/* Identity panel */}
              <div className="relative bg-gradient-to-br from-primary via-primary to-blue-950 p-8 lg:p-10 flex flex-col items-center text-center justify-center overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="relative">
                  {/* Avatar (initials are decorative — the name follows) */}
                  <div aria-hidden className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-[3px] shadow-2xl mx-auto">
                    <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center font-display font-extrabold text-3xl text-white tracking-tight">
                      UK
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white tracking-tight mt-5">Ujjawal Kumar</h3>
                  <p className="text-xs font-semibold text-emerald-300 tracking-wide mt-1">Founder &amp; Strategic Head</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-medium">
                    <GraduationCap size={12} aria-hidden /> Pursuing MBBS Abroad
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="relative p-8 md:p-10 lg:p-12">
                <Quote aria-hidden size={120} className="absolute top-4 right-5 text-primary/[0.06] fill-primary/[0.06]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
                    <Quote size={13} className="text-primary" aria-hidden />
                    <span className="text-xs font-semibold tracking-wide text-primary">Founder&apos;s Message</span>
                  </div>

                  <p className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight mb-4">
                    Namaste 🙏
                  </p>

                  <div className="space-y-3.5 text-sm md:text-[15px] text-foreground/75 font-medium leading-relaxed">
                    <p>I&apos;m Ujjawal Kumar, Founder &amp; Strategic Head of GlofiHub, currently pursuing MBBS abroad.</p>
                    <p>GlofiHub was created with a vision to connect education, skills, and real-world opportunities. During my journey in Patna, Kota, and abroad, I met many talented individuals who lacked proper guidance and exposure despite their potential.</p>
                    <p>Our mission is to empower students and professionals through mentorship, skill development, global exposure, and career opportunities in India and abroad.</p>
                    <p>At GlofiHub, we believe education should lead to confidence, growth, financial independence and meaningful success.</p>
                  </div>

                  <div className="mt-7 pt-6 border-t border-foreground/10 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-bold text-foreground italic leading-tight">Ujjawal Kumar</p>
                      <p className="text-xs font-semibold text-primary tracking-wide mt-0.5">Founder &amp; Strategic Head, GlofiHub</p>
                    </div>
                    <span className="hidden sm:inline-block text-sm font-semibold text-foreground/40">— Thank you</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start list-none">
          {team.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              data-reveal-d={`${(index % 3) + 1}`}
              className="group relative bg-card border border-foreground/10 hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                <img
                  src={member.image}
                  alt={`Portrait of ${member.name}, ${member.role}`}
                  width={member.width}
                  height={member.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

                {/* Role badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-md border border-foreground/10 py-2.5 px-3.5 rounded-2xl shadow-lg flex flex-col">
                  <span className="text-xs font-bold text-primary tracking-wide leading-tight">
                    {member.role}
                  </span>
                  {member.qualification && (
                    <span className="text-[11px] font-semibold text-foreground/55 mt-1 leading-none flex items-center gap-1">
                      <GraduationCap size={12} aria-hidden /> {member.qualification}
                    </span>
                  )}
                </div>
              </div>

              {/* Text */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-foreground/65 leading-relaxed font-medium">
                    {member.description}
                  </p>
                </div>

                <div className="border-t border-foreground/10 mt-6 pt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground/40 tracking-wide">
                    GlofiHub Mentor
                  </span>
                  <span aria-hidden className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Award size={13} />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

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
              <Sparkles size={13} className="text-primary" aria-hidden />
              <span className="text-xs font-semibold tracking-wide text-primary">Extended Support &amp; Russian Team</span>
            </h3>
            <p className="text-sm text-foreground/60 font-medium max-w-xl mx-auto">
              A global support network ensuring seamless on-ground student assistance.
            </p>
          </div>

          <div className="team-marquee relative w-full">
            {/* Edge fades */}
            <div aria-hidden className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-muted/30 via-muted/20 to-transparent z-10 pointer-events-none" />
            <div aria-hidden className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-muted/30 via-muted/20 to-transparent z-10 pointer-events-none" />

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
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300" />
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

          {/* Pause control (WCAG 2.2.2) — hidden for reduced-motion users, who get a static scrollable row */}
          <div className="team-marquee-pause mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-foreground/15 text-xs font-semibold text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {paused ? <Play size={12} aria-hidden /> : <Pause size={12} aria-hidden />}
              {paused ? 'Play scrolling' : 'Pause scrolling'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
