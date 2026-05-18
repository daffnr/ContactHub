import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-slate-100 via-slate-50 to-primary-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md text-center flex flex-col items-center gap-6"
      >
        <div className="h-20 w-20 rounded-3xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 shadow-inner">
          <Ban size={40} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            404 - Lost Orbit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you're searching for either didn't load, was relocated, or never materialized in this system.
          </p>
        </div>
        <Link to="/">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
