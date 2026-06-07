import { authApi } from './authApi';
import { API_BASE_URL } from '../config/api';

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
  headers?: HeadersInit | Record<string, string>; 
}

let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((token: string | null) => void) | null = null;
let onLogout: (() => void) | null = null;

export const apiClient = {
  configureAuth: (
    getAuthToken: () => string | null,
    setAuthToken: (token: string | null) => void,
    logoutCb: () => void,
  ) => {
    getAccessToken = getAuthToken;
    setAccessToken = setAuthToken;
    onLogout = logoutCb;
  },

  fetchWithAuth: async (
    endpoint: string,
    options: CustomRequestInit = {}, 
  ): Promise<Response> => {
    const originalRequest: { endpoint: string; options: CustomRequestInit } = { endpoint, options }; 

    if (!getAccessToken || !setAccessToken || !onLogout) {
      throw new Error('apiClient not configured with authentication callbacks.');
    }

    const token = getAccessToken();

    const requestHeaders = new Headers(options.headers as HeadersInit);

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
    
    options.headers = requestHeaders;

    options.credentials = 'include';

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, options);

      if (response.status === 401 && !options._retry) {
        options._retry = true; 

        try {
          const { accessToken: newAccessToken } = await authApi.refreshAccessToken();
          setAccessToken(newAccessToken); 

          const retriedHeaders = new Headers(originalRequest.options.headers as HeadersInit);
          retriedHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          originalRequest.options.headers = retriedHeaders;

          response = await fetch(`${API_BASE_URL}${originalRequest.endpoint}`, originalRequest.options);
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          onLogout();
          throw refreshError; 
        }
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  },
};
