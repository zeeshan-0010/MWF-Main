import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Send, 
  Clock, 
  User as UserIcon, 
  MessageSquareShare, 
  Image as ImageIcon, 
  Share2, 
  X,
  MessageCircle,
  Heart,
  Flag,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoundationUpdate } from '../types';
import { logActivity } from '../lib/activities';
import { UpdateSkeleton } from './Skeleton';
import CommentSection from './CommentSection';

export default function UpdateFeed() {
  const [user] = useAuthState(auth);
  const [updates, setUpdates] = useState<FoundationUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [filterRole, setFilterRole] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('member');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user's role
  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'member');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      };
      fetchRole();
    }
  }, [user]);

  // Real-time listener for updates
  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatesData: FoundationUpdate[] = [];
      querySnapshot.forEach((doc) => {
        updatesData.push({ id: doc.id, ...doc.data() } as FoundationUpdate);
      });
      setUpdates(updatesData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'updates');
    });

    return () => unsubscribe();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShare = async (update: FoundationUpdate) => {
    const shareData = {
      title: `Update from ${update.authorName}`,
      text: update.content,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${update.content}\n\nShared via Mohania Welfare Foundation\n${window.location.href}`);
      alert('Update text and link copied to clipboard!');
    }
  };

  const handleLike = async (update: FoundationUpdate) => {
    if (!user) {
      alert('Please log in to like updates');
      return;
    }

    const updateRef = doc(db, 'updates', update.id);
    const isLiked = update.likedBy?.includes(user.uid);

    try {
      await updateDoc(updateRef, {
        likesCount: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `updates/${update.id}`);
    }
  };

  const handleReport = async (updateId: string) => {
    if (!user) {
      alert('Please log in to report updates');
      return;
    }

    const reason = prompt('Please provide a reason for reporting this update:');
    if (!reason?.trim()) return;

    try {
      await addDoc(collection(db, 'reported_updates'), {
        updateId,
        reporterId: user.uid,
        reporterName: user.displayName || 'Anonymous',
        reason,
        createdAt: serverTimestamp()
      });
      alert('Report submitted successfully. Thank you for making our community safer.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reported_updates');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newUpdate.trim() || isSubmitting) return;

    setIsSubmitting(true);
    let imageUrl = '';

    try {
      if (imageFile) {
        const imageRef = ref(storage, `updates/${user.uid}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, 'updates'), {
        content: newUpdate,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        authorRole: userRole,
        imageUrl: imageUrl || null,
        likesCount: 0,
        likedBy: [],
        createdAt: serverTimestamp()
      });
      logActivity('post_update', user.uid, user.displayName || 'Member', user.photoURL || undefined, newUpdate.slice(0, 50) + (newUpdate.length > 50 ? '...' : ''));
      setNewUpdate('');
      clearImage();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'updates');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredUpdates = updates.filter(update => {
    if (filterRole === 'all') return true;
    if (filterRole === 'admin') return update.authorRole === 'admin' || update.authorRole === 'super_admin';
    return update.authorRole === filterRole;
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex items-center gap-2">
          <MessageSquareShare className="text-brand-blue" size={24} />
          <h2 className="text-2xl font-bold text-brand-blue">Community Updates</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white border-none text-xs font-bold text-gray-500 uppercase tracking-widest focus:ring-0 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
            <option value="member">Members</option>
          </select>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <textarea
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Share an update with the foundation members..."
            className="w-full min-h-[100px] p-3 text-sm border-none focus:ring-0 resize-none placeholder:text-gray-400"
          />
          
          {imagePreview && (
            <div className="relative inline-block mt-2 mb-4 ml-3">
              <img src={imagePreview} className="max-h-48 rounded-xl border border-gray-100 shadow-sm" />
              <button 
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-brand-blue text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden" 
                accept="image/*"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
                title="Add Image"
              >
                <ImageIcon size={18} />
              </button>
              <div className="flex items-center gap-2">
                {user.photoURL && <img src={user.photoURL} className="w-6 h-6 rounded-full" />}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Posting as {user.displayName}</span>
                  <span className="text-[8px] text-brand-blue font-bold uppercase tracking-widest mt-1">{userRole}</span>
                </div>
              </div>
            </div>
            <button
              disabled={!newUpdate.trim() || isSubmitting}
              className="bg-brand-blue text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-brand-blue/20"
            >
              {isSubmitting ? 'Posting...' : (
                <><Send size={14} /> Share Update</>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-brand-blue/5 rounded-2xl p-8 mb-8 text-center border border-brand-blue/10">
          <p className="text-brand-blue font-medium mb-4">Log in to share updates with the foundation.</p>
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {isLoading ? (
            [1, 2, 3].map(i => <UpdateSkeleton key={i} />)
          ) : (
            filteredUpdates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="shrink-0">
                  {update.authorPhoto ? (
                    <img src={update.authorPhoto} className="w-10 h-10 rounded-full border border-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <UserIcon size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-brand-blue text-sm leading-none">{update.authorName}</h3>
                        <span className="text-[10px] bg-brand-blue/5 text-brand-blue/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {update.authorRole || 'Member'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-1 text-[10px] text-brand-orange font-bold uppercase tracking-widest">
                           <Clock size={10} />
                           {update.createdAt?.toDate ? update.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Ref: MNF/{update.id.slice(0, 4).toUpperCase()}/{new Date().getFullYear()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleShare(update)}
                        className="text-gray-300 hover:text-brand-blue transition-colors p-2"
                        title="Share Update"
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleReport(update.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        title="Report Content"
                      >
                        <Flag size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {update.content}
                  </p>

                  {update.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-50 bg-gray-50 relative aspect-video">
                      {!loadedImages[update.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img 
                        src={update.imageUrl} 
                        className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[update.id] ? 'opacity-100' : 'opacity-0'}`} 
                        loading="lazy" 
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [update.id]: true }))}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLike(update)}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                          update.likedBy?.includes(user?.uid || '') 
                          ? 'text-brand-orange' 
                          : 'text-gray-400 hover:text-brand-orange'
                        }`}
                      >
                        <Heart size={14} fill={update.likedBy?.includes(user?.uid || '') ? 'currentColor' : 'none'} />
                        {update.likesCount || 0} Likes
                      </button>
                      
                      <button 
                        onClick={() => toggleComments(update.id)}
                        className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors"
                      >
                        <MessageCircle size={14} />
                        {expandedComments[update.id] ? 'Hide Comments' : 'Comments'}
                      </button>
                    </div>
                  </div>

                  {expandedComments[update.id] && (
                    <CommentSection updateId={update.id} currentUser={user} />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {!isLoading && filteredUpdates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No updates found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
