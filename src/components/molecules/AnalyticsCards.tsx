import React from 'react';
import { Users, Star, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export interface DashboardStats {
  totalContacts: number;
  totalFavorites: number;
  totalCompanies: number;
}

export const AnalyticsCards: React.FC<{ stats?: DashboardStats }> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Contacts',
      value: stats?.totalContacts || 0,
      icon: <Users size={20} className="text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Favorites',
      value: stats?.totalFavorites || 0,
      icon: <Star size={20} className="text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      title: 'Companies',
      value: stats?.totalCompanies || 0,
      icon: <Building2 size={20} className="text-purple-500" />,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Activity Level',
      value: 'High',
      icon: <TrendingUp size={20} className="text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="glass-card p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${card.bg}`}>
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
