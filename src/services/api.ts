// Mock API service using localStorage
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getContactsFromStorage = (): any[] => {
  const data = localStorage.getItem('contacts');
  if (!data) return [];
  return JSON.parse(data);
};

const saveContactsToStorage = (contacts: any[]) => {
  localStorage.setItem('contacts', JSON.stringify(contacts));
};

const api = {
  get: async (url: string, config?: any) => {
    await delay(300);
    if (url === '/contacts') {
      let contacts = getContactsFromStorage();
      const { search, favorite, page = 1, limit = 6 } = config?.params || {};
      
      if (search) {
        const lowerSearch = search.toLowerCase();
        contacts = contacts.filter((c: any) => 
          c.name.toLowerCase().includes(lowerSearch) ||
          (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
          (c.phone && c.phone.toLowerCase().includes(lowerSearch))
        );
      }

      if (favorite === 'true') {
        contacts = contacts.filter((c: any) => c.favorite);
      }

      const total = contacts.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginated = contacts.slice(start, start + limit);

      return {
        data: {
          contacts: paginated,
          pagination: { total, totalPages, page, limit }
        }
      };
    }
    return { data: {} };
  },
  post: async (url: string, data: any) => {
    await delay(300);
    if (url === '/contacts') {
      const contacts = getContactsFromStorage();
      const newContact = {
        ...data,
        id: Date.now()
      };
      // Insert at the beginning so newer ones show up first
      contacts.unshift(newContact);
      saveContactsToStorage(contacts);
      return { data: newContact };
    }
  },
  put: async (url: string, data: any) => {
    await delay(300);
    if (url.startsWith('/contacts/')) {
      const id = parseInt(url.split('/').pop() || '0');
      let contacts = getContactsFromStorage();
      const index = contacts.findIndex(c => c.id === id);
      if (index > -1) {
        contacts[index] = { ...contacts[index], ...data };
        saveContactsToStorage(contacts);
        return { data: contacts[index] };
      }
      return Promise.reject({ response: { data: { message: 'Not found' } } });
    }
  },
  delete: async (url: string) => {
    await delay(300);
    if (url.startsWith('/contacts/')) {
      const id = parseInt(url.split('/').pop() || '0');
      let contacts = getContactsFromStorage();
      contacts = contacts.filter(c => c.id !== id);
      saveContactsToStorage(contacts);
      return { data: { success: true } };
    }
  },
  patch: async (url: string) => {
    await delay(300);
    if (url.includes('/favorite')) {
      const id = parseInt(url.split('/')[2] || '0');
      let contacts = getContactsFromStorage();
      const index = contacts.findIndex(c => c.id === id);
      if (index > -1) {
        contacts[index].favorite = !contacts[index].favorite;
        saveContactsToStorage(contacts);
        return { data: contacts[index] };
      }
      return Promise.reject({ response: { data: { message: 'Not found' } } });
    }
  }
};

export default api;
