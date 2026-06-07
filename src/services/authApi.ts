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
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data: { token: string } = await response.json();
    return { accessToken: data.token };
  },
};
