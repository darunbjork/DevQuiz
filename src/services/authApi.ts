import { API_BASE_URL } from '../config/api';

interface RefreshResponse {
  accessToken: string;
}

export const authApi = {
  refreshAccessToken: async (): Promise<RefreshResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Crucial: Ensures HTTP-only refresh token cookie is sent
    });

    if (!response.ok) {
      // If refresh token fails (e.g., expired or invalid), it will return 401
      // The caller (apiClient) will handle logging out the user in this case.
      throw new Error('Failed to refresh access token');
    }

    const data: { token: string } = await response.json();
    return { accessToken: data.token };
  },
};
