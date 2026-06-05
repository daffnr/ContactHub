import React from 'react';
import { motion } from 'framer-motion';
import { Compass, SearchX, StarOff } from 'lucide-react';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
  type: 'NO_CONTACTS' | 'NO_SEARCH_RESULTS' | 'NO_FAVORITES';
  onAction?: () => void;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, searchQuery }) => {
  const content = {
    NO_CONTACTS: {
      icon: <Compass size={32} />,
      title: 'No contacts discovered',
      desc: "You haven't archived any contacts yet. Begin adding data points to populate your CRM dashboard.",
      action: 'Create First Contact',
      bg: 'bg-primary-50 dark:bg-primary-950/20 text-primary-500',
    },
    NO_SEARCH_RESULTS: {
      icon: <SearchX size={32} />,
      title: 'No results found',
      desc: `We couldn't find any contacts matching "${searchQuery}". Try refining your search or checking for typos.`,
      action: 'Clear Search',
      bg: 'bg-slate-100 dark:bg-slate-900 text-slate-500',
    },
    NO_FAVORITES: {
      icon: <StarOff size={32} />,
      title: 'No favorites yet',
      desc: 'You have not bookmarked any contacts. Click the star icon on any contact card to add them here.',
      action: null,
      bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-500',
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 glass-card p-12 flex flex-col items-center justify-center text-center gap-4 w-full"
    >
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${content.bg}`}>
        {content.icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{content.title}</h3>
        <p className="text-sm text-slate-400 mt-1 dark:text-slate-500 max-w-sm mx-auto">
          {content.desc}
        </p>
      </div>
      {content.action && onAction && (
        <Button onClick={onAction} size="sm" className="mt-2">
          {content.action}
        </Button>
      )}
    </motion.div>
  );
};
