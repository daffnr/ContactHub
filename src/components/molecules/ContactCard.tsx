import React from 'react';
import { Mail, Phone, Star, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  favorite: boolean;
}

interface ContactCardProps {
  contact: Contact;
  onFavorite: (id: number) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onFavorite, onEdit, onDelete }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-5 flex flex-col justify-between gap-4 group hover:shadow-md hover:border-slate-300/40 dark:hover:border-slate-800 transition-all duration-205"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-50 to-primary-100 text-primary-600 dark:from-primary-950/30 dark:to-primary-900/20 dark:text-primary-400 flex items-center justify-center font-bold text-sm select-none">
            {getInitials(contact.name)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-950 dark:text-slate-100 truncate text-sm">
              {contact.name}
            </h4>
            <span className="inline-flex mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              System Node
            </span>
          </div>
        </div>

        <button
          onClick={() => onFavorite(contact.id)}
          className={`p-1.5 rounded-lg border transition-all ${
            contact.favorite
              ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/40'
              : 'bg-transparent border-slate-100 text-slate-300 hover:text-slate-400 dark:border-slate-900 hover:bg-slate-900'
          }`}
        >
          <Star size={14} fill={contact.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
        {contact.email && (
          <div className="flex items-center gap-2 truncate">
            <Mail size={12} className="text-slate-400" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-slate-400" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-900">
        <button
          onClick={() => onEdit(contact)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
};
