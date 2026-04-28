import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where 
} from 'firebase/firestore';
import { User, Send } from 'lucide-react';
import { Comment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CommentSectionProps {
  updateId: string;
  currentUser: any;
}

export default function CommentSection({ updateId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'), 
      where('updateId', '==', updateId),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: Comment[] = [];
      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [updateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        updateId,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        authorPhoto: currentUser.photoURL,
        content: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-50">
      <div className="space-y-4 mb-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="shrink-0">
                {comment.authorPhoto ? (
                  <img src={comment.authorPhoto} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={14} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                <p className="text-[10px] font-bold text-brand-blue mb-1">{comment.authorName}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </form>
      ) : (
        <p className="text-[10px] text-gray-400 italic">Log in to join the conversation.</p>
      )}
    </div>
  );
}
