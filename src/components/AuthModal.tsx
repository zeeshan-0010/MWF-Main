import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Briefcase, 
  Users, 
  X, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  BriefcaseBusiness, 
  ChevronRight,
  HandHeart,
  Globe,
  Settings,
  UserCheck,
  FileText,
  UserCircle,
  Phone,
  MapPin,
  Target,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlow?: AuthFlow;
  initialRoleIntent?: 'donor' | 'volunteer' | 'beneficiary' | 'ngo_partner' | 'csr' | 'ngo_staff' | 'strategic_partner' | 'foundation_support';
}

type AuthFlow = 'menu' | 'signIn' | 'createAccount' | 'onboarding' | 'roleSelection' | 'dynamicForm' | 'terms';

export default function AuthModal({ isOpen, onClose, initialFlow, initialRoleIntent }: AuthModalProps) {
  const [flow, setFlow] = useState<AuthFlow>(initialFlow || 'menu');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialFlow) setFlow(initialFlow);
      if (initialRoleIntent) setFormData(prev => ({ ...prev, roleIntent: initialRoleIntent }));
    }
  }, [isOpen, initialFlow, initialRoleIntent]);
  
  // Registration Data Structure
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    profession: '',
    orgName: '',
    linkedinProfile: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    communicationPref: 'Email',
    roleIntent: initialRoleIntent || '' as any,
    // Dynamic Role Data
    beneficiary: {
      helpType: 'Education',
      description: '',
      familyIncome: '',
      dependents: ''
    },
    ngo: {
      orgName: '',
      regNumber: '',
      type: 'Local Trust',
      mission: '',
      website: ''
    },
    donor: {
      preferredCause: '',
      type: 'One-time',
      need80G: false,
      isAnonymous: false,
      panNumber: '',
      annualLimit: ''
    },
    volunteer: {
      primarySkill: '',
      secondarySkill: '',
      availableHours: '',
      preferredEvent: '',
      languages: '',
      experience: ''
    },
    csr: {
      companyName: '',
      industry: '',
      registrationNum: '',
      gstNum: '',
      panNum: '',
      cinNum: '',
      website: '',
      budget: '',
      partnershipType: 'Campaign Sponsor'
    },
    staff: {
      department: '',
      designation: '',
      employeeId: '',
      supervisor: '',
      internalKey: ''
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const finalizeRegistration = async () => {
    setIsLoading(true);
    let registeredUid: string | null = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      registeredUid = userCredential.user.uid;
      
      const userProfile = {
        uid: registeredUid,
        email,
        displayName: formData.fullName,
        phoneNumber: formData.phone,
        role: formData.roleIntent,
        status: formData.roleIntent === 'ngo_staff' || formData.roleIntent === 'csr' ? 'under_review' : 'pending',
        verificationStatus: 'pending',
        trustScore: 0,
        profileCompletion: 75,
        location: {
           city: formData.city,
           state: formData.state,
           country: formData.country
        },
        profession: formData.profession,
        emergencyContact: formData.emergencyContact,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        metadata: {}
      };

      // Add role-specific payload
      if (formData.roleIntent === 'donor') (userProfile as any).donorDetails = formData.donor;
      if (formData.roleIntent === 'volunteer') (userProfile as any).volunteerDetails = formData.volunteer;
      if (formData.roleIntent === 'csr') (userProfile as any).corporateDetails = formData.csr;
      if (formData.roleIntent === 'ngo_staff') (userProfile as any).staffDetails = formData.staff;
      if (formData.roleIntent === 'beneficiary') (userProfile as any).beneficiaryDetails = formData.beneficiary;
      if (formData.roleIntent === 'ngo_partner') (userProfile as any).ngoDetails = formData.ngo;

      await setDoc(doc(db, 'users', registeredUid), userProfile);
      onClose();
    } catch (e: any) { 
      handleFirestoreError(e, OperationType.WRITE, registeredUid ? `users/${registeredUid}` : 'users/unknown');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-brand-blue/60 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-50">
               <img 
                 src="https://firebasestorage.googleapis.com/v0/b/ai-studio-assets.appspot.com/o/Mohania_Welfare_Foundation_Logo.png?alt=media" 
                 alt="MWF Logo" 
                 className="w-full h-full object-contain"
               />
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-blue tracking-tighter uppercase leading-none">Join the Network</h2>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mt-1">Strategic Social Impact Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {flow === 'menu' && (
              <motion.div 
                key="menu" 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <MenuItem onClick={() => setFlow('createAccount')} icon={Users} label="Strategic Contributor" subLabel="Donate, Volunteer, or Support" />
                <MenuItem onClick={() => setFlow('signIn')} icon={Mail} label="Authenticated Access" subLabel="Return to your Impact Dashboard" />
                <MenuItem onClick={() => {
                   setFlow('roleSelection');
                   setFormData(prev => ({ ...prev, roleIntent: 'csr' }));
                }} icon={Building} label="Corporate / CSR Partnership" subLabel="Institutional Social Responsibility" />
                <MenuItem onClick={() => {
                   setFlow('signIn');
                }} icon={ShieldCheck} label="Operational Access" subLabel="Internal Staff & Field Teams" />
              </motion.div>
            )}

            {flow === 'signIn' && (
              <motion.form 
                key="signIn"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSignIn}
                className="space-y-6"
              >
                <InputGroup label="Email Identity" icon={Mail}>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="user@network.org" 
                    className="w-full bg-transparent font-bold focus:outline-none" 
                    required 
                  />
                </InputGroup>
                <InputGroup label="Access Credential" icon={Lock}>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full bg-transparent font-bold focus:outline-none" 
                    required 
                  />
                </InputGroup>
                <button type="submit" disabled={isLoading} className="w-full p-6 bg-brand-blue text-white rounded-[2rem] font-black uppercase tracking-widest hover:shadow-2xl transition-all disabled:opacity-50">
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Enter Network'}
                </button>
                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-brand-blue">Forgot Credential Recovery?</p>
              </motion.form>
            )}

            {flow === 'createAccount' && (
              <motion.div 
                key="createAccount"
                className="space-y-6"
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Full Name" icon={UserCircle}>
                      <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-transparent font-bold focus:outline-none" placeholder="John Doe" />
                    </InputGroup>
                    <InputGroup label="Primary Phone" icon={Phone}>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent font-bold focus:outline-none" placeholder="+91 XXXX" />
                    </InputGroup>
                 </div>
                 <InputGroup label="Email Address" icon={Mail}>
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" placeholder="john@example.com" />
                 </InputGroup>
                 <InputGroup label="Secure Password" icon={Lock}>
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" placeholder="Min. 8 Chars" />
                 </InputGroup>
                 <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="City" icon={MapPin}>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-transparent font-bold focus:outline-none" placeholder="Bhopal" />
                    </InputGroup>
                    <InputGroup label="State" icon={Globe}>
                      <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-transparent font-bold focus:outline-none" placeholder="MP" />
                    </InputGroup>
                 </div>
                 <button 
                  onClick={() => setFlow('roleSelection')}
                  className="w-full p-6 bg-brand-blue text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                 >
                   Strategic Onboarding <ArrowRight size={18} />
                 </button>
              </motion.div>
            )}

            {flow === 'roleSelection' && (
              <motion.div key="roleSelection" className="space-y-6">
                 <h3 className="text-xl font-black text-brand-blue tracking-tighter uppercase mb-6">How would you like to contribute?</h3>
                 <div className="grid grid-cols-1 gap-3">
                   {[
                     { id: 'donor', label: 'I Want to Donate', sub: 'Impact through financial resources', icon: HandHeart },
                     { id: 'volunteer', label: 'I Want to Volunteer', sub: 'Impact through service & skills', icon: UserCheck },
                     { id: 'beneficiary', label: 'I Need Support', sub: 'Access education, health or relief', icon: Target },
                     { id: 'ngo_partner', label: 'Registered NGO', sub: 'Collaborative scaling & operations', icon: Globe },
                     { id: 'csr', label: 'I Represent a Company', sub: 'CSR & Corporate Partnerships', icon: Building },
                     { id: 'ngo_staff', label: 'I Manage NGO Operations', sub: 'Internal Staff & Ops Access', icon: Settings }
                   ].map((role) => (
                      <button 
                        key={role.id}
                        onClick={() => {
                          setFormData({...formData, roleIntent: role.id as any});
                          setFlow('dynamicForm');
                        }}
                        className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-brand-blue/20 hover:bg-white transition-all text-left group"
                      >
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                            <role.icon size={24} />
                         </div>
                         <div>
                            <p className="font-black text-brand-blue text-sm uppercase leading-none mb-1">{role.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{role.sub}</p>
                         </div>
                         <ChevronRight className="ml-auto text-gray-300" size={18} />
                      </button>
                   ))}
                 </div>
              </motion.div>
            )}

            {flow === 'dynamicForm' && (
               <motion.div key="dynamicForm" className="space-y-6">
                  {formData.roleIntent === 'donor' && (
                    <div className="space-y-4">
                       <InputGroup label="Preferred Cause" icon={Target}>
                         <select 
                            value={formData.donor.preferredCause} 
                            onChange={e => setFormData({...formData, donor: {...formData.donor, preferredCause: e.target.value}})}
                            className="w-full bg-transparent font-bold focus:outline-none"
                         >
                            <option>Child Education</option>
                            <option>Rural Health</option>
                            <option>Crisis Response</option>
                         </select>
                       </InputGroup>
                       <InputGroup label="PAN Number (For 80G Receipts)" icon={FileText}>
                          <input type="text" placeholder="ABCDE1234F" className="w-full bg-transparent font-bold uppercase" onChange={e => setFormData({...formData, donor: {...formData.donor, panNumber: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  {formData.roleIntent === 'volunteer' && (
                    <div className="space-y-4">
                       <InputGroup label="Primary Skill" icon={Briefcase}>
                          <input type="text" placeholder="e.g. Teaching, Design" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, volunteer: {...formData.volunteer, primarySkill: e.target.value}})} />
                       </InputGroup>
                       <InputGroup label="Expected Hours/Week" icon={ShieldCheck}>
                          <input type="number" placeholder="5" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, volunteer: {...formData.volunteer, availableHours: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  {formData.roleIntent === 'csr' && (
                    <div className="space-y-4">
                       <InputGroup label="Corporate Name" icon={Building}>
                          <input type="text" placeholder="Global Corp Ltd" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, csr: {...formData.csr, companyName: e.target.value}})} />
                       </InputGroup>
                       <InputGroup label="GST Identification" icon={FileText}>
                          <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, csr: {...formData.csr, gstNum: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  {formData.roleIntent === 'ngo_staff' && (
                    <div className="space-y-4">
                       <InputGroup label="Department" icon={Settings}>
                          <input type="text" placeholder="e.g. Field Operations, Finance" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, staff: {...formData.staff, department: e.target.value}})} />
                       </InputGroup>
                       <InputGroup label="Internal Key" icon={Lock}>
                          <input type="password" placeholder="Admin Provided Key" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, staff: {...formData.staff, internalKey: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  {formData.roleIntent === 'beneficiary' && (
                    <div className="space-y-4">
                       <InputGroup label="Specific Need" icon={Target}>
                          <select className="w-full bg-transparent font-bold focus:outline-none" onChange={e => setFormData({...formData, beneficiary: {...formData.beneficiary, helpType: e.target.value}})}>
                             <option>Education Support</option>
                             <option>Medical Aid</option>
                             <option>Food Stability</option>
                             <option>Emergency Housing</option>
                          </select>
                       </InputGroup>
                       <InputGroup label="Description of Situation" icon={FileText}>
                          <textarea placeholder="Tell us about your current requirements..." className="w-full bg-transparent font-bold min-h-[100px]" onChange={e => setFormData({...formData, beneficiary: {...formData.beneficiary, description: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  {formData.roleIntent === 'ngo_partner' && (
                    <div className="space-y-4">
                       <InputGroup label="Organization Name" icon={Building}>
                          <input type="text" placeholder="NGO Official Name" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, ngo: {...formData.ngo, orgName: e.target.value}})} />
                       </InputGroup>
                       <InputGroup label="Registration Number" icon={FileText}>
                          <input type="text" placeholder="Reg. No. (FCRA/Section-8)" className="w-full bg-transparent font-bold" onChange={e => setFormData({...formData, ngo: {...formData.ngo, regNumber: e.target.value}})} />
                       </InputGroup>
                    </div>
                  )}

                  <div className="p-6 bg-brand-blue/5 rounded-3xl border border-brand-blue/10">
                    <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={12}/> Compliance Verification</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">By proceeding, you agree to MWF's professional protocol, including tax compliance under Section-8 and internal governance regulations. Your profile may undergo administrative review.</p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFlow('roleSelection')}
                      className="flex-shrink-0 p-6 bg-gray-100 text-gray-400 rounded-[2rem] font-black hover:bg-gray-200 transition-all"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={finalizeRegistration} 
                      disabled={isLoading}
                      className="flex-grow p-6 bg-brand-green text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Finalize Registration'}
                      {!isLoading && <ChevronRight size={18} />}
                    </button>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        {flow !== 'menu' && (
          <div className="p-8 border-t border-gray-100 flex items-center justify-center">
             <button onClick={() => setFlow('menu')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors">Return to Protocol Menu</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function MenuItem({ onClick, icon: Icon, label, subLabel }: { onClick: () => void, icon: any, label: string, subLabel?: string }) {
  return (
    <button onClick={onClick} className="w-full p-6 bg-gray-50 rounded-3xl flex items-center gap-5 hover:bg-brand-blue/5 border border-transparent hover:border-brand-blue/10 transition-all group group relative overflow-hidden">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shadow-sm">
        <Icon size={28} />
      </div>
      <div className="text-left">
        <p className="font-black text-brand-blue text-sm uppercase leading-none mb-1">{label}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subLabel}</p>
      </div>
      <ChevronRight className="ml-auto text-gray-300 group-hover:text-brand-blue transition-colors" size={20} />
    </button>
  );
}

function InputGroup({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">{label}</label>
      <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-100 rounded-3xl focus-within:bg-white focus-within:border-brand-blue/20 focus-within:shadow-xl focus-within:shadow-brand-blue/5 transition-all">
        <Icon size={20} className="text-gray-300" />
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}

