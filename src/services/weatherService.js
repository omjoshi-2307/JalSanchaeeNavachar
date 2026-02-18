import axios from 'axios';

const DEFAULT_LOCATION = { lat: 16.85, lon: 74.58 }; // Sangli, Maharashtra

export const weatherService = {
  getLocation: () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(DEFAULT_LOCATION);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          resolve(DEFAULT_LOCATION);
        }
      );
    });
  },

  getWeatherData: async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
          daily: 'precipitation_sum,temperature_2m_max,wind_speed_10m_max',
          hourly: 'relative_humidity_2m',
          timezone: 'auto'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
};
