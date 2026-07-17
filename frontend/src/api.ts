export const API_BASE_URL = 'http://localhost:8000';

export interface ShortenResponse {
  short_url: string;
}

export interface ClicksByDate {
  date: string;
  clicks: number;
}

export interface TopCountry {
  country: string;
  clicks: number;
}

export interface TopDevice {
  device: string;
  clicks: number;
}

export interface AnalyticsResponse {
  total_clicks: number;
  clicks_over_time: ClicksByDate[];
  top_countries: TopCountry[];
  top_devices: TopDevice[];
}

export const shortenUrl = async (longUrl: string): Promise<ShortenResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ long_url: longUrl }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to shorten URL');
  }
  
  return response.json();
};

export const getAnalytics = async (shortCode: string): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/${shortCode}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  
  return response.json();
};
