import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ticketsApi = {
  // Get all tickets with optional filters
  getTickets: (params = {}) => api.get('/tickets', { params }),

  // Get specific ticket
  getTicket: (id) => api.get(`/tickets/${id}`),

  // Create new ticket
  createTicket: (ticketData) => api.post('/tickets', ticketData),

  // Update ticket status
  updateTicketStatus: (id, status) => api.put(`/tickets/${id}/status`, { status }),

  // Update ticket
  updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),

  // Assign ticket to agent
  assignTicket: (id, assignedToId) => api.put(`/tickets/${id}/assign`, { assigned_to_id: assignedToId }),

  // Get ticket comments
  getTicketComments: (id) => api.get(`/tickets/${id}/comments`),

  // Add comment to ticket
  addComment: (id, commentData) => api.post(`/tickets/${id}/comments`, commentData),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;