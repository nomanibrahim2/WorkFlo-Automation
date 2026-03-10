const WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=32.78&longitude=-96.80&current_weather=true';

/**
 * Fetch current weather data from Open-Meteo.
 * @returns {Promise<Object>} Parsed weather data
 */
export const fetchWeather = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(WEATHER_API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.current_weather) {
      throw new Error('Invalid weather data received.');
    }

    return {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      weathercode: data.current_weather.weathercode,
      time: data.current_weather.time,
      unit: data.current_weather_units?.temperature || '°C',
    };
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Weather API request timed out.');
    }
    throw error;
  }
};
