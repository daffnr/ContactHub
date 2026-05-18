import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ContactSkeleton } from '../components/Skeleton';
import {
  Search,
  Plus,
  LogOut,
  Star,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Users,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone must be at least 5 characters').optional().or(z.literal('')),
  favorite: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  favorite: boolean;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Theme
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // State Management
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);

  // Fetch Contacts
  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', debouncedSearch, filterFavorite, page],
    queryFn: async () => {
      const res = await api.get('/contacts', {
        params: {
          search: debouncedSearch,
          favorite: filterFavorite ? 'true' : 'false',
          page,
          limit: 6,
        },
      });
      return res.data;
    },
  });

  // Setup form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  // Populate form if editing
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newContact: ContactFormValues) => api.post('/contacts', newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      showToast('success', 'Contact created successfully!');
      setIsContactModalOpen(false);
      reset();
    },
    onError: (err: any) => {
      showToast('error', err.response?.data?.message || 'Failed to create contact.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactFormValues }) =>
      api.put(`/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      showToast('success', 'Contact updated successfully!');
      setIsContactModalOpen(false);
      setEditingContact(null);
      reset();
    },
    onError: (err: any) => {
      showToast('error', err.response?.data?.message || 'Failed to update contact.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      showToast('success', 'Contact deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingContactId(null);
    },
    onError: (err: any) => {
      showToast('error', err.response?.data?.message || 'Failed to delete contact.');
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/contacts/${id}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      showToast('error', 'Failed to toggle favorite.');
    },
  });

  // Event Handlers
  const handleSaveContact = (formData: ContactFormValues) => {
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingContactId(id);
    setIsDeleteModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

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
      <aside
        className={`fixed inset-y-0 left-0 w-64 glass z-40 flex flex-col border-r border-slate-200/50 dark:border-slate-800/40 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 shadow flex items-center justify-center text-white font-extrabold text-sm">
              C
            </div>
            <span className="font-bold text-slate-950 dark:text-slate-50 tracking-tight">ContactHub</span>
          </div>
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

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/30 dark:bg-slate-900/40">
            <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 flex items-center justify-center text-xs font-bold shrink-0">
              {user ? getInitials(user.name) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg shrink-0 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
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
            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            {/* Add Contact Button */}
            <Button onClick={() => { setEditingContact(null); setIsContactModalOpen(true); }} size="sm">
              <Plus size={16} className="mr-1" /> Add Contact
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Contacts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ContactSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="glass-card p-12 text-center text-rose-500 flex flex-col items-center gap-3">
              <p className="font-semibold text-lg">Error loading contacts</p>
              <p className="text-sm opacity-80">Check server connection and refresh.</p>
            </div>
          ) : data?.contacts.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 glass-card p-12 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-500">
                <Compass size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No contacts discovered</h3>
                <p className="text-sm text-slate-400 mt-1 dark:text-slate-500 max-w-sm">
                  {search || filterFavorite
                    ? 'No records match your active search filters. Try refining your queries.'
                    : "You haven't archived any contacts yet. Begin adding data points to populate your SaaS dashboard."}
                </p>
              </div>
              {!(search || filterFavorite) && (
                <Button onClick={() => { setEditingContact(null); setIsContactModalOpen(true); }} size="sm">
                  Create First Contact
                </Button>
              )}
            </motion.div>
          ) : (
            /* Contact list */
            <div className="flex-1 flex flex-col gap-6">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {data?.contacts.map((contact: Contact) => (
                    <motion.div
                      key={contact.id}
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

                        {/* Favorite button */}
                        <button
                          onClick={() => favoriteMutation.mutate(contact.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            contact.favorite
                              ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/40'
                              : 'bg-transparent border-slate-100 text-slate-300 hover:text-slate-400 dark:border-slate-900 hover:bg-slate-900'
                          }`}
                        >
                          <Star size={14} fill={contact.favorite ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Detail list */}
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

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-900">
                        <button
                          onClick={() => handleOpenEdit(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(contact.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-900">
                  <span className="text-xs text-slate-400">
                    Showing {(page - 1) * 6 + 1} -{' '}
                    {Math.min(page * 6, data.pagination.total)} of{' '}
                    {data.pagination.total} contacts
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {[...Array(data.pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors ${
                          page === i + 1
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page === data.pagination.totalPages}
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, data.pagination.totalPages))
                      }
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT CONTACT MODAL */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => { setIsContactModalOpen(false); setEditingContact(null); reset(); }}
        title={editingContact ? 'Modify Contact Node' : 'Initialize New Contact'}
      >
        <form onSubmit={handleSubmit(handleSaveContact)} className="flex flex-col gap-4">
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
              onClick={() => { setIsContactModalOpen(false); setEditingContact(null); reset(); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingContact ? 'Apply Changes' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingContactId(null); }}
        title="Destroy Contact Data"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you absolutely sure you want to delete this contact? This action is irreversible and all matching telemetry database links will be purged.
          </p>
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-850">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setIsDeleteModalOpen(false); setDeletingContactId(null); }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => deletingContactId && deleteMutation.mutate(deletingContactId)}
            >
              Confirm Purge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
