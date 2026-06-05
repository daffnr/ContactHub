import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { ContactSkeleton } from '../components/atoms/Skeleton';
import { Button } from '../components/atoms/Button';
import { ContactCard, Contact } from '../components/molecules/ContactCard';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { ContactFormModal } from '../components/organisms/ContactFormModal';
import { ConfirmDeleteModal } from '../components/organisms/ConfirmDeleteModal';
import { DashboardTemplate } from '../components/templates/DashboardTemplate';
import { Search, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newContact: any) => api.post('/contacts', newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      showToast('success', 'Contact created successfully!');
      setIsContactModalOpen(false);
    },
    onError: (err: any) => {
      showToast('error', err.response?.data?.message || 'Failed to create contact.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      showToast('success', 'Contact updated successfully!');
      setIsContactModalOpen(false);
      setEditingContact(null);
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

  // Handlers
  const handleSaveContact = (formData: any) => {
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

  // Render Parts
  const renderToolbar = () => (
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
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <ContactSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="glass-card p-12 text-center text-rose-500 flex flex-col items-center gap-3">
          <p className="font-semibold text-lg">Error loading contacts</p>
          <p className="text-sm opacity-80">Check server connection and refresh.</p>
        </div>
      );
    }

    if (!data?.contacts || data.contacts.length === 0) {
      return (
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
      );
    }

    return (
      <div className="flex-1 flex flex-col gap-6">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {data?.contacts?.map((contact: Contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onFavorite={(id) => favoriteMutation.mutate(id)}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
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
    );
  };

  return (
    <>
      <DashboardTemplate
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebar={
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            filterFavorite={filterFavorite}
            setFilterFavorite={setFilterFavorite}
            setPage={setPage}
          />
        }
        header={
          <Header
            setIsSidebarOpen={setIsSidebarOpen}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onAddContact={() => { setEditingContact(null); setIsContactModalOpen(true); }}
          />
        }
        toolbar={renderToolbar()}
        content={renderContent()}
      />

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => { setIsContactModalOpen(false); setEditingContact(null); }}
        editingContact={editingContact}
        onSave={handleSaveContact}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingContactId(null); }}
        onConfirm={() => deletingContactId && deleteMutation.mutate(deletingContactId)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};
