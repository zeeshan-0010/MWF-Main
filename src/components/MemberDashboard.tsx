import React from 'react';
import { 
  MessageSquare, 
  Share2, 
  MapPin, 
  Bell, 
  Plus, 
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';
import UpdateFeed from './UpdateFeed';
import { motion } from 'motion/react';

interface MemberDashboardProps {
  userProfile: UserProfile;
}

export default function MemberDashboard({ userProfile }: MemberDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-1000">
      {/* Sidebar: Profile & Community Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-gray-100 mx-auto mb-6 border-4 border-white shadow-xl overflow-hidden group-hover:rotate-3 transition-transform duration-500">
               {userProfile.photoURL ? (
                 <img src={userProfile.photoURL} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-brand-blue bg-blue-50">
                   <Plus size={32} />
                 </div>
               )}
            </div>
            <h2 className="text-xl font-black text-brand-blue tracking-tight mb-1">{userProfile.displayName}</h2>
            <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-6">Verified {userProfile.role.replace('_', ' ')}</p>
            
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-50">
              <div className="text-center">
                <p className="text-lg font-black text-brand-blue leading-none">{userProfile.reputation || 0}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Reputation</p>
              </div>
              <div className="text-center border-l border-gray-50">
                <p className="text-lg font-black text-brand-green leading-none">12</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Updates</p>
              </div>
            </div>
            
            <button className="w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black text-brand-blue tracking-widest uppercase hover:bg-white hover:shadow-lg transition-all mt-4">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={16} className="text-brand-orange" />
            <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Community Pulse</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: '#HealthDrive2026', count: '1.2k interactions' },
              { label: '#SlumEducation', count: '850 shares' },
              { label: '#MohaniaVolunteers', count: '420 updates' },
            ].map(topic => (
              <div key={topic.label} className="group cursor-pointer">
                <p className="text-xs font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{topic.label}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{topic.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Feed */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-card p-6 flex items-center gap-4 border-2 border-brand-blue/5">
           <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
             {userProfile.photoURL && <img src={userProfile.photoURL} alt="avatar" className="w-full h-full object-cover" />}
           </div>
           <button className="flex-grow text-left px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 text-sm font-medium hover:bg-white hover:shadow-inner transition-all border border-transparent hover:border-gray-100">
             What's happening in your neighborhood?
           </button>
           <div className="flex gap-2">
             <button className="p-4 bg-brand-blue/5 text-brand-blue rounded-2xl hover:bg-brand-blue hover:text-white transition-all">
               <ImageIcon size={20} />
             </button>
           </div>
        </div>

        <UpdateFeed userProfile={userProfile} />
      </div>

      {/* Right Column: People & Notifications */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Recent Activity</h3>
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-6">
             {[
               { icon: MessageSquare, text: 'Admin Liked your report', time: '2m ago', color: 'bg-brand-blue/10 text-brand-blue' },
               { icon: Bell, text: 'New Event: Slum Health Checkup', time: '1h ago', color: 'bg-brand-green/10 text-brand-green' },
               { icon: Share2, text: 'Campaign reached 80% goal', time: '3h ago', color: 'bg-brand-orange/10 text-brand-orange' },
             ].map((note, i) => (
               <div key={i} className="flex gap-4">
                 <div className={`p-2 rounded-lg h-fit ${note.color}`}>
                   <note.icon size={14} />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-brand-blue leading-tight">{note.text}</p>
                   <p className="text-[8px] text-gray-400 mt-1">{note.time}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-card p-8 border-t-4 border-t-brand-green">
           <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Active Members</h3>
           <div className="flex -space-x-3">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="w-10 h-10 rounded-xl bg-gray-200 border-2 border-white overflow-hidden shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                 <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">+12</div>
           </div>
           <p className="text-[10px] text-gray-400 mt-4 font-medium">Connect with fellow foundation members near you.</p>
        </div>
      </div>
    </div>
  );
}
