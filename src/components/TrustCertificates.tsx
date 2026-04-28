import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  Award, 
  Stamp, 
  Download,
  Info
} from 'lucide-react';

export default function TrustCertificates() {
  const certifications = [
    {
      title: "Section 8 License",
      id: "N-45621/2022",
      authority: "Govt. of India",
      desc: "Licensed for charitable and social welfare activities under the Ministry of Corporate Affairs.",
      color: "bg-brand-blue"
    },
    {
      title: "ISO 9001:2015",
      id: "Cert-983301",
      authority: "IAS Certified",
      desc: "International Standard for Quality Management Systems in non-profit operations.",
      color: "bg-brand-orange"
    },
    {
      title: "80G Compliance",
      id: "CIT/Exemp/47/22",
      authority: "Income Tax Dept",
      desc: "Eligible for 50% tax exemption for all donors under section 80G of the IT Act.",
      color: "bg-brand-green"
    }
  ];

  return (
    <section id="trust-governance" className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
               <ShieldCheck className="text-brand-blue" size={20} />
               <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em]">Governance Protocol</span>
            </div>
            <h2 className="text-4xl font-extrabold text-brand-blue tracking-tighter uppercase leading-tight">
               Built on <span className="text-brand-orange">Institutional</span> Trust
            </h2>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-[200px] text-right">
             Fully compliant with Ministry of Corporate Affairs and Income Tax Department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((cert, idx) => (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="group relative"
            >
              <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 translate-y-4 translate-x-4 -z-10 group-hover:translate-y-6 group-hover:translate-x-6 transition-transform" />
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 h-full flex flex-col">
                <div className={`w-14 h-14 ${cert.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-current/10`}>
                  <FileText size={24} />
                </div>
                
                <h3 className="text-xl font-black text-brand-blue uppercase tracking-tight mb-2">{cert.title}</h3>
                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                   <Stamp size={12} /> {cert.id}
                </p>
                
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
                  {cert.desc}
                </p>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{cert.authority}</span>
                  <button className="p-3 bg-gray-50 rounded-xl text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legal Transparency CTA */}
        <div className="mt-20 p-8 glass-card border-brand-blue/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-blue/[0.01]">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center">
                 <Info size={20} />
              </div>
              <div>
                 <p className="text-sm font-black text-brand-blue uppercase tracking-tight">Need more proof?</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Download our Full Transparency & Audit Package</p>
              </div>
           </div>
           <button className="btn-outline border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-4 text-[10px]">
              Transparency Vault Access
           </button>
        </div>
      </div>
    </section>
  );
}
