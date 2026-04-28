import Header from './components/Header';
import Footer from './components/Footer';
import UpdateFeed from './components/UpdateFeed';
import MemberConnect from './components/MemberConnect';
import ActivityFeed from './components/ActivityFeed';
import ImpactDashboard from './components/ImpactDashboard';
import Campaigns from './components/Campaigns';
import Gallery from './components/Gallery';
import VolunteerManagement from './components/VolunteerManagement';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import TrustCertificates from './components/TrustCertificates';
import LegalCompliance from './components/LegalCompliance';
import LeadershipSection from './components/LeadershipSection';
import VisionMission from './components/VisionMission';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import DonorDashboard from './components/DonorDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import MemberDashboard from './components/MemberDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import StaffDashboard from './components/StaffDashboard';
import CSRDashboard from './components/CSRDashboard';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import NGODashboard from './components/NGODashboard';
import DonationModal from './components/DonationModal';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Heart, GraduationCap, Users, ShieldCheck, ArrowRight, Info, HandHeart, Bell, LayoutGrid, UserCircle, Building } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './lib/firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-brand-blue tracking-tighter leading-[0.9] mb-12"
          >
            Crafting <span className="text-brand-orange italic font-serif">Impact</span>. <br />
            Building <span className="text-brand-green italic font-serif">Futures</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The Mohania Welfare Foundation orchestrates sustainable social change across rural India through radical transparency and community-driven action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="#campaigns" className="btn-primary flex items-center bg-brand-blue text-white py-5 px-10 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all">
              Launch Contribution <ArrowRight size={16} />
            </a>
            <button
              onClick={onJoin}
              className="px-10 py-5 bg-white text-brand-blue rounded-full font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              Join the Network
            </button>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'public' | 'dashboard' | 'admin' | 'impact'>('public');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    flow?: 'menu' | 'signIn' | 'createAccount' | 'onboarding' | 'roleSelection' | 'dynamicForm' | 'terms';
    roleIntent?: 'donor' | 'volunteer' | 'csr' | 'ngo_staff' | 'strategic_partner' | 'foundation_support';
  }>({});

  useEffect(() => {
    let unsubscribe: () => void = () => { };

    if (user) {
      const userRef = doc(db, 'users', user.uid);

      unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // Mandatory Sync
          const isInitialSuperAdmin = user.email === 'shaikhzeeshan10zeeshan@gmail.com';
          setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || 'Member',
            email: user.email,
            photoURL: user.photoURL,
            role: isInitialSuperAdmin ? 'super_admin' : 'public_supporter',
            status: isInitialSuperAdmin ? 'approved' : 'pending',
            reputation: 0,
            createdAt: serverTimestamp()
          });
        }
      });
    } else {
      setUserProfile(null);
      setActiveTab('public');
    }

    return () => unsubscribe();
  }, [user]);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin' || userProfile?.role === 'ngo_staff';

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-blue/10 selection:text-brand-blue">
      <Header userProfile={userProfile} onJoin={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow">
        {/* View Switcher if user is logged in */}
        {user && (
          <div className="container mx-auto px-4 pt-28 -mb-20 relative z-40">
            <div className="inline-flex p-1 bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-2xl">
              <button
                onClick={() => setActiveTab('public')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'public' ? 'bg-brand-blue text-white shadow-xl' : 'text-gray-400 hover:text-brand-blue'
                  }`}
              >
                Public Identity
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-brand-blue text-white shadow-xl' : 'text-gray-400 hover:text-brand-blue'
                  }`}
              >
                Strategic Dashboard
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-brand-orange text-white shadow-xl' : 'text-brand-orange/60 hover:text-brand-orange'
                    }`}
                >
                  <LayoutGrid size={14} /> Admin Intelligence
                </button>
              )}
            </div>
          </div>
        )}

        {(!user || activeTab === 'public') && (
          <div className="space-y-0">
            <Hero onJoin={() => setIsAuthModalOpen(true)} />



            <div id="campaigns" className="pt-24 pb-12">
              <Campaigns />
            </div>

            <VisionMission />
            <LeadershipSection />
            <LegalCompliance />

            {/* Strategic Partnership Section */}
            <section className="py-24 max-w-7xl mx-auto px-4">
              <div className="bg-brand-blue rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <Building size={400} className="translate-x-1/4 -translate-y-1/4" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-6 block">Institutional Growth</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                    Transforming CSR into <span className="text-brand-orange italic">Systemic</span> Change
                  </h2>
                  <p className="text-lg text-white/80 font-medium mb-12 leading-relaxed">
                    Partner with MWF to deploy high-impact social interventions. We provide 80G compliance, ISO-certified transparency, and real-time impact analytics for your corporate social responsibility.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <button
                      onClick={() => {
                        setAuthModalConfig({ flow: 'dynamicForm', roleIntent: 'csr' });
                        setIsAuthModalOpen(true);
                      }}
                      className="px-10 py-5 bg-white text-brand-blue rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-2xl shadow-black/20"
                    >
                      Partner with us
                    </button>
                    <button className="px-10 py-5 border border-white/20 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                      Download CSR Brochure
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <BeforeAfterGallery />
            <ImpactDashboard />
            <VolunteerManagement />
            <Gallery />

            <section className="py-32 bg-brand-blue overflow-hidden relative">
              <div className="container mx-auto px-4 text-center relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter"
                >
                  Join the <span className="italic font-serif text-brand-orange">Movement</span>.
                </motion.h2>
                <div className="flex justify-center gap-4">
                  {!user ? (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-14 py-6 bg-brand-green text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <HandHeart size={18} /> Authenticate to Join
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-14 py-6 bg-white text-brand-blue rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      Access Dashboard <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {user && activeTab === 'dashboard' && userProfile && (
          <div className="container mx-auto px-4 pt-32 pb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-brand-blue tracking-tighter uppercase">
                  {userProfile.role === 'donor' ? 'Donor Intelligence' :
                    userProfile.role === 'volunteer' ? 'Service Command' :
                      userProfile.role === 'beneficiary' ? 'Support Portal' :
                        userProfile.role === 'ngo_partner' ? 'Alliance Hub' :
                          'Strategic Command'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-3 py-1 rounded-full border border-brand-orange/10">
                    {userProfile.role.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">
                    {userProfile.displayName || user.displayName || 'Member'}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="relative p-5 glass-card hover:bg-white text-gray-400 hover:text-brand-orange transition-all">
                  <Bell size={20} />
                  <span className="absolute top-4 right-4 w-3 h-3 bg-brand-orange border-2 border-white rounded-full" />
                </button>
              </div>
            </div>

            {/* Role-Specific Dashboard Content */}
            {userProfile.status === 'pending' ? (
              <div className="max-w-3xl mx-auto py-20 text-center">
                <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mx-auto mb-8 animate-pulse">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-3xl font-black text-brand-blue mb-4 uppercase tracking-tighter">Identity Verification in Progress</h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-12">
                  Your request to join as a <span className="text-brand-orange font-bold font-mono">{userProfile.role.replace('_', ' ')}</span> is currently being reviewed by the foundation's strategic administration. Access to internal hubs will be provisioned once your credentials are validated.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="glass-card p-8">
                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-2">Registration Status</p>
                    <p className="text-lg font-black text-brand-blue">Awaiting Approval</p>
                  </div>
                  <div className="glass-card p-8">
                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-2">Estimated TLA</p>
                    <p className="text-lg font-black text-brand-blue">24-48 Hours</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('public')}
                  className="mt-12 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors flex items-center gap-2 mx-auto"
                >
                  Return to Public Operations <ArrowRight size={14} />
                </button>
              </div>
            ) : userProfile.role === 'donor' ? (
              <DonorDashboard userProfile={userProfile} />
            ) : userProfile.role === 'volunteer' ? (
              <VolunteerDashboard userProfile={userProfile} />
            ) : userProfile.role === 'beneficiary' ? (
              <BeneficiaryDashboard userProfile={userProfile} />
            ) : userProfile.role === 'ngo_partner' ? (
              <NGODashboard userProfile={userProfile} />
            ) : userProfile.role === 'csr' || userProfile.role === 'strategic_partner' ? (
              <CSRDashboard userProfile={userProfile} />
            ) : userProfile.role === 'ngo_staff' || userProfile.role === 'admin' || userProfile.role === 'super_admin' ? (
              <StaffDashboard userProfile={userProfile} />
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <UpdateFeed />
                  </div>
                  <div className="lg:col-span-1">
                    <ActivityFeed />
                  </div>
                </div>
                <MemberConnect />
              </div>
            )}
          </div>
        )}

        {user && activeTab === 'admin' && isAdmin && userProfile && (
          <div className="container mx-auto px-4 pt-32 pb-20">
            <AdminDashboard userProfile={userProfile} />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalConfig({});
        }}
        initialFlow={authModalConfig.flow}
        initialRoleIntent={authModalConfig.roleIntent}
      />
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      <Footer />
    </div>
  );
}
