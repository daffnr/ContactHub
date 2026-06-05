import React from 'react';
import { Mail, Phone, Building2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tag } from '../atoms/Tag';

export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company?: string | null;
  favorite: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ContactCardProps {
  contact: Contact;
  onFavorite: (id: number) => void;
  onClick: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onFavorite, onClick }) => {
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
      onClick={() => onClick(contact)}
      className="glass-card p-5 flex flex-col justify-between gap-4 group hover:shadow-lg hover:border-slate-300/60 dark:hover:border-slate-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary-50 to-primary-100 text-primary-600 dark:from-primary-950/30 dark:to-primary-900/20 dark:text-primary-400 flex items-center justify-center font-bold text-sm select-none border-2 border-white dark:border-slate-900 shadow-sm">
            {getInitials(contact.name)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-950 dark:text-slate-100 truncate text-base">
              {contact.name}
            </h4>
            {contact.company ? (
              <span className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                <Building2 size={12} /> {contact.company}
              </span>
            ) : (
              <span className="inline-flex mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Individual
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(contact.id);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            contact.favorite
              ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/40 hover:bg-amber-100'
              : 'bg-transparent border-slate-100 text-slate-300 hover:text-amber-400 hover:border-amber-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <Star size={16} fill={contact.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
        {contact.email && (
          <div className="flex items-center gap-2 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            <Mail size={14} className="text-slate-400" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            <Phone size={14} className="text-slate-400" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex items-center gap-1.5 pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/50 flex-wrap">
          {contact.tags.slice(0, 3).map(tag => (
            <Tag key={tag} label={tag} />
          ))}
          {contact.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 font-medium">+{contact.tags.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
