import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogIn, LogOut, User as UserIcon, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  onJoin: () => void;
}

export default function Header({ userProfile, onJoin }: HeaderProps) {
  const [user] = useAuthState(auth);

  return (
    <header className="w-full bg-white border-b border-brand-blue/10 py-4 sticky top-0 z-[100] backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-xl shadow-brand-blue/5 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0"
          >
            <img
              src="/images/mwf_logo.jpg"
              alt="Mohania Welfare Foundation Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div>
            <h1 className="text-xl md:text-2xl text-brand-blue font-black tracking-tighter uppercase leading-none">
              Mohania Welfare Foundation
            </h1>
            <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.2em] mt-1 hidden sm:block">
              Registered Under Section-8 of the Companies Act 2013
            </p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3 bg-brand-blue/5 p-2 pr-4 rounded-full border border-brand-blue/10">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100">
                <UserIcon size={16} className="text-brand-blue" />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-blue uppercase tracking-tight leading-none">{user.displayName?.split(' ')[0]}</span>
                {userProfile && (
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${userProfile.status === 'approved' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' :
                    userProfile.status === 'pending' || userProfile.status === 'under_review' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' :
                      'bg-red-100 text-red-500 border-red-200'
                    }`}>
                    {userProfile.status}
                  </span>
                )}
              </div>
              {userProfile && (
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-tight mt-0.5">
                  {userProfile.role.replace('_', ' ')}
                </span>
              )}
              <button
                onClick={logout}
                className="text-[9px] font-black text-brand-orange hover:text-red-700 transition-colors uppercase tracking-widest text-left mt-1"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onJoin}
            className="px-8 py-3 bg-brand-blue text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-brand-blue/10"
          >
            Join the Network
          </button>
        )}
      </div>
    </header>
  );
}

