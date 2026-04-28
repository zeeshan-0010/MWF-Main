import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Campaign } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  IndianRupee, 
  ArrowRight, 
  PieChart,
  Calendar,
  AlertCircle,
  Trophy,
  Users,
  ShieldCheck
} from 'lucide-react';
import DonationModal from './DonationModal';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'campaigns'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
      
      // Fallback with mock data if empty
      if (docs.length === 0) {
        setCampaigns([
          {
            id: '1',
            title: 'Education for All: Slum Schools',
            description: 'Providing basic stationery, uniforms, and books for 150 children in the local slums.',
            targetAmount: 50000,
            currentAmount: 32500,
            category: 'Education',
            status: 'active',
            createdAt: new Date(),
            imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '2',
            title: 'Ramadan Ration Drive',
            description: 'Distributing food kits to 500 families struggling with rising food costs.',
            targetAmount: 200000,
            currentAmount: 145000,
            category: 'Food',
            status: 'active',
            createdAt: new Date(),
            imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '3',
            title: 'Free Health Checkup Camp',
            description: 'Organizing a multi-specialty health camp with free medicines for senior citizens.',
            targetAmount: 75000,
            currentAmount: 75000,
            category: 'Health',
            status: 'completed',
            createdAt: new Date(),
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&w=800&q=80'
          }
        ]);
      } else {
        setCampaigns(docs);
      }
    });

    return () => unsubscribe();
  }, []);

  const openDonation = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDonationOpen(true);
  };

  const categories = ['All', 'Education', 'Food', 'Health', 'Disaster Relief'];
  const filteredCampaigns = selectedCategory === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.category === selectedCategory);

  return (
    <div className="w-full py-16 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-brand-orange" size={20} />
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.3em]">Our Missions</span>
            </div>
            <h2 className="text-4xl font-extrabold text-brand-blue tracking-tight mb-4">Active Campaigns</h2>
            <p className="text-gray-500 text-lg">Choose a cause that speaks to you and help us reach our goals. Each contribution is tracked real-time.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                    : 'bg-white text-gray-400 hover:text-brand-blue border border-gray-100 hover:border-brand-blue/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((campaign) => {
              const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
              return (
                <motion.div
                  layout
                  key={campaign.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={campaign.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'} 
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-brand-blue">
                      {campaign.category}
                    </div>
                    {campaign.status === 'completed' && (
                      <div className="absolute inset-0 bg-brand-green/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white px-6 py-2 rounded-full shadow-xl">
                          <span className="text-xs font-black text-brand-green uppercase tracking-[0.2em]">Goal Achieved</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-extrabold text-brand-blue mb-3 group-hover:text-brand-orange transition-colors">{campaign.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">{campaign.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                          <span className="text-xs font-black text-brand-blue">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${campaign.status === 'completed' ? 'bg-brand-green' : 'bg-brand-orange'}`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Raised</p>
                          <p className="text-sm font-black text-brand-blue">₹{campaign.currentAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Goal</p>
                          <p className="text-sm font-black text-gray-300">₹{campaign.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => openDonation(campaign)}
                        disabled={campaign.status === 'completed'}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                          campaign.status === 'completed' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-brand-blue text-white hover:shadow-brand-blue/30'
                        }`}
                      >
                        {campaign.status === 'completed' ? 'Mission Success' : <><IndianRupee size={14} /> Contribute Now</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Donors Recognition */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 text-brand-orange/5 group-hover:text-brand-orange/10 transition-colors">
                    <Trophy size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="text-brand-orange" size={20} />
                        <h3 className="text-xl font-extrabold text-brand-blue">Top Contributors</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Dr. Arshad Jamal', amount: '₹25,000', badge: 'Diamond' },
                            { name: 'Sameera Textiles', amount: '₹15,000', badge: 'Gold' },
                            { name: 'Anonymous Donor', amount: '₹10,500', badge: 'Silver' }
                        ].map((donor, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-sm">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-blue text-sm">{donor.name}</p>
                                        <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest">{donor.badge} Donor</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-brand-blue">{donor.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-brand-blue p-8 rounded-[3rem] shadow-xl text-white flex flex-col justify-center">
                <h3 className="text-3xl font-extrabold mb-4 leading-tight">Your Trust is our <br />Greatest Asset.</h3>
                <p className="text-brand-blue/20 text-sm mb-6 leading-relaxed">
                    Mohania Welfare Foundation ensures that 100% of public donations go directly to our field missions. We take pride in our zero-overhead model for specific campaigns.
                </p>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center shadow-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Transparency Audit Completed: Q1 2024</p>
                </div>
            </div>
        </div>
      </div>

      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
        campaign={selectedCampaign || undefined}
      />
    </div>
  );
}
