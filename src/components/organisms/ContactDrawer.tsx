import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Building2, Calendar, Star, Edit2, Trash2 } from 'lucide-react';
import { Contact } from '../molecules/ContactCard';
import { Tag } from '../atoms/Tag';
import { Button } from '../atoms/Button';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({
  isOpen,
  onClose,
  contact,
  onEdit,
  onDelete,
  onFavorite,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && contact && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm glass z-50 border-l border-slate-200/50 dark:border-slate-800/40 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Contact Details</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFavorite(contact.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    contact.favorite
                      ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Star size={18} fill={contact.favorite ? 'currentColor' : 'none'} />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary-50 to-primary-100 text-primary-600 dark:from-primary-950/30 dark:to-primary-900/20 dark:text-primary-400 flex items-center justify-center font-bold text-3xl shadow-sm border-4 border-white dark:border-slate-950">
                  {getInitials(contact.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{contact.name}</h2>
                  {contact.company && (
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mt-1">
                      <Building2 size={14} />
                      {contact.company}
                    </p>
                  )}
                </div>
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    {contact.tags.map(tag => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="glass-card p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Methods</h4>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                    <Mail size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {contact.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                    <Phone size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Phone Number</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {contact.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Details */}
              <div className="glass-card p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Details</h4>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                    <Calendar size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Created On</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                    <Calendar size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Updated</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {formatDate(contact.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800/40 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => { onClose(); onEdit(contact); }} className="w-full flex justify-center items-center gap-2">
                <Edit2 size={16} /> Edit
              </Button>
              <Button variant="danger" onClick={() => { onClose(); onDelete(contact.id); }} className="w-full flex justify-center items-center gap-2">
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
