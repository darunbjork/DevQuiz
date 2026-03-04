import { authApi } from './authApi';
import { API_BASE_URL } from '../config/api';

// Extend RequestInit to include our custom _retry property
interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
  headers?: HeadersInit | Record<string, string>; // More explicit type for headers
}

// These will be configured by the AuthContextProvider
let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((token: string | null) => void) | null = null;
let onLogout: (() => void) | null = null;

export const apiClient = {
  // Function to configure the auth-related callbacks from AuthContextProvider
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
    options: CustomRequestInit = {}, // Use CustomRequestInit here
  ): Promise<Response> => {
    // Store original request to retry, ensuring options is CustomRequestInit
    const originalRequest: { endpoint: string; options: CustomRequestInit } = { endpoint, options }; 

    if (!getAccessToken || !setAccessToken || !onLogout) {
      throw new Error('apiClient not configured with authentication callbacks.');
    }

    const token = getAccessToken();

    // Prepare headers, ensuring they are a mutable object
    const requestHeaders = new Headers(options.headers as HeadersInit);

    // Attach token if available
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
    
    // Apply the prepared headers back to options
    options.headers = requestHeaders;

    // Always include credentials for cookie handling (refresh token)
    options.credentials = 'include';

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, options);

      if (response.status === 401 && !options._retry) {
        // If 401 and not already retrying, attempt to refresh token
        options._retry = true; // Mark as retried to prevent infinite loops

        try {
          const { accessToken: newAccessToken } = await authApi.refreshAccessToken();
          setAccessToken(newAccessToken); // Update token in AuthContextProvider state

          // Create new headers for the retried request with the new token
          const retriedHeaders = new Headers(originalRequest.options.headers as HeadersInit);
          retriedHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          originalRequest.options.headers = retriedHeaders;

          // Retry the original request with the new token
          response = await fetch(`${API_BASE_URL}${originalRequest.endpoint}`, originalRequest.options);
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          onLogout(); // Refresh failed, force logout
          // Re-throw to propagate the 401 error or just let the response be returned
          throw refreshError; // This will make the outer catch block handle it
        }
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      // If the error was from a failed token refresh, onLogout would have already been called
      // For other network errors, re-throw
      throw error;
    }
  },
};
