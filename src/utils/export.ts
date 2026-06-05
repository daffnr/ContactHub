import { Contact } from '../components/molecules/ContactCard';

export const exportToCSV = (contacts: Contact[]) => {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Tags', 'Favorite', 'Created At'];
  
  const csvRows = contacts.map(contact => {
    return [
      `"${contact.name || ''}"`,
      `"${contact.email || ''}"`,
      `"${contact.phone || ''}"`,
      `"${contact.company || ''}"`,
      `"${(contact.tags || []).join(', ')}"`,
      contact.favorite ? 'Yes' : 'No',
      `"${contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
