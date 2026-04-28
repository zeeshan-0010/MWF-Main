import React from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, GraduationCap, Scale, Users, Heart, Target, ChevronRight, Linkedin, Mail } from 'lucide-react';

const LeadershipSection: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden" id="leadership">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-full border border-brand-blue/10 mb-6"
          >
            <Users className="text-brand-blue" size={16} />
            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em]">Our Governance & Leadership</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-brand-blue tracking-tighter uppercase leading-none mb-6">
            Visionary <span className="text-brand-orange">Leadership</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
            Guided by decades of experience in large-scale social transformation and legal advocacy, our directors lead MWF toward a future of holistic community empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Director 1: Md Zahid Hussain */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass-card p-0 rounded-[3rem] overflow-hidden border border-brand-blue/10 group hover:shadow-3xl hover:shadow-brand-blue/5 transition-all duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              <div className="md:col-span-2 relative overflow-hidden">
                <img
                  src="/images/zahid_hussain.jpg"
                  alt="Md Zahid Hussain"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="flex gap-2">
                    <Award size={18} className="text-brand-orange" />
                    <span className="text-[10px] font-black uppercase tracking-widest">16+ Years Experience</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 p-10 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-brand-blue uppercase tracking-tighter mb-1">Md Zahid Hussain</h3>
                  <p className="text-brand-orange text-xs font-black uppercase tracking-widest">Director</p>
                </div>

                <div className="space-y-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue shrink-0">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qualifications</p>
                      <p className="text-sm font-bold text-brand-blue">M.A. (RD), MSW, L.L.B.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                      "Senior Development Professional with 16+ years of leadership experience across Anti-Human Trafficking, Bonded Labour, and Child Protection."
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Legal Advocacy', 'Program Design', 'MERL', 'Team Leadership'].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-brand-blue/[0.02] border border-brand-blue/5 rounded-2xl">
                    <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target size={14} className="text-brand-orange" /> Major Achievement
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">Successfully led 7,000+ survivor rescues from multi-generational bondage, sex slavery, and human trafficking.</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Linkedin className="text-gray-300 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
                    <Mail className="text-gray-300 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
                  </div>
                  <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 group/btn">
                    Full Bio <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Director 2: Dr. MD Sajid Alam */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass-card p-0 rounded-[3rem] overflow-hidden border border-brand-blue/10 group hover:shadow-3xl hover:shadow-brand-blue/5 transition-all duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              <div className="md:col-span-2 relative overflow-hidden">
                <img
                  src="/images/sajid_alam.jpg"
                  alt="Dr. MD Sajid Alam"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="flex gap-2">
                    <Heart size={18} className="text-brand-orange" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Founder & Visionary</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 p-10 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-brand-blue uppercase tracking-tighter mb-1">Dr. MD Sajid Alam</h3>
                  <p className="text-brand-orange text-xs font-black uppercase tracking-widest">Founder / Managing Director</p>
                </div>

                <div className="space-y-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue shrink-0">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Leadership Focus</p>
                      <p className="text-sm font-bold text-brand-blue">Educational Transformation & Institution Building</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                      "Strategic visionary leading MWF toward large-scale transformation through sustainable development and community upliftment."
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Social Welfare', 'Youth Empowerment', 'Holistic Growth', 'National Impact'].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-brand-blue/[0.02] border border-brand-blue/5 rounded-2xl">
                    <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Award size={14} className="text-brand-orange" /> Leadership Vision
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">Fostering excellence in education and innovation to empower individuals for a sustainable and inclusive world.</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Linkedin className="text-gray-300 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
                    <Mail className="text-gray-300 hover:text-brand-blue cursor-pointer transition-colors" size={20} />
                  </div>
                  <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 group/btn">
                    Full Bio <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
