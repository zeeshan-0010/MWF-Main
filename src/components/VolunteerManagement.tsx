import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  HandHeart, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function VolunteerManagement() {
  const [user] = useAuthState(auth);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard'>('events');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skill, setSkill] = useState('');
  const [bio, setBio] = useState('');

  const handleJoinForce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to join as a volunteer.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'volunteer',
        status: 'pending',
        skills: [skill],
        bio: bio
      });
      setIsRegistered(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const events = [
    { id: '1', title: 'Weekend Education Drive', date: 'Sat, 26 Apr', location: 'City Slums', hours: 4, joined: 12 },
    { id: '2', title: 'Food Distribution Camp', date: 'Sun, 27 Apr', location: 'Railway Colony', hours: 3, joined: 8 },
    { id: '3', title: 'Health Awareness Workshop', date: 'Tue, 29 Apr', location: 'Foundation Office', hours: 5, joined: 5 }
  ];

  const leaderboard = [
    { name: 'Sameer Khan', hours: 120, rank: 1, photo: null },
    { name: 'Aditi Sharma', hours: 98, rank: 2, photo: null },
    { name: 'Zaid Ahmed', hours: 85, rank: 3, photo: null },
    { name: 'Rahul Varma', hours: 72, rank: 4, photo: null }
  ];

  return (
    <div className="w-full py-20 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <HandHeart className="text-brand-green" size={20} />
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Foundation Force</span>
            </div>
            <h2 className="text-4xl font-extrabold text-brand-blue tracking-tight mb-6">Turn Your <span className="text-brand-orange">Compassion</span> Into Action.</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              We need your skills, time, and empathy. From teaching children to managing logistics, every hour you contribute changes a life. Join our community of 500+ active volunteers today.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, label: 'Track Hours', desc: 'Get official credit' },
                { icon: Award, label: 'Get Certified', desc: 'Boost your CV' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-full flex items-center justify-center text-brand-blue">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-brand-blue">{item.label}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            {!isRegistered ? (
              <form className="space-y-6" onSubmit={handleJoinForce}>
                <h3 className="text-xl font-bold text-brand-blue mb-2">Volunteer Registration</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" defaultValue={user?.displayName || ''} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10" required />
                  <input type="email" placeholder="Email Address" defaultValue={user?.email || ''} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10" required />
                  <select 
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm italic text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                    required
                  >
                    <option value="">Select Primary Skill</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Medical Support">Medical Support</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Event Management">Event Management</option>
                  </select>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Why do you want to join us?" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 min-h-[100px]"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-brand-blue text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-blue/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : (
                    <><UserPlus size={16} /> Submit Application</>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-brand-blue mb-2">Welcome Aboard!</h3>
                <p className="text-gray-500 text-sm mb-8">Our team will review your application and reach out within 24 hours. Get ready to make an impact!</p>
                <button onClick={() => setIsRegistered(false)} className="text-xs font-bold text-brand-blue uppercase tracking-widest hover:underline">Apply for another role</button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex p-1 bg-gray-50 rounded-2xl">
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
              >
                Upcoming Events
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leaderboard' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
              >
                Top Contributors
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="wait">
              {activeTab === 'events' ? (
                <motion.div 
                  key="events"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {events.map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50/50 rounded-3xl hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center text-brand-blue shadow-sm shrink-0">
                          <span className="text-xs font-black leading-none">{event.date.split(',')[1].trim().split(' ')[0]}</span>
                          <span className="text-[10px] font-bold uppercase">{event.date.split(',')[1].trim().split(' ')[1]}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{event.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{event.location} • {event.hours} Hours Estimated</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">{event.joined} Volunteers</p>
                          <div className="flex gap-1 mt-1 justify-end">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-brand-green/20" />)}
                          </div>
                        </div>
                        <button className="p-4 bg-brand-blue text-white rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand-blue/10">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="leaderboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {leaderboard.map((v) => (
                    <div key={v.name} className="p-8 bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 flex flex-col items-center text-center transition-all">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-brand-blue/5 border-2 border-white flex items-center justify-center shadow-lg">
                          <Users size={32} className="text-brand-blue" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                          #{v.rank}
                        </div>
                      </div>
                      <h4 className="font-bold text-brand-blue mb-1">{v.name}</h4>
                      <div className="flex items-center gap-1.5 text-brand-green bg-brand-green/10 px-3 py-1 rounded-full mb-4">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{v.hours} Hours</span>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Master Contributor</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
