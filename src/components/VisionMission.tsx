import React from 'react';
import { motion } from 'motion/react';
import { Target, Heart, GraduationCap, Globe, Users, Zap, ShieldCheck, Leaf } from 'lucide-react';

const VisionMission: React.FC = () => {
  const missions = [
    {
      title: "Empowering Through Education",
      desc: "To establish and sustain world-class institutions that nurture intellectual curiosity, critical thinking, and lifelong learning.",
      icon: GraduationCap,
      color: "brand-blue"
    },
    {
      title: "Promoting Holistic Development",
      desc: "To develop individuals who are socially responsible, ethically grounded, and professionally competent.",
      icon: Heart,
      color: "brand-orange"
    },
    {
      title: "Encouraging Innovation",
      desc: "To create platforms for research, creativity, and innovation, addressing real-world challenges with sustainable solutions.",
      icon: Zap,
      color: "brand-blue"
    },
    {
      title: "Ensuring Accessibility",
      desc: "To provide affordable and equitable education that bridges gaps across communities and fosters unity.",
      icon: Globe,
      color: "brand-green"
    },
    {
      title: "Environmental Protection",
      desc: "Advancing sustainability through eco-friendly practices like tree planting, renewable energy, and water conservation.",
      icon: Leaf,
      color: "brand-green"
    },
    {
      title: "Building Strong Communities",
      desc: "To engage with society through outreach programs, skill development, and partnerships that promote progress.",
      icon: Users,
      color: "purple-500"
    }
  ];

  return (
    <section className="py-24 bg-white" id="vision">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="relative"
           >
              <div className="w-20 h-2 bg-brand-orange mb-8 rounded-full" />
              <h2 className="text-6xl font-black text-brand-blue uppercase tracking-tighter leading-none mb-8">
                Our Foundation <br />
                <span className="text-brand-orange">Vision</span>
              </h2>
              <p className="text-2xl text-gray-500 font-medium leading-relaxed italic">
                “To be a catalyst for transforming society by fostering excellence in education, innovation, environment and community service, empowering individuals to contribute meaningfully to a sustainable and inclusive world.”
              </p>
           </motion.div>
           <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-brand-blue/5 rounded-[4rem] -rotate-3 scale-110" />
              {[GraduationCap, Target, Heart, Globe].map((Icon, i) => (
                <div key={i} className={`glass-card p-12 flex items-center justify-center relative ${i % 2 === 1 ? 'translate-y-8' : ''}`}>
                   <Icon size={48} className="text-brand-blue/20" />
                </div>
              ))}
           </div>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-[0.3em] mb-4">The Mission Matrix</h3>
          <div className="w-12 h-1 bg-brand-blue mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {missions.map((mission, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-card p-10 group hover:bg-brand-blue transition-all duration-500"
             >
                <div className={`w-12 h-12 rounded-xl bg-${mission.color}/10 flex items-center justify-center text-${mission.color} mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors`}>
                   <mission.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-brand-blue uppercase tracking-tighter mb-4 group-hover:text-white transition-colors">
                  {mission.title}
                </h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                  {mission.desc}
                </p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
