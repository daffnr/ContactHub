import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardTemplateProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  sidebar,
  header,
  toolbar,
  content,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar navigation */}
      {sidebar}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        {header}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Toolbar */}
          {toolbar}

          {/* Contacts Grid & Content */}
          {content}
        </main>
      </div>
    </div>
  );
};
