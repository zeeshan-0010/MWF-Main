import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowLeftRight,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function BeforeAfterGallery() {
  const [activeItem, setActiveItem] = useState(0);

  const items = [
    {
      id: 1,
      title: 'Rural School Restoration',
      location: 'Mohania East',
      before: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      desc: 'Completely renovated a dilapidated structure into a modern learning center with solar power and digital tabs.'
    },
    {
      id: 2,
      title: 'Water Well Initiative',
      location: 'Rohtas Outskirts',
      before: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
      desc: 'Replacing hazardous contaminated pits with deep bore-wells providing clean drinking water to 40 families.'
    },
    {
      id: 3,
      title: 'Medical Camp 2023',
      location: 'Community Hall',
      before: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&w=800&q=80',
      desc: 'Scaling from a simple sidewalk checkup to a fully equipped temporary clinic serving 500+ patients.'
    }
  ];

  return (
    <div className="w-full py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-brand-orange" size={20} />
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">Visual Impact</span>
          </div>
          <h2 className="text-4xl font-extrabold text-brand-blue tracking-tight mb-4">The Proof is in the <span className="text-brand-green italic">Progress</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">See the tangible transformations made possible through your support. Every donation translates into a visible change on the ground.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               onMouseEnter={() => setActiveItem(idx)}
               className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl mb-6">
                {/* Before Image */}
                <img 
                  src={item.before} 
                  alt="Before" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeItem === idx ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* After Image */}
                <img 
                  src={item.after} 
                  alt="After" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeItem === idx ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest transition-all ${activeItem === idx ? 'bg-brand-green/80 text-white' : 'bg-black/40 text-white'}`}>
                    {activeItem === idx ? 'After' : 'Before'}
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <MapPin size={10} /> {item.location}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 duration-500">
                  <ArrowLeftRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-brand-green/5 rounded-[3rem] p-8 md:p-12 border border-brand-green/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shrink-0">
               <TrendingUp size={36} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-brand-blue mb-2">30+ Major Projects Completed in 2023</h3>
              <p className="text-gray-500 text-sm italic">"The letterhead theme isn't just for show—it represents our commitment to official, documented and impactful change."</p>
            </div>
            <button className="px-10 py-5 bg-brand-green text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all">
              View All Impact Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
