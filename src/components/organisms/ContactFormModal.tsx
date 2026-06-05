import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../molecules/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Contact } from '../molecules/ContactCard';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone must be at least 5 characters').optional().or(z.literal('')),
  favorite: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingContact: Contact | null;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const AVAILABLE_TAGS = ['Frontend', 'Backend', 'Designer', 'HR', 'Client', 'Friend'];

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  editingContact,
  onSave,
  isLoading,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (editingContact) {
      setValue('name', editingContact.name);
      setValue('company', editingContact.company || '');
      setValue('email', editingContact.email || '');
      setValue('phone', editingContact.phone || '');
      setValue('favorite', editingContact.favorite);
      setSelectedTags(editingContact.tags || []);
    } else {
      reset({ name: '', company: '', email: '', phone: '', favorite: false });
      setSelectedTags([]);
    }
  }, [editingContact, setValue, reset, isOpen]);

  const handleClose = () => {
    reset();
    setSelectedTags([]);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = (data: ContactFormValues) => {
    onSave({ ...data, tags: selectedTags });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingContact ? 'Modify Contact Node' : 'Initialize New Contact'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Contact Full Name"
          placeholder="Alice Cooper"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Company / Organization"
          placeholder="Acme Corp"
          error={errors.company?.message}
          {...register('company')}
        />
        <Input
          label="Email Address"
          placeholder="alice@gmail.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone Connection"
          placeholder="+1 (555) 019-2834"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Contact Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 border border-slate-200/50 dark:border-slate-800 p-3 rounded-xl mt-2">
          <input
            type="checkbox"
            id="favorite"
            className="accent-primary-600 rounded"
            {...register('favorite')}
          />
          <label htmlFor="favorite" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
            Bookmark as Starred Favorite
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4 dark:border-slate-800/60">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
          >
            {editingContact ? 'Apply Changes' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
