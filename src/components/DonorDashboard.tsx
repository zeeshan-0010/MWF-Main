import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  History, 
  Download, 
  TrendingUp, 
  Award, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { aiService } from '../services/aiService';
import { Sparkles, BrainCircuit } from 'lucide-react';

interface DonorDashboardProps {
  userProfile: UserProfile;
}

export default function DonorDashboard({ userProfile }: DonorDashboardProps) {
  const [donations, setDonations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    impactScore: 0,
    campaignsSupported: 0,
    rank: 'Silver Supporter'
  });

  useEffect(() => {
    const mainFlow = async () => {
      const q = query(
        collection(db, 'donations'),
        where('donorId', '==', userProfile.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(docs);

      const total = docs.reduce((acc, curr: any) => acc + (curr.amount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalDonated: total,
        campaignsSupported: new Set(docs.map((d: any) => d.campaignId)).size,
        impactScore: Math.floor(total / 100)
      }));

      // AI Recommendations
      try {
        const campaignsSnap = await getDocs(collection(db, 'campaigns'));
        const allCampaigns = campaignsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const recs = await aiService.getDonationRecommendations({
          donorHistory: docs,
          availableCampaigns: allCampaigns
        });
        setRecommendations(recs);
      } catch (err) {
        console.error("AI Recs failed", err);
      }
    };

    if (userProfile.uid) {
      mainFlow();
    }
  }, [userProfile.uid]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-brand-blue tracking-tight">Philanthropy Hub</h2>
          <p className="text-gray-400 text-sm font-medium">Tracking your contribution to social change</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm border border-gray-100">
             <img 
               src="https://firebasestorage.googleapis.com/v0/b/ai-studio-assets.appspot.com/o/Mohania_Welfare_Foundation_Logo.png?alt=media" 
               alt="MWF Logo" 
               className="w-full h-full object-contain"
             />
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <div className="flex gap-3">
          <button className="btn-outline flex gap-2 items-center">
            <History size={16} /> History
          </button>
          <button className="btn-primary flex gap-2 items-center shadow-lg shadow-brand-blue/20">
            <Heart size={16} /> New Donation
          </button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Contribution', value: `₹${stats.totalDonated}`, icon: Heart, color: 'text-brand-orange' },
          { label: 'Impact Score', value: stats.impactScore, icon: TrendingUp, color: 'text-brand-green' },
          { label: 'Campaigns', value: stats.campaignsSupported, icon: ShieldCheck, color: 'text-brand-blue' },
          { label: 'Badge Level', value: stats.rank, icon: Award, color: 'text-brand-orange' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-card p-6 border-b-4 border-b-transparent hover:border-b-brand-blue transition-all group"
          >
            <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-4 group-hover:bg-brand-blue/5 transition-colors">
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-brand-blue">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-brand-blue uppercase tracking-tight">Recent Activity</h3>
              <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {donations.length > 0 ? donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-brand-green">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-blue">{donation.campaignTitle || 'General Donation'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Transaction ID: {donation.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand-blue">₹{donation.amount}</p>
                    <button className="text-[9px] font-black text-brand-blue flex items-center gap-1 mt-1 hover:text-brand-orange transition-colors">
                      <Download size={10} /> RECEIPT
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 text-sm italic">You haven't made any donations yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 bg-brand-blue text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Impact Certificate</h3>
              <p className="text-white/60 text-xs mb-6 font-medium leading-relaxed">Your support has directly impacted 12 families this month. Download your official recognition.</p>
              <button className="w-full py-4 bg-white text-brand-blue rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-black/10 hover:bg-brand-orange hover:text-white transition-all">
                <Download size={14} /> Download Certificate
              </button>
            </div>
            <Heart size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
          </div>

          <div className="glass-card p-8 border border-brand-blue/10 bg-brand-blue/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
                <BrainCircuit size={20} />
              </div>
              <h3 className="text-sm font-black text-brand-blue uppercase tracking-tight">AI Strategic Matches</h3>
            </div>
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec: any, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-brand-blue/20 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Match Score: {90 - idx * 5}%</p>
                    <Sparkles size={12} className="text-brand-orange animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-blue group-hover:text-brand-orange transition-colors mb-1">{rec.campaignId}</h4>
                  <p className="text-[10px] text-gray-500 italic leading-snug">{rec.reason}</p>
                </div>
              )) : (
                <div className="text-center py-6">
                   <div className="animate-spin w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-2" />
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Generating Strategic Recs...</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <div className="w-full h-32 rounded-2xl bg-gray-100 mb-3 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-xs font-bold text-brand-blue group-hover:text-brand-orange transition-colors">Winter Blanket Distribution</h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">Goal: ₹50,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
