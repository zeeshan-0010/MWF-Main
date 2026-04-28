import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2,
  ChevronRight,
  Download,
  Zap
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

interface VolunteerDashboardProps {
  userProfile: UserProfile;
}

export default function VolunteerDashboard({ userProfile }: VolunteerDashboardProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalHours: 42,
    eventsJoined: 8,
    impactPoints: 1250,
    level: 'Lead Volunteer'
  });

  useEffect(() => {
    const q = query(
      collection(db, 'volunteer_tasks'),
      where('volunteerId', '==', userProfile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(docs);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'volunteer_tasks');
    });

    const fetchRecommendations = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, 'events'));
        const allEvents = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const matches = await aiService.matchVolunteer({
          volunteerSkills: (userProfile as any).volunteerDetails?.primarySkill ? [(userProfile as any).volunteerDetails.primarySkill] : ['General'],
          currentEvents: allEvents
        });
        setRecommendations(matches);
      } catch (err) {
        console.warn("AI Matching failed:", err);
      }
    };

    fetchRecommendations();
    return () => unsubscribe();
  }, [userProfile.uid]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-brand-blue tracking-tight">Force for Good</h2>
          <p className="text-gray-400 text-sm font-medium">Your hands-on contribution to the community</p>
        </div>
        <button className="btn-primary flex gap-2 items-center shadow-lg shadow-brand-blue/20">
          <Calendar size={16} /> Explore Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Volunteer Hours', value: stats.totalHours, icon: Clock, color: 'text-brand-orange' },
          { label: 'Impact Points', value: stats.impactPoints, icon: Zap, color: 'text-brand-green' },
          { label: 'Events Joined', value: stats.eventsJoined, icon: Users, color: 'text-brand-blue' },
          { label: 'Active Level', value: stats.level, icon: Award, color: 'text-brand-orange' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-card p-6"
          >
            <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-4">
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
            <h3 className="text-sm font-black text-brand-blue uppercase tracking-tight mb-8">Activity Ledger</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                   <Loader2 className="animate-spin text-brand-blue" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-10">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No assigned tasks yet</p>
                </div>
              ) : activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-brand-blue/5 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${activity.status === 'completed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue'}`}>
                      {activity.status === 'completed' ? <CheckCircle2 size={20} /> : <Calendar size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-brand-blue uppercase">{activity.taskName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {activity.assignedDate?.toDate?.().toLocaleDateString() || 'Pending'}
                        </span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[10px] text-brand-blue font-black uppercase tracking-widest leading-none line-clamp-1">{activity.description}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full border ${activity.status === 'completed' ? 'border-brand-green/30 text-brand-green' : 'border-brand-blue/30 text-brand-blue'}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 bg-brand-orange text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Volunteer Certificate</h3>
              <p className="text-white/80 text-xs mb-6 font-medium leading-relaxed">Recognizing your commitment to the Weekend Education Drive. Available now.</p>
              <button className="w-full py-4 bg-white text-brand-orange rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-black/10 hover:bg-brand-blue hover:text-white transition-all group">
                <Download size={14} className="group-hover:-translate-y-1 transition-transform" /> Download Certificate
              </button>
            </div>
            <Award size={140} className="absolute -bottom-12 -right-12 text-white/10 -rotate-12" />
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
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Match Score: {95 - idx * 2}%</p>
                    <Sparkles size={12} className="text-brand-orange animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-brand-blue group-hover:text-brand-orange transition-colors mb-1">{rec.eventId}</h4>
                  <p className="text-[10px] text-gray-500 italic leading-snug">{rec.matchReason}</p>
                </div>
              )) : (
                <div className="text-center py-6">
                   <div className="animate-spin w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-2" />
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Analyzing your skills...</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8 border border-brand-green/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                <MapPin size={16} />
              </div>
              <h3 className="text-xs font-black text-brand-blue uppercase tracking-tight">Active Opportunities</h3>
            </div>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">In 2 Days</p>
                <h4 className="text-sm font-bold text-brand-blue group-hover:text-brand-orange transition-colors">Slum Education Initiative</h4>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-medium">
                  <MapPin size={10} /> City Center Hub
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
