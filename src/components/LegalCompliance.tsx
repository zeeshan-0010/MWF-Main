import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileCheck, Landmark, Scale, FileText, Download, Fingerprint, Building, CheckCircle2, Info } from 'lucide-react';

const LegalCompliance: React.FC = () => {
  const registrations = [
    {
      title: "Section 8 Company",
      details: [
        { label: "Act", value: "Companies Act, 2013" },
        { label: "Ministry", value: "Ministry of Corporate Affairs (GoI)" },
        { label: "CIN", value: "••••••••••••••••••" },
        { label: "Date", value: "28 April 2025" }
      ],
      icon: Building,
      color: "brand-blue"
    },
    {
      title: "Tax Registration",
      details: [
        { label: "PAN Number", value: "••••••••••" },
        { label: "TAN Number", value: "••••••••••" },
        { label: "Compliance", value: "Regular Filings" },
        { label: "Status", value: "Active" }
      ],
      icon: FileCheck,
      color: "brand-green"
    },
    {
      title: "Section 8 License",
      details: [
        { label: "License No.", value: "••••••" },
        { label: "Issued By", value: "ROC, CRC Manesar" },
        { label: "Type", value: "Non-Profit Social Welfare" },
        { label: "Dividend", value: "No Distribution Policy" }
      ],
      icon: Scale,
      color: "brand-orange"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50" id="compliance">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Trust & Legal Integrity</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-blue uppercase tracking-tighter leading-none">
              Government Verified <br />
              <span className="text-brand-orange">Legal Compliance</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
              <Download size={14} /> Incorporation Certificate
            </button>
            <button className="px-6 py-3 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-blue/10 hover:scale-105 transition-all">
              <FileText size={14} /> View Section 8 License
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {registrations.map((reg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 relative group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${reg.color}/5 flex items-center justify-center text-${reg.color} mb-8 transition-transform group-hover:scale-110`}>
                <reg.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter mb-6">{reg.title}</h3>
              <div className="space-y-4">
                {reg.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{detail.label}</span>
                    <span className="text-xs font-bold text-brand-blue">{detail.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-green" />
                <span className="text-[9px] font-black text-brand-green uppercase tracking-widest">Active & Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card p-10 bg-brand-blue text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Registered Office Address</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Fingerprint size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Official HQ</p>
                    <p className="text-sm font-bold leading-relaxed">
                      Mohania Welfare Foundation<br />
                      Mohania, Madarsa Chowk, Ward No. 2<br />
                      Bhikha, Palasi, Araria, Bihar – 854333, India
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 py-4 bg-white text-brand-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-colors">
                    Get Directions
                  </button>
                  <button className="flex-1 py-4 bg-white/10 border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between hover:border-brand-blue/30 transition-colors bg-white">
              <img
                src="/images/mwf_logo.jpg"
                alt="MWF Official"
                className="w-10 h-10 object-contain mb-4"
              />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Official Status</p>
                <p className="text-sm font-black text-brand-blue uppercase">Registered</p>
              </div>
            </div>
            {[
              { label: 'CSR Status', status: 'Compliant', icon: ShieldCheck },
              { label: 'Audit Path', status: 'Transparent', icon: FileText },
              { label: 'Governance', status: 'Section-8', icon: Info }
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 flex flex-col justify-between hover:border-brand-blue/30 transition-colors">
                <item.icon className="text-brand-blue/30 mb-4" size={24} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                  <p className="text-sm font-black text-brand-blue uppercase">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalCompliance;
