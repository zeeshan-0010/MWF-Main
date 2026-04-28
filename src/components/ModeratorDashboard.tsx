import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Flag,
  Filter,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ModeratorDashboardProps {
  userProfile: UserProfile;
}

export default function ModeratorDashboard({ userProfile }: ModeratorDashboardProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const q = query(collection(db, 'reported_updates'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchReports();
  }, []);

  const handleResolution = async (reportId: string, action: 'keep' | 'remove') => {
    try {
      if (action === 'remove') {
        const report = reports.find(r => r.id === reportId);
        if (report && report.updateId) {
          await deleteDoc(doc(db, 'updates', report.updateId));
        }
      }
      await deleteDoc(doc(db, 'reported_updates', reportId));
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error("Resolution error:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-brand-blue tracking-tight uppercase italic">Moderation Terminal</h2>
          <p className="text-gray-400 text-sm font-medium">Protecting the community from invalid content</p>
        </div>
        <div className="flex gap-4 p-2 bg-gray-100 rounded-2xl">
          <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black text-brand-blue uppercase tracking-widest">Active Alerts</button>
          <button className="px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Investigation Log</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Unresolved Reports', value: reports.length, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Content Managed', value: '142', icon: MessageSquare, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
          { label: 'Avg Feedback Loop', value: '42m', icon: AlertTriangle, color: 'text-brand-orange', bg: 'bg-brand-orange/5' },
        ].map((stat, i) => (
          <div key={stat.label} className="glass-card p-8 group">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-brand-blue">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 border border-red-50 shadow-2xl shadow-red-500/5">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Flag size={20} className="text-red-500 animate-bounce" />
            <h3 className="text-lg font-black text-brand-blue uppercase tracking-tight">Security Quarantine</h3>
          </div>
          <button className="btn-outline border-gray-100 flex gap-2 items-center text-[10px]">
            <Filter size={14} /> Filter Queue
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {reports.length > 0 ? reports.map((report) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={report.id} 
                className="flex flex-col md:flex-row gap-8 p-8 bg-gray-50 rounded-[3rem] border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className="flex-grow">
                   <div className="flex items-center gap-4 mb-4">
                     <span className="px-3 py-1 bg-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">Reported Post</span>
                     <span className="text-xs text-gray-400 font-bold italic">{new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                   </div>
                   <p className="text-sm text-gray-600 font-medium leading-relaxed bg-white/50 p-6 rounded-[2rem] border border-gray-50 mb-4 italic">
                    "{report.reason || 'No reason provided'}"
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                     <ShieldAlert size={12} /> REPORTER ID: <span className="text-brand-blue">{report.reporterId.slice(0, 8)}</span>
                   </div>
                </div>
                <div className="flex md:flex-col justify-center gap-3 min-w-[180px]">
                   <button 
                    onClick={() => handleResolution(report.id, 'remove')}
                    className="flex-grow py-4 bg-red-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                   >
                     <XCircle size={16} /> Delete Post
                   </button>
                   <button 
                    onClick={() => handleResolution(report.id, 'keep')}
                    className="flex-grow py-4 bg-brand-blue text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                   >
                     <CheckCircle2 size={16} /> Clear Report
                   </button>
                   <button className="py-4 bg-gray-100 text-gray-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                     <Eye size={16} /> View Post
                   </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={40} />
                 </div>
                 <h4 className="text-2xl font-black text-brand-blue tracking-tight">System Secure</h4>
                 <p className="text-gray-400 text-sm">No unresolved reports in the queue.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
