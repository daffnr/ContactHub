import React from 'react';
import { Users, Star, X } from 'lucide-react';
import { Logo } from '../atoms/Logo';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  filterFavorite: boolean;
  setFilterFavorite: (isFavorite: boolean) => void;
  setPage: (page: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  filterFavorite,
  setFilterFavorite,
  setPage,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 glass z-40 flex flex-col border-r border-slate-200/50 dark:border-slate-800/40 transition-transform duration-300 lg:translate-x-0 lg:static ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand */}
      <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
        <Logo />
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
          <X size={18} />
        </button>
      </div>

      {/* Links */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        <button
          onClick={() => {
            setFilterFavorite(false);
            setPage(1);
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            !filterFavorite
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
              : 'text-slate-500 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-900/50'
          }`}
        >
          <Users size={18} />
          All Contacts
        </button>
        <button
          onClick={() => {
            setFilterFavorite(true);
            setPage(1);
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            filterFavorite
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
              : 'text-slate-500 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-900/50'
          }`}
        >
          <Star size={18} />
          Favorite Contacts
        </button>
      </div>

      {/* User Card (Mocked for Portfolio) */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/30 dark:bg-slate-900/40">
          <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 flex items-center justify-center text-xs font-bold shrink-0">
            DU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
              Demo User
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">demo@portfolio.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
