import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../molecules/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Contact } from '../molecules/ContactCard';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone must be at least 5 characters').optional().or(z.literal('')),
  favorite: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingContact: Contact | null;
  onSave: (data: ContactFormValues) => void;
  isLoading: boolean;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  editingContact,
  onSave,
  isLoading,
}) => {
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
      setValue('email', editingContact.email || '');
      setValue('phone', editingContact.phone || '');
      setValue('favorite', editingContact.favorite);
    } else {
      reset({ name: '', email: '', phone: '', favorite: false });
    }
  }, [editingContact, setValue, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingContact ? 'Modify Contact Node' : 'Initialize New Contact'}
    >
      <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
        <Input
          label="Contact Full Name"
          placeholder="Alice Cooper"
          error={errors.name?.message}
          {...register('name')}
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

        <div className="flex items-center gap-2 border border-slate-200/50 dark:border-slate-800 p-3 rounded-xl">
          <input
            type="checkbox"
            id="favorite"
            className="accent-primary-600 rounded"
            {...register('favorite')}
          />
          <label htmlFor="favorite" className="text-xs font-bold text-slate-500 dark:text-slate-400">
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
