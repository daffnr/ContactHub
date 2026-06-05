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

const getActivitiesFromStorage = (): any[] => {
  const data = localStorage.getItem('activities');
  if (!data) return [];
  return JSON.parse(data);
};

const saveActivity = (type: string, contactId: number, contactName: string) => {
  const activities = getActivitiesFromStorage();
  const newActivity = {
    id: Date.now(),
    type,
    contactId,
    contactName,
    date: new Date().toISOString()
  };
  activities.unshift(newActivity);
  // keep only last 50 activities to save space
  localStorage.setItem('activities', JSON.stringify(activities.slice(0, 50)));
};

const api = {
  get: async (url: string, config?: any) => {
    await delay(300);
    if (url === '/contacts') {
      let contacts = getContactsFromStorage();
      const { search, favorite, tags, page = 1, limit = 6 } = config?.params || {};
      
      if (search) {
        const lowerSearch = search.toLowerCase();
        contacts = contacts.filter((c: any) => 
          c.name.toLowerCase().includes(lowerSearch) ||
          (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
          (c.phone && c.phone.toLowerCase().includes(lowerSearch)) ||
          (c.company && c.company.toLowerCase().includes(lowerSearch))
        );
      }

      if (favorite === 'true') {
        contacts = contacts.filter((c: any) => c.favorite);
      }

      if (tags) {
        // tags could be a comma-separated string or array
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
        if (tagsArray.length > 0) {
          contacts = contacts.filter((c: any) => 
            c.tags && c.tags.some((tag: string) => tagsArray.includes(tag))
          );
        }
      }

      const total = contacts.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginated = contacts.slice(start, start + limit);

      return {
        data: {
          contacts: paginated,
          pagination: { total, totalPages, page, limit },
          stats: {
            totalContacts: getContactsFromStorage().length,
            totalFavorites: getContactsFromStorage().filter((c:any) => c.favorite).length,
            totalCompanies: new Set(getContactsFromStorage().map((c:any) => c.company).filter(Boolean)).size,
          }
        }
      };
    }
    if (url === '/activities') {
      return { data: getActivitiesFromStorage().slice(0, 5) };
    }
    return { data: {} };
  },
  post: async (url: string, data: any) => {
    await delay(300);
    if (url === '/contacts') {
      const contacts = getContactsFromStorage();
      const newContact = {
        ...data,
        company: data.company || null,
        tags: data.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: Date.now()
      };
      // Insert at the beginning so newer ones show up first
      contacts.unshift(newContact);
      saveContactsToStorage(contacts);
      saveActivity('CREATED', newContact.id, newContact.name);
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
        contacts[index] = { 
          ...contacts[index], 
          ...data,
          company: data.company || null,
          tags: data.tags || [],
          updatedAt: new Date().toISOString()
        };
        saveContactsToStorage(contacts);
        saveActivity('UPDATED', id, contacts[index].name);
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
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        contacts = contacts.filter(c => c.id !== id);
        saveContactsToStorage(contacts);
        saveActivity('DELETED', id, contact.name);
      }
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
        contacts[index].updatedAt = new Date().toISOString();
        saveContactsToStorage(contacts);
        saveActivity(contacts[index].favorite ? 'FAVORITED' : 'UNFAVORITED', id, contacts[index].name);
        return { data: contacts[index] };
      }
      return Promise.reject({ response: { data: { message: 'Not found' } } });
    }
  }
};

export default api;
