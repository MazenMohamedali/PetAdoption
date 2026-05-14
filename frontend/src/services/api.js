// API Service - Centralized HTTP request handler
// NOTE: During development we proxy `/api` to the backend via Vite (see vite.config.js).
// In production the app is served by Nginx which proxies `/api` to the backend.
// Use build-time/env variable or default to relative path (same-origin) so browser requests go to Nginx.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Generic API call function
 * Handles authentication, headers, and error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  // Build request configuration
  const headers = {
    ...(options.headers || {}),
    // Add Authorization header if token exists
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Only add Content-Type when we have a JSON body to send
  if (options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  // Add body if provided (for POST, PUT, etc.)
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Debug logging to help diagnose network/CORS issues
  console.debug('API Request ->', {
    url,
    method: (config.method || 'GET').toUpperCase(),
    headers: config.headers,
  });

  try {
    const response = await fetch(url, config);
    
    // Parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Check if response is ok
    if (!response.ok) {
      // Handle different error scenarios
      let errorMessage = data?.message || data?.error;
      
      // If error is an object (validation errors), extract the message
      if (typeof errorMessage === 'object' && errorMessage !== null) {
        // Try to get first error message from object
        const firstError = Object.values(errorMessage)[0];
        errorMessage = typeof firstError === 'string' ? firstError : JSON.stringify(errorMessage);
      }
      
      // If still no message, use status text
      if (!errorMessage) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      // Create error object with full details
      const error = new Error(errorMessage);
      error.response = data;
      error.status = response.status;
      console.error('API Response Error ->', { url, status: response.status, body: data });
      throw error;
    }
    
    return data;
  } catch (error) {
    // Network errors (e.g., failed to fetch, CORS) are often TypeError
    if (error instanceof TypeError) {
      console.error('Network/API Fetch failed:', { url, message: error.message });
      throw new Error('NetworkError when attempting to fetch resource: ' + error.message);
    }

    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION APIs ====================

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { username, email, password, fullName, etc. }
   */
  register: async (userData) => {
    return apiCall('/api/v1/auth/register', {
      method: 'POST',
      body: userData,
    });
  },
  
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   */
  login: async (credentials) => {
    return apiCall('/api/v1/auth/authenticate', {
      method: 'POST',
      body: credentials,
    });
  },
};

// ==================== GAME APIs ====================

export const gameAPI = {
  /**
   * Get all games
   */
  getAllGames: async () => {
    return apiCall('/api/v1/games/all');
  },
  
  /**
   * Get game by name
   * @param {String} name - Game name
   */
  getGameByName: async (name) => {
    return apiCall(`/api/v1/games/${name}`);
  },
  
  /**
   * Add a new game (Admin only)
   * @param {Object} gameData - { name, players, pictureUrl, modes }
   */
  addGame: async (gameData) => {
    return apiCall('/api/v1/games/add', {
      method: 'POST',
      body: gameData,
    });
  },
  
  /**
   * Update a game (Admin only)
   * @param {String} name - Game name
   * @param {Object} gameData - { name, players, pictureUrl, modes }
   */
  updateGame: async (name, gameData) => {
    return apiCall(`/api/v1/games/${name}`, {
      method: 'PUT',
      body: gameData,
    });
  },
  
  /**
   * Delete a game (Admin only)
   * @param {String} name - Game name
   */
  deleteGame: async (name) => {
    return apiCall(`/api/v1/games/${name}`, {
      method: 'DELETE',
    });
  },
};

// ==================== POST APIs ====================

export const postAPI = {
  /**
   * Get all posts
   */
  getAllPosts: async () => {
    return apiCall('/api/v1/posts/all');
  },
  
  /**
   * Get post by ID
   * @param {Number} id - Post ID
   */
  getPostById: async (id) => {
    return apiCall(`/api/v1/posts/${id}`);
  },
  
  /**
   * Create a new post
   * @param {Object} postData - { title, description, teamSize, gameId }
   */
  createPost: async (postData) => {
    return apiCall('/api/v1/posts', {
      method: 'POST',
      body: postData,
    });
  },
  
  /**
   * Delete a post
   * @param {Number} id - Post ID
   */
  deletePost: async (id) => {
    return apiCall(`/api/v1/posts/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Join a post
   * @param {Number} id - Post ID
   */
  joinPost: async (id) => {
    return apiCall(`/api/v1/posts/${id}/join`, {
      method: 'POST',
    });
  },
  
  /**
   * Cancel/Leave a post
   * @param {Number} id - Post ID
   */
  cancelJoin: async (id) => {
    return apiCall(`/api/v1/posts/${id}/cancel-join`, {
      method: 'POST',
    });
  },
};

// ==================== USER APIs (Admin) ====================

export const userAPI = {
  /**
   * Get all users (Admin only)
   */
  getAllUsers: async () => {
    return apiCall('/api/v1/admin/users');
  },
  
  /**
   * Delete a user (Admin only)
   * @param {Number} id - User ID
   */
  deleteUser: async (id) => {
    return apiCall(`/api/v1/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Make user an admin (Admin only)
   * @param {Number} id - User ID
   */
  makeAdmin: async (id) => {
    return apiCall(`/api/v1/admin/users/${id}/make-admin`, {
      method: 'POST',
    });
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Logout user (remove token)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

