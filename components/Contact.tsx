'use client';

import { Check, Phone, Mail, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi GlofiHub! I am ${form.name}.
Email: ${form.email}
Phone: ${form.phone}
Interest: ${form.service}
Message: ${form.message}`;

    window.open(`https://wa.me/919241168875?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  const input =
    'w-full px-5 py-3.5 bg-white/10 border border-white/15 text-white rounded-xl focus:border-emerald-400 focus:bg-white/15 focus:outline-none transition-all placeholder:text-white/40 text-sm';

  return (
    <section id="contact" className="w-full">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Left — info */}
        <div data-reveal className="w-full lg:w-1/2 bg-muted/30 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5 w-fit">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">Contact Us</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Touch
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/70 leading-relaxed font-medium max-w-md">
            Have a question about studying abroad, skills, or careers? Our counselors are ready to guide you — reach out anytime.
          </p>

          {/* Contact tiles */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <a href="tel:+919241168875" className="group flex flex-col gap-3 p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md shadow-primary/25">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-foreground/50 tracking-wide">Call Us</p>
                <p className="text-sm font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors">+91 924 116 8875</p>
              </div>
            </a>
            <a href="mailto:info@glofihub.com" className="group flex flex-col gap-3 p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md shadow-primary/25">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-foreground/50 tracking-wide">Email Us</p>
                <p className="text-sm font-bold text-foreground mt-0.5 break-all group-hover:text-primary transition-colors">info@glofihub.com</p>
              </div>
            </a>
          </div>

          {/* Why choose us */}
          <div className="mt-8 pt-7 border-t border-foreground/10">
            <p className="text-xs font-semibold text-primary tracking-wide mb-4">Why Choose Us</p>
            <div className="grid grid-cols-2 gap-3">
              {['AI Guidance', 'Verified Jobs', '24/7 Support', 'End-to-End'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-foreground/80">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Check className="text-emerald-600" size={11} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div data-reveal data-reveal-d="1" className="relative w-full lg:w-1/2 bg-gradient-to-br from-primary via-primary to-blue-950 p-8 md:p-14 lg:p-16 flex flex-col justify-center overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight mb-1">Send us a message</h3>
            <p className="text-sm text-white/70 font-medium mb-6">We&apos;ll get back to you on WhatsApp instantly.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-2 tracking-wide">Your Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Full name" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-2 tracking-wide">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 tracking-wide">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="you@example.com" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 tracking-wide">Service Interest</label>
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${input} appearance-none cursor-pointer`} required>
                  <option value="" className="bg-primary text-white">Select a service</option>
                  <option value="Education Abroad" className="bg-primary text-white">Education Abroad</option>
                  <option value="Job Placement" className="bg-primary text-white">Job Placement</option>
                  <option value="Skill Development" className="bg-primary text-white">Skill Development</option>
                  <option value="Collaboration" className="bg-primary text-white">Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 tracking-wide">Your Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} rows={3} placeholder="How can we help you?" required />
              </div>

              <button
                type="submit"
                className="btn-shine group w-full py-4 bg-white text-primary font-semibold text-sm tracking-wide rounded-full hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle size={16} /> Submit Request
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>

              {done && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-50 font-semibold text-xs text-center animate-in fade-in zoom-in duration-300">
                  Form submitted! Opening WhatsApp…
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
