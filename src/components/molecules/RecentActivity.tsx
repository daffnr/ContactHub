import React from 'react';
import { UserPlus, Edit2, Trash2, Star, StarOff } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Activity {
  id: number;
  type: 'CREATED' | 'UPDATED' | 'DELETED' | 'FAVORITED' | 'UNFAVORITED';
  contactId: number;
  contactName: string;
  date: string;
}

export const RecentActivity: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  const getActivityDetails = (type: string) => {
    switch (type) {
      case 'CREATED':
        return { icon: <UserPlus size={14} className="text-blue-500" />, text: 'added' };
      case 'UPDATED':
        return { icon: <Edit2 size={14} className="text-emerald-500" />, text: 'updated' };
      case 'DELETED':
        return { icon: <Trash2 size={14} className="text-rose-500" />, text: 'deleted' };
      case 'FAVORITED':
        return { icon: <Star size={14} className="text-amber-500" />, text: 'favorited' };
      case 'UNFAVORITED':
        return { icon: <StarOff size={14} className="text-slate-500" />, text: 'unfavorited' };
      default:
        return { icon: <UserPlus size={14} className="text-slate-500" />, text: 'interacted with' };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="glass-card p-5 h-full flex flex-col justify-center items-center text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 h-full">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="relative pl-3 border-l border-slate-200 dark:border-slate-800 space-y-4">
        {activities.map((activity, idx) => {
          const details = getActivityDetails(activity.type);
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-center justify-between"
            >
              <span className="absolute -left-[19px] bg-white dark:bg-slate-950 p-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                {details.icon}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 ml-2">
                You {details.text} <span className="font-semibold">{activity.contactName}</span>
              </p>
              <span className="text-[10px] text-slate-400">
                {getTimeAgo(activity.date)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
