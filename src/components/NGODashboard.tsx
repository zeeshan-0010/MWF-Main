import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  FileText, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  LayoutGrid,
  Globe,
  Settings,
  HandHeart
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function NGODashboard({ userProfile }: { userProfile: UserProfile }) {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [newCollab, setNewCollab] = useState({
    title: '',
    description: '',
    type: 'Campaign'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // We could have a 'collaborations' collection
    const q = query(
      collection(db, 'collaborations'),
      where('ngoId', '==', userProfile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCollaborations(docs);
      setIsLoading(false);
    }, (error) => {
      // It's okay if collection doesn't exist yet, rules might deny if it's the first time
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile.uid]);

  const handleSubmitCollab = async () => {
    if (!newCollab.title) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'collaborations'), {
        ngoId: userProfile.uid,
        ngoName: userProfile.displayName || 'Partner NGO',
        ...newCollab,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsCollabModalOpen(false);
      setNewCollab({ title: '', description: '', type: 'Campaign' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'collaborations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* NGO Header */}
      <div className="bg-brand-blue rounded-[2.5rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-brand-blue flex-shrink-0 shadow-2xl">
              <Building2 size={48} />
           </div>
           <div className="text-center md:text-left flex-grow">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
                {userProfile.ngoDetails?.orgName || 'Partner Organization'}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                   <Target size={14} className="text-brand-orange" /> Reg: {userProfile.ngoDetails?.regNumber || 'Pending Verification'}
                 </span>
                 <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                   <Globe size={14} className="text-brand-green" /> {userProfile.ngoDetails?.website || 'Official Site'}
                 </span>
              </div>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20`}>
                {userProfile.status}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Mission & Reports */}
        <div className="md:col-span-1 space-y-8">
           <div className="glass-card p-8">
              <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings size={14} /> NGO Protocol
              </h3>
              <div className="space-y-2">
                 <button className="w-full p-4 bg-gray-50 rounded-2xl text-left hover:bg-white transition-all flex items-center gap-3 group">
                    <FileText size={18} className="text-gray-400 group-hover:text-brand-blue" />
                    <span className="text-xs font-black text-brand-blue uppercase tracking-widest">Update Registration</span>
                 </button>
                 <button className="w-full p-4 bg-gray-50 rounded-2xl text-left hover:bg-white transition-all flex items-center gap-3 group">
                    <HandHeart size={18} className="text-gray-400 group-hover:text-brand-blue" />
                    <span className="text-xs font-black text-brand-blue uppercase tracking-widest">Collaborative Needs</span>
                 </button>
                 <button className="w-full p-4 bg-gray-50 rounded-2xl text-left hover:bg-white transition-all flex items-center gap-3 group">
                    <LayoutGrid size={18} className="text-gray-400 group-hover:text-brand-blue" />
                    <span className="text-xs font-black text-brand-blue uppercase tracking-widest">Global Taxonomy</span>
                 </button>
              </div>
           </div>

           <div className="glass-card p-8">
              <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Funding Status</h3>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-4xl font-black text-brand-blue">0</span>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Approved Grants</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next assessment in 12 days</p>
           </div>
        </div>

        {/* Right Column: Collaborations & Requests */}
        <div className="md:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">Active Collaborations</h3>
              <button 
                onClick={() => setIsCollabModalOpen(true)}
                className="px-6 py-3 bg-brand-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-green/20"
              >
                <Plus size={16} /> Request Partnership
              </button>
           </div>

           {collaborations.length === 0 ? (
             <div className="glass-card p-20 text-center border-dashed border-2 border-gray-100">
               <Users className="mx-auto text-gray-200 mb-6" size={48} />
               <h4 className="text-lg font-black text-brand-blue uppercase tracking-tighter">No Active Partnerships</h4>
               <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Start by requesting a collaboration on our active campaigns or utility missions.</p>
             </div>
           ) : (
             <div className="space-y-4">
                {collaborations.map((collab) => (
                  <div key={collab.id} className="glass-card p-6 flex items-center gap-6">
                     <div className="w-12 h-12 bg-brand-blue/5 rounded-xl flex items-center justify-center text-brand-blue">
                        <Target size={24} />
                     </div>
                     <div className="flex-grow">
                        <p className="font-black text-brand-blue uppercase text-sm mb-1">{collab.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{collab.type} Protocol</p>
                     </div>
                     <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          collab.status === 'approved' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'
                        }`}>
                          {collab.status}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
           )}

           <div className="glass-card p-8 bg-gray-50/50">
              <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-6">Resource Allocation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: 'Volunteers', value: '0', icon: Users },
                   { label: 'Assets', value: 'None', icon: LayoutGrid },
                   { label: 'Grants', value: 'None', icon: HandHeart },
                   { label: 'Reports', value: '0', icon: FileText }
                 ].map((box, i) => (
                   <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <box.icon className="mx-auto text-gray-300 mb-2" size={18} />
                      <p className="font-black text-brand-blue text-sm">{box.value}</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{box.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Collaboration Modal */}
      <AnimatePresence>
        {isCollabModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsCollabModalOpen(false)}
               className="absolute inset-0 bg-brand-blue/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
               className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
             >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">Partnersorship Request</h3>
                  <button onClick={() => setIsCollabModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400">
                    <LayoutGrid size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Collab Title</label>
                      <input 
                        type="text"
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-brand-blue"
                        placeholder="e.g. Rural Literacy Drive"
                        value={newCollab.title}
                        onChange={e => setNewCollab({...newCollab, title: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Collaboration Type</label>
                      <select 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-brand-blue"
                        value={newCollab.type}
                        onChange={e => setNewCollab({...newCollab, type: e.target.value})}
                      >
                         <option>Campaign Execution</option>
                         <option>Resource Sharing</option>
                         <option>Volunteer Deployment</option>
                         <option>Grant Fulfillment</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Strategic Purpose</label>
                      <textarea 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-brand-blue min-h-[120px]"
                        placeholder="Explain how this partnership achieves goal..."
                        value={newCollab.description}
                        onChange={e => setNewCollab({...newCollab, description: e.target.value})}
                      />
                   </div>

                   <button 
                    onClick={handleSubmitCollab}
                    disabled={isSubmitting || !newCollab.title}
                    className="w-full py-5 bg-brand-blue text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Log Partnership Protocol'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
