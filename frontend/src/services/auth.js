import api from './api';

const TOKEN_KEY = 'tickkk_token';
const USER_KEY = 'tickkk_user';

class AuthService {
  /**
   * Login user and store token
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Set token in api service
      this.setAuthToken(token);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.setAuthToken(null);
  }

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Set auth token in API headers
   */
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Initialize auth on app load
   */
  init() {
    const token = this.getToken();
    if (token) {
      this.setAuthToken(token);
    }
  }

  /**
   * Verify token is still valid
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/me');
      return { success: true, user: response.data };
    } catch (error) {
      // Token is invalid, clear it
      this.logout();
      return { success: false };
    }
  }

  /**
   * Get all agents
   */
  async getAgents() {
    try {
      const response = await api.get('/auth/agents');
      return response.data;
    } catch (error) {
      console.error('Error getting agents:', error);
      return [];
    }
  }
}

export default new AuthService();
