import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Activity } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  UserCheck, 
  FileText, 
  Activity as ActivityIcon,
  Clock 
} from 'lucide-react';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setActivities(docs);
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'join': return <UserPlus size={14} className="text-brand-green" />;
      case 'profile_update': return <UserCheck size={14} className="text-brand-orange" />;
      case 'post_update': return <FileText size={14} className="text-brand-blue" />;
      default: return <ActivityIcon size={14} />;
    }
  };

  const getMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'join': return `joined the foundation`;
      case 'profile_update': return `updated their profile`;
      case 'post_update': return `shared a new update`;
      default: return `performed an action`;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <ActivityIcon className="text-brand-blue" size={20} />
        <h2 className="text-lg font-bold text-brand-blue">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                {activity.userPhoto ? (
                  <img src={activity.userPhoto} alt={activity.userName} className="w-full h-full object-cover" />
                ) : (
                  <ActivityIcon size={12} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] leading-tight">
                  <span className="font-bold text-brand-blue">{activity.userName}</span>
                  {' '}
                  <span className="text-gray-500">{getMessage(activity)}</span>
                </p>
                {activity.details && (
                  <p className="text-[10px] text-gray-400 mt-1 truncate italic">
                    {activity.details}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[9px] text-gray-300 mt-1 uppercase font-bold tracking-tighter">
                  <Clock size={8} />
                  {activity.createdAt?.toDate ? activity.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                </div>
              </div>
              <div className="shrink-0 p-1.5 bg-gray-50 rounded-lg">
                {getIcon(activity.type)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            <p className="text-xs">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
