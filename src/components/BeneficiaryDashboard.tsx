import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  History, 
  HandHeart, 
  Plus,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

interface HelpRequest {
  id: string;
  requestType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'fast_track';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  createdAt: any;
}

export default function BeneficiaryDashboard({ userProfile }: { userProfile: UserProfile }) {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'Education',
    description: '',
    priority: 'low'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'beneficiary_requests'),
      where('beneficiaryId', '==', userProfile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HelpRequest[];
      setRequests(docs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'beneficiary_requests');
    });

    return () => unsubscribe();
  }, [userProfile.uid]);

  const handleSubmitRequest = async () => {
    if (!newRequest.description) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'beneficiary_requests'), {
        beneficiaryId: userProfile.uid,
        requestType: newRequest.type,
        description: newRequest.description,
        status: 'pending',
        priority: newRequest.priority,
        createdAt: serverTimestamp()
      });
      setIsRequestModalOpen(false);
      setNewRequest({ type: 'Education', description: '', priority: 'low' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'beneficiary_requests');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Requests', value: requests.filter(r => r.status === 'pending' || r.status === 'approved').length, icon: Target, color: 'text-brand-blue' },
          { label: 'Support Received', value: requests.filter(r => r.status === 'approved').length, icon: HandHeart, color: 'text-brand-green' },
          { label: 'Pending Review', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-brand-orange' },
          { label: 'Status Tracking', value: 'Live', icon: History, color: 'text-purple-500' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8">
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <p className="text-3xl font-black text-brand-blue">{stat.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-brand-blue tracking-tighter uppercase">My Help Requests</h3>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="px-6 py-3 bg-brand-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all"
        >
          <Plus size={16} /> New Application
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-blue" size={48} />
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <FileText size={40} />
          </div>
          <h4 className="text-xl font-black text-brand-blue uppercase tracking-tighter">No Applications Yet</h4>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto">Apply for education, medical or emergency support through our strategic aid programs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:translate-x-2 transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                request.status === 'approved' ? 'bg-brand-green/10 text-brand-green' :
                request.status === 'rejected' ? 'bg-red-50 text-red-400' :
                'bg-brand-blue/5 text-brand-blue'
              }`}>
                {request.status === 'approved' ? <CheckCircle2 size={28} /> : 
                 request.status === 'rejected' ? <AlertCircle size={28} /> : 
                 <Clock size={28} />}
              </div>
              
              <div className="flex-grow text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                   <p className="font-black text-brand-blue uppercase">{request.requestType} Support</p>
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                     request.priority === 'emergency' ? 'bg-red-50 text-red-500 border-red-100' :
                     'bg-gray-50 text-gray-400 border-gray-100'
                   }`}>
                     {request.priority} Priority
                   </span>
                 </div>
                 <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
              </div>

              <div className="text-right shrink-0">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Protocol</p>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    <p className="font-black text-brand-blue uppercase text-xs tracking-widest">{request.status.replace('_', ' ')}</p>
                 </div>
              </div>

              <button className="p-3 bg-gray-50 rounded-xl text-gray-300 hover:text-brand-blue transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsRequestModalOpen(false)}
               className="absolute inset-0 bg-brand-blue/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
               className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
             >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">New Help Request</h3>
                  <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-all">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Support Type</label>
                      <select 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-brand-blue"
                        value={newRequest.type}
                        onChange={e => setNewRequest({...newRequest, type: e.target.value})}
                      >
                         <option>Education</option>
                         <option>Medical</option>
                         <option>Food</option>
                         <option>Emergency Relief</option>
                         <option>Shelter</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                      <textarea 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-brand-blue min-h-[120px]"
                        placeholder="Provide details about your requirement..."
                        value={newRequest.description}
                        onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map(p => (
                          <button 
                            key={p}
                            onClick={() => setNewRequest({...newRequest, priority: p as any})}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                              newRequest.priority === p ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-400 border-gray-100'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                   </div>

                   <button 
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting || !newRequest.description}
                    className="w-full py-5 bg-brand-green text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-green/20 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Submit for Review'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
