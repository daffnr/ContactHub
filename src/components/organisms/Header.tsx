import React from 'react';
import { Menu, Sun, Moon, Plus } from 'lucide-react';
import { Button } from '../atoms/Button';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onAddContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setIsSidebarOpen,
  darkMode,
  toggleDarkMode,
  onAddContact,
}) => {
  return (
    <header className="h-16 px-6 glass flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/40 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Contacts Console</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
        {/* Add Contact Button */}
        <Button onClick={onAddContact} size="sm">
          <Plus size={16} className="mr-1" /> Add Contact
        </Button>
      </div>
    </header>
  );
};
