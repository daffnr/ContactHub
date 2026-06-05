import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { DashboardStats } from './AnalyticsCards';

interface WelcomeHeroProps {
  stats?: DashboardStats;
  onAddContact: () => void;
  onExport: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ stats, onAddContact, onExport }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card relative overflow-hidden p-6 md:p-8 w-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
    >
      {/* Decorative gradient orbs for SaaS feel */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Logo showText={false} className="scale-110 drop-shadow-sm" />
            <p className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/30">
              <span className="text-base">👋</span> Welcome to ContactHub CRM
            </p>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Build stronger connections,<br className="hidden sm:block" />
            organize your network,<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500 dark:from-primary-400 dark:to-cyan-400">
              and stay in control of every contact.
            </span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mt-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <strong className="text-slate-900 dark:text-white text-sm">{stats?.totalContacts || 0}</strong> Contacts
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <strong className="text-slate-900 dark:text-white text-sm">{stats?.totalFavorites || 0}</strong> Favorites
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
              <strong className="text-slate-900 dark:text-white text-sm">{stats?.totalCompanies || 0}</strong> Companies
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Button onClick={onAddContact} className="flex items-center gap-2 justify-center shadow-md">
            <Plus size={18} /> Add Contact
          </Button>
          <Button variant="secondary" onClick={onExport} className="flex items-center gap-2 justify-center">
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
