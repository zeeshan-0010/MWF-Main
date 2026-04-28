import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  limit,
  updateDoc,
  doc,
  getDoc,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Users, 
  User as UserIcon, 
  ShieldCheck, 
  Search, 
  SortAsc, 
  SortDesc, 
  X, 
  Mail, 
  Phone, 
  Calendar,
  XCircle,
  MoreVertical,
  ShieldAlert,
  Shield,
  Edit2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { logActivity } from '../lib/activities';
import { ProfileSkeleton } from './Skeleton';

const ROLES = ['member', 'moderator', 'admin', 'super_admin'] as const;

export default function MemberConnect() {
  const [currentUser] = useAuthState(auth);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const batchSize = 12;
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch current user's profile to check for admin role
  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data() as UserProfile);
        }
      };
      fetchProfile();
    }
  }, [currentUser]);

  // Initial fetch and fetch on sort change
  useEffect(() => {
    setMembers([]);
    setLastVisible(null);
    setHasMore(true);
    fetchMembers(true);
  }, [sortOrder]);

  const fetchMembers = async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;
    
    setLoading(true);
    try {
      let q = query(
        collection(db, 'users'),
        orderBy('displayName', sortOrder),
        limit(batchSize)
      );

      if (!isInitial && lastVisible) {
        q = query(
          collection(db, 'users'),
          orderBy('displayName', sortOrder),
          startAfter(lastVisible),
          limit(batchSize)
        );
      }

      onSnapshot(q, (snapshot) => {
        const newMembers = snapshot.docs.map(doc => doc.data() as UserProfile);
        
        if (isInitial) {
          setMembers(newMembers);
        } else {
          setMembers(prev => {
            const existingIds = new Set(prev.map(m => m.uid));
            const filteredNew = newMembers.filter(m => !existingIds.has(m.uid));
            return [...prev, ...filteredNew];
          });
        }
        
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === batchSize);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error fetching members:", err);
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: typeof ROLES[number]) => {
    const isAdmin = currentUserProfile?.role === 'admin';
    const isSuperAdmin = currentUserProfile?.role === 'super_admin';

    if (!isAdmin && !isSuperAdmin) {
      alert("Unauthorized: You do not have permission to manage roles.");
      return;
    }

    if (newRole === 'super_admin' && !isSuperAdmin) {
      alert("Unauthorized: Only a Super Admin can assign the Super Admin role.");
      return;
    }

    // Admins can't demote Super Admins or promote to Super Admin
    if (isAdmin && !isSuperAdmin && selectedMember?.role === 'super_admin') {
      alert("Unauthorized: Admins cannot modify a Super Admin's role.");
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', memberId), {
        role: newRole
      });
      if (selectedMember?.uid === memberId) {
        setSelectedMember(prev => prev ? { ...prev, role: newRole } : null);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Please check your permissions.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser || !selectedMember || currentUser.uid !== selectedMember.uid) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bio: editBio,
        phoneNumber: editPhone
      });
      
      logActivity('profile_update', currentUser.uid, currentUser.displayName || 'Member', currentUser.photoURL || undefined);
      
      setSelectedMember(prev => prev ? { ...prev, bio: editBio, phoneNumber: editPhone } : null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const lastMemberElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMembers();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const filteredMembers = members.filter(member => 
    member.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = () => {
    if (selectedMember) {
      setEditBio(selectedMember.bio || '');
      setEditPhone(selectedMember.phoneNumber || '');
      setIsEditing(true);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 border-t border-gray-100 mt-12 bg-white rounded-3xl shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-2">
          <Users className="text-brand-green" size={28} />
          <h2 className="text-3xl font-bold text-brand-blue tracking-tight">Foundation Network</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-50 border border-gray-100 rounded-full hover:bg-white transition-all flex items-center gap-2 px-4 text-xs font-bold text-brand-blue uppercase tracking-widest shadow-sm active:scale-95"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {loading && members.length === 0 ? (
          Array.from({ length: 12 }).map((_, i) => <ProfileSkeleton key={i} />)
        ) : (
          filteredMembers.map((member, index) => (
            <motion.div
              key={member.uid}
              ref={index === filteredMembers.length - 1 ? lastMemberElementRef : null}
              whileHover={{ y: -5 }}
              onClick={() => {
                setSelectedMember(member);
                setIsEditing(false);
              }}
              className="flex flex-col items-center text-center p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer shadow-sm"
            >
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full border-2 border-white p-0.5 shadow-md">
                  {member.photoURL ? (
                    <img src={member.photoURL} alt={member.displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <UserIcon size={28} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white shadow-sm ${
                  member.role === 'super_admin' ? 'bg-indigo-600' :
                  member.role === 'admin' ? 'bg-brand-orange' : 
                  member.role === 'moderator' ? 'bg-brand-green' : 'bg-brand-blue'
                }`}>
                  {member.role === 'super_admin' ? <ShieldAlert size={12} className="text-white" /> :
                   member.role === 'admin' ? <ShieldCheck size={12} className="text-white" /> : 
                   member.role === 'moderator' ? <Shield size={12} className="text-white" /> : <Users size={12} className="text-white" />}
                </div>
              </div>
              <h4 className="text-xs font-bold text-brand-blue truncate w-full px-2">{member.displayName}</h4>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                  member.role === 'super_admin' ? 'text-indigo-600' :
                  member.role === 'admin' ? 'text-brand-orange' : 
                  member.role === 'moderator' ? 'text-brand-green' : 'text-brand-blue'
              }`}>
                {member.role.replace('_', ' ')}
              </p>
              <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                Joined {member.createdAt?.toDate ? member.createdAt.toDate().toLocaleDateString() : 'recently'}
              </p>
            </motion.div>
          ))
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        </div>
      )}

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedMember(null)}
               className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="h-32 bg-brand-blue relative">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
                <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    {selectedMember.photoURL ? (
                      <img src={selectedMember.photoURL} alt={selectedMember.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <UserIcon size={40} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
                
                {currentUser?.uid === selectedMember.uid && !isEditing && (
                  <button 
                    onClick={startEditing}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95"
                  >
                    <Edit2 size={12} /> Edit Profile
                  </button>
                )}
              </div>

              <div className="px-8 pt-16 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-blue">{selectedMember.displayName}</h3>
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] mt-1 ${
                         selectedMember.role === 'super_admin' ? 'text-indigo-600' :
                         selectedMember.role === 'admin' ? 'text-brand-orange' : 
                         selectedMember.role === 'moderator' ? 'text-brand-green' : 'text-brand-blue'
                    }`}>
                      {selectedMember.role.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {/* Role Assignment UI */}
                  {(currentUserProfile?.role === 'admin' || currentUserProfile?.role === 'super_admin') && (
                    <div className="relative group">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-brand-blue cursor-pointer">
                        <MoreVertical size={18} />
                      </div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-20">
                        <div className="p-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest p-2">Assign Role</p>
                          {ROLES.map(role => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(selectedMember.uid, role)}
                              className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
                                selectedMember.role === role ? 'bg-brand-blue/5 text-brand-blue' : 'hover:bg-gray-50'
                              }`}
                            >
                              {role === 'super_admin' ? <ShieldAlert size={14} className="text-indigo-600" /> : 
                               role === 'admin' ? <ShieldCheck size={14} className="text-brand-orange" /> : 
                               role === 'moderator' ? <Shield size={14} className="text-brand-green" /> : <Users size={14} />}
                              {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Bio</label>
                        <textarea 
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 min-h-[80px] resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                        <input 
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUpdateProfile}
                          disabled={isSaving}
                          className="flex-1 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          {isSaving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedMember.bio && (
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedMember.bio}"</p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-slate-700">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue">
                            <Mail size={16} />
                          </div>
                          <span className="truncate">{selectedMember.email}</span>
                        </div>
                        {selectedMember.phoneNumber && (
                          <div className="flex items-center gap-3 text-sm text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green">
                              <Phone size={16} />
                            </div>
                            <span>{selectedMember.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                          <div className="w-8 h-8 rounded-full bg-brand-orange/5 flex items-center justify-center text-brand-orange">
                            <Calendar size={16} />
                          </div>
                          <span>Join Date: {selectedMember.createdAt?.toDate ? selectedMember.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</span>
                        </div>
                      </div>
                      
                      {currentUser?.uid === selectedMember.uid && (
                        <div className="mt-4 p-3 bg-brand-green/5 rounded-xl flex items-center gap-2 text-brand-green text-[10px] font-bold uppercase">
                          <CheckCircle2 size={12} /> This is your personal profile
                        </div>
                      )}
                    </>
                  )}
                </div>

                {!isEditing && (
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-full py-4 bg-brand-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-blue/20"
                  >
                    Close Profile
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
