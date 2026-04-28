import { MapPin, Phone, Mail, Globe, ShieldCheck, Download, ChevronRight, Linkedin, Instagram, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#001A33] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Address Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2">
                <img
                  src="/images/mwf_logo.jpg"
                  alt="MWF Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tighter leading-none">MWF</h4>
                <p className="text-[10px] text-brand-orange font-black uppercase tracking-widest mt-1">Empowering Education</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-brand-orange shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Registered HQ</p>
                  <p className="text-sm font-medium leading-relaxed max-w-xs">
                    Mohania, Madarsa Chowk, Ward No. 2, <br />
                    Bhikha, Palasi, Araria, Bihar – 854333, India
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-brand-orange shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Directorate Contact</p>
                  <p className="text-sm font-black">+91 95041 39611 | +91 98717 62286</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="text-brand-orange shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Verification Email</p>
                  <p className="text-sm font-medium">mohaniawelfarefoundation.edu@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & CTAs */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange mb-8">Strategic CTAs</h5>
              <ul className="space-y-4">
                {[
                  'Join The Network',
                  'Become a Volunteer',
                  'Partner With Us',
                  'CSR Collaboration',
                  'Support Education',
                  'Verify Registration'
                ].map((cta) => (
                  <li key={cta}>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 group transition-colors">
                      <ChevronRight size={12} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
                      {cta}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange mb-8">Compliance Hub</h5>
              <ul className="space-y-4">
                {[
                  'Incorporate Cert',
                  'Section 8 License',
                  'Annual Reports',
                  'Legal Framework',
                  'Financial Transparency',
                  'Partner Verification'
                ].map((item) => (
                  <li key={item}>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 group transition-colors">
                      <Download size={12} className="text-white/20 group-hover:text-brand-orange transition-colors" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust & Verification Column */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} className="text-brand-green" />
                <span className="text-xs font-black uppercase tracking-tighter">Verified Section-8 NGO</span>
              </div>
              <p className="text-[10px] text-white/40 font-medium leading-relaxed mb-4 ">
                Licensed under the Companies Act 2013, Ministry of Corporate Affairs, Gov of India. CIN: U85303BR2025NPL075573
              </p>
              <div className="flex gap-3">
                <Linkedin className="text-white/20 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
                <Instagram className="text-white/20 hover:text-brand-orange cursor-pointer transition-colors" size={20} />
                <Facebook className="text-white/20 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
              </div>
            </div>
            <button className="w-full py-4 bg-brand-orange text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20 hover:scale-105 transition-all">
              Contact Leadership
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Mohania Welfare Foundation | Corporate Identity: U85303BR2025NPL075573
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Tax Compliance</a>
            <a href="#" className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Audit Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
