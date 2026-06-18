'use client';

import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Contact', href: '/#contact' },
  ];

  const services = [
    { label: 'Education Abroad', href: '/#service-education' },
    { label: 'Job Placement', href: '/#service-jobs' },
    { label: 'Skill Courses', href: '/#service-skills' },
    { label: 'Collaboration', href: '/#service-partnerships' },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-blue-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-lg">
                <img src="/logo/logo.png" alt="GlofiHub" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tight">GlofiHub</span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed font-medium">
              Transforming global education and careers through AI-driven mentorship and verified opportunities.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Social link"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-5 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="group inline-flex items-center gap-2 text-sm font-medium text-white/65 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover:bg-emerald-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-5 tracking-wide">Services</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="group inline-flex items-center gap-2 text-sm font-medium text-white/65 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover:bg-emerald-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Office */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-5 tracking-wide">Office Address</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 shrink-0">
                  <MapPin size={17} />
                </span>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Dwarkapuri Road No. 2, Hanuman Nagar, Kankarbagh, Patna, Bihar – 800020
                </p>
              </div>
              <a href="tel:+919241168875" className="flex items-center gap-3 text-sm text-white/70 font-medium hover:text-white transition-colors">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 shrink-0">
                  <Phone size={16} />
                </span>
                +91 924 116 8875
              </a>
              <a href="mailto:info@glofihub.com" className="flex items-center gap-3 text-sm text-white/70 font-medium hover:text-white transition-colors">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 shrink-0">
                  <Mail size={16} />
                </span>
                info@glofihub.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-7 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-xs font-medium text-white/50">
            © {new Date().getFullYear()} GlofiHub — Global Future Initiative Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a key={link} href="#" className="text-xs font-medium text-white/50 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
